-- PostGIS拡張の有効化
CREATE EXTENSION IF NOT EXISTS postgis;

-- ====================
-- ENUM型の定義
-- ====================
CREATE TYPE campsite_type AS ENUM ('managed', 'free', 'yaei', 'wild');
CREATE TYPE campsite_status AS ENUM ('active', 'closed', 'seasonal', 'unverified');
CREATE TYPE campsite_source AS ENUM ('official', 'user', 'scraping', 'manual');
CREATE TYPE direct_fire_type AS ENUM ('allowed', 'fire_pit_only', 'prohibited', 'unknown');
CREATE TYPE hammock_type AS ENUM ('allowed', 'prohibited', 'unknown');
CREATE TYPE car_access_type AS ENUM ('drive_in', 'parking_walk', 'no_car');
CREATE TYPE toilet_type AS ENUM ('flush', 'squat', 'portable', 'none', 'unknown');
CREATE TYPE water_source_type AS ENUM ('tap', 'river', 'spring', 'none', 'unknown');
CREATE TYPE trash_disposal_type AS ENUM ('available', 'carry_out', 'unknown');
CREATE TYPE signal_strength AS ENUM ('strong', 'weak', 'none', 'unknown');
CREATE TYPE star_gazing_type AS ENUM ('excellent', 'good', 'average', 'poor', 'unknown');
CREATE TYPE bugs_level AS ENUM ('low', 'medium', 'high', 'unknown');
CREATE TYPE noise_level AS ENUM ('silent', 'quiet', 'moderate', 'noisy', 'unknown');
CREATE TYPE season_type AS ENUM ('spring', 'summer', 'autumn', 'winter');
CREATE TYPE user_role AS ENUM ('user', 'scout', 'moderator', 'admin');
CREATE TYPE report_type AS ENUM ('road_condition', 'crowding', 'weather', 'facility', 'signal', 'wildlife', 'other');
CREATE TYPE severity_type AS ENUM ('info', 'warning', 'danger');
CREATE TYPE abuse_target_type AS ENUM ('campsite', 'review', 'realtime_report');
CREATE TYPE abuse_reason AS ENUM ('illegal_location', 'private_land', 'inaccurate', 'spam', 'inappropriate', 'other');
CREATE TYPE abuse_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');

-- ====================
-- usersテーブル
-- ====================
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  role user_role NOT NULL DEFAULT 'user',
  premium_until timestamptz,
  favorite_count integer NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  scout_rank integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ====================
-- campsitesテーブル
-- ====================
CREATE TABLE campsites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_kana text NOT NULL DEFAULT '',
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  latitude float8 NOT NULL,
  longitude float8 NOT NULL,
  geom geography(Point, 4326) GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
  ) STORED,
  prefecture text NOT NULL,
  city text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  access_description text NOT NULL DEFAULT '',
  elevation_m integer,
  campsite_type campsite_type NOT NULL DEFAULT 'managed',
  is_free boolean NOT NULL DEFAULT false,
  price_range text NOT NULL DEFAULT '',
  official_url text,
  status campsite_status NOT NULL DEFAULT 'unverified',
  source campsite_source NOT NULL DEFAULT 'manual',
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES users(id) ON DELETE SET NULL
);

-- 地理空間インデックス
CREATE INDEX idx_campsites_geom ON campsites USING GIST (geom);
-- 都道府県インデックス
CREATE INDEX idx_campsites_prefecture ON campsites (prefecture);
-- ステータスインデックス
CREATE INDEX idx_campsites_status ON campsites (status);
-- タイプインデックス
CREATE INDEX idx_campsites_type ON campsites (campsite_type);
-- スラグインデックス（UNIQUE制約で自動生成されるが明示）
CREATE INDEX idx_campsites_slug ON campsites (slug);
-- テキスト検索用インデックス
CREATE INDEX idx_campsites_name_search ON campsites USING GIN (to_tsvector('simple', name || ' ' || name_kana || ' ' || prefecture || ' ' || city));

-- ====================
-- campsite_attributesテーブル
-- ====================
CREATE TABLE campsite_attributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campsite_id uuid NOT NULL UNIQUE REFERENCES campsites(id) ON DELETE CASCADE,
  direct_fire direct_fire_type NOT NULL DEFAULT 'unknown',
  hammock hammock_type NOT NULL DEFAULT 'unknown',
  tent_sites integer,
  car_access car_access_type NOT NULL DEFAULT 'parking_walk',
  pet_allowed boolean,
  toilet_type toilet_type NOT NULL DEFAULT 'unknown',
  water_source water_source_type NOT NULL DEFAULT 'unknown',
  shower boolean,
  trash_disposal trash_disposal_type NOT NULL DEFAULT 'unknown',
  nearest_supermarket_min integer,
  nearest_convenience_min integer,
  nearest_onsen_min integer,
  signal_docomo signal_strength NOT NULL DEFAULT 'unknown',
  signal_au signal_strength NOT NULL DEFAULT 'unknown',
  signal_softbank signal_strength NOT NULL DEFAULT 'unknown',
  solo_friendly boolean NOT NULL DEFAULT false,
  family_friendly boolean NOT NULL DEFAULT false,
  can_swim boolean NOT NULL DEFAULT false,
  fishing boolean NOT NULL DEFAULT false,
  star_gazing star_gazing_type NOT NULL DEFAULT 'unknown',
  best_season season_type[] DEFAULT '{}',
  bugs_level bugs_level NOT NULL DEFAULT 'unknown',
  noise_level noise_level NOT NULL DEFAULT 'unknown'
);

CREATE INDEX idx_campsite_attributes_campsite_id ON campsite_attributes (campsite_id);

-- ====================
-- reviewsテーブル
-- ====================
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campsite_id uuid NOT NULL REFERENCES campsites(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  visited_date date,
  visited_season season_type,
  photos text[] DEFAULT '{}',
  is_verified boolean NOT NULL DEFAULT false,
  helpful_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_campsite_id ON reviews (campsite_id);
CREATE INDEX idx_reviews_user_id ON reviews (user_id);
CREATE INDEX idx_reviews_rating ON reviews (rating);

-- ====================
-- realtime_reportsテーブル
-- ====================
CREATE TABLE realtime_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campsite_id uuid NOT NULL REFERENCES campsites(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_type report_type NOT NULL,
  severity severity_type NOT NULL DEFAULT 'info',
  message text NOT NULL DEFAULT '',
  photos text[] DEFAULT '{}',
  expires_at timestamptz NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  confirmed_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_realtime_reports_campsite_id ON realtime_reports (campsite_id);
CREATE INDEX idx_realtime_reports_active ON realtime_reports (is_active, expires_at);

-- ====================
-- favoritesテーブル
-- ====================
CREATE TABLE favorites (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campsite_id uuid NOT NULL REFERENCES campsites(id) ON DELETE CASCADE,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, campsite_id)
);

CREATE INDEX idx_favorites_campsite_id ON favorites (campsite_id);

-- ====================
-- reports_abuseテーブル
-- ====================
CREATE TABLE reports_abuse (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type abuse_target_type NOT NULL,
  target_id uuid NOT NULL,
  reporter_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason abuse_reason NOT NULL,
  description text NOT NULL DEFAULT '',
  status abuse_status NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX idx_reports_abuse_status ON reports_abuse (status);
CREATE INDEX idx_reports_abuse_target ON reports_abuse (target_type, target_id);

-- ====================
-- updated_atの自動更新トリガー
-- ====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_campsites_updated_at
  BEFORE UPDATE ON campsites FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_reviews_updated_at
  BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_realtime_reports_updated_at
  BEFORE UPDATE ON realtime_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ====================
-- RLS（Row Level Security）ポリシー
-- ====================

-- users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_all" ON users
  FOR SELECT USING (true);

CREATE POLICY "users_insert_own" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- campsites
ALTER TABLE campsites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campsites_select_active" ON campsites
  FOR SELECT USING (status != 'closed' OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('moderator', 'admin')
  ));

CREATE POLICY "campsites_insert_authenticated" ON campsites
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "campsites_update_admin" ON campsites
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
    OR created_by = auth.uid()
  );

CREATE POLICY "campsites_delete_admin" ON campsites
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- campsite_attributes
ALTER TABLE campsite_attributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campsite_attributes_select_all" ON campsite_attributes
  FOR SELECT USING (true);

CREATE POLICY "campsite_attributes_insert_authenticated" ON campsite_attributes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "campsite_attributes_update_admin" ON campsite_attributes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_all" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert_authenticated" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews_update_own" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "reviews_delete_own_or_admin" ON reviews
  FOR DELETE USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- realtime_reports
ALTER TABLE realtime_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "realtime_reports_select_all" ON realtime_reports
  FOR SELECT USING (true);

CREATE POLICY "realtime_reports_insert_authenticated" ON realtime_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "realtime_reports_update_own" ON realtime_reports
  FOR UPDATE USING (auth.uid() = user_id);

-- favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_select_own" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert_own" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_own" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- reports_abuse
ALTER TABLE reports_abuse ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_abuse_select_admin" ON reports_abuse
  FOR SELECT USING (
    auth.uid() = reporter_id
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
  );

CREATE POLICY "reports_abuse_insert_authenticated" ON reports_abuse
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "reports_abuse_update_admin" ON reports_abuse
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
  );
