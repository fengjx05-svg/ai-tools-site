import { Metadata } from "next";
import Container from "@/components/layout/Container";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "联系我们",
  description: "有任何问题或建议？欢迎联系我们。",
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "首页", url: "/" }, { name: "联系", url: "/contact" }]} />
      <Container>
        <div className="py-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">联系我们</h1>
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>有任何关于 AI 工具的问题、建议或合作意向，欢迎联系我们。</p>
            <h2 className="text-xl font-semibold mt-6 mb-3">联系方式</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>邮箱：联系信息待添加</li>
              <li>我们会在 48 小时内回复</li>
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}
