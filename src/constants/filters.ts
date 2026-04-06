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

export const LEGAL_STATUS_LABELS = {
  authorized: "管理キャンプ場",
  public_riverbed: "河川敷（自由使用）",
  national_forest: "国有林野営場",
  natural_park_regular: "自然公園（普通地域）",
  natural_park_special: "自然公園（指定地）",
  private_permitted: "私有地（許可済み）",
  unconfirmed: "未確認",
  unknown: "不明",
} as const;

export const LEGAL_STATUS_DESCRIPTIONS = {
  authorized: "正式に許可・管理されたキャンプ場です。安心してご利用いただけます。",
  public_riverbed: "河川法に基づく自由使用が認められた河川敷です。自治体の条例により制限がある場合があります。",
  national_forest: "林野庁が「レクリエーションの森」として指定した国有林内の野営場です。",
  natural_park_regular: "自然公園法の普通地域に位置し、特別な規制はありません。ただし環境への配慮が必要です。",
  natural_park_special: "自然公園法の特別地域内です。指定されたテント場以外でのテント泊は法律で禁止されています（違反: 6ヶ月以下の懲役または50万円以下の罰金）。",
  private_permitted: "土地所有者の許可を得て利用可能な場所です。許可条件を確認してください。",
  unconfirmed: "法的な利用可否が未調査です。利用前に自治体や土地管理者に確認することをお勧めします。",
  unknown: "法的ステータスに関する情報がありません。",
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
