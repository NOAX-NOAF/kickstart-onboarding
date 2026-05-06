const labels = ["Tenant", "Brand", "Modules", "Integrations", "Admin User", "Activate"];

export function WizardProgress({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 max-w-3xl">
        {labels.map((_, i) => (
          <div key={i} className="flex-1 flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i + 1 <= step ? "bg-primary scale-110" : "bg-muted-foreground/25"
              }`}
            />
            {i < labels.length - 1 && (
              <div className={`flex-1 h-px ${i + 1 < step ? "bg-primary" : "bg-muted-foreground/20"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 max-w-3xl mt-2 text-[11px] text-muted-foreground">
        {labels.map((l, i) => (
          <div key={l} className={`flex-1 ${i + 1 === step ? "font-semibold text-foreground" : ""}`}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}