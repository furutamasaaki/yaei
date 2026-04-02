"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import SpotCard from "@/components/spot/SpotCard";
import Link from "next/link";

type Tab = "favorites" | "reviews" | "reports" | "profile";

export default function MyPage() {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("favorites");
  const [favorites, setFavorites] = useState<{ campsite_id: string; note: string | null; campsites: Record<string, unknown> }[]>([]);
  const [reviews, setReviews] = useState<{ id: string; rating: number; title: string; body: string; created_at: string; campsites: { name: string; slug: string } }[]>([]);
  const [reports, setReports] = useState<{ id: string; report_type: string; message: string; created_at: string; is_active: boolean; campsites: { name: string; slug: string } }[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [favRes, revRes, repRes] = await Promise.all([
        supabase
          .from("favorites")
          .select("*, campsites(*, campsite_attributes(*))")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("reviews")
          .select("*, campsites(name, slug)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("realtime_reports")
          .select("*, campsites(name, slug)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (favRes.data) setFavorites(favRes.data as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (revRes.data) setReviews(revRes.data as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (repRes.data) setReports(repRes.data as any);
    };

    fetchData();
  }, [user, supabase]);

  useEffect(() => {
    if (profile) setDisplayName(profile.display_name);
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!user || !displayName.trim()) return;
    setSaving(true);

    await supabase
      .from("users")
      .update({ display_name: displayName.trim() })
      .eq("id", user.id);

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-yaei-text-secondary">読み込み中...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-yaei-text-secondary">ログインが必要です</p>
        <Link
          href="/auth/login?redirect=/mypage"
          className="bg-yaei-gold hover:bg-yaei-gold-hover text-yaei-dark font-bold px-6 py-2 rounded transition-colors"
        >
          ログイン
        </Link>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "favorites", label: "お気に入り", count: favorites.length },
    { key: "reviews", label: "レビュー", count: reviews.length },
    { key: "reports", label: "状況報告", count: reports.length },
    { key: "profile", label: "プロフィール", count: 0 },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-yaei-surface border border-yaei-green/20 flex items-center justify-center text-xl text-yaei-gold font-bold">
            {profile?.display_name?.[0] || "U"}
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl text-yaei-text">
              {profile?.display_name || "ユーザー"}
            </h1>
            <p className="text-sm text-yaei-text-secondary">{user.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="text-sm text-yaei-text-secondary hover:text-yaei-rust transition-colors border border-yaei-green/20 px-4 py-2 rounded"
        >
          ログアウト
        </button>
      </div>

      {/* タブ */}
      <div className="flex border-b border-yaei-surface mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.key
                ? "text-yaei-gold border-yaei-gold"
                : "text-yaei-text-secondary border-transparent hover:text-yaei-text"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 text-xs bg-yaei-surface px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      {activeTab === "favorites" && (
        <div>
          {favorites.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {favorites.map((fav) => (
                <SpotCard
                  key={fav.campsite_id}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  spot={fav.campsites as any}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              message="まだお気に入りがありません"
              action={{ label: "スポットを探す", href: "/search" }}
            />
          )}
        </div>
      )}

      {activeTab === "reviews" && (
        <div>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
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
                    <Link
                      href={`/spot/${review.campsites?.slug}`}
                      className="text-sm text-yaei-gold hover:underline"
                    >
                      {review.campsites?.name}
                    </Link>
                    <span className="text-xs text-yaei-text-secondary">
                      {new Date(review.created_at).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                  {review.title && (
                    <p className="font-bold text-sm text-yaei-text mb-1">{review.title}</p>
                  )}
                  <p className="text-sm text-yaei-text-secondary">{review.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              message="まだレビューがありません"
              action={{ label: "スポットを探す", href: "/search" }}
            />
          )}
        </div>
      )}

      {activeTab === "reports" && (
        <div>
          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-yaei-surface border border-yaei-green/10 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        report.is_active
                          ? "bg-yaei-green/20 text-yaei-green-light"
                          : "bg-yaei-surface text-yaei-text-secondary"
                      }`}
                    >
                      {report.is_active ? "有効" : "期限切れ"}
                    </span>
                    <span className="text-xs text-yaei-text-secondary uppercase">
                      {report.report_type}
                    </span>
                    <Link
                      href={`/spot/${report.campsites?.slug}`}
                      className="text-sm text-yaei-gold hover:underline"
                    >
                      {report.campsites?.name}
                    </Link>
                  </div>
                  <p className="text-sm text-yaei-text-secondary">{report.message}</p>
                  <p className="text-xs text-yaei-text-secondary mt-2">
                    {new Date(report.created_at).toLocaleDateString("ja-JP")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="まだ状況報告がありません" />
          )}
        </div>
      )}

      {activeTab === "profile" && (
        <div className="max-w-md">
          <div className="bg-yaei-surface border border-yaei-green/10 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm text-yaei-text-secondary mb-1">
                表示名
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-yaei-dark border border-yaei-green/20 rounded px-4 py-2.5 text-yaei-text text-sm outline-none focus:border-yaei-gold/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-yaei-text-secondary mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full bg-yaei-dark border border-yaei-green/10 rounded px-4 py-2.5 text-yaei-text-secondary text-sm"
              />
            </div>

            <button
              onClick={handleUpdateProfile}
              disabled={saving}
              className="bg-yaei-gold hover:bg-yaei-gold-hover text-yaei-dark font-bold px-6 py-2 rounded transition-colors disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({
  message,
  action,
}: {
  message: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="text-center py-16">
      <p className="text-yaei-text-secondary mb-4">{message}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-block bg-yaei-gold hover:bg-yaei-gold-hover text-yaei-dark font-bold px-6 py-2 rounded transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
