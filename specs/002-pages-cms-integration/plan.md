# Implementation Plan: Pages CMS for Project Catalog, Experience & Blog

**Branch**: `feat/pages-cms-integration` | **Date**: 2026-09-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-pages-cms-integration/spec.md`

## Summary

Wire up Pages CMS (github-backed, no-backend CMS driven by a repo-root `.pages.yml`) so a
non-technical editor can create/edit/delete projects, experience entries, and blog posts
through a web UI. Blog already lives as an Astro content collection and needs no
restructuring — only a `.pages.yml` entry. Projects and experience currently live as a
hardcoded object (`src/data/i18n-data.ts`) plus scattered per-entry keys in
`src/i18n/en.json`/`es.json`; this plan moves both into new file-per-entry Astro content
collections (`src/content/projects/`, `src/content/experience/`) with bilingual fields
inline on each entry, so Pages CMS's collection model maps onto them directly. The
existing translation-lookup boundary (`getProjectsWithTranslations` /
`getExperienceWithTranslations` in `i18n-data.ts`) is kept as the seam: only its
implementation changes (reads collections instead of `heroData`), so every downstream
component (`ProjectsCarousel`, `ExperienceCarousel`, cards, etc.) is untouched. Zero new
npm dependencies — Astro's Content Layer API is already available at the installed
Astro 5.3 version; Pages CMS itself is an external hosted (or self-hosted) app configured
purely through the `.pages.yml` file.

## Technical Context

**Language/Version**: TypeScript (strict), Astro 5.3

**Primary Dependencies**: Astro Content Layer API (`astro:content`, `glob()` loader from
`astro/loaders` — built in, no new package); `zod` (already a dependency, used for content
collection schemas); Pages CMS (external hosted app + repo-root `.pages.yml`, not an npm
dependency)

**Storage**: Files in the repo — YAML files under `src/content/projects/` and
`src/content/experience/` (new), Markdown under `src/content/blog/` (existing, unchanged);
images under `public/images/` (existing)

**Testing**: No test runner configured (per constitution) — `npx astro check` is the
quality gate; manual browser validation of both locales per `quickstart.md`, plus manual
CMS-UI validation once `.pages.yml` is live on Pages CMS

**Target Platform**: Web — Astro SSR on Vercel (existing), Pages CMS hosted UI
(app.pagescms.org) reading/writing this GitHub repo

**Project Type**: Single web application (existing Astro project) — no new
service/project boundary introduced

**Performance Goals**: No regression to existing Lighthouse 90+ targets; content
collection reads (≈3 projects, 4 experience entries, 2 blog posts today; low tens even
after growth) are resolved at build/request time via Astro's built-in collection caching
— negligible added cost vs. today's in-memory `heroData` array

**Constraints**: No new runtime npm dependency; downstream components
(`ProjectsCarousel.tsx`, `ExperienceCarousel.tsx`, `ExperienceCard.tsx`, etc.) MUST remain
unchanged — all changes isolated to `src/content/config.ts`, the new collection files, and
`src/data/i18n-data.ts`'s mapping functions

**Scale/Scope**: 2 new content collections, ~3-10 entries each today, 1 new root config
file (`.pages.yml`), migration of 3 existing projects + 4 existing experience entries,
removal of their now-dead per-entry i18n keys

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment |
|---|---|
| I. Component-First Architecture | **PASS** — no new/changed UI components; only the data layer (`content/config.ts`, `i18n-data.ts`) changes. |
| II. Internationalization by Default | **PASS, with documented scope clarification (research.md R4)** — Principle II governs UI chrome, which already has a precedent carve-out for entry-level editorial content (blog post bodies, per `CLAUDE.md`). This feature extends that same carve-out to project/experience entry content; section-level chrome keys (`projects.title`, `experience.title`, link-type labels, etc.) stay in `en.json`/`es.json` exactly as today. |
| III. Performance & Strategic Hydration | **PASS** — no hydration directive changes; no new client-side JS. |
| IV. Type Safety | **PASS / improved** — content collections give compiler-checked `CollectionEntry<'projects'>` / `CollectionEntry<'experience'>` types via Zod, replacing the previously loosely-typed `heroData` object. `npx astro check` remains the required gate. |
| V. Simplicity (YAGNI) | **PASS** — no new npm dependency; reuses the existing content-collection pattern already proven by `blog`; `.pages.yml` `settings.merge: direct` chosen over PR workflow as the simpler option for this single-editor repo (research.md R6), trivially reversible later. |

No Complexity Tracking entries required — no gate violations.

## Project Structure

### Documentation (this feature)

```text
specs/002-pages-cms-integration/
├── plan.md                         # This file (/speckit-plan command output)
├── research.md                     # Phase 0 output
├── data-model.md                   # Phase 1 output
├── quickstart.md                   # Phase 1 output
├── contracts/
│   └── pages-cms-config.md         # .pages.yml contract (CMS ⟷ repo interface)
├── checklists/
│   └── requirements.md
└── tasks.md                        # Phase 2 output (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

Existing single-project Astro layout — no new project/service boundary. Changed/added
paths only:

```text
.pages.yml                          # NEW — Pages CMS config (contract in contracts/pages-cms-config.md)

src/
├── content/
│   ├── config.ts                   # UPDATED — add `projects` + `experience` collection schemas
│   ├── blog/                       # unchanged (existing collection, now also CMS-editable)
│   │   └── *.md
│   ├── projects/                   # NEW collection — one YAML file per project
│   │   └── <slug>.yaml
│   └── experience/                 # NEW collection — one YAML file per experience entry
│       └── <slug>.yaml
├── data/
│   └── i18n-data.ts                # UPDATED — getProjectsWithTranslations /
│                                    # getExperienceWithTranslations read from
│                                    # getCollection() instead of hardcoded `heroData`;
│                                    # `heroData.projectsList` / `heroData.experience`
│                                    # removed once migration is verified
├── i18n/
│   ├── en.json                     # UPDATED — remove per-entry project/experience keys
│   └── es.json                     # UPDATED — remove per-entry project/experience keys
└── components/                     # UNCHANGED (ProjectsCarousel, ExperienceCarousel,
                                     # ExperienceCard, etc. consume the same ProjectI /
                                     # ExperienceI shape as today)

public/
└── images/                         # unchanged — Pages CMS `media` root (research.md R7)
```

**Structure Decision**: Single existing Astro project, no new app/service boundary. The
feature is additive at the content-collection layer (`src/content/projects/`,
`src/content/experience/`) plus one repo-root config file (`.pages.yml`); the only
existing files touched are `src/content/config.ts`, `src/data/i18n-data.ts`, and the two
locale JSON files (key removal only). This keeps the change isolated exactly at the
existing `i18n-data.ts` seam so every rendering component stays untouched, per the
Technical Context constraints above.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
