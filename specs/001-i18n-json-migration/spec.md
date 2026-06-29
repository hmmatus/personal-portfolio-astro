# Feature Specification: i18n — JSON Locales, Single-URL Language Detection & Persistence

**Feature Branch**: `fix/translations`

**Created**: 2026-06-28

**Status**: Draft

**Input**: Combined from two user descriptions:
1. "Transform current strings into EN and ES JSON files. Update all strings to keys, each key saved in .const file inside each component. When loading the page, check browser language or default to EN."
2. "No routes /en or /es based on route. If entering /blog, middleware should check preferences of selected language or navigator language. Don't add extra routes based on language."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New Visitor Sees Site in Their Browser Language (Priority: P1)

A first-time visitor navigates to any page — `/`, `/blog`, `/blog/my-post`. The site
renders immediately in their preferred browser language. The URL stays exactly as typed:
no `/es` or `/en` prefix is added, no redirect occurs. If the browser language is
unsupported, English renders by default.

**Why this priority**: This is the architectural foundation. Without single-URL language
detection working correctly, all other stories are meaningless. It also eliminates the
need for users to install a browser translation extension.

**Independent Test**: With a Spanish-configured browser, open `/blog` — Spanish copy
renders, URL stays `/blog`. With a French browser, open `/blog` — English renders, URL
stays `/blog`. Can be tested as soon as detection is wired up, before any other story.

**Acceptance Scenarios**:

1. **Given** a visitor's browser language is Spanish, **When** they navigate to any URL,
   **Then** all UI copy appears in Spanish and the URL is unchanged (no prefix added).
2. **Given** a visitor's browser language is English, **When** they navigate to any URL,
   **Then** all UI copy appears in English and the URL is unchanged.
3. **Given** a visitor's browser language is unsupported (e.g., French), **When** they
   navigate to any URL, **Then** all UI copy appears in English (default), URL unchanged.
4. **Given** a visitor with no browser language preference, **When** they navigate to any
   URL, **Then** all UI copy appears in English (default), URL unchanged.
5. **Given** a visitor's browser sends a regional variant (e.g., `es-MX`), **When** they
   navigate to any URL, **Then** the base language code (`es`) is matched and Spanish
   renders.

---

### User Story 2 - Returning Visitor Sees Previously Selected Language (Priority: P2)

A visitor who previously changed the site language via the language switcher returns in a
new browser session. The site immediately renders in their chosen language, without
re-detecting the browser language.

**Why this priority**: Stored preference ensures explicit user choices are respected.
A Spanish speaker using an English-language browser who switched to Spanish manually
should not be forced back to English on return.

**Independent Test**: Switch the site to Spanish while browser is set to English. Close
the browser completely. Reopen and navigate to `/` — Spanish renders. This tests the
persistence mechanism independently of browser language detection.

**Acceptance Scenarios**:

1. **Given** a visitor manually switched to Spanish in a prior session, **When** they
   return to any page in a new session, **Then** Spanish renders without any user action.
2. **Given** a visitor manually switched to English while their browser is in Spanish,
   **When** they return, **Then** English renders (stored preference beats browser
   language).
3. **Given** a visitor's stored preference has been cleared (e.g., incognito mode),
   **When** they visit, **Then** browser language detection applies (User Story 1).

---

### User Story 3 - Visitor Switches Language Without URL Change (Priority: P3)

A visitor uses the language switcher on the site. The page re-renders in the selected
language. The URL stays the same. The preference is saved and applied on all subsequent
page navigations and future sessions.

**Why this priority**: Provides explicit user control when auto-detection picks the wrong
language. The URL MUST NOT change so that bookmarks, links, and browser history remain
language-neutral.

**Independent Test**: On `/blog`, switch language from English to Spanish — URL remains
`/blog`, all copy changes to Spanish. Navigate to `/` — Spanish shows. Refresh — Spanish
persists. Share the URL with another person — they see the site in their own language,
not the switcher's.

**Acceptance Scenarios**:

1. **Given** a visitor is on `/blog` in English, **When** they select Spanish from the
   switcher, **Then** the page re-renders in Spanish, URL stays `/blog`.
2. **Given** a visitor switched to Spanish, **When** they navigate to another page,
   **Then** Spanish is shown on the new page.
3. **Given** a visitor switched to Spanish, **When** they refresh, **Then** Spanish
   persists.
4. **Given** a visitor switched to Spanish and shares the URL, **When** another visitor
   opens that URL, **Then** the second visitor sees the site in their own language (URL
   carries no language signal).

---

### User Story 4 - All Copy Available in Both Languages via Locale Files (Priority: P4)

Every piece of visible text — navigation, headings, body, buttons, form labels, validation
errors, toasts — has both an English and a Spanish translation stored in structured locale
files. No string is hardcoded in a component. Adding a new language in the future requires
only a new locale file with no component changes.

**Why this priority**: Translation quality is required for US1–US3 to have any value.
Locale files as the single source of truth also enable the developer maintainability
story.

**Independent Test**: In Spanish mode, navigate every section of the site — zero English
strings appear. Add a new key to both locale files, reference it in one component — the
correct string appears in each language with no other changes.

**Acceptance Scenarios**:

1. **Given** the site is in Spanish mode, **When** a visitor navigates to any section,
   **Then** zero English strings or raw keys appear.
2. **Given** the site is in English mode, **When** a visitor navigates to any section,
   **Then** zero Spanish strings appear.
3. **Given** a developer adds a key to both locale files and references it in a component,
   **When** the site loads, **Then** the correct localized string renders in each language.
4. **Given** a developer updates an existing string value in a locale file, **When** the
   site loads, **Then** the updated string appears with no component code changes.
5. **Given** a key is added to one locale file but not the other, **When** the developer
   checks the project, **Then** the missing key is surfaced immediately — it cannot reach
   production undetected.

---

### Edge Cases

- **Cleared preference**: Visitor clears storage or uses incognito — falls back to browser
  language detection, then English default.
- **Multiple Accept-Language values**: System picks the highest-priority supported
  language from the browser's ordered list.
- **Regional language variant**: `es-MX`, `es-AR`, `en-GB` etc. match on base language
  code (`es`, `en`).
- **Missing translation key**: A key present in one locale file but missing from the other
  MUST NOT silently fail — must be caught during development.
- **Language state across navigation**: Navigating between pages within a session MUST
  maintain the current language without a new detection cycle.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every page MUST be served from a single URL with no language prefix. The
  site MUST NOT have `/en/` or `/es/` prefixed routes. (e.g., `/blog` only — not
  `/es/blog`).
- **FR-002**: Language detection MUST occur before the page is presented to the visitor,
  with no visible flash of incorrect language content during load.
- **FR-003**: Language detection priority MUST follow this order: (1) stored visitor
  preference from prior explicit selection, (2) browser language header, (3) English
  default.
- **FR-004**: When a visitor selects a language via the switcher, that preference MUST be
  persisted and honored on all subsequent visits, including new browser sessions.
- **FR-005**: The site MUST support English and Spanish. Any unsupported browser language
  MUST fall back to English.
- **FR-006**: The language switcher MUST re-render the current page in the selected
  language without changing the URL.
- **FR-007**: All UI chrome copy (navigation labels, section headings, button text, form
  labels, validation messages) MUST be stored in structured locale files and rendered in
  the visitor's detected language. Blog post body content is explicitly excluded — it is
  authored in a fixed language and rendered as-is regardless of the visitor's preference.
- **FR-008**: Components MUST reference named translation keys rather than raw string
  literals, so that updating copy requires only locale file changes.
- **FR-009**: The relationship between translation keys and the components that use them
  MUST be immediately traceable without a full codebase search.
- **FR-010**: A translation key missing from any locale file MUST be detectable during
  development before the site is deployed.

### Key Entities

- **Locale file**: A structured file containing all translation key-value pairs for one
  language. One file per supported language. The single source of truth for all copy.
- **Translation key**: A named identifier used in components to reference a specific
  string. Must exist in every locale file.
- **Language preference**: A signal representing which language to render for a visitor.
  Priority: stored selection > browser language > English default.
- **Language switcher**: A UI element present on every page. Selecting a language updates
  the stored preference and immediately re-renders in the selected language without
  changing the URL.
- **Component key registry**: A co-located definition alongside each component that
  declares which translation keys that component uses, making the key-to-component
  relationship traceable without searching the codebase.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every page is accessible from exactly one URL — zero `/en/` or `/es/`
  prefixed URLs exist anywhere on the site.
- **SC-002**: A first-time visitor with a Spanish-configured browser sees 100% of visible
  copy in Spanish on first load — no redirect, no URL change, no user action required.
- **SC-003**: A returning visitor who previously selected Spanish sees Spanish on all
  pages within 0 additional interactions.
- **SC-004**: A visitor who switches language sees the selected language on all subsequent
  pages in the same session, with the URL unchanged.
- **SC-005**: Zero visible language flash — no incorrect language content appears
  momentarily before the correct language renders.
- **SC-006**: Zero untranslated strings or raw keys appear in either language mode across
  all site sections.
- **SC-007**: A developer can add or update any piece of copy by editing locale files only
  — no component code changes required for text-only updates.
- **SC-008**: A missing translation key in any locale file is detectable during
  development, preventing silent gaps from reaching production.

## Assumptions

- Existing `/es/` page routes (`/es/blog`, `/es/blog/[slug]`) will be removed as part of
  this feature. All pages serve from their non-prefixed URL only.
- The language switcher UI component will be retained; its behavior changes from
  "navigate to a prefixed URL" to "update stored preference and re-render in place."
- Language preference is persisted in a durable, client-accessible mechanism that
  survives page refreshes and new browser sessions. GDPR implications are minimal — this
  is a functional preference, not tracking.
- Only English and Spanish are required at launch; adding a third language MUST require
  only a new locale file — no routing or component changes.
- The existing Spanish translations in the codebase are complete and accurate; this
  feature migrates them, it does not re-translate.
- SEO implications of serving multilingual content from the same URL are accepted for
  this personal portfolio. Search engine language hints may be added in a future
  iteration.
- Blog post body content is authored in a fixed language (determined by the markdown
  file). It is NOT translated or switched based on the visitor's preference. Only the
  surrounding UI chrome (navigation, page headings, blog listing labels) follows the
  visitor's language preference.
- The whole-site language context is uniform per request — there is no per-section
  language switching.
