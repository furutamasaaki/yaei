import type {
  CampsiteType,
  CampsiteStatus,
  CampsiteSource,
  DirectFireType,
  HammockType,
  CarAccessType,
  ToiletType,
  WaterSourceType,
  TrashDisposalType,
  SignalStrength,
  StarGazingType,
  BugsLevel,
  NoiseLevel,
  Season,
} from "./campsite";
import type { UserRole } from "./user";
import type { ReportType, Severity } from "./review";
import type { AbuseTargetType, AbuseReason, AbuseStatus } from "./user";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          role: UserRole;
          premium_until: string | null;
          favorite_count: number;
          review_count: number;
          scout_rank: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["users"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
      campsites: {
        Row: {
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
          status: CampsiteStatus;
          source: CampsiteSource;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["campsites"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["campsites"]["Row"]>;
      };
      campsite_attributes: {
        Row: {
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
        };
        Insert: Omit<Database["public"]["Tables"]["campsite_attributes"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["campsite_attributes"]["Row"]>;
      };
      reviews: {
        Row: {
          id: string;
          campsite_id: string;
          user_id: string;
          rating: number;
          title: string;
          body: string;
          visited_date: string | null;
          visited_season: Season | null;
          photos: string[];
          is_verified: boolean;
          helpful_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at" | "updated_at" | "helpful_count" | "is_verified"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          helpful_count?: number;
          is_verified?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
      };
      realtime_reports: {
        Row: {
          id: string;
          campsite_id: string;
          user_id: string;
          report_type: ReportType;
          severity: Severity;
          message: string;
          photos: string[];
          expires_at: string;
          is_active: boolean;
          confirmed_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["realtime_reports"]["Row"], "id" | "created_at" | "updated_at" | "confirmed_count" | "is_active"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          confirmed_count?: number;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["realtime_reports"]["Row"]>;
      };
      favorites: {
        Row: {
          user_id: string;
          campsite_id: string;
          note: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["favorites"]["Row"], "created_at"> & {
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["favorites"]["Row"]>;
      };
      reports_abuse: {
        Row: {
          id: string;
          target_type: AbuseTargetType;
          target_id: string;
          reporter_id: string;
          reason: AbuseReason;
          description: string;
          status: AbuseStatus;
          reviewed_by: string | null;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["reports_abuse"]["Row"], "id" | "created_at" | "status"> & {
          id?: string;
          created_at?: string;
          status?: AbuseStatus;
        };
        Update: Partial<Database["public"]["Tables"]["reports_abuse"]["Row"]>;
      };
    };
  };
}
