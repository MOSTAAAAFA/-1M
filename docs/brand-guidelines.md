# 1M Motors — Brand Guidelines v1.0

> Last updated: 2026-08-15
> Status: Active
> Category: Luxury Automotive Dealership

## Quick Reference

| Element | Value |
|---------|-------|
| Primary Color | #C9A84C (Gold) |
| Background | #050507 (Deep Black) |
| Primary Display Font | Cormorant Garamond |
| UI Font | Space Grotesk |
| Body Font | Inter |
| Voice | Precision, Luxury, Understated Power |

---

## 1. Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Gold | #C9A84C | rgb(201,168,76) | Brand signature, CTAs, key accents |
| Gold Light | #E0C06A | rgb(224,192,106) | Hover states, gradients |
| Gold Bright | #F4D03F | rgb(244,208,63) | Emphasis, highlights, shimmer |
| Deep Black | #050507 | rgb(5,5,7) | Primary background |
| Black 2 | #0A0A0E | rgb(10,10,14) | Secondary surfaces |
| Black 3 | #0F0F15 | rgb(15,15,21) | Tertiary surfaces |

### Surface Layers (Depth Hierarchy)

| Name | Hex | Usage |
|------|-----|-------|
| Surface | #111117 | Base elevated surface |
| Surface 2 | #18181F | Mid elevated surface |
| Surface 3 | #1F1F28 | High elevated surface |

### Neutral / Text Palette

| Name | Hex | Usage |
|------|-----|-------|
| White (warm) | #F0EDE8 | Primary text |
| Text Secondary | rgba(240,237,232,0.62) | Secondary text (AA 4.5:1 on black) |
| Text Muted | rgba(240,237,232,0.48) | Labels/captions only, never < 12px |
| Text Disabled | rgba(240,237,232,0.32) | Disabled states |
| Gold Text | #C9A84C | AA on near-black (9.2:1) |
| Gold Text Dim | #B5923C | Gold on lighter surfaces (5.1:1) |

### Semantic Colors

| State | Hex | Usage |
|-------|-----|-------|
| Success | #4ADE80 | In stock, confirmations |
| Error | #EF4444 | Pre-order, errors, destructive |

### Accessibility

- Gold text on deep black: 9.2:1 contrast ratio (AAA)
- Secondary text rgba(240,237,232,0.62) on black: ≥4.5:1 (AA)
- All interactive elements meet WCAG 2.1 AA
- Focus ring: 2px solid #C9A84C, offset 2px
- Min touch target: 44×44px

---

## 2. Typography

### Font Stack

```css
--font-display: 'Cormorant Garamond', Georgia, serif;
--font-ui: 'Space Grotesk', sans-serif;
--font-body: 'Inter', sans-serif;
```

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| H1 / Hero | clamp(2.9rem, 6.4vw, 6rem) | 300 | 1.12 | -0.5px |
| H2 | 32px | 500 | 1.2 | -0.5px |
| H3 | 26px | 600 | 1.25 | 0 |
| Body | 15-18px | 300-400 | 1.65-1.75 | 0.2px |
| Eyebrow | 10px | 700 | 1.4 | 5px uppercase |
| Label | 9-10px | 500-600 | 1.4 | 2.5px uppercase |

### Font Loading

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### Usage Rules

- Display font for headlines and big numbers (luxury serif feel)
- UI font for buttons, labels, eyebrow text, navigation
- Body font for paragraphs and description text
- Letter-spacing (uppercase tracking) is a signature brand cue: 2-5px on labels

---

## 3. Logo Usage

### Variants

| Variant | Usage |
|---------|-------|
| Brand1M mark (gold circle "1M") | Navigation, hero eyebrow, section markers |
| "1M MOTORS" wordmark | Headers, footers |
| Brand watermark | Full-bleed background texture |

### Clear Space

Minimum clear space = height of the logo mark on all sides.

### Minimum Size

| Context | Minimum Width |
|---------|---------------|
| Digital - Full | 120px |
| Digital - Mark | 24px |

### Don'ts

- Don't recolor outside the gold (#C9A84C) / black / white palette
- Don't add drop shadows beyond the standard gold glow
- Don't place on busy backgrounds without contrast
- Don't use emoji to replace the mark

---

## 4. Voice & Tone

### Brand Personality

| Trait | Description |
|-------|-------------|
| **Precise** | Numbers matter: horsepower, 0-60, top speed |
| **Luxurious** | Confident, understated, never shouty |
| **Authoritative** | Expert on the machinery, not salesy |
| **Exclusive** | "Private allocation", "by appointment", scarcity done with taste |

### Voice Chart

| Trait | We Are | We Are Not |
|-------|--------|------------|
| Precise | Data-driven specs | Vague marketing claims |
| Luxurious | Refined, elegant | Flashy, gaudy |
| Authoritative | Expert, knowledgeable | Arrogant |
| Exclusive | Curated, invitation-like | Pressure-sales |

### Tone by Context

| Context | Tone | Example |
|---------|------|---------|
| Hero | Aspirational, cinematic | "Where Engineering Becomes Emotion." |
| Product | Precise, spec-led | "690 hp · 3.0s · 205 mph" |
| Finance | Trustworthy, transparent | "From $274,500" |
| Errors | Calm, solution-focused | "Your session has expired. Sign in to continue." |

### Prohibited Terms

| Avoid | Reason |
|-------|--------|
| Revolutionary | Overused |
| Best-in-class | Vague claim |
| Amazing/Incredible | Not precise |
| Cheapest/Best price | Undercuts luxury |
| Synergy/Leverage | Corporate jargon |

---

## 5. Imagery Guidelines

### Photography Style

- **Lighting:** Studio/cinematic — dramatic side lighting, low-key, high contrast
- **Subjects:** Vehicles in motion or dramatic studio setups; dark backgrounds
- **Color treatment:** Gold accents on deep black; warm highlights (#F4D03F)
- **Composition:** Hero-centered, three-quarter angles, long exposure light trails

### Signatures

- Gold dust / bokeh particles on dark
- Ken Burns slow-zoom on hero media
- Gold gradient text for numbers
- Thin gold rules/dividers (1px, fading gradients)

### Icons

- Style: Custom line SVG icons, stroke 1.5-2px
- Fill: None
- Color: #C9A84C on dark surfaces, rgba(240,237,232,0.62) for muted
- **Emojis are forbidden as icons** — always use SVG

---

## 6. Design Components

### Buttons

| Type | Background | Text | Border |
|------|------------|------|--------|
| Gold (primary) | gold gradient (135deg #C9A84C→#E0C06A→#F4D03F) | #050507 | none |
| Ghost | transparent | #F0EDE8 | 1px rgba(240,237,232,0.25) |

- All buttons: cursor pointer, ripple on click, hover lift via cubic-bezier(0.22,1,0.36,1)

### Spacing Scale

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 20px |
| 2xl | 24px |
| 3xl | 32px |
| 4xl | 40px |
| 5xl | 48px |
| 6xl | 64px |
| 7xl | 80px |

### Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 8px |
| Cards | 12-20px |
| Inputs | 8px |
| Modals | 20px |
| Pills/Tags | 9999px |

### Shadows

| Level | Value |
|-------|-------|
| sm | 0 4px 16px rgba(0,0,0,0.4) |
| md | 0 8px 40px rgba(0,0,0,0.55) |
| lg | 0 20px 80px rgba(0,0,0,0.7) |
| gold | 0 0 40px rgba(201,168,76,0.20) |
| goldLg | 0 0 80px rgba(201,168,76,0.30) |

---

## 7. Motion Language

- **Easing:** cubic-bezier(0.22, 1, 0.36, 1) — "expo out" signature
- **Durations:** 0.15s (micro), 0.35s (standard), 0.5s (emphasis), 0.7s (cinematic)
- **Scroll reveal:** fadeUp / fadeInUp / letter reveal, staggered
- **Ken Burns:** slow zoom on hero media when not reduced-motion
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables Ken Burns, light sweeps, marquees
- Keep transitions 150-300ms for hover; never instant state changes

---

## 8. AI Image Generation — Base Prompt

Always prepend:

```
Cinematic luxury automotive photography. Deep black background (#050507). Gold accent lighting (#C9A84C, #F4D03F). Low-key studio lighting, dramatic side light, high contrast, subtle warm glow, film grain, premium mood. Vehicle in three-quarter hero angle.
```

### Visual Don'ts

| Avoid | Reason |
|-------|--------|
| Bright white backgrounds | Breaks dark luxury feel |
| Neon colors | Off-brand |
| Busy/cluttered scenes | Brand = restraint |
| Emojis/text overlays in generated art | Text is added in design |

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-08-15 | Initial guidelines |
