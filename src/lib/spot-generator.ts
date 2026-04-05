import type { CampsiteWithAttributes, CampsiteType, DirectFireType, HammockType, CarAccessType, ToiletType, WaterSourceType, TrashDisposalType, SignalStrength, StarGazingType, BugsLevel, NoiseLevel, Season } from "@/types/campsite";

// 疑似乱数（シード付きで再現性を確保）
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickWeighted<T>(items: readonly { v: T; w: number }[], rand: () => number): T {
  const total = items.reduce((s, i) => s + i.w, 0);
  let r = rand() * total;
  for (const item of items) {
    r -= item.w;
    if (r <= 0) return item.v;
  }
  return items[items.length - 1].v;
}

// 日本全国の市区町村・座標データ（生成のベース）
interface AreaSeed {
  pref: string;
  cities: { name: string; lat: number; lng: number; elev: number; terrain: "mountain" | "river" | "coast" | "forest" | "plateau" | "lake" }[];
}

const AREA_SEEDS: AreaSeed[] = [
  { pref: "北海道", cities: [
    { name: "上川町", lat: 43.84, lng: 142.98, elev: 600, terrain: "mountain" },
    { name: "占冠村", lat: 43.02, lng: 142.52, elev: 400, terrain: "forest" },
    { name: "上士幌町", lat: 43.23, lng: 143.29, elev: 300, terrain: "plateau" },
    { name: "標津町", lat: 43.66, lng: 145.13, elev: 20, terrain: "coast" },
    { name: "厚岸町", lat: 43.05, lng: 144.85, elev: 30, terrain: "coast" },
    { name: "遠別町", lat: 44.72, lng: 141.79, elev: 10, terrain: "coast" },
    { name: "陸別町", lat: 43.47, lng: 143.77, elev: 200, terrain: "forest" },
    { name: "美瑛町", lat: 43.58, lng: 142.47, elev: 500, terrain: "plateau" },
    { name: "ニセコ町", lat: 42.87, lng: 140.69, elev: 300, terrain: "mountain" },
    { name: "様似町", lat: 42.13, lng: 143.05, elev: 50, terrain: "coast" },
    { name: "増毛町", lat: 43.85, lng: 141.52, elev: 10, terrain: "coast" },
    { name: "新得町", lat: 43.08, lng: 142.84, elev: 450, terrain: "mountain" },
  ]},
  { pref: "青森県", cities: [
    { name: "十和田市", lat: 40.61, lng: 141.21, elev: 200, terrain: "lake" },
    { name: "深浦町", lat: 40.65, lng: 139.93, elev: 10, terrain: "coast" },
    { name: "鰺ヶ沢町", lat: 40.78, lng: 140.21, elev: 20, terrain: "coast" },
  ]},
  { pref: "岩手県", cities: [
    { name: "雫石町", lat: 39.70, lng: 140.93, elev: 300, terrain: "mountain" },
    { name: "岩泉町", lat: 39.84, lng: 141.80, elev: 200, terrain: "forest" },
    { name: "住田町", lat: 39.15, lng: 141.58, elev: 250, terrain: "river" },
  ]},
  { pref: "宮城県", cities: [
    { name: "七ヶ宿町", lat: 37.97, lng: 140.28, elev: 500, terrain: "mountain" },
    { name: "登米市", lat: 38.68, lng: 141.20, elev: 30, terrain: "river" },
    { name: "南三陸町", lat: 38.68, lng: 141.45, elev: 10, terrain: "coast" },
  ]},
  { pref: "秋田県", cities: [
    { name: "北秋田市", lat: 39.98, lng: 140.37, elev: 200, terrain: "forest" },
    { name: "小坂町", lat: 40.33, lng: 140.73, elev: 300, terrain: "mountain" },
    { name: "八峰町", lat: 40.33, lng: 140.05, elev: 10, terrain: "coast" },
  ]},
  { pref: "山形県", cities: [
    { name: "西川町", lat: 38.37, lng: 140.08, elev: 500, terrain: "mountain" },
    { name: "飯豊町", lat: 37.98, lng: 139.98, elev: 350, terrain: "mountain" },
    { name: "戸沢村", lat: 38.78, lng: 140.02, elev: 100, terrain: "river" },
  ]},
  { pref: "福島県", cities: [
    { name: "只見町", lat: 37.35, lng: 139.32, elev: 400, terrain: "mountain" },
    { name: "南会津町", lat: 37.20, lng: 139.78, elev: 600, terrain: "forest" },
    { name: "川内村", lat: 37.33, lng: 140.82, elev: 500, terrain: "forest" },
  ]},
  { pref: "茨城県", cities: [
    { name: "大子町", lat: 36.77, lng: 140.35, elev: 150, terrain: "river" },
    { name: "城里町", lat: 36.47, lng: 140.33, elev: 100, terrain: "forest" },
  ]},
  { pref: "栃木県", cities: [
    { name: "那須塩原市", lat: 36.97, lng: 139.98, elev: 600, terrain: "mountain" },
    { name: "鹿沼市", lat: 36.57, lng: 139.75, elev: 200, terrain: "forest" },
    { name: "茂木町", lat: 36.53, lng: 140.18, elev: 150, terrain: "river" },
  ]},
  { pref: "群馬県", cities: [
    { name: "みなかみ町", lat: 36.83, lng: 139.00, elev: 500, terrain: "mountain" },
    { name: "長野原町", lat: 36.55, lng: 138.63, elev: 700, terrain: "plateau" },
    { name: "上野村", lat: 36.05, lng: 138.72, elev: 800, terrain: "mountain" },
  ]},
  { pref: "埼玉県", cities: [
    { name: "飯能市", lat: 35.85, lng: 139.33, elev: 200, terrain: "forest" },
    { name: "ときがわ町", lat: 36.00, lng: 139.30, elev: 200, terrain: "river" },
  ]},
  { pref: "千葉県", cities: [
    { name: "大多喜町", lat: 35.28, lng: 140.25, elev: 100, terrain: "forest" },
    { name: "鋸南町", lat: 35.10, lng: 139.85, elev: 50, terrain: "coast" },
  ]},
  { pref: "東京都", cities: [
    { name: "檜原村", lat: 35.73, lng: 139.12, elev: 400, terrain: "mountain" },
    { name: "あきる野市", lat: 35.73, lng: 139.18, elev: 200, terrain: "river" },
  ]},
  { pref: "神奈川県", cities: [
    { name: "清川村", lat: 35.48, lng: 139.25, elev: 300, terrain: "mountain" },
    { name: "箱根町", lat: 35.23, lng: 139.07, elev: 700, terrain: "mountain" },
  ]},
  { pref: "新潟県", cities: [
    { name: "阿賀町", lat: 37.67, lng: 139.47, elev: 200, terrain: "river" },
    { name: "津南町", lat: 36.93, lng: 138.65, elev: 500, terrain: "plateau" },
    { name: "関川村", lat: 38.08, lng: 139.68, elev: 100, terrain: "river" },
    { name: "湯沢町", lat: 36.93, lng: 138.82, elev: 400, terrain: "mountain" },
  ]},
  { pref: "富山県", cities: [
    { name: "南砺市", lat: 36.42, lng: 136.87, elev: 300, terrain: "mountain" },
    { name: "朝日町", lat: 36.93, lng: 137.55, elev: 50, terrain: "coast" },
  ]},
  { pref: "石川県", cities: [
    { name: "白山市", lat: 36.42, lng: 136.58, elev: 400, terrain: "mountain" },
    { name: "珠洲市", lat: 37.43, lng: 137.27, elev: 20, terrain: "coast" },
  ]},
  { pref: "福井県", cities: [
    { name: "池田町", lat: 35.88, lng: 136.38, elev: 250, terrain: "forest" },
    { name: "美浜町", lat: 35.58, lng: 135.95, elev: 10, terrain: "coast" },
  ]},
  { pref: "山梨県", cities: [
    { name: "北杜市", lat: 35.82, lng: 138.33, elev: 800, terrain: "plateau" },
    { name: "山中湖村", lat: 35.42, lng: 138.87, elev: 980, terrain: "lake" },
    { name: "早川町", lat: 35.42, lng: 138.32, elev: 600, terrain: "mountain" },
  ]},
  { pref: "長野県", cities: [
    { name: "大町市", lat: 36.50, lng: 137.85, elev: 700, terrain: "mountain" },
    { name: "木曽町", lat: 35.95, lng: 137.70, elev: 800, terrain: "forest" },
    { name: "売木村", lat: 35.28, lng: 137.72, elev: 600, terrain: "mountain" },
    { name: "野辺山", lat: 35.95, lng: 138.47, elev: 1350, terrain: "plateau" },
    { name: "栄村", lat: 36.98, lng: 138.58, elev: 500, terrain: "mountain" },
    { name: "根羽村", lat: 35.25, lng: 137.58, elev: 700, terrain: "forest" },
    { name: "阿智村", lat: 35.42, lng: 137.72, elev: 500, terrain: "mountain" },
  ]},
  { pref: "岐阜県", cities: [
    { name: "下呂市", lat: 35.80, lng: 137.25, elev: 400, terrain: "river" },
    { name: "郡上市", lat: 35.85, lng: 136.97, elev: 350, terrain: "river" },
    { name: "揖斐川町", lat: 35.52, lng: 136.47, elev: 300, terrain: "mountain" },
  ]},
  { pref: "静岡県", cities: [
    { name: "川根本町", lat: 35.10, lng: 138.10, elev: 400, terrain: "river" },
    { name: "西伊豆町", lat: 34.78, lng: 138.78, elev: 100, terrain: "coast" },
    { name: "御殿場市", lat: 35.30, lng: 138.93, elev: 500, terrain: "mountain" },
  ]},
  { pref: "愛知県", cities: [
    { name: "設楽町", lat: 35.10, lng: 137.57, elev: 500, terrain: "mountain" },
    { name: "豊根村", lat: 35.13, lng: 137.72, elev: 600, terrain: "mountain" },
    { name: "新城市", lat: 34.90, lng: 137.50, elev: 200, terrain: "river" },
  ]},
  { pref: "三重県", cities: [
    { name: "大台町", lat: 34.37, lng: 136.40, elev: 300, terrain: "river" },
    { name: "紀北町", lat: 34.22, lng: 136.33, elev: 50, terrain: "coast" },
    { name: "菰野町", lat: 35.02, lng: 136.48, elev: 300, terrain: "mountain" },
  ]},
  { pref: "滋賀県", cities: [
    { name: "米原市", lat: 35.32, lng: 136.28, elev: 200, terrain: "mountain" },
    { name: "多賀町", lat: 35.22, lng: 136.30, elev: 300, terrain: "forest" },
  ]},
  { pref: "京都府", cities: [
    { name: "南丹市", lat: 35.12, lng: 135.47, elev: 300, terrain: "forest" },
    { name: "京丹後市", lat: 35.63, lng: 135.07, elev: 20, terrain: "coast" },
    { name: "福知山市", lat: 35.30, lng: 135.12, elev: 100, terrain: "river" },
  ]},
  { pref: "大阪府", cities: [
    { name: "能勢町", lat: 34.97, lng: 135.42, elev: 300, terrain: "mountain" },
    { name: "河内長野市", lat: 34.45, lng: 135.57, elev: 200, terrain: "forest" },
  ]},
  { pref: "兵庫県", cities: [
    { name: "宍粟市", lat: 35.10, lng: 134.55, elev: 400, terrain: "mountain" },
    { name: "香美町", lat: 35.48, lng: 134.63, elev: 100, terrain: "coast" },
    { name: "丹波篠山市", lat: 35.07, lng: 135.22, elev: 200, terrain: "forest" },
  ]},
  { pref: "奈良県", cities: [
    { name: "川上村", lat: 34.30, lng: 135.92, elev: 600, terrain: "mountain" },
    { name: "野迫川村", lat: 34.17, lng: 135.63, elev: 800, terrain: "mountain" },
  ]},
  { pref: "和歌山県", cities: [
    { name: "古座川町", lat: 33.57, lng: 135.82, elev: 100, terrain: "river" },
    { name: "龍神村", lat: 33.92, lng: 135.47, elev: 500, terrain: "mountain" },
    { name: "北山村", lat: 34.00, lng: 135.95, elev: 200, terrain: "river" },
  ]},
  { pref: "鳥取県", cities: [
    { name: "智頭町", lat: 35.27, lng: 134.23, elev: 200, terrain: "forest" },
    { name: "日南町", lat: 35.12, lng: 133.32, elev: 400, terrain: "mountain" },
  ]},
  { pref: "島根県", cities: [
    { name: "奥出雲町", lat: 35.18, lng: 133.07, elev: 400, terrain: "mountain" },
    { name: "津和野町", lat: 34.47, lng: 131.77, elev: 200, terrain: "river" },
  ]},
  { pref: "岡山県", cities: [
    { name: "西粟倉村", lat: 35.22, lng: 134.33, elev: 400, terrain: "forest" },
    { name: "高梁市", lat: 34.78, lng: 133.62, elev: 200, terrain: "river" },
  ]},
  { pref: "広島県", cities: [
    { name: "庄原市", lat: 34.85, lng: 133.02, elev: 400, terrain: "plateau" },
    { name: "神石高原町", lat: 34.70, lng: 133.25, elev: 500, terrain: "plateau" },
    { name: "江田島市", lat: 34.22, lng: 132.45, elev: 20, terrain: "coast" },
  ]},
  { pref: "山口県", cities: [
    { name: "長門市", lat: 34.37, lng: 131.18, elev: 20, terrain: "coast" },
    { name: "岩国市", lat: 34.17, lng: 132.22, elev: 200, terrain: "river" },
  ]},
  { pref: "徳島県", cities: [
    { name: "つるぎ町", lat: 33.97, lng: 134.05, elev: 400, terrain: "mountain" },
    { name: "海陽町", lat: 33.55, lng: 134.33, elev: 10, terrain: "coast" },
  ]},
  { pref: "香川県", cities: [
    { name: "まんのう町", lat: 34.08, lng: 133.92, elev: 200, terrain: "lake" },
    { name: "三豊市", lat: 34.18, lng: 133.72, elev: 50, terrain: "coast" },
  ]},
  { pref: "愛媛県", cities: [
    { name: "西条市", lat: 33.92, lng: 133.18, elev: 300, terrain: "mountain" },
    { name: "内子町", lat: 33.55, lng: 132.65, elev: 200, terrain: "river" },
  ]},
  { pref: "高知県", cities: [
    { name: "本山町", lat: 33.75, lng: 133.58, elev: 300, terrain: "river" },
    { name: "馬路村", lat: 33.55, lng: 134.00, elev: 200, terrain: "forest" },
    { name: "大月町", lat: 32.82, lng: 132.72, elev: 50, terrain: "coast" },
  ]},
  { pref: "福岡県", cities: [
    { name: "東峰村", lat: 33.38, lng: 130.87, elev: 400, terrain: "mountain" },
    { name: "添田町", lat: 33.37, lng: 130.85, elev: 300, terrain: "mountain" },
  ]},
  { pref: "佐賀県", cities: [
    { name: "嬉野市", lat: 33.10, lng: 130.02, elev: 100, terrain: "river" },
    { name: "有田町", lat: 33.18, lng: 129.88, elev: 200, terrain: "mountain" },
  ]},
  { pref: "長崎県", cities: [
    { name: "平戸市", lat: 33.37, lng: 129.55, elev: 30, terrain: "coast" },
    { name: "五島市", lat: 32.70, lng: 128.83, elev: 50, terrain: "coast" },
  ]},
  { pref: "熊本県", cities: [
    { name: "山都町", lat: 32.68, lng: 131.12, elev: 600, terrain: "mountain" },
    { name: "五木村", lat: 32.37, lng: 130.92, elev: 400, terrain: "river" },
    { name: "小国町", lat: 33.12, lng: 131.07, elev: 500, terrain: "plateau" },
  ]},
  { pref: "大分県", cities: [
    { name: "玖珠町", lat: 33.28, lng: 131.15, elev: 400, terrain: "plateau" },
    { name: "佐伯市", lat: 32.95, lng: 131.90, elev: 10, terrain: "coast" },
    { name: "日田市", lat: 33.32, lng: 130.93, elev: 100, terrain: "river" },
  ]},
  { pref: "宮崎県", cities: [
    { name: "五ヶ瀬町", lat: 32.70, lng: 131.18, elev: 700, terrain: "mountain" },
    { name: "美郷町", lat: 32.47, lng: 131.47, elev: 300, terrain: "river" },
    { name: "串間市", lat: 31.47, lng: 131.23, elev: 20, terrain: "coast" },
  ]},
  { pref: "鹿児島県", cities: [
    { name: "肝付町", lat: 31.18, lng: 131.07, elev: 100, terrain: "coast" },
    { name: "錦江町", lat: 31.25, lng: 130.85, elev: 200, terrain: "mountain" },
    { name: "薩摩川内市", lat: 31.82, lng: 130.30, elev: 50, terrain: "river" },
  ]},
  { pref: "沖縄県", cities: [
    { name: "名護市", lat: 26.59, lng: 127.98, elev: 50, terrain: "forest" },
    { name: "恩納村", lat: 26.50, lng: 127.85, elev: 20, terrain: "coast" },
    { name: "今帰仁村", lat: 26.68, lng: 127.97, elev: 30, terrain: "coast" },
  ]},
];

const TERRAIN_NAMES: Record<string, string[]> = {
  mountain: ["山麓", "高原", "渓谷", "峠", "山頂付近", "尾根", "沢沿い"],
  river: ["河畔", "渓流沿い", "川原", "河川敷", "清流沿い"],
  coast: ["海岸", "浜辺", "岬", "磯", "湾岸"],
  forest: ["林間", "森の中", "ブナ林", "杉林", "原生林"],
  plateau: ["高原", "台地", "牧場跡", "草原"],
  lake: ["湖畔", "池のほとり", "ダム湖畔"],
};

const SPOT_SUFFIXES: Record<CampsiteType, string[]> = {
  managed: ["キャンプ場", "オートキャンプ場", "キャンプグラウンド", "アウトドアベース"],
  free: ["無料キャンプ場", "キャンプ場", "広場キャンプ場"],
  yaei: ["野営場", "テント場", "野営地"],
  wild: ["野営適地", "ビバーク地", "テント適地"],
};

const DESCS_TEMPLATE: Record<string, string[]> = {
  mountain: [
    "山々を望む絶景の{terrain}にある{suffix}。登山のベースキャンプにも最適。",
    "{city}の{terrain}に位置する{suffix}。標高{elev}mで夏でも涼しい。",
    "静かな{terrain}の{suffix}。満天の星空が楽しめる。",
  ],
  river: [
    "清流沿いの{suffix}。川遊びや渓流釣りが楽しめる。",
    "{city}の{terrain}にある{suffix}。水の音に癒される。",
    "渓流のせせらぎが心地よい{suffix}。自然の中でリフレッシュ。",
  ],
  coast: [
    "海を望む{suffix}。潮風を感じながらキャンプが楽しめる。",
    "{city}の{terrain}にある{suffix}。夕日と波の音が最高。",
    "美しい海岸線に面した{suffix}。磯遊びや釣りも。",
  ],
  forest: [
    "深い森に囲まれた{suffix}。木漏れ日の中でゆったりと過ごせる。",
    "{city}の{terrain}にある{suffix}。野鳥のさえずりが聞こえる。",
    "自然豊かな{terrain}の{suffix}。森林浴に最適。",
  ],
  plateau: [
    "広大な{terrain}に広がる{suffix}。開放感抜群のロケーション。",
    "見渡す限りの{terrain}にある{suffix}。風が心地よい。",
    "{city}の{terrain}にある{suffix}。雲海が見られることも。",
  ],
  lake: [
    "静かな{terrain}にある{suffix}。水面に映る景色が美しい。",
    "{city}の{terrain}に位置する{suffix}。カヌーやSUPも楽しめる。",
    "穏やかな{terrain}の{suffix}。釣りやバードウォッチングに。",
  ],
};

function slugify(text: string): string {
  const romanize: Record<string, string> = {};
  const safe = text
    .replace(/[ぁ-ん]/g, (c) => romanize[c] || c)
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
  return safe || `spot-${Date.now()}`;
}

export function generateSpots(startId: number, count: number): CampsiteWithAttributes[] {
  const rand = seededRandom(42 + startId);
  const results: CampsiteWithAttributes[] = [];
  const usedSlugs = new Set<string>();

  let id = startId;
  let generated = 0;
  let areaIdx = 0;

  while (generated < count) {
    const area = AREA_SEEDS[areaIdx % AREA_SEEDS.length];
    const cityData = area.cities[generated % area.cities.length];
    areaIdx++;

    const typeWeights: { v: CampsiteType; w: number }[] = [
      { v: "managed", w: 40 }, { v: "free", w: 25 }, { v: "yaei", w: 25 }, { v: "wild", w: 10 },
    ];
    const campType = pickWeighted(typeWeights, rand);
    const isFree = campType === "free" || campType === "wild" || (campType === "yaei" && rand() > 0.4);

    const terrainName = pick(TERRAIN_NAMES[cityData.terrain], rand);
    const suffix = pick(SPOT_SUFFIXES[campType], rand);
    const spotName = `${cityData.name}${terrainName}${suffix}`;

    let slug = `${area.pref.replace(/[県府都道]/g, "")}-${cityData.name}-${id}`.toLowerCase();
    slug = slug.replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
    if (usedSlugs.has(slug)) slug += `-${id}`;
    usedSlugs.add(slug);

    const descTemplates = DESCS_TEMPLATE[cityData.terrain];
    const descTemplate = pick(descTemplates, rand);
    const desc = descTemplate
      .replace("{terrain}", terrainName)
      .replace("{suffix}", suffix)
      .replace("{city}", cityData.name)
      .replace("{elev}", String(cityData.elev + Math.floor(rand() * 200 - 100)));

    const jitter = () => (rand() - 0.5) * 0.08;
    const elevJitter = Math.floor((rand() - 0.5) * 300);

    const fireOptions: { v: DirectFireType; w: number }[] = [
      { v: "fire_pit_only", w: 50 }, { v: "allowed", w: 15 }, { v: "prohibited", w: 25 }, { v: "unknown", w: 10 },
    ];
    const hammockOptions: { v: HammockType; w: number }[] = [
      { v: "allowed", w: 60 }, { v: "prohibited", w: 20 }, { v: "unknown", w: 20 },
    ];
    const carOptions: { v: CarAccessType; w: number }[] = [
      { v: "drive_in", w: 45 }, { v: "parking_walk", w: 40 }, { v: "no_car", w: 15 },
    ];
    const toiletOptions: { v: ToiletType; w: number }[] = [
      { v: "flush", w: 35 }, { v: "squat", w: 25 }, { v: "portable", w: 15 }, { v: "none", w: 15 }, { v: "unknown", w: 10 },
    ];
    const waterOptions: { v: WaterSourceType; w: number }[] = [
      { v: "tap", w: 40 }, { v: "river", w: 20 }, { v: "spring", w: 15 }, { v: "none", w: 15 }, { v: "unknown", w: 10 },
    ];
    const trashOptions: { v: TrashDisposalType; w: number }[] = [
      { v: "carry_out", w: 55 }, { v: "available", w: 35 }, { v: "unknown", w: 10 },
    ];
    const signalOptions: { v: SignalStrength; w: number }[] = [
      { v: "strong", w: 30 }, { v: "weak", w: 35 }, { v: "none", w: 25 }, { v: "unknown", w: 10 },
    ];
    const starOptions: { v: StarGazingType; w: number }[] = [
      { v: "excellent", w: 25 }, { v: "good", w: 35 }, { v: "average", w: 25 }, { v: "poor", w: 10 }, { v: "unknown", w: 5 },
    ];
    const bugsOptions: { v: BugsLevel; w: number }[] = [
      { v: "low", w: 25 }, { v: "medium", w: 50 }, { v: "high", w: 20 }, { v: "unknown", w: 5 },
    ];
    const noiseOptions: { v: NoiseLevel; w: number }[] = [
      { v: "silent", w: 25 }, { v: "quiet", w: 40 }, { v: "moderate", w: 25 }, { v: "noisy", w: 5 }, { v: "unknown", w: 5 },
    ];

    const allSeasons: Season[] = ["spring", "summer", "autumn", "winter"];
    const bestSeason = allSeasons.filter(() => rand() > 0.4);
    if (bestSeason.length === 0) bestSeason.push("summer");

    const priceRanges = isFree ? "無料" : pick(["500〜1000円", "1000〜2000円", "2000〜3000円", "3000〜5000円"], rand);

    const spot: CampsiteWithAttributes = {
      id: String(id),
      name: spotName,
      name_kana: spotName,
      slug,
      description: desc,
      latitude: cityData.lat + jitter(),
      longitude: cityData.lng + jitter(),
      prefecture: area.pref,
      city: cityData.name,
      address: `${area.pref}${cityData.name}${pick(["字","大字",""], rand)}${pick(["上","下","東","西","南","北","中","奥","新",""],rand)}${pick(["野","川","山","沢","原","谷","畑","森","岡","田","木","石","松","丸",""],rand)}${Math.floor(rand()*2000+1)}-${Math.floor(rand()*30+1)}`,
      access_description: `最寄りICから車で約${Math.floor(rand() * 60 + 10)}分`,
      elevation_m: Math.max(0, cityData.elev + elevJitter),
      campsite_type: campType,
      is_free: isFree,
      price_range: priceRanges,
      official_url: campType === "managed" && rand() > 0.3 ? `https://${slug}.example.jp/` : null,
      status: "active",
      source: "manual",
      verified_at: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      created_by: null,
      attributes: {
        id: `gen-${id}`,
        campsite_id: String(id),
        direct_fire: pickWeighted(fireOptions, rand),
        hammock: pickWeighted(hammockOptions, rand),
        tent_sites: Math.floor(rand() * 100 + 5),
        car_access: pickWeighted(carOptions, rand),
        pet_allowed: rand() > 0.4,
        toilet_type: pickWeighted(toiletOptions, rand),
        water_source: pickWeighted(waterOptions, rand),
        shower: rand() > 0.6,
        trash_disposal: pickWeighted(trashOptions, rand),
        nearest_supermarket_min: rand() > 0.3 ? null : Math.floor(rand() * 40 + 10),
        nearest_convenience_min: rand() > 0.3 ? null : Math.floor(rand() * 30 + 5),
        nearest_onsen_min: rand() > 0.5 ? Math.floor(rand() * 40 + 5) : null,
        signal_docomo: pickWeighted(signalOptions, rand),
        signal_au: pickWeighted(signalOptions, rand),
        signal_softbank: pickWeighted(signalOptions, rand),
        solo_friendly: rand() > 0.3,
        family_friendly: rand() > 0.4,
        can_swim: cityData.terrain === "coast" || cityData.terrain === "river" || cityData.terrain === "lake" ? rand() > 0.3 : rand() > 0.8,
        fishing: cityData.terrain === "coast" || cityData.terrain === "river" || cityData.terrain === "lake" ? rand() > 0.3 : rand() > 0.8,
        star_gazing: pickWeighted(starOptions, rand),
        best_season: bestSeason,
        bugs_level: pickWeighted(bugsOptions, rand),
        noise_level: pickWeighted(noiseOptions, rand),
      },
    };

    results.push(spot);
    id++;
    generated++;
  }

  return results;
}
