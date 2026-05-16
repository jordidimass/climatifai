import { MarketingLocaleProvider } from "@/components/marketing/marketing-locale-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketingLocaleProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </MarketingLocaleProvider>
  );
}
