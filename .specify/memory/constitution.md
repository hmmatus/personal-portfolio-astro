<!--
SYNC IMPACT REPORT
==================
Version change: [TEMPLATE] → 1.0.0
Status: Initial ratification — all placeholders replaced

Modified principles:
  - [PRINCIPLE_1_NAME] → I. Component-First Architecture
  - [PRINCIPLE_2_NAME] → II. Internationalization by Default
  - [PRINCIPLE_3_NAME] → III. Performance & Strategic Hydration
  - [PRINCIPLE_4_NAME] → IV. Type Safety
  - [PRINCIPLE_5_NAME] → V. Simplicity (YAGNI)

Added sections:
  - Technology Stack & Constraints
  - Development Workflow

Removed sections: none

Templates:
  ✅ .specify/templates/plan-template.md — Constitution Check section present; gates are generic and remain valid
  ✅ .specify/templates/spec-template.md — no constitution-specific references; no update needed
  ✅ .specify/templates/tasks-template.md — task categories align with principles; no update needed

Follow-up TODOs: none — all fields resolved from repo context
-->

# Personal Portfolio (Astro) Constitution

## Core Principles

### I. Component-First Architecture

Every UI feature MUST be built following atomic design: atoms (buttons, inputs) → molecules
(cards, form groups) → organisms (page sections). Each component MUST live in its own
directory under `src/components/` and include:
- A `ComponentName.tsx` (React island) or `ComponentName.astro` file
- A `ComponentName.module.scss` for scoped styles
- An `index.ts` re-export

No component logic may be co-located in page files. The barrel export
`src/components/index.ts` MUST be kept current. React is used for interactive islands;
Astro components are used for static markup.

### II. Internationalization by Default

All user-facing copy MUST live in `src/i18n/ui.ts` as flat key-value maps per locale.
Hardcoded strings in components are PROHIBITED. English is the default locale (no URL
prefix); Spanish uses the `/es` prefix. Middleware (`src/middleware.ts`) handles unknown
locale redirects. Translation helpers (`getLangFromUrl`, `useTranslations`,
`useTranslatedPath`) from `src/i18n/utils.ts` MUST be used in all components that render
copy.

### III. Performance & Strategic Hydration

Astro SSR MUST be the default rendering mode — no unnecessary client-side JavaScript.
Hydration directives MUST be applied deliberately:
- `client:load` — critical interactive components visible on initial paint
- `client:visible` — below-fold components (lazy hydration for performance)

Images MUST be optimized. Lighthouse performance, SEO, and accessibility scores MUST
remain high (target 90+). No third-party scripts without explicit performance justification.

### IV. Type Safety

TypeScript strict mode is non-negotiable. All component props MUST have defined interfaces
using the `I` suffix convention (e.g., `ExperienceI`). Props interfaces MUST extend the
relevant HTML element types where applicable. Path aliases defined in `tsconfig.json`
(`@components`, `@assets`, `@layouts`, etc.) MUST be used instead of relative imports
that cross directory boundaries. `npx astro check` MUST pass with zero errors before
any merge.

### V. Simplicity (YAGNI)

No feature, abstraction, or dependency may be added beyond what the current task
requires. Three similar lines of code are preferable to a premature abstraction. Complexity
MUST be explicitly justified in the PR description. No half-finished implementations. No
backwards-compatibility shims for code that has been removed.

## Technology Stack & Constraints

- **Framework**: Astro 5 SSR deployed to Vercel (`@astrojs/vercel` adapter); Node adapter
  (`@astrojs/node`) used for local preview builds
- **UI layer**: React 19 islands + Astro components
- **Styling**: Tailwind CSS v4 (utility classes via `@tailwindcss/vite`) + SCSS modules
  (`.module.scss`) per component for scoped styles; theme variables in `src/styles/theme/`
- **Forms**: `react-hook-form` + `zod` (schema in `src/schemas/`) + Resend for email
  delivery
- **Icons/SVG**: Imported as React components via `?react` query (`vite-plugin-svgr`)
- **No test runner configured** — TypeScript validation via `npx astro check` is the
  primary quality gate; manual browser validation required for UI changes
- **Analytics**: `@vercel/analytics` — MUST remain active in production builds

## Development Workflow

- Branch naming MUST follow: `feat/`, `fix/`, `docs/`, `chore/` prefixes
- `npx astro check` MUST pass before any PR is merged
- Vercel deploys automatically on `main` branch push — no manual deploy step needed
- Local dev: `npm run dev` (port 4321)
- Local preview of production build: `npm run build:node && npm run preview`
- UI changes MUST be manually tested in the browser (golden path + edge cases) before
  marking work complete — type checking does not substitute for feature verification

## Governance

This constitution supersedes all other informal practices for this project. Amendments
MUST:
1. Increment the version number following semantic versioning (MAJOR: breaking principle
   change; MINOR: new principle or section; PATCH: clarification or wording fix)
2. Update `LAST_AMENDED_DATE` to the amendment date
3. Record the change in the Sync Impact Report comment at the top of this file

All PRs and code reviews MUST verify compliance with Core Principles. `CLAUDE.md` serves
as the primary runtime development guidance and is the authoritative source for commands,
architecture details, and project conventions.

**Version**: 1.0.0 | **Ratified**: 2026-06-28 | **Last Amended**: 2026-06-28
