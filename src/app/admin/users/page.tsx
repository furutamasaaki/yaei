"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types/user";

interface UserRow {
  id: string;
  display_name: string;
  role: UserRole;
  review_count: number;
  favorite_count: number;
  created_at: string;
}

const ROLE_LABELS: Record<UserRole, string> = {
  user: "ユーザー",
  scout: "スカウト",
  moderator: "モデレーター",
  admin: "管理者",
};

const ROLE_COLORS: Record<UserRole, string> = {
  user: "bg-yaei-surface text-yaei-text-secondary",
  scout: "bg-yaei-green/20 text-yaei-green-light",
  moderator: "bg-yaei-gold/20 text-yaei-gold",
  admin: "bg-yaei-rust/20 text-yaei-rust",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [editRole, setEditRole] = useState<UserRole>("user");

  const supabase = createClient();
  const limit = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("users")
      .select("id, display_name, role, review_count, favorite_count, created_at", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (search) query = query.ilike("display_name", `%${search}%`);

    const { data, count } = await query;
    setUsers((data as UserRow[]) || []);
    setTotal(count || 0);
    setLoading(false);
  }, [supabase, page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdateRole = async () => {
    if (!editingUser) return;
    await supabase.from("users").update({ role: editRole }).eq("id", editingUser.id);
    setEditingUser(null);
    fetchUsers();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-yaei-text">ユーザー管理</h1>
        <span className="text-sm text-yaei-text-secondary">{total}件</span>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="名前で検索..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="bg-yaei-surface border border-yaei-green/20 rounded px-3 py-2 text-sm text-yaei-text outline-none focus:border-yaei-gold/50 w-60"
        />
      </div>

      <div className="bg-yaei-surface border border-yaei-green/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-yaei-green/10 text-left text-xs text-yaei-text-secondary uppercase">
                <th className="px-4 py-3">名前</th>
                <th className="px-4 py-3">ロール</th>
                <th className="px-4 py-3">レビュー</th>
                <th className="px-4 py-3">お気に入り</th>
                <th className="px-4 py-3">登録日</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-yaei-text-secondary">読み込み中...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-yaei-text-secondary">ユーザーがいません</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-yaei-green/5 hover:bg-yaei-dark/30">
                    <td className="px-4 py-3 text-yaei-text font-medium">{user.display_name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${ROLE_COLORS[user.role]}`}>
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-yaei-text-secondary">{user.review_count}</td>
                    <td className="px-4 py-3 text-yaei-text-secondary">{user.favorite_count}</td>
                    <td className="px-4 py-3 text-yaei-text-secondary text-xs">
                      {new Date(user.created_at).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setEditingUser(user); setEditRole(user.role); }}
                        className="text-xs text-yaei-gold hover:underline"
                      >
                        ロール変更
                      </button>
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

      {/* ロール変更モーダル */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-yaei-dark border border-yaei-green/20 rounded-lg w-full max-w-sm p-6">
            <h2 className="font-heading font-bold text-yaei-text mb-4">ロール変更</h2>
            <p className="text-sm text-yaei-text-secondary mb-4">{editingUser.display_name}</p>
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value as UserRole)}
              className="w-full bg-yaei-surface border border-yaei-green/20 rounded px-3 py-2 text-sm text-yaei-text mb-4"
            >
              {Object.entries(ROLE_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button onClick={() => setEditingUser(null)} className="flex-1 border border-yaei-green/20 text-yaei-text-secondary py-2 rounded text-sm">キャンセル</button>
              <button onClick={handleUpdateRole} className="flex-1 bg-yaei-gold text-yaei-dark font-bold py-2 rounded text-sm">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
