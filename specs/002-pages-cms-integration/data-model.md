# Phase 1 Data Model: Pages CMS for Project Catalog, Experience & Blog

## Overview

Three Astro content collections, defined in `src/content/config.ts`. `projects` and
`experience` are **new** (Content Layer `glob()` loader, one YAML file per entry under
`src/content/<collection>/`). `blog` already exists and needs no schema change — it is
only added to `.pages.yml` so it becomes CMS-editable.

A shared `bilingualText` Zod schema (`z.object({ en: z.string(), es: z.string() })`) is
reused for every translatable field, mirroring the `.pages.yml` `components` block
(see `contracts/pages-cms-config.md`) so the CMS UI and the Astro schema stay in lockstep.

## Entity: Project

**Collection**: `projects` — `src/content/projects/<slug>.yaml`, filename = `slug`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `slug` | string | yes | Stable identifier; also used as filename. Immutable after creation (renaming = new entry, matches today's `id` behavior). |
| `image` | string (image path/URL) | yes | Project screenshot/thumbnail. |
| `tags` | string[] | yes | Free-text technology tags (e.g. "React Native", "NestJS"). |
| `links` | array of `{ type, url }` | no | `type`: `select` of `live-demo` \| `github` (closed set — maps to existing chrome keys `projects.live-demo` / `projects.github`, not re-translated per entry). `url`: string (URL). |
| `year` | string | yes | Free text, matches today's usage (e.g. "2026"). |
| `role` | `bilingualText` | no | Per-project role blurb (e.g. "Full stack Developer"); now free-text content instead of a fixed chrome key, since roles vary by project. |
| `title` | `bilingualText` | yes | |
| `description` | `bilingualText` | yes | |

**Validation rules**:
- `slug` matches `^[a-z0-9-]+$`, unique per file system (enforced by filename uniqueness).
- `title.en`, `title.es`, `description.en`, `description.es` all required — enforces
  FR-004 (independently editable, but both required at save time so neither locale ships
  blank; see Edge Cases in spec.md).
- `links[].url` must be a valid URL.

**Relationships**: None (flat list, ordered by file listing / an optional future `order`
field — out of scope, current site has no explicit ordering beyond source-array order,
preserved via directory listing order at migration time).

## Entity: Experience

**Collection**: `experience` — `src/content/experience/<slug>.yaml`, filename = `slug`.

| Field | Type | Required | Notes |
|---|---|---|---|
| `slug` | string | yes | Stable identifier, e.g. `coderland`. |
| `startDate` | date | yes | Real date (was free-text `"MM/YYYY"`); enables FR-008 validation. |
| `endDate` | date | no | Omitted/null when `isCurrent` is true. |
| `isCurrent` | boolean | no, default `false` | Replaces the old implicit "empty endDate = present" convention. |
| `title` | `bilingualText` | yes | Role/job title. |
| `company` | `bilingualText` | yes | Kept bilingual per FR-005, even though today's EN/ES values happen to match — allows an editor to localize it later without a schema change. |
| `description` | `bilingualText` | yes | |

**Validation rules**:
- `endDate >= startDate` when both present — Zod `.refine()` cross-field check (satisfies
  FR-008; Pages CMS itself only validates per-field, so this check also runs at Astro
  build/content-check time as a second line of defense).
- `isCurrent === true` implies `endDate` is absent/ignored.

**Relationships**: None. Display order on the site = date order (already true today —
mapping function sorts by `startDate` descending; today's order in `i18n-data.ts` is
already newest-first).

## Entity: Blog Post

**Collection**: `blog` — `src/content/blog/<slug>.md` (existing, unchanged schema).

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Unchanged. |
| `date` | date | yes | Unchanged. |
| `banner` | string (image path/URL) | yes | Unchanged — today's values are external URLs (Unsplash); CMS `image` field must support both an uploaded file and a pasted external URL. |
| `description` | string | yes | Unchanged. |
| body (Markdown content) | rich-text | yes | Authored once, not translated (existing convention, unchanged). |

No schema or component changes required for blog — this entity is listed for completeness
of the `.pages.yml` contract only.

## Mapping layer (existing seam, updated implementation)

`src/data/i18n-data.ts`'s `getProjectsWithTranslations(lang)` and
`getExperienceWithTranslations(lang)` are reimplemented to read from
`getCollection('projects')` / `getCollection('experience')` instead of the hardcoded
`heroData` object, and to pick `entry.data.<field>[lang]` instead of calling `t()` on a
per-entry translation key. Link `type` still resolves through `t()` against the existing
chrome keys (`projects.live-demo`, `projects.github`). Experience dates are formatted
back into the existing `"MM/DD/YYYY"` display convention... **(see Assumption below)**
inside the mapping function, so `ExperienceI`/`ProjectI` (consumed by `ExperienceCard`,
`ProjectsCarousel`, etc.) and every downstream component are **unchanged**.

**Assumption**: display format for dates stays `MM/YYYY` (today's format); `isCurrent`
formats to the existing chrome string used for an ongoing role (verify against current
site copy — none of today's 4 experience entries are "current", so this is a new small
UI string to add to `experience.*` chrome keys, e.g. `experience.present`, during
implementation).
