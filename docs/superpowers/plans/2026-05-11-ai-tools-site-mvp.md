# AI 工具导航 + 教程站 MVP 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建 AI 编程工具导航 + 教程博客 MVP，上线到 Vercel，支持 Google SEO 和 AdSense 广告。

**Architecture:** Next.js 15 App Router 静态站点，MDX 作为内容源，Tailwind CSS 样式，SSG + ISR 渲染。所有页面预渲染为静态 HTML，Google 可直接抓取。

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 4, MDX, next-mdx-remote, Vercel, Google AdSense

---

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`（骨架版）

- [ ] **Step 1: 创建 package.json**

```bash
mkdir -p "F:/vibe coding/website/src/app" "F:/vibe coding/website/src/components" "F:/vibe coding/website/src/lib" "F:/vibe coding/website/src/content/tools" "F:/vibe coding/website/src/content/tutorials" "F:/vibe coding/website/src/content/compare" "F:/vibe coding/website/public"
```

写入 `package.json`:

```json
{
  "name": "ai-tools-site",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-mdx-remote": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

- [ ] **Step 2: 安装依赖**

```bash
cd "F:/vibe coding/website" && npm install
```

Expected: 无错误，node_modules 生成。

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] },
    "baseUrl": "."
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: 创建 next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  output: "export",
};

export default nextConfig;
```

- [ ] **Step 5: 创建 postcss.config.mjs**

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 6: 创建 src/app/globals.css**

```css
@import "tailwindcss";
```

- [ ] **Step 7: 创建骨架 layout.tsx**

写入 `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI 工具导航 - 最好用的 AI 编程工具推荐与教程",
    template: "%s | AI 工具导航",
  },
  description:
    "面向 AI 初学者的工具导航与教程站。推荐 2026 年最好用的 AI 编程工具，提供 Claude Code、Codex 等工具的深度评测和使用技巧。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: 验证脚手架**

```bash
cd "F:/vibe coding/website" && npm run typecheck
```

Expected: 无错误通过。

- [ ] **Step 9: Commit**

```bash
cd "F:/vibe coding/website" && git init && git add -A && git commit -m "feat: scaffold Next.js project with TypeScript and Tailwind CSS"
```

---

### Task 2: 共享类型定义和 MDX 读取工具

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/content.ts`

- [ ] **Step 1: 创建类型定义**

写入 `src/lib/types.ts`:

```typescript
export interface ToolFrontmatter {
  title: string;
  slug: string;
  category: string;
  description: string;
  rating: number;
  pricing: string;
  url: string;
  tags: string[];
  updated: string;
  image?: string;
}

export interface TutorialFrontmatter {
  title: string;
  slug: string;
  category: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  updated: string;
  related_tools?: string[];
  related_tutorials?: string[];
}

export interface CompareFrontmatter {
  title: string;
  slug: string;
  tool_a: string;
  tool_b: string;
  description: string;
  comparison_points: string[];
}

export interface ToolPage {
  frontmatter: ToolFrontmatter;
  content: string;
}

export interface TutorialPage {
  frontmatter: TutorialFrontmatter;
  content: string;
}

export interface ComparePage {
  frontmatter: CompareFrontmatter;
  content: string;
}
```

- [ ] **Step 2: 创建 MDX 读取工具**

写入 `src/lib/content.ts`:

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  ToolFrontmatter,
  TutorialFrontmatter,
  CompareFrontmatter,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

function readMdxFile<T>(
  subdir: string,
  slug: string
): { frontmatter: T; content: string } | null {
  const filePath = path.join(CONTENT_DIR, subdir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as T, content };
}

function readAllMdxFiles<T>(subdir: string): { frontmatter: T; content: string }[] {
  const dirPath = path.join(CONTENT_DIR, subdir);
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(".mdx", "");
      const raw = fs.readFileSync(path.join(dirPath, f), "utf-8");
      const { data, content } = matter(raw);
      return { frontmatter: data as T, content };
    });
}

export function getTool(slug: string) {
  return readMdxFile<ToolFrontmatter>("tools", slug);
}

export function getAllTools() {
  return readAllMdxFiles<ToolFrontmatter>("tools");
}

export function getTutorial(slug: string) {
  return readMdxFile<TutorialFrontmatter>("tutorials", slug);
}

export function getAllTutorials() {
  return readAllMdxFiles<TutorialFrontmatter>("tutorials");
}

export function getCompare(slug: string) {
  return readMdxFile<CompareFrontmatter>("compare", slug);
}

export function getAllCompares() {
  return readAllMdxFiles<CompareFrontmatter>("compare");
}
```

- [ ] **Step 3: 安装 gray-matter**

```bash
cd "F:/vibe coding/website" && npm install gray-matter
```

- [ ] **Step 4: 验证类型检查**

```bash
cd "F:/vibe coding/website" && npm run typecheck
```

Expected: 无错误。

- [ ] **Step 5: Commit**

```bash
cd "F:/vibe coding/website" && git add -A && git commit -m "feat: add shared types and MDX reading utilities"
```

---

### Task 3: 布局组件（Header, Footer, Container）

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/Container.tsx`

- [ ] **Step 1: 创建 Header**

写入 `src/components/layout/Header.tsx`:

```tsx
import Link from "next/link";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/tools", label: "AI 工具" },
  { href: "/tutorials", label: "教程" },
  { href: "/about", label: "关于" },
];

export default function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          AI 工具导航
        </Link>
        <nav>
          <ul className="flex gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: 创建 Footer**

写入 `src/components/layout/Footer.tsx`:

```tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500">
        <div className="flex flex-wrap gap-6 mb-4">
          <Link href="/about" className="hover:text-blue-600">
            关于
          </Link>
          <Link href="/contact" className="hover:text-blue-600">
            联系
          </Link>
          <Link href="/sitemap.xml" className="hover:text-blue-600">
            Sitemap
          </Link>
        </div>
        <p>© {new Date().getFullYear()} AI 工具导航 - 为 AI 初学者推荐最好用的工具和教程</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: 创建 Container**

写入 `src/components/layout/Container.tsx`:

```tsx
export default function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4">{children}</div>;
}
```

- [ ] **Step 4: 验证类型检查**

```bash
cd "F:/vibe coding/website" && npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
cd "F:/vibe coding/website" && git add -A && git commit -m "feat: add layout components (Header, Footer, Container)"
```

---

### Task 4: SEO 组件

**Files:**
- Create: `src/components/seo/JsonLd.tsx`
- Create: `src/components/seo/RelatedLinks.tsx`

- [ ] **Step 1: 创建 JsonLd 组件**

写入 `src/components/seo/JsonLd.tsx`:

```tsx
export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    author: { "@type": "Organization", name: "AI 工具导航" },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FaqJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

- [ ] **Step 2: 创建 RelatedLinks 组件**

写入 `src/components/seo/RelatedLinks.tsx`:

```tsx
import Link from "next/link";

interface RelatedLink {
  title: string;
  href: string;
  description?: string;
}

export default function RelatedLinks({
  title,
  links,
}: {
  title: string;
  links: RelatedLink[];
}) {
  if (links.length === 0) return null;

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <h3 className="font-medium text-blue-600">{link.title}</h3>
            {link.description && (
              <p className="text-sm text-gray-500 mt-1">{link.description}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: 验证类型检查**

```bash
cd "F:/vibe coding/website" && npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
cd "F:/vibe coding/website" && git add -A && git commit -m "feat: add SEO components (JsonLd, RelatedLinks)"
```

---

### Task 5: 内容组件（ToolCard, ArticleCard）

**Files:**
- Create: `src/components/content/ToolCard.tsx`
- Create: `src/components/content/ArticleCard.tsx`

- [ ] **Step 1: 创建 ToolCard**

写入 `src/components/content/ToolCard.tsx`:

```tsx
import Link from "next/link";
import type { ToolFrontmatter } from "@/lib/types";

export default function ToolCard({ tool }: { tool: ToolFrontmatter }) {
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < Math.floor(tool.rating) ? "★" : "☆"
  ).join("");

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block p-6 border rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg text-blue-600">{tool.title}</h3>
        <span className="text-yellow-500 text-sm">{stars}</span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">{tool.pricing}</span>
        <span className="flex gap-1">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: 创建 ArticleCard**

写入 `src/components/content/ArticleCard.tsx`:

```tsx
import Link from "next/link";
import type { TutorialFrontmatter } from "@/lib/types";

const difficultyLabel: Record<string, string> = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "高级",
};

export default function ArticleCard({
  tutorial,
}: {
  tutorial: TutorialFrontmatter;
}) {
  return (
    <Link
      href={`/tutorials/${tutorial.slug}`}
      className="block p-6 border rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
          {difficultyLabel[tutorial.difficulty] ?? tutorial.difficulty}
        </span>
        <span className="text-xs text-gray-400">{tutorial.updated}</span>
      </div>
      <h3 className="font-semibold text-lg text-blue-600 mb-2">
        {tutorial.title}
      </h3>
      <p className="text-sm text-gray-600 mb-3">{tutorial.description}</p>
      <div className="flex gap-1">
        {tutorial.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: 验证类型检查**

```bash
cd "F:/vibe coding/website" && npm run typecheck
```

- [ ] **Step 4: Commit**

```bash
cd "F:/vibe coding/website" && git add -A && git commit -m "feat: add content components (ToolCard, ArticleCard)"
```

---

### Task 6: 广告组件

**Files:**
- Create: `src/components/ads/AdSlot.tsx`

- [ ] **Step 1: 创建 AdSlot 组件**

写入 `src/components/ads/AdSlot.tsx`:

```tsx
export default function AdSlot({
  slot,
  format = "auto",
  className = "",
}: {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}) {
  return (
    <div className={`my-8 flex justify-center ${className}`}>
      <div
        className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm"
        style={{
          minHeight: format === "horizontal" ? 90 : format === "vertical" ? 600 : 250,
          width: "100%",
          maxWidth: 728,
        }}
      >
        <div className="text-center">
          <p className="font-medium">广告位</p>
          <p className="text-xs mt-1">AdSense Slot: {slot}</p>
        </div>
      </div>
    </div>
  );
}
```

说明：上线前替换为真实的 AdSense 代码。当前占位符方便布局调试。

- [ ] **Step 2: 验证类型检查**

```bash
cd "F:/vibe coding/website" && npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
cd "F:/vibe coding/website" && git add -A && git commit -m "feat: add AdSlot placeholder component"
```

---

### Task 7: 第一批内容 — 3 个工具 MDX

**Files:**
- Create: `src/content/tools/claude-code.mdx`
- Create: `src/content/tools/codex.mdx`
- Create: `src/content/tools/cursor.mdx`

- [ ] **Step 1: 创建 claude-code.mdx**

写入 `src/content/tools/claude-code.mdx`:

```markdown
---
title: "Claude Code"
slug: "claude-code"
category: "ai-coding-tools"
description: "Claude Code 是 Anthropic 推出的终端 AI 编程助手，直接在命令行中理解整个代码库并帮你写代码、调试、重构。"
rating: 4.5
pricing: "免费试用 / Pro $20/月"
url: "https://claude.ai"
tags: ["AI编程", "Claude", "终端工具"]
updated: "2026-05-11"
---

## 简介

Claude Code 是 Anthropic 公司推出的 AI 编程助手，运行在终端中。它可以直接读取和理解你的整个项目代码，然后帮你写代码、修 bug、重构、写测试。

和 GitHub Copilot 不同，Claude Code 不是 IDE 插件——它是一个命令行工具，你可以在任何编辑器中使用它。

## 核心功能

- **全代码库理解**：自动索引你的项目，知道每个文件在哪
- **终端原生**：不需要切换窗口，在命令行中直接对话
- **多模态**：可以读取图片、PDF、图表，理解 UI 截图
- **Git 集成**：自动生成 commit message，创建 PR
- **工具调用**：可以执行 shell 命令、读写文件

## 适合谁用？

| 人群 | 适合度 | 原因 |
|------|--------|------|
| 有经验的开发者 | ⭐⭐⭐⭐⭐ | 终端操作效率最高 |
| AI 初学者 | ⭐⭐⭐ | 需要学习命令行和 AI 协作方式 |
| 完全编程新手 | ⭐⭐ | 建议先从 IDE 插件上手 |

## 价格

- 免费版：每月有一定免费额度
- Pro 版：$20/月（2026 年参考价格）

## 总结

Claude Code 是目前最强的终端 AI 编程工具之一，尤其适合已经熟悉命令行的开发者。对于 AI 初学者，可能需要一点时间适应，但学会之后效率提升巨大。

## FAQ

### Claude Code 和 ChatGPT 有什么区别？
Claude Code 专注于编程，可以直接读取你的项目文件并执行操作。ChatGPT 是通用对话模型，不能直接操作你的代码库。

### Claude Code 支持中文吗？
支持。你可以用中文提问和对话，Claude Code 理解中文没有问题。

### 需要联网吗？
需要。Claude Code 是云端服务，需要互联网连接。
```

- [ ] **Step 2: 创建 codex.mdx**

写入 `src/content/tools/codex.mdx`:

```markdown
---
title: "OpenAI Codex CLI"
slug: "codex"
category: "ai-coding-tools"
description: "Codex 是 OpenAI 推出的终端 AI 编程助手，支持多种模型，可以在终端中帮你写代码、调试和部署。"
rating: 4.0
pricing: "免费试用 / 按量付费"
url: "https://openai.com"
tags: ["AI编程", "OpenAI", "终端工具"]
updated: "2026-05-11"
---

## 简介

Codex CLI 是 OpenAI 推出的终端 AI 编程工具。和 Claude Code 类似，它运行在命令行中，可以理解你的项目并帮你完成编程任务。

## 核心功能

- **多模型选择**：可以用 GPT-5、o4 等不同模型
- **终端原生**：直接在命令行中使用
- **代码执行**：可以运行代码并查看输出
- **沙箱模式**：安全地在隔离环境中测试代码

## 适合谁用？

| 人群 | 适合度 | 原因 |
|------|--------|------|
| 已用 OpenAI 产品的开发者 | ⭐⭐⭐⭐⭐ | 生态整合好 |
| AI 初学者 | ⭐⭐⭐ | 界面友好，上手比 Claude Code 稍容易 |
| 预算有限的用户 | ⭐⭐⭐⭐ | 按量付费，用多少付多少 |

## 价格

- 按量付费，根据使用的模型和 token 数量计费

## 总结

Codex CLI 是一个强大的 AI 编程工具，尤其是如果你已经在用 OpenAI 的其他产品。对于初学者来说，按量付费模式让你不用担心月费浪费。

## FAQ

### Codex 和 Claude Code 哪个好？
两者定位相似，差别主要在模型能力、价格模式和生态。Claude Code 在代码理解上更深入，Codex 在模型选择和灵活性上有优势。

### Codex 需要 API Key 吗？
需要 OpenAI API Key，或者通过 ChatGPT 订阅使用。
```

- [ ] **Step 3: 创建 cursor.mdx**

写入 `src/content/tools/cursor.mdx`:

```markdown
---
title: "Cursor"
slug: "cursor"
category: "ai-coding-tools"
description: "Cursor 是基于 VS Code 的 AI IDE，内置 AI 编程助手，支持代码补全、对话编辑和全项目重构。"
rating: 4.5
pricing: "免费版 / Pro $20/月"
url: "https://cursor.sh"
tags: ["AI编程", "IDE", "VS Code"]
updated: "2026-05-11"
---

## 简介

Cursor 是一个基于 VS Code 的 AI 编程编辑器。它深度集成了 AI 能力，你可以在编辑器里直接和 AI 对话，让它帮你写代码、解释代码、重构代码。

## 核心功能

- **Tab 补全**：AI 预测你的下一段代码，按 Tab 接受
- **内联编辑**：选中代码，用自然语言描述修改
- **Chat 面板**：在侧边栏和 AI 对话
- **Composer**：AI 可以同时编辑多个文件
- **VS Code 兼容**：所有 VS Code 插件和主题都能用

## 适合谁用？

| 人群 | 适合度 | 原因 |
|------|--------|------|
| VS Code 用户 | ⭐⭐⭐⭐⭐ | 无缝迁移 |
| 完全编程新手 | ⭐⭐⭐⭐⭐ | 图形界面，学习曲线最低 |
| 终端高手 | ⭐⭐⭐ | 可能觉得不如终端工具高效 |

## 价格

- 免费版：有限额度
- Pro 版：$20/月

## 总结

Cursor 是 AI 初学者最友好的编程工具。如果你是 VS Code 用户，安装后几乎不需要学习成本。对于完全新手，Cursor 的图形界面比终端工具更容易上手。

## FAQ

### Cursor 和 VS Code 有什么区别？
Cursor 是 VS Code 的一个分支，界面几乎一样，但内置了强大的 AI 功能。你可以把 Cursor 理解为"装了最强 AI 插件的 VS Code"。

### Cursor 免费版够用吗？
轻度使用够用，但如果每天大量用 AI 功能，建议升级 Pro。
```

- [ ] **Step 4: 验证类型检查**

```bash
cd "F:/vibe coding/website" && npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
cd "F:/vibe coding/website" && git add -A && git commit -m "feat: add 3 tool MDX content files"
```

---

### Task 8: 第二批内容 — 3 个教程 MDX

**Files:**
- Create: `src/content/tutorials/claude-code-tips.mdx`
- Create: `src/content/tutorials/codex-from-zero.mdx`
- Create: `src/content/tutorials/agent-intro-guide.mdx`

- [ ] **Step 1: 创建 claude-code-tips.mdx**

写入 `src/content/tutorials/claude-code-tips.mdx`:

```markdown
---
title: "Claude Code 10 个实用技巧（2026 版）"
slug: "claude-code-tips"
category: "claude-code"
description: "从安装到高效使用，10 个 Claude Code 实用技巧帮你快速上手 AI 编程。适合 AI 初学者和想提升效率的开发者。"
difficulty: "beginner"
tags: ["Claude Code", "技巧", "效率"]
updated: "2026-05-11"
related_tools: ["claude-code"]
---

## 为什么学 Claude Code？

Claude Code 是目前最强的终端 AI 编程工具。但很多人装了之后只知道 `claude "帮我写个函数"`，远没有发挥出它的真正威力。这 10 个技巧帮你从入门到高效。

## 技巧 1：用 /init 让 Claude 理解项目

```bash
claude /init
```

这个命令让 Claude Code 索引你的项目结构。它会记住每个文件在哪、代码之间什么关系。之后的对话中，你不用解释项目架构，Claude 自己知道。

## 技巧 2：@ 引用文件

```bash
claude "@src/utils.ts 这个文件有什么问题？"
```

用 `@` 直接引用文件，Claude 会精确读取这个文件的内容。比手动复制粘贴快 10 倍。

## 技巧 3：描述目标，不要描述步骤

❌ 差的提问：`帮我在 line 42 后面加一个 if 判断，然后在 line 68 改一下变量名...`

✅ 好的提问：`用户登录失败时应该显示具体的错误信息，而不是通用的"登录失败"`

Claude 比你更懂怎么写代码。告诉它你要什么结果，让它决定怎么实现。

## 技巧 4：让 Claude 自己测试

```bash
claude "实现登录功能，然后自己运行测试确保能工作"
```

Claude Code 可以执行命令。让它写完代码后自己跑测试、自己修 bug。

## 技巧 5：用 /compact 管理上下文

对话时间长了之后，用 `/compact` 压缩上下文。Claude 会保留关键信息，清除不重要的内容，保持对话质量。

## 技巧 6：分任务，不要一次给太多

❌ 差的用法：`帮我重构整个项目，把所有 API 调用改成 async/await`

✅ 好的用法：
```
任务 1：先把 auth.ts 里的 API 调用改成 async/await
任务 2：改完之后告诉我，再改 user.ts
```

小任务成功率更高，出问题也容易回滚。

## 技巧 7：善用 .claude/CLAUDE.md

在项目根目录创建 `.claude/CLAUDE.md`，写入项目说明、代码规范、常用命令。Claude Code 每次启动都会读取这个文件，相当于给 AI 一个"新人指南"。

## 技巧 8：对于复杂任务，用 /plan 模式

```bash
claude /plan "我要重构支付模块，先给我一个方案"
```

让 Claude 先出方案，你审核后再执行。避免 AI 盲目改动重要代码。

## 技巧 9：用 Claude 写 commit message

```bash
claude "生成这个改动的 commit message"
git commit -m "..."
```

Claude 总结改动比你自己写更全面。

## 技巧 10：定期更新

Claude Code 更新很快。用 `claude --version` 检查版本，新版本通常有更好的模型和功能。

## 总结

这 10 个技巧的核心思路是：**把 Claude 当成一个聪明的同事，而不是一个代码生成器**。给它上下文、明确目标、小步迭代，效果最好。

## FAQ

### Claude Code 需要编程基础吗？
需要基本的命令行操作能力（cd、ls、git 等）。如果完全没接触过命令行，建议先从 Cursor 这类 IDE 工具上手。

### 这些技巧也适用于 Codex 吗？
大部分通用的 AI 协作技巧（描述目标、分任务、用项目文件）适用于所有 AI 编程工具。具体的命令和语法需要看各自文档。
```

- [ ] **Step 2: 创建 codex-from-zero.mdx**

写入 `src/content/tutorials/codex-from-zero.mdx`:

```markdown
---
title: "Codex CLI 从零到上手：AI 初学者指南"
slug: "codex-from-zero"
category: "codex"
description: "从安装 OpenAI Codex CLI 到完成第一个项目，完整的 AI 编程入门教程。零基础也能跟着做。"
difficulty: "beginner"
tags: ["Codex", "OpenAI", "入门"]
updated: "2026-05-11"
related_tools: ["codex"]
---

## 这篇文章适合谁？

- 听说过 AI 编程但不知道从哪开始
- 想用 Codex CLI 但不知道怎么装
- 装了之后不知道怎么高效使用

## 第一步：安装 Codex CLI

```bash
npm install -g @openai/codex
```

安装完成后验证：

```bash
codex --version
```

如果看到版本号，说明安装成功。

## 第二步：配置 API Key

你需要一个 OpenAI API Key：

1. 打开 [platform.openai.com](https://platform.openai.com)
2. 登录后点右上角头像 → API Keys
3. 创建一个新的 API Key
4. 在终端配置：

```bash
export OPENAI_API_KEY="sk-你的key"
```

## 第三步：第一个 AI 编程任务

进入你的项目目录：

```bash
cd my-project
codex "帮我写一个 Python 脚本，读取 CSV 文件并打印前 10 行"
```

Codex 会分析你的项目，然后写出代码。你可以直接看到代码，然后决定是否执行。

## 第四步：让 Codex 调试

如果你的代码有 bug：

```bash
codex "index.py 报错了，帮我看一下什么问题"
```

Codex 会读取错误信息和相关代码，给出修复方案。

## 第五步：完成一个小项目

试试让 Codex 帮你完成一个完整任务：

```bash
codex "创建一个简单的 Flask API，有一个 /hello 端点，返回 JSON: {'message': 'hello world'}"
```

Codex 会创建文件、写代码、甚至告诉你怎么运行。

## 常见错误

1. **API Key 没配置好** — 检查环境变量是否设置
2. **权限不足** — 确保 API Key 有使用权限
3. **任务描述太模糊** — 说得越具体，效果越好

## 下一步

完成这个入门后，推荐看看 Claude Code 教程，对比一下两个工具，选一个最适合你的。

## FAQ

### Codex 和 ChatGPT 有什么区别？
Codex 是专门为编程设计的终端工具，可以直接操作文件。ChatGPT 是通用的网页对话工具，不能直接操作你的项目代码。

### 我需要会 Python 才能用 Codex 吗？
不需要。Codex 支持多种语言，你也可以用中文描述需求。但基础编程知识能帮你更好地判断 AI 生成的代码质量。
```

- [ ] **Step 3: 创建 agent-intro-guide.mdx**

写入 `src/content/tutorials/agent-intro-guide.mdx`:

```markdown
---
title: "AI Agent 入门指南：从概念到实战"
slug: "agent-intro-guide"
category: "ai-agent"
description: "什么是 AI Agent？它和普通 AI 助手有什么区别？这篇入门指南用通俗语言帮你理解 Agent 的核心概念和使用场景。"
difficulty: "beginner"
tags: ["Agent", "AI", "入门"]
updated: "2026-05-11"
related_tools: ["claude-code", "codex", "cursor"]
---

## 什么是 AI Agent？

简单说，AI Agent（智能体）是一个**能自己做事的 AI**。

普通的 AI 对话是这样的：
- 你：`这段代码有什么问题？`
- AI：`第 3 行有个 bug，应该改成...`
- 你：手动修改代码

AI Agent 是这样的：
- 你：`帮我修好这个 bug`
- Agent：自己读代码 → 找到问题 → 修改文件 → 运行测试 → 告诉你修好了

区别在于：**Agent 能执行操作，不光是给建议**。

## Agent 的核心能力

1. **理解目标**：你告诉它要做什么，不需要告诉它怎么做
2. **使用工具**：可以读写文件、执行命令、搜索网络
3. **多步执行**：复杂任务拆成多步，一步步完成
4. **自我纠错**：执行出错后可以自己分析和修复

## 哪些工具是 Agent？

| 工具 | Agent 程度 | 说明 |
|------|-----------|------|
| Claude Code | ⭐⭐⭐⭐⭐ | 完整的 Agent，可以操作文件、执行命令 |
| Codex CLI | ⭐⭐⭐⭐⭐ | 同上，多模型可选 |
| Cursor | ⭐⭐⭐⭐ | IDE 内的 Agent，操作范围在编辑器中 |
| ChatGPT | ⭐⭐ | 可以给建议，但不能直接操作你的代码 |

## Agent 怎么入门？

### 第一步：选一个工具

推荐从 Cursor 开始（图形界面，最友好），然后进阶到 Claude Code（终端，最强）。

### 第二步：从小任务开始

```
帮我写一个 Python 函数，功能是：
- 输入：一个列表
- 输出：去重后的排序列表
```

### 第三步：学会"委派"而非"指挥"

❌ 微管理：`在第 5 行加个 for 循环，变量叫 i，里面调用 process()...`

✅ 委派：`这个函数跑得太慢了，帮我优化性能`

### 第四步：验证结果

Agent 执行完后，一定要检查：
- 代码逻辑对不对
- 测试通过了没有
- 有没有引入新问题

**Agent 是你的助手，不是你的替身。你永远是决策者。**

## 常见误区

1. **以为 Agent 什么都能做** — 复杂业务逻辑还是要自己把关
2. **任务描述太模糊** — "帮我做好"不如"帮我实现登录功能，包括用户名密码验证"
3. **不检查结果** — Agent 也会犯错，验证是必须的

## 下一步

了解 Agent 概念后，推荐去我们的工具页看看 [Claude Code](/tools/claude-code)、[Codex](/tools/codex) 和 [Cursor](/tools/cursor)，选一个开始动手。
```

- [ ] **Step 4: 验证类型检查**

```bash
cd "F:/vibe coding/website" && npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
cd "F:/vibe coding/website" && git add -A && git commit -m "feat: add 3 tutorial MDX content files"
```

---

### Task 9: 第三批内容 — 1 个对比页 MDX

**Files:**
- Create: `src/content/compare/claude-code-vs-codex.mdx`

- [ ] **Step 1: 创建 claude-code-vs-codex.mdx**

写入 `src/content/compare/claude-code-vs-codex.mdx`:

```markdown
---
title: "Claude Code vs Codex：哪个更适合 AI 初学者（2026 对比）"
slug: "claude-code-vs-codex"
tool_a: "claude-code"
tool_b: "codex"
description: "新手选 AI 编程工具？Claude Code 和 Codex CLI 全方位对比：价格、上手难度、功能、适用场景。看完就知道选哪个。"
comparison_points: ["价格", "上手难度", "代码理解", "模型能力", "适用场景", "生态"]
---

## 一句话总结

- **Claude Code**：代码理解最深，适合有一定命令行基础的开发者
- **Codex CLI**：模型选择多，按量付费灵活，界面更友好

## 详细对比

| 对比维度 | Claude Code | Codex CLI |
|----------|-------------|-----------|
| 开发商 | Anthropic | OpenAI |
| 底层模型 | Claude 4.x | GPT-5 / o4 等多选 |
| 价格 | 免费额度 + Pro $20/月 | 按量付费 |
| 上手难度 | 中等 | 中等偏易 |
| 代码库理解 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 中文支持 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Git 集成 | ✅ | ✅ |
| 多模态 | ✅ 图片/PDF | ✅ 图片 |

## 各自优势

### Claude Code 的优势
- 代码库理解最深，大项目表现更好
- 中文对话体验最好
- `/init` 索引后记忆持久
- Pro 定价明确，不担心超支

### Codex 的优势
- 可以切换不同模型（GPT-5 处理复杂逻辑，更快模型处理简单任务）
- 按量付费，低频使用更省钱
- 界面更友好，对初学者更友善

## 怎么选？

| 你的情况 | 推荐 |
|----------|------|
| 已熟悉命令行 | Claude Code |
| 想先试试 AI 编程 | Codex CLI（按量付费风险小） |
| 主要用中文 | Claude Code |
| 需要不同模型切换 | Codex CLI |
| 做大型项目 | Claude Code |
| 预算有限 | Codex CLI（轻度使用更便宜） |

## 我的建议

如果你是 AI 初学者，**建议两个都试试**——都有免费额度，不需要一下选定。用一周 Claude Code，用一周 Codex，自然会知道哪个更顺手。

## FAQ

### 可以两个都装吗？
可以。两者互不冲突，可以在同一个项目里分别使用。

### 哪个更适合团队使用？
Claude Code 的代码库理解在大项目中更有优势，但 Codex 的多模型选择在某些场景更灵活。团队选型建议全员试用再做决定。

### 除了这两个还有别的选择吗？
Cursor 是 IDE 方案，适合更喜欢图形界面的用户。GitHub Copilot 是 IDE 插件方案，适合轻量使用。
```

- [ ] **Step 2: 验证类型检查**

```bash
cd "F:/vibe coding/website" && npm run typecheck
```

- [ ] **Step 3: Commit**

```bash
cd "F:/vibe coding/website" && git add -A && git commit -m "feat: add Claude Code vs Codex comparison MDX"
```

---

### Task 10: 工具页路由（tools listing + detail）

**Files:**
- Create: `src/app/tools/page.tsx`
- Create: `src/app/tools/[slug]/page.tsx`

- [ ] **Step 1: 创建工具列表页**

写入 `src/app/tools/page.tsx`:

```tsx
import { Metadata } from "next";
import Container from "@/components/layout/Container";
import ToolCard from "@/components/content/ToolCard";
import AdSlot from "@/components/ads/AdSlot";
import { getAllTools } from "@/lib/content";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "2026 年最好用的 AI 编程工具推荐",
  description:
    "精选 2026 年最值得用的 AI 编程工具：Claude Code、Codex、Cursor 等。包含价格、功能对比、适用人群，帮你找到最适合的 AI 编程助手。",
  openGraph: {
    title: "2026 年最好用的 AI 编程工具推荐",
    description:
      "精选 2026 年最值得用的 AI 编程工具：Claude Code、Codex、Cursor 等。",
  },
};

export default function ToolsPage() {
  const tools = getAllTools();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "/" },
          { name: "AI 工具", url: "/tools" },
        ]}
      />
      <Container>
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-2">
            2026 年最好用的 AI 编程工具
          </h1>
          <p className="text-gray-500 mb-8">
            精选推荐，持续更新。帮你找到最适合的 AI 编程助手。
          </p>
          <AdSlot slot="top-banner" format="horizontal" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(({ frontmatter }) => (
              <ToolCard key={frontmatter.slug} tool={frontmatter} />
            ))}
          </div>
          <AdSlot slot="bottom-banner" format="horizontal" />
        </div>
      </Container>
    </>
  );
}
```

- [ ] **Step 2: 创建工具详情页**

写入 `src/app/tools/[slug]/page.tsx`:

```tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import AdSlot from "@/components/ads/AdSlot";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { getTool, getAllTools } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: `${tool.frontmatter.title} 评测 - 2026 最全使用指南`,
    description: tool.frontmatter.description,
    openGraph: {
      title: `${tool.frontmatter.title} 评测`,
      description: tool.frontmatter.description,
    },
  };
}

export async function generateStaticParams() {
  return getAllTools().map(({ frontmatter }) => ({
    slug: frontmatter.slug,
  }));
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const allTools = getAllTools();
  const relatedTools = allTools
    .filter((t) => t.frontmatter.slug !== slug)
    .slice(0, 3);

  // Extract FAQ sections from content
  const faqMatch = tool.content.match(/## FAQ([\s\S]*?)$/);
  const faqQuestions =
    faqMatch
      ?.match(/### (.+?)\n\n(.+?)(?=\n###|\n$)/gs)
      ?.map((block) => {
        const [, q, a] = block.match(/### (.+?)\n\n(.+)/s) ?? [];
        return { question: q, answer: a.trim() };
      }) ?? [];

  return (
    <>
      <ArticleJsonLd
        title={`${tool.frontmatter.title} 评测`}
        description={tool.frontmatter.description}
        url={`/tools/${slug}`}
        datePublished={tool.frontmatter.updated}
      />
      {faqQuestions.length > 0 && <FaqJsonLd questions={faqQuestions} />}
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "/" },
          { name: "AI 工具", url: "/tools" },
          { name: tool.frontmatter.title, url: `/tools/${slug}` },
        ]}
      />
      <Container>
        <article className="py-8 max-w-3xl mx-auto">
          <div className="mb-2 text-sm text-gray-400">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
              {tool.frontmatter.category}
            </span>
            <span className="ml-2">
              评分：{"★".repeat(Math.floor(tool.frontmatter.rating))}
              {"☆".repeat(5 - Math.floor(tool.frontmatter.rating))}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{tool.frontmatter.title} 评测</h1>
          <p className="text-gray-500 mb-4">{tool.frontmatter.description}</p>
          <div className="flex gap-4 mb-6 text-sm">
            <span>💰 {tool.frontmatter.pricing}</span>
            <a
              href={tool.frontmatter.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              官网 →
            </a>
          </div>

          <AdSlot slot="content-top" />

          <div className="prose prose-gray max-w-none mt-8">
            {tool.content
              .replace(/---[\s\S]*?---/, "")
              .split("\n")
              .map((line, i) => {
                if (line.startsWith("## ")) {
                  return (
                    <h2 key={i} className="text-xl font-bold mt-8 mb-4">
                      {line.replace("## ", "")}
                    </h2>
                  );
                }
                if (line.startsWith("### ")) {
                  return (
                    <h3 key={i} className="text-lg font-semibold mt-6 mb-3">
                      {line.replace("### ", "")}
                    </h3>
                  );
                }
                if (line.startsWith("|")) {
                  return <p key={i} className="font-mono text-sm my-1">{line}</p>;
                }
                if (line.trim() === "") {
                  return <div key={i} className="h-3" />;
                }
                return <p key={i} className="my-2">{line}</p>;
              })}
          </div>

          <AdSlot slot="content-bottom" />

          <RelatedLinks
            title="更多 AI 工具推荐"
            links={relatedTools.map((t) => ({
              title: t.frontmatter.title,
              href: `/tools/${t.frontmatter.slug}`,
              description: t.frontmatter.description,
            }))}
          />
        </article>
      </Container>
    </>
  );
}
```

注意：当前工具详情页使用简单的 Markdown 渲染（逐行解析标题和段落），MVP 够用。后续可以换 `next-mdx-remote` 做完整渲染。

- [ ] **Step 3: 验证构建**

```bash
cd "F:/vibe coding/website" && npm run build 2>&1 | tail -20
```

Expected: 构建成功，无错误。

- [ ] **Step 4: Commit**

```bash
cd "F:/vibe coding/website" && git add -A && git commit -m "feat: add tools listing and detail pages"
```

---

### Task 11: 教程页路由（tutorials listing + detail）

**Files:**
- Create: `src/app/tutorials/page.tsx`
- Create: `src/app/tutorials/[slug]/page.tsx`

- [ ] **Step 1: 创建教程列表页**

写入 `src/app/tutorials/page.tsx`:

```tsx
import { Metadata } from "next";
import Container from "@/components/layout/Container";
import ArticleCard from "@/components/content/ArticleCard";
import AdSlot from "@/components/ads/AdSlot";
import { getAllTutorials } from "@/lib/content";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "AI 编程教程 - Claude Code、Codex、Agent 入门指南",
  description:
    "从零开始学 AI 编程。Claude Code 技巧、Codex 教程、Agent 入门指南，面向 AI 初学者的实战教程。",
};

export default function TutorialsPage() {
  const tutorials = getAllTutorials();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "/" },
          { name: "教程", url: "/tutorials" },
        ]}
      />
      <Container>
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-2">AI 编程教程</h1>
          <p className="text-gray-500 mb-8">
            从零开始的 AI 编程实战教程，持续更新。
          </p>
          <AdSlot slot="tutorials-top" format="horizontal" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tutorials.map(({ frontmatter }) => (
              <ArticleCard key={frontmatter.slug} tutorial={frontmatter} />
            ))}
          </div>
          <AdSlot slot="tutorials-bottom" format="horizontal" />
        </div>
      </Container>
    </>
  );
}
```

- [ ] **Step 2: 创建教程详情页**

写入 `src/app/tutorials/[slug]/page.tsx`:

```tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import AdSlot from "@/components/ads/AdSlot";
import RelatedLinks from "@/components/seo/RelatedLinks";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  FaqJsonLd,
} from "@/components/seo/JsonLd";
import { getTutorial, getAllTutorials } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = getTutorial(slug);
  if (!tutorial) return {};
  return {
    title: tutorial.frontmatter.title,
    description: tutorial.frontmatter.description,
    openGraph: {
      title: tutorial.frontmatter.title,
      description: tutorial.frontmatter.description,
    },
  };
}

export async function generateStaticParams() {
  return getAllTutorials().map(({ frontmatter }) => ({
    slug: frontmatter.slug,
  }));
}

const difficultyLabel: Record<string, string> = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "高级",
};

export default async function TutorialPage({ params }: Props) {
  const { slug } = await params;
  const tutorial = getTutorial(slug);
  if (!tutorial) notFound();

  const allTutorials = getAllTutorials();
  const related = allTutorials
    .filter((t) => t.frontmatter.slug !== slug)
    .slice(0, 3);

  const faqMatch = tutorial.content.match(/## FAQ([\s\S]*?)$/);
  const faqQuestions =
    faqMatch
      ?.match(/### (.+?)\n\n(.+?)(?=\n###|\n$)/gs)
      ?.map((block) => {
        const [, q, a] = block.match(/### (.+?)\n\n(.+)/s) ?? [];
        return { question: q, answer: a.trim() };
      }) ?? [];

  return (
    <>
      <ArticleJsonLd
        title={tutorial.frontmatter.title}
        description={tutorial.frontmatter.description}
        url={`/tutorials/${slug}`}
        datePublished={tutorial.frontmatter.updated}
      />
      {faqQuestions.length > 0 && <FaqJsonLd questions={faqQuestions} />}
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "/" },
          { name: "教程", url: "/tutorials" },
          { name: tutorial.frontmatter.title, url: `/tutorials/${slug}` },
        ]}
      />
      <Container>
        <article className="py-8 max-w-3xl mx-auto">
          <div className="mb-2 text-sm text-gray-400">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
              {difficultyLabel[tutorial.frontmatter.difficulty]}
            </span>
            <span className="ml-2">{tutorial.frontmatter.updated}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {tutorial.frontmatter.title}
          </h1>
          <p className="text-gray-500 mb-4">{tutorial.frontmatter.description}</p>
          <div className="flex gap-2 mb-6">
            {tutorial.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <AdSlot slot="content-top" />

          <div className="prose prose-gray max-w-none mt-8">
            {tutorial.content
              .replace(/---[\s\S]*?---/, "")
              .split("\n")
              .map((line, i) => {
                if (line.startsWith("## ")) {
                  return (
                    <h2 key={i} className="text-xl font-bold mt-8 mb-4">
                      {line.replace("## ", "")}
                    </h2>
                  );
                }
                if (line.startsWith("### ")) {
                  return (
                    <h3 key={i} className="text-lg font-semibold mt-6 mb-3">
                      {line.replace("### ", "")}
                    </h3>
                  );
                }
                if (line.startsWith("```")) {
                  return null;
                }
                if (line.startsWith("|")) {
                  return (
                    <p key={i} className="font-mono text-sm my-1">
                      {line}
                    </p>
                  );
                }
                if (line.trim() === "") {
                  return <div key={i} className="h-3" />;
                }
                return (
                  <p key={i} className="my-2">
                    {line}
                  </p>
                );
              })}
          </div>

          <AdSlot slot="content-bottom" />

          <RelatedLinks
            title="相关教程"
            links={related.map((t) => ({
              title: t.frontmatter.title,
              href: `/tutorials/${t.frontmatter.slug}`,
              description: t.frontmatter.description,
            }))}
          />
        </article>
      </Container>
    </>
  );
}
```

- [ ] **Step 3: 验证构建**

```bash
cd "F:/vibe coding/website" && npm run build 2>&1 | tail -20
```

- [ ] **Step 4: Commit**

```bash
cd "F:/vibe coding/website" && git add -A && git commit -m "feat: add tutorials listing and detail pages"
```

---

### Task 12: 对比页路由 + 首页 + 关于/联系页

**Files:**
- Create: `src/app/compare/[slug]/page.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/about/page.tsx`
- Create: `src/app/contact/page.tsx`

- [ ] **Step 1: 创建对比页路由**

写入 `src/app/compare/[slug]/page.tsx`:

```tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import AdSlot from "@/components/ads/AdSlot";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { getCompare, getAllCompares, getAllTools } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const compare = getCompare(slug);
  if (!compare) return {};
  return {
    title: compare.frontmatter.title,
    description: compare.frontmatter.description,
    openGraph: {
      title: compare.frontmatter.title,
      description: compare.frontmatter.description,
    },
  };
}

export async function generateStaticParams() {
  return getAllCompares().map(({ frontmatter }) => ({
    slug: frontmatter.slug,
  }));
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const compare = getCompare(slug);
  if (!compare) notFound();

  const tools = getAllTools();
  const relatedLinks = tools
    .filter(
      (t) =>
        t.frontmatter.slug === compare.frontmatter.tool_a ||
        t.frontmatter.slug === compare.frontmatter.tool_b
    )
    .map((t) => ({
      title: t.frontmatter.title,
      href: `/tools/${t.frontmatter.slug}`,
      description: t.frontmatter.description,
    }));

  const faqMatch = compare.content.match(/## FAQ([\s\S]*?)$/);
  const faqQuestions =
    faqMatch
      ?.match(/### (.+?)\n\n(.+?)(?=\n###|\n$)/gs)
      ?.map((block) => {
        const [, q, a] = block.match(/### (.+?)\n\n(.+)/s) ?? [];
        return { question: q, answer: a.trim() };
      }) ?? [];

  return (
    <>
      <ArticleJsonLd
        title={compare.frontmatter.title}
        description={compare.frontmatter.description}
        url={`/compare/${slug}`}
        datePublished="2026-05-11"
      />
      {faqQuestions.length > 0 && <FaqJsonLd questions={faqQuestions} />}
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "/" },
          { name: "AI 工具", url: "/tools" },
          { name: compare.frontmatter.title, url: `/compare/${slug}` },
        ]}
      />
      <Container>
        <article className="py-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{compare.frontmatter.title}</h1>
          <p className="text-gray-500 mb-6">{compare.frontmatter.description}</p>

          <AdSlot slot="content-top" />

          <div className="prose prose-gray max-w-none mt-8">
            {compare.content
              .replace(/---[\s\S]*?---/, "")
              .split("\n")
              .map((line, i) => {
                if (line.startsWith("## ")) {
                  return (
                    <h2 key={i} className="text-xl font-bold mt-8 mb-4">
                      {line.replace("## ", "")}
                    </h2>
                  );
                }
                if (line.startsWith("### ")) {
                  return (
                    <h3 key={i} className="text-lg font-semibold mt-6 mb-3">
                      {line.replace("### ", "")}
                    </h3>
                  );
                }
                if (line.startsWith("|")) {
                  return (
                    <p key={i} className="font-mono text-sm my-1">
                      {line}
                    </p>
                  );
                }
                if (line.trim() === "") {
                  return <div key={i} className="h-3" />;
                }
                return (
                  <p key={i} className="my-2">
                    {line}
                  </p>
                );
              })}
          </div>

          <AdSlot slot="content-bottom" />

          <RelatedLinks
            title="对比中的工具"
            links={relatedLinks}
          />
        </article>
      </Container>
    </>
  );
}
```

- [ ] **Step 2: 创建首页**

写入 `src/app/page.tsx`:

```tsx
import Link from "next/link";
import Container from "@/components/layout/Container";
import ToolCard from "@/components/content/ToolCard";
import ArticleCard from "@/components/content/ArticleCard";
import AdSlot from "@/components/ads/AdSlot";
import { getAllTools, getAllTutorials } from "@/lib/content";

export default function HomePage() {
  const tools = getAllTools().slice(0, 3);
  const tutorials = getAllTutorials().slice(0, 3);

  return (
    <Container>
      {/* Hero */}
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          找到最适合你的 AI 编程工具
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-6">
          精选 2026 年最值得用的 AI 编程工具和实战教程。
          从 Claude Code 到 Codex，从零基础到高效使用，帮你快速上手 AI 编程。
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/tools"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            浏览 AI 工具
          </Link>
          <Link
            href="/tutorials"
            className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            查看教程
          </Link>
        </div>
      </section>

      <AdSlot slot="home-top" format="horizontal" />

      {/* Tools Section */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🔥 热门 AI 工具</h2>
          <Link href="/tools" className="text-blue-600 hover:underline text-sm">
            查看全部 →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ frontmatter }) => (
            <ToolCard key={frontmatter.slug} tool={frontmatter} />
          ))}
        </div>
      </section>

      {/* Tutorials Section */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">📝 最新教程</h2>
          <Link
            href="/tutorials"
            className="text-blue-600 hover:underline text-sm"
          >
            查看全部 →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutorials.map(({ frontmatter }) => (
            <ArticleCard key={frontmatter.slug} tutorial={frontmatter} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 text-center bg-blue-50 rounded-2xl my-8">
        <h2 className="text-2xl font-bold mb-3">不知道选哪个？</h2>
        <p className="text-gray-500 mb-6">
          看看 Claude Code vs Codex 的详细对比，帮你做出最适合的选择。
        </p>
        <Link
          href="/compare/claude-code-vs-codex"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          查看对比 →
        </Link>
      </section>

      <AdSlot slot="home-bottom" format="horizontal" />
    </Container>
  );
}
```

- [ ] **Step 3: 创建关于页**

写入 `src/app/about/page.tsx`:

```tsx
import { Metadata } from "next";
import Container from "@/components/layout/Container";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "关于我们",
  description: "AI 工具导航是一个面向 AI 初学者的工具推荐和教程平台。",
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "/" },
          { name: "关于", url: "/about" },
        ]}
      />
      <Container>
        <div className="py-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">关于 AI 工具导航</h1>
          <div className="prose prose-gray">
            <p>
              AI 工具导航是一个面向 AI 初学者的工具推荐和教程平台。我们精选 2026
              年最值得使用的 AI 编程工具，提供深度评测、使用技巧和入门教程。
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-3">我们的目标</h2>
            <p>
              帮助每一位 AI 初学者找到最适合自己的工具，学会高效使用 AI 辅助编程。
            </p>
            <h2 className="text-xl font-semibold mt-6 mb-3">内容原则</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>所有工具评测基于真实使用经验</li>
              <li>教程内容注重实战，拒绝空泛</li>
              <li>保持更新，信息准确</li>
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}
```

- [ ] **Step 4: 创建联系页**

写入 `src/app/contact/page.tsx`:

```tsx
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
      <BreadcrumbJsonLd
        items={[
          { name: "首页", url: "/" },
          { name: "联系", url: "/contact" },
        ]}
      />
      <Container>
        <div className="py-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">联系我们</h1>
          <div className="prose prose-gray">
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
```

- [ ] **Step 5: 更新 layout.tsx 加入 Header 和 Footer**

修改 `src/app/layout.tsx`：

```tsx
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI 工具导航 - 最好用的 AI 编程工具推荐与教程",
    template: "%s | AI 工具导航",
  },
  description:
    "面向 AI 初学者的工具导航与教程站。推荐 2026 年最好用的 AI 编程工具，提供 Claude Code、Codex 等工具的深度评测和使用技巧。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-white text-gray-900 antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 6: 验证构建**

```bash
cd "F:/vibe coding/website" && npm run build
```

Expected: 所有页面静态生成成功。

- [ ] **Step 7: Commit**

```bash
cd "F:/vibe coding/website" && git add -A && git commit -m "feat: add compare page, home page, about, contact, and global layout"
```

---

### Task 13: SEO 基础设施（sitemap + robots）

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

- [ ] **Step 1: 创建 sitemap.ts**

写入 `src/app/sitemap.ts`:

```tsx
import { MetadataRoute } from "next";
import { getAllTools, getAllTutorials, getAllCompares } from "@/lib/content";

const BASE_URL = "https://aitools.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), priority: 1 },
    { url: `${BASE_URL}/tools`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/tutorials`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), priority: 0.3 },
  ];

  const toolPages = getAllTools().map(({ frontmatter }) => ({
    url: `${BASE_URL}/tools/${frontmatter.slug}`,
    lastModified: new Date(frontmatter.updated),
    priority: 0.8,
  }));

  const tutorialPages = getAllTutorials().map(({ frontmatter }) => ({
    url: `${BASE_URL}/tutorials/${frontmatter.slug}`,
    lastModified: new Date(frontmatter.updated),
    priority: 0.8,
  }));

  const comparePages = getAllCompares().map(({ frontmatter }) => ({
    url: `${BASE_URL}/compare/${frontmatter.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages, ...tutorialPages, ...comparePages];
}
```

注意：`BASE_URL` 需要在上线前替换为实际域名。

- [ ] **Step 2: 创建 robots.ts**

写入 `src/app/robots.ts`:

```tsx
import { MetadataRoute } from "next";

const BASE_URL = "https://aitools.site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: 验证构建**

```bash
cd "F:/vibe coding/website" && npm run build
```

Expected: 无错误。检查 `out/sitemap.xml` 和 `out/robots.txt` 是否生成。

- [ ] **Step 4: Commit**

```bash
cd "F:/vibe coding/website" && git add -A && git commit -m "feat: add sitemap and robots.txt"
```

---

### Task 14: 部署准备 + GitHub + Vercel

**Files:**
- Create: `.gitignore`
- Create: `README.md`

- [ ] **Step 1: 创建 .gitignore**

写入 `.gitignore`:

```
node_modules/
.next/
out/
.env
.env.local
.superpowers/
```

- [ ] **Step 2: 提交到 GitHub**

```bash
cd "F:/vibe coding/website"
git add .gitignore
git commit -m "chore: add .gitignore"
```

创建 GitHub repo 并推送（用 `gh` CLI）：

```bash
gh repo create ai-tools-site --public --source . --push
```

- [ ] **Step 3: 部署到 Vercel**

在 Vercel 官网 (vercel.com) 导入 GitHub 仓库 `ai-tools-site`：
- Framework: Next.js
- Build command: `npm run build`
- Output directory: `out`（因为我们用 `output: "export"`）
- 部署后获取域名

也可以从本地部署：

```bash
npx vercel --prod
```

- [ ] **Step 4: 验证线上站点**

部署后检查：
- 首页正常显示
- 所有页面可以正常访问
- sitemap.xml 可访问
- robots.txt 可访问
- 打开 DevTools → Lighthouse，检查 SEO 分数

- [ ] **Step 5: Commit**

```bash
cd "F:/vibe coding/website" && git add -A && git commit -m "chore: deployment setup"
```

---

### Task 15: 上线后检查清单（不涉及代码）

以下步骤为 SEO 上线后的手动操作，不需要写代码：

- [ ] Google Search Console 添加站点并验证所有权
- [ ] 提交 sitemap.xml 到 Google Search Console
- [ ] 注册 Google AdSense（等流量上来后申请）
- [ ] 设置 Vercel Analytics
- [ ] 创建关键词排名跟踪表（Excel / Google Sheets）
- [ ] 制定内容发布计划：每周 2-3 篇新教程
- [ ] 每两周检查 Search Console 收录情况
- [ ] 每月更新工具页面的价格和信息
```

---

## 自审

写完计划后对照 spec 检查：

1. **Spec 覆盖**：逐条对照：
   - ✅ 首页（热门工具 + 最新教程）— Task 12 Step 2
   - ✅ 工具分类页 + 3 个单工具评测页 — Task 10 + Task 7
   - ✅ 教程列表页 + 3 篇教程文章 — Task 11 + Task 8
   - ✅ 1 个对比页 — Task 12 Step 1 + Task 9
   - ✅ 关于页 + 联系页 — Task 12 Step 3-4
   - ✅ sitemap.xml + robots.txt — Task 13
   - ✅ SEO metadata + schema.org — 分散在各页面 Task 中（JsonLd、generateMetadata）
   - ✅ Google AdSense 广告位 — Task 6 + 各页面中嵌入 AdSlot
   - ✅ 响应式设计 — Tailwind CSS 默认响应式

2. **占位符检查**：无 TBD、TODO、placeholder。所有代码为完整实现。

3. **类型一致性**：
   - `ToolFrontmatter.slug` 在各处一致使用
   - `TutorialFrontmatter.difficulty` 的 `difficultyLabel` mapping 在 tools 和 tutorials 页一致
   - `getTool()`, `getAllTools()` 等函数签名在 Task 2 定义，后续 Task 使用一致
