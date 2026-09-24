# Quickstart: Validating Pages CMS Integration

Prerequisites: feature implemented per `plan.md` / `tasks.md` — `.pages.yml` at repo
root, `projects`/`experience` content collections populated from migrated data, blog
collection unchanged.

## 1. Local build/type validation (no CMS needed)

```bash
npx astro check        # zero errors — Zod schemas + generated types must be valid
npm run dev             # http://localhost:4321
```

Manually verify, with browser language set to English then Spanish (or via the site's
language switcher):
- Project section shows all migrated projects, same content/images/links/order as before
  the change (spec SC-002).
- Experience section shows all migrated entries, same content/dates/order as before.
- Blog listing + individual posts unchanged.

## 2. Wire up Pages CMS (hosted app path)

1. Push the branch (or merge to `main`, since Pages CMS reads a specific branch) so
   `.pages.yml` is visible to GitHub.
2. In app.pagescms.org, sign in with GitHub, install the GitHub App on this repo (if not
   already), select the repo + branch.
3. Confirm Pages CMS loads three collections: **Projects**, **Experience**,
   **Blog Posts** — matches `contracts/pages-cms-config.md`.

## 3. User Story 1 validation — Projects (P1)

1. In the CMS, create a new Project entry: fill `slug`, `image`, `tags`, at least one
   link, `year`, `title.en`/`title.es`, `description.en`/`description.es`.
2. Save/publish.
3. Confirm a new file appears at `src/content/projects/<slug>.yaml` in the repo (via
   commit history) with the fields entered.
4. Reload the live/preview site in English — new project appears with correct title/
   description/image/links. Switch to Spanish — Spanish copy shows, everything else
   identical.
5. Edit only `description.es` on that entry through the CMS — confirm only the Spanish
   description changes on the site; English untouched.
6. Delete the entry through the CMS — confirm it disappears from the site.

Expected outcome: all of spec.md's User Story 1 acceptance scenarios pass.

## 4. User Story 2 validation — Experience (P2)

1. Create a new Experience entry with `startDate`, `endDate` (or `isCurrent: true`),
   bilingual `title`/`company`/`description`.
2. Confirm it appears on the site's experience section, in the right chronological
   position, in both languages.
3. Attempt to save an entry with `endDate` before `startDate` — confirm the CMS/build
   flags this (spec Edge Case / FR-008).

## 5. User Story 3 validation — Blog (P3)

1. Create a new blog post through the CMS (title, date, banner, description, body).
2. Confirm it appears on `/blog` and renders correctly at its own post URL.
3. Edit the body of an existing post through the CMS — confirm the live page updates.

## 6. Regression check

Confirm nothing outside scope moved: UI chrome strings (nav, buttons, section titles,
carousel controls) still come from `src/i18n/en.json` / `es.json` via `useTranslations`,
unaffected by this change (spec FR-012).
