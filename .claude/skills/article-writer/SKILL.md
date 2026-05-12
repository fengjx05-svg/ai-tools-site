---
name: article-writer
description: |
  This skill handles ALL article writing, content creation, and content update tasks for the AI tools navigation website.
  
  Use this skill when the user:
  - Asks to write/create/generate an article, post, tutorial, or tool review
  - Gives a topic and asks you to create content about it ("写一篇关于xxx的文章", "write about xxx")
  - Wants to translate/republish content from external websites ("翻译这篇文章", "转载xxx")
  - Asks to bulk-generate articles ("给我生成10篇文章", "create 5 tutorials")
  - Mentions updating or expanding existing content files
  - Talks about creating content for the AI tools site in any capacity
  
  Even if the user just says "generate some content" without specifying details, trigger this skill.
---

# Article Writer for AI Tools Site

This skill handles the full lifecycle: research → write → save → deploy.

## Content types

The site has three content types. Choose based on the topic:

| Type | Directory | When to use |
|------|-----------|-------------|
| Tutorial | `src/content/tutorials/` | How-to guides, tips, learning content, beginner guides |
| Tool review | `src/content/tools/` | In-depth review of a specific AI coding tool |
| Compare | `src/content/compare/` | Head-to-head comparison between two tools |

If unclear, default to **tutorials** — they target the site's core audience (AI beginners).

## Workflow

### Phase 1: Research

When the user gives a **specific topic**, treat research as critical:

1. Use `WebSearch` to find up-to-date information about the topic (at least 3-5 searches covering different angles)
2. Search for: official docs, recent reviews, pricing, user experiences, comparisons
3. Collect concrete data points: version numbers, pricing, feature lists, pros/cons
4. If the topic is about a specific tool, search for its official website, GitHub repo, recent changelog
5. Note the current year (2026) — all content must reflect the latest information

When the user says **"generate 10 articles"** without specific topics:
- FIRST generate a topic list with 10 titles + content types
- Present it to the user for approval
- Only start writing after confirmation

### Phase 2: Write

Create the `.mdx` file with correct frontmatter and body content.

#### Tutorial frontmatter

```yaml
---
title: "标题（吸引人、含关键词）"
slug: "english-slug-kebab-case"
category: "分类"
description: "150-200字描述，含关键词，用于SEO meta description"
difficulty: "beginner"  # beginner | intermediate | advanced
tags: ["标签1", "标签2", "标签3", "标签4"]
updated: "YYYY-MM-DD"  # today's date
related_tools: ["tool-slug"]  # optional, reference existing tool slugs
related_tutorials: ["tutorial-slug"]  # optional
---
```

#### Tool review frontmatter

```yaml
---
title: "Tool Name"
slug: "tool-slug"
category: "ai-coding-tools"
description: "150-200字描述"
rating: 4.0  # 1.0-5.0 in 0.5 increments
pricing: "价格信息"
url: "https://官网链接"
tags: ["标签1", "标签2", "标签3"]
updated: "YYYY-MM-DD"
---
```

#### Compare frontmatter

```yaml
---
title: "A vs B：对比标题"
slug: "a-vs-b"
tool_a: "slug-of-tool-a"
tool_b: "slug-of-tool-b"
description: "150-200字对比描述"
comparison_points: ["价格", "功能", "性能", "适合人群"]
---
```

#### Content structure guidelines

Every article MUST include these sections:

1. **Opening** — Who is this for? What will they learn? (2-3 sentences)
2. **Body** — Use H2 (`##`) for major sections, H3 (`###`) for sub-sections
3. **Tables** — Use markdown tables for comparisons, feature lists, pricing. Always include at least one table for visual structure.
4. **Code examples** — When relevant, include practical code blocks with `` ```bash `` or `` ```typescript ``
5. **Summary/conclusion** — A short wrap-up or key takeaways
6. **FAQ** — At least 3-5 FAQ items using `### Question?` format (this powers JSON-LD structured data)

#### Content quality rules

- **No AI fluff** — Every section must have concrete data, real examples, or actionable advice. Avoid generic statements like "AI is transforming the world."
- **SEO-friendly** — Include target keywords naturally in H2 headings, body text, and FAQ questions
- **Chinese language** — All content in Simplified Chinese (zh-CN), with technical terms kept in English where appropriate (e.g., "prompt（提示词）")
- **Target audience** — AI beginners. Explain concepts simply. Avoid jargon without explanation.
- **Word count** — Aim for 1500-3000 Chinese characters. Shorter for simple topics, longer for deep dives.
- **Frontmatter `slug`** — Must be unique across all content types. Check existing slugs before picking one.

#### Content elements that render well

The site uses `next-mdx-remote` with `remark-gfm` and custom styled components. These elements work:

```
**bold text** for emphasis
*italic* for light emphasis

| Table | Header |
|-------|--------|
| Data  | Data   |

```code blocks with language tag```

- Bullet lists
1. Ordered lists

> Blockquotes

### FAQ questions (H3 inside ## FAQ section)
```

#### Slug conventions

- Use lowercase English, kebab-case
- Tutorials: descriptive slug (e.g., `claude-code-tips`, `how-to-use-cursor`)
- Tools: tool name (e.g., `claude-code`, `cursor`, `windsurf`)
- Compare: `tool-a-vs-tool-b` format
- Check `src/content/*/` directories to avoid duplicates

### Phase 3: Save and Deploy

After writing the `.mdx` file:

1. Save to the correct directory: `src/content/{tutorials|tools|compare}/{slug}.mdx`
2. Verify the frontmatter parses correctly (especially `slug` matching the filename)
3. Run the git workflow:

```bash
cd "<project-root>"
git add -A
git commit -m "content: add <type> - <title>"
git push origin main
```

The push triggers Vercel auto-deployment. No further action needed.

## Translated / republished content

When user provides a URL to an external article:

1. Use `WebFetch` to read the original content
2. Extract the core information, data, and key insights
3. **Deep rewrite**: Use the original info as source material but completely rewrite in your own words, structure, and examples. Adapt for Chinese AI beginners.
4. Add original insights, Chinese-specific context, or additional examples not in the source
5. At the end of the article, before FAQ, add:
   ```
   > 本文参考/编译自 [Original Title](URL)
   ```
6. Follow all Phase 2 content quality rules

## Batch generation

When asked to generate multiple articles at once:

1. Generate a topic list first (title + type + one-line description for each)
2. Present as a numbered list, ask the user to confirm or adjust
3. After confirmation, write articles one at a time
4. On the first article, confirm with user before continuing to the rest
5. After all articles are written, do ONE git commit and push for all

## Important constraints

- **Never invent tool URLs or pricing** — verify with web search or state "请查阅官网" if unverifiable
- **Never skip the FAQ section** — it's required for SEO JSON-LD
- **Never duplicate existing slugs** — check `src/content/` first
- **Never commit without user confirmation** unless the user explicitly said to auto-push
- **Always verify `npm run build` passes** — though since we're only adding content files (no code changes), build failures are unlikely from new MDX files alone
