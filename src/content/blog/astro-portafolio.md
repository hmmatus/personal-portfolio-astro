---
title: "Building with Astro: Why I Rebuilt My Portfolio"
date: 2026-06-30
banner: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80"
description: "Why I migrated my portfolio to Astro 5 and what I learned about islands architecture, SSR, and content collections along the way."
---

When I started rebuilding my portfolio, I had one goal: ship something fast. Not fast to build — fast to load. After years of working with React-heavy SPAs, I wanted to explore what a content-first framework could do.

## Why Astro

Astro's islands architecture clicked immediately. The idea is simple: ship zero JavaScript by default, then opt into interactivity only where you need it. For a portfolio site, that's maybe 10% of the page. The other 90% is just HTML and CSS — and Astro handles that beautifully.

The `client:visible` directive changed how I thought about hydration. Instead of loading every component upfront, components only hydrate when they scroll into view. The carousel sections on my site dropped from 120kb to 18kb of JavaScript.

## Content Collections

Astro 5 introduced a stable Content Collections API that I used for this blog. You define a Zod schema, and every markdown file gets validated at build time. No runtime surprises — if the frontmatter is wrong, the build fails. That kind of early feedback is exactly what I want in a personal project.

```ts
const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    banner: z.string(),
    description: z.string(),
  }),
});
```

## SSR + Vercel

Running `output: 'server'` with the Vercel adapter means I can have dynamic routes without a CDN rebuild cycle. Blog posts are prerendered at build time, but future features like contact form endpoints or analytics routes run server-side. Best of both worlds.

If you're building a personal site or small product site, Astro is worth the 30-minute investment to understand the mental model. The performance defaults alone are worth it.
