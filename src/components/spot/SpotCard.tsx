import Link from "next/link";
import type { CampsiteWithAttributes } from "@/types/campsite";
import { CAMPSITE_TYPE_LABELS, DIRECT_FIRE_LABELS } from "@/constants/filters";

interface SpotCardProps {
  spot: CampsiteWithAttributes;
  compact?: boolean;
}

export default function SpotCard({ spot, compact = false }: SpotCardProps) {
  const typeLabel = CAMPSITE_TYPE_LABELS[spot.campsite_type];
  const typeColors: Record<string, string> = {
    managed: "bg-yaei-green/20 text-yaei-green-light",
    free: "bg-yaei-gold/20 text-yaei-gold",
    yaei: "bg-yaei-rust/20 text-yaei-rust",
    wild: "bg-yaei-green-light/20 text-yaei-green-light",
  };

  return (
    <Link href={`/spot/${spot.slug}`}>
      <div
        className={`group bg-yaei-surface border border-yaei-green/10 rounded-lg overflow-hidden hover:border-yaei-gold/30 transition-all duration-200 ${
          compact ? "p-3" : "p-4"
        }`}
      >
        {/* ヘッダー: 名前 + タイプ */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className={`font-heading font-bold text-yaei-text group-hover:text-yaei-gold transition-colors ${
              compact ? "text-sm" : "text-base"
            }`}
          >
            {spot.name}
          </h3>
          <span
            className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${typeColors[spot.campsite_type] || ""}`}
          >
            {typeLabel}
          </span>
        </div>

        {/* 場所 */}
        <p className="text-xs text-yaei-text-secondary mb-2">
          {spot.prefecture} {spot.city}
          {spot.elevation_m && ` / 標高${spot.elevation_m}m`}
        </p>

        {/* 料金 */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className={`text-xs font-bold ${
              spot.is_free ? "text-yaei-gold" : "text-yaei-text-secondary"
            }`}
          >
            {spot.is_free ? "無料" : spot.price_range}
          </span>
          {spot.reservation_url && (
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-yaei-gold/30 text-yaei-gold bg-yaei-gold/10">
              予約可
            </span>
          )}
          {spot.attributes?.legal_status === "natural_park_special" && (
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-red-500/30 text-red-400 bg-red-500/10">
              ⚠ 指定地のみ
            </span>
          )}
          {spot.attributes?.legal_status === "unconfirmed" && (
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-yaei-gold/30 text-yaei-gold bg-yaei-gold/10">
              △ 要確認
            </span>
          )}
        </div>

        {/* 属性タグ（コンパクトでなければ表示） */}
        {!compact && spot.attributes && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {spot.attributes.direct_fire !== "unknown" && (
              <AttributeTag
                label={DIRECT_FIRE_LABELS[spot.attributes.direct_fire]}
                positive={spot.attributes.direct_fire === "allowed"}
              />
            )}
            {spot.attributes.solo_friendly && (
              <AttributeTag label="ソロ向き" positive />
            )}
            {spot.attributes.car_access === "drive_in" && (
              <AttributeTag label="乗り入れ可" positive />
            )}
            {spot.attributes.star_gazing === "excellent" && (
              <AttributeTag label="星空" positive />
            )}
            {spot.attributes.signal_docomo !== "unknown" && (
              <AttributeTag
                label={`docomo ${spot.attributes.signal_docomo === "strong" ? "◎" : spot.attributes.signal_docomo === "weak" ? "△" : "✕"}`}
                positive={spot.attributes.signal_docomo === "strong"}
              />
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

function AttributeTag({
  label,
  positive,
}: {
  label: string;
  positive: boolean;
}) {
  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded border ${
        positive
          ? "border-yaei-green/30 text-yaei-green-light bg-yaei-green/10"
          : "border-yaei-text-secondary/20 text-yaei-text-secondary bg-yaei-surface"
      }`}
    >
      {label}
    </span>
  );
}
