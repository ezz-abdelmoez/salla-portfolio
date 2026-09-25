import Link from "next/link";
import { ArrowLeft, Eye, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { DemoNotice } from "@/components/shared";
export const metadata = { title: "عن نَسَق", description: "تعرف على منصة نَسَق المستقلة لمعاينة الثيمات." };

const principles = [
  { icon: Eye, title: "الوضوح أولًا", text: "نوضح لك ما هو حقيقي وما هو مجرد معاينة، قبل ما تتخذ أي قرار." },
  { icon: Layers3, title: "اختيارات مرتبة", text: "نجمع أفكار واجهات في مكان واحد حتى يسهل عليك استكشافها ومقارنتها." },
  { icon: ShieldCheck, title: "بدون وعود مبالغ فيها", text: "لا نعدك بمبيعات مضمونة أو اعتماد رسمي؛ نعرض التصميم ومعلوماته فقط." },
];

export default function AboutPage() {
  return (
    <div className="page-shell about-page">
      <section className="about-hero"><span className="about-mark"><Sparkles size={20} /></span><p className="eyebrow">قصة نَسَق</p><h1>كل متجر له طابعه.<br /><em>وكل طابع يبدأ بواجهة.</em></h1><p>نَسَق مساحة مستقلة لاستكشاف ثيمات عربية لمتاجر التجارة الإلكترونية، مع معاينات تصميمية وتفاصيل تساعدك تختار بوعي.</p><Link className="button button--primary" href="/themes">استكشف المعاينات <ArrowLeft size={16} /></Link></section>
      <section className="about-principles">{principles.map(({ icon: Icon, title, text }, index) => <article className="about-principle" key={title}><span className="principle-index">0{index + 1}</span><Icon size={21} /><h2>{title}</h2><p>{text}</p></article>)}</section>
      <section className="about-independence"><div><span className="eyebrow">مهم تعرف</span><h2>نَسَق مستقل<br />عن منصة سلة.</h2></div><p>اسم «سلة» يُذكر لوصف المنصة التي تستهدفها بعض أفكار الثيمات فقط. نَسَق ليس تابعًا لسلة ولا ممثلًا لها، ولا يوفّر اعتمادًا رسميًا أو تكاملًا مباشرًا معها في هذه النسخة.</p></section>
      <DemoNotice>هذا الموقع نموذج واجهة ببيانات تجريبية. لا توجد مشتريات أو تنزيلات أو تفعيلات فعلية.</DemoNotice>
    </div>
  );
}
