# Hector Matus Portfolio — Brand Guidelines

Use this skill whenever adding or modifying UI components, styles, or content in this portfolio. Every implementation decision must align with Brand Brief v2.

---

## Color System

All colors live in `src/styles/theme/_colors.scss`. Import via `@use "../../styles/theme/main.scss" as main`.

| Token | Value | Use |
|-------|-------|-----|
| `main.$black` / `main.$primary-background` | `#09090b` | Page background |
| `main.$black-2` / `main.$secondary-background` | `#111113` | Section backgrounds |
| `main.$black-3` | `#18181b` | Cards, inputs |
| `main.$black-4` / `main.$border` | `#27272a` | Borders, dividers |
| `main.$indigo` / `main.$secondary` | `#818cf8` | Primary accent — labels, borders, CTAs |
| `main.$indigo-bright` | `#a5b4fc` | Hover states, code highlights |
| `main.$indigo-deep` | `#6366f1` | Deep CTA alternative |
| `main.$indigo-dim` | `rgba(129,140,248,0.15)` | Core tag backgrounds |
| `main.$indigo-glow` | `rgba(129,140,248,0.08)` | Subtle glows |
| `main.$white` / `main.$primary-text` | `#fafafa` | Headings |
| `main.$text-muted` / `main.$primary-light-text` | `#a1a1aa` | Body text |
| `main.$text-dim` | `#52525b` | Placeholder, secondary labels |
| `main.$error` | `#ef4444` | Error states |

**Rule:** Indigo is the ONLY accent color. Never introduce secondary accent colors (no green, orange, red for decoration). Every indigo appearance should carry visual weight.

---

## Typography

Three fonts, each with a specific role:

| Font | SCSS token | Role |
|------|-----------|------|
| Syne 800 | `main.$font-display` | All headings (h1–h3), logo, section titles |
| Cabinet Grotesk 400 | `main.$font-body` | All body text, descriptions, form text |
| DM Mono 400 | `main.$font-mono` | Labels, tags, nav links, code, metadata |

### Type scale

| Level | Size | Font | Weight | Letter-spacing |
|-------|------|------|--------|----------------|
| Hero h1 | `clamp(40px, 7vw, 76px)` | Syne | 800 | `-0.03em` |
| Section h2 | `clamp(24px, 3.5vw, 48px)` | Syne | 800 | `-0.025em` |
| Card title h3 | `18px` | Syne | 600 | `-0.01em` |
| Body | `15px` | Cabinet Grotesk | 400 | normal |
| Mono label | `10px` | DM Mono | 400 | `0.12–0.2em` |

**Rule:** Never use Bebas Neue — it was the v1 font. Never use `font-weight: 600` on display headings (always 800). Body text uses Cabinet Grotesk, not Syne.

---

## Section Label Pattern

Every section uses a consistent label+heading pattern:

```astro
<div class="section-label">01 — Experience</div>
<h2>Where I've worked.</h2>
```

The `.section-label` global class (defined in `src/styles/global.scss`) provides:
- DM Mono, 10px, `letter-spacing: 0.2em`, uppercase, indigo color
- A 32px indigo line after the text (`::after` pseudo-element)

**Rule:** Always add a `.section-label` div before section `<h2>` elements. Labels use the format `NN — Section Name`.

---

## Component Patterns

### Buttons

Three variants — implement via CSS classes, not new components:

```scss
// Primary (indigo filled)
background-color: main.$indigo;
color: main.$black;
font-family: main.$font-mono;
font-size: 11px;
letter-spacing: 0.08em;
text-transform: uppercase;
padding: 10px 20px;
border-radius: 3px;
border: none;

// Outline (indigo border)
background: transparent;
border: 1px solid main.$indigo;
color: main.$indigo;
// same font/size/padding as primary

// Ghost (subtle border)
background: transparent;
border: 1px solid main.$black-4;
color: main.$text-muted;
// same font/size/padding as primary
```

**Rule:** No pill-shaped buttons (no `border-radius: 100px`). Button text is always DM Mono uppercase. Never use the lime green `#D3E97A` from v1.

### Tags

```scss
// Normal tag
border: 1px solid main.$black-4;
color: main.$text-muted;
font-family: main.$font-mono;
font-size: 10px;
padding: 5px 10px;
border-radius: 3px;

// Core/featured tag (pass core={true} prop to Tag component)
border-color: rgba(129, 140, 248, 0.4);
color: main.$indigo-bright;
background: main.$indigo-glow;
```

**Rule:** Tags are rectangular (3px radius), not pills. Core skills (React, TypeScript, React Native, JavaScript) use the indigo core variant.

### Experience Cards

```scss
background: main.$black-3;
border-left: 2px solid main.$indigo;
padding: 16px 18px;
border-radius: 0 3px 3px 0;
```

Role title: Syne 700 white. Company: DM Mono uppercase indigo.

### Form Inputs

```scss
background-color: main.$black-3;
border: 1px solid main.$black-4;
border-radius: 3px;
font-family: main.$font-body;
font-size: 15px;

// Focus
border-color: main.$indigo;
```

Labels: DM Mono, 10px, `letter-spacing: 0.12em`, uppercase, `main.$text-dim`.

---

## Do / Don't

**Do:**
- Lead section content with impact metrics ("40% bundle reduction") not just job titles
- Use indigo for all interactive states (hover, focus, active borders)
- Let space breathe — generous padding between sections
- Use monospace for all metadata (dates, labels, tags, counts)
- Specific contributions, not generic role descriptions

**Don't:**
- Add a secondary accent color (no teal, orange, green accents)
- Use animations that distract from content
- Use `text-align: justify` on body text
- Use lime green (`#D3E97A`) — it was removed in v2
- Round buttons into pills (no `border-radius: 100px`)
- Use Bebas Neue

---

## Adding New Components

Checklist before any new component:

1. `ComponentName/ComponentName.tsx` (or `.astro`) — component file
2. `ComponentName/ComponentName.module.scss` — SCSS module, import theme with `@use "../../styles/theme/main.scss" as main`
3. `ComponentName/index.ts` — re-export for barrel imports
4. Add to parent `index.ts` barrel export
5. All color values come from theme tokens — no hardcoded hex values in component SCSS
6. All font families come from `main.$font-display`, `main.$font-body`, or `main.$font-mono`

---

## File Quick Reference

| Purpose | File |
|---------|------|
| Color tokens | `src/styles/theme/_colors.scss` |
| Font tokens + scale | `src/styles/theme/_fonts.scss` |
| Global base styles + `.section-label` | `src/styles/global.scss` |
| Theme barrel export | `src/styles/theme/main.scss` |
| Font loading links | `src/layouts/html/HtmlLayout.astro` |
| i18n strings (en + es) | `src/i18n/ui.ts` |
