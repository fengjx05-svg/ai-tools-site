# AI 工具导航 - 项目上下文

## 项目定位

AI 编程工具导航 + 教程博客，面向 **AI 初学者**。靠 Google SEO 获取流量，通过 **Google AdSense 广告**变现。

## 目标用户与关键词

| 关键词 | 搜索意图 | 页面 |
|--------|----------|------|
| 2026 年最好用的 AI 工具 | 发现/对比 | /tools |
| Claude Code 使用技巧 | 学习 | /tutorials/claude-code-tips |
| Codex 使用技巧 | 学习 | /tutorials/codex-from-zero |
| Agent 入门教程 | 入门 | /tutorials/agent-intro-guide |

## 技术栈

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS 4**
- **MDX** 作为内容源（`src/content/` 目录）
- **next-mdx-remote v6** (`MDXRemote` from `next-mdx-remote/rsc`) 正式渲染 MDX
- **@tailwindcss/typography** 排版美化（`prose` 类）
- **gray-matter** 解析 frontmatter
- **Vercel** 部署（Git push 自动触发）

## 网站架构

```
首页 (/)
├── 工具列表 (/tools)
│   └── 工具详情 (/tools/[slug])
├── 教程列表 (/tutorials)
│   └── 教程详情 (/tutorials/[slug])
├── 对比页 (/compare/[slug])
├── 关于 (/about)
├── 联系 (/contact)
├── sitemap.xml
└── robots.txt
```

## 目录结构

```
src/
├── app/                        # Next.js App Router 页面
│   ├── layout.tsx              # 全局布局（Header + Footer + SEO metadata）
│   ├── page.tsx                # 首页
│   ├── globals.css             # Tailwind + Typography
│   ├── sitemap.ts              # 自动生成 sitemap
│   ├── robots.ts               # robots.txt
│   ├── tools/
│   │   ├── page.tsx            # 工具列表
│   │   └── [slug]/page.tsx     # 工具详情（SSG）
│   ├── tutorials/
│   │   ├── page.tsx            # 教程列表
│   │   └── [slug]/page.tsx     # 教程详情（SSG）
│   ├── compare/
│   │   └── [slug]/page.tsx     # 对比页
│   ├── about/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # 导航栏
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   ├── seo/
│   │   ├── JsonLd.tsx          # Article/Breadcrumb/FAQ JSON-LD
│   │   └── RelatedLinks.tsx    # 内链推荐
│   ├── content/
│   │   ├── ToolCard.tsx        # 工具卡片
│   │   ├── ArticleCard.tsx     # 教程卡片
│   │   └── MDXContent.tsx      # MDX 渲染器（核心）
│   └── ads/
│       └── AdSlot.tsx          # AdSense 占位符
├── content/                    # MDX 内容文件
│   ├── tools/                  # 工具评测
│   │   ├── claude-code.mdx
│   │   ├── codex.mdx
│   │   └── cursor.mdx
│   ├── tutorials/              # 教程文章
│   │   ├── claude-code-tips.mdx
│   │   ├── codex-from-zero.mdx
│   │   └── agent-intro-guide.mdx
│   └── compare/                # 工具对比
│       └── claude-code-vs-codex.mdx
└── lib/
    ├── types.ts                # ToolFrontmatter, TutorialFrontmatter, CompareFrontmatter
    └── content.ts              # MDX 文件读取工具（getTool, getAllTools 等）
```

## 内容工作流

**加新内容 = 加 .mdx 文件 → git push → Vercel 自动部署。不需要改任何代码。**

### 加新工具评测

在 `src/content/tools/` 新建 `.mdx` 文件：

```yaml
---
title: "工具名"
slug: "tool-slug"
category: "ai-coding-tools"
description: "简短描述"
rating: 4.0
pricing: "价格信息"
url: "https://官网"
tags: ["标签1", "标签2"]
updated: "2026-05-12"
---

## 简介
内容...

## FAQ
### 问题1？
回答...
```

### 加新教程

在 `src/content/tutorials/` 新建 `.mdx` 文件：

```yaml
---
title: "教程标题"
slug: "tutorial-slug"
category: "分类"
description: "简短描述"
difficulty: "beginner"  # beginner | intermediate | advanced
tags: ["标签"]
updated: "2026-05-12"
related_tools: ["claude-code"]
related_tutorials: ["other-slug"]
---

## 正文
内容...
```

### 加新对比

在 `src/content/compare/` 新建 `.mdx` 文件：

```yaml
---
title: "A vs B：对比标题"
slug: "a-vs-b"
tool_a: "slug-of-tool-a"
tool_b: "slug-of-tool-b"
description: "简短描述"
comparison_points: ["价格", "功能", "适合人群"]
---

## 内容
```

## MDX 渲染

内容由 `MDXContent` 组件（`src/components/content/MDXContent.tsx`）使用 `next-mdx-remote/rsc` 的 `MDXRemote` 渲染。支持的 Markdown 格式：
- `**加粗**`、`*斜体*`
- `| 表格 |` 带边框
- `- 列表` / `1. 有序列表`
- \`\`\`代码块\`\`\`（深色背景）
- `> 引用块`
- `### FAQ` 区块自动提取生成 JSON-LD 结构化数据

## 部署信息

- **GitHub**: `fengjx05-svg/ai-tools-site`
- **Vercel 域名**: `https://ai-tools-site-fznaqbe4q-feng20911-s-projects.vercel.app/`
- **部署方式**: Git push → Vercel 自动构建部署
- **BASE_URL**: 已更新为 Vercel 域名（sitemap.ts, robots.ts）

## SEO 状态

- ✅ Google Search Console 已验证（`-_HZKOvExC14gUxwATiDE2GGUacI8aFsSv3CaUNoXAE`）
- ✅ sitemap.xml 自动生成（含所有静态+动态页面）
- ✅ robots.txt 允许所有爬虫
- ✅ 每个页面有 JSON-LD 结构化数据（Article / Breadcrumb / FAQ）
- ✅ Open Graph metadata
- ⏳ Google AdSense 待申请
- ⏳ 关键词排名跟踪待建立

## 已有内容

| 类型 | 文件 | 标题 |
|------|------|------|
| 工具 | claude-code.mdx | Claude Code |
| 工具 | codex.mdx | OpenAI Codex CLI |
| 工具 | cursor.mdx | Cursor |
| 教程 | claude-code-tips.mdx | Claude Code 10 个实用技巧（2026 版）|
| 教程 | codex-from-zero.mdx | Codex CLI 从零到上手：AI 初学者指南 |
| 教程 | agent-intro-guide.mdx | AI Agent 入门指南：从概念到实战 |
| 对比 | claude-code-vs-codex.mdx | Claude Code vs Codex |

## 设计原则

- **不做纯 AI 灌水内容** — 每篇有真实经验、数据、对比、步骤
- **MDX 高于 CMS** — 内容量不大时，文件即内容最简单
- **SEO 每页必备** — title + description + H1/H2/H3 + FAQ + 内链 + JSON-LD + OG
- **YAGNI** — 暂不加搜索、评论、用户系统、CMS、多语言

## 常用命令

```bash
npm run dev          # 本地开发
npm run build        # 生产构建
npm run typecheck    # TypeScript 类型检查
git push origin main # 推送 → Vercel 自动部署
```
