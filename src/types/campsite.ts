export type CampsiteType = "managed" | "free" | "yaei" | "wild";
export type CampsiteStatus = "active" | "closed" | "seasonal" | "unverified";
export type CampsiteSource = "official" | "user" | "scraping" | "manual";

export type DirectFireType = "allowed" | "fire_pit_only" | "prohibited" | "unknown";
export type HammockType = "allowed" | "prohibited" | "unknown";
export type CarAccessType = "drive_in" | "parking_walk" | "no_car";
export type ToiletType = "flush" | "squat" | "portable" | "none" | "unknown";
export type WaterSourceType = "tap" | "river" | "spring" | "none" | "unknown";
export type TrashDisposalType = "available" | "carry_out" | "unknown";
export type SignalStrength = "strong" | "weak" | "none" | "unknown";
export type StarGazingType = "excellent" | "good" | "average" | "poor" | "unknown";
export type BugsLevel = "low" | "medium" | "high" | "unknown";
export type NoiseLevel = "silent" | "quiet" | "moderate" | "noisy" | "unknown";
export type Season = "spring" | "summer" | "autumn" | "winter";
export type LegalStatusType = "authorized" | "public_riverbed" | "national_forest" | "natural_park_regular" | "natural_park_special" | "private_permitted" | "unconfirmed" | "unknown";

export interface Campsite {
  id: string;
  name: string;
  name_kana: string;
  slug: string;
  description: string;
  latitude: number;
  longitude: number;
  prefecture: string;
  city: string;
  address: string;
  access_description: string;
  elevation_m: number | null;
  campsite_type: CampsiteType;
  is_free: boolean;
  price_range: string;
  official_url: string | null;
  reservation_url: string | null;
  status: CampsiteStatus;
  source: CampsiteSource;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface CampsiteAttributes {
  id: string;
  campsite_id: string;
  direct_fire: DirectFireType;
  hammock: HammockType;
  tent_sites: number | null;
  car_access: CarAccessType;
  pet_allowed: boolean | null;
  toilet_type: ToiletType;
  water_source: WaterSourceType;
  shower: boolean | null;
  trash_disposal: TrashDisposalType;
  nearest_supermarket_min: number | null;
  nearest_convenience_min: number | null;
  nearest_onsen_min: number | null;
  signal_docomo: SignalStrength;
  signal_au: SignalStrength;
  signal_softbank: SignalStrength;
  solo_friendly: boolean;
  family_friendly: boolean;
  can_swim: boolean;
  fishing: boolean;
  star_gazing: StarGazingType;
  best_season: Season[];
  bugs_level: BugsLevel;
  noise_level: NoiseLevel;
  legal_status: LegalStatusType;
  legal_note: string;
}

export interface CampsiteWithAttributes extends Campsite {
  attributes: CampsiteAttributes | null;
}
