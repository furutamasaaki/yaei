import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md px-4">
        <p className="font-heading-en text-6xl font-bold text-yaei-gold mb-4">404</p>
        <h1 className="font-heading text-xl font-bold text-yaei-text mb-2">
          ページが見つかりません
        </h1>
        <p className="text-sm text-yaei-text-secondary mb-6">
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="bg-yaei-gold hover:bg-yaei-gold-hover text-yaei-dark font-bold px-6 py-2 rounded transition-colors"
          >
            トップへ
          </Link>
          <Link
            href="/search"
            className="border border-yaei-green/20 text-yaei-text-secondary hover:text-yaei-text px-6 py-2 rounded transition-colors"
          >
            検索する
          </Link>
        </div>
      </div>
    </div>
  );
}
