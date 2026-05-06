import {
  LayoutDashboard, Package, Ticket, Users, ClipboardList, Building2,
  Wallet, FileText, Store, Handshake, MapPin, UserCog, Boxes, ExternalLink,
  Megaphone, Camera, Bell, Palette,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Item = { label: string; icon: LucideIcon; active?: boolean };
type Section = { title: string; items: Item[] };

const platformSections: Section[] = [
  { title: "Operations", items: [
    { label: "Operations Desk", icon: LayoutDashboard, active: true },
    { label: "POSM", icon: Package },
    { label: "Vouchers", icon: Ticket },
    { label: "Field Ops", icon: Users },
    { label: "POS Jobs", icon: ClipboardList },
  ]},
  { title: "Tenants", items: [{ label: "All Tenants", icon: Building2 }] },
  { title: "Finance", items: [
    { label: "Settlements", icon: Wallet },
    { label: "Audit Trail", icon: FileText },
  ]},
  { title: "Setup", items: [
    { label: "Customers", icon: Store },
    { label: "Partners", icon: Handshake },
    { label: "Master Venues", icon: MapPin },
    { label: "Users", icon: UserCog },
    { label: "Modules", icon: Boxes },
  ]},
];

const tenantSections: Section[] = [
  { title: "Overview", items: [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Brands", icon: Palette },
  ]},
  { title: "Operations", items: [
    { label: "Campaigns", icon: Megaphone },
    { label: "POSM", icon: Package },
    { label: "Field Evidence", icon: Camera },
    { label: "POS Jobs", icon: ClipboardList },
    { label: "Alerts", icon: Bell },
  ]},
  { title: "Finance", items: [
    { label: "Settlements", icon: Wallet },
    { label: "Audit Trail", icon: FileText },
  ]},
  { title: "Setup", items: [
    { label: "Brand Settings", icon: Palette },
    { label: "Users", icon: UserCog },
    { label: "Master Venues", icon: MapPin },
  ]},
];

export function Sidebar({ context = "platform" }: { context?: "platform" | "tenant" }) {
  const sections = context === "tenant" ? tenantSections : platformSections;
  return (
    <aside
      className="w-60 shrink-0 flex flex-col h-[calc(100vh-3.5rem)] sticky top-14"
      style={{ background: "var(--kick-sidebar)", color: "var(--kick-sidebar-fg)" }}
    >
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="text-[10px] font-semibold tracking-wider uppercase mb-2 px-2" style={{ color: "var(--kick-sidebar-muted)" }}>
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors hover:bg-white/5"
                  style={item.active ? { background: "var(--kick-sidebar-active)" } : undefined}
                >
                  <item.icon className="h-4 w-4 opacity-80" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <button className="w-full flex items-center justify-between text-sm px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors">
          <span>Rep Portal</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
}