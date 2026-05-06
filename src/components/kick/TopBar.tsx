import { Bell, Menu, Search, LogOut } from "lucide-react";
import { useDemo } from "@/lib/demo-state";

export function TopBar({ context = "platform" }: { context?: "platform" | "tenant" }) {
  const { go } = useDemo();
  const isTenant = context === "tenant";
  return (
    <header className="h-14 border-b bg-background flex items-center px-4 gap-4 sticky top-0 z-30">
      <button className="p-2 hover:bg-muted rounded-md transition-colors">
        <Menu className="h-4 w-4" />
      </button>
      <div className="font-bold text-xl tracking-tight">
        Kick<span className="text-primary">.</span>
      </div>
      <div className="flex-1 max-w-xl mx-auto relative">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search tenants, brands, campaigns…"
          className="w-full h-9 pl-9 pr-16 rounded-md bg-muted border-0 text-sm focus:ring-2 focus:ring-ring outline-none"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-background border rounded px-1.5 py-0.5 text-muted-foreground">⌘K</kbd>
      </div>
      <button className="relative p-2 hover:bg-muted rounded-md transition-colors">
        <Bell className="h-4 w-4" />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
      </button>
      {isTenant ? (
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: "var(--kick-amber-bg)", color: "var(--kick-amber)" }}>
            Acting as ABInBev (impersonating Mark Dunne)
          </span>
          <button
            onClick={() => go("ops-desk")}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
          >
            <LogOut className="h-3 w-3" /> Exit impersonation
          </button>
        </div>
      ) : (
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent text-accent-foreground">
          Acting as Platform Super
        </span>
      )}
      <div className="relative">
        <div className={`h-9 w-9 rounded-full text-white flex items-center justify-center text-sm font-semibold ${isTenant ? "bg-amber-600" : ""}`} style={!isTenant ? { background: "var(--kick-navy)" } : undefined}>
          {isTenant ? "MD" : "NM"}
        </div>
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
      </div>
    </header>
  );
}