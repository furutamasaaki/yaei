import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AttributeGrid from "@/components/spot/AttributeGrid";
import SpotMap from "@/components/spot/SpotMap";
import SpotActions from "@/components/spot/SpotActions";
import { CAMPSITE_TYPE_LABELS } from "@/constants/filters";
import { MOCK_SPOTS } from "@/lib/mock-data";
import type { Metadata } from "next";

interface SpotPageProps {
  params: Promise<{ slug: string }>;
}

async function getSpot(slug: string) {
  // まずSupabaseから取得を試みる
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("campsites")
      .select(`
        *,
        campsite_attributes(*),
        reviews(*, users(display_name, avatar_url)),
        realtime_reports(*)
      `)
      .eq("slug", slug)
      .single();

    if (!error && data) return data;
  } catch {
    // Supabase未接続時はフォールスルー
  }

  // モックデータからフォールバック
  const mock = MOCK_SPOTS.find((s) => s.slug === slug);
  if (mock) {
    return {
      ...mock,
      campsite_attributes: mock.attributes ? [mock.attributes] : [],
      reviews: [],
      realtime_reports: [],
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: SpotPageProps): Promise<Metadata> {
  const { slug } = await params;
  const spot = await getSpot(slug);

  if (!spot) {
    return { title: "スポットが見つかりません" };
  }

  return {
    title: `${spot.name} - キャンプ場情報`,
    description: `${spot.name}（${spot.prefecture}${spot.city}）の詳細情報。${spot.description}`,
    openGraph: {
      title: `${spot.name} | YAEI`,
      description: spot.description,
    },
  };
}

export default async function SpotPage({ params }: SpotPageProps) {
  const { slug } = await params;
  const spot = await getSpot(slug);

  if (!spot) {
    notFound();
  }

  const typeLabel = CAMPSITE_TYPE_LABELS[spot.campsite_type as keyof typeof CAMPSITE_TYPE_LABELS];
  const attributes = spot.campsite_attributes?.[0] || spot.campsite_attributes;
  const reviews = spot.reviews || [];
  const activeReports = (spot.realtime_reports || []).filter(
    (r: { is_active: boolean; expires_at: string }) =>
      r.is_active && new Date(r.expires_at) > new Date()
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* パンくず */}
      <nav className="text-sm text-yaei-text-secondary mb-6">
        <Link href="/" className="hover:text-yaei-text transition-colors">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <Link href="/search" className="hover:text-yaei-text transition-colors">
          検索
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/search?prefecture=${spot.prefecture}`}
          className="hover:text-yaei-text transition-colors"
        >
          {spot.prefecture}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-yaei-text">{spot.name}</span>
      </nav>

      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-yaei-gold/20 text-yaei-gold">
                {typeLabel}
              </span>
              {spot.is_free && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-yaei-green/20 text-yaei-green-light">
                  無料
                </span>
              )}
              {spot.status === "unverified" && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-yaei-rust/20 text-yaei-rust">
                  未確認
                </span>
              )}
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-black text-yaei-text">
              {spot.name}
            </h1>
            <p className="text-yaei-text-secondary mt-1">
              {spot.prefecture} {spot.city}
              {spot.elevation_m && ` / 標高${spot.elevation_m}m`}
            </p>
          </div>

          {/* アクションボタン */}
          <SpotActions campsiteId={spot.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左カラム: 主要情報 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 説明 */}
          {spot.description && (
            <section>
              <h2 className="font-heading font-bold text-yaei-text mb-3">概要</h2>
              <p className="text-yaei-text-secondary leading-relaxed">
                {spot.description}
              </p>
            </section>
          )}

          {/* 地図 */}
          <section>
            <h2 className="font-heading font-bold text-yaei-text mb-3">地図</h2>
            <SpotMap spot={{ ...spot, attributes } as never} />
          </section>

          {/* 詳細属性 */}
          {attributes && (
            <section>
              <h2 className="font-heading font-bold text-yaei-text mb-4">
                詳細情報
              </h2>
              <AttributeGrid attributes={attributes} />
            </section>
          )}

          {/* リアルタイム状況 */}
          {activeReports.length > 0 && (
            <section>
              <h2 className="font-heading font-bold text-yaei-text mb-4">
                リアルタイム状況
              </h2>
              <div className="space-y-3">
                {activeReports.map((report: { id: string; severity: string; report_type: string; message: string; created_at: string }) => (
                  <div
                    key={report.id}
                    className={`border rounded-lg p-4 ${
                      report.severity === "danger"
                        ? "border-red-500/30 bg-red-500/10"
                        : report.severity === "warning"
                          ? "border-yaei-rust/30 bg-yaei-rust/10"
                          : "border-yaei-green/20 bg-yaei-surface"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-yaei-text-secondary uppercase">
                        {report.report_type}
                      </span>
                      <span className="text-xs text-yaei-text-secondary">
                        {new Date(report.created_at).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                    <p className="text-sm text-yaei-text">{report.message}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* レビュー */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-yaei-text">
                レビュー ({reviews.length}件)
              </h2>
              <button className="text-sm text-yaei-gold hover:text-yaei-gold-hover transition-colors">
                レビューを書く
              </button>
            </div>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review: { id: string; rating: number; title: string; body: string; visited_season: string; created_at: string; users: { display_name: string } }) => (
                  <div
                    key={review.id}
                    className="bg-yaei-surface border border-yaei-green/10 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yaei-gold text-sm">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                      <span className="text-xs text-yaei-text-secondary">
                        {review.users?.display_name || "匿名"}
                      </span>
                      <span className="text-xs text-yaei-text-secondary">
                        {new Date(review.created_at).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                    {review.title && (
                      <p className="font-bold text-sm text-yaei-text mb-1">
                        {review.title}
                      </p>
                    )}
                    <p className="text-sm text-yaei-text-secondary">{review.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-yaei-text-secondary bg-yaei-surface rounded-lg p-6 text-center">
                まだレビューはありません。最初のレビューを書きましょう。
              </p>
            )}
          </section>
        </div>

        {/* 右カラム: サイドバー */}
        <div className="space-y-6">
          {/* 予約CTA */}
          {(spot.reservation_url || spot.official_url) && !spot.is_free && (
            <div className="bg-yaei-surface border border-yaei-gold/20 rounded-lg p-5">
              <p className="text-sm text-yaei-text-secondary mb-3">
                {spot.is_free ? "無料で利用可能" : spot.price_range}
              </p>
              {spot.reservation_url ? (
                <a
                  href={spot.reservation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-yaei-gold hover:bg-yaei-gold-hover text-yaei-dark font-bold py-3 rounded-lg text-center transition-colors"
                >
                  予約サイトを開く
                </a>
              ) : spot.official_url ? (
                <a
                  href={spot.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-yaei-gold hover:bg-yaei-gold-hover text-yaei-dark font-bold py-3 rounded-lg text-center transition-colors"
                >
                  公式サイトで予約
                </a>
              ) : null}
              <p className="text-xs text-yaei-text-secondary mt-2 text-center">
                外部サイトに移動します
              </p>
            </div>
          )}

          {/* 基本情報カード */}
          <div className="bg-yaei-surface border border-yaei-green/10 rounded-lg p-5">
            <h3 className="font-heading font-bold text-yaei-text mb-4">基本情報</h3>
            <dl className="space-y-3 text-sm">
              <InfoRow label="料金" value={spot.is_free ? "無料" : spot.price_range} />
              <InfoRow label="住所" value={spot.address || `${spot.prefecture}${spot.city}`} />
              {spot.access_description && (
                <InfoRow label="アクセス" value={spot.access_description} />
              )}
              {spot.elevation_m && (
                <InfoRow label="標高" value={`${spot.elevation_m}m`} />
              )}
              {spot.official_url && (
                <div>
                  <dt className="text-yaei-text-secondary">公式サイト</dt>
                  <dd className="mt-0.5">
                    <a
                      href={spot.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yaei-gold hover:underline break-all"
                    >
                      {spot.official_url}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* 座標 */}
          <div className="bg-yaei-surface border border-yaei-green/10 rounded-lg p-5">
            <h3 className="font-heading font-bold text-yaei-text mb-3">座標</h3>
            <p className="text-sm text-yaei-text-secondary font-mono">
              {spot.latitude.toFixed(6)}, {spot.longitude.toFixed(6)}
            </p>
            <a
              href={`https://www.google.com/maps?q=${spot.latitude},${spot.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm text-yaei-gold hover:text-yaei-gold-hover transition-colors"
            >
              Google Maps で開く
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-yaei-text-secondary">{label}</dt>
      <dd className="mt-0.5 text-yaei-text">{value}</dd>
    </div>
  );
}
