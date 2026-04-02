export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-yaei-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-yaei-text-secondary">読み込み中...</p>
      </div>
    </div>
  );
}
