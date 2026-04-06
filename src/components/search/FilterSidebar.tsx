"use client";

import { useCallback } from "react";
import {
  CAMPSITE_TYPE_LABELS,
  DIRECT_FIRE_LABELS,
  CAR_ACCESS_LABELS,
  SIGNAL_LABELS,
  STAR_GAZING_LABELS,
  NOISE_LEVEL_LABELS,
  LEGAL_STATUS_LABELS,
} from "@/constants/filters";
import { PREFECTURES, REGIONS } from "@/constants/prefectures";

export interface FilterState {
  prefecture: string;
  type: string;
  is_free: boolean;
  direct_fire: string;
  car_access: string;
  solo_friendly: boolean;
  pet_allowed: boolean;
  hammock: string;
  signal_docomo: string;
  star_gazing: string;
  noise_level: string;
  can_swim: boolean;
  fishing: boolean;
  legal_status: string;
}

export const defaultFilters: FilterState = {
  prefecture: "",
  type: "",
  is_free: false,
  direct_fire: "",
  car_access: "",
  solo_friendly: false,
  pet_allowed: false,
  hammock: "",
  signal_docomo: "",
  star_gazing: "",
  noise_level: "",
  can_swim: false,
  fishing: false,
  legal_status: "",
};

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onReset,
  isOpen,
  onClose,
}: FilterSidebarProps) {
  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      onFilterChange({ ...filters, [key]: value });
    },
    [filters, onFilterChange]
  );

  const activeCount = Object.entries(filters).filter(([, v]) => {
    if (typeof v === "boolean") return v;
    return v !== "";
  }).length;

  return (
    <>
      {/* モバイルオーバーレイ */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-yaei-dark border-r border-yaei-surface z-50 overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 lg:z-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-yaei-text">
              フィルター
              {activeCount > 0 && (
                <span className="ml-2 text-xs bg-yaei-gold text-yaei-dark px-2 py-0.5 rounded-full">
                  {activeCount}
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2">
              {activeCount > 0 && (
                <button
                  onClick={onReset}
                  className="text-xs text-yaei-rust hover:text-yaei-gold transition-colors"
                >
                  リセット
                </button>
              )}
              <button
                onClick={onClose}
                className="lg:hidden text-yaei-text-secondary hover:text-yaei-text"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 都道府県 */}
          <FilterSection title="都道府県">
            <select
              value={filters.prefecture}
              onChange={(e) => updateFilter("prefecture", e.target.value)}
              className="w-full bg-yaei-surface border border-yaei-green/20 rounded px-3 py-2 text-sm text-yaei-text"
            >
              <option value="">すべて</option>
              {REGIONS.map((region) => (
                <optgroup key={region} label={region}>
                  {PREFECTURES.filter((p) => p.region === region).map((p) => (
                    <option key={p.code} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </FilterSection>

          {/* スポットタイプ */}
          <FilterSection title="タイプ">
            <div className="flex flex-wrap gap-2">
              {Object.entries(CAMPSITE_TYPE_LABELS).map(([value, label]) => (
                <FilterChip
                  key={value}
                  label={label}
                  active={filters.type === value}
                  onClick={() =>
                    updateFilter("type", filters.type === value ? "" : value)
                  }
                />
              ))}
            </div>
          </FilterSection>

          {/* 料金 */}
          <FilterSection title="料金">
            <FilterToggle
              label="無料のみ"
              checked={filters.is_free}
              onChange={(v) => updateFilter("is_free", v)}
            />
          </FilterSection>

          {/* 直火 */}
          <FilterSection title="直火">
            <div className="flex flex-wrap gap-2">
              {Object.entries(DIRECT_FIRE_LABELS)
                .filter(([k]) => k !== "unknown")
                .map(([value, label]) => (
                  <FilterChip
                    key={value}
                    label={label}
                    active={filters.direct_fire === value}
                    onClick={() =>
                      updateFilter("direct_fire", filters.direct_fire === value ? "" : value)
                    }
                  />
                ))}
            </div>
          </FilterSection>

          {/* 車アクセス */}
          <FilterSection title="車アクセス">
            <div className="flex flex-wrap gap-2">
              {Object.entries(CAR_ACCESS_LABELS).map(([value, label]) => (
                <FilterChip
                  key={value}
                  label={label}
                  active={filters.car_access === value}
                  onClick={() =>
                    updateFilter("car_access", filters.car_access === value ? "" : value)
                  }
                />
              ))}
            </div>
          </FilterSection>

          {/* スタイル */}
          <FilterSection title="スタイル">
            <div className="space-y-2">
              <FilterToggle
                label="ソロ向き"
                checked={filters.solo_friendly}
                onChange={(v) => updateFilter("solo_friendly", v)}
              />
              <FilterToggle
                label="ペットOK"
                checked={filters.pet_allowed}
                onChange={(v) => updateFilter("pet_allowed", v)}
              />
              <FilterToggle
                label="水遊び可"
                checked={filters.can_swim}
                onChange={(v) => updateFilter("can_swim", v)}
              />
              <FilterToggle
                label="釣り可"
                checked={filters.fishing}
                onChange={(v) => updateFilter("fishing", v)}
              />
            </div>
          </FilterSection>

          {/* 電波 */}
          <FilterSection title="携帯電波 (docomo)">
            <div className="flex flex-wrap gap-2">
              {Object.entries(SIGNAL_LABELS)
                .filter(([k]) => k !== "unknown")
                .map(([value, label]) => (
                  <FilterChip
                    key={value}
                    label={label}
                    active={filters.signal_docomo === value}
                    onClick={() =>
                      updateFilter("signal_docomo", filters.signal_docomo === value ? "" : value)
                    }
                  />
                ))}
            </div>
          </FilterSection>

          {/* 星空 */}
          <FilterSection title="星空">
            <div className="flex flex-wrap gap-2">
              {Object.entries(STAR_GAZING_LABELS)
                .filter(([k]) => k !== "unknown")
                .map(([value, label]) => (
                  <FilterChip
                    key={value}
                    label={label}
                    active={filters.star_gazing === value}
                    onClick={() =>
                      updateFilter("star_gazing", filters.star_gazing === value ? "" : value)
                    }
                  />
                ))}
            </div>
          </FilterSection>

          {/* 騒音レベル */}
          <FilterSection title="静けさ">
            <div className="flex flex-wrap gap-2">
              {Object.entries(NOISE_LEVEL_LABELS)
                .filter(([k]) => k !== "unknown")
                .map(([value, label]) => (
                  <FilterChip
                    key={value}
                    label={label}
                    active={filters.noise_level === value}
                    onClick={() =>
                      updateFilter("noise_level", filters.noise_level === value ? "" : value)
                    }
                  />
                ))}
            </div>
          </FilterSection>

          {/* 法的ステータス */}
          <FilterSection title="法的ステータス">
            <div className="flex flex-wrap gap-2">
              {Object.entries(LEGAL_STATUS_LABELS)
                .filter(([k]) => k !== "unknown")
                .map(([value, label]) => (
                  <FilterChip
                    key={value}
                    label={label}
                    active={filters.legal_status === value}
                    onClick={() =>
                      updateFilter("legal_status", filters.legal_status === value ? "" : value)
                    }
                  />
                ))}
            </div>
          </FilterSection>
        </div>
      </aside>
    </>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-bold text-yaei-text-secondary uppercase tracking-wider mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? "border-yaei-gold bg-yaei-gold/20 text-yaei-gold"
          : "border-yaei-green/20 text-yaei-text-secondary hover:border-yaei-gold/30 hover:text-yaei-text"
      }`}
    >
      {label}
    </button>
  );
}

function FilterToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div
        className={`w-8 h-4.5 rounded-full transition-colors relative ${
          checked ? "bg-yaei-gold" : "bg-yaei-surface border border-yaei-green/20"
        }`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
      <span className="text-sm text-yaei-text-secondary group-hover:text-yaei-text transition-colors">
        {label}
      </span>
    </label>
  );
}
