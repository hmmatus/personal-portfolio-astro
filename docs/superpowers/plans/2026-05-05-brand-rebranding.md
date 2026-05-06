# Portfolio Brand Rebranding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Bebas Neue + lime-green (`#D3E97A`) design system with the Brand Brief v2 identity: zinc-black backgrounds, single indigo accent (`#818cf8`), and a 3-font stack (Syne display · Cabinet Grotesk body · DM Mono mono).

**Architecture:** All visual tokens flow through `src/styles/theme/_colors.scss` and `_fonts.scss` — component SCSS modules import these via `@use "../../styles/theme/main.scss" as main`. Updating token values cascades most color changes across the site automatically. Structural changes (section labels, component variants) require targeted edits to individual component files.

**Tech Stack:** Astro 5, React 19, SCSS Modules, Google Fonts CDN (Syne + DM Mono), Fontshare CDN (Cabinet Grotesk)

---

## File Map

| File | Change |
|------|--------|
| `src/styles/theme/_colors.scss` | Replace all color vars with new zinc+indigo system |
| `src/styles/theme/_fonts.scss` | Replace Bebas Neue vars with 3-font system vars |
| `src/styles/global.scss` | Update body/heading/p base styles, add `.section-label` utility |
| `src/layouts/html/HtmlLayout.astro` | Add Google Fonts + Fontshare `<link>` tags |
| `src/components/header/Header.module.scss` | Frosted glass bg, logo/nav link typography |
| `src/components/buttons/contact/ContactButton.module.scss` | Primary indigo button, ghost icon button |
| `src/components/buttons/custom/CustomButton.module.scss` | Match primary button style |
| `src/components/sections/contact/ContactSection.module.scss` | Icon fill → indigo on hover |
| `src/components/sections/form/components/connect/ConnectSection.module.scss` | Icon fill → indigo on hover |
| `src/components/tag/Tag.astro` | Add `core?: boolean` prop |
| `src/components/tag/Tag.module.scss` | New pill→rectangle style, core variant |
| `src/components/cards/experience/ExperienceCard.module.scss` | Left-border indigo card style |
| `src/components/form/inputs/inputText/InputText.module.scss` | New input style (black-3 bg, indigo focus) |
| `src/components/divider/Divider.module.scss` | Border color → `$black-4` |
| `src/components/footer/Footer.astro` | Update markup for brand logo pattern |
| `src/components/footer/Footer.module.scss` | New footer styles |
| `src/layouts/hero/HeroLayout.astro` | Add section labels before section headings, core Tag props |
| `src/components/sections/projects/ProjectsSection.astro` | Add section label before heading |

---

## Task 1: Color Tokens

**Files:**
- Modify: `src/styles/theme/_colors.scss`

- [ ] **Step 1: Replace `_colors.scss` with new zinc+indigo system**

```scss
// src/styles/theme/_colors.scss

// === BLACKS (zinc-based, warm-neutral temperature) ===
$black:   #09090b;
$black-2: #111113;
$black-3: #18181b;
$black-4: #27272a;
$black-5: #3f3f46;

// === INDIGO / PERIWINKLE — the single accent ===
$indigo:       #818cf8;
$indigo-bright:#a5b4fc;
$indigo-deep:  #6366f1;
$indigo-dim:   rgba(129, 140, 248, 0.15);
$indigo-glow:  rgba(129, 140, 248, 0.08);

// === TEXT ===
$white:      #fafafa;
$text-muted: #a1a1aa;
$text-dim:   #52525b;

// === LEGACY ALIASES (preserve backward compat with existing component SCSS) ===
$primary-background:  $black;
$secondary-background: $black-2;
$primary-text:        $white;
$primary-light-text:  $text-muted;
$secondary-text:      $black;
$secondary:           $indigo;   // was lime #D3E97A — now indigo
$light-gray:          $text-muted;
$border:              $black-4;  // was #484848
$error:               #ef4444;
```

- [ ] **Step 2: Verify no compilation errors**

```bash
npx astro check
```

Expected: No errors. If any SCSS variable references fail, check that all old variable names are preserved in the legacy aliases block.

- [ ] **Step 3: Commit**

```bash
git add src/styles/theme/_colors.scss
git commit -m "feat: update color tokens to indigo+zinc brand system"
```

---

## Task 2: Font Loading

**Files:**
- Modify: `src/layouts/html/HtmlLayout.astro`

- [ ] **Step 1: Add font preconnects and stylesheet links in `<head>`**

Replace the `<head>` section of `HtmlLayout.astro`:

```astro
---
import Analytics from "@vercel/analytics/astro";
import "@styles/global.scss";
import { Header, Footer } from "../../components";
import { getLangFromUrl } from "../../i18n/utils";

export type Props = {
  metaDescription: string;
  title: string;
};

const { metaDescription, title } = Astro.props;
const lang = getLangFromUrl(Astro.url);
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={metaDescription} />
    <title>{title}</title>
    <!-- Font preconnects -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <!-- Syne (display) + DM Mono (labels/code) via Google Fonts -->
    <link
      href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap"
      rel="stylesheet"
    />
    <!-- Cabinet Grotesk (body) via Fontshare -->
    <link
      href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@300,400,500,700,800&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <Header client:only currentLang={lang} currentPath={Astro.url.pathname} />
    <slot />
    <Footer />
    <Analytics />
  </body>
</html>
```

- [ ] **Step 2: Start dev server and verify fonts load**

```bash
npm run dev
```

Open http://localhost:4321 in browser. Open DevTools → Network → filter "font". Confirm requests to `fonts.googleapis.com` and `api.fontshare.com` succeed (status 200).

- [ ] **Step 3: Commit**

```bash
git add src/layouts/html/HtmlLayout.astro
git commit -m "feat: add Syne, DM Mono, Cabinet Grotesk font loading"
```

---

## Task 3: Font Tokens + Global Base Styles

**Files:**
- Modify: `src/styles/theme/_fonts.scss`
- Modify: `src/styles/global.scss`

- [ ] **Step 1: Replace `_fonts.scss` with new 3-font system**

```scss
// src/styles/theme/_fonts.scss

// === FONT FAMILIES ===
$font-display: 'Syne', sans-serif;       // Headlines, hero name, section titles
$font-body:    'Cabinet Grotesk', sans-serif; // Body copy, descriptions, bio
$font-mono:    'DM Mono', monospace;     // Labels, tags, nav links, code

// Legacy alias used in global.scss and any existing component that references $font-stack
$font-stack: $font-body;

// === TYPE SCALE ===
$font-size-base: 16px;

// Hero name (Syne 800)
$font-size-hero: clamp(40px, 7vw, 76px);

// Section headings (Syne 800)
$font-size-h1: clamp(32px, 5vw, 56px);
$font-size-h2: clamp(24px, 3.5vw, 36px);
$font-size-h3: 18px;

// Body text (Cabinet Grotesk)
$font-size-body: 15px;

// Mono / labels (DM Mono)
$font-size-label: 10px;
$font-size-mono:  13px;

// === LEGACY ALIASES (backward compat with existing SCSS references) ===
$font-size-body-responsive:  $font-size-body;
$font-size-h1-responsive:    $font-size-h1;
$font-size-h2-responsive:    $font-size-h2;
$font-size-medium-responsive: clamp(20px, 2.5vw, 32px);
$font-size-body-mobile:   14px;
$font-size-body-desktop:  16px;
$font-size-h1-mobile:  40px;
$font-size-h1-desktop: 76px;
$font-size-h2-mobile:  28px;
$font-size-h2-desktop: 48px;
$font-size-medium-mobile:  20px;
$font-size-medium-desktop: 32px;
```

- [ ] **Step 2: Replace `global.scss` with updated base styles**

```scss
// src/styles/global.scss
@use './theme/main.scss' as main;
@use 'tailwindcss';

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: main.$font-body;
  font-size: main.$font-size-base;
  line-height: 1.6;
  background-color: main.$primary-background;
  color: main.$primary-text;
  -webkit-font-smoothing: antialiased;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  font-family: main.$font-display;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: main.$white;
}

h1 { font-size: clamp(40px, 7vw, 76px); }
h2 { font-size: clamp(24px, 3.5vw, 48px); letter-spacing: -0.025em; }
h3 { font-size: 18px; font-weight: 600; letter-spacing: -0.01em; }

p {
  font-family: main.$font-body;
  font-size: main.$font-size-body;
  color: main.$text-muted;
  line-height: 1.7;
}

a {
  color: inherit;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
}

main {
  padding: 12px;
}

// Section label pattern: used above every section heading
// Usage: <div class="section-label">01 — Experience</div>
.section-label {
  font-family: main.$font-mono;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: main.$indigo;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  &::after {
    content: '';
    display: block;
    height: 1px;
    width: 32px;
    background: main.$indigo;
    opacity: 0.35;
  }
}
```

- [ ] **Step 3: Verify**

```bash
npx astro check
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/styles/theme/_fonts.scss src/styles/global.scss
git commit -m "feat: replace Bebas Neue with Syne/Cabinet Grotesk/DM Mono type system"
```

---

## Task 4: Header Styles

**Files:**
- Modify: `src/components/header/Header.module.scss`

- [ ] **Step 1: Replace `Header.module.scss`**

```scss
// src/components/header/Header.module.scss
@use "../../styles/theme/main.scss" as main;

.headerContainer {
  display: flex;
  width: 100%;
  height: 96px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 clamp(16px, 2vw, 60px);
  background-color: rgba(9, 9, 11, 0.94);
  backdrop-filter: blur(16px);
  top: 0;
  position: fixed;
  z-index: 1000;
  border-bottom: 1px solid main.$black-4;
}

.headerRight {
  display: flex;
  align-items: center;
  gap: 1rem;
}

nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

nav ul li {
  margin: 0 0.4rem;
  align-items: center;
  padding: 0.5rem;
}

nav ul li a {
  font-family: main.$font-mono;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: main.$text-dim;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: main.$indigo;
  }
}

.header-logo {
  font-family: main.$font-display;
  font-size: clamp(18px, 1.5em, 22px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: main.$white;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: main.$indigo;
  }
}

.menuButton {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: main.$text-muted;
  transition: color 0.2s ease;

  &:hover {
    color: main.$indigo;
  }

  svg {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 768px) {
  .headerContainer {
    padding: 0 clamp(12px, 4vw, 20px);
    height: 80px;
  }

  .headerRight {
    gap: 0.5rem;
  }

  .header-logo {
    font-size: clamp(16px, 5vw, 20px);
  }
}

@media (max-width: 480px) {
  .headerContainer {
    padding: 0 16px;
  }

  .headerRight {
    gap: 0.25rem;
  }
}
```

- [ ] **Step 2: Verify in browser**

With dev server running at http://localhost:4321, check that:
- Header has frosted-glass blur effect
- Logo text is white, turns indigo on hover
- Nav links are small monospace uppercase, turn indigo on hover

- [ ] **Step 3: Commit**

```bash
git add src/components/header/Header.module.scss
git commit -m "feat: update header to frosted glass, Syne logo, mono nav links"
```

---

## Task 5: Button Styles

**Files:**
- Modify: `src/components/buttons/contact/ContactButton.module.scss`
- Modify: `src/components/buttons/custom/CustomButton.module.scss`

- [ ] **Step 1: Replace `ContactButton.module.scss`**

```scss
// src/components/buttons/contact/ContactButton.module.scss
@use "../../../styles/theme/main.scss" as main;

// Primary CTA button (filled indigo)
.button {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 3px;
  border: none;
  background-color: main.$indigo;
  color: main.$black;
  font-family: main.$font-mono;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: main.$indigo-bright;
  }
}

.button .label {
  margin-right: 8px;
  color: main.$black;
  font-family: main.$font-mono;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.contact-icon {
  color: main.$black;
  width: 14px;
  height: 14px;
}

// Ghost icon button (social link buttons)
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid main.$black-4;
  border-radius: 3px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  transition: border-color 0.2s;

  &:hover {
    border-color: main.$indigo;
  }
}
```

- [ ] **Step 2: Replace `CustomButton.module.scss`**

```scss
// src/components/buttons/custom/CustomButton.module.scss
@use "../../../styles/theme/main.scss" as main;

// Form submit button — matches primary button style
.custom-button {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 3px;
  border: none;
  background-color: main.$indigo;
  color: main.$black;
  font-family: main.$font-mono;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: main.$indigo-bright;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;

    &:hover {
      background-color: main.$indigo;
    }
  }
}
```

- [ ] **Step 3: Verify in browser**

Check at http://localhost:4321 that:
- "CONTACT ME" button is indigo rectangle (not lime pill)
- Form submit button matches the same style
- Icon buttons (GitHub, LinkedIn) are small bordered squares

- [ ] **Step 4: Commit**

```bash
git add src/components/buttons/contact/ContactButton.module.scss \
        src/components/buttons/custom/CustomButton.module.scss
git commit -m "feat: rebrand buttons — indigo primary, ghost icon style"
```

---

## Task 6: Social Icon Sections

**Files:**
- Modify: `src/components/sections/contact/ContactSection.module.scss`
- Modify: `src/components/sections/form/components/connect/ConnectSection.module.scss`

- [ ] **Step 1: Replace `ContactSection.module.scss`**

```scss
// src/components/sections/contact/ContactSection.module.scss
@use "../../../styles/theme/main.scss" as main;

.contact-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0 clamp(4px, 1rem, 10px);
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
}

.contact-section .logo-icon {
  width: 36px;
  height: 36px;
  fill: main.$text-muted;
  transition: fill 0.2s;

  &:hover {
    fill: main.$indigo;
  }
}
```

- [ ] **Step 2: Replace `ConnectSection.module.scss`**

```scss
// src/components/sections/form/components/connect/ConnectSection.module.scss
@use "../../../../styles/theme/main.scss" as main;

.connect-section {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
}

.logo-icon {
  width: 32px;
  height: 32px;
  fill: main.$text-muted;
  transition: fill 0.2s;

  &:hover {
    fill: main.$indigo;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/contact/ContactSection.module.scss \
        src/components/sections/form/components/connect/ConnectSection.module.scss
git commit -m "feat: update social icon fill to indigo on hover"
```

---

## Task 7: Tag Component — Core Variant

**Files:**
- Modify: `src/components/tag/Tag.astro`
- Modify: `src/components/tag/Tag.module.scss`

- [ ] **Step 1: Update `Tag.astro` to accept a `core` prop**

```astro
---
// src/components/tag/Tag.astro
type Props = {
  label: string;
  core?: boolean;
};
import styles from "./Tag.module.scss";
const { label, core = false } = Astro.props;
---

<div class={`${styles["tag"]} ${core ? styles["tag--core"] : ""}`}>
  <p>{label}</p>
</div>
```

- [ ] **Step 2: Replace `Tag.module.scss`**

```scss
// src/components/tag/Tag.module.scss
@use "../../styles/theme/main.scss" as main;

.tag {
  display: inline-flex;
  align-items: center;
  font-family: main.$font-mono;
  font-size: 10px;
  letter-spacing: 0.06em;
  padding: 5px 10px;
  border-radius: 3px;
  border: 1px solid main.$black-4;
  color: main.$text-muted;

  p {
    font-family: main.$font-mono;
    font-size: 10px;
    color: inherit;
    line-height: 1;
    letter-spacing: inherit;
  }
}

// Core/featured skill — highlighted in indigo
.tag--core {
  border-color: rgba(129, 140, 248, 0.4);
  color: main.$indigo-bright;
  background: main.$indigo-glow;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/tag/Tag.astro src/components/tag/Tag.module.scss
git commit -m "feat: Tag component — add core variant with indigo highlight"
```

---

## Task 8: Experience Card

**Files:**
- Modify: `src/components/cards/experience/ExperienceCard.module.scss`

- [ ] **Step 1: Replace `ExperienceCard.module.scss`**

```scss
// src/components/cards/experience/ExperienceCard.module.scss
@use "../../../styles/theme/main.scss" as main;

.experience-card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: main.$black-3;
  border-left: 2px solid main.$indigo;
  padding: 16px 18px;
  border-radius: 0 3px 3px 0;
}

.flex-row-between {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.experience-title {
  font-family: main.$font-display;
  font-size: 15px;
  font-weight: 700;
  color: main.$white;
  letter-spacing: -0.01em;
}

.experience-subtitle {
  font-family: main.$font-mono;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: main.$indigo;
}
```

- [ ] **Step 2: Verify in browser**

Check the experience section at http://localhost:4321. Each card should have:
- Dark card background (`#18181b`)
- Indigo left border
- White role title in Syne
- Indigo company name in small mono uppercase

- [ ] **Step 3: Commit**

```bash
git add src/components/cards/experience/ExperienceCard.module.scss
git commit -m "feat: experience card — indigo left border, dark bg, Syne role title"
```

---

## Task 9: Form Input Styles

**Files:**
- Modify: `src/components/form/inputs/inputText/InputText.module.scss`

- [ ] **Step 1: Replace `InputText.module.scss`**

```scss
// src/components/form/inputs/inputText/InputText.module.scss
@use "../../../../styles/theme/main.scss" as main;

.input-text-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-family: main.$font-mono;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: main.$text-dim;
}

.input-text,
.input-textarea {
  background-color: main.$black-3;
  color: main.$primary-text;
  border: 1px solid main.$black-4;
  border-radius: 3px;
  height: 46px;
  padding: 0 12px;
  font-family: main.$font-body;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: main.$indigo;
  }

  &::placeholder {
    color: main.$text-dim;
  }
}

.input-textarea {
  height: 148px;
  padding: 12px;
  resize: vertical;

  @media screen and (max-width: 1024px) {
    height: 190px;
  }
}

.input-error-message {
  font-family: main.$font-mono;
  font-size: 10px;
  letter-spacing: 0.04em;
  color: main.$error;
  margin-top: 4px;
  min-height: 1.2rem;
}
```

- [ ] **Step 2: Verify in browser**

Navigate to the contact form (scroll to bottom). Inputs should show:
- Mono uppercase labels in zinc dim color
- Dark background (`#18181b`) input fields
- Indigo border on focus

- [ ] **Step 3: Commit**

```bash
git add src/components/form/inputs/inputText/InputText.module.scss
git commit -m "feat: form inputs — dark bg, mono labels, indigo focus ring"
```

---

## Task 10: Divider

**Files:**
- Modify: `src/components/divider/Divider.module.scss`

- [ ] **Step 1: Update `Divider.module.scss`**

```scss
// src/components/divider/Divider.module.scss
@use "../../styles/theme/main.scss" as main;

.divider {
  width: 100%;
  height: 1px;
  border: none;
  background-color: main.$black-4;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/divider/Divider.module.scss
git commit -m "feat: divider — update border color to black-4"
```

---

## Task 11: Footer

**Files:**
- Modify: `src/components/footer/Footer.astro`
- Modify: `src/components/footer/Footer.module.scss`

- [ ] **Step 1: Update `Footer.astro` markup**

```astro
---
// src/components/footer/Footer.astro
import styles from "./Footer.module.scss";
---

<footer class={styles.footer}>
  <div class={styles["footer-logo"]}>HM<span>.</span></div>
  <p class={styles["footer-info"]}>© 2025 Hector Matus · Built with Astro</p>
</footer>
```

- [ ] **Step 2: Replace `Footer.module.scss`**

```scss
// src/components/footer/Footer.module.scss
@use "../../styles/theme/main.scss" as main;

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 40px clamp(16px, 4vw, 64px);
  border-top: 1px solid main.$black-4;
  background-color: main.$primary-background;
}

.footer-logo {
  font-family: main.$font-display;
  font-size: 22px;
  font-weight: 800;
  color: main.$white;
  letter-spacing: -0.03em;

  span {
    color: main.$indigo;
  }
}

.footer-info {
  font-family: main.$font-mono;
  font-size: 10px;
  color: main.$text-dim;
  letter-spacing: 0.1em;
}
```

- [ ] **Step 3: Verify in browser**

Footer should show `HM.` with the dot in indigo on the left, and monospace copyright on the right.

- [ ] **Step 4: Commit**

```bash
git add src/components/footer/Footer.astro src/components/footer/Footer.module.scss
git commit -m "feat: footer — brand logo HM. pattern, mono copyright"
```

---

## Task 12: Section Label Pattern

**Files:**
- Modify: `src/layouts/hero/HeroLayout.astro`
- Modify: `src/components/sections/projects/ProjectsSection.astro`

The brand brief defines a consistent section label pattern: a small mono indigo label above every section heading (e.g. `01 — Experience` → `Where I've worked.`). The global `.section-label` class added in Task 3 handles styling.

Also, capabilities tags need core props for core JS skills: `Javascript`, `Typescript`, `React`, `React Native`.

- [ ] **Step 1: Update `HeroLayout.astro`**

```astro
---
import styles from "./HeroLayout.module.scss";
import {
  ContactSection,
  Divider,
  ProjectsSection,
  FormSection,
} from "../../components";
import {
  heroData,
  getProjectsWithTranslations,
  getExperienceWithTranslations,
} from "@data/i18n-data";
import { ImageWithLoader } from "@components/image-loader/ImageLoader";
import { Tag } from "@components/tag";
import ExperienceCard from "@components/cards/experience/ExperienceCard.astro";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const { capabilities } = heroData;
const projectsList = getProjectsWithTranslations(lang);
const experienceList = getExperienceWithTranslations(lang);

const CORE_SKILLS = new Set(["Javascript", "Typescript", "React", "React Native"]);
---

<main class={styles.container}>
  <div class={styles["hero-section-container"]}>
    <div class={styles["hero-information"]}>
      <div class="section-label">Full Stack Developer · El Salvador 🇸🇻</div>
      <h1>{t("hero.title")}</h1>
      <p class={styles["hero-description"]}>
        {t("hero.description")}
      </p>
      <ContactSection client:load />
    </div>
    <div class={styles["image"]}>
      <ImageWithLoader
        loading="eager"
        src="/images/profile/profile.webp"
        alt="Hector Matus"
      />
    </div>
  </div>
  <Divider />
  <div class={styles["projects-section-container"]}>
    <ProjectsSection projectsList={projectsList} />
  </div>
  <Divider />
  <div id="about-section" class={styles["about-section-container"]}>
    <div class={styles["about-info-container"]}>
      <div class={styles["about-info"]}>
        <div class="section-label">01 — Capabilities</div>
        <h2>{t("capabilities.title").toUpperCase()}</h2>
      </div>
      <div class={styles["about-info"]}>
        <p>
          {t("capabilities.description")}
        </p>
        <div class={styles["about-tags-container"]}>
          {capabilities.capabilitiesList.map((tag) => (
            <Tag label={tag} core={CORE_SKILLS.has(tag)} />
          ))}
        </div>
      </div>
    </div>
    <Divider />
    <div class={styles["about-info-container"]}>
      <div class={styles["about-info"]}>
        <div class="section-label">02 — Experience</div>
        <h2>{t("experience.title").toUpperCase()}</h2>
      </div>
      <div class={`${styles["about-info"]} ${styles["experience-container"]}`}>
        {experienceList.map((item) => <ExperienceCard item={item} />)}
      </div>
    </div>
  </div>
  <Divider />
  <div id="form-section" class={styles["form-section-container"]}>
    <FormSection client:load currentLang={lang} />
  </div>
</main>
```

- [ ] **Step 2: Update `ProjectsSection.astro`**

```astro
---
export type Props = {
  projectsList: ProjectI[];
};
import type { ProjectI } from "src/types/project";
import { Project } from "./components";
import styles from "./ProjectsSection.module.scss";
import { getLangFromUrl, useTranslations } from "../../../i18n/utils";

const { projectsList } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---

<section class={styles["projects-section-container"]} id="projects">
  <div class="section-label">03 — Projects</div>
  <h2>{t("projects.title")}</h2>
  <p>
    {t("projects.description")}
  </p>
  <div class={styles["projects-list-container"]}>
    {projectsList.map((project) => <Project project={project} />)}
  </div>
</section>
```

- [ ] **Step 3: Verify in browser**

Check http://localhost:4321 that:
- Hero section has "Full Stack Developer · El Salvador 🇸🇻" label in small indigo mono above the h1
- Capabilities section has "01 — Capabilities" label above heading
- Experience section has "02 — Experience" label above heading
- Projects section has "03 — Projects" label above heading
- Core skills (Javascript, Typescript, React, React Native) appear in indigo highlight; others are zinc gray

- [ ] **Step 4: Commit**

```bash
git add src/layouts/hero/HeroLayout.astro \
        src/components/sections/projects/ProjectsSection.astro
git commit -m "feat: add section labels and core skill highlights"
```

---

## Self-Review

**Spec coverage check:**

| Brand Brief requirement | Task |
|------------------------|------|
| Zinc-black color palette (`#09090b`–`#3f3f46`) | Task 1 |
| Single indigo accent (`#818cf8`, bright, deep, dim, glow variants) | Task 1 |
| Text scale (`#fafafa`, `#a1a1aa`, `#52525b`) | Task 1 |
| Syne 800 display font | Tasks 2, 3 |
| Cabinet Grotesk body font | Tasks 2, 3 |
| DM Mono label/code font | Tasks 2, 3 |
| Global type scale (hero 76px → label 10px) | Task 3 |
| `.section-label` utility class | Task 3 |
| Frosted glass sticky header | Task 4 |
| Mono nav links in indigo on hover | Task 4 |
| Primary button (indigo filled, mono, uppercase) | Task 5 |
| Ghost icon buttons (bordered square) | Task 5 |
| Form submit button matching primary | Task 5 |
| Social icon fill → indigo on hover | Task 6 |
| Tag rectangle style (not pill) | Task 7 |
| Tag core variant (indigo highlight) | Task 7 |
| Experience card — left indigo border | Task 8 |
| Experience card — dark bg, Syne role, mono company | Task 8 |
| Form inputs — dark bg, mono labels, indigo focus | Task 9 |
| Divider — `$black-4` border | Task 10 |
| Footer logo `HM.` pattern | Task 11 |
| Section label pattern above all headings | Task 12 |
| Core skill tags highlighted | Task 12 |

**Gaps:** The brand brief wireframes show a dedicated About section with profile photo + badge. The current layout already has a profile image; this plan does not restructure that layout — only updates its visual styling. That is a future content/layout task beyond the styling scope.
