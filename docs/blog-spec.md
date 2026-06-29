# Blog Section — Implementation Spec

## Requirements

- Add `Blog` nav item linking to `/blog` (separate page, not anchor)
- Blog list page: grid of `BlogCard` components showing banner image, title, date, description
- Blog detail page: full rendered Markdown content
- Content sourced from `.md` files via Astro Content Collections
- Bilingual support (`en` / `es`) — UI chrome only, content single-language v1
- 3 mock posts to validate end-to-end

---

## How Astro Handles Blog Content

Astro 5 uses **Content Collections** (`src/content/`). Define a schema in `src/content/config.ts`, then `getCollection('blog')` returns typed entries. `render(entry)` turns the MD body into a `<Content />` component. Blog detail pages use `getStaticPaths` + `export const prerender = true` (required when `output: 'server'`).

---

## File Map

```
src/
├── content/
│   ├── config.ts                            NEW — collection schema
│   └── blog/
│       ├── building-with-astro.md           NEW mock post
│       ├── react-native-performance.md      NEW mock post
│       └── ai-integrations-2025.md          NEW mock post
│
├── pages/
│   ├── blog/
│   │   ├── index.astro                      NEW — EN list page
│   │   └── [slug].astro                     NEW — EN detail page
│   └── es/
│       └── blog/
│           ├── index.astro                  NEW — ES list page
│           └── [slug].astro                 NEW — ES detail page
│
├── components/
│   ├── cards/
│   │   └── blog-card/
│   │       ├── BlogCard.tsx                 NEW molecule
│   │       ├── BlogCard.module.scss         NEW
│   │       └── index.ts                     NEW
│   ├── sections/
│   │   └── blog/
│   │       ├── BlogListSection.astro        NEW organism
│   │       ├── BlogListSection.module.scss  NEW
│   │       └── index.ts                     NEW
│   ├── header/
│   │   ├── Header.tsx                       EDIT — add blog translation key
│   │   ├── nav-links/NavLinks.tsx           EDIT — add Blog link
│   │   └── drawer/Drawer.tsx                EDIT — add Blog link
│   └── index.ts                             EDIT — re-export new components
│
└── i18n/
    └── ui.ts                                EDIT — add nav.blog + blog.* keys
```

---

## Phase 1 — Content Collection Schema

**`src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    banner: z.string(),       // URL or /public path
    description: z.string(),  // short excerpt for card
  }),
});

export const collections = { blog };
```

---

## Phase 2 — Mock Posts

3 files in `src/content/blog/`. Slug derives from filename.

**Frontmatter shape:**
```yaml
---
title: "Building with Astro 5"
date: 2025-03-10
banner: "https://images.unsplash.com/photo-..."
description: "Why I migrated my portfolio to Astro 5 and what I learned along the way."
---
```

**Posts:**

| Filename | Title | Date |
|---|---|---|
| `building-with-astro.md` | Building with Astro 5 | 2025-03-10 |
| `react-native-performance.md` | React Native Performance Tips | 2025-01-22 |
| `ai-integrations-2025.md` | Integrating AI into Web Apps | 2025-05-05 |

Each post body: 200–300 words of real placeholder content. No lorem ipsum.

---

## Phase 3 — BlogCard Component

**`src/components/cards/blog-card/BlogCard.tsx`**

```ts
interface BlogCardProps {
  slug: string;
  title: string;
  date: Date;
  banner: string;
  description: string;
  lang?: string; // for href prefix: /es/blog/slug vs /blog/slug
}
```

Structure:
```
<a href="/{lang?}blog/{slug}">
  <img src={banner} alt={title} />        // fixed height, object-fit: cover
  <div class="card-body">
    <h2>{title}</h2>
    <time>{formatted date}</time>
    <p>{description}</p>                   // CSS line-clamp: 3
  </div>
</a>
```

- Entire card is the link — no nested `<a>` tags
- Date format: `MMM DD, YYYY` (e.g. `Mar 10, 2025`) via `toLocaleDateString`
- Pure presentational, no React state
- Hover: subtle scale + shadow via SCSS transition

---

## Phase 4 — Blog List Page

**`src/pages/blog/index.astro`**

```astro
---
export const prerender = true;
import { getCollection } from 'astro:content';
import HtmlLayout from '@layouts/html/HtmlLayout.astro';
import BlogListSection from '@components/sections/blog';

const posts = (await getCollection('blog'))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<HtmlLayout title="Blog | Hector Matus" metaDescription="...">
  <BlogListSection posts={posts} lang="en" />
</HtmlLayout>
```

**`src/components/sections/blog/BlogListSection.astro`**

Receives `posts` array + `lang`. Renders:
- Section heading from i18n (`blog.title`, `blog.subtitle`)
- Responsive CSS grid of `BlogCard` (3 cols desktop → 2 tablet → 1 mobile)
- Empty state if no posts

ES mirror at `src/pages/es/blog/index.astro` — identical, passes `lang="es"`.

---

## Phase 5 — Blog Detail Page

**`src/pages/blog/[slug].astro`**

```astro
---
export const prerender = true;
import { getCollection, render } from 'astro:content';
import HtmlLayout from '@layouts/html/HtmlLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({ params: { slug: post.slug } }));
}

const { slug } = Astro.params;
const posts = await getCollection('blog');
const post = posts.find(p => p.slug === slug)!;
const { Content } = await render(post);
---

<HtmlLayout title={`${post.data.title} | Hector Matus`} metaDescription={post.data.description}>
  <article>
    <img src={post.data.banner} alt={post.data.title} />
    <header>
      <h1>{post.data.title}</h1>
      <time>{post.data.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
    </header>
    <Content />
  </article>
</HtmlLayout>
```

- Back link: `← Blog` pointing to `/blog`
- Prose styles scoped to `article` — target `h2, h3, p, ul, code, pre` in SCSS module
- ES mirror at `src/pages/es/blog/[slug].astro` with `lang="es"` date locale

---

## Phase 6 — i18n Keys

Add to both `en` and `es` in `src/i18n/ui.ts`:

```ts
// en
"nav.blog": "Blog",
"blog.title": "Blog",
"blog.subtitle": "Thoughts on software, tools, and engineering.",
"blog.back": "← Back to Blog",

// es
"nav.blog": "Blog",
"blog.title": "Blog",
"blog.subtitle": "Reflexiones sobre software, herramientas e ingeniería.",
"blog.back": "← Volver al Blog",
```

---

## Phase 7 — Navbar Update

### `Header.tsx`
Add `blog: t("nav.blog")` to `translations` object passed to `NavLinks` and `Drawer`.

### `NavLinks.tsx`
- Add `blog: string` to `translations` type
- Add `<li><a href="/blog">{translations.blog}</a></li>` — full page nav, no scroll handler

### `Drawer.tsx`
- Same addition as `NavLinks`

---

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| `getStaticPaths` + SSR adapter | HIGH | Add `export const prerender = true` on both blog pages |
| i18n for MD content | LOW | v1 scope: EN content only, ES UI chrome |
| Banner image loading | LOW | Use Unsplash URLs for mocks; swap to `/public/blog/` later |
| Slug collision across languages | LOW | Both EN + ES pages read same collection — slugs shared |

---

## Complexity

| Phase | Effort |
|---|---|
| Content schema + mock posts | ~30 min |
| BlogCard component + styles | ~45 min |
| List pages (EN + ES) | ~30 min |
| Detail pages (EN + ES) | ~45 min |
| Navbar + i18n wiring | ~20 min |
| **Total** | **~3h** |
