"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { CAMPSITE_TYPE_LABELS } from "@/constants/filters";
import { PREFECTURES } from "@/constants/prefectures";
import type { CampsiteType, CampsiteStatus } from "@/types/campsite";

interface SpotRow {
  id: string;
  name: string;
  prefecture: string;
  city: string;
  campsite_type: CampsiteType;
  status: CampsiteStatus;
  is_free: boolean;
  created_at: string;
}

export default function AdminSpotsPage() {
  const [spots, setSpots] = useState<SpotRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPrefecture, setFilterPrefecture] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingSpot, setEditingSpot] = useState<SpotRow | null>(null);
  const [editStatus, setEditStatus] = useState<CampsiteStatus>("active");

  const supabase = createClient();
  const limit = 20;

  const fetchSpots = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("campsites")
      .select("id, name, prefecture, city, campsite_type, status, is_free, created_at", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (filterStatus) query = query.eq("status", filterStatus);
    if (filterPrefecture) query = query.eq("prefecture", filterPrefecture);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, count } = await query;
    setSpots((data as SpotRow[]) || []);
    setTotal(count || 0);
    setLoading(false);
  }, [supabase, page, filterStatus, filterPrefecture, search]);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  const handleUpdateStatus = async () => {
    if (!editingSpot) return;
    await supabase
      .from("campsites")
      .update({ status: editStatus })
      .eq("id", editingSpot.id);
    setEditingSpot(null);
    fetchSpots();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除しますか？この操作は取り消せません。`)) return;
    await supabase.from("campsites").delete().eq("id", id);
    fetchSpots();
  };

  const totalPages = Math.ceil(total / limit);

  const statusLabels: Record<string, string> = {
    active: "有効",
    unverified: "未確認",
    closed: "閉鎖",
    seasonal: "季節限定",
  };
  const statusColors: Record<string, string> = {
    active: "bg-yaei-green/20 text-yaei-green-light",
    unverified: "bg-yaei-rust/20 text-yaei-rust",
    closed: "bg-yaei-text-secondary/20 text-yaei-text-secondary",
    seasonal: "bg-yaei-gold/20 text-yaei-gold",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-yaei-text">
          スポット管理
        </h1>
        <span className="text-sm text-yaei-text-secondary">{total}件</span>
      </div>

      {/* フィルター */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="名前で検索..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="bg-yaei-surface border border-yaei-green/20 rounded px-3 py-2 text-sm text-yaei-text outline-none focus:border-yaei-gold/50 w-60"
        />
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="bg-yaei-surface border border-yaei-green/20 rounded px-3 py-2 text-sm text-yaei-text"
        >
          <option value="">全ステータス</option>
          {Object.entries(statusLabels).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          value={filterPrefecture}
          onChange={(e) => { setFilterPrefecture(e.target.value); setPage(1); }}
          className="bg-yaei-surface border border-yaei-green/20 rounded px-3 py-2 text-sm text-yaei-text"
        >
          <option value="">全都道府県</option>
          {PREFECTURES.map((p) => (
            <option key={p.code} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* テーブル */}
      <div className="bg-yaei-surface border border-yaei-green/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-yaei-green/10 text-left text-xs text-yaei-text-secondary uppercase">
                <th className="px-4 py-3">名前</th>
                <th className="px-4 py-3">都道府県</th>
                <th className="px-4 py-3">タイプ</th>
                <th className="px-4 py-3">ステータス</th>
                <th className="px-4 py-3">料金</th>
                <th className="px-4 py-3">登録日</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-yaei-text-secondary">
                    読み込み中...
                  </td>
                </tr>
              ) : spots.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-yaei-text-secondary">
                    スポットがありません
                  </td>
                </tr>
              ) : (
                spots.map((spot) => (
                  <tr key={spot.id} className="border-b border-yaei-green/5 hover:bg-yaei-dark/30">
                    <td className="px-4 py-3 text-yaei-text font-medium">{spot.name}</td>
                    <td className="px-4 py-3 text-yaei-text-secondary">{spot.prefecture}</td>
                    <td className="px-4 py-3 text-yaei-text-secondary">
                      {CAMPSITE_TYPE_LABELS[spot.campsite_type]}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusColors[spot.status]}`}>
                        {statusLabels[spot.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-yaei-text-secondary">
                      {spot.is_free ? "無料" : "有料"}
                    </td>
                    <td className="px-4 py-3 text-yaei-text-secondary text-xs">
                      {new Date(spot.created_at).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingSpot(spot); setEditStatus(spot.status); }}
                          className="text-xs text-yaei-gold hover:underline"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(spot.id, spot.name)}
                          className="text-xs text-yaei-rust hover:underline"
                        >
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

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm border border-yaei-green/20 rounded text-yaei-text-secondary hover:text-yaei-text disabled:opacity-30"
          >
            前へ
          </button>
          <span className="text-sm text-yaei-text-secondary">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm border border-yaei-green/20 rounded text-yaei-text-secondary hover:text-yaei-text disabled:opacity-30"
          >
            次へ
          </button>
        </div>
      )}

      {/* ステータス変更モーダル */}
      {editingSpot && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-yaei-dark border border-yaei-green/20 rounded-lg w-full max-w-sm p-6">
            <h2 className="font-heading font-bold text-yaei-text mb-4">
              ステータス変更
            </h2>
            <p className="text-sm text-yaei-text-secondary mb-4">{editingSpot.name}</p>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as CampsiteStatus)}
              className="w-full bg-yaei-surface border border-yaei-green/20 rounded px-3 py-2 text-sm text-yaei-text mb-4"
            >
              {Object.entries(statusLabels).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setEditingSpot(null)}
                className="flex-1 border border-yaei-green/20 text-yaei-text-secondary py-2 rounded text-sm"
              >
                キャンセル
              </button>
              <button
                onClick={handleUpdateStatus}
                className="flex-1 bg-yaei-gold text-yaei-dark font-bold py-2 rounded text-sm"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
