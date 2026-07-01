---
description: "Task list for i18n JSON Locales, Single-URL Language Detection & Persistence"
---

# Tasks: i18n — JSON Locales, Single-URL Language Detection & Persistence

**Input**: Design documents from `specs/001-i18n-json-migration/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: No test runner configured — validation via `npx astro check` + manual browser
testing per quickstart.md.

**Organization**: Tasks grouped by user story. US1 and US2 share Phase 3 (both resolved
in middleware). US3 (LanguagePicker) enables US2 persistence by setting the cookie.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no shared state)
- **[Story]**: User story from spec.md (US1–US4)
- Exact file paths in all descriptions

---

## Phase 1: Setup

**Purpose**: Extract translation data and create locale files. Blocking — all phases depend on JSON files.

- [X] T001 [P] Create `src/i18n/en.json` — copy all English key-value pairs from `src/i18n/ui.ts` (en object); add keys: `page.home.title`, `page.home.meta`, `page.blog.title`, `page.blog.meta`, `blog.empty`
- [X] T002 [P] Create `src/i18n/es.json` — copy all Spanish key-value pairs from `src/i18n/ui.ts` (es object); add same 5 new keys in Spanish

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required before any user story can be implemented.

**⚠️ CRITICAL**: All Phase 3+ work blocked until this phase is complete.

- [X] T003 Update `src/i18n/ui.ts` — replace inline const object with JSON imports: `import enTranslations from './en.json'` and `import esTranslations from './es.json'`; keep all existing exports (`languages`, `defaultLang`, `showDefaultLang`, `ui`) unchanged
- [X] T004 Extend `src/env.d.ts` — add `App.Locals` interface with `lang: 'en' | 'es'` so `Astro.locals.lang` is type-safe throughout all `.astro` files
- [X] T005 Run `npx astro check` — confirm zero TypeScript errors after JSON import and locals typing

**Checkpoint**: Foundation ready — JSON locale files loaded, types extended, build green.

---

## Phase 3: US1 & US2 — Single-URL Browser Detection & Cookie Persistence (P1 + P2)

**Goal**: Every page served from one URL. Language resolved from cookie (stored preference)
then `Accept-Language` header then EN default. No redirects. No /es/ routes.

**Independent Test**: Visit `http://localhost:4321/blog` with Spanish-configured browser
(DevTools → Network conditions → `Accept-Language: es`) — Spanish renders, URL stays
`/blog`. Set `lang=es` cookie, switch browser to English, reload — Spanish persists.
Open `/es` → 404.

- [X] T006 [US1] Rewrite `src/middleware.ts` — remove redirect logic; add language resolution: (1) read `lang` cookie, validate against `['en','es']`; (2) parse first tag of `Accept-Language` header, extract base code, match against `['en','es']`; (3) default `'en'`; set `context.locals.lang` to resolved value; always call `next()`
- [X] T007 [P] [US1] Update `src/layouts/hero/HeroLayout.astro` — replace `getLangFromUrl(Astro.url)` with `Astro.locals.lang`; remove unused `getLangFromUrl` import
- [X] T008 [P] [US1] Update `src/components/sections/hero/HeroSection.astro` — replace `getLangFromUrl(Astro.url)` with `Astro.locals.lang`; remove unused import
- [X] T009 [P] [US1] Update `src/components/sections/about-me/AboutMeSection.astro` — replace `getLangFromUrl(Astro.url)` with `Astro.locals.lang`; remove unused import
- [X] T010 [P] [US1] Update `src/components/sections/capabilities/CapabilitiesSection.astro` — replace `getLangFromUrl(Astro.url)` with `Astro.locals.lang`; remove unused import
- [X] T011 [P] [US1] Update `src/components/sections/projects/ProjectsSection.astro` — replace `getLangFromUrl(Astro.url)` with `Astro.locals.lang`; remove unused import
- [X] T012 [P] [US1] Update `src/components/sections/experience/ExperienceSection.astro` — replace `getLangFromUrl(Astro.url)` with `Astro.locals.lang`; remove unused import
- [X] T013 [P] [US1] Update `src/pages/index.astro` — remove hardcoded EN title/meta; read `Astro.locals.lang`; pass i18n keys `page.home.title` and `page.home.meta` to `HtmlLayout` using `useTranslations(lang)`
- [X] T014 [P] [US1] Update `src/pages/blog/index.astro` — remove `export const prerender = true` (must be SSR for middleware); remove hardcoded `lang="en"` on `BlogListSection`; read `Astro.locals.lang`; pass lang to `BlogListSection` for UI chrome only (heading, subtitle, empty state — NOT post card content, which renders as authored); use i18n keys for page `title` and `metaDescription`
- [X] T015 [P] [US1] Update `src/pages/blog/[slug].astro` — remove `export const prerender = true` if present (SSR so middleware runs and nav chrome can use user's lang); read `Astro.locals.lang`; pass lang to layout/Header for navigation only; blog post body content renders directly from the markdown file as-is — no translation applied, no `t()` calls on post content
- [X] T016 [US1] Delete `src/pages/es/` directory — removes `src/pages/es/index.astro`, `src/pages/es/blog/index.astro`, `src/pages/es/blog/[slug].astro` (3 files)
- [X] T017 [US1] Run `npx astro check` and start dev server — confirm `/es` returns 404, `/blog` serves correct language based on `Accept-Language` header, no TypeScript errors

**Checkpoint**: US1 + US2 complete — single-URL detection working, stored cookie honored, /es/ routes gone.

---

## Phase 4: US3 — Language Switcher Without URL Change (P3)

**Goal**: Visitor can change language via the switcher. Page re-renders in selected language.
URL stays the same. Preference saved for future sessions.

**Independent Test**: On `/blog`, use the language switcher to select Spanish — URL stays
`/blog`, copy changes to Spanish. Refresh — Spanish persists. Navigate to `/` — Spanish
shown. Share `/blog` URL in incognito with English browser — English shown.

- [X] T018 [US3] Update `src/components/language-picker/LanguagePicker.tsx` — replace `handleLanguageChange` implementation: on select, set `document.cookie = \`lang=\${newLang}; path=/; max-age=31536000; samesite=lax\`` then call `window.location.reload()`; remove all URL path construction logic and `currentPath` usage; update `LanguagePickerProps` if `currentPath` is no longer needed

**Checkpoint**: US3 complete — switcher sets cookie and reloads, URL unchanged.

---

## Phase 5: US4 — Key Constants & Component Updates (P4)

**Goal**: Every component that calls `t()` references named key constants from a co-located
`.const.ts` file. No inline string literals remain. Missing keys caught at compile time.

**Independent Test**: Run `npx astro check` — zero errors. Temporarily set any const value
to `'nav.nonexistent'` — TypeScript error appears. Revert.

### Phase 5a: Create `.const.ts` files (all parallel after Phase 2)

- [X] T019 [P] [US4] Create `src/components/header/Header.const.ts` — export `HEADER_I18N_KEYS` with `as const`: keys `nav.home`, `nav.about`, `nav.contact`, `nav.blog`
- [X] T020 [P] [US4] Create `src/components/sections/hero/HeroSection.const.ts` — export `HERO_I18N_KEYS` with `as const`: keys `hero.seo.title`, `hero.seo.subtitle`, `hero.seo.cta`
- [X] T021 [P] [US4] Create `src/components/sections/about-me/AboutMeSection.const.ts` — export `ABOUT_I18N_KEYS` with `as const`: keys `about.title`, `about.label`, `about.description`
- [X] T022 [P] [US4] Create `src/components/sections/capabilities/CapabilitiesSection.const.ts` — export `CAPABILITIES_I18N_KEYS` with `as const`: key `capabilities.title`
- [X] T023 [P] [US4] Create `src/components/sections/projects/ProjectsSection.const.ts` — export `PROJECTS_I18N_KEYS` with `as const`: keys `projects.title`, `projects.description`
- [X] T024 [P] [US4] Create `src/components/sections/experience/ExperienceSection.const.ts` — export `EXPERIENCE_I18N_KEYS` with `as const`: key `experience.title`
- [X] T025 [P] [US4] Create `src/components/sections/experience/ExperienceCarousel.const.ts` — export `EXPERIENCE_CAROUSEL_I18N_KEYS` with `as const`: keys `experience.title`, `carousel.prev`, `carousel.next`, `carousel.slideOf`
- [X] T026 [P] [US4] Create `src/components/sections/projects/ProjectsCarousel.const.ts` — export `PROJECTS_CAROUSEL_I18N_KEYS` with `as const`: inspect `src/components/sections/projects/ProjectsCarousel.tsx` for all `t("...")` calls and declare those keys
- [X] T027 [P] [US4] Create `src/components/sections/form/FormSection.const.ts` — export `FORM_I18N_KEYS` with `as const`: all `form.*` keys (11) and `toast.form.*` keys (3) used in `FormSection.tsx`
- [X] T028 [P] [US4] Create `src/components/sections/blog/BlogListSection.const.ts` — export `BLOG_I18N_KEYS` with `as const`: keys `blog.title`, `blog.subtitle`, `blog.empty`

### Phase 5b: Update components to use key constants (parallel after 5a)

- [X] T029 [P] [US4] Update `src/components/header/Header.tsx` — import `HEADER_I18N_KEYS`; replace all `t("nav.home")` etc. with `t(HEADER_I18N_KEYS.NAV_HOME)` etc.
- [X] T030 [P] [US4] Update `src/components/sections/hero/HeroSection.astro` — import `HERO_I18N_KEYS`; replace inline key strings with constants
- [X] T031 [P] [US4] Update `src/components/sections/about-me/AboutMeSection.astro` — import `ABOUT_I18N_KEYS`; replace inline key strings with constants
- [X] T032 [P] [US4] Update `src/components/sections/capabilities/CapabilitiesSection.astro` — import `CAPABILITIES_I18N_KEYS`; replace inline key string with constant
- [X] T033 [P] [US4] Update `src/components/sections/projects/ProjectsSection.astro` — import `PROJECTS_I18N_KEYS`; replace inline key strings with constants
- [X] T034 [P] [US4] Update `src/components/sections/experience/ExperienceSection.astro` — import `EXPERIENCE_I18N_KEYS`; replace inline key string with constant
- [X] T035 [P] [US4] Update `src/components/sections/experience/ExperienceCarousel.tsx` — import `EXPERIENCE_CAROUSEL_I18N_KEYS`; replace all `t("carousel.*")` and `t("experience.title")` calls with constants
- [X] T036 [P] [US4] Update `src/components/sections/projects/ProjectsCarousel.tsx` — import `PROJECTS_CAROUSEL_I18N_KEYS`; replace all inline `t("...")` calls with constants
- [X] T037 [P] [US4] Update `src/components/sections/form/FormSection.tsx` — import `FORM_I18N_KEYS`; replace all 14 inline `t("form.*")` and `t("toast.form.*")` calls with constants
- [X] T038 [P] [US4] Update `src/components/sections/blog/BlogListSection.astro` — import `BLOG_I18N_KEYS`; replace inline key strings with constants; replace hardcoded `"No posts yet. Check back soon."` with `t(BLOG_I18N_KEYS.EMPTY)`
- [X] T039 [US4] Run `npx astro check` — confirm all key constant types are valid (no `string` widening, all keys resolve to correct literal types)

**Checkpoint**: US4 complete — `npx astro check` passes, all inline key strings gone.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T040 Scan codebase for remaining `getLangFromUrl` calls — `grep -r "getLangFromUrl" src/` — update any remaining callers to use `Astro.locals.lang` or remove if unused; update `src/i18n/utils.ts` to mark `getLangFromUrl` as deprecated or remove if no callers remain
- [X] T041 [P] Update `CLAUDE.md` — revise "Routing & i18n" section: replace description of URL-based lang detection with middleware cookie/header approach; note that all copy lives in `src/i18n/en.json` and `src/i18n/es.json`; note `.const.ts` pattern
- [X] T042 Run full browser validation per `specs/001-i18n-json-migration/quickstart.md` — complete all 13 validation scenarios; document any failures

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — T001 and T002 run in parallel immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **US1+US2 (Phase 3)**: Depends on Phase 2; T007–T016 run in parallel after T006
- **US3 (Phase 4)**: Depends on Phase 3 (middleware must resolve lang before cookie is useful)
- **US4 Phase 5a (Phase 5a)**: Can start as soon as Phase 2 is complete — runs in parallel with Phase 3
- **US4 Phase 5b (Phase 5b)**: Depends on Phase 5a completion for each component's `.const.ts`
- **Polish (Phase 6)**: Depends on all user story phases complete

### User Story Dependencies

- **US1 (P1)**: Starts after Foundation (Phase 2)
- **US2 (P2)**: Completed by US1 middleware (cookie read) + US3 LanguagePicker (cookie set)
- **US3 (P3)**: Starts after US1 — middleware must be in place for cookie to be honored
- **US4 (P4)**: Phase 5a starts after Foundation (Phase 2); Phase 5b starts after Phase 5a

### Critical Path

```
T001+T002 (parallel)
    → T003 → T004 → T005
        → T006 → T007–T016 (parallel) → T017
            → T018
        → T019–T028 (parallel, Phase 5a)
            → T029–T038 (parallel, Phase 5b) → T039
    → T040 → T041 → T042
```

---

## Parallel Execution Example: Phase 3 (after T006)

```bash
# All can run simultaneously after middleware (T006) is complete:
Task: T007 — HeroLayout.astro locals update
Task: T008 — HeroSection.astro locals update
Task: T009 — AboutMeSection.astro locals update
Task: T010 — CapabilitiesSection.astro locals update
Task: T011 — ProjectsSection.astro locals update
Task: T012 — ExperienceSection.astro locals update
Task: T013 — pages/index.astro update
Task: T014 — pages/blog/index.astro update
Task: T015 — pages/blog/[slug].astro update
```

## Parallel Execution Example: Phase 5a

```bash
# All .const.ts files can be created simultaneously:
Task: T019 — Header.const.ts
Task: T020 — HeroSection.const.ts
Task: T021 — AboutMeSection.const.ts
Task: T022 — CapabilitiesSection.const.ts
Task: T023 — ProjectsSection.const.ts
Task: T024 — ExperienceSection.const.ts
Task: T025 — ExperienceCarousel.const.ts
Task: T026 — ProjectsCarousel.const.ts
Task: T027 — FormSection.const.ts
Task: T028 — BlogListSection.const.ts
```

---

## Implementation Strategy

### MVP First (US1 — Single-URL Detection)

1. Complete Phase 1: Create JSON files (T001–T002)
2. Complete Phase 2: Foundation (T003–T005)
3. Complete Phase 3: US1+US2 middleware + locals (T006–T017)
4. **STOP and VALIDATE**: `npx astro check`, open `/blog` in Spanish browser → Spanish renders at `/blog`, `/es` → 404
5. Ship if needed — site works in correct language automatically

### Incremental Delivery

1. Phase 1 + Phase 2 → JSON locale files active, build green
2. Phase 3 → Single-URL detection live, /es/ routes gone
3. Phase 4 → Manual language switching works, preference persists
4. Phase 5 → Key constants in place, full traceability
5. Phase 6 → Polish complete

---

## Notes

- `[P]` = different files, no shared state, safe to parallelize
- `prerender = true` must be removed from blog pages (T014, T015) — static pages bypass middleware
- T026 requires reading `ProjectsCarousel.tsx` first to discover all `t("...")` calls before declaring keys
- T040 (`getLangFromUrl`) — verify no calls remain before removing from utils.ts; `useTranslatedPath` can also be audited for removal if no longer needed
- Run `npx astro check` after each phase checkpoint — catches type errors early
