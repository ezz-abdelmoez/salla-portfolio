import type { PreviewLanguage } from "./storefront-content";

export type StorefrontPageId =
  | "home"
  | "collection"
  | "campaign"
  | "product"
  | "about"
  | "faq"
  | "contact"
  | "policies"
  | "cart"
  | "checkout"
  | "order";

type StorefrontPageCopy = {
  nav: Record<"home" | "collection" | "campaign" | "about" | "faq" | "contact" | "policies", string>;
  breadcrumbHome: string;
  collection: { eyebrow: string; title: string; description: string; all: string; resultCount: string };
  campaign: { eyebrow: string; title: string; description: string; button: string; sampleNote: string };
  product: { details: string; quantity: string; add: string; added: string; favorite: string; sampleNote: string; related: string; back: string };
  about: { eyebrow: string; detailsTitle: string; details: string; valuesTitle: string };
  faq: { eyebrow: string; title: string; description: string; items: { question: string; answer: string }[] };
  contact: {
    eyebrow: string; title: string; description: string; phone: string; email: string; hours: string;
    placeholder: string; formTitle: string; name: string; emailLabel: string; message: string; submit: string; sent: string;
  };
  policies: { eyebrow: string; title: string; description: string; items: { title: string; body: string }[] };
  cart: { eyebrow: string; title: string; description: string; emptyTitle: string; emptyDescription: string; continue: string; remove: string; count: string; note: string; summary: string };
  checkout: { eyebrow: string; title: string; description: string; name: string; email: string; phone: string; address: string; payment: string; submit: string; notice: string };
  order: { eyebrow: string; title: string; description: string; reference: string; continue: string };
};

export const storefrontPagesCopy: Record<PreviewLanguage, StorefrontPageCopy> = {
  ar: {
    nav: {
      home: "الرئيسية",
      collection: "المتجر",
      campaign: "الحملة",
      about: "من نحن",
      faq: "الأسئلة الشائعة",
      contact: "تواصل معنا",
      policies: "السياسات",
    },
    breadcrumbHome: "الرئيسية",
    collection: {
      eyebrow: "تصفّح المنتجات",
      title: "مجموعة المتجر",
      description: "محتوى وأسعار تجريبية لمعاينة شكل صفحات المتجر. استبدلها ببيانات متجرك الفعلية.",
      all: "الكل",
      resultCount: "منتجات تجريبية",
    },
    campaign: {
      eyebrow: "صفحة حملة تجريبية",
      title: "اختيارات تستحق الاكتشاف",
      description: "قالب محلي لعرض حملة ومنتجاتها. لا توجد خصومات أو عروض فعلية في هذه المحاكاة.",
      button: "استعرض المنتجات",
      sampleNote: "محتوى الحملة والمنتجات هنا تجريبي، ولا يغيّر أسعار المنتجات.",
    },
    product: {
      details: "تفاصيل المنتج",
      quantity: "الكمية",
      add: "أضف إلى السلة التجريبية",
      added: "أُضيف إلى السلة التجريبية",
      favorite: "أضف إلى المفضلة",
      sampleNote: "اسم المنتج ووصفه وسعره في هذه الصفحة بيانات تجريبية؛ لا يوجد مخزون أو طلب فعلي.",
      related: "قد يعجبك أيضًا",
      back: "العودة إلى المنتجات",
    },
    about: {
      eyebrow: "عن المتجر",
      detailsTitle: "مساحة لتعريف الزوار بمتجرك",
      details: "استخدم هذه الصفحة لعرض قصة المتجر ومعلوماته الفعلية. النص الحالي توضيحي فقط، ويمكن للتاجر استبداله بمحتوى معتمد.",
      valuesTitle: "تفاصيل يضيفها التاجر",
    },
    faq: {
      eyebrow: "مساعدة المتسوق",
      title: "الأسئلة الشائعة",
      description: "نماذج أسئلة لعرض صفحة FAQ؛ استبدل الإجابات بسياسات متجرك المعتمدة.",
      items: [
        { question: "هل بيانات المنتجات والأسعار حقيقية؟", answer: "لا، المعاينة تستخدم بيانات محلية تجريبية ولا تتصل بكتالوج متجر فعلي." },
        { question: "متى يصل الطلب؟", answer: "تُضاف تفاصيل الشحن والمدة المتوقعة من إعدادات المتجر وسياساته الفعلية." },
        { question: "ما سياسة الاستبدال والاسترجاع؟", answer: "يضيف التاجر هنا سياسته المعتمدة؛ لا توجد معالجة إرجاع فعلية في المعاينة." },
        { question: "هل يمكنني إتمام عملية شراء؟", answer: "يمكن تجربة السلة ومسار الطلب الوهمي فقط؛ لا يوجد دفع أو طلب حقيقي." },
      ],
    },
    contact: {
      eyebrow: "نحن هنا للمساعدة",
      title: "تواصل مع المتجر",
      description: "أضف بيانات الدعم وساعات العمل الفعلية قبل نشر المتجر.",
      phone: "الهاتف أو واتساب",
      email: "البريد الإلكتروني",
      hours: "ساعات العمل",
      placeholder: "تُضاف من بيانات المتجر",
      formTitle: "أرسل رسالة تجريبية",
      name: "الاسم",
      emailLabel: "البريد الإلكتروني",
      message: "رسالتك",
      submit: "إرسال تجريبي",
      sent: "تم عرض حالة الإرسال للتجربة فقط؛ لم تُرسل الرسالة أو تُخزّن.",
    },
    policies: {
      eyebrow: "معلومات المتجر",
      title: "السياسات والمعلومات",
      description: "صفحات توضيحية لمعاينة قوالب المحتوى؛ أدخل النصوص المعتمدة من متجرك.",
      items: [
        { title: "الشحن والتوصيل", body: "أضف مناطق الشحن والرسوم والمدد الفعلية من إعدادات متجرك." },
        { title: "الاستبدال والاسترجاع", body: "أضف الشروط المعتمدة والمواعيد والاستثناءات الخاصة بمتجرك." },
        { title: "الخصوصية", body: "أضف إشعار الخصوصية المعتمد الذي يشرح استخدام بيانات العملاء." },
        { title: "الشروط والأحكام", body: "أضف شروط البيع والاستخدام المعتمدة قبل إطلاق المتجر." },
      ],
    },
    cart: {
      eyebrow: "سلة محلية",
      title: "سلة التسوق",
      description: "كل العناصر والمبالغ في هذه الصفحة تجريبية ومحفوظة مؤقتًا داخل واجهة المعاينة.",
      emptyTitle: "سلتك فارغة",
      emptyDescription: "أضف منتجًا تجريبيًا من صفحة المتجر لمتابعة استعراض الواجهة.",
      continue: "متابعة التسوق",
      remove: "إزالة",
      count: "عناصر تجريبية",
      note: "لا تشمل المعاينة الشحن أو الضرائب أو التحقق من المخزون.",
      summary: "ملخص السلة",
    },
    checkout: {
      eyebrow: "إتمام تجريبي فقط",
      title: "بيانات الطلب",
      description: "هذه حقول شكلية لاستعراض الصفحة؛ لا تدخل بيانات شخصية حقيقية.",
      name: "اسم تجريبي",
      email: "example@email.test",
      phone: "رقم هاتف تجريبي",
      address: "عنوان توضيحي",
      payment: "لا توجد بوابة دفع أو عملية مالية في هذه المحاكاة.",
      submit: "إنشاء طلب تجريبي",
      notice: "لن تُرسل هذه البيانات إلى خادم أو تُحفظ.",
    },
    order: {
      eyebrow: "حالة محلية",
      title: "تم إنشاء الطلب التجريبي",
      description: "هذه شاشة شكر شكلية للمعاينة فقط. لم يتم إنشاء طلب في سلة أو إرسال بيانات.",
      reference: "رقم مرجعي تجريبي",
      continue: "العودة إلى المتجر",
    },
  },
  en: {
    nav: {
      home: "Home",
      collection: "Shop",
      campaign: "Campaign",
      about: "About",
      faq: "FAQ",
      contact: "Contact",
      policies: "Policies",
    },
    breadcrumbHome: "Home",
    collection: {
      eyebrow: "Browse products",
      title: "The collection",
      description: "Sample content and prices for the storefront preview. Replace them with your real store data.",
      all: "All",
      resultCount: "sample products",
    },
    campaign: {
      eyebrow: "Sample campaign page",
      title: "A selection worth discovering",
      description: "A local campaign-page layout for showcasing products. No discounts or real offers are applied in this simulation.",
      button: "Explore products",
      sampleNote: "Campaign copy and products are samples; product prices are unchanged.",
    },
    product: {
      details: "Product details",
      quantity: "Quantity",
      add: "Add to demo cart",
      added: "Added to demo cart",
      favorite: "Save to favorites",
      sampleNote: "Product name, copy, and price are sample data. There is no live inventory or order.",
      related: "You may also like",
      back: "Back to products",
    },
    about: {
      eyebrow: "About the store",
      detailsTitle: "A place to introduce your store",
      details: "Use this page for your actual store story and information. The current copy is illustrative and can be replaced with approved content.",
      valuesTitle: "Merchant-provided details",
    },
    faq: {
      eyebrow: "Shopper help",
      title: "Frequently asked questions",
      description: "Example questions for the FAQ layout. Replace answers with your store's approved policies.",
      items: [
        { question: "Are the products and prices real?", answer: "No. This preview uses local sample data and is not connected to a live store catalog." },
        { question: "When will my order arrive?", answer: "Add actual shipping areas and delivery estimates from your store settings and policies." },
        { question: "What is the return policy?", answer: "Add your approved store policy here; returns are not processed in this preview." },
        { question: "Can I complete a purchase?", answer: "You can try the local cart and demo order flow only. There is no payment or real order." },
      ],
    },
    contact: {
      eyebrow: "We're here to help",
      title: "Contact the store",
      description: "Add the store's real support details and working hours before publishing.",
      phone: "Phone or WhatsApp",
      email: "Email",
      hours: "Working hours",
      placeholder: "Add from store settings",
      formTitle: "Send a sample message",
      name: "Name",
      emailLabel: "Email address",
      message: "Your message",
      submit: "Demo submit",
      sent: "This is a visual confirmation only; the message was not sent or stored.",
    },
    policies: {
      eyebrow: "Store information",
      title: "Policies and information",
      description: "Example content-page layouts. Add your store's approved policy text here.",
      items: [
        { title: "Shipping and delivery", body: "Add the actual shipping areas, fees, and delivery times from your store settings." },
        { title: "Returns and exchanges", body: "Add your approved terms, timelines, and store-specific exceptions." },
        { title: "Privacy", body: "Add your approved privacy notice explaining how customer data is handled." },
        { title: "Terms and conditions", body: "Add the approved sales and usage terms before launching your store." },
      ],
    },
    cart: {
      eyebrow: "Local cart",
      title: "Shopping cart",
      description: "Items and totals on this page are samples and are held temporarily in the preview interface.",
      emptyTitle: "Your cart is empty",
      emptyDescription: "Add a sample product from the shop to continue exploring the storefront.",
      continue: "Continue shopping",
      remove: "Remove",
      count: "sample items",
      note: "Shipping, taxes, and inventory checks are not included in this preview.",
      summary: "Cart summary",
    },
    checkout: {
      eyebrow: "Demo only",
      title: "Order details",
      description: "These are visual sample fields only. Do not enter real personal information.",
      name: "Sample name",
      email: "example@email.test",
      phone: "Sample phone number",
      address: "Sample address",
      payment: "There is no payment gateway or financial transaction in this simulation.",
      submit: "Create demo order",
      notice: "This information will not be sent to a server or stored.",
    },
    order: {
      eyebrow: "Local status",
      title: "Demo order created",
      description: "This is a sample thank-you page for preview only. No Salla order was created and no data was sent.",
      reference: "Sample reference",
      continue: "Return to the store",
    },
  },
};
