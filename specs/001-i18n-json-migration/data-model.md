# Data Model: i18n JSON Locales, Single-URL Detection & Persistence

**Date**: 2026-06-28
**Feature**: specs/001-i18n-json-migration

---

## Locale File Schema

Two JSON files hold all user-facing strings. Both MUST have identical key sets.

**Location**: `src/i18n/en.json` and `src/i18n/es.json`

**Structure**: Flat key-value object. No nesting. All keys use dot notation for namespace.

```json
{
  "nav.home": "Home",
  "nav.about": "About",
  "hero.seo.title": "Building Software That Scales and Integrates with AI",
  "form.validation.name.required": "Name is required"
}
```

**Key invariant**: Every key in `en.json` MUST exist in `es.json` and vice versa.
A missing key in either file causes a TypeScript type mismatch in `ui.ts` (`as const`
wraps both), caught by `npx astro check` before deployment.

---

## Key Naming Convention

Format: `<namespace>.<identifier>[.<sub-identifier>]`

| Segment | Rule |
|---------|------|
| namespace | Lowercase, matches section/domain: `nav`, `hero`, `about`, `form`, `toast`, `projects`, `experience`, `capabilities`, `carousel`, `blog`, `common` |
| identifier | Lowercase, hyphenated for multi-word: `seo`, `live-demo`, `download-cv` |
| sub-identifier | Optional third level: `form.validation.name.required` |

**Current namespace → key count**:

| Namespace | Count |
|-----------|-------|
| `nav` | 5 |
| `hero.seo` | 3 |
| `about` | 3 |
| `blog` | 3 |
| `form` | 11 |
| `form.validation` | 10 |
| `toast.form` | 3 |
| `projects` | 10 |
| `capabilities` | 1 |
| `carousel` | 3 |
| `experience` | 10 |
| `common` | 2 |
| **Total** | **64** |

---

## Updated `ui.ts` Wrapper

```typescript
// src/i18n/ui.ts
import enTranslations from './en.json';
import esTranslations from './es.json';

export const languages = { en: "English", es: "Español" };
export const defaultLang = "en";
export const showDefaultLang = false;

export const ui = {
  en: enTranslations,
  es: esTranslations,
} as const;
```

All downstream code (`utils.ts`, components) is unchanged — same exports, same types.

---

## Astro Locals Extension

```typescript
// src/env.d.ts (add to existing file)
declare namespace App {
  interface Locals {
    lang: 'en' | 'es';
  }
}
```

---

## Language Detection & Persistence Flow

```
HTTP Request
    │
    ▼
Middleware (src/middleware.ts)
    │
    ├─ 1. Read cookie 'lang'
    │      ├─ Valid ('en' | 'es') → use it
    │      └─ Missing/invalid → step 2
    │
    ├─ 2. Parse Accept-Language header
    │      ├─ First supported base code ('en' | 'es') → use it
    │      └─ None matched → step 3
    │
    └─ 3. Default → 'en'
    │
    ▼
context.locals.lang = resolved value
    │
    ▼
Page/Layout reads Astro.locals.lang
    │
    ├─ Passes as prop to React islands (currentLang)
    └─ Calls useTranslations(lang) for Astro templates
```

**Cookie spec**:

| Attribute | Value |
|-----------|-------|
| Name | `lang` |
| Values | `en` \| `es` |
| Max-Age | 31 536 000 (1 year in seconds) |
| SameSite | `Lax` |
| Path | `/` |
| Secure | set in production (Vercel serves HTTPS) |

---

## Language Switcher Behavior Change

| | Before | After |
|---|--------|-------|
| On select | `window.location.href = '/es/...'` | `document.cookie = 'lang=es; ...'` then `location.reload()` |
| URL | Changes to `/es/blog` | Stays `/blog` |
| Persistence | None (URL-driven only) | Cookie survives sessions |

---

## `.const.ts` File Pattern

**Location**: Same directory as the component.
**Naming**: `<ComponentName>.const.ts`

```typescript
// src/components/header/Header.const.ts
export const HEADER_I18N_KEYS = {
  NAV_HOME:    'nav.home',
  NAV_ABOUT:   'nav.about',
  NAV_CONTACT: 'nav.contact',
  NAV_BLOG:    'nav.blog',
} as const;
```

**Usage**:
```typescript
// Header.tsx
import { HEADER_I18N_KEYS } from './Header.const';
const home = t(HEADER_I18N_KEYS.NAV_HOME); // was: t('nav.home')
```

**`as const` is required** — narrows value types from `string` to the literal
(e.g., `'nav.home'`), which `t()`'s parameter type checks against the locale file keys.

---

## Component-to-Key Registry

| Component | `.const.ts` | Keys declared |
|-----------|-------------|---------------|
| `header/Header.tsx` | `Header.const.ts` | `nav.home`, `nav.about`, `nav.contact`, `nav.blog` |
| `sections/hero/HeroSection.astro` | `HeroSection.const.ts` | `hero.seo.title`, `hero.seo.subtitle`, `hero.seo.cta` |
| `sections/about-me/AboutMeSection.astro` | `AboutMeSection.const.ts` | `about.title`, `about.label`, `about.description` |
| `sections/capabilities/CapabilitiesSection.astro` | `CapabilitiesSection.const.ts` | `capabilities.title` |
| `sections/projects/ProjectsSection.astro` | `ProjectsSection.const.ts` | `projects.title`, `projects.description` |
| `sections/experience/ExperienceSection.astro` | `ExperienceSection.const.ts` | `experience.title` |
| `sections/form/FormSection.tsx` | `FormSection.const.ts` | `form.*` (11), `toast.form.*` (3) |
| `sections/blog/BlogListSection.astro` | `BlogListSection.const.ts` | `blog.title`, `blog.subtitle`, `blog.back` |
| `carousel/Carousel.tsx` | `Carousel.const.ts` | `carousel.prev`, `carousel.next`, `carousel.slideOf` |

Subcomponents receiving translated strings as props — NO `.const.ts` needed:
`NavLinks.tsx`, `Drawer.tsx`, `ExperienceCarousel.tsx`, `ProjectsCarousel.tsx`

---

## Routes to Delete

| File | Reason |
|------|--------|
| `src/pages/es/index.astro` | Single-URL arch: `/` serves both languages |
| `src/pages/es/blog/index.astro` | `/blog` serves both languages |
| `src/pages/es/blog/[slug].astro` | `/blog/[slug]` serves both languages |
