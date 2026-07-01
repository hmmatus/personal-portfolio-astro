# Quickstart Validation Guide: i18n JSON Locales, Single-URL Detection & Persistence

**Date**: 2026-06-28
**Feature**: specs/001-i18n-json-migration

## Prerequisites

- Node.js installed, dependencies installed (`npm install`)
- Dev server running: `npm run dev` (port 4321)

---

## Validation 1 — Build passes with JSON locale files

```bash
npx astro check
```

**Expected**: Zero TypeScript errors. Any `t(KEY)` call referencing a non-existent
key surfaces here.

---

## Validation 2 — No /es/ routes exist

Navigate to `http://localhost:4321/es` and `http://localhost:4321/es/blog`.

**Expected**: 404. No language-prefixed routes exist.

---

## Validation 3 — English browser → English at single URL

1. Open Chrome DevTools → Network conditions → uncheck "Use browser default" →
   set `Accept-Language: en,en-US;q=0.9`
2. Navigate to `http://localhost:4321/blog`

**Expected**: English copy renders. URL stays `/blog`. No redirect.

---

## Validation 4 — Spanish browser → Spanish at same URL (no redirect)

1. DevTools → Network conditions → set `Accept-Language: es,es-ES;q=0.9`
2. Navigate to `http://localhost:4321/blog`

**Expected**: Spanish copy renders. URL stays `/blog`. No redirect, no URL change.

---

## Validation 5 — Regional Spanish variant detected

Set `Accept-Language: es-MX,es;q=0.9`, navigate to `http://localhost:4321/`.

**Expected**: Spanish renders. URL unchanged.

---

## Validation 6 — Unsupported browser language → English

Set `Accept-Language: fr,fr-FR;q=0.9`, navigate to `http://localhost:4321/`.

**Expected**: English renders. URL unchanged.

---

## Validation 7 — Manual language switch persists across pages

1. Clear cookies for `localhost:4321`
2. Set browser language to English (default)
3. Navigate to `http://localhost:4321/`
4. English renders
5. Use the language switcher to select Spanish
6. Page reloads in Spanish — URL stays `/`
7. Navigate to `/blog` — Spanish still shown
8. Refresh `/blog` — Spanish persists

**Expected**: Spanish across all pages and after refresh. URL never changes.

---

## Validation 8 — Cookie preference overrides browser language

1. Browser language set to English
2. Use switcher to select Spanish — cookie `lang=es` is set
3. DevTools → Application → Cookies: confirm `lang=es` exists
4. Navigate to `http://localhost:4321/` — Spanish renders (cookie beats header)

**Expected**: Spanish despite English browser language.

---

## Validation 9 — Cleared preference falls back to browser detection

1. While `lang=es` cookie is set, delete the cookie via DevTools
2. With browser language = English, reload `http://localhost:4321/`

**Expected**: English renders (browser language detection, no stored preference).

---

## Validation 10 — Zero untranslated strings in Spanish mode

With Spanish active (`lang=es` cookie or Spanish browser), visit:
- `/` — all sections
- `/blog`
- Contact form: submit with blank fields, check validation errors in Spanish

**Expected**: Zero English strings, zero raw keys visible.

---

## Validation 11 — Shared URL is language-neutral

1. Set `lang=es` cookie in Browser A
2. Copy URL `http://localhost:4321/blog`
3. Open URL in Browser B (fresh incognito, browser language = English)

**Expected**: Browser B sees English. The URL carries no language signal.

---

## Validation 12 — Invalid key caught at compile time (type safety)

1. In any `.const.ts` file, temporarily set a value to `'nav.nonexistent'`
2. Run `npx astro check`

**Expected**: TypeScript error — key not assignable to locale key union.

3. Revert.

---

## Validation 13 — Missing key caught across locales

1. Add a key to `en.json` only (not `es.json`)
2. Run `npx astro check`

**Expected**: TypeScript shape mismatch error in `ui.ts`.

3. Revert.
