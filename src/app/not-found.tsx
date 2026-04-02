import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="ja">
      <body className="bg-[#0C0F0A] text-[#E8E4DC] min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-6xl font-bold text-[#D4A853] mb-4">404</p>
          <h1 className="text-xl font-bold mb-2">ページが見つかりません</h1>
          <p className="text-sm text-[#9A9688] mb-6">
            お探しのページは存在しないか、移動された可能性があります。
          </p>
          <Link
            href="/"
            className="inline-block bg-[#D4A853] text-[#0C0F0A] font-bold px-6 py-2 rounded"
          >
            トップへ
          </Link>
        </div>
      </body>
    </html>
  );
}
