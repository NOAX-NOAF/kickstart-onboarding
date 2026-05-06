import * as React from "react";
import { useDemo, type Brand, type RepOrder } from "@/lib/demo-state";
import { AppShell } from "../AppShell";
import {
  Megaphone, Package, Users, ArrowRight, Check, Plus, Minus, Loader2,
  ChevronRight, ArrowLeft, Search, MapPin, X, ShieldCheck, QrCode,
  MessageSquare, Camera, Send, Mail, Smartphone, Eye, Palette, Upload,
  ShoppingCart, FileText, RefreshCw, LayoutGrid, MapPinned,
} from "lucide-react";

import budPolo from "@/assets/posm/bud-polo.webp";
import budTshirt from "@/assets/posm/bud-tshirt.webp";
import budCap from "@/assets/posm/bud-cap.webp";
import budCooler from "@/assets/posm/bud-cooler.webp";
import budGlassBowtie from "@/assets/posm/bud-glass-bowtie.png";
import budGlassHonor from "@/assets/posm/bud-glass-honor.webp";
import budKozy from "@/assets/posm/bud-kozy.webp";
import budMat from "@/assets/posm/bud-mat.webp";

const NAVY = "#1e3a8a";

function fmtEUR(n: number) {
  return "€" + n.toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

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
  const { go, draft } = useDemo();
  const c1 = draft.tenantColor;
  const c2 = draft.tenantBg;
  return (
    <AppShell context="tenant">
      <div className="max-w-7xl mx-auto">
        <div
          className="rounded-xl p-6 mb-6 text-white animate-in fade-in slide-in-from-top-2"
          style={{ background: `linear-gradient(135deg, ${c1}, ${c1}cc)` }}
        >
          <h1 className="text-2xl font-bold tracking-tight">Welcome to {draft.tradingName} on Kick</h1>
          <p className="text-sm opacity-90 mt-1">
            You're set up as {draft.tradingName} tenant admin. Here's your platform.
          </p>
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
            {/* 1. Invite team — primary */}
            <button
              onClick={() => go("invite-team")}
              className="text-left p-5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all hover:-translate-y-0.5 group"
            >
              <Users className="h-6 w-6 mb-3" />
              <div className="font-semibold">Invite your team</div>
              <div className="text-xs opacity-80 mt-1">Brand admins, ops, field managers</div>
              <div className="mt-3 text-xs inline-flex items-center gap-1">
                Start <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* 2. POSM */}
            <button
              onClick={() => go("posm-builder")}
              className="text-left p-5 rounded-lg border hover:bg-muted/40 transition-all hover:-translate-y-0.5"
            >
              <Package className="h-6 w-6 mb-3 text-foreground/70" />
              <div className="font-semibold">Set up POSM</div>
              <div className="text-xs text-muted-foreground mt-1">Counter mats, coasters, glassware</div>
            </button>

            {/* 3. Campaign — navy */}
            <button
              onClick={() => go("camp-1")}
              className="text-left p-5 rounded-lg text-white hover:opacity-90 transition-all hover:-translate-y-0.5 group"
              style={{ background: NAVY }}
            >
              <Megaphone className="h-6 w-6 mb-3" />
              <div className="font-semibold">Create your first campaign</div>
              <div className="text-xs opacity-80 mt-1">QR voucher campaign for {draft.brandName}</div>
              <div className="mt-3 text-xs inline-flex items-center gap-1">
                Start <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ------------------- INVITE TEAM ------------------- */
export function InviteTeam() {
  const { go } = useDemo();
  const [rows, setRows] = React.useState([
    { name: "", email: "", role: "Brand Admin" },
    { name: "", email: "", role: "Brand Ops" },
    { name: "", email: "", role: "Field Manager" },
  ]);
  function update(i: number, patch: any) {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }
  return (
    <AppShell context="tenant">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <button onClick={() => go("tenant-dashboard")}>Dashboard</button>
          <ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-foreground">Invite team</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Invite your team</h1>
        <p className="text-sm text-muted-foreground mb-6">Add brand admins, ops staff and field managers. Each gets an invite email.</p>
        <div className="bg-card border rounded-xl p-6 space-y-3">
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input value={r.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Full name" className="col-span-4 h-10 px-3 rounded-md border bg-background text-sm" />
              <input value={r.email} onChange={(e) => update(i, { email: e.target.value })} placeholder="email@company.com" className="col-span-5 h-10 px-3 rounded-md border bg-background text-sm" />
              <select value={r.role} onChange={(e) => update(i, { role: e.target.value })} className="col-span-3 h-10 px-3 rounded-md border bg-background text-sm">
                <option>Brand Admin</option><option>Brand Ops</option><option>Field Manager</option>
              </select>
            </div>
          ))}
          <button onClick={() => setRows((r) => [...r, { name: "", email: "", role: "Brand Ops" }])} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
            <Plus className="h-3 w-3" /> Add another
          </button>
        </div>
        <div className="flex justify-between mt-6">
          <button onClick={() => go("tenant-dashboard")} className="h-10 px-4 rounded-md border bg-background text-sm font-medium hover:bg-muted">Cancel</button>
          <button onClick={() => go("tenant-dashboard")} className="inline-flex items-center gap-1.5 h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            <Send className="h-4 w-4" /> Send invites
          </button>
        </div>
      </div>
    </AppShell>
  );
}

/* ------------------- CAMPAIGN CRUMBS ------------------- */
function CampCrumbs({ step }: { step: number }) {
  const { go } = useDemo();
  return (
    <div className="flex items-center text-xs text-muted-foreground mb-3">
      <button onClick={() => go("tenant-dashboard")}>Dashboard</button><ChevronRight className="h-3 w-3 mx-1" />
      <button onClick={() => go("campaigns-list")}>Campaigns</button><ChevronRight className="h-3 w-3 mx-1" />
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

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* ------------------- CAMPAIGN STEP 1 ------------------- */
export function Camp1() {
  const { draft } = useDemo();
  const [name, setName] = React.useState(`${draft.brandName} Champions League`);
  const [slug, setSlug] = React.useState(slugify(`${draft.brandName} Champions League`));
  const [slugDirty, setSlugDirty] = React.useState(false);
  function onName(v: string) {
    setName(v);
    if (!slugDirty) setSlug(slugify(v));
  }
  return (
    <AppShell context="tenant">
      <div className="max-w-3xl mx-auto">
        <CampCrumbs step={1} />
        <h1 className="text-2xl font-bold tracking-tight mb-1">Create campaign</h1>
        <p className="text-sm text-muted-foreground mb-6">Step 1 of 4: Basics</p>
        <CampSteps step={1} />
        <div className="bg-card border rounded-xl p-6 space-y-5">
          <Field label="Campaign name"><input value={name} onChange={(e) => onName(e.target.value)} className={I} /></Field>
          <Field label="Slug" hint={`kick.app/c/${slug}`}>
            <input value={slug} onChange={(e) => { setSlug(e.target.value); setSlugDirty(true); }} className={I + " font-mono"} />
          </Field>
          <Field label="Brand" hint={`Locked — ${draft.brandName} is the only brand under ${draft.tradingName}`}>
            <select disabled className={I + " opacity-70"}><option>{draft.brandName}</option></select>
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
          <Field label="Reward description"><input defaultValue={`Free ${draft.brandName} on matchday at participating venues`} className={I} /></Field>
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
  const { draft } = useDemo();
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
              defaultValue={`Scan QR at participating venues during matchdays. Verify your phone via SMS, claim a free ${draft.brandName}. Redeem at the bar by showing the QR code on your phone. One per customer per match. Must be 18+.`}
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
type VenueCat = "On-trade" | "Hotel" | "Off-trade" | "Restaurant";

const allVenues: { name: string; addr: string; area: string; cat: VenueCat }[] = [
  { name: "The Golf Links Inn", addr: "Strand Road", area: "Dublin", cat: "On-trade" },
  { name: "The Dragon Inn", addr: "Tallaght", area: "Dublin", cat: "On-trade" },
  { name: "Brock Inn", addr: "Broughan, The Ward", area: "Dublin", cat: "On-trade" },
  { name: "The Michael Collins", addr: "Main Street, Rush", area: "Dublin", cat: "On-trade" },
  { name: "The Yacht Bar", addr: "Loughshinny", area: "Dublin", cat: "On-trade" },
  { name: "Conways", addr: "Main Street, Blackrock", area: "Dublin", cat: "On-trade" },
  { name: "Blue Bar", addr: "25 Harbour Road, Skerries", area: "Dublin", cat: "On-trade" },
  { name: "The Porterhouse Temple Bar", addr: "Parliament Street", area: "Dublin", cat: "On-trade" },
  { name: "Kehoe's", addr: "South Anne Street", area: "Dublin", cat: "On-trade" },
  { name: "Mulligan's", addr: "Poolbeg Street", area: "Dublin", cat: "On-trade" },
  { name: "Roganstown Golf & Country Club", addr: "Roganstown, Swords", area: "Dublin", cat: "Hotel" },
  { name: "Premier Inn Dublin Airport", addr: "Airside Retail Park", area: "Dublin", cat: "Hotel" },
  { name: "Maldron Hotel Dublin Airport", addr: "Collinstown", area: "Dublin", cat: "Hotel" },
  { name: "Clayton Hotel Dublin Airport", addr: "M50/M1 Junction", area: "Dublin", cat: "Hotel" },
  { name: "The Waterside House Hotel", addr: "Balcarrick, Donabate", area: "Dublin", cat: "Hotel" },
  { name: "Fitzpatrick Castle Hotel", addr: "Killiney", area: "Dublin", cat: "Hotel" },
  { name: "Gerry's Supermarket", addr: "31 Strand Street, Skerries", area: "Dublin", cat: "Off-trade" },
  { name: "Centra Terenure", addr: "128 Terenure Road North", area: "Dublin", cat: "Off-trade" },
  { name: "Power & Co Fine Wines", addr: "Bridge View, Main Street", area: "Dublin", cat: "Off-trade" },
  { name: "Twomey's SuperValu", addr: "Clonkeen Road, Deansgrange", area: "Dublin", cat: "Off-trade" },
  { name: "Clarkes", addr: "94 Carysfort Ave, Blackrock", area: "Dublin", cat: "Off-trade" },
  { name: "Reeves Restaurant", addr: "Templeogue Village", area: "Dublin", cat: "Restaurant" },
  { name: "Pink Elephant Thai", addr: "23/25 Main Street, Swords", area: "Dublin", cat: "Restaurant" },
  { name: "Nautilus", addr: "Marine Court, Greystones", area: "Dublin", cat: "Restaurant" },
  { name: "King Sitric Fish", addr: "29 Harbour Road, Howth", area: "Dublin", cat: "Restaurant" },
];

const cats: VenueCat[] = ["On-trade", "Hotel", "Off-trade", "Restaurant"];

export function Camp3() {
  const [activeCat, setActiveCat] = React.useState<VenueCat>("On-trade");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([
    "The Porterhouse Temple Bar", "Kehoe's", "Mulligan's", "Conways", "Blue Bar",
  ]);
  function toggle(v: string) {
    setSelected((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  }
  const filtered = allVenues.filter((v) => v.cat === activeCat && v.name.toLowerCase().includes(search.toLowerCase()));

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
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search venues by name, area, or licence ref" className={I + " pl-9"} />
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {cats.map((c) => {
                const count = allVenues.filter((v) => v.cat === c).length;
                const isActive = activeCat === c;
                return (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${isActive ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
                  >
                    {c} <span className="opacity-70 ml-1">{count}</span>
                  </button>
                );
              })}
              <select className="text-xs h-7 px-2 rounded-full border bg-background"><option>Dublin City</option></select>
            </div>
            <div className="text-xs text-muted-foreground mb-3">Showing {filtered.length} {activeCat.toLowerCase()} venues</div>
            <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
              {filtered.map((v) => {
                const isSel = selected.includes(v.name);
                return (
                  <div key={v.name} className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{v.name}</div>
                        <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3 text-primary" /> GPS verified · {v.addr}, {v.area}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggle(v.name)}
                      className={`text-xs h-8 px-3 rounded-md font-medium transition-all ${isSel ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground hover:opacity-90"}`}
                    >
                      {isSel ? "Added" : "+ Add"}
                    </button>
                  </div>
                );
              })}
              {filtered.length === 0 && <div className="text-sm text-muted-foreground p-4 text-center">No venues match.</div>}
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
function Phone({ stage, color, bg, brandName, brandLogo, tagline }: { stage: "claim" | "voucher" | "redeem"; color: string; bg: string; brandName: string; brandLogo: string | null; tagline: string }) {
  const initial = (brandName.trim()[0] || "B").toUpperCase();
  return (
    <div className="w-44 bg-black rounded-2xl p-1.5 shadow-xl flex-shrink-0">
      <div className="bg-white rounded-xl overflow-hidden h-80 flex flex-col">
        <div className="p-3 text-white text-center" style={{ background: color }}>
          <div className="h-7 w-7 rounded-full bg-white font-bold mx-auto flex items-center justify-center text-sm overflow-hidden" style={{ color }}>
            {brandLogo ? <img src={brandLogo} alt="" className="h-full w-full object-contain" /> : initial}
          </div>
          <div className="text-[10px] font-semibold mt-1">{brandName}</div>
          <div className="text-[8px] opacity-80">{tagline}</div>
        </div>
        <div className="flex-1 p-3 flex flex-col items-center justify-center text-center" style={{ background: bg }}>
          {stage === "claim" && (
            <>
              <div className="text-[10px] font-semibold" style={{ color }}>Champions League</div>
              <div className="text-[8px] mt-1 mb-3" style={{ color, opacity: 0.7 }}>Free {brandName} on matchday</div>
              <button className="text-[9px] h-7 px-3 rounded text-white font-semibold w-full" style={{ background: color }}>Claim</button>
            </>
          )}
          {stage === "voucher" && (
            <>
              <QrCode className="h-16 w-16" style={{ color }} />
              <div className="text-[8px] mt-2 font-mono" style={{ color }}>{brandName.slice(0, 3).toUpperCase()}-A7F3-K2025</div>
              <div className="text-[7px]" style={{ color, opacity: 0.7 }}>Show at the bar</div>
            </>
          )}
          {stage === "redeem" && (
            <>
              <div className="h-12 w-12 rounded-full flex items-center justify-center text-white" style={{ background: color }}><Check className="h-6 w-6" /></div>
              <div className="text-[10px] font-semibold mt-2" style={{ color }}>Redeemed!</div>
              <div className="text-[8px]" style={{ color, opacity: 0.7 }}>Enjoy responsibly</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------- REP PORTAL ------------------- */
const repCatalogue = [
  { brand: "Budweiser", name: "Budweiser Counter Mat", price: 12.5, img: budMat, kit: true },
  { brand: "Budweiser", name: "Budweiser Pint Glass (Bowtie)", price: 6.0, img: budGlassBowtie },
  { brand: "Budweiser", name: "Budweiser Cooler Box", price: 89.0, img: budCooler },
  { brand: "Budweiser", name: "Budweiser Polo Shirt", price: 28.0, img: budPolo },
  { brand: "Budweiser", name: "Budweiser Cap", price: 18.0, img: budCap },
  { brand: "Heineken", name: "Heineken Tap Handle", price: 22.0, img: null, kit: true },
  { brand: "Stella Artois", name: "Stella Artois Bar Runner", price: 9.75, img: null, kit: true },
  { brand: "Stella Artois", name: "Stella Artois Chalice", price: 8.5, img: null },
  { brand: "Corona Extra", name: "Corona Neon Sign", price: 45.0, img: null, kit: true },
  { brand: "Beavertown", name: "Beavertown Pump Clip", price: 7.5, img: null },
  { brand: "Birra Moretti", name: "Birra Moretti Coaster Pack", price: 4.5, img: null },
];

const repVenues = [
  "The Porterhouse Temple Bar",
  "Kehoe's Pub",
  "The Long Hall",
  "O'Donoghue's",
  "Mulligan's of Poolbeg St",
];

type RepBasket = Record<string, number>;
type RepOrder = { id: string; venue: string; items: number; total: number; status: "Verified" | "Awaiting verification" | "Delivered"; date: string };

function ProductTile({ name, brand, price, img, qty, onInc, onDec }: { name: string; brand: string; price: number; img: string | null; qty: number; onInc: () => void; onDec: () => void }) {
  return (
    <div className="bg-card border rounded-xl p-3 flex flex-col">
      <div className="aspect-square rounded-md mb-3 flex items-center justify-center bg-muted/40 border overflow-hidden">
        {img ? (
          <img src={img} alt={name} className="h-full w-full object-contain p-2" loading="lazy" />
        ) : (
          <Package className="h-10 w-10 text-muted-foreground/40" />
        )}
      </div>
      <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{brand}</div>
      <div className="font-semibold text-sm leading-snug mt-0.5 mb-1.5 line-clamp-2 min-h-[2.5em]">{name}</div>
      <div className="text-sm font-bold mb-2">{fmtEUR(price)}</div>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button onClick={onDec} className="h-7 w-7 rounded border hover:bg-muted transition-colors flex items-center justify-center"><Minus className="h-3 w-3" /></button>
          <div className="w-8 text-center text-sm font-medium tabular-nums">{qty}</div>
          <button onClick={onInc} className="h-7 w-7 rounded border hover:bg-muted transition-colors flex items-center justify-center"><Plus className="h-3 w-3" /></button>
        </div>
        <button onClick={onInc} className="text-xs h-7 px-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90">Add</button>
      </div>
    </div>
  );
}

export function RepPortal() {
  const { go, brands } = useDemo();
  const [tab, setTab] = React.useState<"catalogue" | "basket" | "orders" | "verify">("catalogue");
  const [brandFilter, setBrandFilter] = React.useState<string>("All brands");
  const [posType, setPosType] = React.useState("All POS types");
  const [search, setSearch] = React.useState("");
  const [venue, setVenue] = React.useState(repVenues[0]);
  const [basket, setBasket] = React.useState<RepBasket>({});
  const [orders, setOrders] = React.useState<RepOrder[]>([
    { id: "REP-2891", venue: "Kehoe's Pub", items: 4, total: 142.0, status: "Verified", date: "2 days ago" },
    { id: "REP-2887", venue: "The Long Hall", items: 2, total: 64.5, status: "Awaiting verification", date: "5 days ago" },
    { id: "REP-2851", venue: "O'Donoghue's", items: 6, total: 287.0, status: "Delivered", date: "1 week ago" },
  ]);
  const [tip, setTip] = React.useState(true);
  const [verifyOrder, setVerifyOrder] = React.useState<RepOrder | null>(null);

  const allBrandNames = ["All brands", ...Array.from(new Set([...brands.map((b) => b.name), ...repCatalogue.map((p) => p.brand)]))];
  const filtered = repCatalogue.filter((p) =>
    (brandFilter === "All brands" || p.brand === brandFilter) &&
    (search === "" || p.name.toLowerCase().includes(search.toLowerCase()))
  );
  const starterKits = filtered.filter((p) => p.kit);
  const products = filtered;

  const inc = (key: string) => setBasket((b) => ({ ...b, [key]: (b[key] || 0) + 1 }));
  const dec = (key: string) => setBasket((b) => ({ ...b, [key]: Math.max(0, (b[key] || 0) - 1) }));
  const basketEntries = Object.entries(basket).filter(([, q]) => q > 0).map(([name, q]) => {
    const p = repCatalogue.find((x) => x.name === name)!;
    return { ...p, qty: q };
  });
  const basketTotal = basketEntries.reduce((s, e) => s + e.price * e.qty, 0);
  const basketCount = basketEntries.reduce((s, e) => s + e.qty, 0);

  function placeOrder() {
    if (basketEntries.length === 0) return;
    const id = `REP-${Math.floor(Math.random() * 9000) + 1000}`;
    const ord: RepOrder = { id, venue, items: basketCount, total: basketTotal, status: "Awaiting verification", date: "Just now" };
    setOrders((o) => [ord, ...o]);
    setBasket({});
    setTab("verify");
    setVerifyOrder(ord);
  }

  function reorderPrevious() {
    setBasket({
      "Budweiser Counter Mat": 2,
      "Stella Artois Chalice": 6,
      "Heineken Tap Handle": 1,
    });
    setTab("basket");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ color: "var(--foreground)" }}>
      {/* Header */}
      <header className="h-14 px-5 flex items-center justify-between text-white" style={{ background: "var(--kick-sidebar)" }}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">Kick</span>
          <span className="text-xs opacity-70">· Rep Portal</span>
        </div>
        <button onClick={() => go("tenant-dashboard")} className="text-sm inline-flex items-center gap-1.5 hover:opacity-80">
          <ArrowLeft className="h-4 w-4" /> Admin
        </button>
      </header>

      {/* Venue context bar */}
      <div className="border-b bg-muted/30 px-5 py-2.5 flex items-center justify-between gap-3 flex-wrap text-sm">
        <div className="inline-flex items-center gap-2">
          <MapPinned className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Visiting:</span>
          <select value={venue} onChange={(e) => setVenue(e.target.value)} className="h-8 px-2 rounded-md border bg-background text-sm font-medium focus:ring-2 focus:ring-ring outline-none">
            {repVenues.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="text-xs text-muted-foreground">Aoife Byrne · Field rep · Dublin North</div>
      </div>

      <main className="flex-1 px-4 sm:px-6 py-5 max-w-6xl mx-auto w-full pb-24">
        {tab === "catalogue" && (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search catalogue…"
                className="w-full h-12 pl-10 pr-3 rounded-md border bg-card text-sm focus:ring-2 focus:ring-ring outline-none"
              />
            </div>

            {/* Brand pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
              {allBrandNames.map((b) => (
                <button
                  key={b}
                  onClick={() => setBrandFilter(b)}
                  className={`shrink-0 h-9 px-4 rounded-full text-sm font-medium border transition-colors ${brandFilter === b ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"}`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <select value={posType} onChange={(e) => setPosType(e.target.value)} className="h-10 px-3 rounded-md border bg-card text-sm">
                <option>All POS types</option>
                <option>Glassware</option>
                <option>Counter mats</option>
                <option>Apparel</option>
                <option>Signage</option>
              </select>
              <select className="h-10 px-3 rounded-md border bg-card text-sm">
                <option>All categories</option>
                <option>Starter kits</option>
                <option>Promotional</option>
                <option>Permanent fit</option>
              </select>
            </div>

            <button onClick={reorderPrevious} className="mb-5 inline-flex items-center gap-2 h-10 px-4 rounded-md border-2 border-primary text-primary font-semibold text-sm hover:bg-accent transition-colors">
              <RefreshCw className="h-4 w-4" /> Reorder previous
            </button>

            {/* Starter kits */}
            {starterKits.length > 0 && (
              <>
                <h2 className="font-bold text-lg mb-3">Starter kits</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                  {starterKits.map((p) => (
                    <ProductTile key={p.name} {...p} qty={basket[p.name] || 0} onInc={() => inc(p.name)} onDec={() => dec(p.name)} />
                  ))}
                </div>
              </>
            )}

            {tip && (
              <div className="mb-5 rounded-lg border border-primary/30 bg-accent/40 px-4 py-3 flex items-center justify-between gap-3">
                <div className="text-sm"><span className="mr-1">👉</span><strong>Tip:</strong> tap <em>Add</em> on a product to drop it straight into the basket.</div>
                <button onClick={() => setTip(false)} className="p-1 rounded hover:bg-background/60"><X className="h-4 w-4" /></button>
              </div>
            )}

            <div className="flex items-baseline gap-2 mb-3">
              <h2 className="font-bold text-lg">Products</h2>
              <span className="text-xs text-muted-foreground">({products.length} items)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {products.map((p) => (
                <ProductTile key={p.name} {...p} qty={basket[p.name] || 0} onInc={() => inc(p.name)} onDec={() => dec(p.name)} />
              ))}
            </div>
          </>
        )}

        {tab === "basket" && (
          <>
            <h1 className="text-xl font-bold mb-1">Basket</h1>
            <p className="text-xs text-muted-foreground mb-4">Delivering to {venue}</p>
            {basketEntries.length === 0 ? (
              <div className="bg-card border rounded-xl p-10 text-center">
                <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">Your basket is empty.</p>
                <button onClick={() => setTab("catalogue")} className="mt-4 h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Browse catalogue</button>
              </div>
            ) : (
              <>
                <div className="bg-card border rounded-xl divide-y">
                  {basketEntries.map((e) => (
                    <div key={e.name} className="p-4 flex items-center gap-3">
                      <div className="h-14 w-14 rounded border bg-muted/40 flex items-center justify-center overflow-hidden shrink-0">
                        {e.img ? <img src={e.img} alt="" className="h-full w-full object-contain p-1" /> : <Package className="h-6 w-6 text-muted-foreground/50" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{e.brand}</div>
                        <div className="font-medium text-sm truncate">{e.name}</div>
                        <div className="text-xs text-muted-foreground">{fmtEUR(e.price)} / unit</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => dec(e.name)} className="h-8 w-8 rounded border hover:bg-muted flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                        <div className="w-8 text-center text-sm font-medium tabular-nums">{e.qty}</div>
                        <button onClick={() => inc(e.name)} className="h-8 w-8 rounded border hover:bg-muted flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                      </div>
                      <div className="w-20 text-right font-semibold text-sm tabular-nums">{fmtEUR(e.price * e.qty)}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-card border rounded-xl p-5 mt-4">
                  <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Items</span><span className="tabular-nums">{basketCount}</span></div>
                  <div className="flex justify-between text-base font-semibold border-t pt-2 mt-2"><span>Total</span><span className="tabular-nums">{fmtEUR(basketTotal)}</span></div>
                  <button onClick={placeOrder} className="mt-4 w-full h-12 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 inline-flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" /> Submit order for {venue}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {tab === "orders" && (
          <>
            <h1 className="text-xl font-bold mb-4">My orders</h1>
            <div className="bg-card border rounded-xl divide-y">
              {orders.map((o) => (
                <div key={o.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-muted-foreground">{o.id}</div>
                    <div className="font-medium text-sm truncate">{o.venue}</div>
                    <div className="text-xs text-muted-foreground">{o.items} items · {fmtEUR(o.total)} · {o.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] px-2 py-1 rounded-full font-medium"
                      style={
                        o.status === "Verified"
                          ? { background: "var(--kick-success-bg)", color: "var(--kick-success)" }
                          : o.status === "Delivered"
                          ? { background: "var(--kick-amber-bg)", color: "var(--kick-amber)" }
                          : { background: "var(--accent)", color: "var(--accent-foreground)" }
                      }
                    >
                      {o.status}
                    </span>
                    {o.status === "Awaiting verification" && (
                      <button onClick={() => { setVerifyOrder(o); setTab("verify"); }} className="text-xs h-8 px-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 inline-flex items-center gap-1">
                        <Camera className="h-3.5 w-3.5" /> Verify
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "verify" && (
          <RepVerifyView
            order={verifyOrder ?? orders[0]}
            onDone={(id) => {
              setOrders((list) => list.map((o) => (o.id === id ? { ...o, status: "Verified" } : o)));
              setVerifyOrder(null);
              setTab("orders");
            }}
            onCancel={() => setTab("orders")}
          />
        )}
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 bg-card border-t grid grid-cols-4 z-40">
        {[
          { id: "catalogue", label: "Catalogue", icon: LayoutGrid },
          { id: "basket", label: `Basket${basketCount ? ` (${basketCount})` : ""}`, icon: ShoppingCart },
          { id: "orders", label: "Orders", icon: FileText },
          { id: "verify", label: "Verify", icon: Camera },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className="py-2.5 flex flex-col items-center gap-0.5 text-xs transition-colors relative"
              style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }}
            >
              {active && <span className="absolute top-0 inset-x-6 h-0.5 bg-primary rounded-b" />}
              <Icon className="h-5 w-5" />
              <span className="font-medium">{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function RepVerifyView({ order, onDone, onCancel }: { order: RepOrder | undefined; onDone: (id: string) => void; onCancel: () => void }) {
  const [photos, setPhotos] = React.useState<string[]>([]);
  const [gps, setGps] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  function addPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => setPhotos((p) => [...p, reader.result as string]);
      reader.readAsDataURL(f);
    });
  }
  function simulatePhoto() {
    setPhotos((p) => [...p, ""]);
  }
  function submit() {
    if (!order) return;
    setSubmitting(true);
    setTimeout(() => onDone(order.id), 900);
  }

  if (!order) {
    return <div className="text-sm text-muted-foreground">No order to verify.</div>;
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-1">Verify install</h1>
      <p className="text-xs text-muted-foreground mb-4">Order <span className="font-mono">{order.id}</span> · {order.venue}</p>

      <div className="bg-card border rounded-xl p-5 space-y-4">
        <button
          onClick={() => setGps(true)}
          className={`w-full h-11 rounded-md border-2 text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors ${gps ? "border-primary bg-accent text-primary" : "border-dashed hover:border-primary/50"}`}
        >
          {gps ? (<><Check className="h-4 w-4" /> GPS check passed · {order.venue}</>) : (<><MapPin className="h-4 w-4" /> Tap to confirm GPS at venue</>)}
        </button>

        <div>
          <div className="text-sm font-medium mb-2">Install photos ({photos.length}/3 minimum)</div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {photos.map((src, i) => (
              <div key={i} className="aspect-square rounded-md border bg-muted/40 overflow-hidden flex items-center justify-center">
                {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <Camera className="h-6 w-6 text-muted-foreground/50" />}
              </div>
            ))}
            {Array.from({ length: Math.max(0, 3 - photos.length) }).map((_, i) => (
              <div key={`ph-${i}`} className="aspect-square rounded-md border-2 border-dashed bg-muted/20 flex items-center justify-center text-muted-foreground/40">
                <Camera className="h-6 w-6" />
              </div>
            ))}
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={addPhoto} />
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => fileRef.current?.click()} className="h-10 rounded-md border text-sm font-medium hover:bg-muted inline-flex items-center justify-center gap-1.5">
              <Upload className="h-4 w-4" /> Upload
            </button>
            <button onClick={simulatePhoto} className="h-10 rounded-md border text-sm font-medium hover:bg-muted inline-flex items-center justify-center gap-1.5">
              <Camera className="h-4 w-4" /> Simulate capture
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Notes (optional)</label>
          <textarea rows={3} placeholder="Anything the brand team should know about this install…" className="mt-1 w-full p-3 rounded-md border bg-background text-sm focus:ring-2 focus:ring-ring outline-none" />
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <button onClick={onCancel} className="flex-1 h-12 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
        <button
          onClick={submit}
          disabled={!gps || photos.length < 3 || submitting}
          className="flex-1 h-12 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {submitting ? (<><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>) : (<><Check className="h-4 w-4" /> Submit verification</>)}
        </button>
      </div>
    </>
  );
}

export function Camp4() {
  const { go, draft } = useDemo();
  const [launching, setLaunching] = React.useState(false);
  const [headerColor, setHeaderColor] = React.useState(draft.brandColor);
  const [headerBg, setHeaderBg] = React.useState(draft.brandBg);
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
              <div className="flex items-center gap-2">
                <label className="relative h-10 w-10 rounded-md border cursor-pointer overflow-hidden" style={{ background: headerColor }}>
                  <input type="color" value={headerColor} onChange={(e) => setHeaderColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </label>
                <input value={headerColor} onChange={(e) => setHeaderColor(e.target.value)} className={I + " font-mono"} />
              </div>
            </Field>
            <Field label="Background colour">
              <div className="flex items-center gap-2">
                <label className="relative h-10 w-10 rounded-md border cursor-pointer overflow-hidden" style={{ background: headerBg }}>
                  <input type="color" value={headerBg} onChange={(e) => setHeaderBg(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </label>
                <input value={headerBg} onChange={(e) => setHeaderBg(e.target.value)} className={I + " font-mono"} />
              </div>
            </Field>
            <Field label="Header copy"><input defaultValue={`${draft.brandName} Champions League`} className={I} /></Field>
            <Field label="Hero subtitle"><input defaultValue={`Free ${draft.brandName} on matchday`} className={I} /></Field>
            <Field label="Privacy policy URL"><input defaultValue={`https://${draft.slug}.com/privacy`} className={I} /></Field>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-3">Live consumer preview</div>
            <div className="bg-card border rounded-xl p-6 flex justify-center gap-3 overflow-x-auto">
              <Phone stage="claim" color={headerColor} bg={headerBg} brandName={draft.brandName} brandLogo={draft.brandLogo} tagline={draft.brandTagline} />
              <Phone stage="voucher" color={headerColor} bg={headerBg} brandName={draft.brandName} brandLogo={draft.brandLogo} tagline={draft.brandTagline} />
              <Phone stage="redeem" color={headerColor} bg={headerBg} brandName={draft.brandName} brandLogo={draft.brandLogo} tagline={draft.brandTagline} />
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
  const { go, draft } = useDemo();
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-xl bg-card border rounded-2xl shadow-xl p-10 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-5 animate-in zoom-in duration-700">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{draft.brandName} Champions League is live.</h1>
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
            Print QR posters →
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
  { name: "Budweiser Counter Mat", price: 12.5, key: "mat", img: budMat, sub: "Bar runner, 60cm" },
  { name: "Budweiser Pint Glass (Bowtie)", price: 6.0, key: "glass", img: budGlassBowtie, sub: "Per glass" },
  { name: "Budweiser Pint Glass (Folds of Honor)", price: 7.5, key: "glassh", img: budGlassHonor, sub: "Per glass" },
  { name: "Budweiser Cooler Box", price: 89.0, key: "cooler", img: budCooler, sub: "54 qt steel" },
  { name: "Budweiser Polo Shirt (150th)", price: 28.0, key: "polo", img: budPolo, sub: "Embroidered, S–XXL" },
  { name: "Budweiser Tee (Clydesdales)", price: 22.0, key: "tee", img: budTshirt, sub: "Cotton, S–XXL" },
  { name: "Budweiser Cap (Label Patch)", price: 18.0, key: "cap", img: budCap, sub: "Rope brim, navy" },
  { name: "Budweiser Kozies", price: 4.5, key: "kozy", img: budKozy, sub: "Made of America print" },
];

export function PosmBuilder() {
  const { go } = useDemo();
  const [qty, setQty] = React.useState<Record<string, number>>({
    mat: 5, glass: 60, glassh: 0, cooler: 2, polo: 8, tee: 12, cap: 8, kozy: 50,
  });
  const total = products.reduce((s, p) => s + p.price * (qty[p.key] || 0), 0);
  const budget = 5000;
  function inc(k: string, d: number) { setQty((q) => ({ ...q, [k]: Math.max(0, (q[k] || 0) + d) })); }
  return (
    <AppShell context="tenant">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <button onClick={() => go("tenant-dashboard")}>Dashboard</button><ChevronRight className="h-3 w-3 mx-1" />
          <button onClick={() => go("posm-list")}>POSM</button><ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-foreground">New order</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">POSM order</h1>
        <p className="text-sm text-muted-foreground mb-6">For Budweiser Champions League · 5 venues · Budget {fmtEUR(budget)}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.key} className="bg-card border rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="h-32 rounded-md mb-3 flex items-center justify-center bg-white border overflow-hidden">
                  <img src={p.img} alt={p.name} className="h-full w-full object-contain p-2" loading="lazy" />
                </div>
                <div className="font-semibold text-sm">{p.name}</div>
                {p.sub && <div className="text-[11px] text-muted-foreground">{p.sub}</div>}
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-bold">{fmtEUR(p.price)}<span className="text-[11px] font-normal text-muted-foreground"> / unit</span></div>
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
                  <span className="truncate pr-2">{qty[p.key]}× {p.name}</span>
                  <span className="tabular-nums font-medium whitespace-nowrap">{fmtEUR(p.price * qty[p.key])}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Budget allocated</span><span className="tabular-nums">{fmtEUR(budget)}</span></div>
              <div className="flex justify-between font-semibold"><span>Spent in basket</span><span className="tabular-nums">{fmtEUR(total)}</span></div>
              <div
                className="flex justify-between p-2 rounded-md"
                style={
                  total <= budget
                    ? { background: "var(--kick-success-bg)", color: "var(--kick-success)" }
                    : { background: "oklch(0.95 0.05 25)", color: "oklch(0.45 0.18 25)" }
                }
              >
                <span className="font-medium">{total <= budget ? "Remaining" : "Over budget"}</span>
                <span className="tabular-nums font-semibold">{fmtEUR(Math.abs(budget - total))}</span>
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

function RepMessageDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { go } = useDemo();
  const [sent, setSent] = React.useState(false);
  const [channel, setChannel] = React.useState<"sms" | "email">("sms");
  const [rep, setRep] = React.useState("Aoife Byrne (Field rep · Dublin North)");
  const [msg, setMsg] = React.useState(
    "Hi — please verify the POSM install at The Porterhouse Temple Bar. Tap the link to open the rep capture page and take photos of the counter mat, glassware and bar runner in place."
  );
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-card border rounded-xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        {!sent ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold inline-flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Send rep message</h3>
              <button onClick={onClose} className="p-1 rounded hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Rep">
                <select value={rep} onChange={(e) => setRep(e.target.value)} className={I}>
                  <option>Aoife Byrne (Field rep · Dublin North)</option>
                  <option>Sarah Connolly (Field rep · Dublin South)</option>
                  <option>James O'Brien (Field rep · Dublin City)</option>
                </select>
              </Field>
              <Field label="Channel">
                <div className="flex gap-2">
                  <button onClick={() => setChannel("sms")} className={`flex-1 h-10 rounded-md border text-sm inline-flex items-center justify-center gap-1.5 transition-colors ${channel === "sms" ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}>
                    <Smartphone className="h-4 w-4" /> SMS
                  </button>
                  <button onClick={() => setChannel("email")} className={`flex-1 h-10 rounded-md border text-sm inline-flex items-center justify-center gap-1.5 transition-colors ${channel === "email" ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}>
                    <Mail className="h-4 w-4" /> Email
                  </button>
                </div>
              </Field>
              <Field label="Message">
                <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} className="w-full p-3 rounded-md border bg-background text-sm focus:ring-2 focus:ring-ring outline-none" />
              </Field>
              <div className="p-3 rounded-md bg-muted/50 border text-xs text-muted-foreground inline-flex items-start gap-2">
                <Camera className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>A unique web link will be appended that opens the rep capture page on their phone — pre-loaded with venue, GPS check and photo upload.</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={onClose} className="h-10 px-4 rounded-md border text-sm hover:bg-muted">Cancel</button>
              <button
                onClick={() => setSent(true)}
                className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 hover:opacity-90"
              >
                <Send className="h-4 w-4" /> Send {channel.toUpperCase()}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-3"><Check className="h-6 w-6" /></div>
            <h3 className="font-semibold">Message sent</h3>
            <p className="text-sm text-muted-foreground mt-1">{rep.split(" (")[0]} will receive the verification link via {channel.toUpperCase()}.</p>
            <div className="mt-5 grid grid-cols-1 gap-2 text-left">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-1">Jump to</div>
              <button
                onClick={() => { onClose(); go("field-evidence"); }}
                className="flex items-center justify-between p-3 rounded-md border hover:bg-muted transition-colors"
              >
                <span className="inline-flex items-center gap-2 text-sm"><Camera className="h-4 w-4" /> Field Evidence</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => { onClose(); go("camp-live"); }}
                className="flex items-center justify-between p-3 rounded-md border hover:bg-muted transition-colors"
              >
                <span className="inline-flex items-center gap-2 text-sm"><Megaphone className="h-4 w-4" /> Campaign · Champions League</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => { onClose(); go("posm-status"); }}
                className="flex items-center justify-between p-3 rounded-md border hover:bg-muted transition-colors"
              >
                <span className="inline-flex items-center gap-2 text-sm"><Package className="h-4 w-4" /> POSM order POSM-A7F3K2025</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <button onClick={onClose} className="mt-4 h-10 px-5 rounded-md border text-sm font-medium hover:bg-muted">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function PosmStatus() {
  const { go } = useDemo();
  const [stage, setStage] = React.useState(1);
  const [repOpen, setRepOpen] = React.useState(false);
  function advance() { setStage((s) => Math.min(posmSteps.length, s + 1)); }
  return (
    <AppShell context="tenant">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center text-xs text-muted-foreground mb-3">
          <button onClick={() => go("tenant-dashboard")}>Dashboard</button><ChevronRight className="h-3 w-3 mx-1" />
          <button onClick={() => go("posm-list")}>POSM</button><ChevronRight className="h-3 w-3 mx-1" />
          <span className="text-foreground">POSM-A7F3K2025</span>
        </div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Order POSM-A7F3K2025</h1>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: "var(--kick-success-bg)", color: "var(--kick-success)" }}>
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Status: {posmSteps[stage - 1]}
            </div>
          </div>
          <button
            onClick={() => setRepOpen(true)}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md border bg-background text-sm font-medium hover:bg-muted transition-colors"
          >
            <MessageSquare className="h-4 w-4" /> Send Rep message
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-5">Status timeline</h3>
            <ol className="space-y-3">
              {posmSteps.map((s, i) => {
                const done = i < stage;
                const current = i === stage;
                const isVerified = s === "Verified";
                return (
                  <li key={s} className="flex items-center gap-3 animate-in fade-in duration-300">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${done ? "bg-primary text-primary-foreground" : current ? "border-2 border-primary text-primary" : "border bg-muted"}`}>
                      {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm ${done ? "font-medium" : current ? "font-semibold" : "text-muted-foreground"}`}>{s}</div>
                      {done && i === 0 && <div className="text-[11px] text-muted-foreground">2 minutes ago</div>}
                      {current && isVerified && (
                        <div className="text-[11px] text-muted-foreground mt-0.5">Awaiting field rep photo capture at venue.</div>
                      )}
                    </div>
                    {current && isVerified && (
                      <button
                        onClick={() => setRepOpen(true)}
                        className="text-xs h-8 px-3 rounded-md border bg-background font-medium hover:bg-muted transition-colors inline-flex items-center gap-1.5"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Send Rep message
                      </button>
                    )}
                    {current && !isVerified && stage < posmSteps.length && (
                      <button
                        onClick={advance}
                        className="text-xs h-8 px-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all hover:-translate-y-0.5"
                      >
                        {stage === 1 ? "Run budget check" : stage === 2 ? "Approve" : `Mark ${s}`}
                      </button>
                    )}
                    {current && isVerified && (
                      <button
                        onClick={advance}
                        className="text-xs h-8 px-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all hover:-translate-y-0.5"
                      >
                        Mark Verified
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
              <div className="flex justify-between"><dt className="text-muted-foreground">Items</dt><dd>8 SKUs</dd></div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-2"><dt>Total</dt><dd>{fmtEUR(4657.5)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Idempotency key</dt><dd className="font-mono text-[10px]">idem-3f7a9c2e</dd></div>
            </dl>
          </div>
        </div>

        <button onClick={() => go("final-dashboard")} className="mt-6 text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
        </button>
      </div>
      <RepMessageDialog open={repOpen} onClose={() => setRepOpen(false)} />
    </AppShell>
  );
}

/* ------------------- CAMPAIGNS LIST ------------------- */
export function CampaignsList() {
  const { go, draft } = useDemo();
  const items = [
    { id: "C-2025-001", name: `${draft.brandName} Champions League`, status: "Live", venues: 5, redemptions: 0, screen: "camp-live" as const },
  ];
  return (
    <AppShell context="tenant">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-sm text-muted-foreground mt-1">All {draft.brandName} campaigns across selected venues.</p>
          </div>
          <button onClick={() => go("camp-1")} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all hover:-translate-y-0.5">
            <Plus className="h-4 w-4" /> New campaign
          </button>
        </div>
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b bg-muted/30">
                <th className="px-5 py-3 font-semibold">Campaign</th>
                <th className="py-3 font-semibold">ID</th>
                <th className="py-3 font-semibold">Venues</th>
                <th className="py-3 font-semibold">Redemptions</th>
                <th className="py-3 font-semibold">Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((c) => (
                <tr key={c.id} className="hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => go(c.screen)}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-md flex items-center justify-center text-white text-xs font-bold" style={{ background: draft.brandColor }}>
                        {draft.brandName.slice(0, 1)}
                      </div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-4 font-mono text-xs text-muted-foreground">{c.id}</td>
                  <td className="py-4">{c.venues}</td>
                  <td className="py-4 tabular-nums">{c.redemptions}</td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--kick-success-bg)", color: "var(--kick-success)" }}>
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {c.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 pr-5 text-right">
                    <button onClick={(e) => { e.stopPropagation(); go(c.screen); }} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                      <Eye className="h-3 w-3" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

/* ------------------- POSM LIST ------------------- */
export function PosmList() {
  const { go, draft, repOrders, updateRepOrder } = useDemo();
  const items = [
    { id: "POSM-A7F3K2025", campaign: `${draft.brandName} Champions League`, items: 8, total: 4657.5, status: "In progress" },
  ];
  const pending = repOrders.filter((o) => o.status === "Pending sign-off" || o.status === "Awaiting verification");
  return (
    <AppShell context="tenant">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">POSM orders</h1>
            <p className="text-sm text-muted-foreground mt-1">Point-of-sale materials across {draft.brandName} campaigns.</p>
          </div>
          <button onClick={() => go("posm-builder")} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all hover:-translate-y-0.5">
            <Plus className="h-4 w-4" /> New order
          </button>
        </div>

        {/* Rep orders awaiting admin sign-off */}
        <div className="bg-card border rounded-xl overflow-hidden mb-6">
          <div className="px-5 py-3 border-b bg-muted/30 flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Rep portal orders</span>
              {pending.length > 0 && (
                <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "var(--kick-amber-bg)", color: "var(--kick-amber)" }}>
                  {pending.length} need sign-off
                </span>
              )}
            </div>
            <button onClick={() => go("rep-portal")} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              Open Rep Portal <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {repOrders.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">No rep orders yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b">
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="py-3 font-semibold">Venue</th>
                  <th className="py-3 font-semibold">Rep</th>
                  <th className="py-3 font-semibold">Items</th>
                  <th className="py-3 font-semibold">Total</th>
                  <th className="py-3 font-semibold">Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {repOrders.map((o) => {
                  const needsSignoff = o.status === "Pending sign-off" || o.status === "Awaiting verification";
                  return (
                    <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs">{o.id}</td>
                      <td className="py-3">{o.venue}</td>
                      <td className="py-3 text-muted-foreground">{o.rep}</td>
                      <td className="py-3 tabular-nums">{o.items}</td>
                      <td className="py-3 tabular-nums font-medium">{fmtEUR(o.total)}</td>
                      <td className="py-3">
                        <span
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={
                            o.status === "Approved" || o.status === "Verified"
                              ? { background: "var(--kick-success-bg)", color: "var(--kick-success)" }
                              : needsSignoff
                              ? { background: "var(--kick-amber-bg)", color: "var(--kick-amber)" }
                              : { background: "var(--accent)", color: "var(--accent-foreground)" }
                          }
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" /> {o.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 pr-5 text-right">
                        {needsSignoff ? (
                          <button
                            onClick={() => updateRepOrder(o.id, { status: "Approved" })}
                            className="text-xs h-8 px-3 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 inline-flex items-center gap-1"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" /> Sign off
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                            <Check className="h-3 w-3" /> Done
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b bg-muted/30">
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="py-3 font-semibold">Campaign</th>
                <th className="py-3 font-semibold">SKUs</th>
                <th className="py-3 font-semibold">Total</th>
                <th className="py-3 font-semibold">Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((o) => (
                <tr key={o.id} className="hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => go("posm-status")}>
                  <td className="px-5 py-4 font-mono text-xs">{o.id}</td>
                  <td className="py-4">{o.campaign}</td>
                  <td className="py-4">{o.items}</td>
                  <td className="py-4 tabular-nums font-medium">{fmtEUR(o.total)}</td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> {o.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 pr-5 text-right">
                    <button onClick={(e) => { e.stopPropagation(); go("posm-status"); }} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                      <Eye className="h-3 w-3" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="font-semibold text-sm mt-8 mb-3 text-muted-foreground uppercase tracking-wider text-[11px]">POS items in catalogue</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((p) => (
            <button
              key={p.key}
              onClick={() => go("posm-builder")}
              className="bg-card border rounded-xl p-3 text-left hover:shadow-md transition-shadow"
            >
              <div className="h-24 rounded bg-white border overflow-hidden flex items-center justify-center mb-2">
                <img src={p.img} alt={p.name} className="h-full w-full object-contain p-1" loading="lazy" />
              </div>
              <div className="text-xs font-medium truncate">{p.name}</div>
              <div className="text-[11px] text-muted-foreground">{fmtEUR(p.price)}</div>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

/* ------------------- FIELD EVIDENCE ------------------- */
export function FieldEvidence() {
  const { go, draft } = useDemo();
  const campaigns = [
    { id: "C-2025-001", name: `${draft.brandName} Champions League`, photos: 0, pending: 0 },
  ];
  return (
    <AppShell context="tenant">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Field Evidence</h1>
        <p className="text-sm text-muted-foreground mb-6">Photo verification of POSM installs and consumer activations, by campaign.</p>

        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b bg-muted/30">
                <th className="px-5 py-3 font-semibold">Campaign</th>
                <th className="py-3 font-semibold">Photos</th>
                <th className="py-3 font-semibold">Pending review</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => go("camp-live")}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-4 tabular-nums">{c.photos}</td>
                  <td className="py-4 tabular-nums">{c.pending}</td>
                  <td className="py-4 pr-5 text-right">
                    <span className="text-xs text-muted-foreground">No photos yet — send rep message from POSM order</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

/* ------------------- FINAL DASHBOARD ------------------- */
export function FinalDashboard() {
  const { reset, draft, go } = useDemo();
  return (
    <AppShell context="tenant">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl p-5 mb-6 text-white animate-in fade-in slide-in-from-top-2" style={{ background: `linear-gradient(135deg, ${draft.brandColor}, ${draft.brandColor}cc)` }}>
          <div className="font-bold text-lg">{draft.tradingName} is live on Kick. {draft.adminName.split(" ")[0]}, your platform is ready to scale.</div>
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
              <button onClick={() => go("camp-live")} className="w-full text-left p-4 rounded-lg border hover:bg-muted/40 transition-all hover:-translate-y-0.5">
                <div className="font-medium text-sm">View campaign performance →</div>
                <div className="text-xs text-muted-foreground mt-0.5">Champions League · 5 venues</div>
              </button>
              <button onClick={() => go("posm-list")} className="w-full text-left p-4 rounded-lg border hover:bg-muted/40 transition-all hover:-translate-y-0.5">
                <div className="font-medium text-sm">Order more POSM →</div>
                <div className="text-xs text-muted-foreground mt-0.5">{fmtEUR(342.5)} budget remaining</div>
              </button>
              <button onClick={() => go("invite-team")} className="w-full text-left p-4 rounded-lg border hover:bg-muted/40 transition-all hover:-translate-y-0.5">
                <div className="font-medium text-sm">Invite a team member →</div>
                <div className="text-xs text-muted-foreground mt-0.5">Brand admins, ops, field</div>
              </button>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Demo complete — what just happened</h3>
            <ol className="space-y-2 text-sm">
              {[
                `Niall onboarded ${draft.tradingName} as a tenant`,
                `Configured ${draft.brandName} as the first brand`,
                `Enabled ${draft.modulesEnabled} modules`,
                "Generated API access + integrations",
                `Invited ${draft.adminName} as Tenant Admin`,
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

/* ------------------- BRANDS LIST + ADD BRAND ------------------- */
export function BrandsList() {
  const { brands, addBrand, draft } = useDemo();
  const [open, setOpen] = React.useState(false);
  return (
    <AppShell context="tenant">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Brands</h1>
            <p className="text-sm text-muted-foreground mt-1">All brands under {draft.tradingName}.</p>
          </div>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all hover:-translate-y-0.5">
            <Plus className="h-4 w-4" /> Add brand
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((b) => (
            <div key={b.id} className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0" style={{ background: b.color }}>
                  {b.logo ? <img src={b.logo} alt={b.name} className="h-full w-full object-contain bg-white" /> : b.name.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{b.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{b.tagline || `Slug: ${b.slug}`}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-block h-4 w-4 rounded border" style={{ background: b.color }} />
                <span className="inline-block h-4 w-4 rounded border" style={{ background: b.bg }} />
                <span className="text-[11px] text-muted-foreground ml-auto">{b.slug}</span>
              </div>
            </div>
          ))}

          <button onClick={() => setOpen(true)} className="border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors min-h-[140px]">
            <Plus className="h-6 w-6 mb-2" />
            <div className="text-sm font-medium">Add another brand</div>
          </button>
        </div>
      </div>
      <AddBrandDialog open={open} onClose={() => setOpen(false)} onSave={(b) => { addBrand(b); setOpen(false); }} />
    </AppShell>
  );
}

function AddBrandDialog({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (b: Omit<Brand, "id">) => void }) {
  const [name, setName] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const [color, setColor] = React.useState("#1e3a8a");
  const [bg, setBg] = React.useState("#E6F0FF");
  const [logo, setLogo] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) { setName(""); setTagline(""); setColor("#1e3a8a"); setBg("#E6F0FF"); setLogo(null); }
  }, [open]);

  if (!open) return null;
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(f);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-card border rounded-xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold inline-flex items-center gap-2"><Palette className="h-4 w-4" /> Add brand</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Brand name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Stella Artois" className={I} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Slug (auto)</label>
              <input value={slug} readOnly className={`${I} bg-muted/50`} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Tagline</label>
            <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Optional" className={I} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Brand colour</label>
              <div className="mt-1 flex items-center gap-2">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-12 rounded border bg-background cursor-pointer" />
                <input value={color} onChange={(e) => setColor(e.target.value)} className={I} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Background</label>
              <div className="mt-1 flex items-center gap-2">
                <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-12 rounded border bg-background cursor-pointer" />
                <input value={bg} onChange={(e) => setBg(e.target.value)} className={I} />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Brand logo</label>
            <label className="mt-1 flex items-center gap-3 p-3 rounded-md border border-dashed hover:bg-muted/40 cursor-pointer transition-colors">
              {logo ? (
                <img src={logo} alt="logo" className="h-10 w-10 object-contain bg-white border rounded" />
              ) : (
                <div className="h-10 w-10 rounded border flex items-center justify-center text-muted-foreground"><Upload className="h-4 w-4" /></div>
              )}
              <span className="text-sm text-muted-foreground">{logo ? "Replace logo" : "Click to upload (PNG / SVG)"}</span>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
          </div>

          <div className="rounded-lg p-4 border" style={{ background: bg }}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded flex items-center justify-center text-white font-bold overflow-hidden" style={{ background: color }}>
                {logo ? <img src={logo} alt="" className="h-full w-full object-contain bg-white" /> : (name || "B").slice(0, 1)}
              </div>
              <div>
                <div className="font-semibold" style={{ color }}>{name || "Brand preview"}</div>
                <div className="text-xs text-muted-foreground">{tagline || "Live brand preview"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="h-10 px-4 rounded-md border text-sm hover:bg-muted">Cancel</button>
          <button
            onClick={() => name.trim() && onSave({ name: name.trim(), slug, color, bg, tagline, logo })}
            disabled={!name.trim()}
            className="h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
          >
            <Check className="h-4 w-4" /> Add brand
          </button>
        </div>
      </div>
    </div>
  );
}
