import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/spots — スポット一覧取得
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = (page - 1) * limit;
  const prefecture = searchParams.get("prefecture");
  const type = searchParams.get("type");
  const isFree = searchParams.get("is_free");
  const sort = searchParams.get("sort") || "created_at";
  const order = searchParams.get("order") === "asc" ? true : false;

  let query = supabase
    .from("campsites")
    .select("*, campsite_attributes(*)", { count: "exact" })
    .eq("status", "active");

  if (prefecture) {
    query = query.eq("prefecture", prefecture);
  }
  if (type) {
    query = query.eq("campsite_type", type);
  }
  if (isFree === "true") {
    query = query.eq("is_free", true);
  }

  const validSorts = ["created_at", "name", "elevation_m"];
  const sortColumn = validSorts.includes(sort) ? sort : "created_at";

  query = query.order(sortColumn, { ascending: order }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: count ? Math.ceil(count / limit) : 0,
    },
  });
}

// POST /api/spots — 新規スポット登録
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();

  const { attributes, ...campsiteData } = body;

  const { data: campsite, error: campsiteError } = await supabase
    .from("campsites")
    .insert({
      ...campsiteData,
      created_by: user.id,
    })
    .select()
    .single();

  if (campsiteError) {
    return NextResponse.json({ error: campsiteError.message }, { status: 500 });
  }

  if (attributes) {
    const { error: attrError } = await supabase
      .from("campsite_attributes")
      .insert({
        ...attributes,
        campsite_id: campsite.id,
      });

    if (attrError) {
      return NextResponse.json({ error: attrError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ data: campsite }, { status: 201 });
}
