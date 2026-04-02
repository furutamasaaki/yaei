import type { Metadata } from "next";
import { Noto_Serif_JP, Cormorant_Garamond, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku-gothic-new",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "YAEI（野営） - 日本最大のキャンプ・野営地データベース",
    template: "%s | YAEI（野営）",
  },
  description:
    "野営場・無料キャンプ場・マイナースポットを網羅。直火の可否、ハンモック泊、携帯電波状況など超詳細フィルタリングで理想のキャンプ地を見つけよう。",
  keywords: [
    "キャンプ場",
    "野営",
    "野営場",
    "無料キャンプ場",
    "ソロキャンプ",
    "ブッシュクラフト",
    "直火",
    "アウトドア",
  ],
  openGraph: {
    title: "YAEI（野営） - 日本最大のキャンプ・野営地データベース",
    description:
      "野営場・無料キャンプ場・マイナースポットを網羅。超詳細フィルタリングで理想のキャンプ地を見つけよう。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSerifJP.variable} ${cormorantGaramond.variable} ${zenKakuGothicNew.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
