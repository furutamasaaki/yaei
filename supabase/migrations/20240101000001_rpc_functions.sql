-- ====================
-- 地図範囲内のスポット検索（bounds検索）
-- ====================
CREATE OR REPLACE FUNCTION search_campsites_in_bounds(
  sw_lat float8,
  sw_lng float8,
  ne_lat float8,
  ne_lng float8,
  search_query text DEFAULT NULL,
  filter_prefecture text DEFAULT NULL,
  filter_type text DEFAULT NULL,
  filter_is_free boolean DEFAULT NULL,
  filter_direct_fire text DEFAULT NULL,
  filter_solo_friendly boolean DEFAULT NULL,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  latitude float8,
  longitude float8,
  prefecture text,
  city text,
  campsite_type campsite_type,
  is_free boolean,
  price_range text,
  status campsite_status,
  elevation_m integer,
  direct_fire direct_fire_type,
  solo_friendly boolean,
  rating_avg numeric,
  review_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.slug,
    c.latitude,
    c.longitude,
    c.prefecture,
    c.city,
    c.campsite_type,
    c.is_free,
    c.price_range,
    c.status,
    c.elevation_m,
    COALESCE(ca.direct_fire, 'unknown'::direct_fire_type),
    COALESCE(ca.solo_friendly, false),
    COALESCE(AVG(r.rating), 0)::numeric AS rating_avg,
    COUNT(r.id) AS review_count
  FROM campsites c
  LEFT JOIN campsite_attributes ca ON ca.campsite_id = c.id
  LEFT JOIN reviews r ON r.campsite_id = c.id
  WHERE c.status = 'active'
    AND c.latitude BETWEEN sw_lat AND ne_lat
    AND c.longitude BETWEEN sw_lng AND ne_lng
    AND (search_query IS NULL OR (
      c.name ILIKE '%' || search_query || '%'
      OR c.name_kana ILIKE '%' || search_query || '%'
      OR c.prefecture ILIKE '%' || search_query || '%'
      OR c.city ILIKE '%' || search_query || '%'
    ))
    AND (filter_prefecture IS NULL OR c.prefecture = filter_prefecture)
    AND (filter_type IS NULL OR c.campsite_type = filter_type::campsite_type)
    AND (filter_is_free IS NULL OR c.is_free = filter_is_free)
    AND (filter_direct_fire IS NULL OR ca.direct_fire = filter_direct_fire::direct_fire_type)
    AND (filter_solo_friendly IS NULL OR ca.solo_friendly = filter_solo_friendly)
  GROUP BY c.id, c.name, c.slug, c.latitude, c.longitude, c.prefecture, c.city,
           c.campsite_type, c.is_free, c.price_range, c.status, c.elevation_m,
           ca.direct_fire, ca.solo_friendly
  ORDER BY c.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- ====================
-- 近隣スポット検索（半径検索）
-- ====================
CREATE OR REPLACE FUNCTION search_campsites_nearby(
  user_lat float8,
  user_lng float8,
  radius_km float8 DEFAULT 50,
  search_query text DEFAULT NULL,
  filter_prefecture text DEFAULT NULL,
  filter_type text DEFAULT NULL,
  filter_is_free boolean DEFAULT NULL,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  latitude float8,
  longitude float8,
  prefecture text,
  city text,
  campsite_type campsite_type,
  is_free boolean,
  price_range text,
  status campsite_status,
  elevation_m integer,
  distance_km float8,
  rating_avg numeric,
  review_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.slug,
    c.latitude,
    c.longitude,
    c.prefecture,
    c.city,
    c.campsite_type,
    c.is_free,
    c.price_range,
    c.status,
    c.elevation_m,
    (ST_Distance(
      c.geom,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) / 1000.0) AS distance_km,
    COALESCE(AVG(r.rating), 0)::numeric AS rating_avg,
    COUNT(r.id) AS review_count
  FROM campsites c
  LEFT JOIN reviews r ON r.campsite_id = c.id
  WHERE c.status = 'active'
    AND ST_DWithin(
      c.geom,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_km * 1000
    )
    AND (search_query IS NULL OR (
      c.name ILIKE '%' || search_query || '%'
      OR c.name_kana ILIKE '%' || search_query || '%'
    ))
    AND (filter_prefecture IS NULL OR c.prefecture = filter_prefecture)
    AND (filter_type IS NULL OR c.campsite_type = filter_type::campsite_type)
    AND (filter_is_free IS NULL OR c.is_free = filter_is_free)
  GROUP BY c.id, c.name, c.slug, c.latitude, c.longitude, c.prefecture, c.city,
           c.campsite_type, c.is_free, c.price_range, c.status, c.elevation_m, c.geom
  ORDER BY distance_km ASC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- ====================
-- スポットの平均評価更新用ビュー
-- ====================
CREATE OR REPLACE VIEW campsite_stats AS
SELECT
  c.id AS campsite_id,
  COALESCE(AVG(r.rating), 0)::numeric(3,2) AS avg_rating,
  COUNT(r.id) AS review_count,
  COUNT(DISTINCT f.user_id) AS favorite_count,
  COUNT(DISTINCT rr.id) FILTER (WHERE rr.is_active AND rr.expires_at > now()) AS active_reports
FROM campsites c
LEFT JOIN reviews r ON r.campsite_id = c.id
LEFT JOIN favorites f ON f.campsite_id = c.id
LEFT JOIN realtime_reports rr ON rr.campsite_id = c.id
GROUP BY c.id;
