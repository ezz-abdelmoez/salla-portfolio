"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Check, CircleCheck, Palette, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { DemoNotice } from "@/components/shared";

const customOptions = [
  "تصميم بأولوية للجوال",
  "واجهة عربية وإنجليزية",
  "صفحة حملة أو إطلاق منتج",
  "أقسام خاصة لنشاط المتجر",
  "فلاتر أو مواصفات منتجات",
  "الاستلهام من تصميم مرجعي",
] as const;

const contactSchema = z.object({
  requestType: z.enum(["custom-theme", "general"]),
  name: z.string().min(2, "اكتب اسمًا من حرفين على الأقل."),
  email: z.string().email("اكتب بريدًا إلكترونيًا صحيحًا."),
  storeName: z.string().max(80, "اختصر الاسم إلى 80 حرفًا.").optional(),
  category: z.string().optional(),
  style: z.string().optional(),
  referenceUrl: z.string().optional(),
  requestedOptions: z.array(z.string()).optional(),
  designBrief: z.string().optional(),
  message: z.string().optional(),
}).superRefine((values, context) => {
  if (values.requestType === "custom-theme" && (values.designBrief?.trim().length ?? 0) < 20) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["designBrief"], message: "صف فكرتك في 20 حرفًا على الأقل حتى نفهم اتجاه التصميم." });
  }
  if (values.requestType === "general" && (values.message?.trim().length ?? 0) < 10) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["message"], message: "اكتب رسالتك في 10 أحرف على الأقل." });
  }
});

type ContactValues = z.infer<typeof contactSchema>;

const defaultValues: ContactValues = {
  requestType: "custom-theme",
  name: "",
  email: "",
  storeName: "",
  category: "",
  style: "",
  referenceUrl: "",
  requestedOptions: [],
  designBrief: "",
  message: "",
};

export default function ContactPage() {
  const [previewSubmitted, setPreviewSubmitted] = useState(false);
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  });
  const requestType = useWatch({ control, name: "requestType" });

  function submit() {
    setPreviewSubmitted(true);
    toast.success("اكتملت معاينة الطلب", { description: "لم يُرسل الطلب؛ نموذج التواصل غير متصل بقناة إرسال فعلية." });
  }

  return (
    <div className="page-shell contact-page">
      <div className="contact-intro">
        <p className="eyebrow"><Sparkles size={14} /> تصميم على ذوقك</p>
        <h1>ثيمك يبدأ<br /><em>من فكرتك.</em></h1>
        <p>شاركنا شكل متجرك في بالك: المجال، الإحساس البصري، والأقسام التي تحتاجها. جهّزنا نموذجًا لطلب تصميم مخصص أو للاستفسار العام.</p>
        <div className="contact-aside"><span><CircleCheck size={17} /></span><p>هذه معاينة محلية فقط؛ لا تُرسل البيانات ولا تُحفظ.</p></div>
        <div className="custom-request-promise"><span><Palette size={17} /></span><div><strong>فكرتك، خياراتك</strong><p>أضف رابطًا مرجعيًا، اختر المزايا، واكتب أي تفاصيل أخرى تهمك.</p></div></div>
      </div>

      <form id="custom-theme-request" className="contact-form custom-request-form" onSubmit={handleSubmit(submit)} noValidate>
        <div className="contact-form-heading">
          <span className="custom-request-icon"><Palette size={18} /></span>
          <div><p className="eyebrow">تواصل مع نَسَق</p><h2>كيف نقدر نساعدك؟</h2></div>
        </div>

        <fieldset className="request-type-fieldset">
          <legend>اختر نوع الطلب</legend>
          <div className="request-type-options">
            <label className={`request-type-card ${requestType === "custom-theme" ? "is-selected" : ""}`}>
              <input type="radio" value="custom-theme" {...register("requestType")} />
              <span className="request-type-card-icon"><Sparkles size={17} /></span>
              <span><strong>طلب ثيم مخصص</strong><small>صمّم الواجهة حسب فكرتك واحتياج متجرك.</small></span>
              <Check className="request-type-check" size={16} />
            </label>
            <label className={`request-type-card ${requestType === "general" ? "is-selected" : ""}`}>
              <input type="radio" value="general" {...register("requestType")} />
              <span className="request-type-card-icon"><Send size={16} /></span>
              <span><strong>استفسار عام</strong><small>اكتب سؤالك أو ملاحظتك حول نَسَق.</small></span>
              <Check className="request-type-check" size={16} />
            </label>
          </div>
        </fieldset>

        <div className="request-fields-grid">
          <label>الاسم<input {...register("name")} placeholder="اكتب اسمك" autoComplete="name" />{errors.name && <span className="field-error">{errors.name.message}</span>}</label>
          <label>البريد الإلكتروني<input {...register("email")} type="email" placeholder="name@example.com" dir="ltr" autoComplete="email" />{errors.email && <span className="field-error">{errors.email.message}</span>}</label>
        </div>

        {requestType === "custom-theme" ? (
          <>
            <div className="request-fields-grid">
              <label>اسم المتجر أو العلامة <span className="optional-label">اختياري</span><input {...register("storeName")} placeholder="مثال: مساحة للعطور" /></label>
              <label>مجال المتجر
                <select {...register("category")}>
                  <option value="">اختر المجال</option>
                  <option value="fashion">الأزياء والعبايات</option>
                  <option value="beauty">الجمال والعناية</option>
                  <option value="home">المنزل والديكور</option>
                  <option value="food">الأطعمة والمشروبات</option>
                  <option value="electronics">الإلكترونيات</option>
                  <option value="gifts">الهدايا والزهور</option>
                  <option value="other">مجال آخر</option>
                </select>
              </label>
            </div>
            <label>الأسلوب الذي تفضله
              <select {...register("style")}>
                <option value="">خلّنا نقترح أسلوبًا مناسبًا</option>
                <option value="minimal">بسيط وهادئ</option>
                <option value="editorial">تحريري وقصصي</option>
                <option value="luxury">فاخر ومساحاته واسعة</option>
                <option value="bold">جريء ولافت</option>
                <option value="reference">مستوحى من مرجع أشاركه</option>
                <option value="other">أسلوب آخر (أوضحه أدناه)</option>
              </select>
            </label>
            <fieldset className="custom-options-fieldset">
              <legend>خيارات ومزايا إضافية</legend>
              <div className="custom-options-grid">
                {customOptions.map((option) => <label className="custom-option" key={option}><input type="checkbox" value={option} {...register("requestedOptions")} /><span>{option}</span></label>)}
              </div>
            </fieldset>
            <label>وصف التصميم أو الفكرة<textarea {...register("designBrief")} rows={5} placeholder="صف الألوان أو التخطيط أو الأقسام التي تتخيلها، وأي تفاصيل أخرى تهمك..." />{errors.designBrief && <span className="field-error">{errors.designBrief.message}</span>}</label>
            <label>رابط مرجعي للتصميم <span className="optional-label">اختياري</span><input {...register("referenceUrl")} type="url" dir="ltr" placeholder="https://example.com أو رابط لوحة تصميم" /></label>
          </>
        ) : (
          <label>رسالتك<textarea {...register("message")} rows={6} placeholder="اكتب سؤالك أو ملاحظتك هنا..." />{errors.message && <span className="field-error">{errors.message.message}</span>}</label>
        )}

        <button className="button button--primary button--large" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "لحظة..." : requestType === "custom-theme" ? "جرّب إرسال طلب التصميم" : "جرّب إرسال الاستفسار"}
          {isSubmitting ? <Send size={16} /> : <ArrowLeft size={16} />}
        </button>
        {previewSubmitted && <p className="form-success" role="status"><CircleCheck size={15} />تم تجهيز الطلب للمعاينة فقط. لم يتم إرسال بياناتك.</p>}
        <small>نموذج تجريبي محلي — لا توجد خدمة إرسال أو تخزين متصلة حاليًا.</small>
      </form>

      <DemoNotice>لا تكتب معلومات حساسة. لن يصلك رد من هذا النموذج حتى تُربط قناة تواصل فعلية.</DemoNotice>
    </div>
  );
}
