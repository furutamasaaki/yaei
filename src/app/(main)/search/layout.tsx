import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "キャンプ場・野営場を検索",
  description:
    "直火の可否、ハンモック泊、携帯電波状況など超詳細フィルタリングでキャンプ場・野営場を検索。地図とリストの両方で探せます。",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
