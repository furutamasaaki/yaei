import type { MetadataRoute } from "next";
import { PREFECTURES } from "@/constants/prefectures";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yaei.jp";

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/auth/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // 都道府県別ページ
  const prefecturePages: MetadataRoute.Sitemap = PREFECTURES.map((p) => ({
    url: `${baseUrl}/prefecture/${p.name_en}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // スポット詳細ページ
  let spotPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createAdminClient();
    const { data: spots } = await supabase
      .from("campsites")
      .select("slug, updated_at")
      .eq("status", "active")
      .order("updated_at", { ascending: false });

    if (spots) {
      spotPages = spots.map((spot) => ({
        url: `${baseUrl}/spot/${spot.slug}`,
        lastModified: new Date(spot.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Supabase未接続時はスキップ
  }

  return [...staticPages, ...prefecturePages, ...spotPages];
}
