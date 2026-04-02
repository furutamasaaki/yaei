"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const supabase = createClient();
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setIsAuthenticated(true);
        const { data: profile } = await supabase
          .from("users")
          .select("display_name")
          .eq("id", user.id)
          .single();
        if (profile) setDisplayName(profile.display_name);
      }
    };
    checkAuth();
  }, []);

  const AuthButton = ({ mobile = false }: { mobile?: boolean }) => {
    if (isAuthenticated) {
      return (
        <Link
          href="/mypage"
          className={
            mobile
              ? "flex items-center gap-2 text-yaei-text-secondary hover:text-yaei-text py-1"
              : "flex items-center gap-2 text-sm text-yaei-text-secondary hover:text-yaei-text transition-colors"
          }
          onClick={() => setMobileOpen(false)}
        >
          <span className="w-6 h-6 rounded-full bg-yaei-surface border border-yaei-green/20 flex items-center justify-center text-xs text-yaei-gold font-bold">
            {displayName?.[0] || "U"}
          </span>
          <span className="text-sm">{displayName || "マイページ"}</span>
        </Link>
      );
    }

    return (
      <Link
        href="/auth/login"
        className={
          mobile
            ? "bg-yaei-gold hover:bg-yaei-gold-hover text-yaei-dark text-sm font-bold px-4 py-2 rounded text-center"
            : "bg-yaei-gold hover:bg-yaei-gold-hover text-yaei-dark text-sm font-bold px-4 py-1.5 rounded transition-colors"
        }
        onClick={() => setMobileOpen(false)}
      >
        ログイン
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-30 bg-yaei-dark/95 backdrop-blur border-b border-yaei-surface">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading-en text-xl font-bold tracking-wider text-yaei-gold">
            YAEI
          </span>
        </Link>

        {/* デスクトップナビ */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            href="/search"
            className="text-yaei-text-secondary hover:text-yaei-text transition-colors"
          >
            検索
          </Link>
          <Link
            href="/search?type=yaei"
            className="text-yaei-text-secondary hover:text-yaei-text transition-colors"
          >
            野営場
          </Link>
          <Link
            href="/search?is_free=true"
            className="text-yaei-text-secondary hover:text-yaei-text transition-colors"
          >
            無料スポット
          </Link>
          <AuthButton />
        </nav>

        {/* モバイルハンバーガー */}
        <button
          className="md:hidden text-yaei-text-secondary p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="メニュー"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* モバイルメニュー */}
      {mobileOpen && (
        <div className="md:hidden border-t border-yaei-surface bg-yaei-dark">
          <nav className="flex flex-col p-4 gap-3 text-sm">
            <Link
              href="/search"
              className="text-yaei-text-secondary hover:text-yaei-text py-1"
              onClick={() => setMobileOpen(false)}
            >
              検索
            </Link>
            <Link
              href="/search?type=yaei"
              className="text-yaei-text-secondary hover:text-yaei-text py-1"
              onClick={() => setMobileOpen(false)}
            >
              野営場
            </Link>
            <Link
              href="/search?is_free=true"
              className="text-yaei-text-secondary hover:text-yaei-text py-1"
              onClick={() => setMobileOpen(false)}
            >
              無料スポット
            </Link>
            <AuthButton mobile />
          </nav>
        </div>
      )}
    </header>
  );
}
