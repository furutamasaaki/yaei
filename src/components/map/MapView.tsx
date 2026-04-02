"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { CampsiteWithAttributes } from "@/types/campsite";

interface MapViewProps {
  spots?: CampsiteWithAttributes[];
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  onBoundsChange?: (bounds: {
    sw_lat: number;
    sw_lng: number;
    ne_lat: number;
    ne_lng: number;
  }) => void;
  onSpotClick?: (spot: CampsiteWithAttributes) => void;
  className?: string;
  interactive?: boolean;
}

const JAPAN_CENTER: [number, number] = [137.0, 36.5];
const DEFAULT_ZOOM = 5.5;

// OpenFreeMapのタイルURL（無料・登録不要）
const TILE_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export default function MapView({
  spots = [],
  center = JAPAN_CENTER,
  zoom = DEFAULT_ZOOM,
  onBoundsChange,
  onSpotClick,
  className = "",
  interactive = true,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // マーカーを作成するヘルパー
  const createMarkerElement = useCallback(
    (spot: CampsiteWithAttributes) => {
      const el = document.createElement("div");
      el.className = "yaei-marker";

      // タイプに応じた色
      const colors: Record<string, string> = {
        managed: "#4A7C59",
        free: "#D4A853",
        yaei: "#A0522D",
        wild: "#6B9E7A",
      };
      const color = colors[spot.campsite_type] || "#4A7C59";

      el.style.cssText = `
        width: 28px;
        height: 28px;
        background: ${color};
        border: 2px solid #E8E4DC;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        transition: transform 0.15s;
      `;

      el.addEventListener("mouseenter", () => {
        el.style.transform = "rotate(-45deg) scale(1.2)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "rotate(-45deg) scale(1)";
      });

      if (onSpotClick) {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSpotClick(spot);
        });
      }

      return el;
    },
    [onSpotClick]
  );

  // 地図の初期化
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const newMap = new maplibregl.Map({
      container: mapContainer.current,
      style: TILE_STYLE,
      center,
      zoom,
      minZoom: 4,
      maxZoom: 18,
      interactive,
    });

    if (interactive) {
      newMap.addControl(new maplibregl.NavigationControl(), "top-right");
      newMap.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: false,
        }),
        "top-right"
      );
    }

    newMap.on("load", () => {
      setIsLoaded(true);
    });

    // bounds変更時のコールバック
    if (onBoundsChange) {
      newMap.on("moveend", () => {
        const bounds = newMap.getBounds();
        onBoundsChange({
          sw_lat: bounds.getSouth(),
          sw_lng: bounds.getWest(),
          ne_lat: bounds.getNorth(),
          ne_lng: bounds.getEast(),
        });
      });
    }

    map.current = newMap;

    return () => {
      newMap.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // スポットマーカーの更新
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // 既存マーカーを削除
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    spots.forEach((spot) => {
      const el = createMarkerElement(spot);
      const popup = new maplibregl.Popup({
        offset: 20,
        closeButton: false,
        maxWidth: "240px",
      }).setHTML(`
        <div style="font-family: sans-serif; padding: 4px;">
          <strong style="font-size: 13px; color: #1C2418;">${spot.name}</strong>
          <p style="font-size: 11px; color: #666; margin: 4px 0 0;">
            ${spot.prefecture} ${spot.city}
          </p>
          <p style="font-size: 11px; color: #A0522D; margin: 2px 0 0;">
            ${spot.is_free ? "無料" : spot.price_range}
          </p>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([spot.longitude, spot.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [spots, isLoaded, createMarkerElement]);

  // centerやzoomの変更に追従
  useEffect(() => {
    if (!map.current || !isLoaded) return;
    map.current.flyTo({ center, zoom, duration: 1000 });
  }, [center, zoom, isLoaded]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-yaei-surface rounded-lg">
          <div className="text-yaei-text-secondary text-sm">地図を読み込み中...</div>
        </div>
      )}
    </div>
  );
}
