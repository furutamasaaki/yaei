"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ReviewForm from "@/components/review/ReviewForm";
import ReportForm from "@/components/realtime/ReportForm";

interface SpotActionsProps {
  campsiteId: string;
}

export default function SpotActions({ campsiteId }: SpotActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsAuthenticated(true);
        const { data } = await supabase
          .from("favorites")
          .select("campsite_id")
          .eq("user_id", user.id)
          .eq("campsite_id", campsiteId)
          .single();

        setIsFavorite(!!data);
      }
    };

    checkAuth();
  }, [supabase, campsiteId]);

  const handleFavoriteToggle = useCallback(async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/spot/${campsiteId}`);
      return;
    }

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (isFavorite) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("campsite_id", campsiteId);
      setIsFavorite(false);
    } else {
      await supabase.from("favorites").insert({
        user_id: user.id,
        campsite_id: campsiteId,
      });
      setIsFavorite(true);
    }
    setLoading(false);
  }, [isAuthenticated, isFavorite, supabase, campsiteId, router]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("URLをコピーしました");
    }
  }, []);

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={handleFavoriteToggle}
          disabled={loading}
          className={`border px-4 py-2 rounded text-sm transition-colors ${
            isFavorite
              ? "border-yaei-gold bg-yaei-gold/20 text-yaei-gold"
              : "border-yaei-green/20 text-yaei-text-secondary hover:border-yaei-gold/30 hover:text-yaei-gold"
          }`}
        >
          {isFavorite ? "★ お気に入り済み" : "☆ お気に入り"}
        </button>
        <button
          onClick={handleShare}
          className="border border-yaei-green/20 text-yaei-text-secondary px-4 py-2 rounded text-sm hover:border-yaei-gold/30 hover:text-yaei-gold transition-colors"
        >
          共有
        </button>
        <button
          onClick={() => {
            if (!isAuthenticated) {
              router.push(`/auth/login?redirect=/spot/${campsiteId}`);
              return;
            }
            setShowReviewForm(true);
          }}
          className="border border-yaei-green/20 text-yaei-text-secondary px-4 py-2 rounded text-sm hover:border-yaei-gold/30 hover:text-yaei-gold transition-colors"
        >
          レビュー
        </button>
        <button
          onClick={() => {
            if (!isAuthenticated) {
              router.push(`/auth/login?redirect=/spot/${campsiteId}`);
              return;
            }
            setShowReportForm(true);
          }}
          className="border border-yaei-green/20 text-yaei-text-secondary px-4 py-2 rounded text-sm hover:border-yaei-gold/30 hover:text-yaei-gold transition-colors"
        >
          状況報告
        </button>
      </div>

      {showReviewForm && (
        <ReviewForm
          campsiteId={campsiteId}
          onSuccess={() => {
            setShowReviewForm(false);
            router.refresh();
          }}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {showReportForm && (
        <ReportForm
          campsiteId={campsiteId}
          onSuccess={() => {
            setShowReportForm(false);
            router.refresh();
          }}
          onCancel={() => setShowReportForm(false)}
        />
      )}
    </>
  );
}
