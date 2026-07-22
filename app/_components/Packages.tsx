import { SectionTitle } from "./SectionTitle";
import { Check, CreditCard, Gift, Sparkles, Ruler } from "lucide-react";

const PACKAGES_DATA = [
  {
    name: "STARTER",
    price: "39",
    size: "30x17 cm",
    features: [
      { text: "Dimensions: 30x17 cm", icon: Ruler },
      { text: "Premium PVC Card", icon: CreditCard },
      { text: "Standard Desk Stand Included", icon: Check },
    ],
  },
  {
    name: "PREMIUM",
    price: "59",
    size: "45x30 cm",
    badge: "MOST POPULAR",
    features: [
      { text: "Dimensions: 45x30 cm", icon: Ruler },
      { text: "Premium PVC Card", icon: CreditCard },
      { text: "Luxury Gift Box Included", icon: Gift },
      { text: "Glossy Protective Finish", icon: Sparkles },
    ],
  },
  {
    name: "ULTIMATE",
    price: "79",
    size: "60x40 cm",
    features: [
      { text: "Dimensions: 60x40 cm", icon: Ruler },
      { text: "Mega Premium PVC Card", icon: CreditCard },
      { text: "Luxury Gift Box Included", icon: Gift },
      { text: "Liquid Gold Finish", icon: Sparkles },
    ],
  },
];

export function Packages() {
  return (
    <section className="bg-white py-16 sm:py-20" id="order">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionTitle className="mb-10 sm:mb-14">
          CHOOSE YOUR PACKAGE
        </SectionTitle>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PACKAGES_DATA.map((pack) => {
            const isPremium = !!pack.badge;
            return (
              <div
                key={pack.name}
                className={`relative flex flex-col justify-between rounded-2xl border p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  isPremium
                    ? "border-[#E5A500] bg-white shadow-[0_10px_40px_rgba(229,165,0,0.12)] sm:-translate-y-3"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div>
                  {/* Badge */}
                  {pack.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#E5A500] px-4 py-1 text-[10px] font-black tracking-wide text-white uppercase shadow-sm">
                      {pack.badge}
                    </div>
                  )}

                  {/* Name */}
                  <div className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                    {pack.name}
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-start gap-1">
                    <span
                      className={`text-5xl sm:text-6xl font-black tracking-tight ${
                        isPremium ? "text-[#E5A500]" : "text-gray-900"
                      }`}
                    >
                      {pack.price}
                    </span>
                    <sup className="mt-2 text-sm font-bold text-[#E5A500]/80">
                      DT
                    </sup>
                  </div>

                  {/* Dimensions badge */}
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-gray-50 border border-gray-100 px-2.5 py-1 text-xs text-gray-600">
                    <Ruler className="h-3.5 w-3.5 text-[#E5A500]" />
                    <span className="font-semibold">{pack.size}</span>
                  </div>

                  {/* Features */}
                  <ul className="mt-6 flex flex-col gap-3">
                    {pack.features.map((feature, idx) => {
                      const Icon = feature.icon;
                      return (
                        <li
                          key={idx}
                          className="flex items-center gap-2.5 text-gray-600"
                        >
                          <Icon className="h-4 w-4 text-[#E5A500] flex-shrink-0" />
                          <span className="font-medium text-[13px]">{feature.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Choose Button */}
                <a
                  href="#order"
                  className={`mt-8 w-full py-2.5 rounded-xl text-center text-xs font-extrabold uppercase tracking-wider transition duration-300 cursor-pointer ${
                    isPremium
                      ? "bg-[#E5A500] text-white hover:bg-[#D49800] hover:shadow-[0_4px_16px_rgba(229,165,0,0.2)]"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-transparent"
                  }`}
                >
                  Choose {pack.name}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}