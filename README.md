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
├── assets/              # SVG icons, Lottie animation
├── components/          # Atomic design: buttons → cards → sections
│   ├── buttons/
│   ├── cards/
│   ├── sections/        # Page sections (Hero, About, Experience, etc.)
│   └── ...
├── content/
│   ├── blog/            # Markdown blog posts
│   ├── projects/        # Project catalog entries (YAML, one per project)
│   └── experience/      # Work experience entries (YAML, one per role)
├── data/                # Static data (tech stack) + i18n-data mapping helpers
├── i18n/                # Locale JSON files + translation utils
├── layouts/             # HtmlLayout, HeroLayout
├── pages/               # Astro pages + API route
├── schemas/             # Zod schemas (contact form)
├── styles/              # Global styles + theme (colors, fonts, mixins)
└── types/               # TypeScript interfaces
```

## Content Management (Pages CMS)

Projects, work experience, and blog posts are editable through [Pages CMS](https://pagescms.org) — a
no-backend, GitHub-backed CMS. It reads its config from `.pages.yml` at the repo root and edits land as
commits to this repo — no separate database, no manual redeploy step (Vercel picks up the commit like any
other push).

### Editing content

1. Go to [app.pagescms.org](https://app.pagescms.org) and sign in with GitHub (needs push access to this repo).
2. Select this repository (install the Pages CMS GitHub App on it the first time, if prompted) and pick the
   branch to edit.
3. Pick a collection:
   - **Projects** — image, tags, links (live demo / GitHub), year, role, and English/Spanish title +
     description. Each entry is its own file under `src/content/projects/`.
   - **Experience** — start/end date (or "current role"), and English/Spanish title, company, description.
     Each entry is its own file under `src/content/experience/`.
   - **Blog Posts** — title, date, banner image, description, and body. Files live under `src/content/blog/`.
     Body content is written once (not translated), same as before.
4. Create, edit, or delete entries from the UI. Both the English and Spanish fields on a Projects/Experience
   entry are edited independently — updating one language never touches the other.
5. Saving commits directly to the selected branch (`settings.merge: direct` in `.pages.yml`); merge/push to
   `main` as usual to publish.

### Changing the schema

If a field needs to be added/renamed for Projects or Experience, update **both** sides together or the CMS
and the build will disagree on the shape of an entry:
- `.pages.yml` — the field the CMS UI shows/edits
- `src/content/config.ts` — the Zod schema Astro validates that field against

See `specs/002-pages-cms-integration/` for the full design (`data-model.md`, `contracts/pages-cms-config.md`).

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
