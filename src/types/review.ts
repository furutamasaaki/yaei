import type { Season } from "./campsite";

export interface Review {
  id: string;
  campsite_id: string;
  user_id: string;
  rating: number;
  title: string;
  body: string;
  visited_date: string;
  visited_season: Season;
  photos: string[];
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export type ReportType =
  | "road_condition"
  | "crowding"
  | "weather"
  | "facility"
  | "signal"
  | "wildlife"
  | "other";
export type Severity = "info" | "warning" | "danger";

export interface RealtimeReport {
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
}
