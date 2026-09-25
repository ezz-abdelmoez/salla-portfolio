import Link from "next/link";
import { ArrowUpLeft, ChevronDown } from "lucide-react";
import { DemoNotice } from "@/components/shared";
export const metadata = { title: "الأسئلة الشائعة" };

const questions = [
  ["هل نَسَق تابع لمنصة سلة؟", "لا، نَسَق متجر مستقل ولا يمثل منصة سلة أو يدّعي اعتمادًا رسميًا منها."],
  ["هل أقدر أشتري أو أنزل الثيمات الآن؟", "لا. هذه نسخة عرض تجريبية؛ السلة والطلب للتوضيح فقط، ولا يوجد تحصيل أو تفعيل أو تنزيل."],
  ["هل كل ثيم متوافق فعليًا مع سلة؟", "المعلومات المعروضة في هذه النسخة تجريبية. قبل أي استخدام حقيقي يجب مراجعة ملف الثيم ومصدره وشروطه والتأكد من توافقه."],
  ["هل التقييمات حقيقية؟", "لا، أي تقييم ظاهر هو بيانات توضيحية مولدة لأغراض تصميم الواجهة فقط."],
  ["هل يتم حفظ بياناتي؟", "السلة والمفضلة تحفظان محليًا على جهازك حتى تعمل التجربة. لا نطلب بيانات دفع أو معلومات شخصية عند إنشاء الطلب التجريبي."],
  ["كيف أختار ثيمًا لمتجري؟", "ابدأ من التصنيف، ثم شاهد المعاينة ومزايا التصميم والمتطلبات. لا تعتمد على الصورة وحدها عند شراء ثيم فعلي."],
] as const;

export default function FaqPage() {
  return (
    <div className="page-shell faq-page">
      <div className="page-heading-center"><p className="eyebrow">خلّينا نوضح</p><h1>الأسئلة الشائعة</h1><p>إجابات مختصرة عن نَسَق والنسخة التجريبية.</p></div>
      <div className="faq-list">{questions.map(([question, answer], index) => <details key={question} className="faq-item" open={index === 0}><summary><span><small>0{index + 1}</small>{question}</span><ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div>
      <div className="faq-contact"><p>ما لقيت الإجابة اللي تدورها؟</p><Link href="/contact" className="text-link">تواصل معنا <ArrowUpLeft size={14} /></Link></div>
      <DemoNotice>المعلومات المعروضة للتوضيح ولا تمثل سياسة بيع فعلية.</DemoNotice>
    </div>
  );
}
