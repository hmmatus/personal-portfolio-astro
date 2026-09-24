# Feature Specification: Pages CMS for Project Catalog, Experience & Blog

**Feature Branch**: `feat/pages-cms-integration`

**Created**: 2026-09-24

**Status**: Draft

**Input**: User description: "Agregar Pages CMS para manejar la información del catálogo de proyectos, experiencia y el blog." (Add Pages CMS to manage the project catalog, work experience, and blog content, so a non-technical editor can create, edit, and remove entries through a web UI instead of hand-editing source files.)

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
-->

### User Story 1 - Editor manages the project catalog without touching code (Priority: P1)

An editor (e.g. the site owner) wants to add a new portfolio project, or update/remove an
existing one — image, tags, links, year, role, and the English/Spanish title and
description — entirely through a web content-management UI. Today this requires manually
editing three separate source files and understanding the codebase's translation-key
convention, which is not safe for a non-developer and is error-prone even for the
developer.

**Why this priority**: The project catalog is the most frequently updated part of the
portfolio (new projects ship often) and today has the highest editing friction of the
three content types, since it's split across code and two locale files. Fixing this
delivers the most value on its own.

**Independent Test**: Can be fully tested by creating a new project entry through the CMS
UI (both languages, image, links) and confirming it appears correctly on the live project
section in both English and Spanish, without any code file being hand-edited.

**Acceptance Scenarios**:

1. **Given** an authorized editor is signed into the CMS, **When** they create a new
   project entry with image, tags, links, year, role, and English + Spanish title/
   description, **Then** the new project appears on the site's project section in both
   languages after the change is published.
2. **Given** an existing project entry, **When** the editor edits its Spanish description
   through the CMS, **Then** only the Spanish copy changes on the live site; the English
   copy and all other fields stay unchanged.
3. **Given** an existing project entry, **When** the editor deletes it through the CMS,
   **Then** it no longer appears on the site in either language.
4. **Given** all projects that exist today (hand-authored in source files), **When** the
   CMS-backed structure goes live, **Then** every existing project still renders with the
   same content, image, links, and order as before the change.

---

### User Story 2 - Editor manages work experience entries without touching code (Priority: P2)

An editor wants to add a new job, or update/remove an existing one — title, company,
description, and start/end dates, in both English and Spanish — through the CMS UI
instead of editing the same three source files used for projects.

**Why this priority**: Experience entries change far less often than projects (new job
every 1-2 years) but share the exact same editing-friction problem, so this is the
natural second slice, independently valuable and independently shippable.

**Independent Test**: Can be fully tested by adding a new experience entry through the CMS
UI with both languages and dates, and confirming it appears in the correct chronological
position on the experience section in both languages.

**Acceptance Scenarios**:

1. **Given** an authorized editor is signed into the CMS, **When** they create a new
   experience entry with start date, end date, and English + Spanish title/company/
   description, **Then** the new entry appears on the site's experience section in both
   languages, correctly ordered by date.
2. **Given** an existing experience entry, **When** the editor updates its end date (e.g.
   a current role ends), **Then** the updated date reflects on the live site without
   affecting any other entry.
3. **Given** all experience entries that exist today, **When** the CMS-backed structure
   goes live, **Then** every existing entry still renders with the same content and dates
   as before the change.

---

### User Story 3 - Editor manages blog posts without touching code (Priority: P3)

An editor wants to write, edit, or remove blog posts — title, publish date, banner image,
short description, and full body — through the CMS UI instead of hand-authoring Markdown
files and committing them directly.

**Why this priority**: Blog posts are already stored as individual content files (the
least-restructured of the three content types), so wiring them into the CMS is the
smallest lift and lowest risk, making it a good final, independently deployable slice.

**Independent Test**: Can be fully tested by publishing a new blog post through the CMS UI
and confirming it appears on the blog listing and its own page with correct title, date,
banner, description, and body.

**Acceptance Scenarios**:

1. **Given** an authorized editor is signed into the CMS, **When** they create a new blog
   post with title, date, banner image, description, and body content, **Then** the post
   appears on the blog listing and renders correctly at its own URL.
2. **Given** an existing blog post, **When** the editor edits its body content through the
   CMS, **Then** the updated content renders on the live post page.
3. **Given** all blog posts that exist today, **When** the CMS is wired up, **Then** every
   existing post still renders exactly as before, unaffected by the change.

---

### Edge Cases

- What happens when an editor saves a project or experience entry with one language's
  title/description filled in but the other left blank?
- What happens when an editor deletes a project, experience entry, or blog post that is
  currently referenced or displayed elsewhere on the site (e.g. a featured/highlighted
  item)?
- How does the system handle an uploaded image that is missing, in an unsupported format,
  or unusually large?
- How does the system handle two editors saving conflicting changes to the same entry at
  close to the same time?
- What happens when an experience entry is saved with an end date earlier than its start
  date?
- What happens when a required field (e.g. project title, blog post date) is left empty on
  save?
- What happens when an editor without authorization attempts to access the CMS?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST let an authorized editor create, edit, and delete project
  catalog entries through a web UI, with no source-code file edits required.
- **FR-002**: System MUST let an authorized editor create, edit, and delete work-experience
  entries through a web UI, with no source-code file edits required.
- **FR-003**: System MUST let an authorized editor create, edit, and delete blog posts
  through a web UI, with no source-code file edits required.
- **FR-004**: Each project entry MUST expose independently editable English and Spanish
  title and description fields.
- **FR-005**: Each experience entry MUST expose independently editable English and Spanish
  title, company, and description fields.
- **FR-006**: Blog posts MUST continue to support a full rich body of content (not just
  short fields), editable through the CMS UI.
- **FR-007**: System MUST require the fields already treated as mandatory today (e.g.
  project title, image; experience title/company/start date; blog title/date) to be
  filled in before an entry can be saved.
- **FR-008**: System MUST reject (or clearly flag) an experience entry whose end date is
  earlier than its start date.
- **FR-009**: System MUST let an editor upload and replace images (project image, blog
  banner) directly through the CMS UI.
- **FR-010**: System MUST restrict create/edit/delete access to authorized editors only;
  unauthorized visitors MUST NOT be able to reach or use the CMS UI.
- **FR-011**: Publishing a change through the CMS MUST result in the change going live
  through the site's existing deployment process, without requiring a developer to
  manually copy or re-key the content.
- **FR-012**: The English/Spanish UI chrome (buttons, labels, section headings, etc.) that
  is not tied to a specific project, experience, or blog entry MUST continue to work
  exactly as it does today and is out of scope for CMS editing.
- **FR-013**: Migrating existing projects, experience entries, and blog posts into the new
  CMS-editable structure MUST NOT change or lose any of their current content, images, or
  ordering.

### Key Entities

- **Project**: A portfolio project shown in the project catalog. Attributes: identifier,
  image, technology tags, one or more links (label + URL, e.g. live demo / GitHub), year,
  role, and a bilingual title + description.
- **Experience**: A work-history entry shown in the experience section. Attributes:
  identifier, start date, end date (or "present"), and a bilingual title, company, and
  description.
- **Blog Post**: An article shown on the blog. Attributes: title, publish date, banner
  image, short description, and body content (authored once, not translated, per existing
  site convention).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An editor with no coding ability can publish a new project entry
  (both languages, image, links) in under 5 minutes without developer help.
- **SC-002**: 100% of projects, experience entries, and blog posts that exist before the
  change render with identical content, images, and ordering after the change.
- **SC-003**: An editor can publish an edit to any existing entry and see it live through
  the normal deploy turnaround, with zero source-code edits and zero engineering
  involvement.
- **SC-004**: Zero incidents, in the 30 days after launch, of a published entry showing
  missing/blank content in either language due to the new editing workflow.

## Assumptions

- Editors are existing repository collaborators and authenticate into the CMS using their
  existing GitHub identity, consistent with the site's current GitHub-based workflow —
  no separate user/password system is introduced.
- The English/Spanish UI chrome strings (buttons, section titles, nav labels, etc.) are
  explicitly out of scope — only project, experience, and blog *content* becomes
  CMS-editable.
- Blog post bodies remain authored once per post (in whichever language the author
  writes), not machine- or manually-translated, matching current site behavior.
- Whether CMS edits publish as direct commits or go through a review/PR step is a policy
  choice deferred to implementation planning; either way, changes flow through the site's
  existing git-backed deployment pipeline.
- Media (project images, blog banners) continue to live in the repository (or the site's
  current image hosting approach), consistent with today's setup.
- Restructuring how project and experience content is stored on disk, so each entry
  becomes its own editable unit, is in scope as a necessary foundation for this feature —
  but the specific storage format/schema is an implementation decision for the planning
  phase, not this spec.
