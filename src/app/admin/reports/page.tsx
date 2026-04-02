"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AbuseStatus } from "@/types/user";

interface ReportRow {
  id: string;
  target_type: string;
  target_id: string;
  reason: string;
  description: string;
  status: AbuseStatus;
  created_at: string;
  resolved_at: string | null;
  users: { display_name: string } | null;
}

const REASON_LABELS: Record<string, string> = {
  illegal_location: "違法な場所",
  private_land: "私有地",
  inaccurate: "不正確",
  spam: "スパム",
  inappropriate: "不適切",
  other: "その他",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "未処理",
  reviewed: "確認済",
  resolved: "解決済",
  dismissed: "却下",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yaei-rust/20 text-yaei-rust",
  reviewed: "bg-yaei-gold/20 text-yaei-gold",
  resolved: "bg-yaei-green/20 text-yaei-green-light",
  dismissed: "bg-yaei-text-secondary/20 text-yaei-text-secondary",
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const limit = 20;

  const fetchReports = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("reports_abuse")
      .select("*, users!reports_abuse_reporter_id_fkey(display_name)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (filterStatus) query = query.eq("status", filterStatus);

    const { data, count } = await query;
    setReports((data as unknown as ReportRow[]) || []);
    setTotal(count || 0);
    setLoading(false);
  }, [supabase, page, filterStatus]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleUpdateStatus = async (id: string, newStatus: AbuseStatus) => {
    const update: Record<string, unknown> = { status: newStatus };
    if (newStatus === "resolved" || newStatus === "dismissed") {
      update.resolved_at = new Date().toISOString();
    }
    await supabase.from("reports_abuse").update(update).eq("id", id);
    fetchReports();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-yaei-text">通報管理</h1>
        <span className="text-sm text-yaei-text-secondary">{total}件</span>
      </div>

      {/* ステータスフィルター */}
      <div className="flex gap-2 mb-6">
        {[
          { value: "pending", label: "未処理" },
          { value: "reviewed", label: "確認済" },
          { value: "resolved", label: "解決済" },
          { value: "dismissed", label: "却下" },
          { value: "", label: "すべて" },
        ].map((s) => (
          <button
            key={s.value}
            onClick={() => { setFilterStatus(s.value); setPage(1); }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filterStatus === s.value
                ? "border-yaei-gold bg-yaei-gold/20 text-yaei-gold"
                : "border-yaei-green/20 text-yaei-text-secondary hover:border-yaei-gold/30"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-yaei-text-secondary py-8">読み込み中...</p>
        ) : reports.length === 0 ? (
          <p className="text-center text-yaei-text-secondary py-8">通報がありません</p>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-yaei-surface border border-yaei-green/10 rounded-lg p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${STATUS_COLORS[report.status]}`}>
                      {STATUS_LABELS[report.status]}
                    </span>
                    <span className="text-xs text-yaei-text-secondary">
                      {report.target_type} / {REASON_LABELS[report.reason] || report.reason}
                    </span>
                    <span className="text-xs text-yaei-text-secondary">
                      報告者: {report.users?.display_name || "不明"}
                    </span>
                  </div>
                  <p className="text-sm text-yaei-text mb-1">{report.description}</p>
                  <p className="text-xs text-yaei-text-secondary">
                    対象ID: {report.target_id.slice(0, 8)}...
                    {" / "}
                    {new Date(report.created_at).toLocaleDateString("ja-JP")}
                  </p>
                </div>

                {report.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleUpdateStatus(report.id, "resolved")}
                      className="text-xs bg-yaei-green/20 text-yaei-green-light px-3 py-1.5 rounded hover:bg-yaei-green/30"
                    >
                      解決
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(report.id, "dismissed")}
                      className="text-xs border border-yaei-green/20 text-yaei-text-secondary px-3 py-1.5 rounded hover:border-yaei-gold/30"
                    >
                      却下
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
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
