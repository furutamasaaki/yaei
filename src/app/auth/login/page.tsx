"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return url !== "" && !url.includes("placeholder");
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const errorParam = searchParams.get("error");

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(errorParam === "auth_failed" ? "認証に失敗しました" : "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const configured = isSupabaseConfigured();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!configured) {
      setError("Supabaseが未接続のため、ログイン機能は利用できません。.env.local にSupabaseの接続情報を設定してください。");
      return;
    }
    setLoading(true);
    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
          data: {
            full_name: displayName,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("確認メールを送信しました。メールのリンクをクリックしてください。");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        window.location.href = redirect;
      }
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    if (!configured) {
      setError("Supabaseが未接続のため、Googleログインは利用できません。");
      return;
    }
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-57px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <Link href="/">
            <span className="font-heading-en text-3xl font-bold tracking-wider text-yaei-gold">
              YAEI
            </span>
          </Link>
          <p className="text-yaei-text-secondary text-sm mt-2">
            {mode === "login" ? "アカウントにログイン" : "新規アカウント作成"}
          </p>
        </div>

        {!configured && (
          <div className="mb-4 bg-yaei-rust/10 border border-yaei-rust/30 rounded-lg p-4 text-sm text-yaei-text-secondary">
            <p className="font-bold text-yaei-rust mb-1">Supabase未接続</p>
            <p>認証機能を使用するには、Supabaseプロジェクトを作成し、<code className="text-yaei-text">.env.local</code> に接続情報を設定してください。</p>
          </div>
        )}

        <div className="bg-yaei-surface border border-yaei-green/10 rounded-lg p-6">
          {/* Googleログイン */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-100 transition-colors mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Googleでログイン
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-yaei-green/20" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-yaei-surface px-3 text-yaei-text-secondary">
                または
              </span>
            </div>
          </div>

          {/* メールフォーム */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm text-yaei-text-secondary mb-1">
                  表示名
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full bg-yaei-dark border border-yaei-green/20 rounded px-4 py-2.5 text-yaei-text text-sm outline-none focus:border-yaei-gold/50 transition-colors"
                  placeholder="キャンプ太郎"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-yaei-text-secondary mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-yaei-dark border border-yaei-green/20 rounded px-4 py-2.5 text-yaei-text text-sm outline-none focus:border-yaei-gold/50 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-yaei-text-secondary mb-1">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-yaei-dark border border-yaei-green/20 rounded px-4 py-2.5 text-yaei-text text-sm outline-none focus:border-yaei-gold/50 transition-colors"
                placeholder="6文字以上"
              />
            </div>

            {error && (
              <p className="text-sm text-yaei-rust bg-yaei-rust/10 border border-yaei-rust/20 rounded px-3 py-2">
                {error}
              </p>
            )}

            {message && (
              <p className="text-sm text-yaei-green-light bg-yaei-green/10 border border-yaei-green/20 rounded px-3 py-2">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yaei-gold hover:bg-yaei-gold-hover text-yaei-dark font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading
                ? "処理中..."
                : mode === "login"
                  ? "ログイン"
                  : "アカウント作成"}
            </button>
          </form>

          {/* モード切り替え */}
          <p className="text-center text-sm text-yaei-text-secondary mt-4">
            {mode === "login" ? (
              <>
                アカウントをお持ちでない方は{" "}
                <button
                  onClick={() => {
                    setMode("signup");
                    setError("");
                    setMessage("");
                  }}
                  className="text-yaei-gold hover:underline"
                >
                  新規登録
                </button>
              </>
            ) : (
              <>
                既にアカウントをお持ちの方は{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setMessage("");
                  }}
                  className="text-yaei-gold hover:underline"
                >
                  ログイン
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="text-yaei-text-secondary">読み込み中...</span>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
