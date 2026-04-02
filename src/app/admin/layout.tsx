"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "ダッシュボード", icon: "◻" },
  { href: "/admin/spots", label: "スポット管理", icon: "◉" },
  { href: "/admin/reviews", label: "レビュー管理", icon: "★" },
  { href: "/admin/reports", label: "通報管理", icon: "⚑" },
  { href: "/admin/users", label: "ユーザー管理", icon: "◎" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* サイドバー */}
      <aside className="w-60 bg-yaei-surface border-r border-yaei-green/10 flex flex-col shrink-0">
        <div className="p-4 border-b border-yaei-green/10">
          <Link href="/admin">
            <span className="font-heading-en text-lg font-bold text-yaei-gold tracking-wider">
              YAEI
            </span>
            <span className="text-xs text-yaei-text-secondary ml-2">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  isActive
                    ? "bg-yaei-gold/10 text-yaei-gold border border-yaei-gold/20"
                    : "text-yaei-text-secondary hover:text-yaei-text hover:bg-yaei-dark/50"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-yaei-green/10">
          <Link
            href="/"
            className="text-xs text-yaei-text-secondary hover:text-yaei-text transition-colors"
          >
            ← サイトに戻る
          </Link>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
