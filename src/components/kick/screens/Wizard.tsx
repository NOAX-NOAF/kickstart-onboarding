import * as React from "react";
import { useDemo, type Screen } from "@/lib/demo-state";
import { AppShell } from "../AppShell";
import { WizardProgress } from "../WizardProgress";
import {
  ArrowLeft, ArrowRight, ChevronRight, Upload, Check, QrCode, Megaphone,
  Package, ClipboardList, Camera, Smartphone, Monitor, Bell, Copy, Loader2,
} from "lucide-react";

function Crumbs({ step }: { step: number }) {
  return (
    <div className="flex items-center text-xs text-muted-foreground mb-3">
      <span>Home</span>
      <ChevronRight className="h-3 w-3 mx-1" />
      <span>Tenants</span>
      <ChevronRight className="h-3 w-3 mx-1" />
      <span className="text-foreground">Add new (Step {step}/6)</span>
    </div>
  );
}

function NavButtons({ back, next, nextLabel = "Continue" }: { back?: Screen; next: Screen; nextLabel?: string }) {
  const { go } = useDemo();
  return (
    <div className="flex justify-between mt-8 max-w-3xl">
      {back ? (
        <button onClick={() => go(back)} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md border bg-background text-sm font-medium hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      ) : (
        <button onClick={() => go("ops-desk")} className="h-10 px-4 rounded-md border bg-background text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
      )}
      <button onClick={() => go(next)} className="inline-flex items-center gap-1.5 h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all hover:-translate-y-0.5">
        {nextLabel} <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
      {hint && <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}

const I = "h-10 w-full px-3 rounded-md border bg-background text-sm focus:ring-2 focus:ring-ring outline-none transition-all";

function ColorSwatch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label className="relative h-10 w-10 rounded-md border cursor-pointer overflow-hidden" style={{ background: value }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={I + " font-mono text-xs"}
      />
    </div>
  );
}

/* ------------------- STEP 1 ------------------- */
export function Wiz1() {
  const { draft, updateDraft } = useDemo();
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <Crumbs step={1} />
        <h1 className="text-2xl font-bold tracking-tight">Onboard new tenant</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-8">Step 1 of 6: Tenant details.</p>
        <WizardProgress step={1} />
        <div className="bg-card border rounded-xl p-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Legal name">
              <input value={draft.legalName} onChange={(e) => updateDraft({ legalName: e.target.value })} className={I} />
            </Field>
            <Field label="Trading name (display in Kick)">
              <input value={draft.tradingName} onChange={(e) => updateDraft({ tradingName: e.target.value })} className={I} />
            </Field>
            <Field label="Slug (URL-safe)" hint={`kick.app/${draft.slug}`}>
              <input value={draft.slug} onChange={(e) => updateDraft({ slug: e.target.value })} className={I + " font-mono"} />
            </Field>
            <div />
            <Field label="Primary contact name">
              <input value={draft.contactName} onChange={(e) => updateDraft({ contactName: e.target.value })} className={I} />
            </Field>
            <Field label="Primary contact email">
              <input value={draft.contactEmail} onChange={(e) => updateDraft({ contactEmail: e.target.value })} className={I} />
            </Field>
            <Field label="Tenant brand colour">
              <ColorSwatch value={draft.tenantColor} onChange={(v) => updateDraft({ tenantColor: v })} />
            </Field>
            <Field label="Tenant brand background">
              <ColorSwatch value={draft.tenantBg} onChange={(v) => updateDraft({ tenantBg: v })} />
            </Field>
          </div>
        </div>
        <NavButtons next="wiz-2" />
      </div>
    </AppShell>
  );
}

/* ------------------- STEP 2 ------------------- */
export function Wiz2() {
  const { draft, updateDraft } = useDemo();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const uploaded = !!draft.brandLogo;

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      updateDraft({ brandLogo: reader.result as string, brandLogoName: file.name });
    };
    reader.readAsDataURL(file);
  }

  const initial = (draft.brandName.trim()[0] || "B").toUpperCase();

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <Crumbs step={2} />
        <h1 className="text-2xl font-bold tracking-tight">Onboard new tenant</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-8">Step 2 of 6: First brand. Add the first brand under {draft.tradingName}. You can add more later.</p>
        <WizardProgress step={2} />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-card border rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Brand name">
                <input value={draft.brandName} onChange={(e) => updateDraft({ brandName: e.target.value })} className={I} />
              </Field>
              <Field label="Slug">
                <input value={draft.brandSlug} onChange={(e) => updateDraft({ brandSlug: e.target.value })} className={I + " font-mono"} />
              </Field>
              <Field label="Brand colour">
                <ColorSwatch value={draft.brandColor} onChange={(v) => updateDraft({ brandColor: v })} />
              </Field>
              <Field label="Brand bg colour">
                <ColorSwatch value={draft.brandBg} onChange={(v) => updateDraft({ brandBg: v })} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Tagline">
                  <input value={draft.brandTagline} onChange={(e) => updateDraft({ brandTagline: e.target.value })} className={I} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Brand logo</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className={`mt-1 w-full h-32 rounded-md border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                    uploaded ? "border-primary bg-accent/30" : "hover:border-primary/50 hover:bg-muted/40"
                  }`}
                >
                  {uploaded ? (
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full overflow-hidden border bg-white flex items-center justify-center">
                        <img src={draft.brandLogo!} alt="logo" className="h-full w-full object-contain" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> {draft.brandLogoName}</div>
                        <div className="text-xs text-muted-foreground">uploaded · click to replace</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <div className="text-sm font-medium">Drop logo or click to upload</div>
                      <div className="text-[11px] text-muted-foreground">PNG, SVG, max 5MB</div>
                    </>
                  )}
                </button>
              </div>
              <div className="md:col-span-2">
                <Field label="Primary contact at this brand">
                  <input
                    defaultValue={`${draft.contactName} / ${draft.contactEmail}`}
                    className={I}
                  />
                </Field>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="text-xs font-medium text-muted-foreground mb-2">Live consumer preview</div>
            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
              <div className="p-6 text-white" style={{ background: draft.brandColor }}>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white font-bold text-xl flex items-center justify-center overflow-hidden" style={{ color: draft.brandColor }}>
                    {draft.brandLogo ? (
                      <img src={draft.brandLogo} alt="logo" className="h-full w-full object-contain" />
                    ) : (
                      initial
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{draft.brandName || "Brand name"}</div>
                    <div className="text-xs opacity-80">{draft.brandTagline}</div>
                  </div>
                </div>
              </div>
              <div className="p-6" style={{ background: draft.brandBg }}>
                <div className="text-sm mb-3" style={{ color: draft.brandColor }}>Scan, claim, redeem at the bar.</div>
                <button className="w-full h-11 rounded-md text-white font-semibold text-sm" style={{ background: draft.brandColor }}>Claim Your Voucher</button>
              </div>
            </div>
          </div>
        </div>
        <NavButtons back="wiz-1" next="wiz-3" />
      </div>
    </AppShell>
  );
}

/* ------------------- STEP 3 ------------------- */
const modules = [
  { name: "QR Redemption", desc: "Consumer voucher claim + redeem at venues.", icon: QrCode },
  { name: "Campaigns", desc: "Build promotional campaigns with rules and rewards.", icon: Megaphone },
  { name: "POSM", desc: "Order point-of-sale materials, track delivery, manage budgets.", icon: Package },
  { name: "POS Jobs", desc: "Field staff dispatch for POS install + verification.", icon: ClipboardList },
  { name: "Field Evidence", desc: "UGC photo grid with verification queue.", icon: Camera },
  { name: "Consumer Preview", desc: "Preview claim page as consumer.", icon: Monitor },
  { name: "Staff PWA", desc: "Mobile rep app for field activations.", icon: Smartphone },
  { name: "Alerts", desc: "Anti-fraud, velocity monitoring, threshold breaches.", icon: Bell },
];

function Toggle({ defaultChecked = true }: { defaultChecked?: boolean }) {
  const [on, setOn] = React.useState(defaultChecked);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`h-6 w-10 rounded-full transition-colors relative ${on ? "bg-primary" : "bg-muted-foreground/30"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-[18px]" : "translate-x-0.5"}`} />
    </button>
  );
}

export function Wiz3() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <Crumbs step={3} />
        <h1 className="text-2xl font-bold tracking-tight">Onboard new tenant</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-8">Step 3 of 6: Enable modules. Choose which Kick modules ABInBev can access. Toggle anything you want for launch.</p>
        <WizardProgress step={3} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((m) => (
            <div key={m.name} className="bg-card border rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
                  <m.icon className="h-4 w-4 text-accent-foreground" />
                </div>
                <Toggle />
              </div>
              <div className="font-semibold text-sm">{m.name}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-snug">{m.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-lg border bg-muted/40 text-sm">
          💡 <span className="text-muted-foreground">Tier 2 finance modules (Settlements, Contracts, Ledger, Audit Trail) and Tier 3 admin modules (Customers, Brands, Master Venues, Staff, Users) are always-on for every tenant.</span>
        </div>
        <NavButtons back="wiz-2" next="wiz-4" />
      </div>
    </AppShell>
  );
}

/* ------------------- STEP 4 ------------------- */
export function Wiz4() {
  const [keyGen, setKeyGen] = React.useState(false);
  const [csvDone, setCsvDone] = React.useState(false);
  const apiKey = "kick_pk_abinbev_3f7a9c2e1b4d8";
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <Crumbs step={4} />
        <h1 className="text-2xl font-bold tracking-tight">Onboard new tenant</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-8">Step 4 of 6: Integrations & API access. Set up data connections for this tenant. You can change these any time.</p>
        <WizardProgress step={4} />
        <div className="space-y-5">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Outbound webhooks</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Slack channel"><input placeholder="https://hooks.slack.com/services/…" className={I} /></Field>
              <Field label="Microsoft Teams URL"><input placeholder="https://outlook.office.com/webhook/…" className={I} /></Field>
              <Field label="Custom webhook"><input placeholder="https://api.abinbev.com/kick/events" className={I} /></Field>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">API access</h3>
            {!keyGen ? (
              <button onClick={() => setKeyGen(true)} className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all hover:-translate-y-0.5">
                Generate API key
              </button>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-md bg-muted border font-mono text-sm animate-in fade-in zoom-in-95">
                <span className="flex-1 truncate">{apiKey}</span>
                <button className="p-1.5 hover:bg-background rounded transition-colors"><Copy className="h-4 w-4" /></button>
              </div>
            )}
            <a className="block mt-3 text-xs text-primary hover:underline">API documentation →</a>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Settlement bank account</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Account holder name"><input defaultValue="AB InBev Ireland Limited" className={I} /></Field>
              <Field label="Bank">
                <select className={I}><option>Bank of Ireland</option><option>AIB</option><option>Ulster Bank</option><option>Other</option></select>
              </Field>
              <Field label="IBAN"><input defaultValue="IE29 BOFI 9000 1712 3456 78" className={I + " font-mono"} /></Field>
              <Field label="BIC"><input defaultValue="BOFIIE2D" className={I + " font-mono"} /></Field>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">Used for paying out venue settlements. Encrypted at rest.</p>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Data import (optional)</h3>
            <div className="space-y-3">
              <button
                onClick={() => setCsvDone(true)}
                className={`w-full text-left p-3 rounded-md border-2 border-dashed transition-all ${csvDone ? "border-primary bg-accent/30" : "hover:border-primary/50"}`}
              >
                {csvDone ? (
                  <div className="text-sm font-medium text-primary inline-flex items-center gap-1.5"><Check className="h-4 w-4" /> 247 venues imported</div>
                ) : (
                  <div className="text-sm">📤 Upload venue list (CSV)</div>
                )}
              </button>
              <button className="w-full text-left p-3 rounded-md border-2 border-dashed hover:border-primary/50 transition-colors text-sm">📤 Upload existing campaign data</button>
              <a className="block text-xs text-primary hover:underline">Skip — set up venues from scratch</a>
            </div>
          </div>
        </div>
        <NavButtons back="wiz-3" next="wiz-5" />
      </div>
    </AppShell>
  );
}

/* ------------------- STEP 5 ------------------- */
export function Wiz5() {
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <Crumbs step={5} />
        <h1 className="text-2xl font-bold tracking-tight">Onboard new tenant</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-8">Step 5 of 6: Tenant admin user. Invite the first user from ABInBev who will manage their tenant in Kick.</p>
        <WizardProgress step={5} />
        <div className="bg-card border rounded-xl p-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Name"><input defaultValue="Mark Dunne" className={I} /></Field>
            <Field label="Email"><input defaultValue="mark.dunne@ab-inbev.com" className={I} /></Field>
            <Field label="Role">
              <select className={I}>
                <option>Tenant Admin</option><option>Brand Admin</option><option>Brand Ops</option><option>Field Manager</option>
              </select>
            </Field>
            <Field label="Brand scope" hint="Tenant Admin sees all brands">
              <select disabled className={I + " opacity-50"}><option>All brands</option></select>
            </Field>
          </div>
          <div className="mt-5">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-[oklch(0.62_0.17_145)]" />
              Send invite via email
            </label>
          </div>
          <div className="mt-5">
            <Field label="Welcome message">
              <textarea
                rows={4}
                defaultValue="Welcome to Kick. We're excited to have ABInBev on the platform. Click the link in this email to set your password and explore your tenant dashboard."
                className="w-full p-3 rounded-md border bg-background text-sm focus:ring-2 focus:ring-ring outline-none transition-all"
              />
            </Field>
          </div>
          <div className="mt-5">
            <span className="text-xs text-muted-foreground/60 cursor-not-allowed">+ Add another user · You can add more after activation</span>
          </div>
        </div>
        <NavButtons back="wiz-4" next="wiz-6" />
      </div>
    </AppShell>
  );
}

/* ------------------- STEP 6 ------------------- */
const checklist = [
  "Tenant record created", "Brand record created with branding", "8 modules enabled",
  "API key activated", "Mark Dunne invited (email queued)",
  "First voucher template provisioned", "Welcome dashboard ready",
];

function SummaryCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">{title}</div>
      <div className="text-sm">{body}</div>
    </div>
  );
}

export function Wiz6() {
  const { go } = useDemo();
  const [activating, setActivating] = React.useState(false);
  function activate() {
    setActivating(true);
    setTimeout(() => go("activated"), 1400);
  }
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <Crumbs step={6} />
        <h1 className="text-2xl font-bold tracking-tight">Onboard new tenant</h1>
        <p className="text-sm text-muted-foreground mt-1 mb-8">Step 6 of 6: Review & activate. Everything looks good? Activate ABInBev to make Kick live for them.</p>
        <WizardProgress step={6} />
        <div className="bg-card border rounded-xl p-6 space-y-3">
          <SummaryCard title="Tenant" body="AB InBev — slug: abinbev — primary contact: Mark Dunne — colour: navy" />
          <SummaryCard title="Brand" body="Budweiser — colour: navy — tagline: King of Beers — logo: ✓ uploaded" />
          <SummaryCard title="Modules" body="8 enabled (QR Redemption, Campaigns, POSM, POS Jobs, Field Evidence, Consumer Preview, Staff PWA, Alerts)" />
          <SummaryCard title="Integrations" body="API key generated, Slack webhook configured, settlement bank set" />
          <SummaryCard title="Admin user" body="Mark Dunne (Tenant Admin) — invitation will be sent" />

          <div className="mt-5 pt-5 border-t">
            <div className="text-sm font-semibold mb-3">When you activate:</div>
            <ul className="space-y-2">
              {checklist.map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm">
                  <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Check className="h-3 w-3" /></div>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-between mt-8 max-w-5xl">
          <button onClick={() => go("wiz-5")} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-md border bg-background text-sm font-medium hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button
            onClick={activate}
            disabled={activating}
            className="inline-flex items-center gap-1.5 h-12 px-7 rounded-md bg-primary text-primary-foreground text-base font-semibold hover:opacity-90 transition-all hover:-translate-y-0.5 disabled:opacity-70"
          >
            {activating ? (<><Loader2 className="h-4 w-4 animate-spin" /> Activating tenant…</>) : "Activate ABInBev →"}
          </button>
        </div>
      </div>
    </AppShell>
  );
}

/* ------------------- ACTIVATION SUCCESS ------------------- */
export function Activated() {
  const { go } = useDemo();
  const [switching, setSwitching] = React.useState(false);
  function continueAsMark() {
    setSwitching(true);
    setTimeout(() => go("tenant-dashboard"), 1100);
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-lg bg-card border rounded-2xl shadow-xl p-10 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-5 animate-in zoom-in duration-700">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">ABInBev is live on Kick.</h1>
        <p className="text-sm text-muted-foreground mt-2">Mark Dunne has been invited. Now let's set up Budweiser's first campaign.</p>
        <button
          onClick={continueAsMark}
          disabled={switching}
          className="mt-7 w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {switching ? (<><Loader2 className="h-4 w-4 animate-spin" /> Switching context…</>) : "Continue as Mark Dunne →"}
        </button>
        <p className="text-[11px] text-muted-foreground mt-4">You'll impersonate the tenant admin to walk through their first campaign.</p>
      </div>
    </div>
  );
}