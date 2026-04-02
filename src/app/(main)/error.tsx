"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md px-4">
        <p className="font-heading-en text-5xl font-bold text-yaei-rust mb-4">Error</p>
        <h1 className="font-heading text-xl font-bold text-yaei-text mb-2">
          エラーが発生しました
        </h1>
        <p className="text-sm text-yaei-text-secondary mb-6">
          {error.message || "予期しないエラーが発生しました。もう一度お試しください。"}
        </p>
        <button
          onClick={reset}
          className="bg-yaei-gold hover:bg-yaei-gold-hover text-yaei-dark font-bold px-6 py-2 rounded transition-colors"
        >
          再試行
        </button>
      </div>
    </div>
  );
}
