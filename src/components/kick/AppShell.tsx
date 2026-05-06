import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({
  context = "platform",
  children,
}: {
  context?: "platform" | "tenant";
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <TopBar context={context} />
      <div className="flex">
        <Sidebar context={context} />
        <main className="flex-1 p-6 lg:p-8 animate-in fade-in duration-300">{children}</main>
      </div>
    </div>
  );
}