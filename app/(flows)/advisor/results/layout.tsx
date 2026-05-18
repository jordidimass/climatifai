import type { Metadata } from "next";

import { getMarketingMessages } from "@/lib/marketing-copy";

export const metadata: Metadata = {
  title: getMarketingMessages("es").product.advisorResultsMetaTitle,
};

export default function AdvisorResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
