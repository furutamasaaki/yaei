"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { REPORT_TYPE_LABELS, SEVERITY_LABELS } from "@/constants/filters";
import type { ReportType, Severity } from "@/types/review";

interface ReportFormProps {
  campsiteId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReportForm({
  campsiteId,
  onSuccess,
  onCancel,
}: ReportFormProps) {
  const [reportType, setReportType] = useState<ReportType | "">("");
  const [severity, setSeverity] = useState<Severity>("info");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportType) {
      setError("レポート種別を選択してください");
      return;
    }
    if (!message.trim()) {
      setError("内容を入力してください");
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

    // 有効期限を種別に応じて設定
    const expiryHours: Record<string, number> = {
      road_condition: 168,
      crowding: 24,
      weather: 48,
      facility: 336,
      signal: 720,
      wildlife: 72,
      other: 48,
    };
    const hours = expiryHours[reportType] || 48;
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

    const { error: submitError } = await supabase.from("realtime_reports").insert({
      campsite_id: campsiteId,
      user_id: user.id,
      report_type: reportType,
      severity,
      message: message.trim(),
      expires_at: expiresAt,
    });

    if (submitError) {
      setError(submitError.message);
    } else {
      onSuccess();
    }

    setSubmitting(false);
  };

  const severityColors: Record<Severity, string> = {
    info: "border-yaei-green/30 bg-yaei-green/10 text-yaei-green-light",
    warning: "border-yaei-rust/30 bg-yaei-rust/10 text-yaei-rust",
    danger: "border-red-500/30 bg-red-500/10 text-red-400",
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-yaei-dark border border-yaei-green/20 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-lg text-yaei-text">
              状況を報告
            </h2>
            <button
              onClick={onCancel}
              className="text-yaei-text-secondary hover:text-yaei-text"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* レポート種別 */}
            <div>
              <label className="block text-sm text-yaei-text-secondary mb-2">
                種別 *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setReportType(value as ReportType)}
                    className={`text-sm px-3 py-2 rounded border transition-colors ${
                      reportType === value
                        ? "border-yaei-gold bg-yaei-gold/20 text-yaei-gold"
                        : "border-yaei-green/20 text-yaei-text-secondary hover:border-yaei-gold/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 重要度 */}
            <div>
              <label className="block text-sm text-yaei-text-secondary mb-2">
                レベル
              </label>
              <div className="flex gap-2">
                {(Object.entries(SEVERITY_LABELS) as [Severity, string][]).map(
                  ([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSeverity(value)}
                      className={`flex-1 text-sm px-3 py-2 rounded border transition-colors ${
                        severity === value
                          ? severityColors[value]
                          : "border-yaei-green/20 text-yaei-text-secondary hover:border-yaei-gold/30"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* メッセージ */}
            <div>
              <label className="block text-sm text-yaei-text-secondary mb-1">
                内容 *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full bg-yaei-surface border border-yaei-green/20 rounded px-4 py-2.5 text-yaei-text text-sm outline-none focus:border-yaei-gold/50 resize-none"
                placeholder="現地の状況を詳しく教えてください..."
              />
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
                {submitting ? "投稿中..." : "報告する"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
