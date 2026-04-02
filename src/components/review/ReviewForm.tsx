"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SEASON_LABELS } from "@/constants/filters";
import type { Season } from "@/types/campsite";

interface ReviewFormProps {
  campsiteId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReviewForm({
  campsiteId,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [visitedDate, setVisitedDate] = useState("");
  const [visitedSeason, setVisitedSeason] = useState<Season | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("評価を選択してください");
      return;
    }

    setSubmitting(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("ログインが必要です");
      setSubmitting(false);
      return;
    }

    const { error: submitError } = await supabase.from("reviews").insert({
      campsite_id: campsiteId,
      user_id: user.id,
      rating,
      title,
      body,
      visited_date: visitedDate || null,
      visited_season: visitedSeason || null,
    });

    if (submitError) {
      setError(submitError.message);
    } else {
      onSuccess();
    }

    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-yaei-dark border border-yaei-green/20 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-lg text-yaei-text">
              レビューを書く
            </h2>
            <button
              onClick={onCancel}
              className="text-yaei-text-secondary hover:text-yaei-text"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 星評価 */}
            <div>
              <label className="block text-sm text-yaei-text-secondary mb-2">
                評価 *
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-3xl transition-colors"
                  >
                    <span
                      className={
                        star <= (hoverRating || rating)
                          ? "text-yaei-gold"
                          : "text-yaei-surface"
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* タイトル */}
            <div>
              <label className="block text-sm text-yaei-text-secondary mb-1">
                タイトル
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-yaei-surface border border-yaei-green/20 rounded px-4 py-2.5 text-yaei-text text-sm outline-none focus:border-yaei-gold/50"
                placeholder="一言で感想を"
              />
            </div>

            {/* 本文 */}
            <div>
              <label className="block text-sm text-yaei-text-secondary mb-1">
                レビュー
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="w-full bg-yaei-surface border border-yaei-green/20 rounded px-4 py-2.5 text-yaei-text text-sm outline-none focus:border-yaei-gold/50 resize-none"
                placeholder="キャンプの感想を書いてください..."
              />
            </div>

            {/* 訪問日・季節 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-yaei-text-secondary mb-1">
                  訪問日
                </label>
                <input
                  type="date"
                  value={visitedDate}
                  onChange={(e) => setVisitedDate(e.target.value)}
                  className="w-full bg-yaei-surface border border-yaei-green/20 rounded px-4 py-2.5 text-yaei-text text-sm outline-none focus:border-yaei-gold/50"
                />
              </div>
              <div>
                <label className="block text-sm text-yaei-text-secondary mb-1">
                  季節
                </label>
                <select
                  value={visitedSeason}
                  onChange={(e) => setVisitedSeason(e.target.value as Season | "")}
                  className="w-full bg-yaei-surface border border-yaei-green/20 rounded px-4 py-2.5 text-yaei-text text-sm outline-none focus:border-yaei-gold/50"
                >
                  <option value="">選択してください</option>
                  {Object.entries(SEASON_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <p className="text-sm text-yaei-rust bg-yaei-rust/10 border border-yaei-rust/20 rounded px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 border border-yaei-green/20 text-yaei-text-secondary py-2.5 rounded transition-colors hover:border-yaei-gold/30"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-yaei-gold hover:bg-yaei-gold-hover text-yaei-dark font-bold py-2.5 rounded transition-colors disabled:opacity-50"
              >
                {submitting ? "投稿中..." : "投稿する"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
