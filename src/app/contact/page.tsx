"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, CircleCheck, Send } from "lucide-react";
import { toast } from "sonner";
import { DemoNotice } from "@/components/shared";

const contactSchema = z.object({
  name: z.string().min(2, "اكتب اسمًا من حرفين على الأقل."),
  email: z.string().email("اكتب بريدًا إلكترونيًا صحيحًا."),
  message: z.string().min(10, "اكتب رسالتك في 10 أحرف على الأقل."),
});
type ContactValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });
  async function submit(values: ContactValues) {
    // نموذج محلي للتجربة؛ لا يتم إرسال هذه البيانات أو تخزينها.
    await new Promise((resolve) => setTimeout(resolve, 250));
    console.info("Demo contact form submitted", { nameLength: values.name.length, hasEmail: Boolean(values.email) });
    toast.success("وصلتنا تجربة النموذج", { description: "للتوضيح فقط — ما تم إرسال أو حفظ بياناتك." });
    reset();
  }
  return (
    <div className="page-shell contact-page">
      <div className="contact-intro"><p className="eyebrow">نسمعك</p><h1>خلّنا نتكلم<br /><em>عن فكرتك.</em></h1><p>هذا نموذج تجربة بسيط لتوضيح شكل التواصل. لن تُرسل رسالتك أو تُحفظ بياناتك.</p><div className="contact-aside"><span><CircleCheck size={17} /></span><p>ما نطلب بيانات دفع، والنموذج لا يتصل بخدمة خارجية.</p></div></div>
      <form className="contact-form" onSubmit={handleSubmit(submit)} noValidate>
        <label>الاسم<input {...register("name")} placeholder="اكتب اسمك" autoComplete="name" />{errors.name && <span className="field-error">{errors.name.message}</span>}</label>
        <label>البريد الإلكتروني<input {...register("email")} type="email" placeholder="name@example.com" dir="ltr" autoComplete="email" />{errors.email && <span className="field-error">{errors.email.message}</span>}</label>
        <label>رسالتك<textarea {...register("message")} rows={5} placeholder="وش الفكرة اللي في بالك؟" />{errors.message && <span className="field-error">{errors.message.message}</span>}</label>
        <button className="button button--primary button--large" type="submit" disabled={isSubmitting}>{isSubmitting ? "لحظة..." : "جرّب إرسال النموذج"}{isSubmitting ? <Send size={16} /> : <ArrowLeft size={16} />}</button>
        {isSubmitSuccessful && <p className="form-success"><CircleCheck size={15} />تمت تجربة النموذج محليًا، ولم تُرسل بياناتك.</p>}
        <small>بياناتك لا تُرسل أو تُخزّن — هذا نموذج توضيحي.</small>
      </form>
      <DemoNotice>لا تكتب معلومات حساسة في هذا النموذج؛ هو للمعاينة فقط.</DemoNotice>
    </div>
  );
}
