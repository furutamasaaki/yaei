import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/spots/[id] — スポット詳細取得（slugまたはid）
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // slugかuuidかで検索方法を変える
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id);

  let query = supabase
    .from("campsites")
    .select(`
      *,
      campsite_attributes(*),
      reviews(*, users(display_name, avatar_url)),
      realtime_reports(*)
    `);

  if (isUuid) {
    query = query.eq("id", id);
  } else {
    query = query.eq("slug", id);
  }

  const { data, error } = await query.single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "スポットが見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// PATCH /api/spots/[id] — スポット更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();
  const { attributes, ...campsiteData } = body;

  if (Object.keys(campsiteData).length > 0) {
    const { error } = await supabase
      .from("campsites")
      .update(campsiteData)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  if (attributes) {
    const { error } = await supabase
      .from("campsite_attributes")
      .upsert({
        ...attributes,
        campsite_id: id,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const { data, error: fetchError } = await supabase
    .from("campsites")
    .select("*, campsite_attributes(*)")
    .eq("id", id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// DELETE /api/spots/[id] — スポット削除（adminのみ）
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { error } = await supabase.from("campsites").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "削除しました" });
}
