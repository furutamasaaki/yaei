export type UserRole = "user" | "scout" | "moderator" | "admin";

export interface User {
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
}

export interface Favorite {
  user_id: string;
  campsite_id: string;
  note: string | null;
  created_at: string;
}

export type AbuseTargetType = "campsite" | "review" | "realtime_report";
export type AbuseReason =
  | "illegal_location"
  | "private_land"
  | "inaccurate"
  | "spam"
  | "inappropriate"
  | "other";
export type AbuseStatus = "pending" | "reviewed" | "resolved" | "dismissed";

export interface AbuseReport {
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
}
