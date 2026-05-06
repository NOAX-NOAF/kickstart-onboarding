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

type Ctx = {
  screen: Screen;
  go: (s: Screen) => void;
  reset: () => void;
};

const DemoCtx = React.createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = React.useState<Screen>("login");
  const go = React.useCallback((s: Screen) => {
    setScreen(s);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const reset = React.useCallback(() => setScreen("login"), []);
  return <DemoCtx.Provider value={{ screen, go, reset }}>{children}</DemoCtx.Provider>;
}

export function useDemo() {
  const ctx = React.useContext(DemoCtx);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}