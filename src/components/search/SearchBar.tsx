"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  defaultValue?: string;
  size?: "lg" | "md";
  className?: string;
}

export default function SearchBar({
  defaultValue = "",
  size = "md",
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  }, [query, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSearch();
    },
    [handleSearch]
  );

  return (
    <div className={`flex rounded-lg bg-yaei-surface border border-yaei-green/20 overflow-hidden ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="地名・スポット名で検索..."
        className={`flex-1 bg-transparent text-yaei-text placeholder:text-yaei-text-secondary/60 outline-none ${
          size === "lg" ? "px-5 py-4" : "px-4 py-3 text-sm"
        }`}
      />
      <button
        onClick={handleSearch}
        className={`bg-yaei-gold hover:bg-yaei-gold-hover text-yaei-dark font-bold transition-colors ${
          size === "lg" ? "px-6" : "px-4 text-sm"
        }`}
      >
        検索
      </button>
    </div>
  );
}
