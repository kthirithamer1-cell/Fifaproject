import { SectionTitle } from "./SectionTitle";
import { Check, X, Minus } from "lucide-react";

const features = [
  {
    label: "Card Dimensions",
    starter: "30 × 17 cm",
    premium: "45 × 30 cm",
    ultimate: "60 × 40 cm",
  },
  {
    label: "Material",
    starter: "PVC 0.8mm",
    premium: "PVC 0.8mm",
    ultimate: "PVC 0.8mm",
  },
  {
    label: "Custom Stats",
    starter: "6 stats",
    premium: "8 stats",
    ultimate: "10 stats",
  },
  {
    label: "Design Revisions",
    starter: "1 revision",
    premium: "3 revisions",
    ultimate: "Unlimited",
  },
  {
    label: "Display Stand",
    starter: false,
    premium: "Acrylic Stand",
    ultimate: "Metal Hanger",
  },
  {
    label: "Gift Box",
    starter: false,
    premium: "Standard Box",
    ultimate: "Premium Velvet Box",
  },
  {
    label: "Digital Copy (PDF)",
    starter: false,
    premium: true,
    ultimate: true,
  },
  {
    label: "Priority Processing",
    starter: false,
    premium: false,
    ultimate: true,
  },
  {
    label: "Express 24h Shipping",
    starter: false,
    premium: false,
    ultimate: true,
  },
];

function CellValue({ value }: { value: string | boolean }) {
  if (value === true)
    return <Check className="h-4 w-4 text-emerald-400 mx-auto" />;
  if (value === false)
    return <X className="h-4 w-4 text-neutral-600 mx-auto" />;
  return (
    <span className="text-xs font-semibold text-neutral-200">{value}</span>
  );
}

export function ComparisonGrid() {
  return (
    <section className="bg-[#0A0A0A] py-16 sm:py-20" id="compare">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionTitle className="mb-10 sm:mb-14">
          COMPARE PACKAGES
        </SectionTitle>

        <p className="text-sm text-neutral-400 max-w-xl mb-10 leading-relaxed">
          See exactly what is included in each tier. Every package delivers premium quality — the difference is in size, extras, and exclusivity.
        </p>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-hidden rounded-2xl border border-white/[0.06]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="bg-[#0D0D0D] px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest w-[35%]">
                  Feature
                </th>
                <th className="bg-[#0D0D0D] px-4 py-4 text-center text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Starter
                </th>
                <th className="bg-[#0D0D0D] px-4 py-4 text-center text-xs font-bold text-yellow-400 uppercase tracking-widest">
                  Premium
                </th>
                <th className="bg-[#0D0D0D] px-4 py-4 text-center text-xs font-bold text-yellow-300 uppercase tracking-widest">
                  Ultimate
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feat, i) => (
                <tr
                  key={feat.label}
                  className={`border-b border-white/[0.04] ${
                    i % 2 === 0 ? "bg-[#0D0D0D]" : "bg-[#0A0A0A]"
                  }`}
                >
                  <td className="px-6 py-3.5 text-xs font-semibold text-neutral-300">
                    {feat.label}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <CellValue value={feat.starter} />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <CellValue value={feat.premium} />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <CellValue value={feat.ultimate} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden flex flex-col gap-4">
          {(["starter", "premium", "ultimate"] as const).map((tier) => (
            <div
              key={tier}
              className={`rounded-2xl border p-5 ${
                tier === "ultimate"
                  ? "border-yellow-400/20 bg-[#0D0D0D]"
                  : "border-white/[0.06] bg-[#0D0D0D]"
              }`}
            >
              <div
                className={`text-sm font-black uppercase tracking-wider mb-4 ${
                  tier === "ultimate"
                    ? "text-yellow-300"
                    : tier === "premium"
                    ? "text-yellow-400"
                    : "text-neutral-300"
                }`}
              >
                {tier}
              </div>
              <div className="flex flex-col gap-2.5">
                {features.map((feat) => (
                  <div
                    key={feat.label}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-neutral-400">{feat.label}</span>
                    <CellValue value={feat[tier]} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
