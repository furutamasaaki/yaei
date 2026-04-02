import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-yaei-surface bg-yaei-dark">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ブランド */}
          <div>
            <p className="font-heading-en text-lg text-yaei-gold mb-2">YAEI</p>
            <p className="text-sm text-yaei-text-secondary">
              日本最大のキャンプ・野営地データベース
            </p>
          </div>

          {/* 検索 */}
          <div>
            <h4 className="text-sm font-bold text-yaei-text mb-3">検索</h4>
            <ul className="space-y-2 text-sm text-yaei-text-secondary">
              <li>
                <Link href="/search?type=yaei" className="hover:text-yaei-text transition-colors">
                  野営場を探す
                </Link>
              </li>
              <li>
                <Link href="/search?is_free=true" className="hover:text-yaei-text transition-colors">
                  無料キャンプ場
                </Link>
              </li>
              <li>
                <Link href="/search?direct_fire=allowed" className="hover:text-yaei-text transition-colors">
                  直火OKスポット
                </Link>
              </li>
              <li>
                <Link href="/search?solo_friendly=true" className="hover:text-yaei-text transition-colors">
                  ソロキャンプ向き
                </Link>
              </li>
            </ul>
          </div>

          {/* エリア */}
          <div>
            <h4 className="text-sm font-bold text-yaei-text mb-3">エリア</h4>
            <ul className="space-y-2 text-sm text-yaei-text-secondary">
              <li>
                <Link href="/search?prefecture=北海道" className="hover:text-yaei-text transition-colors">
                  北海道
                </Link>
              </li>
              <li>
                <Link href="/search?prefecture=長野県" className="hover:text-yaei-text transition-colors">
                  長野県
                </Link>
              </li>
              <li>
                <Link href="/search?prefecture=山梨県" className="hover:text-yaei-text transition-colors">
                  山梨県
                </Link>
              </li>
              <li>
                <Link href="/search?prefecture=静岡県" className="hover:text-yaei-text transition-colors">
                  静岡県
                </Link>
              </li>
            </ul>
          </div>

          {/* その他 */}
          <div>
            <h4 className="text-sm font-bold text-yaei-text mb-3">YAEI</h4>
            <ul className="space-y-2 text-sm text-yaei-text-secondary">
              <li>
                <Link href="/auth/login" className="hover:text-yaei-text transition-colors">
                  ログイン
                </Link>
              </li>
              <li>
                <Link href="/mypage" className="hover:text-yaei-text transition-colors">
                  マイページ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-yaei-surface text-center text-xs text-yaei-text-secondary">
          &copy; {new Date().getFullYear()} YAEI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
