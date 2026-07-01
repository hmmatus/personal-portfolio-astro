# Research: i18n JSON Locales, Single-URL Detection & Persistence

**Date**: 2026-06-28
**Feature**: specs/001-i18n-json-migration/spec.md

---

## 1. JSON locale files in TypeScript / Astro

**Decision**: Keep `src/i18n/ui.ts` as a thin wrapper that imports EN and ES JSON files
and re-exports them under the same `ui` object structure. Preserves the existing
type-checking in `useTranslations` without any changes to the utility layer.

**Rationale**: Astro's base tsconfig (`astro/tsconfigs/strict`) enables `resolveJsonModule`
by default. TypeScript infers the JSON shape at compile time, so `ui[lang][key]`
type-checking continues to work. Wrapping in `as const` ensures full literal-type
inference. The `useTranslations` signature in `utils.ts` stays unchanged.

**Alternatives considered**:
- Move all translation logic directly into JSON + runtime import — removes `useTranslations`
  type safety; rejected.
- Code-generate TypeScript types from JSON — adds build complexity with no benefit over
  the wrapper approach; rejected.

---

## 2. Single-URL routing — no /es/ or /en/ prefix

**Decision**: Delete all `/es/` page routes entirely. Language is NOT encoded in URLs.
Every page (`/`, `/blog`, `/blog/[slug]`) serves any language based solely on the
visitor's resolved language preference.

**Rationale**: FR-001 is an absolute constraint — zero prefixed URLs. URL-based routing
is the current architecture but is fundamentally incompatible with the desired behavior.
Astro SSR can pass a resolved language value via `Astro.locals` to all pages and
components, so separate page files per language are unnecessary.

**Migration**: 4 files deleted from `src/pages/es/`. `Astro.locals.lang` replaces
`getLangFromUrl(Astro.url)` everywhere.

**Alternatives considered**:
- Keep `/es/` routes, add auto-redirect for Spanish browsers — rejected; this is exactly
  what spec 002 superseded. URLs must not carry language signal.
- Astro i18n routing (built-in) — also URL-based; same problem; rejected.

---

## 3. Language detection priority and Astro locals

**Decision**: Middleware resolves language once per request and stores it in
`Astro.locals.lang`. Detection order: (1) `lang` cookie, (2) `Accept-Language` header
first supported code, (3) `"en"` default. No redirects issued — language is resolved
server-side and passed transparently to all rendering code.

**Rationale**: Resolving in middleware means zero client-side work. Passing via locals
avoids re-detecting on every component. No redirects means URLs stay clean (FR-001,
FR-002).

**Algorithm**:
```
function resolveLanguage(request, cookies):
  cookie = cookies.get('lang')?.value
  if cookie in ['en', 'es']: return cookie

  acceptLang = request.headers.get('Accept-Language') ?? ''
  for tag in acceptLang.split(','):
    base = tag.split(';')[0].trim().split('-')[0].toLowerCase()
    if base in ['en', 'es']: return base

  return 'en'
```

**Alternatives considered**:
- Resolve language per component via a helper — defeats the "zero flash" requirement
  since React islands run client-side; rejected.
- IP-based geolocation — unreliable for language preference (many Spanish speakers use
  English browsers); rejected.

---

## 4. Language preference persistence via cookie

**Decision**: When a visitor selects a language via the `LanguagePicker`, the component
sets a `lang` cookie (`SameSite=Lax`, 1-year expiry, no HttpOnly so the client can read
it if needed) and triggers a full page reload. On subsequent requests, the middleware
reads the cookie in step 1 of the detection algorithm, honoring the explicit choice.

**Rationale**: Cookie is the standard mechanism for persisting functional preferences
across sessions in SSR apps. Astro provides `Astro.cookies` server-side and the standard
`document.cookie` API client-side. A full page reload after setting the cookie is the
simplest way to re-render with the new language without adding client-side state
management. `localStorage` was considered but requires JS to be available before the
server can use the value — incompatible with SSR-first detection.

**`LanguagePicker` behavior change**:
- Before: `window.location.href = newPath` (navigates to `/es/...` URL)
- After: `document.cookie = 'lang=es; max-age=...'; window.location.reload()`

**Alternatives considered**:
- `localStorage` — not readable server-side; requires client JS before detection; rejected.
- Session storage — does not persist across sessions; rejected (FR-004).
- URL query parameter (`?lang=es`) — pollutes URLs, shareable (wrong — FR-006 says URLs
  must be language-neutral); rejected.

---

## 5. Component-level key constants pattern (`.const.ts` files)

**Decision**: Each component that calls `t(...)` declares its i18n keys in a co-located
`ComponentName.const.ts` file with `as const`. Components import and use these constants
instead of inline string literals.

```typescript
// src/components/header/Header.const.ts
export const HEADER_I18N_KEYS = {
  NAV_HOME:    'nav.home',
  NAV_ABOUT:   'nav.about',
  NAV_CONTACT: 'nav.contact',
  NAV_BLOG:    'nav.blog',
} as const;
```

**Rationale**: (a) TypeScript validates the key exists at compile time. (b) Finding all
keys used by a component is a single file read. (c) Renaming a key surfaces all affected
components immediately via TS errors. Meets FR-009 traceability requirement.

**Alternatives considered**:
- Inline string literals (current) — scattered, not traceable; rejected.
- Central barrel of all keys — loses per-component traceability; rejected.

---

## 6. Astro locals TypeScript typing

**Decision**: Extend `App.Locals` in `src/env.d.ts` (or `src/types/astro.d.ts`) to
declare `lang: 'en' | 'es'`. This gives full type safety when reading
`Astro.locals.lang` in `.astro` files and layouts.

```typescript
// src/env.d.ts
declare namespace App {
  interface Locals {
    lang: 'en' | 'es';
  }
}
```

**Rationale**: Without this, `Astro.locals.lang` is typed as `unknown`, causing type
errors throughout. One-line addition to the existing env declaration file.

---

## 7. Components requiring `.const.ts` files

| Component | Keys used |
|-----------|-----------|
| `Header.tsx` | `nav.*` (4 keys) |
| `HeroSection.astro` | `hero.seo.*` (3 keys) |
| `AboutMeSection.astro` | `about.*` (3 keys) |
| `CapabilitiesSection.astro` | `capabilities.title` (1 key) |
| `ProjectsSection.astro` | `projects.title`, `projects.description` (2 keys) |
| `ExperienceSection.astro` | `experience.title` (1 key) |
| `FormSection.tsx` | `form.*` (11 keys) + `toast.form.*` (3 keys) |
| `BlogListSection.astro` | `blog.*` (3 keys) |
| `Carousel.tsx` | `carousel.*` (3 keys) |

Subcomponents that receive translated strings as props (`NavLinks`, `Drawer`,
`ExperienceCarousel`, `ProjectsCarousel`) do NOT need `.const.ts` files.

---

## 8. Passing lang to React islands after middleware change

**Decision**: Layouts read `lang` from `Astro.locals.lang` and pass it as a `currentLang`
prop to all React islands that need it (same pattern as today, but source changes from
`getLangFromUrl` to `Astro.locals.lang`).

**Rationale**: React islands are hydrated on the client and cannot access Astro locals
at runtime. Passing as a prop at render time (SSR) bakes the correct language into the
hydrated component. This is the exact same mechanism currently used — only the source of
the lang value changes.
