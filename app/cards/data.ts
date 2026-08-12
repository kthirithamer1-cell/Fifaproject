export interface CardProduct {
  slug: string;
  name: string;
  arabicName: string;
  nickname: string;
  rating: number;
  type: string;
  position: string;
  color: string;
  image: string;
  stats: { [key: string]: number };
  statLabels: { [key: string]: { label: string; meaning: string; icon: string } };
  tagline: string;
  description: string;
  biography: string[];
  famousSketches?: string[];
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  price: number;
  features: string[];
  faq: { question: string; answer: string }[];
}

export const CARD_PRODUCTS: CardProduct[] = [
  {
    slug: "karim-gharbi",
    name: "KARIM GHARBI",
    arabicName: "كريم الغربي",
    nickname: "Double Face Comedy King",
    rating: 98,
    type: "COMEDY KING",
    position: "FWD",
    color: "#d4af37",
    image: "/images/karimgharbi.webp",
    stats: {
      DHK: 99,
      JAW: 98,
      NKT: 99,
      S7B: 95,
      "9HW": 94,
      DRM: 92,
    },
    statLabels: {
      DHK: { label: "ضحك", meaning: "قدرة خارقة على تفطيس الجمهور بالضحك من أول ثانية", icon: "😂" },
      JAW: { label: "جو", meaning: "يعمل أعتى جو في أي بلاصة يحضر فيها مسرح أو تلفزة", icon: "🔥" },
      NKT: { label: "نكتة", meaning: "سرعة بديهة واستحضار نكت حصرية مع ألمع الكوميديين", icon: "🎭" },
      S7B: { label: "صحبة", meaning: "عشرة عمر وروح الفكاهة مع بسام الحمراوي وثنائي لا يُقهر", icon: "🤝" },
      "9HW": { label: "قهوة", meaning: "تحليل تونسي صميم وقعدات قهوة شعبية تحوّلت لأسكتشات", icon: "☕" },
      DRM: { label: "دراما & دوبل فاس", meaning: "تقمص شخصيات أسطورية وإتقان مسرحي لا مثيل له", icon: "🎬" },
    },
    tagline: "كارت فيفا أسطورة الضحك والكوميديا التونسية — كارت مخصصة 100% مستوحاة من ألمع سكيتشات ومسرحيات كريم الغربي!",
    description: "كارت فيفا كريم الغربي (Karim Gharbi 98 FUT Card) هي النسخة الأسطورية المصممة خصيصاً لعشاق الكوميديا التونسية والمسرح. كارت مصنوعة من خامة PVC الصلبة الفاخرة بطباعة ليزرية HD مقاومة للماء والخدش، مع قاعدة خشبية فاخرة وعلبة هدايا أنيقة.",
    biography: [
      "كريم الغربي (Karim El Gharbi) هو واحد من أبرز وأشهر نجوم الكوميديا والمسرح في تونس المعاصرة. انطلق في مسيرته التلفزيونية والمسرحية ليصبح ملك الضحك بلا منازع على شاشات التلفزة التونسية من خلال برامج شهيرة مثل (Labes)، (Fekret Sami Fehri)، و(Double Face).",
      "شكّل كريم الغربي رفقة صديقه بسام الحمراوي (Bassem Hamraoui) أقوى ثنائي كوميدي تونسي عُرف بأسكتشات ساخرة عكست الواقع التونسي بأسلوب فكاهي ذكي ومحبوب لدى جميع الفئات العمرية في تونس والعالم العربي.",
      "تعتبر كارت Flawless التذكارية لكريم الغربي هدية استثنائية لكل معجب بأعماله ومسرحياته (Double Face, Big Bossa) ولكل من يبحث عن فكرة هدية أصلية وغير مألوفة في تونس.",
    ],
    famousSketches: [
      "مسرحية وسلسلة دوبل فاس (Double Face)",
      "ثنائيات وسكيتشات كريم الغربي وبسام الحمراوي (Bassem Hamraoui)",
      "عروض وستاند آب بيغ بوسا (Big Bossa)",
      "حضوره الاستعراضي في فكرة سامي الفهري ولاباس",
    ],
    seoTitle: "كارت كريم الغربي فيفا تونسية 98 — Flawless | Carte FIFA Karim Gharbi Double Face & Sketch",
    seoDescription: "اكتشف كارت فيفا كريم الغربي (Karim Gharbi 98 FUT Card) مع ستاتيكس الضحك والدوبل فاس! كارت PVC فاخرة مخصصة مع طباعة عالية الجودة وتوصيل لكل تونس.",
    keywords: [
      "karim gharbi",
      "karim el gharbi",
      "karim al gharbi",
      "sketch karim gharbi",
      "double face karim gharbi",
      "karim gharbi bassem hamraoui",
      "carte fifa karim gharbi",
      "كريم الغربي",
      "كارت كريم الغربي",
      "سكيتشات كريم الغربي",
      "كارت فيفا تونسية مخصصة",
      "cadeau original homme tunisie",
    ],
    price: 49,
    features: [
      "مطبوعة على خامة PVC الصلبة الفاخرة المقاومة للماء والخدش (30x45 سم أو 20x30 سم)",
      "ألوان HD ساطعة مع لمعة ذهبية فاخرة",
      "قاعدة خشبية مجانية مع كل طلب للعرض في المكتب أو الغرفة",
      "تغليف علبة هدايا أنيق جاهز للإهداء في أعياد الميلاد والمناسبات",
      "توصيل سريع لباب الدار في كامل تراب الجمهورية التونسية (24 - 48 ساعة)",
      "الدفع عند الاستلام مع ضمان الجودة 100%",
    ],
    faq: [
      {
        question: "هل يمكنني طلب كارت كريم الغربي كما هي أو تعديلها باسمي وصورتي؟",
        answer: "يمكنك طلب نسخة كارت كريم الغربي الجاهزة مباشرة، أو استخدام مولد الكروت (Generator) لتصميم كارت مطابقة لها تماماً بصورتك واسمك وستاتيكس تونسية مخصصة!",
      },
      {
        question: "قداش تاخو وقت التوصيل في تونس؟",
        answer: "التوصيل يوصلك في ظرف 2 إلى 4 أيام عمل لباب دارك في أي ولاية من الـ 24 ولاية تونسية مع الدفع عند الاستلام.",
      },
      {
        question: "شنوة خامة وجودة طباعة الكارت؟",
        answer: "الكارت مطبوعة على بلاستيك PVC صلب وعالي الكثافة مع طباعة ليزرية HD مقاومة للشمس والرطوبة، لتدوم كذكرى فاخرة لسنوات طويلة.",
      },
    ],
  },
  {
    slug: "youssef",
    name: "YOUSSEF",
    arabicName: "يوسف المايسترو",
    nickname: "The Magic Maestro",
    rating: 93,
    type: "LEGEND",
    position: "MID",
    color: "#e5b839",
    image: "/images/youssef.webp",
    stats: {
      DHK: 98,
      JAW: 99,
      S7B: 96,
      "9HW": 92,
      DBR: 90,
      HRB: 88,
    },
    statLabels: {
      DHK: { label: "ضحكة", meaning: "ضحكة مسموعة من آخر الشارع", icon: "😆" },
      JAW: { label: "جو", meaning: "صاحب أجواء لا تنتهي في كل سهرة", icon: "🎉" },
      S7B: { label: "صحبة", meaning: "راجل وصاحب صاحبه في أوقات الشدة", icon: "💪" },
      "9HW": { label: "قهوة", meaning: "حضور يومي مضمون في القهوة العريضة", icon: "☕" },
      DBR: { label: "تدبير", meaning: "يخرجك من أي مأزق بحل سحري", icon: "🧠" },
      HRB: { label: "هروب", meaning: "مهارة الهروب السريع عند دفع الفاتورة", icon: "🏃" },
    },
    tagline: "كارت يوسف الأسطورة — كارت فيفا مخصصة للشخص الذي يصنع أجواء الضحك والصحبة في كل لمّة!",
    description: "كارت فيفا يوسف المايسترو (Youssef 93 Legend FUT Card) تجسد روح الصحبة والجو التونسي الأصيل. فكرة هدية مميزة للأصدقاء وأعياد الميلاد بطباعة PVC فاخرة وتوصيل لكل تونس.",
    biography: [
      "صُممت هذه الكارت لتكريم كل شخص يحمل اسم يوسف ويكون هو شمعة الجلسة وصاحب الأفكار والضحكات التي لا تنتهي.",
      "تعتبر من أكثر التصاميم طلباً كهدية عيد ميلاد ومفاجأة شبابية بفضل ألوانها الذهبية وتناسق الستاتيكس التونسية المضحكة.",
    ],
    seoTitle: "كارت يوسف فيفا تونسية 93 — Flawless | Carte FIFA Personnalisée Youssef",
    seoDescription: "اطلب كارت فيفا يوسف المايسترو 93 مع ستاتيكس الجو والصحبة والضحك! طباعة PVC فاخرة وتوصيل في تونس.",
    keywords: [
      "carte fifa youssef",
      "كارت يوسف فيفا",
      "كروت فيفا تونسية مخصصة",
      "cadeau anniversaire homme tunisie",
      "carte fut personnalisee",
    ],
    price: 49,
    features: [
      "خامة PVC فاخرة تدوم طويلاً",
      "ألوان ذهبية مستوحاة من كروت الأساطير FUT",
      "قاعدة خشبية فاخرة وتغليف هدايا أنيق",
      "توصيل سريع لكامل ولايات تونس",
    ],
    faq: [
      {
        question: "هل يمكنني كتابة اسم صديقي بدل يوسف؟",
        answer: "نعم! يمكنك الدخول لمولد الكروت وتغيير الاسم، الصورة، والستاتيكس بالكامل بضغطة زر واحدة.",
      },
    ],
  },
  {
    slug: "kader",
    name: "KADER",
    arabicName: "عبد القادر البوس",
    nickname: "The Ultimate Boss",
    rating: 97,
    type: "BOSS",
    position: "CAP",
    color: "#d4af37",
    image: "/images/kader.webp",
    stats: {
      GZR: 97,
      MRG: 95,
      DHK: 96,
      TKK: 91,
      S7B: 95,
      "9HW": 93,
    },
    statLabels: {
      GZR: { label: "قزارة", meaning: "عزيمة ورجولية ومواقف حاسمة", icon: "🔥" },
      MRG: { label: "مروة", meaning: "كرم وشهامة تونسية في كل بلاصة", icon: "👑" },
      DHK: { label: "ضحك", meaning: "ضحكة القائد المهيبة", icon: "😎" },
      TKK: { label: "تكنيك", meaning: "تخطيط استراتيجي وإدارة للمواقف الصعبة", icon: "🎯" },
      S7B: { label: "صحبة", meaning: "عمود القروب وسند الأصحاب", icon: "🛡️" },
      "9HW": { label: "قهوة", meaning: "جلسات القرارات المصيرية في القهوة", icon: "☕" },
    },
    tagline: "كارت قادر البوس 97 — مخصصة للشخص القيادي وصاحب القرارات والوقفة الصحيحة!",
    description: "كارت فيفا عبد القادر (Kader 97 Boss FUT Card) بتصميم أسود وذهبي فاخر يعكس الفخامة والهيبة.",
    biography: [
      "رمز القيادة والوقفة الرجولية، صُممت كارت البوس لتكون التكريم الأمثل للأخ الأكبر، الصديق القائد، أو صاحب العمل والمسؤوليات.",
    ],
    seoTitle: "كارت قادر البوس فيفا 97 — Flawless | Carte FIFA Kader The Boss",
    seoDescription: "كارت فيفا قادر البوس 97 بتصميم ذهبي فاخر وستاتيكس القزارة والمروة. هدية رجالية فخمة في تونس.",
    keywords: [
      "carte fifa kader",
      "كارت فيفا قادر",
      "هدية عيد ميلاد للرجال تونس",
      "coffret cadeau homme tunisie",
    ],
    price: 49,
    features: [
      "تصميم فخم Black & Gold للأساطير",
      "طباعة PVC مقاومة ومتقنة 100%",
      "قاعدة خشبية وتغليف هدية راقي",
      "توصيل لكافة مناطق تونس",
    ],
    faq: [
      {
        question: "كيفاش نطلب الكارت هذي بصورتي؟",
        answer: "ادخل للـ Generator، حمّل صورتك واكتب لقب البوس وسيتم تجهيز الكارت وطباعتها بأعلى جودة.",
      },
    ],
  },
  {
    slug: "sousou",
    name: "SOUSOU",
    arabicName: "سوسو الملكة",
    nickname: "The Golden Queen",
    rating: 96,
    type: "QWEEN",
    position: "QWN",
    color: "#ffbf00",
    image: "/images/Sousou.webp",
    stats: {
      DHK: 99,
      JAW: 98,
      S7B: 97,
      RKD: 94,
      "9HW": 96,
      HRB: 91,
    },
    statLabels: {
      DHK: { label: "ضحك", meaning: "طاقة إيجابية وضحكة لا تفارق وجهها", icon: "✨" },
      JAW: { label: "جو", meaning: "تحوّل أي قعدة لعرس وبهجة", icon: "💃" },
      S7B: { label: "صحبة", meaning: "أعز أخت وأوفى صديقة للبنات", icon: "💖" },
      RKD: { label: "رقاد", meaning: "نوم هادئ ومقدّس لا يُمس", icon: "😴" },
      "9HW": { label: "شوبينغ & قهوة", meaning: "عشق القهوة والخرجات والأناقة", icon: "🛍️" },
      HRB: { label: "تكتكة", meaning: "ذكاء ودهاء نسائي لطيف", icon: "👑" },
    },
    tagline: "كارت سوسو الملكة 96 — أحلى هدية ومفاجأة للبنات، الصديقات، والزوجات في تونس!",
    description: "كارت فيفا سوسو (Sousou 96 Qween FUT Card) هي النسخة المخصصة للبنات بتصميم وردي وذهبي مميز يجمع بين الأناقة وخفة الدم.",
    biography: [
      "البنات أيضاً أساطير! صُممت كارت سوسو لتكون الهدية الأظرف والأكثر تميزاً في أعياد ميلاد البنات، عيد الحب، وحفلات التخرج.",
    ],
    seoTitle: "كارت سوسو فيفا كوين 96 — Flawless | Carte FIFA Personnalisée Femme Tunisie",
    seoDescription: "كارت فيفا سوسو الملكة 96 المخصصة للبنات! فكرة هدية عيد ميلاد استثنائية لصديقتك أو أختك في تونس.",
    keywords: [
      "carte fifa femme tunisie",
      "كارت فيفا للبنات",
      "cadeau anniversaire femme tunisie",
      "كروت فيفا تونسية",
    ],
    price: 49,
    features: [
      "ألوان زاهية وذهبية فاخرة",
      "طباعة PVC متينة تدوم لسنوات",
      "قاعدة خشبية فاخرة للعرض",
      "توصيل سريع لكافة أنحاء تونس",
    ],
    faq: [
      {
        question: "هل يمكن تغيير الألوان والستاتيكس لتناسب البنات؟",
        answer: "بالتأكيد! مولد الكروت يوفر خيارات وألوان وستاتيكس مخصصة بالكامل للبنات مثل الشوبينغ والأناقة والذكاء.",
      },
    ],
  },
  {
    slug: "dellai",
    name: "DELLAI",
    arabicName: "الدلاعي السد المنيع",
    nickname: "The Unbreakable Wall",
    rating: 96,
    type: "LEGEND",
    position: "DEF",
    color: "#2e8b57",
    image: "/images/delai.webp",
    stats: {
      DHK: 97,
      TKK: 15,
      RKD: 94,
      HRB: 92,
      "9HW": 89,
      S7B: 90,
    },
    statLabels: {
      DHK: { label: "ضحك", meaning: "تعليقات ساخرة وقصف جبهات مستمر", icon: "🎯" },
      TKK: { label: "فلوس", meaning: "ستاتيكس الفلوس طايحة ديما مطفر", icon: "💸" },
      RKD: { label: "رقاد", meaning: "بطل العالم في النوم لـ 14 ساعة متواصلة", icon: "🛌" },
      HRB: { label: "هروب", meaning: "يختفي أول ما تطلب منه خدمة شاقة", icon: "💨" },
      "9HW": { label: "قهوة", meaning: "مدمن كابوسان إكسترا صبّاحي ومسائي", icon: "☕" },
      S7B: { label: "صحبة", meaning: "رغم كل شيء يبقى حبيب القلب والصاحب الوفي", icon: "❤️" },
    },
    tagline: "كارت الدلاعي 96 — كارت الميمز التونسية الأصلية للأصدقاء اللي يعيشوا في عالم موازي!",
    description: "كارت فيفا الدلاعي (Dellai 96 Legend FUT Card) تمثل أشهر ميمز الشباب التونسي في السهرات والقهوة والنوم.",
    biography: [
      "لكل شلة صاحب 'دلاعي' يعشق النوم والقهوة ويكون مطفر لكنه أغلى صاحب وأكثرهم إضحاكاً.",
    ],
    seoTitle: "كارت الدلاعي فيفا 96 — Flawless | Carte FIFA Dellai Meme Legend",
    seoDescription: "كارت فيفا الدلاعي 96 مع ستاتيكس الرقاد والمطفر والقهوة! أحلى كارت ميمز تونسية للإهداء بين الأصحاب.",
    keywords: [
      "carte fifa dellai",
      "كارت الدلاعي فيفا",
      "ميمز كروت تونسية",
      "cadeau drole homme tunisie",
    ],
    price: 49,
    features: [
      "خامة PVC مقاومة للماء",
      "تصميم زمردي وأخضر مميز",
      "قاعدة خشبية فاخرة",
      "توصيل لباب الدار في كامل تونس",
    ],
    faq: [
      {
        question: "هل يمكنني صنع كارت لأصحابي بنفس الطريقة المضحكة؟",
        answer: "نعم! ادخل للمولد، اختر ستاتيكس النوم أو التطفير أو القهوة واصنع كارت تفطّس بالضحك لأصحابك.",
      },
    ],
  },
];

export function getCardBySlug(slug: string): CardProduct | undefined {
  return CARD_PRODUCTS.find((c) => c.slug === slug);
}

export function getAllCardSlugs(): string[] {
  return CARD_PRODUCTS.map((c) => c.slug);
}
