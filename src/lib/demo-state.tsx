import * as React from "react";

export type Screen =
  | "login"
  | "ops-desk"
  | "wiz-1" | "wiz-2" | "wiz-3" | "wiz-4" | "wiz-5" | "wiz-6"
  | "activated"
  | "tenant-dashboard"
  | "camp-1" | "camp-2" | "camp-3" | "camp-4"
  | "camp-live"
  | "posm-builder"
  | "posm-status"
  | "final-dashboard"
  | "campaigns-list"
  | "posm-list"
  | "field-evidence"
  | "invite-team"
  | "brands-list"
  | "rep-portal";

export type TenantDraft = {
  legalName: string;
  tradingName: string;
  slug: string;
  contactName: string;
  contactEmail: string;
  tenantColor: string;
  tenantBg: string;
  brandName: string;
  brandSlug: string;
  brandColor: string;
  brandBg: string;
  brandTagline: string;
  brandLogo: string | null; // data URL
  brandLogoName: string | null;
  modulesEnabled: number;
  apiKeyGenerated: boolean;
  slackConfigured: boolean;
  bankConfigured: boolean;
  venuesImported: number;
  adminName: string;
  adminEmail: string;
  adminRole: string;
};

const defaultDraft: TenantDraft = {
  legalName: "AB InBev Ireland Limited",
  tradingName: "AB InBev",
  slug: "abinbev",
  contactName: "Mark Dunne",
  contactEmail: "mark.dunne@ab-inbev.com",
  tenantColor: "#003087",
  tenantBg: "#E6F0FF",
  brandName: "Budweiser",
  brandSlug: "budweiser",
  brandColor: "#C8102E",
  brandBg: "#FCE8EC",
  brandTagline: "King of Beers",
  brandLogo: null,
  brandLogoName: null,
  modulesEnabled: 8,
  apiKeyGenerated: false,
  slackConfigured: false,
  bankConfigured: true,
  venuesImported: 0,
  adminName: "Mark Dunne",
  adminEmail: "mark.dunne@ab-inbev.com",
  adminRole: "Tenant Admin",
};

export type OnboardedTenant = {
  name: string;
  brands: string;
  modules: number;
  color: string;
  logo: string | null;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  color: string;
  bg: string;
  tagline: string;
  logo: string | null;
};

export type ActivityEvent = {
  id: string;
  t: string;
  color: "primary" | "amber" | "success";
  msg: string;
  highlight?: boolean;
};

function timestamp() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

const seedFeed: ActivityEvent[] = [
  { id: "s1", t: "06:07:04", color: "primary", msg: "Batchelors: UGC photo approved by Sarah Connolly" },
  { id: "s2", t: "06:07:00", color: "primary", msg: "Three: Voucher batch claimed at Vodafone Arena (44 QRs)" },
  { id: "s3", t: "06:06:56", color: "amber", msg: "Hunky Dorys: New campaign created by Aoife Byrne" },
  { id: "s4", t: "06:06:42", color: "primary", msg: "Odlums: 12 redemptions processed at Dunnes Stillorgan" },
  { id: "s5", t: "06:06:30", color: "primary", msg: "Platform: Master venue verified by field staff (Kehoe's Pub)" },
];

type Ctx = {
  screen: Screen;
  go: (s: Screen) => void;
  reset: () => void;
  draft: TenantDraft;
  updateDraft: (patch: Partial<TenantDraft>) => void;
  onboardedTenants: OnboardedTenant[];
  activateTenant: () => void;
  activity: ActivityEvent[];
  pushActivity: (e: Omit<ActivityEvent, "id" | "t"> & { t?: string }) => void;
  brands: Brand[];
  addBrand: (b: Omit<Brand, "id">) => void;
};

const DemoCtx = React.createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = React.useState<Screen>("login");
  const [draft, setDraft] = React.useState<TenantDraft>(defaultDraft);
  const [onboardedTenants, setOnboardedTenants] = React.useState<OnboardedTenant[]>([]);
  const [activity, setActivity] = React.useState<ActivityEvent[]>(seedFeed);
  const [brands, setBrands] = React.useState<Brand[]>([]);

  // Seed first brand from draft on first read
  const seededRef = React.useRef(false);
  React.useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    setBrands([
      {
        id: "b_seed",
        name: draft.brandName,
        slug: draft.brandSlug,
        color: draft.brandColor,
        bg: draft.brandBg,
        tagline: draft.brandTagline,
        logo: draft.brandLogo,
      },
    ]);
  }, [draft.brandName, draft.brandSlug, draft.brandColor, draft.brandBg, draft.brandTagline, draft.brandLogo]);

  const addBrand = React.useCallback((b: Omit<Brand, "id">) => {
    setBrands((list) => [...list, { ...b, id: `b_${Date.now()}` }]);
    setActivity((list) => {
      const ev: ActivityEvent = {
        id: `br_${Date.now()}`,
        t: timestamp(),
        color: "success",
        msg: `${b.name}: New brand added`,
        highlight: true,
      };
      return [ev, ...list].slice(0, 12);
    });
  }, []);
  const updateDraft = React.useCallback(
    (patch: Partial<TenantDraft>) => setDraft((d) => ({ ...d, ...patch })),
    [],
  );
  const go = React.useCallback((s: Screen) => {
    setScreen(s);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const pushActivity = React.useCallback(
    (e: Omit<ActivityEvent, "id" | "t"> & { t?: string }) => {
      setActivity((list) => [
        { id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, t: e.t ?? timestamp(), color: e.color, msg: e.msg, highlight: e.highlight },
        ...list,
      ].slice(0, 12));
    },
    [],
  );
  const activateTenant = React.useCallback(() => {
    setOnboardedTenants((list) => {
      // avoid duplicate by slug
      if (list.some((t) => t.name === draft.tradingName)) return list;
      return [
        {
          name: draft.tradingName,
          brands: `1 (${draft.brandName})`,
          modules: draft.modulesEnabled,
          color: draft.tenantColor,
          logo: draft.brandLogo,
        },
        ...list,
      ];
    });
    // Emit a sequence of activation events with staggered timestamps
    const t = timestamp();
    const events: ActivityEvent[] = [
      { id: `act_${Date.now()}_3`, t, color: "success", msg: `Platform: ${draft.tradingName} tenant activated — ${draft.modulesEnabled} modules live`, highlight: true },
      { id: `act_${Date.now()}_2`, t, color: "primary", msg: `${draft.brandName}: Brand provisioned with first voucher template` },
      { id: `act_${Date.now()}_1`, t, color: "amber", msg: `${draft.tradingName}: Admin invite sent to ${draft.adminName} (${draft.adminEmail})` },
    ];
    setActivity((list) => [...events, ...list].slice(0, 12));
  }, [draft]);
  const reset = React.useCallback(() => {
    setScreen("login");
    setDraft(defaultDraft);
    setOnboardedTenants([]);
    setActivity(seedFeed);
    setBrands([]);
    seededRef.current = false;
  }, []);
  return (
    <DemoCtx.Provider
      value={{ screen, go, reset, draft, updateDraft, onboardedTenants, activateTenant, activity, pushActivity, brands, addBrand }}
    >
      {children}
    </DemoCtx.Provider>
  );
}

export function useDemo() {
  const ctx = React.useContext(DemoCtx);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}