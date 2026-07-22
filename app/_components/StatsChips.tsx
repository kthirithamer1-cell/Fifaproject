import { SectionTitle } from "./SectionTitle";

const CHIP_COLORS = [
  "border-pink-500/30 bg-pink-500/8 text-pink-400 hover:border-pink-500/50 hover:bg-pink-500/12",
  "border-purple-500/30 bg-purple-500/8 text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/12",
  "border-green-500/30 bg-green-500/8 text-green-400 hover:border-green-500/50 hover:bg-green-500/12",
  "border-red-500/30 bg-red-500/8 text-red-400 hover:border-red-500/50 hover:bg-red-500/12",
  "border-blue-500/30 bg-blue-500/8 text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/12",
  "border-orange-500/30 bg-orange-500/8 text-orange-400 hover:border-orange-500/50 hover:bg-orange-500/12",
  "border-cyan-500/30 bg-cyan-500/8 text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/12",
];

const TUNISIAN_STATS = [
  { code: "DHK", label: "Dhahka", meaning: "Humor", icon: "😂" },
  { code: "NKT", label: "Nokta", meaning: "Joke Quality", icon: "🎭" },
  { code: "KLM", label: "Klem", meaning: "Talking Skill", icon: "🗣️" },
  { code: "JAW", label: "Jaw", meaning: "Vibe Creator", icon: "😎" },
  { code: "DRM", label: "Drama", meaning: "Drama Queen", icon: "🎭" },
  { code: "HRB", label: "Hroub", meaning: "Responsibility Escapist", icon: "🏃" },
  { code: "DBR", label: "Debber Rassek", meaning: "Problem Solver", icon: "🛠️" },
  { code: "ZHR", label: "Zhar", meaning: "Luck Factor", icon: "🍀" },
  { code: "WST", label: "Wasta", meaning: "Connections", icon: "🤝" },
  { code: "TKK", label: "Tektek", meaning: "Quick Hustle", icon: "💰" },
  { code: "CRZ", label: "Corza", meaning: "Money Management", icon: "💳" },
  { code: "MRG", label: "Mriguel", meaning: "Cool Style", icon: "😎" },
  { code: "GZR", label: "Gzara", meaning: "Boldness", icon: "🔥" },
  { code: "RKD", label: "Rekd", meaning: "Sleeping Power", icon: "😴" },
  { code: "9HW", label: "9ahwa", meaning: "Coffee Addict", icon: "☕" },
  { code: "S7B", label: "S7ab", meaning: "Loyal Friend", icon: "🤜🤛" },
  { code: "MAM", label: "Weld Omo", meaning: "Mama's Boy", icon: "😂" },
  { code: "STP", label: "Stopet", meaning: "Louage Finder", icon: "🚐" },
  { code: "RCH", label: "Richness Appearance", meaning: "Looks Rich, Isn't", icon: "💸" },
  { code: "QRM", label: "Ghasret el Kleb", meaning: "Last-min Study", icon: "📚" },
  { code: "GLB", label: "Ghalba", meaning: "Survivor", icon: "💪" },
  { code: "KHB", label: "Khabtha", meaning: "Troublemaker", icon: "💥" },
];

export function StatsChips() {
  const row1 = TUNISIAN_STATS.slice(0, 11);
  const row2 = TUNISIAN_STATS.slice(11);

  return (
    <section className="bg-[#F5F5F5] py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle className="mb-8 sm:mb-10">
          TUNISIAN CARD STATS
        </SectionTitle>

        {/* Row 1: Moving Left */}
        <div className="relative w-full overflow-hidden py-2 select-none rounded-2xl">
          {/* Left and Right Fade Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#F5F5F5] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#F5F5F5] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-left flex gap-3">
            {[...row1, ...row1].map((stat, index) => (
              <div
                key={`${stat.code}-${index}`}
                className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-default flex-shrink-0 ${
                  CHIP_COLORS[index % CHIP_COLORS.length]
                }`}
              >
                <span className="text-lg leading-none">{stat.icon}</span>
                <div className="flex flex-col items-start leading-tight">
                  <div className="flex items-baseline gap-1">
                    <span className="font-extrabold tracking-wide text-gray-800 text-[13px]">{stat.code}</span>
                    <span className="text-[10px] font-medium text-gray-500 capitalize">{stat.label.toLowerCase()}</span>
                  </div>
                  <span className="text-[8px] font-bold opacity-60 uppercase tracking-widest mt-0.5">
                    {stat.meaning}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Moving Right */}
        <div className="relative w-full overflow-hidden py-2 mt-3 select-none rounded-2xl">
          {/* Left and Right Fade Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#F5F5F5] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#F5F5F5] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-right flex gap-3">
            {(() => {
              const row2WithButton = [
                ...row2,
                {
                  code: "+48",
                  label: "MORE STATS",
                  meaning: "TUNISIAN LEGENDS",
                  icon: "✨",
                },
              ];

              return [...row2WithButton, ...row2WithButton].map((stat, index) => {
                if (stat.code === "+48") {
                  return (
                    <div
                      key={`more-${index}`}
                      className="flex items-center gap-2.5 rounded-full border border-[#E5A500]/40 bg-[#E5A500]/10 px-5 py-2 text-sm font-extrabold text-[#C98600] transition-all duration-300 hover:scale-105 hover:shadow-[0_2px_12px_rgba(229,165,0,0.1)] cursor-default flex-shrink-0"
                    >
                      <span className="text-lg leading-none">{stat.icon}</span>
                      <div className="flex flex-col items-start leading-tight">
                        <span className="font-extrabold tracking-wide text-[#C98600] text-[13px]">{stat.code}</span>
                        <span className="text-[8px] font-bold text-[#B07D00]/80 uppercase tracking-widest mt-0.5">
                          {stat.label}
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`${stat.code}-${index}`}
                    className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-default flex-shrink-0 ${
                      CHIP_COLORS[index % CHIP_COLORS.length]
                    }`}
                  >
                    <span className="text-lg leading-none">{stat.icon}</span>
                    <div className="flex flex-col items-start leading-tight">
                      <div className="flex items-baseline gap-1">
                        <span className="font-extrabold tracking-wide text-gray-800 text-[13px]">{stat.code}</span>
                        <span className="text-[10px] font-medium text-gray-500 capitalize">{stat.label.toLowerCase()}</span>
                      </div>
                      <span className="text-[8px] font-bold opacity-60 uppercase tracking-widest mt-0.5">
                        {stat.meaning}
                      </span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}