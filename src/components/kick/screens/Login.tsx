import * as React from "react";
import { useDemo } from "@/lib/demo-state";
import { Loader2 } from "lucide-react";

export function Login() {
  const { go } = useDemo();
  const [email, setEmail] = React.useState("niall.merry@gmail.com");
  const [pw, setPw] = React.useState("supersecret123");
  const [loading, setLoading] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => go("ops-desk"), 900);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, oklch(0.97 0.01 145), oklch(0.98 0.005 265))" }}>
      <div className="w-full max-w-md bg-card border rounded-2xl shadow-xl p-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold tracking-tight">
            Kick<span className="text-primary">.</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Multi-tenant brand activation platform.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full h-10 px-3 rounded-md border bg-background text-sm focus:ring-2 focus:ring-ring outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="mt-1 w-full h-10 px-3 rounded-md border bg-background text-sm focus:ring-2 focus:ring-ring outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Authenticating…</>) : "Sign in"}
          </button>
        </form>
        <p className="text-[11px] text-center text-muted-foreground mt-6">Super-admin access · Kick Platform</p>
      </div>
    </div>
  );
}