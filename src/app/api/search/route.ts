import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/search — 検索API（テキスト検索 + フィルター + 地理空間クエリ）
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = (page - 1) * limit;

  // 地理空間パラメータ（地図の表示範囲で絞り込み）
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius"); // km
  const bounds = searchParams.get("bounds"); // sw_lat,sw_lng,ne_lat,ne_lng

  // フィルターパラメータ
  const prefecture = searchParams.get("prefecture");
  const type = searchParams.get("type");
  const isFree = searchParams.get("is_free");
  const directFire = searchParams.get("direct_fire");
  const hammock = searchParams.get("hammock");
  const carAccess = searchParams.get("car_access");
  const soloFriendly = searchParams.get("solo_friendly");
  const petAllowed = searchParams.get("pet_allowed");
  const sort = searchParams.get("sort") || "relevance";

  // bounds検索（地図範囲内のスポットを取得）の場合はRPCを使用
  if (bounds) {
    const [swLat, swLng, neLat, neLng] = bounds.split(",").map(Number);

    const { data, error, count } = await supabase
      .rpc("search_campsites_in_bounds", {
        sw_lat: swLat,
        sw_lng: swLng,
        ne_lat: neLat,
        ne_lng: neLng,
        search_query: q || null,
        filter_prefecture: prefecture || null,
        filter_type: type || null,
        filter_is_free: isFree === "true" ? true : null,
        filter_direct_fire: directFire || null,
        filter_solo_friendly: soloFriendly === "true" ? true : null,
        p_limit: limit,
        p_offset: offset,
      })
      .select("*");

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

  // 半径検索の場合
  if (lat && lng && radius) {
    const { data, error } = await supabase.rpc("search_campsites_nearby", {
      user_lat: parseFloat(lat),
      user_lng: parseFloat(lng),
      radius_km: parseFloat(radius),
      search_query: q || null,
      filter_prefecture: prefecture || null,
      filter_type: type || null,
      filter_is_free: isFree === "true" ? true : null,
      p_limit: limit,
      p_offset: offset,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: data || [],
      pagination: { page, limit, total: data?.length || 0, totalPages: 1 },
    });
  }

  // 通常の検索（フィルター + テキスト）
  let query = supabase
    .from("campsites")
    .select("*, campsite_attributes!inner(*)", { count: "exact" })
    .eq("status", "active");

  if (q) {
    query = query.or(`name.ilike.%${q}%,name_kana.ilike.%${q}%,prefecture.ilike.%${q}%,city.ilike.%${q}%`);
  }
  if (prefecture) query = query.eq("prefecture", prefecture);
  if (type) query = query.eq("campsite_type", type);
  if (isFree === "true") query = query.eq("is_free", true);
  if (directFire) query = query.eq("campsite_attributes.direct_fire", directFire);
  if (hammock) query = query.eq("campsite_attributes.hammock", hammock);
  if (carAccess) query = query.eq("campsite_attributes.car_access", carAccess);
  if (soloFriendly === "true") query = query.eq("campsite_attributes.solo_friendly", true);
  if (petAllowed === "true") query = query.eq("campsite_attributes.pet_allowed", true);

  // ソート
  if (sort === "name") {
    query = query.order("name", { ascending: true });
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
      total: data?.length || 0,
      totalPages: 1,
    },
  });
}
