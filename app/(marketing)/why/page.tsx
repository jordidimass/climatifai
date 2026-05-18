import type { Metadata } from "next";

import { MarketingArticle } from "@/components/marketing/marketing-article";
import { getMarketingMessages, type StaticPageSlug } from "@/lib/marketing-copy";

const slug = "why" satisfies StaticPageSlug;
const seo = getMarketingMessages("es").pages[slug];
export const metadata: Metadata = {
  title: seo.metaTitle.split(" ·")[0]?.trim() ?? seo.metaTitle,
  description: seo.metaDescription,
};

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-16 pb-8">
      <MarketingArticle slug={slug} />
    </div>
  );
}

