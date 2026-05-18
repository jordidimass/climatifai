import type { Metadata } from "next";

import { getMarketingMessages } from "@/lib/marketing-copy";

export const metadata: Metadata = {
  title: getMarketingMessages("es").product.advisorEntryMetaTitle,
};

export default function AdvisorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
