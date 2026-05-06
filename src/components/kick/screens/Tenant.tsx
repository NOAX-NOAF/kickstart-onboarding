import * as React from "react";
import { useDemo } from "@/lib/demo-state";
import { AppShell } from "../AppShell";
import {
  Megaphone, Package, Users, ArrowRight, Check, Plus, Minus, Loader2,
  ChevronRight, ArrowLeft, Search, MapPin, X, ShieldCheck, QrCode,
} from "lucide-react";

function useCount(target: number, ms = 700) {
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

function Kpi({ label, value }: { label: string; value: number }) {
  const n = useCount(value);
  return (
    <div className="bg-card border rounded-xl p-5">
      <div className="text-[11px] tracking-wider font-semibold text-muted-foreground uppercase">{label}</div>
      <div className="mt-2 text-3xl font-bold tabular-nums">{n.toLocaleString()}</div>
    </div>
  );
}

/* ------------------- TENANT DASHBOARD ------------------- */
export function TenantDashboard() {
  const { go } = useDemo();
  return (
    <AppShell context="tenant">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl p-6 mb-6 text-white animate-in fade-in slide-in-from-top-2" style={{ background: "linear-gradient(135deg, #003087, #0050D8)" }}>
          <h1 className="text-2xl font-bold tracking-tight">Welcome to ABInBev on Kick</h1>
          <p className="text-sm opacity-90 mt-1">You're set up as ABInBev tenant admin. Here's your platform.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Kpi label="Active campaigns" value={0} />
          <Kpi label="Vouchers issued" value={0} />
          <Kpi label="Redemptions" value={0} />
          <Kpi label="POSM orders" value={0} />
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Quick actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => go("camp-1")}
              className="text-left p-5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all hover:-translate-y-0.5 group"
            >
              <Megaphone className="h-6 w-6 mb-3" />
              <div className="font-semibold">🎯 Create your first campaign</div>
              <div className="text-xs opacity-80 mt-1">QR voucher campaign for Budweiser</div>
              <div className="mt-3 text-xs inline-flex items-center gap-1">Start <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" /></div>
            </button>
            <button className="text-left p-5 rounded-lg border hover:bg-muted/40 transition-all hover:-translate-y-0.5">
              <Package className="h-6 w-6 mb-3 text-foreground/70" />
              <div className="font-semibold">📦 Order POSM</div>
              <div className="text-xs text-muted-foreground mt-1">Counter mats, coasters, POS stickers</div>
            </button>
            <button className="text-left p-5 rounded-lg border hover:bg-muted/40 transition-all hover:-translate-y-0.5">
              <Users className="h-6 w-6 mb-3 text-foreground/70" />
              <div className="font-semibold">👥 Invite your team</div>
              <div className="text-xs text-muted-foreground mt-1">Brand admins, ops, field managers</div>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ------------------- CAMPAIGN CRUMBS ------------------- */
function CampCrumbs({ step }: { step: number }) {
  return (
    <div className="flex items-center text-xs text-muted-foreground mb-3">
      <span>Dashboard</span><ChevronRight className="h-3 w-3 mx-1" />
      <span>Campaigns</span><ChevronRight className="h-3 w-3 mx-1" />
      <span className="text-foreground">New (Step {step}/4)</span>
    </div>
  );
}

function CampNav({ back, next, nextLabel = "Continue", onNext }: { back: any; next: any; nextLabel?: string; onNext?: () => void }) {
  const { go } = useDemo();
  return (
    <div className="flex justify-between mt-8">
      {back ? (
        <button onClick={() => go(back)} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md border bg-background text-sm font-medium hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      ) : <button onClick={() => go("tenant-dashboard")} className="h-10 px-4 rounded-md border bg-background text-sm font-medium hover:bg-muted transition-colors">Cancel</button>}
      <button
        onClick={() => (onNext ? onNext() : go(next))}
        className="inline-flex items-center gap-1.5 h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all hover:-translate-y-0.5"
      >
        {nextLabel} <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function CampSteps({ step }: { step: number }) {
  const labels = ["Basics", "Rules", "Venues", "Branding"];
  return (
    <div className="flex gap-2 max-w-2xl mb-6">
      {labels.map((l, i) => (
        <div key={l} className="flex-1">
          <div className={`h-1 rounded-full transition-all ${i + 1 <= step ? "bg-primary" : "bg-muted"}`} />
          <div className={`text-[11px] mt-1 ${i + 1 === step ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{i + 1}. {l}</div>
        </div>
      ))}
    </div>
  );
}

const I = "h-10 w-full px-3 rounded-md border bg-background text-sm focus:ring-2 focus:ring-ring outline-none transition-all";
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <div><label className="text-xs font-medium text-muted-foreground">{label}</label><div className="mt-1">{children}</div>{hint && <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>}</div>;
}

/* ------------------- CAMPAIGN STEP 1 ------------------- */
export function Camp1() {
  return (
    <AppShell context="tenant">
      <div className="max-w-3xl mx-auto">
        <CampCrumbs step={1} />
        <h1 className="text-2xl font-bold tracking-tight mb-1">Create campaign</h1>
        <p className="text-sm text-muted-foreground mb-6">Step 1 of 4: Basics</p>
        <CampSteps step={1} />
        <div className="bg-card border rounded-xl p-6 space-y-5">
          <Field label="Campaign name"><input defaultValue="Budweiser Champions League" className={I} /></Field>
          <Field label="Slug" hint="kick.app/c/budweiser-champions-league"><input defaultValue="budweiser-champions-league" className={I + " font-mono"} /></Field>
          <Field label="Brand" hint="Locked — Budweiser is the only brand under ABInBev">
            <select disabled className={I + " opacity-70"}><option>Budweiser</option></select>
          </Field>
          <Field label="Reward type">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {["Free item", "Discount %", "Discount fixed", "Bundle", "Experience"].map((r, i) => (
                <label key={r} className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer text-sm transition-all ${i === 0 ? "border-primary bg-accent/30 ring-1 ring-primary" : "hover:bg-muted/40"}`}>
                  <input type="radio" name="reward" defaultChecked={i === 0} className="accent-[oklch(0.62_0.17_145)]" />
                  {r}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Reward description"><input defaultValue="Free Budweiser on matchday at participating venues" className={I} /></Field>
        </div>
        <CampNav back={null} next="camp-2" />
      </div>
    </AppShell>
  );
}

/* ------------------- CAMPAIGN STEP 2 ------------------- */
function Toggle({ defaultChecked = true, locked }: { defaultChecked?: boolean; locked?: boolean }) {
  const [on, setOn] = React.useState(defaultChecked);
  return (
    <button
      disabled={locked}
      onClick={() => setOn((v) => !v)}
      className={`h-6 w-10 rounded-full transition-colors relative ${on ? "bg-primary" : "bg-muted-foreground/30"} ${locked ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-[18px]" : "translate-x-0.5"}`} />
    </button>
  );
}

export function Camp2() {
  return (
    <AppShell context="tenant">
      <div className="max-w-4xl mx-auto">
        <CampCrumbs step={2} />
        <h1 className="text-2xl font-bold tracking-tight mb-1">Create campaign</h1>
        <p className="text-sm text-muted-foreground mb-6">Step 2 of 4: Rules & constraints</p>
        <CampSteps step={2} />
        <div className="space-y-5">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Validity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Start date"><input type="date" defaultValue="2026-09-01" className={I} /></Field>
              <Field label="End date"><input type="date" defaultValue="2026-11-30" className={I} /></Field>
              <Field label="Voucher lifetime"><input defaultValue="7 days from claim" className={I} /></Field>
              <Field label="Time windows" hint="Auto-detected from selected venues' fixture lists"><input defaultValue="Matchdays only" className={I} /></Field>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Per-customer caps</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Max per customer"><input defaultValue="1" className={I} /></Field>
              <Field label="Max per device fingerprint"><input defaultValue="1" className={I} /></Field>
              <Field label="Max per phone number"><input defaultValue="1" className={I} /></Field>
            </div>
            <div className="mt-4 flex items-center justify-between p-3 rounded-md border bg-amber-50 dark:bg-amber-950/20">
              <div className="text-sm inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-amber-600" /> 18+ age gate (locked — alcohol)</div>
              <Toggle locked />
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Velocity caps</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Max total redemptions"><input defaultValue="10,000" className={I} /></Field>
              <Field label="Per-venue daily limit"><input defaultValue="50" className={I} /></Field>
              <Field label="Threshold alerts at"><input defaultValue="80% utilisation" className={I} /></Field>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Mechanics text</h3>
            <textarea
              rows={4}
              defaultValue="Scan QR at participating venues during matchdays. Verify your phone via SMS, claim a free Budweiser. Redeem at the bar by showing the QR code on your phone. One per customer per match. Must be 18+."
              className="w-full p-3 rounded-md border bg-background text-sm focus:ring-2 focus:ring-ring outline-none"
            />
          </div>
        </div>
        <CampNav back="camp-1" next="camp-3" />
      </div>
    </AppShell>
  );
}

/* ------------------- CAMPAIGN STEP 3 ------------------- */
const allVenues = [
  "The Porterhouse Temple Bar", "Kehoe's", "The Long Hall", "O'Donoghue's", "The Stag's Head",
  "Mulligan's", "The Brazen Head", "Doheny & Nesbitt", "Toner's Pub", "The Palace Bar",
];

export function Camp3() {
  const [selected, setSelected] = React.useState<string[]>(allVenues.slice(0, 5));
  function toggle(v: string) {
    setSelected((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  }
  return (
    <AppShell context="tenant">
      <div className="max-w-6xl mx-auto">
        <CampCrumbs step={3} />
        <h1 className="text-2xl font-bold tracking-tight mb-1">Create campaign</h1>
        <p className="text-sm text-muted-foreground mb-6">Step 3 of 4: Select venues. Pick which venues from your Master Venue Database can host this campaign.</p>
        <CampSteps step={3} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border rounded-xl p-5">
            <div className="relative mb-3">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Search venues by name, area, or licence ref" className={I + " pl-9"} />
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {["On-trade", "Hotel", "Off-trade", "Retail"].map((c, i) => (
                <button key={c} className={`text-xs px-3 py-1 rounded-full border transition-colors ${i === 0 ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}>{c}</button>
              ))}
              <select className="text-xs h-7 px-2 rounded-full border bg-background"><option>Dublin City</option></select>
            </div>
            <div className="text-xs text-muted-foreground mb-3">Showing 412 venues across 4 filters</div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {allVenues.map((v) => {
                const isSel = selected.includes(v);
                return (
                  <div key={v} className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{v}</div>
                        <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3 text-primary" /> GPS verified · Dublin 2
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggle(v)}
                      className={`text-xs h-8 px-3 rounded-md font-medium transition-all ${isSel ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground hover:opacity-90"}`}
                    >
                      {isSel ? "✓ Added" : "+ Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-card border rounded-xl p-5 h-fit sticky top-20">
            <h3 className="font-semibold mb-3">Selected ({selected.length})</h3>
            {selected.length === 0 && <p className="text-sm text-muted-foreground">No venues yet.</p>}
            <div className="space-y-2">
              {selected.map((v) => (
                <div key={v} className="flex items-center justify-between p-2 rounded-md bg-muted/40 text-sm">
                  <span className="truncate">{v}</span>
                  <button onClick={() => toggle(v)} className="p-1 hover:bg-background rounded transition-colors"><X className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <CampNav back="camp-2" next="camp-4" />
      </div>
    </AppShell>
  );
}

/* ------------------- CAMPAIGN STEP 4 ------------------- */
function Phone({ stage }: { stage: "claim" | "voucher" | "redeem" }) {
  return (
    <div className="w-44 bg-black rounded-2xl p-1.5 shadow-xl flex-shrink-0">
      <div className="bg-white rounded-xl overflow-hidden h-80 flex flex-col">
        <div className="p-3 text-white text-center" style={{ background: "#003087" }}>
          <div className="h-7 w-7 rounded-full bg-white text-[#003087] font-bold mx-auto flex items-center justify-center text-sm">B</div>
          <div className="text-[10px] font-semibold mt-1">Budweiser</div>
          <div className="text-[8px] opacity-80">King of Beers</div>
        </div>
        <div className="flex-1 p-3 flex flex-col items-center justify-center text-center" style={{ background: "#E6F0FF" }}>
          {stage === "claim" && (
            <>
              <div className="text-[10px] font-semibold text-[#003087]">Champions League</div>
              <div className="text-[8px] text-[#003087]/70 mt-1 mb-3">Free Budweiser on matchday</div>
              <button className="text-[9px] h-7 px-3 rounded text-white font-semibold w-full" style={{ background: "#003087" }}>Claim</button>
            </>
          )}
          {stage === "voucher" && (
            <>
              <QrCode className="h-16 w-16 text-[#003087]" />
              <div className="text-[8px] mt-2 font-mono text-[#003087]">BUD-A7F3-K2025</div>
              <div className="text-[7px] text-[#003087]/70">Show at the bar</div>
            </>
          )}
          {stage === "redeem" && (
            <>
              <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center"><Check className="h-6 w-6" /></div>
              <div className="text-[10px] font-semibold mt-2 text-[#003087]">Redeemed!</div>
              <div className="text-[8px] text-[#003087]/70">Enjoy responsibly</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function Camp4() {
  const { go } = useDemo();
  const [launching, setLaunching] = React.useState(false);
  function launch() {
    setLaunching(true);
    setTimeout(() => go("camp-live"), 1200);
  }
  return (
    <AppShell context="tenant">
      <div className="max-w-6xl mx-auto">
        <CampCrumbs step={4} />
        <h1 className="text-2xl font-bold tracking-tight mb-1">Create campaign</h1>
        <p className="text-sm text-muted-foreground mb-6">Step 4 of 4: Branding & launch</p>
        <CampSteps step={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border rounded-xl p-6 space-y-5">
            <Field label="Hero image">
              <div className="p-3 rounded-md border-2 border-dashed border-primary bg-accent/30 inline-flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" /> champions-league-hero.jpg uploaded
              </div>
            </Field>
            <Field label="Header colour">
              <div className="flex items-center gap-2"><div className="h-10 w-10 rounded-md border" style={{ background: "#003087" }} /><input defaultValue="#003087" className={I + " font-mono"} /></div>
            </Field>
            <Field label="Header copy"><input defaultValue="Budweiser Champions League" className={I} /></Field>
            <Field label="Hero subtitle"><input defaultValue="Free Budweiser on matchday" className={I} /></Field>
            <Field label="Privacy policy URL"><input defaultValue="https://abinbev.com/privacy" className={I} /></Field>
            <Field label="Wallet pass design">
              <select className={I}><option>Apple Wallet template + Google Wallet template</option></select>
            </Field>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-3">Live consumer preview</div>
            <div className="bg-card border rounded-xl p-6 flex justify-center gap-3 overflow-x-auto">
              <Phone stage="claim" />
              <Phone stage="voucher" />
              <Phone stage="redeem" />
            </div>
            <p className="text-[11px] text-center text-muted-foreground mt-2">Claim → Voucher → Redeem</p>
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button onClick={() => go("camp-3")} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md border bg-background text-sm font-medium hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button
            onClick={launch}
            disabled={launching}
            className="inline-flex items-center gap-1.5 h-12 px-7 rounded-md bg-primary text-primary-foreground text-base font-semibold hover:opacity-90 transition-all hover:-translate-y-0.5 disabled:opacity-70"
          >
            {launching ? (<><Loader2 className="h-4 w-4 animate-spin" /> Launching campaign…</>) : "Launch Campaign →"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}

/* ------------------- CAMPAIGN LIVE ------------------- */
export function CampLive() {
  const { go } = useDemo();
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-xl bg-card border rounded-2xl shadow-xl p-10 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-5 animate-in zoom-in duration-700">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Budweiser Champions League is live.</h1>
        <div className="grid grid-cols-3 gap-4 mt-6 text-left">
          <div className="p-3 rounded-lg bg-muted/40">
            <div className="text-2xl font-bold">5</div>
            <div className="text-[11px] text-muted-foreground">venues activated</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/40">
            <div className="text-2xl font-bold">QR</div>
            <div className="text-[11px] text-muted-foreground">codes generated</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/40">
            <div className="text-2xl font-bold">✓</div>
            <div className="text-[11px] text-muted-foreground">Wallet passes provisioned</div>
          </div>
        </div>
        <div className="mt-7 space-y-2">
          <button className="w-full h-11 rounded-md border bg-background font-medium text-sm hover:bg-muted transition-colors">
            🖨️ Print QR posters →
          </button>
          <button
            onClick={() => go("posm-builder")}
            className="w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all hover:-translate-y-0.5"
          >
            Order POSM kit for these venues →
          </button>
          <button onClick={() => go("tenant-dashboard")} className="w-full text-xs text-muted-foreground hover:text-foreground py-1">
            Back to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------- POSM BUILDER ------------------- */
const products = [
  { name: "Budweiser Counter Mat", price: 12.5, key: "mat" },
  { name: "Budweiser Coaster Pack", price: 8.0, sub: "100 coasters", key: "coaster" },
  { name: "Budweiser Aprons", price: 18.0, key: "apron" },
  { name: "Budweiser Kozies", price: 4.5, key: "kozy" },
  { name: "Budweiser POS Sticker", price: 2.0, key: "sticker" },
];

export function PosmBuilder() {
  const { go } = useDemo();
  const [qty, setQty] = React.useState<Record<string, number>>({ mat: 5, coaster: 10, apron: 0, kozy: 0, sticker: 100 });
  const total = products.reduce((s, p) => s + p.price * (qty[p.key] || 0), 0);
  const budget = 5000;
  function inc(k: string, d: number) { setQty((q) => ({ ...q, [k]: Math.max(0, (q[k] || 0) + d) })); }
  return (
    <AppShell context="tenant">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <span>Dashboard</span><ChevronRight className="h-3 w-3 mx-1" />
          <span>POSM</span><ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-foreground">New order</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">POSM order</h1>
        <p className="text-sm text-muted-foreground mb-6">For Budweiser Champions League · 5 venues · Budget €{budget.toLocaleString()}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.key} className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="h-24 rounded-md mb-3 flex items-center justify-center text-white font-bold text-2xl" style={{ background: "linear-gradient(135deg, #003087, #0050D8)" }}>
                  B
                </div>
                <div className="font-semibold text-sm">{p.name}</div>
                {p.sub && <div className="text-[11px] text-muted-foreground">{p.sub}</div>}
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-bold">€{p.price.toFixed(2)}<span className="text-[11px] font-normal text-muted-foreground">/unit</span></div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => inc(p.key, -1)} className="h-7 w-7 rounded border hover:bg-muted transition-colors flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                    <div className="w-10 text-center text-sm font-medium tabular-nums">{qty[p.key] || 0}</div>
                    <button onClick={() => inc(p.key, 1)} className="h-7 w-7 rounded border hover:bg-muted transition-colors flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card border rounded-xl p-5 h-fit sticky top-20">
            <h3 className="font-semibold mb-4">Basket</h3>
            <div className="space-y-2">
              {products.filter((p) => qty[p.key]).map((p) => (
                <div key={p.key} className="flex items-center justify-between text-sm">
                  <span className="truncate">{qty[p.key]}× {p.name}</span>
                  <span className="tabular-nums font-medium">€{(p.price * qty[p.key]).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Budget allocated</span><span className="tabular-nums">€{budget.toLocaleString()}</span></div>
              <div className="flex justify-between font-semibold"><span>Spent in basket</span><span className="tabular-nums">€{total.toFixed(2)}</span></div>
              <div className="flex justify-between p-2 rounded-md" style={{ background: "var(--kick-success-bg)", color: "var(--kick-success)" }}>
                <span className="font-medium">Remaining</span><span className="tabular-nums font-semibold">€{(budget - total).toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => go("posm-status")}
              className="mt-4 w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all hover:-translate-y-0.5"
            >
              Submit order for approval
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ------------------- POSM STATUS ------------------- */
const posmSteps = ["Submitted", "Budget Check", "Approved", "Reserved", "Picked", "Shipped", "Delivered", "Verified", "Closed"];

export function PosmStatus() {
  const { go } = useDemo();
  const [stage, setStage] = React.useState(1); // 1 = Submitted done, next is Budget Check
  const next = posmSteps[stage];
  function advance() {
    setStage((s) => Math.min(posmSteps.length, s + 1));
  }
  return (
    <AppShell context="tenant">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <span>Dashboard</span><ChevronRight className="h-3 w-3 mx-1" />
          <span>POSM</span><ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-foreground">POSM-A7F3K2025</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Order POSM-A7F3K2025 submitted</h1>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: "var(--kick-success-bg)", color: "var(--kick-success)" }}>
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Status: {posmSteps[stage - 1]}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-5">Status timeline</h3>
            <ol className="space-y-3">
              {posmSteps.map((s, i) => {
                const done = i < stage;
                const current = i === stage;
                return (
                  <li key={s} className="flex items-center gap-3 animate-in fade-in duration-300">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${done ? "bg-primary text-primary-foreground" : current ? "border-2 border-primary text-primary" : "border bg-muted"}`}>
                      {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm ${done ? "font-medium" : current ? "font-semibold" : "text-muted-foreground"}`}>{s}</div>
                      {done && i === 0 && <div className="text-[11px] text-muted-foreground">2 minutes ago</div>}
                    </div>
                    {current && stage < posmSteps.length && (
                      <button
                        onClick={advance}
                        className="text-xs h-8 px-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all hover:-translate-y-0.5"
                      >
                        {stage === 1 ? "Run budget check" : stage === 2 ? "Approve" : `Mark ${s}`}
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
            {stage >= posmSteps.length && (
              <button onClick={() => go("final-dashboard")} className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                Order closed → Back to dashboard <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="bg-card border rounded-xl p-6 h-fit">
            <h3 className="font-semibold mb-3">Order details</h3>
            <dl className="text-sm space-y-2">
              <div className="flex justify-between"><dt className="text-muted-foreground">Order ID</dt><dd className="font-mono text-xs">POSM-A7F3K2025</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Brand</dt><dd>Budweiser</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Campaign</dt><dd className="text-right">Champions League</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Venues</dt><dd>5</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Items</dt><dd>3 SKUs</dd></div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-2"><dt>Total</dt><dd>€182.50</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Idempotency key</dt><dd className="font-mono text-[10px]">idem-3f7a9c2e</dd></div>
            </dl>
          </div>
        </div>

        <button onClick={() => go("final-dashboard")} className="mt-6 text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
        </button>
      </div>
    </AppShell>
  );
}

/* ------------------- FINAL DASHBOARD ------------------- */
export function FinalDashboard() {
  const { reset } = useDemo();
  return (
    <AppShell context="tenant">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl p-5 mb-6 text-white animate-in fade-in slide-in-from-top-2" style={{ background: "linear-gradient(135deg, var(--kick-success), oklch(0.55 0.18 145))" }}>
          <div className="font-bold text-lg">🎉 ABInBev is live on Kick. Mark, your platform is ready to scale.</div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Kpi label="Active campaigns" value={1} />
          <Kpi label="Vouchers issued" value={0} />
          <Kpi label="Redemptions" value={0} />
          <Kpi label="POSM orders" value={1} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Quick actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-4 rounded-lg border hover:bg-muted/40 transition-all hover:-translate-y-0.5">
                <div className="font-medium text-sm">📊 View campaign performance →</div>
                <div className="text-xs text-muted-foreground mt-0.5">Champions League · 5 venues</div>
              </button>
              <button className="w-full text-left p-4 rounded-lg border hover:bg-muted/40 transition-all hover:-translate-y-0.5">
                <div className="font-medium text-sm">📦 Order more POSM →</div>
                <div className="text-xs text-muted-foreground mt-0.5">€4,817.50 budget remaining</div>
              </button>
              <button className="w-full text-left p-4 rounded-lg border hover:bg-muted/40 transition-all hover:-translate-y-0.5">
                <div className="font-medium text-sm">👥 Invite a team member →</div>
                <div className="text-xs text-muted-foreground mt-0.5">Brand admins, ops, field</div>
              </button>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Demo complete — what just happened</h3>
            <ol className="space-y-2 text-sm">
              {[
                "Niall onboarded ABInBev as Tenant 1",
                "Configured Budweiser as the first brand",
                "Enabled 8 modules",
                "Generated API access + integrations",
                "Invited Mark Dunne as Tenant Admin",
                "Created the Champions League campaign with 5 venues",
                "Ordered POSM materials for the campaign launch",
              ].map((s, i) => (
                <li key={s} className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold flex-shrink-0 mt-0.5">{i + 1}</div>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
              Next steps: Configure your bar scanner app, plan more campaigns, expand to additional brands.
            </p>
            <button
              onClick={reset}
              className="mt-4 w-full h-10 rounded-md border bg-background font-medium text-sm hover:bg-muted transition-colors"
            >
              ↺ Restart demo
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}