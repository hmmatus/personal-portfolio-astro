---

description: "Task list for Pages CMS integration (projects, experience, blog)"
---

# Tasks: Pages CMS for Project Catalog, Experience & Blog

**Input**: Design documents from `/specs/002-pages-cms-integration/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/pages-cms-config.md, quickstart.md

**Tests**: Not requested in spec.md / plan.md (no test runner configured per constitution). Validation is
`npx astro check` + manual browser/CMS walkthroughs from `quickstart.md`, listed as the last task in each story.

**Organization**: Tasks are grouped by user story (P1 Projects → P2 Experience → P3 Blog) so each ships and
validates independently, per spec.md priorities.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1 = Projects, US2 = Experience, US3 = Blog

## Path Conventions

Single existing Astro project — all paths relative to repo root, per `plan.md` Project Structure.

---

## Phase 1: Setup

**Purpose**: Prepare the filesystem locations this feature writes into. No existing code touched yet.

- [X] T001 Create empty directories `src/content/projects/` and `src/content/experience/`

**Checkpoint**: Directories exist, ready for Foundational + story work.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared pieces every story's `.pages.yml` entry and content schema build on.

**⚠️ CRITICAL**: Both tasks below MUST be done before any user story phase starts.

- [X] T002 [P] Add a shared `bilingualText` Zod schema (`z.object({ en: z.string(), es: z.string() })`) in `src/content/config.ts`, per `data-model.md` — reused by `projects.title/description/role` and `experience.title/company/description`
- [X] T003 [P] Create root `.pages.yml` with only `media: public/images` and `settings: { merge: direct }` (per `research.md` R6/R7) — no `content:` entries yet; each story phase below appends its own collection block

**Checkpoint**: `.pages.yml` skeleton exists, shared schema helper exists — user story phases can begin.

---

## Phase 3: User Story 1 - Editor manages the project catalog (Priority: P1) 🎯 MVP

**Goal**: Projects become fully CRUD-able through Pages CMS, with existing projects preserved exactly.

**Independent Test**: Create a project in the CMS UI (both languages, image, links) → appears correctly on the
live project section in EN and ES; edit one field in one language → only that changes; delete → disappears.
(`quickstart.md` Section 3)

### Implementation for User Story 1

- [X] T004 [P] [US1] Define the `projects` collection in `src/content/config.ts`: `glob()` loader over `src/content/projects/*.yaml`, schema per `data-model.md` (`slug`, `image`, `tags[]`, `links[]{type: select(live-demo|github), url}`, `year`, `role: bilingualText`, `title: bilingualText`, `description: bilingualText`) — depends on T002
- [X] T005 [P] [US1] Migrate the 3 existing projects (`muellerapp`, `pizpiretos`, `bankingapp`) into `src/content/projects/<slug>.yaml`, pulling structural data from `src/data/i18n-data.ts`'s `heroData.projectsList` and copy from `src/i18n/en.json`/`es.json` (`projects.<id>.title`/`.description`) — no content change, verbatim migration (spec FR-013)
- [X] T006 [US1] Add the `projects` collection block to `.pages.yml` per `contracts/pages-cms-config.md` — depends on T003, T004
- [X] T007 [US1] Reimplement `getProjectsWithTranslations(lang)` in `src/data/i18n-data.ts` to read `getCollection('projects')` and select `entry.data.<field>[lang]`; map each link's `type` through the existing `projects.live-demo`/`projects.github` chrome keys via `useTranslations` (unchanged keys, unchanged `ProjectI` return shape) — depends on T004, T005
- [X] T008 [US1] Remove the now-dead per-entry keys (`projects.muellerapp.*`, `projects.pizpiretos.*`, `projects.bankingapp.*`, `projects.full-stack-developer` if no longer referenced) from `src/i18n/en.json` and `src/i18n/es.json`; keep section-level chrome keys (`projects.title`, `projects.description`, `projects.live-demo`, `projects.github`, `projects.year`, `projects.role`) — depends on T007
- [X] T009 [US1] Remove `heroData.projectsList` from `src/data/i18n-data.ts` (dead code once T007 no longer reads it) — depends on T007, T008
- [X] T010 [US1] Validate: run `npx astro check` (zero errors — pre-existing unrelated `@types/*` alias errors excluded, see Notes) and confirm both locales render the 3 migrated projects correctly in a local dev server (`quickstart.md` Section 1) — depends on T009. ⚠️ The CMS-UI portion of Section 3 (create/edit/delete a project through app.pagescms.org) still needs a human to connect the Pages CMS GitHub App to this repo — see Notes.

**Checkpoint**: Projects are fully CMS-editable; `ProjectsCarousel`/`ProjectCard` components untouched; site renders identically to pre-migration for all 3 existing projects.

---

## Phase 4: User Story 2 - Editor manages work experience (Priority: P2)

**Goal**: Experience entries become fully CRUD-able through Pages CMS, with existing entries preserved exactly.

**Independent Test**: Create an experience entry in the CMS UI (dates + both languages) → appears correctly,
chronologically ordered, on the live experience section in EN and ES; an end-date-before-start-date entry is
rejected. (`quickstart.md` Section 4)

### Implementation for User Story 2

- [X] T011 [P] [US2] Define the `experience` collection in `src/content/config.ts`: `glob()` loader over `src/content/experience/*.yaml`, schema per `data-model.md` (`slug`, `startDate: date`, `endDate: date optional`, `isCurrent: boolean default false`, `title/company/description: bilingualText`), with a Zod `.refine()` rejecting `endDate < startDate` (spec FR-008) — depends on T002
- [X] T012 [P] [US2] Migrate the 4 existing entries (`coderland`, `koibanx`, `applaudo`, `vincu`) into `src/content/experience/<slug>.yaml`, converting today's `"MM/YYYY"` strings (from `heroData.experience.experienceList`) to real ISO dates, pulling bilingual copy from `en.json`/`es.json` (`experience.<id>.title`/`.company`/`.description`) — verbatim migration (spec FR-013)
- [X] T013 [US2] Add the `experience` collection block to `.pages.yml` per `contracts/pages-cms-config.md` — depends on T003, T011
- [X] T014 [US2] Reimplement `getExperienceWithTranslations(lang)` in `src/data/i18n-data.ts` to read `getCollection('experience')`, sort by `startDate` descending, and format `startDate`/`endDate` back into the existing `"MM/YYYY"` display convention (or the `experience.present` chrome string when `isCurrent`) so `ExperienceI`/`ExperienceCard` stay unchanged — depends on T011, T012
- [X] T015 [US2] Add an `experience.present` chrome key ("Present" / "Presente") to `src/i18n/en.json` and `src/i18n/es.json` for `isCurrent` display — depends on T014
- [X] T016 [US2] Remove the now-dead per-entry keys (`experience.coderland.*`, `experience.koibanx.*`, `experience.applaudo.*`, `experience.vincu.*`) from `src/i18n/en.json` and `src/i18n/es.json`; keep `experience.title` and the carousel chrome keys — depends on T014
- [X] T017 [US2] Remove `heroData.experience` from `src/data/i18n-data.ts` (dead code once T014 no longer reads it) — depends on T014, T016
- [X] T018 [US2] Validate: run `npx astro check` (zero errors — pre-existing unrelated `@types/*` alias errors excluded) and confirm both locales render the 4 migrated experience entries, correctly date-ordered, in a local dev server (`quickstart.md` Section 1) — depends on T017. ⚠️ The CMS-UI portion of Section 4 (create an entry, confirm end-before-start is rejected, through app.pagescms.org) still needs a human to connect the Pages CMS GitHub App — see Notes.

**Checkpoint**: Experience is fully CMS-editable; `ExperienceCarousel`/`ExperienceCard` components untouched; site renders identically to pre-migration for all 4 existing entries.

---

## Phase 5: User Story 3 - Editor manages blog posts (Priority: P3)

**Goal**: Blog posts become CRUD-able through Pages CMS, using the existing content collection unchanged.

**Independent Test**: Create a blog post in the CMS UI (title, date, banner, description, body) → appears on
`/blog` and renders at its own URL; edit body → live page updates. (`quickstart.md` Section 5)

### Implementation for User Story 3

- [X] T019 [US3] Add the `blog` collection block to `.pages.yml` per `contracts/pages-cms-config.md` (`path: src/content/blog`, fields `title`, `date`, `banner: image`, `description: text`, `body: rich-text`) — no schema change to `src/content/config.ts` needed, existing `blog` collection is reused as-is — depends on T003
- [X] T020 [US3] Validate: confirmed the existing 2 blog posts still render unchanged (`/blog` listing + individual post pages) after adding the `blog` block to `.pages.yml` — depends on T019. ⚠️ The CMS-UI portion of Section 5 (create/edit a post through app.pagescms.org) still needs a human to connect the Pages CMS GitHub App — see Notes.

**Checkpoint**: All three content types are CMS-editable; blog rendering untouched.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final regression pass across all three stories.

- [X] T021 Grep the repo for any remaining reference to `heroData` outside `src/data/i18n-data.ts` and confirm none exist (`grep -rn "heroData" src`)
- [X] T022 Ran `npx astro check` and the local-dev-server portions of `quickstart.md` (Sections 1, 6) end-to-end, both locales; confirmed UI chrome strings (nav, buttons, section titles, carousel controls) are unaffected (spec FR-012). The 4 `astro check` errors present are pre-existing (`@types/project`/`@types/experience` alias resolution), confirmed via `git stash` to also fail on the unmodified branch — not introduced by this feature.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational only. No dependency on US2/US3.
- **User Story 2 (Phase 4)**: Depends on Foundational only. No dependency on US1/US3.
- **User Story 3 (Phase 5)**: Depends on Foundational only (T003). No dependency on US1/US2, and no dependency on `src/content/config.ts` at all.
- **Polish (Phase 6)**: Depends on whichever stories were implemented.

### Shared-file note

`src/content/config.ts` and `.pages.yml` are each touched by more than one story (config.ts by US1 T004 and
US2 T011; `.pages.yml` by US1 T006, US2 T013, US3 T019 — each story only *appends* its own block). Stories are
independently testable and can be implemented in any order, but if working them truly concurrently, serialize
edits to these two shared files to avoid clobbering another story's addition.

### Within Each User Story

- Schema definition (config.ts) and data migration (yaml files) can happen in parallel — different files.
- `.pages.yml` entry and the `i18n-data.ts` mapping rewrite both depend on schema + migrated data being in place.
- i18n key cleanup depends on the mapping rewrite (must stop reading old keys before deleting them).
- `heroData` removal is last, after nothing reads it anymore.
- Validation task is last in each story.

### Parallel Opportunities

- T002 and T003 (Foundational) — different files, run together.
- T004 and T005 (US1) — different files, run together.
- T011 and T012 (US2) — different files, run together.
- US1 and US2 phases can be worked in either order, or interleaved, once Foundational is done — they touch
  disjoint content files and disjoint i18n key namespaces; only their shared edits to `content/config.ts` and
  `.pages.yml` need to not clobber each other (see Shared-file note above).

---

## Parallel Example: User Story 1

```bash
# After Foundational (T002, T003) is done:
Task: "Define projects collection schema in src/content/config.ts"       # T004
Task: "Migrate 3 existing projects into src/content/projects/*.yaml"     # T005
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Projects)
4. **STOP and VALIDATE**: quickstart.md Section 3, both locales
5. Site now has CMS-editable projects; experience and blog still work exactly as before (untouched)

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. User Story 1 (Projects) → validate → this alone is a shippable MVP
3. User Story 2 (Experience) → validate → ships independently
4. User Story 3 (Blog) → validate → ships independently, smallest of the three (config-only, no schema/data migration)
5. Phase 6 Polish → final regression pass across all three

---

## Notes

- [P] tasks touch different files and have no incomplete-task dependency between them.
- Connecting Pages CMS itself (signing into app.pagescms.org, installing the GitHub App, selecting this repo)
  is a one-time account/environment setup step with no repo file to check off — it's covered as
  `quickstart.md` Section 2, not a task here.
- Commit after each task or logical group, per repo convention (see `CLAUDE.md` Development Workflow).
- `npx astro check` MUST pass with zero errors before any of this is merged (constitution Principle IV). The 4
  errors present at time of implementation (`@types/project`/`@types/experience` import-alias resolution in
  `ProjectCard.tsx`, `ExperienceCard.tsx`, `ProjectsCarousel.tsx`, `ExperienceCarousel.tsx`) pre-date this
  feature (confirmed via `git stash`) and are out of this feature's scope to fix.
- **Remaining manual step (not a repo task)**: nobody has connected this repo to app.pagescms.org yet. Sign in
  with GitHub, install the Pages CMS GitHub App on this repo, select this branch, and confirm the CMS UI shows
  the three collections (Projects, Experience, Blog Posts) defined in `.pages.yml`. Only after that can the
  CMS-UI halves of `quickstart.md` Sections 3, 4, and 5 (T010/T018/T020) be walked end-to-end.
