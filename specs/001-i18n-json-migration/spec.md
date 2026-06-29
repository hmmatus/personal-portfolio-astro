# Feature Specification: i18n JSON Migration & Browser Language Detection

**Feature Branch**: `001-i18n-json-migration`

**Created**: 2026-06-28

**Status**: Draft

**Input**: User description: "okay. Right now, I have installed the I18N library, but the problem is that I need to transform the current strings into EN and ES JSON files. I also need to update all strings to keys, and each key should be saved in .const file inside each component where it's needed.  so, when I load the page, I don't need to add the translate extension. It should check the specification of the browser, or by default, use the EN version."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic Language Detection (Priority: P1)

A site visitor whose browser is configured to Spanish visits the portfolio. The site loads
immediately in Spanish — no language selector, no extension, no manual step required. If
the visitor's browser language is not Spanish or English, the site defaults to English.

**Why this priority**: Core user experience. The entire value of the i18n feature depends
on the site presenting the correct language without user intervention.

**Independent Test**: Open the site with a browser set to Spanish (`es`) — all visible
copy renders in Spanish. Change browser language to French — copy renders in English
(default). Change to English — copy renders in English. This can be tested immediately
after language detection is wired up, with no other stories required.

**Acceptance Scenarios**:

1. **Given** a visitor's browser language is Spanish (`es`), **When** they load any page,
   **Then** all UI copy appears in Spanish.
2. **Given** a visitor's browser language is English (`en`), **When** they load any page,
   **Then** all UI copy appears in English.
3. **Given** a visitor's browser language is unsupported (e.g., French, German), **When**
   they load any page, **Then** all UI copy appears in English (default).
4. **Given** a visitor has no language preference set, **When** they load any page,
   **Then** all UI copy appears in English (default).

---

### User Story 2 - All Copy Available in Both Languages (Priority: P2)

Every piece of visible text on the site — navigation labels, section headings, body copy,
button labels, form placeholders, error messages, and any other user-facing strings — has
both an English and a Spanish translation. No string falls back to a raw key or appears
untranslated.

**Why this priority**: Without complete translations, language detection has no value.
Incomplete translations degrade trust and professionalism.

**Independent Test**: With browser set to Spanish, visit every section of the site and
verify no English strings appear in Spanish context (and vice versa). Can be tested
independently from the language-detection mechanism using a forced locale parameter.

**Acceptance Scenarios**:

1. **Given** the site is in Spanish mode, **When** a visitor navigates to any section,
   **Then** zero English strings appear (no untranslated keys or raw strings).
2. **Given** the site is in English mode, **When** a visitor navigates to any section,
   **Then** zero Spanish strings appear.
3. **Given** a new translation key is added to one locale, **When** a developer attempts
   to deploy without adding the key to both locales, **Then** the build highlights the
   missing translation.

---

### User Story 3 - Maintainable Translation Workflow for Developer (Priority: P3)

The developer can add or update a translation by editing a single locale file per language
(EN and ES). Each translatable component references named keys, not raw strings, so
adding a new language in the future requires only a new locale file — no component edits.

**Why this priority**: Long-term maintainability. Without this, every future copy change
requires hunting through components.

**Independent Test**: Add a new translation key to both locale files, reference the key
in one component, and confirm the correct string appears in each language without touching
any other component file.

**Acceptance Scenarios**:

1. **Given** a developer adds a new key to both the EN and ES locale files, **When** a
   component references that key, **Then** the correct localized string renders in each
   language.
2. **Given** a developer updates an existing string value in a locale file, **When** the
   site loads, **Then** the updated string appears with no other code changes required.

---

### Edge Cases

- What happens when only one locale file has a key (missing translation)? System MUST
  surface the missing key visibly during development so no silent fallback hides gaps.
- What if the browser sends multiple `Accept-Language` values in priority order? System
  MUST pick the highest-priority supported language.
- What if the browser sends a regional variant (e.g., `es-MX`, `en-GB`)? System MUST
  match on the base language code (`es`, `en`) and default to English for unmatched
  variants.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST detect the visitor's preferred language from the browser's
  language settings on page load, with no user action required.
- **FR-002**: The site MUST support English (`en`) and Spanish (`es`) as available
  locales.
- **FR-003**: The site MUST default to English when the visitor's preferred language is
  not among the supported locales.
- **FR-004**: All user-facing copy MUST be stored in structured locale files — one per
  supported language — as the single source of truth.
- **FR-005**: Components MUST reference named translation keys, not raw string literals,
  so that changing copy requires only a locale file edit.
- **FR-006**: The relationship between translation keys and the components that use them
  MUST be immediately traceable — finding which keys a given section of the UI uses MUST
  NOT require searching the entire codebase.
- **FR-007**: The site MUST NOT require the visitor to install a browser extension or
  enable any manual setting to see the correct language.
- **FR-008**: Language detection MUST occur before the page is presented to the visitor,
  with no visible flash of incorrect language content during load.

### Key Entities

- **Locale file**: A structured file containing all translation key-value pairs for a
  single language (one for EN, one for ES). Source of truth for all copy.
- **Translation key**: A named identifier used in components to reference a specific
  string. Defined once per locale file; referenced by components via their co-located
  constants.
- **Translation key registry per component**: A traceable mapping that records which
  translation keys each component uses, keeping the relationship between keys and UI
  visible without requiring a full codebase search.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor with a Spanish-configured browser sees 100% of visible copy in
  Spanish on first load, with zero page reloads or manual steps.
- **SC-002**: A visitor with an unsupported browser language sees 100% of visible copy in
  English on first load.
- **SC-003**: Zero raw translation keys or untranslated strings appear in either language
  mode across all site sections.
- **SC-004**: A developer can add or update any piece of copy by editing locale files
  only — no component code changes required for text-only updates.
- **SC-005**: A missing translation for any key is detectable during development, so
  translation gaps cannot silently reach production.

## Assumptions

- The portfolio site has one primary layout with multiple sections; all sections share the
  same language context — there is no per-section language switching.
- Only English and Spanish are required at launch; the architecture MUST make adding a
  third language a locale-file-only change.
- The existing Spanish translations in the codebase are complete and accurate; this
  feature migrates them, it does not re-translate.
- No user-facing language toggle UI is required for this feature; browser preference is
  the only signal.
- Performance requirements are standard for a server-rendered portfolio page (language
  detection adds negligible overhead at the server level).
