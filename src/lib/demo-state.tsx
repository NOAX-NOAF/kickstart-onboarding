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
  | "final-dashboard";

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
  brandColor: "#003087",
  brandBg: "#E6F0FF",
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

type Ctx = {
  screen: Screen;
  go: (s: Screen) => void;
  reset: () => void;
  draft: TenantDraft;
  updateDraft: (patch: Partial<TenantDraft>) => void;
};

const DemoCtx = React.createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = React.useState<Screen>("login");
  const [draft, setDraft] = React.useState<TenantDraft>(defaultDraft);
  const updateDraft = React.useCallback(
    (patch: Partial<TenantDraft>) => setDraft((d) => ({ ...d, ...patch })),
    [],
  );
  const go = React.useCallback((s: Screen) => {
    setScreen(s);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const reset = React.useCallback(() => {
    setScreen("login");
    setDraft(defaultDraft);
  }, []);
  return (
    <DemoCtx.Provider value={{ screen, go, reset, draft, updateDraft }}>
      {children}
    </DemoCtx.Provider>
  );
}

export function useDemo() {
  const ctx = React.useContext(DemoCtx);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}