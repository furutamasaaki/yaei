import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/reviews — レビュー一覧（campsite_id必須）
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const campsiteId = searchParams.get("campsite_id");
  if (!campsiteId) {
    return NextResponse.json({ error: "campsite_id は必須です" }, { status: 400 });
  }

  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
  const offset = (page - 1) * limit;
  const sort = searchParams.get("sort") || "created_at";

  let query = supabase
    .from("reviews")
    .select("*, users(display_name, avatar_url)", { count: "exact" })
    .eq("campsite_id", campsiteId);

  if (sort === "rating") {
    query = query.order("rating", { ascending: false });
  } else if (sort === "helpful") {
    query = query.order("helpful_count", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: count ? Math.ceil(count / limit) : 0,
    },
  });
}

// POST /api/reviews — レビュー投稿
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      ...body,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
