import type { CampsiteAttributes } from "@/types/campsite";
import {
  DIRECT_FIRE_LABELS,
  HAMMOCK_LABELS,
  CAR_ACCESS_LABELS,
  TOILET_LABELS,
  WATER_SOURCE_LABELS,
  TRASH_DISPOSAL_LABELS,
  SIGNAL_LABELS,
  STAR_GAZING_LABELS,
  BUGS_LEVEL_LABELS,
  NOISE_LEVEL_LABELS,
  SEASON_LABELS,
} from "@/constants/filters";

interface AttributeGridProps {
  attributes: CampsiteAttributes;
}

export default function AttributeGrid({ attributes }: AttributeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 設備・ルール */}
      <AttributeSection title="設備・ルール">
        <AttributeRow
          label="直火"
          value={DIRECT_FIRE_LABELS[attributes.direct_fire]}
          variant={attributes.direct_fire === "allowed" ? "positive" : attributes.direct_fire === "prohibited" ? "negative" : "neutral"}
        />
        <AttributeRow
          label="ハンモック"
          value={HAMMOCK_LABELS[attributes.hammock]}
          variant={attributes.hammock === "allowed" ? "positive" : attributes.hammock === "prohibited" ? "negative" : "neutral"}
        />
        <AttributeRow
          label="車アクセス"
          value={CAR_ACCESS_LABELS[attributes.car_access]}
          variant={attributes.car_access === "drive_in" ? "positive" : "neutral"}
        />
        <AttributeRow
          label="ペット"
          value={attributes.pet_allowed === null ? "不明" : attributes.pet_allowed ? "OK" : "不可"}
          variant={attributes.pet_allowed ? "positive" : attributes.pet_allowed === false ? "negative" : "neutral"}
        />
        {attributes.tent_sites && (
          <AttributeRow label="サイト数" value={`約${attributes.tent_sites}サイト`} variant="neutral" />
        )}
      </AttributeSection>

      {/* 施設 */}
      <AttributeSection title="施設">
        <AttributeRow label="トイレ" value={TOILET_LABELS[attributes.toilet_type]} variant="neutral" />
        <AttributeRow label="水場" value={WATER_SOURCE_LABELS[attributes.water_source]} variant="neutral" />
        <AttributeRow
          label="シャワー"
          value={attributes.shower === null ? "不明" : attributes.shower ? "あり" : "なし"}
          variant={attributes.shower ? "positive" : "neutral"}
        />
        <AttributeRow label="ゴミ" value={TRASH_DISPOSAL_LABELS[attributes.trash_disposal]} variant="neutral" />
      </AttributeSection>

      {/* 周辺情報 */}
      <AttributeSection title="周辺情報">
        {attributes.nearest_convenience_min && (
          <AttributeRow label="コンビニ" value={`車${attributes.nearest_convenience_min}分`} variant="neutral" />
        )}
        {attributes.nearest_supermarket_min && (
          <AttributeRow label="スーパー" value={`車${attributes.nearest_supermarket_min}分`} variant="neutral" />
        )}
        {attributes.nearest_onsen_min && (
          <AttributeRow label="温泉" value={`車${attributes.nearest_onsen_min}分`} variant="neutral" />
        )}
      </AttributeSection>

      {/* 携帯電波 */}
      <AttributeSection title="携帯電波">
        <AttributeRow
          label="docomo"
          value={SIGNAL_LABELS[attributes.signal_docomo]}
          variant={attributes.signal_docomo === "strong" ? "positive" : attributes.signal_docomo === "none" ? "negative" : "neutral"}
        />
        <AttributeRow
          label="au"
          value={SIGNAL_LABELS[attributes.signal_au]}
          variant={attributes.signal_au === "strong" ? "positive" : attributes.signal_au === "none" ? "negative" : "neutral"}
        />
        <AttributeRow
          label="SoftBank"
          value={SIGNAL_LABELS[attributes.signal_softbank]}
          variant={attributes.signal_softbank === "strong" ? "positive" : attributes.signal_softbank === "none" ? "negative" : "neutral"}
        />
      </AttributeSection>

      {/* 環境 */}
      <AttributeSection title="環境">
        <AttributeRow label="星空" value={STAR_GAZING_LABELS[attributes.star_gazing]} variant="neutral" />
        <AttributeRow label="虫" value={BUGS_LEVEL_LABELS[attributes.bugs_level]} variant="neutral" />
        <AttributeRow label="静けさ" value={NOISE_LEVEL_LABELS[attributes.noise_level]} variant="neutral" />
        {attributes.best_season.length > 0 && (
          <AttributeRow
            label="おすすめ時期"
            value={attributes.best_season.map((s) => SEASON_LABELS[s]).join("・")}
            variant="neutral"
          />
        )}
      </AttributeSection>

      {/* アクティビティ */}
      <AttributeSection title="アクティビティ">
        <AttributeRow
          label="ソロ向き"
          value={attributes.solo_friendly ? "はい" : "いいえ"}
          variant={attributes.solo_friendly ? "positive" : "neutral"}
        />
        <AttributeRow
          label="ファミリー向き"
          value={attributes.family_friendly ? "はい" : "いいえ"}
          variant={attributes.family_friendly ? "positive" : "neutral"}
        />
        <AttributeRow
          label="水遊び"
          value={attributes.can_swim ? "可" : "不可"}
          variant={attributes.can_swim ? "positive" : "neutral"}
        />
        <AttributeRow
          label="釣り"
          value={attributes.fishing ? "可" : "不可"}
          variant={attributes.fishing ? "positive" : "neutral"}
        />
      </AttributeSection>
    </div>
  );
}

function AttributeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-yaei-surface rounded-lg p-4 border border-yaei-green/10">
      <h4 className="text-xs font-bold text-yaei-text-secondary uppercase tracking-wider mb-3">
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function AttributeRow({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: "positive" | "negative" | "neutral";
}) {
  const valueColors = {
    positive: "text-yaei-green-light",
    negative: "text-yaei-rust",
    neutral: "text-yaei-text",
  };

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-yaei-text-secondary">{label}</span>
      <span className={`font-medium ${valueColors[variant]}`}>{value}</span>
    </div>
  );
}
