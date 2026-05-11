# AI 工具导航 + 教程站 — 设计方案

## 1. 项目概述

**网站定位**：AI 编程工具导航 + 教程博客，面向 AI 初学者。
**核心关键词**：2026 年最好用的 AI 工具、Claude Code 使用技巧、Codex 使用技巧、Agent 入门教程。
**变现方式**：Google AdSense 广告。

## 2. 目标用户与搜索意图

| 关键词 | 搜索意图 | 对应页面类型 |
|--------|----------|-------------|
| 2026 年最好用的 AI 工具 | 发现、对比、选择 | 工具分类页 / 对比页 |
| Claude Code 使用技巧 | 学习、解决问题 | 教程文章 / 单工具评测页 |
| Codex 使用技巧 | 学习、解决问题 | 教程文章 / 单工具评测页 |
| Agent 入门教程 | 入门学习 | 系列教程 / 教程列表页 |

## 3. 网站信息架构

```
首页
├── 工具分类页 (/tools)
│   ├── 单工具评测页 (/tools/claude-code)
│   ├── 单工具评测页 (/tools/codex)
│   ├── 单工具评测页 (/tools/cursor, /tools/windsurf, ...)
│   └── 对比页 (/compare/claude-code-vs-codex)
├── 教程列表页 (/tutorials)
│   ├── 教程文章 (/tutorials/claude-code-tips)
│   ├── 教程文章 (/tutorials/codex-from-zero)
│   └── 系列教程 (/tutorials/agent-intro-guide)
├── 关于页 (/about)
├── 联系页 (/contact)
├── sitemap.xml (/sitemap.xml)
└── robots.txt (/robots.txt)
```

## 4. 技术栈

- **框架**：Next.js 15 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **内容**：MDX 文件（本地 Markdown）
- **渲染**：SSG（静态生成）+ ISR（增量更新）
- **部署**：GitHub → Vercel
- **分析**：Vercel Analytics + Google Search Console
- **广告**：Google AdSense
- **SEO**：next-sitemap, next-seo, schema-dts

## 5. 内容数据模型

### 工具 MDX frontmatter

```yaml
---
title: "Claude Code 深度评测"
slug: "claude-code"
category: "ai-coding-tools"
description: "Claude Code 是 Anthropic 推出的 AI 编程助手..."
rating: 4.5
pricing: "免费 / Pro $20/月"
url: "https://claude.ai"
tags: ["AI编程", "Claude", "终端工具"]
updated: "2026-05-11"
image: "/images/tools/claude-code.png"
---
```

### 教程 MDX frontmatter

```yaml
---
title: "Claude Code 10 个实用技巧"
slug: "claude-code-tips"
category: "claude-code"
description: "从入门到进阶的 Claude Code 使用技巧..."
difficulty: "beginner"
tags: ["Claude Code", "技巧", "效率"]
updated: "2026-05-11"
related_tools: ["claude-code"]
related_tutorials: ["claude-code-setup"]
---
```

### 对比页 MDX frontmatter

```yaml
---
title: "Claude Code vs Codex：哪个更适合 AI 初学者"
slug: "claude-code-vs-codex"
tool_a: "claude-code"
tool_b: "codex"
description: "新手选 AI 编程工具，Claude Code 和 Codex 全方位对比..."
comparison_points: ["价格", "上手难度", "功能", "适用场景"]
---
```

## 6. SEO 结构（每个页面必备）

- `<title>` + `<meta description>`
- H1/H2/H3 层级结构
- FAQ 区块（schema.org FAQ markup）
- 内链推荐区块（相关工具 / 相关教程）
- schema.org 结构化数据（Article / HowTo / Product / Comparison table）
- Open Graph + Twitter Card
- 清晰的 CTA
- 目录（TOC，教程页）

## 7. 组件架构

```
components/
├── layout/
│   ├── Header.tsx        # 导航 + 搜索
│   ├── Footer.tsx        # 链接 + 版权
│   └── Container.tsx     # 通用容器
├── seo/
│   ├── SeoHead.tsx       # SEO meta 统一管理
│   ├── FaqBlock.tsx      # FAQ 结构化数据
│   ├── Breadcrumb.tsx    # 面包屑导航
│   └── RelatedLinks.tsx  # 内链推荐
├── content/
│   ├── ToolCard.tsx      # 工具卡片
│   ├── ToolGrid.tsx      # 工具网格
│   ├── ArticleCard.tsx   # 文章卡片
│   ├── ComparisonTable.tsx # 对比表
│   └── MDXContent.tsx    # MDX 渲染器
├── ads/
│   └── AdSlot.tsx        # AdSense 广告位
└── ui/                   # 通用 UI 组件
```

## 8. MVP 范围（第一版）

**包含**：
- 首页（热门工具 + 最新教程）
- 工具分类页 + 3 个单工具评测页（Claude Code, Codex, Cursor）
- 教程列表页 + 3 篇教程文章
- 1 个对比页（Claude Code vs Codex）
- 关于页 + 联系页
- sitemap.xml + robots.txt
- SEO metadata + schema.org
- Google AdSense 广告位
- 响应式设计

**不含**：
- 搜索功能（后期加）
- 用户系统 / 评论
- 后台管理
- Newsletter 系统
- 多语言

## 9. 上线后清单

- [ ] Google Search Console 注册 & sitemap 提交
- [ ] Google Analytics / Vercel Analytics
- [ ] Google AdSense 申请
- [ ] 关键词排名跟踪表
- [ ] 内容发布计划（每周 2-3 篇教程，每月更新工具列表）
- [ ] 收录检查 & 死链检查
- [ ] 内链优化
- [ ] 转化路径优化（广告位测试）

## 10. 内容策略原则

1. **每篇教程必须有真实使用经验** — 用户提供方向和大纲，AI 辅助写初稿，用户修改
2. **工具页面必须有具体数据** — 价格、功能对比、适用人群、优缺点
3. **不做纯 AI 灌水内容** — 每篇有差异化：个人经验、对比数据、具体步骤
4. **优先覆盖长尾词** — 先写具体工具教程，再写综合对比
