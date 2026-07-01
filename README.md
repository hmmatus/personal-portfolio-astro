# Personal Portfolio

Personal portfolio site for Hector Matus — full stack developer from El Salvador. Built with Astro 5 SSR and React 19 islands, deployed to Vercel.

## Tech Stack

- **Astro 5** — SSR framework, page routing, content collections
- **React 19** — interactive islands (`client:load` / `client:visible`)
- **Tailwind CSS v4** — utility classes
- **SCSS Modules** — scoped per-component styles
- **Resend** — transactional email for contact form
- **Vercel** — hosting + analytics

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — Hero, About, Experience, Projects, Capabilities, Blog preview, Contact form |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog post |
| `/api/send-email` | POST endpoint — contact form email via Resend |

## Sections (Home Page)

1. **Hero** — animated Lottie intro with CTA
2. **About Me** — bio and role summary
3. **Experience** — carousel of work history cards
4. **Projects** — carousel of featured projects
5. **Capabilities** — tech skills overview
6. **Blog** — latest post previews
7. **Contact / Form** — react-hook-form + zod validated form, sends email via Resend

## i18n

- Languages: English (`en`) and Spanish (`es`)
- Single URL — no `/en/` or `/es/` prefixes
- Language resolved per request: `lang` cookie → `Accept-Language` header → `en` default
- Locale strings in `src/i18n/en.json` and `src/i18n/es.json`
- Language switcher sets cookie + reloads page

## Project Structure

```
src/
├── assets/          # SVG icons, Lottie animation
├── components/      # Atomic design: buttons → cards → sections
│   ├── buttons/
│   ├── cards/
│   ├── sections/    # Page sections (Hero, About, Experience, etc.)
│   └── ...
├── content/blog/    # Markdown blog posts
├── data/            # Static data (hero, tech stack)
├── i18n/            # Locale JSON files + translation utils
├── layouts/         # HtmlLayout, HeroLayout
├── pages/           # Astro pages + API route
├── schemas/         # Zod schemas (contact form)
├── styles/          # Global styles + theme (colors, fonts, mixins)
└── types/           # TypeScript interfaces
```

## Getting Started

### Prerequisites

Node.js 18+.

### Environment Variables

Create a `.env` file at the project root:

```env
RESEND_TOKEN=your_resend_api_key
RESEND_FROM_EMAIL=your_sender@email.com
```

Get a free API key at [resend.com](https://resend.com).

### Install

```sh
npm install
```

### Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build:node` | Build for Node.js (local preview) |
| `npm run preview` | Preview Node build locally |
| `npx astro check` | TypeScript type check |

## Deployment

Deployed to Vercel automatically on push to `main`. The Vercel adapter is used by default; pass `--node` to the build command to switch to the Node.js standalone adapter for self-hosting.
