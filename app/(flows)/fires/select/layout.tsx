import type { Metadata } from "next";

import { getMarketingMessages } from "@/lib/marketing-copy";

export const metadata: Metadata = {
  title: getMarketingMessages("es").product.firesSelectMetaTitle,
};

export default function FiresSelectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
