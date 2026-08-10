import { Store, ShieldCheck, Sparkles, Globe } from "lucide-react";

// NOTE: unlike the "Free shipping / 30-day returns" claims in generic
// templates, these are honest for an affiliate model — Lomar doesn't
// ship or process returns, the retailer does. Swap this copy if the
// business model changes (e.g. once Lomar handles fulfillment directly).
const badges = [
  {
    icon: Store,
    title: "Sold by real stores",
    description: "IKEA, Otto, Desenio and more — you check out with them",
  },
  {
    icon: ShieldCheck,
    title: "Their shipping & returns",
    description: "Every purchase follows that retailer's own policy",
  },
  {
    icon: Sparkles,
    title: "AI-matched picks",
    description: "Every item here fits a real interior style",
  },
  {
    icon: Globe,
    title: "Germany + Central Asia",
    description: "Curated for both regions from day one",
  },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-6 rounded-3xl border border-[#33475A]/8 bg-white p-8 md:grid-cols-4">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div key={badge.title} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7EA6D8]/10 text-[#7EA6D8]">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#33475A]">
                {badge.title}
              </p>
              <p className="mt-0.5 text-xs text-[#8598A8]">
                {badge.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
