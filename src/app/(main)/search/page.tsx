"use client";

import { useState, useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import SearchBar from "@/components/search/SearchBar";
import FilterSidebar, {
  defaultFilters,
  type FilterState,
} from "@/components/search/FilterSidebar";
import SpotCard from "@/components/spot/SpotCard";
import type { CampsiteWithAttributes } from "@/types/campsite";
import { MOCK_SPOTS } from "@/lib/mock-data";

// MapViewはSSR不可のためdynamic import
const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-yaei-surface rounded-lg flex items-center justify-center">
      <span className="text-yaei-text-secondary text-sm">地図を読み込み中...</span>
    </div>
  ),
});

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  // 初期フィルターをURLパラメータから復元
  const initialFilters: FilterState = {
    ...defaultFilters,
    prefecture: searchParams.get("prefecture") || "",
    type: searchParams.get("type") || "",
    is_free: searchParams.get("is_free") === "true",
    has_reservation: searchParams.get("has_reservation") === "true",
    direct_fire: searchParams.get("direct_fire") || "",
    car_access: searchParams.get("car_access") || "",
    solo_friendly: searchParams.get("solo_friendly") === "true",
    pet_allowed: searchParams.get("pet_allowed") === "true",
    hammock: searchParams.get("hammock") || "",
    signal_docomo: searchParams.get("signal_docomo") || "",
    star_gazing: searchParams.get("star_gazing") || "",
    noise_level: searchParams.get("noise_level") || "",
    can_swim: searchParams.get("can_swim") === "true",
    fishing: searchParams.get("fishing") === "true",
    onsen_nearby: searchParams.get("onsen_nearby") === "true",
    legal_status: searchParams.get("legal_status") || "",
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "map" | "list">("split");
  const [selectedSpot, setSelectedSpot] = useState<CampsiteWithAttributes | null>(null);

  // モックデータにフィルターを適用（Supabase接続後はAPIに差し替え）
  const spots = useMemo(() => {
    let result = MOCK_SPOTS;

    if (q) {
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      result = result.filter((s) => {
        const haystack = `${s.name} ${s.name_kana} ${s.prefecture} ${s.city} ${s.description}`.toLowerCase();
        return terms.every((term) => haystack.includes(term));
      });
    }
    if (filters.prefecture) result = result.filter((s) => s.prefecture === filters.prefecture);
    if (filters.type) result = result.filter((s) => s.campsite_type === filters.type);
    if (filters.is_free) result = result.filter((s) => s.is_free);
    if (filters.has_reservation) result = result.filter((s) => !!s.reservation_url);
    if (filters.direct_fire) result = result.filter((s) => s.attributes?.direct_fire === filters.direct_fire);
    if (filters.car_access) result = result.filter((s) => s.attributes?.car_access === filters.car_access);
    if (filters.solo_friendly) result = result.filter((s) => s.attributes?.solo_friendly);
    if (filters.pet_allowed) result = result.filter((s) => s.attributes?.pet_allowed);
    if (filters.hammock) result = result.filter((s) => s.attributes?.hammock === filters.hammock);
    if (filters.signal_docomo) result = result.filter((s) => s.attributes?.signal_docomo === filters.signal_docomo);
    if (filters.star_gazing) result = result.filter((s) => s.attributes?.star_gazing === filters.star_gazing);
    if (filters.noise_level) result = result.filter((s) => s.attributes?.noise_level === filters.noise_level);
    if (filters.can_swim) result = result.filter((s) => s.attributes?.can_swim);
    if (filters.fishing) result = result.filter((s) => s.attributes?.fishing);
    if (filters.onsen_nearby) result = result.filter((s) => s.attributes?.nearest_onsen_min != null && s.attributes.nearest_onsen_min <= 30);
    if (filters.legal_status) result = result.filter((s) => s.attributes?.legal_status === filters.legal_status);

    return result;
  }, [q, filters]);

  const total = spots.length;

  const handleSpotClick = useCallback((spot: CampsiteWithAttributes) => {
    setSelectedSpot(spot);
  }, []);

  const handleBoundsChange = useCallback(
    (_bounds: { sw_lat: number; sw_lng: number; ne_lat: number; ne_lng: number }) => {
      // TODO: bounds変更時にAPIから再取得
    },
    []
  );

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* フィルターサイドバー */}
      <FilterSidebar
        filters={filters}
        onFilterChange={setFilters}
        onReset={() => setFilters(defaultFilters)}
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
      />

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 検索ヘッダー */}
        <div className="border-b border-yaei-surface px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setFilterOpen(true)}
            className="lg:hidden shrink-0 border border-yaei-green/20 text-yaei-text-secondary px-3 py-2 rounded text-sm hover:border-yaei-gold/30 transition-colors"
          >
            フィルター
          </button>
          <div className="flex-1">
            <SearchBar defaultValue={q} size="md" />
          </div>
          {/* 表示切り替え */}
          <div className="hidden md:flex border border-yaei-green/20 rounded overflow-hidden">
            {(["split", "map", "list"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 text-xs transition-colors ${
                  viewMode === mode
                    ? "bg-yaei-gold text-yaei-dark"
                    : "text-yaei-text-secondary hover:text-yaei-text"
                }`}
              >
                {mode === "split" ? "分割" : mode === "map" ? "地図" : "リスト"}
              </button>
            ))}
          </div>
        </div>

        {/* 検索結果エリア */}
        <div className="flex-1 flex overflow-hidden">
          {/* 地図 */}
          {(viewMode === "split" || viewMode === "map") && (
            <div
              className={`${
                viewMode === "split" ? "w-1/2 hidden md:block" : "w-full"
              }`}
            >
              <MapView
                spots={spots}
                onSpotClick={handleSpotClick}
                onBoundsChange={handleBoundsChange}
                className="h-full"
              />
            </div>
          )}

          {/* リスト */}
          {(viewMode === "split" || viewMode === "list") && (
            <div
              className={`overflow-y-auto ${
                viewMode === "split" ? "w-full md:w-1/2" : "w-full"
              }`}
            >
              <div className="p-4">
                <p className="text-sm text-yaei-text-secondary mb-4">
                  {q && (
                    <span>
                      「<span className="text-yaei-gold">{q}</span>」の検索結果:{" "}
                    </span>
                  )}
                  {total}件のスポット
                </p>

                {spots.length > 0 ? (
                  <div className="space-y-3">
                    {spots.map((spot) => (
                      <SpotCard
                        key={spot.id}
                        spot={spot}
                        compact={viewMode === "split"}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-yaei-text-secondary text-lg mb-2">
                      条件に一致するスポットがありません
                    </p>
                    <p className="text-yaei-text-secondary text-sm">
                      フィルターを変更して再検索してください。
                    </p>
                  </div>
                )}
              </div>

              {/* 選択されたスポットのプレビュー */}
              {selectedSpot && (
                <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-yaei-surface border border-yaei-gold/30 rounded-lg p-4 shadow-xl z-20">
                  <button
                    onClick={() => setSelectedSpot(null)}
                    className="absolute top-2 right-2 text-yaei-text-secondary hover:text-yaei-text"
                  >
                    ✕
                  </button>
                  <SpotCard spot={selectedSpot} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-57px)]">
          <span className="text-yaei-text-secondary">読み込み中...</span>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
