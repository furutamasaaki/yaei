import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PREFECTURES } from "@/constants/prefectures";
import SpotCard from "@/components/spot/SpotCard";
import type { Metadata } from "next";
import type { CampsiteWithAttributes } from "@/types/campsite";

interface PrefecturePageProps {
  params: Promise<{ code: string }>;
}

function getPrefecture(code: string) {
  return PREFECTURES.find((p) => p.code === code || p.name_en === code);
}

export async function generateStaticParams() {
  return PREFECTURES.map((p) => ({ code: p.name_en }));
}

export async function generateMetadata({
  params,
}: PrefecturePageProps): Promise<Metadata> {
  const { code } = await params;
  const pref = getPrefecture(code);
  if (!pref) return { title: "都道府県が見つかりません" };

  return {
    title: `${pref.name}のキャンプ場・野営場一覧`,
    description: `${pref.name}のキャンプ場・野営場・無料キャンプ場を一覧で紹介。直火OK、ソロキャンプ向きなど詳細条件で検索できます。`,
    openGraph: {
      title: `${pref.name}のキャンプ場・野営場 | YAEI`,
      description: `${pref.name}のキャンプ場・野営場を探す`,
    },
  };
}

export default async function PrefecturePage({ params }: PrefecturePageProps) {
  const { code } = await params;
  const pref = getPrefecture(code);
  if (!pref) notFound();

  const supabase = await createClient();
  const { data: spots } = await supabase
    .from("campsites")
    .select("*, campsite_attributes(*)")
    .eq("prefecture", pref.name)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const campsites = (spots || []) as unknown as CampsiteWithAttributes[];
  const freeCount = campsites.filter((s) => s.is_free).length;
  const yaeiCount = campsites.filter(
    (s) => s.campsite_type === "yaei" || s.campsite_type === "wild"
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* パンくず */}
      <nav className="text-sm text-yaei-text-secondary mb-6">
        <Link href="/" className="hover:text-yaei-text transition-colors">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <span className="text-yaei-text">{pref.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-heading text-2xl md:text-3xl font-black text-yaei-text mb-2">
          {pref.name}のキャンプ場・野営場
        </h1>
        <p className="text-yaei-text-secondary">
          {campsites.length}件のスポット
          {freeCount > 0 && `（無料: ${freeCount}件）`}
          {yaeiCount > 0 && `（野営場: ${yaeiCount}件）`}
        </p>
      </div>

      {/* クイックフィルター */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href={`/search?prefecture=${pref.name}`}
          className="text-xs px-3 py-1.5 rounded-full border border-yaei-gold bg-yaei-gold/20 text-yaei-gold"
        >
          すべて ({campsites.length})
        </Link>
        <Link
          href={`/search?prefecture=${pref.name}&is_free=true`}
          className="text-xs px-3 py-1.5 rounded-full border border-yaei-green/20 text-yaei-text-secondary hover:border-yaei-gold/30 transition-colors"
        >
          無料 ({freeCount})
        </Link>
        <Link
          href={`/search?prefecture=${pref.name}&type=yaei`}
          className="text-xs px-3 py-1.5 rounded-full border border-yaei-green/20 text-yaei-text-secondary hover:border-yaei-gold/30 transition-colors"
        >
          野営場 ({yaeiCount})
        </Link>
        <Link
          href={`/search?prefecture=${pref.name}&direct_fire=allowed`}
          className="text-xs px-3 py-1.5 rounded-full border border-yaei-green/20 text-yaei-text-secondary hover:border-yaei-gold/30 transition-colors"
        >
          直火OK
        </Link>
      </div>

      {/* スポット一覧 */}
      {campsites.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campsites.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-yaei-text-secondary mb-4">
            {pref.name}のスポットはまだ登録されていません
          </p>
          <Link
            href="/search"
            className="inline-block bg-yaei-gold hover:bg-yaei-gold-hover text-yaei-dark font-bold px-6 py-2 rounded transition-colors"
          >
            他のエリアを探す
          </Link>
        </div>
      )}
    </div>
  );
}
