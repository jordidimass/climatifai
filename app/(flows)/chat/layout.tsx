import type { Metadata } from "next";

import { getMarketingMessages } from "@/lib/marketing-copy";

export const metadata: Metadata = {
  title: getMarketingMessages("es").product.chatMetaTitle,
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
