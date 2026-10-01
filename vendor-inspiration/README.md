# vendor-inspiration — free reference material (OUTSIDE the production bundle)

Nothing in this folder is imported by `frontend/src`. It exists so the design
techniques used in this project can be traced back to a free, permissively
licensed source, and so upstream patterns can be re-checked later.

CRA only bundles what is reachable from `src/index.js`, so this folder cannot
affect the build. It is excluded from Tailwind's `content` globs.

---

## 1. Claude skills — `.claude/skills/` (project root)

| Skill | Category | Source | License |
|---|---|---|---|
| `frontend-design` | DESIGN | `github.com/anthropics/skills` | Apache-2.0 |
| `theme-factory` | DESIGN | `github.com/anthropics/skills` | Apache-2.0 |
| `canvas-design` | DESIGN | `github.com/anthropics/skills` | Apache-2.0 |
| `brand-guidelines` | DESIGN | `github.com/anthropics/skills` | Apache-2.0 |
| `web-artifacts-builder` | DESIGN | `github.com/anthropics/skills` | Apache-2.0 |
| `design` | DESIGN | `nextlevelbuilder/ui-ux-pro-max-skill` | MIT |
| `design-system` | DESIGN | `nextlevelbuilder/ui-ux-pro-max-skill` | MIT |
| `ui-ux-pro-max` | DESIGN + TESTING | `nextlevelbuilder/ui-ux-pro-max-skill` v2.13.0 | MIT |
| `ui-styling` | DESIGN | `nextlevelbuilder/ui-ux-pro-max-skill` | MIT |
| `webapp-testing` | TESTING | `github.com/anthropics/skills` | Apache-2.0 |
| `design-audit-stack` | TESTING | `nextlevelbuilder/ui-ux-pro-max-skill` (`stack/`) | MIT |
| `better-accessibility` | TESTING | locally curated, markdown-only, no upstream LICENSE file | n/a |
| `algorithmic-art` | VISUAL | `github.com/anthropics/skills` | Apache-2.0 |
| `animate` | VISUAL | locally curated (Emil Kowalski animation doctrine), markdown-only | n/a |
| `make-interfaces-feel-better` | VISUAL | locally curated, markdown-only | n/a |

Notes
- The upstream `anthropics/skills` `docx` / `pdf` / `pptx` / `xlsx` skills were
  deliberately **skipped**: they are source-available, not open source, and
  irrelevant to a car storefront.
- The `design` skill's logo/CIP sub-commands call a paid Gemini API. They are
  installed for their token and layout methodology only. **No paid service is
  configured or called anywhere in this project.**
- `animate`, `make-interfaces-feel-better` and `better-accessibility` are
  knowledge-only markdown. They contain no scripts and no executables, and were
  reviewed before install. They carry no upstream license file — noted here
  rather than silently vendored.
- `ui-ux-pro-max-skill-main/` in the repo root is the full upstream checkout
  (MIT) the skills above were copied from. It is reference material only.

## 2. Runtime libraries actually installed in `frontend/package.json`

Already present before this work; verified as the correct free choices.

| Package | License | Role here |
|---|---|---|
| `framer-motion` | MIT | Route/page transitions, reveals, layout animation |
| `gsap` + `@gsap/react` | GreenSock standard "no charge" license | scroll-driven timelines, pinning |
| `@studio-freight/lenis` | MIT | smooth scroll (`GlobalPremiumEffects.jsx`) |
| `react-intersection-observer` | MIT | reveal + lazy-mount gating |
| `@radix-ui/*` | MIT | accessible primitives (dialog, dropdown, tabs, tooltip, scroll-area, progress, separator, slot) |
| `tailwindcss` | MIT | utility layer |
| `tailwindcss-animate` | MIT | enter/exit keyframes (added this pass) |
| `@playwright/test` | Apache-2.0 | flow + visual regression testing (added this pass) |
| `clsx` / `tailwind-merge` / `cva` | MIT | class composition |

### Deliberately NOT installed

- **Three.js / React Three Fiber** — was previously in the project and removed in
  commit `807c1ce` ("Clean heavy deps & 3D"). ~600 KB min+gzip for a 360°
  viewer is the wrong trade here; CSS 3D + GPU transforms deliver the same
  perceived quality. Re-adding it is listed as an opt-in idea in the final report,
  not a default.
- **GSAP premium plugins** (ScrollSmoother, SplitText, MorphSVG) — paid.
  Lenis + Framer Motion cover the same ground for free.

## 3. Effect technique provenance

| Technique used | Free reference |
|---|---|
| Cursor-follow spotlight / radial glow | Aceternity UI spotlight (`aceternity.com`, MIT) — pattern only, hand-implemented |
| Glassmorphic nav / cards | `ui-ux-pro-max` UI catalog + `ui-styling` shadcn-theming refs |
| Bento grid | `ui-ux-pro-max` `data/landing.csv` layout entries |
| Film grain overlay | `premium-colors.css` fractal-noise data URI (self-authored, no external asset) |
| Rim light on car media | pure CSS `box-shadow` + `mask`/`mix-blend-mode`, no library |
| Magnetic buttons | `animate` + `make-interfaces-feel-better` (pointer `transform` + spring) |
| Smooth scroll | Lenis (MIT) |
| Scroll reveal / stagger | Framer Motion `whileInView` + `useIntersectionObserver` |

21st.dev was reviewed as a source. Its registry components are copy-in React
under MIT/Apache, but none were adopted: the card/hero patterns here need to bind
to this project's existing `cars.js` data shape, `SiteSettingsContext` and
`trackActivity` activity tracking, which off-the-shelf components do not.

## 4. Licensing obligations

This project is not distributed as a library, so there is no
source-redistribution obligation for the npm dependencies above. Per-library
notices are kept with each package in `node_modules`. The one item needing a
visible note is **car imagery**: `frontend/src/data/cars.js` currently
hotlinks ~114 third-party URLs, several of which are search-engine thumbnail
caches and download-gated wallpaper sites. That is a licensing *and* reliability
problem — see the final report, it needs replacing with self-hosted or properly
licensed assets.