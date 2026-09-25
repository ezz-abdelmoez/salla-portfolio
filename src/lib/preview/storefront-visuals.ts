import type { PreviewLanguage } from "./storefront-content";

export type StorefrontVisualKind = "lookbook" | "routine" | "specs" | "occasions" | "roast" | "scent";

type VisualCopy = {
  eyebrow: string;
  title: string;
  description: string;
  caption: string;
  labels: [string, string, string];
  note: string;
};

export type StorefrontVisual = {
  kind: StorefrontVisualKind;
  image: string;
  productImages: string[];
  alt: Record<PreviewLanguage, string>;
  copy: Record<PreviewLanguage, VisualCopy>;
};

export const storefrontVisuals: Record<string, StorefrontVisual> = {
  leen: {
    kind: "lookbook",
    image: "/themes/previews/leen-story.jpg",
    productImages: [
      "/themes/previews/leen-product.jpg",
      "/themes/previews/leen-story.jpg",
      "/themes/previews/leen-editorial.jpg",
    ],
    alt: {
      ar: "ثلاث عبايات بألوان داكنة ومحايدة في استوديو دافئ",
      en: "Three dark and neutral abayas in a warm editorial studio",
    },
    copy: {
      ar: {
        eyebrow: "دفتر لِين · تحرير أزياء",
        title: "مساحة للصورة، والخامة، والقصّة",
        description: "تخطيط تحريري لمتاجر الأزياء؛ استبدلي الصور والملاحظات بمحتوى متجرك الموثق.",
        caption: "مختارات الموسم · صور تجريبية",
        labels: ["القصّة", "الخامة", "التفاصيل"],
        note: "تُستبدل هذه الصور والنصوص بصور وبيانات المنتجات الفعلية.",
      },
      en: {
        eyebrow: "LEEN LOOKBOOK · FASHION EDIT",
        title: "Room for silhouette, fabric, and detail",
        description: "An editorial layout for fashion stores. Replace the sample imagery and notes with your verified store content.",
        caption: "Season edit · Sample imagery",
        labels: ["Silhouette", "Fabric", "Details"],
        note: "Replace these sample visuals and notes with real product photography and information.",
      },
    },
  },
  mada: {
    kind: "routine",
    image: "/themes/previews/mada-story.jpg",
    productImages: [
      "/themes/previews/mada-product.jpg",
      "/themes/previews/mada-story.jpg",
      "/themes/previews/mada-editorial.jpg",
    ],
    alt: {
      ar: "عبوات عناية بالبشرة بسيطة على سطح حجري أخضر فاتح",
      en: "Minimal skincare bottles on pale sage stone",
    },
    copy: {
      ar: {
        eyebrow: "روتين مَدى",
        title: "رتّبي المنتجات كخطوات واضحة",
        description: "مساحة عرض مرئية لمنتجات الروتين؛ أضيفي تعليمات مؤكدة من ملصق المنتج فقط.",
        caption: "مختبر العناية · صور تجريبية",
        labels: ["تنظيف", "ترطيب", "عناية يومية"],
        note: "ترتيب بصري فقط، وليس توصية طبية أو إرشادًا للاستخدام.",
      },
      en: {
        eyebrow: "MADA ROUTINE",
        title: "Show a routine as clear steps",
        description: "A visual space for care collections. Add usage guidance only from the verified product label.",
        caption: "Care edit · Sample imagery",
        labels: ["Cleanse", "Hydrate", "Daily care"],
        note: "This is a layout sample, not medical advice or verified usage guidance.",
      },
    },
  },
  wameed: {
    kind: "specs",
    image: "/themes/previews/wameed-story.jpg",
    productImages: [
      "/themes/previews/wameed-product.jpg",
      "/themes/previews/wameed-story.jpg",
      "/themes/previews/wameed-editorial.jpg",
    ],
    alt: {
      ar: "سماعات ومكبر صوت وساعة ذكية على منصات داكنة بإضاءة زرقاء",
      en: "Headphones, a speaker, and a smartwatch on dark blue-lit plinths",
    },
    copy: {
      ar: {
        eyebrow: "وَميض · تفاصيل تقنية",
        title: "المعلومة بجوار المنتج",
        description: "واجهة منظّمة لتفاصيل الأجهزة؛ لا تعرض مواصفة أو ضمانًا قبل التحقق من المصدر.",
        caption: "مجموعة التقنية · صور تجريبية",
        labels: ["التوافق", "الضمان", "المواصفات"],
        note: "هذه مساحات توضيحية، ويضيف التاجر البيانات الحقيقية لكل منتج.",
      },
      en: {
        eyebrow: "WAMEED · TECH DETAILS",
        title: "Put useful information beside the product",
        description: "A structured layout for devices. Verify every specification and warranty with its source before publishing.",
        caption: "Tech collection · Sample imagery",
        labels: ["Compatibility", "Warranty", "Specifications"],
        note: "Illustrative prompts only; merchants supply verified details for each product.",
      },
    },
  },
  ward: {
    kind: "occasions",
    image: "/themes/previews/ward-story.jpg",
    productImages: [
      "/themes/previews/ward-product.jpg",
      "/themes/previews/ward-story.jpg",
      "/themes/previews/ward-editorial.jpg",
    ],
    alt: {
      ar: "باقة ورود بلون وردي وعاجي بجوار صندوق هدية",
      en: "A blush and ivory bouquet beside a gift box",
    },
    copy: {
      ar: {
        eyebrow: "وَرد · دليل المناسبات",
        title: "اختاري الحكاية قبل الهدية",
        description: "بطاقات مرئية للمناسبات والرسائل؛ خصصيها لخيارات متجرك الفعلية.",
        caption: "لحظات تستحق الورد · صور تجريبية",
        labels: ["امتنان", "احتفال", "لمسة شخصية"],
        note: "خيارات العرض لا تعني توفر تغليف أو توصيل؛ يحددها المتجر الفعلي.",
      },
      en: {
        eyebrow: "WARD · OCCASION GUIDE",
        title: "Choose the moment before the gift",
        description: "Visual cards for occasions and notes. Adapt them to the options your store actually offers.",
        caption: "For thoughtful moments · Sample imagery",
        labels: ["Gratitude", "Celebration", "Personal touch"],
        note: "These sample cards do not imply wrapping or delivery; the real store defines its services.",
      },
    },
  },
  qahwa: {
    kind: "roast",
    image: "/themes/previews/qahwa-story.jpg",
    productImages: [
      "/themes/previews/qahwa-story.jpg",
      "/themes/previews/qahwa-editorial.jpg",
      "/themes/previews/qahwa-story.jpg",
    ],
    alt: {
      ar: "حبوب قهوة محمصة وأدوات تذوق على سطح خشبي دافئ",
      en: "Roasted coffee beans and tasting tools on warm wood",
    },
    copy: {
      ar: {
        eyebrow: "قهوة · خريطة النكهة",
        title: "اعرضي ملف المحصول بصريًا",
        description: "رسم توضيحي لمساحات المنشأ والتحميص والتحضير، من دون ادعاء ملف حقيقي لأي منتج.",
        caption: "من المحمصة · صور تجريبية",
        labels: ["التحميص", "الحموضة", "القوام"],
        note: "الأشرطة للعرض فقط؛ أدخلي بيانات موثقة لكل محصول قبل النشر.",
      },
      en: {
        eyebrow: "QAHWA · FLAVOUR MAP",
        title: "Visualise a coffee profile",
        description: "An illustrative origin, roast, and brew layout—no real product profile is implied.",
        caption: "From the roastery · Sample imagery",
        labels: ["Roast", "Acidity", "Body"],
        note: "The bars are decorative samples; enter verified details for each coffee before publishing.",
      },
    },
  },
  misk: {
    kind: "scent",
    image: "/themes/previews/misk-story.jpg",
    productImages: [
      "/themes/previews/misk-story.jpg",
      "/themes/previews/misk-editorial.jpg",
      "/themes/previews/misk-story.jpg",
    ],
    alt: {
      ar: "زجاجة عطر داكنة مع خشب العود وقماش بلون برقوقي",
      en: "A dark perfume bottle with oud wood and plum fabric",
    },
    copy: {
      ar: {
        eyebrow: "مِسك · طبقات العطر",
        title: "من النوتة الأولى إلى الأثر",
        description: "مخطط بصري لطبقات الرائحة؛ لا تضاف أسماء النوتات إلا من مصدر موثوق.",
        caption: "حكاية العطر · صور تجريبية",
        labels: ["النوتات العليا", "قلب العطر", "القاعدة"],
        note: "أضيفي وصف الرائحة والتركيز من بيانات العلامة أو المورد الموثقة.",
      },
      en: {
        eyebrow: "MISK · SCENT PYRAMID",
        title: "From the first note to the lasting trail",
        description: "A visual structure for fragrance notes. Add note names only from a verified source.",
        caption: "A fragrance story · Sample imagery",
        labels: ["Top notes", "Heart notes", "Base notes"],
        note: "Use only fragrance descriptions and concentration details verified by the brand or supplier.",
      },
    },
  },
};
