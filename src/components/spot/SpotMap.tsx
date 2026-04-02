"use client";

import dynamic from "next/dynamic";
import type { CampsiteWithAttributes } from "@/types/campsite";

const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-yaei-surface rounded-lg flex items-center justify-center">
      <span className="text-yaei-text-secondary text-sm">地図を読み込み中...</span>
    </div>
  ),
});

interface SpotMapProps {
  spot: CampsiteWithAttributes;
  className?: string;
}

export default function SpotMap({ spot, className = "h-64 md:h-80" }: SpotMapProps) {
  return (
    <MapView
      spots={[spot]}
      center={[spot.longitude, spot.latitude]}
      zoom={13}
      className={className}
      interactive
    />
  );
}
