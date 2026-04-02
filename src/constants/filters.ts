export const CAMPSITE_TYPE_LABELS = {
  managed: "管理キャンプ場",
  free: "無料キャンプ場",
  yaei: "野営場",
  wild: "野営地",
} as const;

export const DIRECT_FIRE_LABELS = {
  allowed: "直火OK",
  fire_pit_only: "焚き火台のみ",
  prohibited: "火気禁止",
  unknown: "不明",
} as const;

export const HAMMOCK_LABELS = {
  allowed: "ハンモック可",
  prohibited: "ハンモック不可",
  unknown: "不明",
} as const;

export const CAR_ACCESS_LABELS = {
  drive_in: "乗り入れ可",
  parking_walk: "駐車場から徒歩",
  no_car: "車両アクセス不可",
} as const;

export const TOILET_LABELS = {
  flush: "水洗トイレ",
  squat: "和式トイレ",
  portable: "簡易トイレ",
  none: "トイレなし",
  unknown: "不明",
} as const;

export const WATER_SOURCE_LABELS = {
  tap: "水道あり",
  river: "川の水",
  spring: "湧き水",
  none: "水場なし",
  unknown: "不明",
} as const;

export const TRASH_DISPOSAL_LABELS = {
  available: "ゴミ捨て場あり",
  carry_out: "持ち帰り",
  unknown: "不明",
} as const;

export const SIGNAL_LABELS = {
  strong: "電波良好",
  weak: "電波弱い",
  none: "圏外",
  unknown: "不明",
} as const;

export const STAR_GAZING_LABELS = {
  excellent: "最高",
  good: "良い",
  average: "普通",
  poor: "悪い",
  unknown: "不明",
} as const;

export const BUGS_LEVEL_LABELS = {
  low: "少ない",
  medium: "普通",
  high: "多い",
  unknown: "不明",
} as const;

export const NOISE_LEVEL_LABELS = {
  silent: "無音",
  quiet: "静か",
  moderate: "普通",
  noisy: "騒がしい",
  unknown: "不明",
} as const;

export const SEASON_LABELS = {
  spring: "春",
  summer: "夏",
  autumn: "秋",
  winter: "冬",
} as const;

export const REPORT_TYPE_LABELS = {
  road_condition: "道路状況",
  crowding: "混雑状況",
  weather: "天候",
  facility: "施設",
  signal: "電波状況",
  wildlife: "野生動物",
  other: "その他",
} as const;

export const SEVERITY_LABELS = {
  info: "情報",
  warning: "注意",
  danger: "危険",
} as const;
