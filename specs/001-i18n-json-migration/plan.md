# Implementation Plan: i18n — JSON Locales, Single-URL Language Detection & Persistence

**Branch**: `fix/translations` | **Date**: 2026-06-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-i18n-json-migration/spec.md`

## Summary

Replace all translation strings from the TypeScript `ui.ts` const object with flat JSON
locale files (`en.json`, `es.json`). Remove all `/es/` and `/en/` URL-prefixed page
routes — every page has exactly one URL. Add language detection to the Astro SSR
middleware using priority: stored visitor preference (cookie) > browser `Accept-Language`
header > English default. Language preference is set and persisted when a visitor uses
the language switcher, which re-renders in place without changing the URL. Co-locate
translation key constants with each component via `.const.ts` files, replacing inline
string literals and making the key-to-component relationship traceable.

## Technical Context

**Language/Version**: TypeScript 5.9, Astro 5.3, React 19

**Primary Dependencies**: Astro middleware (`astro:middleware`), `resolveJsonModule`
(enabled via `astro/tsconfigs/strict`), `Astro.cookies` API for preference persistence

**Storage**: Static JSON files (`src/i18n/en.json`, `src/i18n/es.json`); language
preference in HTTP cookie (`lang`, 1-year expiry, SameSite=Lax)

**Testing**: `npx astro check` for TypeScript validation; manual browser validation per
`quickstart.md`

**Target Platform**: Vercel (SSR via `@astrojs/vercel`); Node adapter for local preview

**Project Type**: SSR web application (Astro + React islands)

**Performance Goals**: Detection adds <1ms per request (cookie read or header parse +
optional cookie set); no client-side hydration required for language detection

**Constraints**:
- Zero `/es/` or `/en/` URL prefixes in final state — existing `/es/` pages MUST be
  removed
- `LanguagePicker` changes from URL-navigation to cookie-set + page re-render
- Zero client-side language flash
- `npx astro check` must pass with zero errors

**Scale/Scope**: 64 translation keys × 2 locales; 9 `.const.ts` files; 3 core files
modified (`ui.ts`, `middleware.ts`, `LanguagePicker`); ~10 components updated to use
key constants; `/es/` page routes deleted (4 files)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. Component-First Architecture | `.const.ts` files co-located in component directories; `LanguagePicker` behavior change is isolated to that component | ✅ Pass |
| II. Internationalization by Default | EN + ES JSON as single source of truth; all copy in locale files; middleware enforces detection | ✅ Pass |
| III. Performance & Strategic Hydration | Detection is server-side via middleware (cookie + header); no client-side flash; zero new hydration points | ✅ Pass |
| IV. Type Safety | `resolveJsonModule` + `as const` preserves full literal-type inference; `.const.ts` keys validated at compile time | ✅ Pass |
| V. Simplicity (YAGNI) | No new dependencies; no new pages or routes (we're deleting routes); cookie is native Astro API | ✅ Pass |

**Post-design re-check**: All principles confirmed — no violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-i18n-json-migration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code Changes

```text
src/
├── i18n/
│   ├── en.json          NEW — English translations (extracted from ui.ts)
│   ├── es.json          NEW — Spanish translations (extracted from ui.ts)
│   ├── ui.ts            MODIFIED — imports JSON, re-exports same interface
│   └── utils.ts         MODIFIED — add getLangFromCookieOrRequest() helper
│
├── middleware.ts         MODIFIED — cookie read → header fallback → EN default;
│                                    no redirects, just passes lang via locals
│
└── components/
    ├── language-picker/
    │   └── LanguagePicker.tsx    MODIFIED — sets cookie + triggers reload,
    │                                         no URL navigation
    ├── header/
    │   └── Header.const.ts       NEW
    ├── carousel/
    │   └── Carousel.const.ts     NEW
    └── sections/
        ├── hero/
        │   └── HeroSection.const.ts          NEW
        ├── about-me/
        │   └── AboutMeSection.const.ts       NEW
        ├── capabilities/
        │   └── CapabilitiesSection.const.ts  NEW
        ├── projects/
        │   └── ProjectsSection.const.ts      NEW
        ├── experience/
        │   └── ExperienceSection.const.ts    NEW
        ├── form/
        │   └── FormSection.const.ts          NEW
        └── blog/
            └── BlogListSection.const.ts      NEW

pages/                   DELETED — /es/ prefixed routes removed
├── es/                  DELETED (entire directory)
│   ├── index.astro      DELETED
│   ├── blog/
│   │   ├── index.astro  DELETED
│   │   └── [slug].astro DELETED
```

**All components that call `t()` with inline string literals**: updated to use key
constants from their `.const.ts` file.

**Structure Decision**: Single Astro web application. Language is a middleware-resolved
value passed via Astro locals, not encoded in URLs.

## Complexity Tracking

> No constitution violations to justify.
