import { createClient } from "@/lib/supabase/server";

async function getStats() {
  const supabase = await createClient();

  const [campsites, reviews, users, reports] = await Promise.all([
    supabase.from("campsites").select("id", { count: "exact", head: true }),
    supabase.from("reviews").select("id", { count: "exact", head: true }),
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase
      .from("reports_abuse")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  return {
    campsites: campsites.count || 0,
    reviews: reviews.count || 0,
    users: users.count || 0,
    pendingReports: reports.count || 0,
  };
}

async function getRecentCampsites() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("campsites")
    .select("id, name, prefecture, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);
  return data || [];
}

async function getRecentReviews() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, title, rating, created_at, campsites(name), users(display_name)")
    .order("created_at", { ascending: false })
    .limit(5);
  return data || [];
}

export default async function AdminDashboard() {
  const [stats, recentCampsites, recentReviews] = await Promise.all([
    getStats(),
    getRecentCampsites(),
    getRecentReviews(),
  ]);

  const statCards = [
    { label: "登録スポット", value: stats.campsites, color: "text-yaei-green-light" },
    { label: "レビュー", value: stats.reviews, color: "text-yaei-gold" },
    { label: "ユーザー", value: stats.users, color: "text-yaei-text" },
    { label: "未処理通報", value: stats.pendingReports, color: stats.pendingReports > 0 ? "text-yaei-rust" : "text-yaei-text-secondary" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-yaei-text mb-6">
        ダッシュボード
      </h1>

      {/* KPIカード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-yaei-surface border border-yaei-green/10 rounded-lg p-5"
          >
            <p className="text-xs text-yaei-text-secondary uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className={`font-heading-en text-3xl font-bold ${stat.color}`}>
              {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最新スポット */}
        <div className="bg-yaei-surface border border-yaei-green/10 rounded-lg p-5">
          <h2 className="font-heading font-bold text-yaei-text mb-4">
            最新の登録スポット
          </h2>
          {recentCampsites.length > 0 ? (
            <div className="space-y-3">
              {recentCampsites.map((spot: { id: string; name: string; prefecture: string; status: string; created_at: string }) => (
                <div
                  key={spot.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="text-yaei-text">{spot.name}</p>
                    <p className="text-xs text-yaei-text-secondary">
                      {spot.prefecture}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={spot.status} />
                    <span className="text-xs text-yaei-text-secondary">
                      {new Date(spot.created_at).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-yaei-text-secondary">データなし</p>
          )}
        </div>

        {/* 最新レビュー */}
        <div className="bg-yaei-surface border border-yaei-green/10 rounded-lg p-5">
          <h2 className="font-heading font-bold text-yaei-text mb-4">
            最新のレビュー
          </h2>
          {recentReviews.length > 0 ? (
            <div className="space-y-3">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {recentReviews.map((review: any) => (
                <div key={review.id} className="text-sm">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-yaei-gold text-xs">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                    <span className="text-yaei-text-secondary text-xs">
                      {review.users?.display_name}
                    </span>
                  </div>
                  <p className="text-yaei-text text-xs">
                    {review.campsites?.name}
                    {review.title && ` — ${review.title}`}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-yaei-text-secondary">データなし</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-yaei-green/20 text-yaei-green-light",
    unverified: "bg-yaei-rust/20 text-yaei-rust",
    closed: "bg-yaei-text-secondary/20 text-yaei-text-secondary",
    seasonal: "bg-yaei-gold/20 text-yaei-gold",
  };
  const labels: Record<string, string> = {
    active: "有効",
    unverified: "未確認",
    closed: "閉鎖",
    seasonal: "季節限定",
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded ${styles[status] || ""}`}>
      {labels[status] || status}
    </span>
  );
}
