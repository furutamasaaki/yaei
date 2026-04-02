# YAEI（野営）プロジェクト

日本国内のキャンプ場・野営場に特化した検索プラットフォーム。

## 技術スタック
- Next.js 16 (App Router) + TypeScript (strict)
- Tailwind CSS v4
- MapLibre GL JS (OpenFreeMap tiles)
- Supabase (PostgreSQL + PostGIS + Auth + Storage)

## コマンド
- `npm run dev` — 開発サーバー起動 (localhost:3000)
- `npm run build` — 本番ビルド
- `npm run lint` — ESLint実行

## ディレクトリ構成
- `src/app/(main)/` — メインサイト（トップ、検索、スポット詳細、都道府県別、マイページ）
- `src/app/admin/` — 管理画面（ダッシュボード、スポット/レビュー/通報/ユーザー管理）
- `src/app/auth/` — 認証（ログイン、コールバック、ログアウト）
- `src/app/api/` — API Routes（spots, search, reviews, reports, favorites）
- `src/components/` — コンポーネント（map, search, spot, review, realtime, layout, ui）
- `src/lib/supabase/` — Supabaseクライアント（client, server, admin）
- `supabase/migrations/` — DBマイグレーション
- `supabase/seed.sql` — シードデータ

## デザインシステム
- ダークテーマ: `#0C0F0A`, サーフェス: `#1C2418`, ゴールド: `#D4A853`, グリーン: `#4A7C59`
- フォント: Noto Serif JP / Cormorant Garamond / Zen Kaku Gothic New

## 環境変数 (.env.local)
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SITE_URL
