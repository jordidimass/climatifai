import type { Metadata } from "next";

import { getMarketingMessages } from "@/lib/marketing-copy";

export const metadata: Metadata = {
  title: getMarketingMessages("es").product.firesFlowMetaTitle,
};

export default function FiresLayout({ children }: { children: React.ReactNode }) {
  return children;
}
