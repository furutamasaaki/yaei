"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface ReviewRow {
  id: string;
  rating: number;
  title: string;
  body: string;
  is_verified: boolean;
  created_at: string;
  campsites: { name: string } | null;
  users: { display_name: string } | null;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const limit = 20;

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const { data, count } = await supabase
      .from("reviews")
      .select("id, rating, title, body, is_verified, created_at, campsites(name), users(display_name)", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    setReviews((data as unknown as ReviewRow[]) || []);
    setTotal(count || 0);
    setLoading(false);
  }, [supabase, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id: string) => {
    if (!confirm("このレビューを削除しますか？")) return;
    await supabase.from("reviews").delete().eq("id", id);
    fetchReviews();
  };

  const handleToggleVerify = async (id: string, current: boolean) => {
    await supabase.from("reviews").update({ is_verified: !current }).eq("id", id);
    fetchReviews();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-yaei-text">レビュー管理</h1>
        <span className="text-sm text-yaei-text-secondary">{total}件</span>
      </div>

      <div className="bg-yaei-surface border border-yaei-green/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-yaei-green/10 text-left text-xs text-yaei-text-secondary uppercase">
                <th className="px-4 py-3">スポット</th>
                <th className="px-4 py-3">ユーザー</th>
                <th className="px-4 py-3">評価</th>
                <th className="px-4 py-3">内容</th>
                <th className="px-4 py-3">確認済</th>
                <th className="px-4 py-3">日時</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-yaei-text-secondary">読み込み中...</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-yaei-text-secondary">レビューがありません</td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="border-b border-yaei-green/5 hover:bg-yaei-dark/30">
                    <td className="px-4 py-3 text-yaei-text">{review.campsites?.name || "-"}</td>
                    <td className="px-4 py-3 text-yaei-text-secondary">{review.users?.display_name || "-"}</td>
                    <td className="px-4 py-3 text-yaei-gold text-xs">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </td>
                    <td className="px-4 py-3 text-yaei-text-secondary max-w-xs truncate">
                      {review.title || review.body.slice(0, 50)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${review.is_verified ? "bg-yaei-green/20 text-yaei-green-light" : "bg-yaei-surface text-yaei-text-secondary"}`}>
                        {review.is_verified ? "確認済" : "未確認"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-yaei-text-secondary text-xs">
                      {new Date(review.created_at).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleToggleVerify(review.id, review.is_verified)} className="text-xs text-yaei-gold hover:underline">
                          {review.is_verified ? "取消" : "確認"}
                        </button>
                        <button onClick={() => handleDelete(review.id)} className="text-xs text-yaei-rust hover:underline">
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 text-sm border border-yaei-green/20 rounded text-yaei-text-secondary disabled:opacity-30">前へ</button>
          <span className="text-sm text-yaei-text-secondary">{page} / {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 text-sm border border-yaei-green/20 rounded text-yaei-text-secondary disabled:opacity-30">次へ</button>
        </div>
      )}
    </div>
  );
}
