import { AlertsToaster } from "@/components/data/alerts-toaster";

export default function FlowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      {children}
      <AlertsToaster />
    </div>
  );
}
