import { createFileRoute } from "@tanstack/react-router";
import { DemoProvider, useDemo } from "@/lib/demo-state";
import { Login } from "@/components/kick/screens/Login";
import { OpsDesk } from "@/components/kick/screens/OpsDesk";
import {
  Wiz1, Wiz2, Wiz3, Wiz4, Wiz5, Wiz6, Activated,
} from "@/components/kick/screens/Wizard";
import {
  TenantDashboard, Camp1, Camp2, Camp3, Camp4, CampLive,
  PosmBuilder, PosmStatus, FinalDashboard,
} from "@/components/kick/screens/Tenant";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kick — Multi-tenant brand activation platform" },
      { name: "description", content: "Interactive demo: onboard a Fortune-500 tenant from login to first campaign launch in under 15 minutes." },
    ],
  }),
  component: Index,
});

function ScreenRouter() {
  const { screen } = useDemo();
  switch (screen) {
    case "login": return <Login />;
    case "ops-desk": return <OpsDesk />;
    case "wiz-1": return <Wiz1 />;
    case "wiz-2": return <Wiz2 />;
    case "wiz-3": return <Wiz3 />;
    case "wiz-4": return <Wiz4 />;
    case "wiz-5": return <Wiz5 />;
    case "wiz-6": return <Wiz6 />;
    case "activated": return <Activated />;
    case "tenant-dashboard": return <TenantDashboard />;
    case "camp-1": return <Camp1 />;
    case "camp-2": return <Camp2 />;
    case "camp-3": return <Camp3 />;
    case "camp-4": return <Camp4 />;
    case "camp-live": return <CampLive />;
    case "posm-builder": return <PosmBuilder />;
    case "posm-status": return <PosmStatus />;
    case "final-dashboard": return <FinalDashboard />;
    default: return <Login />;
  }
}

function Index() {
  return (
    <DemoProvider>
      <ScreenRouter />
    </DemoProvider>
  );
}
