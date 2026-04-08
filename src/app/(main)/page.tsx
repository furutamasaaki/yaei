import Link from "next/link";
import SearchBar from "@/components/search/SearchBar";
import SpotCard from "@/components/spot/SpotCard";
import { MOCK_SPOTS } from "@/lib/mock-data";

const POPULAR_TAGS = [
  { label: "直火OK", href: "/search?direct_fire=allowed" },
  { label: "完ソロ", href: "/search?solo_friendly=true" },
  { label: "無料", href: "/search?is_free=true" },
  { label: "車乗り入れ可", href: "/search?car_access=drive_in" },
  { label: "温泉近い", href: "/search" },
  { label: "星がきれい", href: "/search?star_gazing=excellent" },
  { label: "野営場", href: "/search?type=yaei" },
  { label: "ハンモック可", href: "/search?hammock=allowed" },
];

// 実データから統計を算出
const totalSpots = MOCK_SPOTS.length;
const prefectures = new Set(MOCK_SPOTS.map((s) => s.prefecture));
const freeOrYaei = MOCK_SPOTS.filter(
  (s) => s.is_free || s.campsite_type === "yaei" || s.campsite_type === "wild"
).length;

const STATS = [
  { value: String(totalSpots), label: "登録スポット" },
  { value: String(prefectures.size), label: "都道府県" },
  { value: String(freeOrYaei), label: "野営場・無料" },
  { value: "0", label: "レビュー" },
];

// 都道府県別件数を集計し、上位8件を表示
const prefCountMap: Record<string, number> = {};
MOCK_SPOTS.forEach((s) => {
  prefCountMap[s.prefecture] = (prefCountMap[s.prefecture] || 0) + 1;
});
const FEATURED_AREAS = Object.entries(prefCountMap)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)
  .map(([name, count]) => ({
    name,
    count,
    href: `/search?prefecture=${name}`,
  }));

export default function HomePage() {
  return (
    <div>
      {/* ヒーローセクション */}
      <section className="relative contour-pattern py-20 md:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="font-heading-en text-sm tracking-[0.3em] text-yaei-gold mb-4">
            YAEI
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-black leading-tight mb-6">
            まだ見ぬ野営地を、
            <br />
            見つけよう。
          </h2>
          <p className="text-yaei-text-secondary text-lg mb-10 max-w-2xl mx-auto">
            野営場・無料キャンプ場・マイナースポットを網羅。
            <br className="hidden md:block" />
            超詳細フィルタリングで理想のキャンプ地が見つかる。
          </p>

          <div className="mx-auto max-w-2xl mb-8">
            <SearchBar size="lg" />
          </div>

          {/* 人気の条件タグ */}
          <div className="flex flex-wrap justify-center gap-3">
            {POPULAR_TAGS.map((tag) => (
              <Link
                key={tag.label}
                href={tag.href}
                className="rounded-full border border-yaei-green/30 bg-yaei-surface/50 px-4 py-1.5 text-sm text-yaei-green-light hover:border-yaei-gold/50 hover:text-yaei-gold transition-colors"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 統計セクション */}
      <section className="border-y border-yaei-surface py-12">
        <div className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-heading-en text-3xl font-bold text-yaei-gold">
                {stat.value}
              </p>
              <p className="text-sm text-yaei-text-secondary mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 特集エリア */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="font-heading text-xl font-bold text-yaei-text mb-2">
            人気エリアから探す
          </h3>
          <p className="text-sm text-yaei-text-secondary mb-8">
            キャンプ場・野営場が充実したエリア
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURED_AREAS.map((area) => (
              <Link
                key={area.name}
                href={area.href}
                className="group bg-yaei-surface border border-yaei-green/10 rounded-lg p-5 hover:border-yaei-gold/30 transition-all"
              >
                <p className="font-heading font-bold text-yaei-text group-hover:text-yaei-gold transition-colors">
                  {area.name}
                </p>
                <p className="text-xs text-yaei-text-secondary mt-1">
                  {area.count}件のスポット
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 新着スポット */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-heading text-xl font-bold text-yaei-text mb-1">
                新着スポット
              </h3>
              <p className="text-sm text-yaei-text-secondary">
                最近追加されたキャンプ場・野営場
              </p>
            </div>
            <Link
              href="/search"
              className="text-sm text-yaei-gold hover:text-yaei-gold-hover transition-colors"
            >
              すべて見る →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {MOCK_SPOTS.slice(0, 8).map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        </div>
      </section>

      {/* 地図セクションへのCTA */}
      <section className="py-16 contour-pattern">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h3 className="font-heading text-xl font-bold text-yaei-text mb-4">
            地図で探す
          </h3>
          <p className="text-yaei-text-secondary mb-8">
            地図を動かしてキャンプ場・野営場を検索。気になるスポットをタップして詳細を確認。
          </p>
          <Link
            href="/search"
            className="inline-block bg-yaei-gold hover:bg-yaei-gold-hover text-yaei-dark font-bold px-8 py-3 rounded-lg transition-colors"
          >
            地図で検索する
          </Link>
        </div>
      </section>
    </div>
  );
}
