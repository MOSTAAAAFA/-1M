# Design System Master File — 1M Motors

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** 1M Motors — Luxury Car Dealership
**Generated:** 2026-08-15
**Category:** Automotive/Car Dealership — Premium Luxury
**Source of Truth:** `assets/design-tokens.json` + `assets/design-tokens.css` + `frontend/src/styles/designTokens.js`

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#050507` | `--color-background` |
| Foreground / Text | `#F0EDE8` | `--color-foreground` |
| Primary (Gold) | `#C9A84C` | `--color-primary` |
| Primary Hover | `#E0C06A` | `--color-primary-hover` |
| Primary Active | `#F4D03F` | `--color-primary-active` |
| On Primary | `#050507` | `--color-on-primary` |
| Secondary Text | `rgba(240,237,232,0.62)` | `--color-text-secondary` |
| Muted | `rgba(240,237,232,0.48)` | `--color-text-muted` |
| Surface | `#111117` | `--color-surface` |
| Surface Raised | `#18181F` | `--color-surface-raised` |
| Border | `rgba(255,255,255,0.06)` | `--color-border` |
| Success | `#4ADE80` | `--color-success` |
| Destructive | `#EF4444` | `--color-destructive` |

**Color Notes:** Dark luxury + signature gold. Gold text on black = 9.2:1 (AAA). Never use light/red palettes.

### Typography

- **Display Font:** Cormorant Garamond (headlines, hero, big numbers)
- **UI Font:** Space Grotesk (buttons, labels, nav, eyebrows)
- **Body Font:** Inter (paragraphs)
- **Mood:** luxury, cinematic, minimal, precise, understated power
- **Signature cue:** uppercase labels with 2-5px letter-spacing in gold

### Spacing Variables (8pt grid)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Tight gaps |
| `--space-sm` | 8px | Icon gaps, inline spacing |
| `--space-md` | 12px | Standard padding |
| `--space-lg` | 16px | Element gaps |
| `--space-xl` | 20px | Compact cards |
| `--space-2xl` | 24px | Card padding |
| `--space-3xl` | 32px | Section padding |
| `--space-5xl` | 48px | Section gaps |
| `--space-6xl` | 64px | Large section margins |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 4px 16px rgba(0,0,0,0.4)` | Subtle lift |
| `--shadow-md` | `0 8px 40px rgba(0,0,0,0.55)` | Cards, buttons |
| `--shadow-lg` | `0 20px 80px rgba(0,0,0,0.7)` | Modals, hero |
| `--shadow-gold` | `0 0 40px rgba(201,168,76,0.20)` | Gold emphasis |
| `--shadow-gold-lg` | `0 0 80px rgba(201,168,76,0.30)` | Hero, featured |

---

## Component Specs

### Buttons

```css
/* Gold Primary Button */
.btn-gold {
  background: linear-gradient(135deg, #C9A84C, #E0C06A 50%, #F4D03F);
  color: #050507;
  padding: 12px 32px;
  border-radius: 6px;
  font-weight: 600;
  transition: 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.btn-gold:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 40px rgba(201,168,76,0.20);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: #F0EDE8;
  border: 1px solid rgba(240,237,232,0.25);
  padding: 12px 32px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #111117;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.55);
  transition: 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 80px rgba(0,0,0,0.7);
}
```

### Inputs

```css
.input {
  background: #0A0A0E;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 15px;
  color: #F0EDE8;
  transition: border-color 0.25s ease;
}

.input:focus {
  border-color: #C9A84C;
  outline: none;
  box-shadow: 0 0 0 3px rgba(201,168,76,0.25);
}
```

### Glass

```css
.glass {
  background: rgba(17,17,23,0.75);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.06);
}
```

---

## Style Guidelines

**Style:** Cinematic Luxury / Motion-Driven

**Keywords:** Ken Burns, parallax, gold shimmer, letter reveal, glassmorphism, noise texture, light sweep, staggered reveals, ripple buttons

**Key Effects:** Scroll anim (Intersection Observer) 300-400ms, Ken Burns slow zoom, gold dust particles, letter-by-letter headline, ripple CTA

### Motion Rules

- Signature easing: `cubic-bezier(0.22, 1, 0.36, 1)` (expo out)
- Durations: 0.15s micro / 0.35s standard / 0.5s emphasis / 0.7s cinematic
- Hover 150-300ms; never instant state changes
- `prefers-reduced-motion: reduce` → disable Ken Burns, light sweeps, marquees, dust
- No emojis as icons — SVG line icons (#C9A84C), stroke 1.5-2px

### Page Pattern

**Pattern Name:** Hero-Centric Luxury

- **Conversion Strategy:** Cinematic hero with one primary CTA. Specs strip below hero (Power / 0-60 / Top Speed / Powertrain). Collection → Featured → Brands → CTA.
- **CTA Placement:** Hero primary CTA + sticky nav CTA
- **Section Order:** Full-bleed cinematic hero (headline + accent + specs strip) > Stats bar > Brand marquee > Featured collection > Brands > Collection preview > Allocation countdown > CTA banner

---

## Anti-Patterns (Do NOT Use)

- ❌ Emojis as icons (use SVG: stroke 1.5-2px, #C9A84C)
- ❌ Light-mode palettes (red/blue defaults) — this brand is dark + gold
- ❌ Missing cursor:pointer on clickable elements
- ❌ Layout-shifting hovers (scale transforms that shift layout)
- ❌ Low contrast text (< 4.5:1)
- ❌ Instant state changes (always 150-300ms transitions)
- ❌ Invisible focus states (focus ring: 2px solid #C9A84C, offset 2px)
- ❌ Hardcoded hex in components — use tokens/designTokens.js

---

## Pre-Delivery Checklist

- [ ] No emojis used as icons (SVG only)
- [ ] All icons consistent line style (stroke 1.5-2px, gold)
- [ ] `cursor:pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Text contrast 4.5:1 minimum (gold on black 9.2:1)
- [ ] Focus states visible for keyboard nav (2px gold ring)
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars (nav 72px)
- [ ] No horizontal scroll on mobile
