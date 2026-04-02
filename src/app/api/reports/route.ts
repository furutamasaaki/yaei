import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/reports — リアルタイム状況報告一覧（campsite_id必須）
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const campsiteId = searchParams.get("campsite_id");
  if (!campsiteId) {
    return NextResponse.json({ error: "campsite_id は必須です" }, { status: 400 });
  }

  const activeOnly = searchParams.get("active_only") !== "false";

  let query = supabase
    .from("realtime_reports")
    .select("*, users(display_name, avatar_url)")
    .eq("campsite_id", campsiteId)
    .order("created_at", { ascending: false });

  if (activeOnly) {
    query = query
      .eq("is_active", true)
      .gte("expires_at", new Date().toISOString());
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data || [] });
}

// POST /api/reports — リアルタイム状況投稿
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await request.json();

  // report_typeに応じた有効期限を自動設定
  const expiryHours: Record<string, number> = {
    road_condition: 168, // 7日
    crowding: 24,
    weather: 48,
    facility: 336, // 14日
    signal: 720, // 30日
    wildlife: 72, // 3日
    other: 48,
  };

  const hours = expiryHours[body.report_type] || 48;
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("realtime_reports")
    .insert({
      ...body,
      user_id: user.id,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
