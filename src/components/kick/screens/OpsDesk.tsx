import * as React from "react";
import { useDemo } from "@/lib/demo-state";
import { AppShell } from "../AppShell";
import { Plus, ArrowRight, TrendingUp } from "lucide-react";

function useCount(target: number, ms = 800) {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return n;
}

function Sparkline({ color = "var(--kick-success)" }: { color?: string }) {
  const points = "0,18 10,14 20,16 30,10 40,12 50,7 60,9 70,4 80,6 90,2";
  return (
    <svg viewBox="0 0 90 22" className="w-20 h-6">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Kpi({ label, value, suffix, spark }: { label: string; value: number; suffix?: string; spark?: boolean }) {
  const n = useCount(value);
  return (
    <div className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="text-[11px] tracking-wider font-semibold text-muted-foreground uppercase">{label}</div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-3xl font-bold tabular-nums">{n.toLocaleString()}{suffix}</div>
        {spark && <Sparkline />}
      </div>
    </div>
  );
}

const seedTenants = [
  { name: "Valeo Foods", brands: "4 (Batchelors, Odlums, Chef, Bollingers)", modules: 6 },
  { name: "Three Ireland", brands: "1 (Three)", modules: 7 },
  { name: "Hunky Dorys", brands: "1 (Hunky Dorys)", modules: 6 },
];

const services = [
  "Voucher signing service", "Supabase database", "Storage (photos)",
  "SMS / WhatsApp delivery", "GPS validation API",
];

function ActivityFeed() {
  const { activity, onboardedTenants, pushActivity } = useDemo();

  // Auto-emit a "scan claimed" style event for the most recently onboarded tenant
  React.useEffect(() => {
    if (onboardedTenants.length === 0) return;
    const tenant = onboardedTenants[0];
    const brand = tenant.brands.match(/\(([^)]+)\)/)?.[1] ?? tenant.name;
    const venues = ["The Porterhouse", "Kehoe's Pub", "The Long Hall", "Mulligan's", "Doheny & Nesbitt"];
    const id = setInterval(() => {
      const venue = venues[Math.floor(Math.random() * venues.length)];
      const qrs = 10 + Math.floor(Math.random() * 80);
      pushActivity({
        color: "primary",
        msg: `${brand}: Voucher batch claimed at ${venue} (${qrs} QRs)`,
      });
    }, 6000);
    return () => clearInterval(id);
  }, [onboardedTenants, pushActivity]);

  const dotClass = (c: string) =>
    c === "amber" ? "bg-amber-500" : c === "success" ? "bg-emerald-500" : "bg-primary";

  return (
    <div className="bg-card border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Live Platform Activity</h3>
        <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Live
        </span>
      </div>
      <div className="divide-y">
        {activity.map((e) => (
          <div
            key={e.id}
            className={`py-2.5 flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-500 ${
              e.highlight ? "bg-emerald-50/60 dark:bg-emerald-950/20 -mx-2 px-2 rounded" : ""
            }`}
          >
            <span className="font-mono text-xs text-muted-foreground tabular-nums">{e.t}</span>
            <span className={`h-2 w-2 rounded-full ${dotClass(e.color)} ${e.highlight ? "animate-pulse" : ""}`} />
            <span className={`text-foreground/90 ${e.highlight ? "font-medium" : ""}`}>{e.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OpsDesk() {
  const { go, onboardedTenants } = useDemo();
  const tenants = [
    ...onboardedTenants.map((t) => ({
      name: t.name,
      brands: t.brands,
      modules: t.modules,
      color: t.color,
      logo: t.logo,
      isNew: true as const,
    })),
    ...seedTenants.map((t) => ({ ...t, color: undefined, logo: null, isNew: false as const })),
  ];
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Operations Desk</h1>
          <p className="text-sm text-muted-foreground mt-1">Live cross-tenant view. Last updated: just now.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <Kpi label="Tenants Live" value={3 + onboardedTenants.length} />
          <Kpi label="Brands Live" value={6 + onboardedTenants.length} />
          <Kpi label="Vouchers (24h)" value={1847} />
          <Kpi label="Redemptions (24h)" value={1203} />
          <Kpi label="API Calls (24h)" value={312911} spark />
          <Kpi label="Avg Latency (ms)" value={10} spark />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-card border rounded-xl p-5">
            <h3 className="font-semibold mb-4">Tenant Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b">
                    <th className="pb-2 font-semibold">Tenant</th>
                    <th className="pb-2 font-semibold">Brands</th>
                    <th className="pb-2 font-semibold">Modules</th>
                    <th className="pb-2 font-semibold">Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {tenants.map((t) => (
                    <tr key={t.name} className={`hover:bg-muted/40 transition-colors ${t.isNew ? "animate-in fade-in slide-in-from-top-1 duration-500" : ""}`}>
                      <td className="py-3 font-medium">
                        <div className="flex items-center gap-2.5">
                          {t.logo ? (
                            <img src={t.logo} alt="" className="h-7 w-7 rounded border bg-white object-contain" />
                          ) : t.color ? (
                            <span className="h-7 w-7 rounded border flex-shrink-0" style={{ background: t.color }} />
                          ) : (
                            <span className="h-7 w-7 rounded border bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                              {t.name.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                          <span>{t.name}</span>
                          {t.isNew && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">NEW</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{t.brands}</td>
                      <td className="py-3">{t.modules}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--kick-success-bg)", color: "var(--kick-success)" }}>
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> LIVE
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <a className="text-xs text-primary hover:underline">View →</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => go("wiz-1")}
              className="mt-4 inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" /> Add new tenant
            </button>
          </div>

          <div className="bg-card border rounded-xl p-5">
            <h3 className="font-semibold mb-4">Platform Health</h3>
            <ul className="space-y-3 text-sm">
              {services.map((s) => (
                <li key={s} className="flex items-center justify-between">
                  <span>{s}</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-primary" /> Healthy
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              All systems nominal · 99.99% uptime · 30d
            </div>
          </div>
        </div>

        <ActivityFeed />
      </div>
    </AppShell>
  );
}