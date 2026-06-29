# Agent Context & Architecture

This file provides critical context for AI agents working on this repository. **Read this before modifying the codebase.**

## Architecture Overview

This project is a **Custom Static Site Generator (SSG)** portfolio. It does NOT use complex frameworks like Next.js, nor does it fetch JSON dynamically at runtime in the browser.

The primary goal is a convenient editing experience (via JSON) while ensuring **SEO optimization**, **spam protection**, and **deploying only the built HTML** — not the source data.

### The Build Process

1. `src/data.json` — all user content (profile, CV, projects, email parts, optional `site` metadata).
2. `src/template.html` — HTML structure with placeholders (e.g. `{{PROFILE_GREETING}}`, `{{SITE_BRAND}}`).
3. `build.js` — native Node.js script (zero dependencies) that reads JSON, computes stats, replaces tokens, and writes output.
4. Output: `dist/index.html` and `dist/.nojekyll`.

## Critical Rules for Agents

1. **Do NOT edit root `index.html`:** It must not exist in the repo. The generated file lives only in `dist/index.html`.
2. **Do NOT commit build artifacts:** `dist/`, root `index.html`, and `.nojekyll` are listed in `.gitignore`.
3. **Do NOT use client-side fetching for content:** Content must be injected at build time for SEO. Never revert to `fetch('data.json')`.
4. **Edit content in** `src/data.json`.
5. **Edit layout/design in** `src/template.html`, then run `npm run build`.
6. **Edit build logic in** `build.js` when adding new `{{TOKEN}}` placeholders or computed values.
7. **Email obfuscation:** Email is split into `user` and `domain` in `data.json`. `build.js` injects JavaScript that assembles the `mailto:` link only on hover/click. Never hardcode the full email in HTML.
8. **Deployment:** Host only `dist/` after `npm run build`. GitHub Pages uses `.github/workflows/deploy.yml` with `actions/deploy-pages`. Pages source must be **GitHub Actions**, not branch deployment.

## Template Tokens (build.js)

| Token | Source |
|---|---|
| `{{PAGE_TITLE}}` | `data.site.pageTitle` (default: `Portfolio`) |
| `{{SITE_BRAND}}` | `data.site.brand` (default: `USER`) |
| `{{FOOTER_TEXT}}` | `data.site.footerText` |
| `{{COPYRIGHT_YEAR}}` | Current year (computed) |
| `{{STATS_SUMMARY}}` | Computed project counts |
| `{{PROFILE_*}}` | `data.profile` |
| `{{SOCIAL_LINKS}}` | Generated from `data.profile.social` |
| `{{FOOTER_LINKS}}` | Generated from social links |
| `{{EMAIL_SCRIPT}}` | Obfuscated email handler |
| `{{TECH_*}}` | `data.techStack` |
| `{{CV_ITEMS}}` | `data.cv` |
| `{{PROJECT_SECTIONS}}` | `data.projects` |
| `{{RADAR_LABELS}}` / `{{RADAR_DATA}}` | Chart.js config |

Use `replaceAll()` for tokens that may appear multiple times in the template.

## Design System: Neo-Brutalism

- **CSS Variables** in `:root`:
  - `--accent` (#E8531D), `--accent-alt` (#4CC9F0), `--accent-yellow` (#FFD166)
  - `--bg` / `--bg-dark`, `--card-bg` / `--card-bg-dark`
  - `--text` / `--text-dark`, `--border` / `--border-dark`, `--shadow` / `--shadow-dark`
- **Utility classes:** `.neo-card`, `.neo-btn`, `.neo-border`, `.neo-shadow`
- **Theme-aware classes:** `.theme-border-b/t/l`, `.theme-text`, `.themed-category-dot`, `.project-band`, `.img-placeholder`, `.text-muted`
- **No blur, glassmorphism, or gradients** — flat, boxy, high-contrast
- Project category colors in `data.json` use **hex values** for inline styles and `color-mix()`

## Dark Mode

- Tailwind is configured with `darkMode: 'class'` (see `tailwind.config` in `template.html`).
- The `dark` class lives on `<html>`, toggled via `document.documentElement.classList`.
- Custom CSS selectors use `html.dark` (not `.dark` on `body` alone).
- Tailwind `dark:` utilities and custom `html.dark` rules must stay in sync.
- Chart.js radar colors are updated in `initRadar()` / `updateRadar()` based on the current theme.

## Deployment (GitHub Pages)

```yaml
# .github/workflows/deploy.yml
npm run build → upload dist/ → actions/deploy-pages
```

Do **not** commit built HTML to the repo root. The workflow publishes only the `dist/` artifact.
