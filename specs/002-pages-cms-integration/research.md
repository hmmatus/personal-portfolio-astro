# Phase 0 Research: Pages CMS for Project Catalog, Experience & Blog

## R1 — Where should per-entry catalog content live?

**Decision**: Move projects and experience out of `src/data/i18n-data.ts` (hardcoded
`heroData` object) into two new Astro **content collections** — `src/content/projects/`
and `src/content/experience/` — one YAML file per entry, using Astro 5's Content Layer
`glob()` loader. Blog stays exactly where it is (`src/content/blog/*.md`), already a
content collection.

**Rationale**: Pages CMS's `content` model (`type: collection`, `path`, `fields`) maps
onto "one file per entry in a folder" almost exactly — that's the shape Astro content
collections already provide for blog. Bringing projects/experience into the same shape
means:
- One consistent mental model across all three content types.
- No new runtime dependency — Astro's content collections are built in; `.pages.yml` is
  the only new file needed at the framework/repo level.
- Each entry gets real typed shape (via a Zod schema in `content/config.ts`) instead of a
  loosely-typed object plus string-keyed lookups.

**Alternatives considered**:
- *Keep `heroData` in `i18n-data.ts`, point Pages CMS at it as a single `file`-type
  entry with a `list` field*: rejected — the file mixes non-translatable structural data
  (image, tags, dates) with translation-key references (`labelKey`), which Pages CMS
  cannot resolve into human copy; an editor would still see raw keys like
  `"projects.live-demo"` instead of "Live Demo".
- *One JSON/YAML file per locale holding the whole list (`projects.en.yaml`,
  `projects.es.yaml`)*: rejected — breaks single-entry editing (an edit to one project's
  Spanish copy would require opening a different file than its English copy), and two
  files can drift out of sync (an entry added to one but not the other).

## R2 — How should bilingual fields be represented per entry?

**Decision**: Each translatable field is a nested object with `en` and `es` keys directly
on the entry, e.g.:

```yaml
title:
  en: "Mueller App"
  es: "Mueller App"
description:
  en: "..."
  es: "..."
```

**Rationale**: Keeps one file per entry (satisfies R1), keeps both languages visible and
editable side-by-side in the CMS UI (Pages CMS `object` field type nests sub-fields
naturally), and requires zero new lookup indirection — `entry.data.title[lang]` replaces
today's `t("projects.<id>.title")` call.

**Alternatives considered**:
- *Two sibling files per entry, `muellerapp.en.yaml` / `muellerapp.es.yaml`*: rejected —
  doubles file count, and nothing enforces both files existing/staying in sync (an editor
  could delete one language's file without noticing).

## R3 — What happens to the per-entry translation keys already in `en.json`/`es.json`?

**Decision**: Remove the per-entry keys (`projects.muellerapp.title`,
`experience.coderland.description`, etc.) from both locale files once content is
migrated into the new collections. Keep the **section-level chrome keys** that are not
tied to one entry: `projects.title`, `projects.description`, `projects.live-demo`,
`projects.github`, `projects.year`, `projects.role`, `experience.title`, and the carousel
keys.

**Rationale**: `projects.live-demo` / `projects.github` are link-type labels shared by
every entry, not per-entry copy — they stay chrome and are looked up by a small fixed
`type` field (`select: live-demo | github`) on each link, exactly like today's
`labelKey`. Per-entry title/description/company keys become dead code once nothing reads
them via `t()`, so removing them is required to satisfy the "no data loss, no dead
duplication" bar implied by FR-013.

**Alternatives considered**: Leaving the old keys in place "just in case" — rejected per
the Simplicity principle (no half-migrated state, no unused keys left behind).

## R4 — Constitution Principle II ("copy lives in `src/i18n/ui.ts`") — does this feature violate it?

**Decision**: No violation. Principle II governs **UI chrome** copy (buttons, labels,
section titles) — it is already scoped that way in practice: `CLAUDE.md` explicitly
carves out blog post bodies ("Blog post body content renders as authored... only UI
chrome follows `Astro.locals.lang`"). Project/experience entry content is the same kind
of thing as a blog post body: editorial content tied to one entry, not reusable chrome.
This feature extends the *existing, already-adopted* carve-out to two more content types
instead of introducing a new one.

**Rationale**: Consistency with precedent already in the codebase; documented here so the
Constitution Check gate has a clear justification on record rather than silently
special-casing it.

## R5 — Date handling for experience entries

**Decision**: Store `startDate` / `endDate` as real dates (`z.coerce.date()` in the Zod
schema, Pages CMS `date` field in the UI) instead of today's free-text `"MM/YYYY"`
strings. Add an `isCurrent: boolean` flag for the "present" case instead of leaving
`endDate` as a magic empty string.

**Rationale**: Pages CMS's `date` field gives editors a real date picker (fewer malformed
entries — directly supports FR-008, rejecting end-before-start). Display formatting
(`MM/YYYY`) becomes a small formatting step at render time, isolated to one place instead
of being baked into stored data.

**Alternatives considered**: Keep `"MM/YYYY"` strings — rejected, since a free-text field
can't be validated by the CMS and doesn't support FR-008's date-order check without
custom logic.

## R6 — Direct commit vs. pull-request workflow in Pages CMS `settings`

**Decision**: Direct commit to the working branch (no forced PR review step) for this
single-editor personal portfolio, matching how the site is already maintained
(`git user: hmmatus`, solo-owned repo, Vercel auto-deploys `main` on push).

**Rationale**: Simplicity — a PR-review step adds process overhead with no second
reviewer in this repo's actual workflow. This is a `.pages.yml` `settings` value, not
structural, so it can be flipped later with a one-line config change if a collaborator is
ever added.

**Alternatives considered**: PR-based workflow — rejected for now as unjustified
complexity (YAGNI); noted as trivially reversible.

## R7 — Media storage

**Decision**: Reuse the existing `public/images/` folder as the Pages CMS `media` root,
so uploaded images land where project/blog images already live and existing `<img
src="/images/...">` usage keeps working unchanged.

**Rationale**: Zero changes to image-rendering code; consistent with today's asset
layout (`/images/projects/*.png`, `/images/blog/*`).
