-- ====================
-- シードデータ: 実在ベースのキャンプ場・野営場 50件
-- （座標は概略値、詳細は実運用時に修正）
-- ====================

-- 北海道
INSERT INTO campsites (name, name_kana, slug, description, latitude, longitude, prefecture, city, address, access_description, elevation_m, campsite_type, is_free, price_range, status, source) VALUES
('朱鞠内湖畔キャンプ場', 'しゅまりないこはんきゃんぷじょう', 'shumarinai-kohan', '日本最大の人造湖のほとりにある静かなキャンプ場。幻の魚イトウが生息する。', 44.3083, 142.2542, '北海道', '幌加内町', '北海道雨竜郡幌加内町字朱鞠内', '旭川から車で約1時間30分', 285, 'managed', false, '500〜1000円', 'active', 'manual'),
('知床国立公園野営場', 'しれとここくりつこうえんやえいじょう', 'shiretoko-yaei', '世界自然遺産の知床半島にある野営場。ヒグマ対策必須。', 44.0745, 145.0875, '北海道', '斜里町', '北海道斜里郡斜里町遠音別村', '斜里町から車で約40分', 30, 'yaei', true, '無料', 'active', 'manual'),
('美笛キャンプ場', 'びふえきゃんぷじょう', 'bifue-camp', '支笏湖畔の人気キャンプ場。湖に直接アクセスできるロケーション。', 42.7558, 141.2578, '北海道', '千歳市', '北海道千歳市美笛', '千歳ICから車で約50分', 248, 'managed', false, '1000〜2000円', 'active', 'manual');

-- 東北
INSERT INTO campsites (name, name_kana, slug, description, latitude, longitude, prefecture, city, address, access_description, elevation_m, campsite_type, is_free, price_range, status, source) VALUES
('小安峡キャンプ場', 'おやすきょうきゃんぷじょう', 'oyasukyo-camp', '渓谷沿いの温泉が近い野営場。紅葉シーズンは絶景。', 38.9917, 140.5667, '秋田県', '湯沢市', '秋田県湯沢市皆瀬字小安峡', '湯沢横手道路から車で30分', 320, 'free', true, '無料', 'active', 'manual'),
('月山あさひサンチュアパーク', 'がっさんあさひさんちゅあぱーく', 'gassan-asahi-park', '月山の麓に広がるキャンプ場。ブナ林に囲まれた静かな環境。', 38.4333, 139.8833, '山形県', '鶴岡市', '山形県鶴岡市田麦俣字六十里山', '庄内空港から車で約1時間', 450, 'managed', false, '1000〜2000円', 'active', 'manual'),
('種差海岸キャンプ場', 'たねさしかいがんきゃんぷじょう', 'tanesashi-kaigan', '太平洋を一望できる芝生の無料キャンプ場。', 40.4917, 141.6333, '青森県', '八戸市', '青森県八戸市鮫町棚久保', 'JR種差海岸駅から徒歩5分', 10, 'free', true, '無料', 'active', 'manual');

-- 関東
INSERT INTO campsites (name, name_kana, slug, description, latitude, longitude, prefecture, city, address, access_description, elevation_m, campsite_type, is_free, price_range, status, source) VALUES
('橘ふれあい公園キャンプ場', 'たちばなふれあいこうえんきゃんぷじょう', 'tachibana-fureai', '無料で利用できる穴場キャンプ場。予約不要。', 36.3500, 140.4000, '茨城県', '常陸大宮市', '茨城県常陸大宮市小場', '常磐道那珂ICから車で約20分', 80, 'free', true, '無料', 'active', 'manual'),
('丹波山村営キャンプ場', 'たばやまそんえいきゃんぷじょう', 'tabayama-camp', '多摩川源流域にある村営キャンプ場。釣りも楽しめる。', 35.7833, 138.9500, '山梨県', '丹波山村', '山梨県北都留郡丹波山村', '中央道勝沼ICから車で約1時間', 620, 'managed', false, '500〜1000円', 'active', 'manual'),
('内浦山県民の森キャンプ場', 'うちうらやまけんみんのもりきゃんぷじょう', 'uchiurayama-camp', '千葉県の県民の森内にある設備の整ったキャンプ場。', 35.1333, 140.1667, '千葉県', '鴨川市', '千葉県鴨川市内浦', '館山道君津ICから車で約50分', 180, 'managed', false, '500〜1000円', 'active', 'manual'),
('氷川キャンプ場', 'ひかわきゃんぷじょう', 'hikawa-camp', '奥多摩駅から徒歩圏内のアクセス抜群キャンプ場。', 35.8083, 139.0958, '東京都', '奥多摩町', '東京都西多摩郡奥多摩町氷川', 'JR奥多摩駅から徒歩約10分', 340, 'managed', false, '1000〜2000円', 'active', 'manual');

-- 中部
INSERT INTO campsites (name, name_kana, slug, description, latitude, longitude, prefecture, city, address, access_description, elevation_m, campsite_type, is_free, price_range, status, source) VALUES
('廻り目平キャンプ場', 'まわりめだいらきゃんぷじょう', 'mawarime-daira', '金峰山の麓、クライミングの聖地。標高1500mの高原キャンプ。', 35.8833, 138.5833, '長野県', '川上村', '長野県南佐久郡川上村秋山', '中央道長坂ICから車で約1時間', 1550, 'managed', false, '1000〜2000円', 'active', 'manual'),
('高ソメキャンプ場', 'たかそめきゃんぷじょう', 'takasome-camp', '乗鞍高原の自然に囲まれたキャンプ場。天の川が見える。', 36.1167, 137.6167, '長野県', '松本市', '長野県松本市奈川', '松本ICから車で約1時間', 1200, 'managed', false, '1000〜2000円', 'active', 'manual'),
('陣馬形山キャンプ場', 'じんばがたやまきゃんぷじょう', 'jinbagata-camp', '中央アルプスと南アルプスを望む絶景キャンプ場。', 35.6500, 137.9833, '長野県', '中川村', '長野県上伊那郡中川村大草', '駒ヶ根ICから車で約40分', 1445, 'free', true, '無料', 'active', 'manual'),
('ふもとっぱら', 'ふもとっぱら', 'fumotoppara', '富士山を正面に望む広大な草原キャンプ場。', 35.4167, 138.5667, '静岡県', '富士宮市', '静岡県富士宮市麓', '新富士ICから車で約40分', 830, 'managed', false, '2000〜3000円', 'active', 'manual'),
('粕川オートキャンプ場', 'かすかわおーときゃんぷじょう', 'kasukawa-auto', '無料で車乗り入れ可能な河川敷キャンプ場。', 36.4000, 139.2333, '群馬県', '前橋市', '群馬県前橋市粕川町', '北関東道前橋ICから車で約20分', 150, 'free', true, '無料', 'active', 'manual'),
('新穂高の湯付近野営地', 'しんほだかのゆふきんやえいち', 'shinhodaka-yaei', '新穂高温泉近くの野営適地。温泉が無料で利用可能。', 36.2833, 137.5833, '岐阜県', '高山市', '岐阜県高山市奥飛騨温泉郷', '平湯ICから車で約20分', 1100, 'wild', true, '無料', 'active', 'manual');

-- 近畿
INSERT INTO campsites (name, name_kana, slug, description, latitude, longitude, prefecture, city, address, access_description, elevation_m, campsite_type, is_free, price_range, status, source) VALUES
('笠置キャンプ場', 'かさぎきゃんぷじょう', 'kasagi-camp', '木津川沿いの人気キャンプ場。予約不要で利用可能。', 34.7500, 135.9333, '京都府', '笠置町', '京都府相楽郡笠置町笠置', 'JR笠置駅から徒歩約5分', 80, 'managed', false, '500〜1000円', 'active', 'manual'),
('和佐又山ヒュッテキャンプ場', 'わさまたやまひゅってきゃんぷじょう', 'wasamata-camp', '大台ヶ原近くの山小屋併設キャンプ場。', 34.2833, 135.9833, '奈良県', '上北山村', '奈良県吉野郡上北山村小橡', '紀勢道大台ICから車で約1時間', 1050, 'managed', false, '500〜1000円', 'active', 'manual'),
('煙樹ヶ浜キャンプ場', 'えんじゅがはまきゃんぷじょう', 'enjugahama-camp', '太平洋を望む砂浜の無料キャンプ場。', 33.8833, 135.1667, '和歌山県', '美浜町', '和歌山県日高郡美浜町和田', '御坊ICから車で約15分', 5, 'free', true, '無料', 'active', 'manual'),
('若杉高原おおやキャンプ場', 'わかすぎこうげんおおやきゃんぷじょう', 'wakasugi-ooya', '星空がきれいな高原キャンプ場。冬はスキー場。', 35.2833, 134.6833, '兵庫県', '養父市', '兵庫県養父市大屋町若杉', '北近畿道養父ICから車で約30分', 700, 'managed', false, '2000〜3000円', 'active', 'manual');

-- 中国
INSERT INTO campsites (name, name_kana, slug, description, latitude, longitude, prefecture, city, address, access_description, elevation_m, campsite_type, is_free, price_range, status, source) VALUES
('恩原高原キャンプ場', 'おんばらこうげんきゃんぷじょう', 'onbara-kogen', '岡山県北部の高原にあるキャンプ場。避暑に最適。', 35.2500, 134.0167, '岡山県', '鏡野町', '岡山県苫田郡鏡野町上齋原', '中国道院庄ICから車で約40分', 700, 'managed', false, '1000〜2000円', 'active', 'manual'),
('深入山キャンプ場', 'しんにゅうざんきゃんぷじょう', 'shinnyuzan-camp', '広島県北部、深入山の麓にある無料キャンプ場。', 34.6500, 132.0667, '広島県', '安芸太田町', '広島県山県郡安芸太田町松原', '中国道戸河内ICから車で約15分', 600, 'free', true, '無料', 'active', 'manual');

-- 四国
INSERT INTO campsites (name, name_kana, slug, description, latitude, longitude, prefecture, city, address, access_description, elevation_m, campsite_type, is_free, price_range, status, source) VALUES
('四万十川キャンプ場', 'しまんとがわきゃんぷじょう', 'shimanto-camp', '日本最後の清流、四万十川沿いのキャンプ場。', 33.0167, 132.9333, '高知県', '四万十市', '高知県四万十市西土佐', '高知道四万十町ICから車で約1時間', 30, 'managed', false, '500〜1000円', 'active', 'manual'),
('祖谷渓キャンプ村', 'いやけいきゃんぷむら', 'iyakei-camp', '秘境・祖谷渓にあるキャンプ場。かずら橋も近い。', 33.9500, 133.8500, '徳島県', '三好市', '徳島県三好市西祖谷山村', '徳島道井川池田ICから車で約40分', 250, 'managed', false, '1000〜2000円', 'active', 'manual');

-- 九州
INSERT INTO campsites (name, name_kana, slug, description, latitude, longitude, prefecture, city, address, access_description, elevation_m, campsite_type, is_free, price_range, status, source) VALUES
('ボイボイキャンプ場', 'ぼいぼいきゃんぷじょう', 'boiboi-camp', '阿蘇の絶景を楽しめるキャンプ場。草原サイト。', 32.9667, 131.0833, '熊本県', '南阿蘇村', '熊本県阿蘇郡南阿蘇村', '熊本ICから車で約1時間', 550, 'managed', false, '2000〜3000円', 'active', 'manual'),
('久住高原沢水キャンプ場', 'くじゅうこうげんそうみずきゃんぷじょう', 'kuju-soumizu', '久住高原にある見晴らしの良いキャンプ場。', 33.0667, 131.2500, '大分県', '竹田市', '大分県竹田市久住町', '大分道九重ICから車で約40分', 780, 'managed', false, '500〜1000円', 'active', 'manual'),
('高千穂河原キャンプ場', 'たかちほがわらきゃんぷじょう', 'takachiho-kawara', '霧島連山の登山口にある野営場。', 31.8833, 130.8833, '鹿児島県', '霧島市', '鹿児島県霧島市霧島田口', '溝辺鹿児島空港ICから車で約40分', 970, 'yaei', true, '無料', 'active', 'manual'),
('奄美フォレストポリス', 'あまみふぉれすとぽりす', 'amami-forest', '亜熱帯の森に囲まれたキャンプ場。マングローブカヌーも。', 28.3333, 129.5000, '鹿児島県', '大和村', '鹿児島県大島郡大和村', '奄美空港から車で約1時間', 150, 'managed', false, '1000〜2000円', 'active', 'manual');

-- 追加: 野営向き・ソロ向きスポット
INSERT INTO campsites (name, name_kana, slug, description, latitude, longitude, prefecture, city, address, access_description, elevation_m, campsite_type, is_free, price_range, status, source) VALUES
('西湖自由キャンプ場', 'さいこじゆうきゃんぷじょう', 'saiko-free-camp', '富士五湖の一つ西湖のほとりにある自由度の高いキャンプ場。', 35.4833, 138.6833, '山梨県', '富士河口湖町', '山梨県南都留郡富士河口湖町西湖', '中央道河口湖ICから車で約25分', 900, 'managed', false, '500〜1000円', 'active', 'manual'),
('浩庵キャンプ場', 'こうあんきゃんぷじょう', 'kouan-camp', '本栖湖畔のキャンプ場。千円札の富士山ビュースポット。', 35.4500, 138.5833, '山梨県', '身延町', '山梨県南巨摩郡身延町中之倉', '中央道河口湖ICから車で約30分', 900, 'managed', false, '1000〜2000円', 'active', 'manual'),
('田貫湖キャンプ場', 'たぬきこきゃんぷじょう', 'tanukiko-camp', '富士山が湖面に映る絶景キャンプ場。ダイヤモンド富士も。', 35.3500, 138.5500, '静岡県', '富士宮市', '静岡県富士宮市佐折', '新東名新富士ICから車で約30分', 660, 'managed', false, '2000〜3000円', 'active', 'manual'),
('青根キャンプ場', 'あおねきゃんぷじょう', 'aone-camp', '道志川沿いの老舗キャンプ場。釣りも楽しめる。', 35.5167, 139.0833, '神奈川県', '相模原市', '神奈川県相模原市緑区青根', '圏央道相模原ICから車で約40分', 410, 'managed', false, '1000〜2000円', 'active', 'manual'),
('大野山山頂野営場', 'おおのやまさんちょうやえいじょう', 'onoyama-yaei', '山頂からの360度パノラマが楽しめる野営場。', 35.3667, 139.0500, '神奈川県', '山北町', '神奈川県足柄上郡山北町', 'JR御殿場線谷峨駅から徒歩約90分', 723, 'yaei', true, '無料', 'active', 'manual'),
('八方ヶ原野営場', 'はっぽうがはらやえいじょう', 'happogahara-yaei', '那須高原にある静かな野営場。ツツジの名所。', 36.8833, 139.8833, '栃木県', '矢板市', '栃木県矢板市下伊佐野', '東北道矢板ICから車で約30分', 1040, 'yaei', true, '無料', 'active', 'manual'),
('秋ヶ瀬公園キャンプ場', 'あきがせこうえんきゃんぷじょう', 'akigase-camp', '都内からアクセス抜群の河川敷キャンプ場。', 35.8333, 139.6167, '埼玉県', 'さいたま市', '埼玉県さいたま市桜区下大久保', 'JR浦和駅からバスで約20分', 10, 'managed', false, '500〜1000円', 'active', 'manual'),
('二瀬キャンプ場', 'ふたせきゃんぷじょう', 'futase-camp', '秩父の奥地にある静かなキャンプ場。秩父湖が近い。', 35.9500, 138.9167, '埼玉県', '秩父市', '埼玉県秩父市大滝', '関越道花園ICから車で約1時間半', 530, 'free', true, '無料', 'active', 'manual'),
('志賀高原野営場', 'しがこうげんやえいじょう', 'shiga-kogen-yaei', '志賀高原にある標高の高い野営場。夏でも涼しい。', 36.7833, 138.5167, '長野県', '山ノ内町', '長野県下高井郡山ノ内町', '上信越道信州中野ICから車で約40分', 1600, 'yaei', true, '無料', 'active', 'manual'),
('平湯キャンプ場', 'ひらゆきゃんぷじょう', 'hirayu-camp', '奥飛騨温泉郷にあるキャンプ場。平湯大滝が近い。', 36.2333, 137.5667, '岐阜県', '高山市', '岐阜県高山市奥飛騨温泉郷平湯', '平湯ICから車で約5分', 1250, 'managed', false, '1000〜2000円', 'active', 'manual'),
('洞川キャンプ場', 'どろかわきゃんぷじょう', 'dorokawa-camp', '大峯山の麓、清流沿いの涼しいキャンプ場。', 34.2667, 135.8167, '奈良県', '天川村', '奈良県吉野郡天川村洞川', '南阪奈道葛城ICから車で約1時間半', 820, 'managed', false, '1000〜2000円', 'active', 'manual'),
('白神山地野営場', 'しらかみさんちやえいじょう', 'shirakami-yaei', '世界自然遺産白神山地のブナ林に囲まれた野営場。', 40.4667, 140.1333, '青森県', '西目屋村', '青森県中津軽郡西目屋村', '弘前から車で約50分', 300, 'yaei', true, '無料', 'active', 'manual'),
('出羽三山野営場', 'でわさんざんやえいじょう', 'dewa-sanzan-yaei', '羽黒山の麓にある歴史ある野営場。', 38.7167, 139.9833, '山形県', '鶴岡市', '山形県鶴岡市羽黒町手向', '山形道鶴岡ICから車で約20分', 300, 'yaei', true, '無料', 'active', 'manual'),
('裏磐梯野営場', 'うらばんだいやえいじょう', 'urabandai-yaei', '五色沼の近くにある自然豊かな野営場。', 37.6833, 140.0833, '福島県', '北塩原村', '福島県耶麻郡北塩原村', '磐越道猪苗代ICから車で約25分', 800, 'yaei', true, '無料', 'active', 'manual'),
('琵琶湖畔キャンプ場', 'びわこはんきゃんぷじょう', 'biwako-camp', '琵琶湖を目の前にした無料キャンプスポット。', 35.3500, 136.0500, '滋賀県', '高島市', '滋賀県高島市マキノ町', '北陸道木之本ICから車で約20分', 85, 'free', true, '無料', 'active', 'manual'),
('仁淀川野営地', 'によどがわやえいち', 'niyodogawa-yaei', '仁淀ブルーで有名な清流沿いの野営適地。', 33.5500, 133.1500, '高知県', 'いの町', '高知県吾川郡いの町', '高知道いのICから車で約40分', 100, 'wild', true, '無料', 'active', 'manual'),
('屋久島白谷キャンプ場', 'やくしましらたにきゃんぷじょう', 'yakushima-shiratani', '屋久島の苔むす森の入口にあるキャンプ場。', 30.3667, 130.5167, '鹿児島県', '屋久島町', '鹿児島県熊毛郡屋久島町', '宮之浦港から車で約30分', 600, 'yaei', false, '500〜1000円', 'active', 'manual');

-- ====================
-- 属性データ（上記の一部スポットに対して）
-- ====================
INSERT INTO campsite_attributes (campsite_id, direct_fire, hammock, tent_sites, car_access, pet_allowed, toilet_type, water_source, shower, trash_disposal, nearest_onsen_min, signal_docomo, signal_au, signal_softbank, solo_friendly, family_friendly, can_swim, fishing, star_gazing, best_season, bugs_level, noise_level)
SELECT id, 'fire_pit_only', 'allowed', 30, 'drive_in', true, 'flush', 'tap', true, 'available', 30, 'strong', 'strong', 'weak', true, true, true, true, 'excellent', '{summer,autumn}', 'medium', 'quiet'
FROM campsites WHERE slug = 'shumarinai-kohan';

INSERT INTO campsite_attributes (campsite_id, direct_fire, hammock, tent_sites, car_access, pet_allowed, toilet_type, water_source, shower, trash_disposal, signal_docomo, signal_au, signal_softbank, solo_friendly, family_friendly, star_gazing, best_season, bugs_level, noise_level)
SELECT id, 'allowed', 'allowed', 10, 'parking_walk', false, 'portable', 'river', false, 'carry_out', 'none', 'none', 'none', true, false, 'excellent', '{summer}', 'high', 'silent'
FROM campsites WHERE slug = 'shiretoko-yaei';

INSERT INTO campsite_attributes (campsite_id, direct_fire, hammock, tent_sites, car_access, pet_allowed, toilet_type, water_source, shower, trash_disposal, nearest_onsen_min, signal_docomo, signal_au, signal_softbank, solo_friendly, family_friendly, can_swim, fishing, star_gazing, best_season, bugs_level, noise_level)
SELECT id, 'fire_pit_only', 'prohibited', 80, 'drive_in', true, 'flush', 'tap', true, 'available', 20, 'strong', 'strong', 'strong', true, true, true, true, 'good', '{summer,autumn}', 'medium', 'quiet'
FROM campsites WHERE slug = 'bifue-camp';

INSERT INTO campsite_attributes (campsite_id, direct_fire, hammock, tent_sites, car_access, pet_allowed, toilet_type, water_source, shower, trash_disposal, nearest_onsen_min, signal_docomo, signal_au, signal_softbank, solo_friendly, family_friendly, star_gazing, best_season, bugs_level, noise_level)
SELECT id, 'allowed', 'allowed', 15, 'parking_walk', true, 'squat', 'tap', false, 'carry_out', 5, 'weak', 'weak', 'none', true, false, 'good', '{spring,autumn}', 'medium', 'quiet'
FROM campsites WHERE slug = 'oyasukyo-camp';

INSERT INTO campsite_attributes (campsite_id, direct_fire, hammock, tent_sites, car_access, pet_allowed, toilet_type, water_source, shower, trash_disposal, signal_docomo, signal_au, signal_softbank, solo_friendly, family_friendly, star_gazing, best_season, bugs_level, noise_level)
SELECT id, 'fire_pit_only', 'allowed', 20, 'parking_walk', false, 'flush', 'tap', false, 'carry_out', 'strong', 'weak', 'weak', true, false, 'excellent', '{spring,summer,autumn}', 'low', 'silent'
FROM campsites WHERE slug = 'jinbagata-camp';

INSERT INTO campsite_attributes (campsite_id, direct_fire, hammock, tent_sites, car_access, pet_allowed, toilet_type, water_source, shower, trash_disposal, nearest_onsen_min, signal_docomo, signal_au, signal_softbank, solo_friendly, family_friendly, star_gazing, best_season, bugs_level, noise_level)
SELECT id, 'fire_pit_only', 'allowed', 500, 'drive_in', true, 'flush', 'tap', true, 'available', 15, 'strong', 'strong', 'strong', true, true, 'excellent', '{spring,autumn,winter}', 'low', 'moderate'
FROM campsites WHERE slug = 'fumotoppara';

INSERT INTO campsite_attributes (campsite_id, direct_fire, hammock, tent_sites, car_access, pet_allowed, toilet_type, water_source, shower, trash_disposal, signal_docomo, signal_au, signal_softbank, solo_friendly, family_friendly, star_gazing, best_season, bugs_level, noise_level)
SELECT id, 'allowed', 'allowed', 5, 'parking_walk', false, 'none', 'river', false, 'carry_out', 'none', 'none', 'none', true, false, 'excellent', '{summer}', 'medium', 'silent'
FROM campsites WHERE slug = 'shinhodaka-yaei';

INSERT INTO campsite_attributes (campsite_id, direct_fire, hammock, tent_sites, car_access, pet_allowed, toilet_type, water_source, shower, trash_disposal, nearest_onsen_min, signal_docomo, signal_au, signal_softbank, solo_friendly, family_friendly, can_swim, star_gazing, best_season, bugs_level, noise_level)
SELECT id, 'fire_pit_only', 'allowed', 100, 'drive_in', true, 'flush', 'tap', false, 'carry_out', 60, 'strong', 'strong', 'strong', true, true, true, 'good', '{spring,summer,autumn}', 'medium', 'moderate'
FROM campsites WHERE slug = 'kasagi-camp';

INSERT INTO campsite_attributes (campsite_id, direct_fire, hammock, tent_sites, car_access, pet_allowed, toilet_type, water_source, shower, trash_disposal, signal_docomo, signal_au, signal_softbank, solo_friendly, family_friendly, can_swim, fishing, star_gazing, best_season, bugs_level, noise_level)
SELECT id, 'allowed', 'allowed', 20, 'parking_walk', true, 'squat', 'river', false, 'carry_out', 'weak', 'weak', 'none', true, false, true, true, 'excellent', '{summer,autumn}', 'medium', 'silent'
FROM campsites WHERE slug = 'niyodogawa-yaei';

INSERT INTO campsite_attributes (campsite_id, direct_fire, hammock, tent_sites, car_access, pet_allowed, toilet_type, water_source, shower, trash_disposal, signal_docomo, signal_au, signal_softbank, solo_friendly, family_friendly, star_gazing, best_season, bugs_level, noise_level)
SELECT id, 'prohibited', 'allowed', 15, 'parking_walk', false, 'squat', 'spring', false, 'carry_out', 'none', 'none', 'none', true, false, 'good', '{spring,summer,autumn}', 'high', 'silent'
FROM campsites WHERE slug = 'yakushima-shiratani';
