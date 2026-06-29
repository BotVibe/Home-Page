# Personal Portfolio (Static Site Generator)

A blazing fast, SEO-optimized, and easily maintainable personal portfolio website.

This project uses a custom, zero-dependency Node.js build script to combine a clean HTML template with your structured JSON data. This gives you the best of both worlds: **simple content management via JSON** and **perfect SEO** since the output is pure static HTML.

## Features

- **Centralized Content:** All texts, project links, and stats are managed in `src/data.json`.
- **SEO Optimized:** Content is injected at build time, so search engines see the full text without executing JavaScript.
- **Anti-Spam Protection:** Email addresses are split into `user` and `domain` in JSON and only assembled into a `mailto:` link on hover/click.
- **Dynamic Stats:** Project counts are calculated automatically during the build.
- **Dark / Light Mode:** Theme toggle with class-based Tailwind dark mode (`darkMode: 'class'` on `<html>`).
- **Neo-Brutalism Design:** High-contrast cards, borders, and shadows with theme-aware CSS variables.
- **Zero Dependencies:** The build script (`build.js`) uses native Node.js only — no `node_modules` required.

---

## Project Structure

```text
├── src/
│   ├── data.json         <-- Edit your content here
│   └── template.html     <-- HTML layout with {{PLACEHOLDERS}}
├── build.js              <-- Node.js compiler script
├── package.json          <-- Defines the build command
├── .gitignore            <-- Ignores generated dist/ and root artifacts
├── .github/workflows/
│   └── deploy.yml        <-- GitHub Pages deployment workflow
└── dist/                 <-- Output directory (created after build)
    ├── index.html        <-- The final, deployed website
    └── .nojekyll         <-- Disables Jekyll processing on GitHub Pages
```

**Important:** Do not commit `dist/`, root `index.html`, or `.nojekyll`. These are build artifacts.

---

## Local Development

1. **Edit Content:** Open `src/data.json` and update profile, CV, projects, or tech stack.
2. **Build the Site:**
   ```bash
   npm run build
   ```
3. **Preview:** Open `dist/index.html` in your browser or serve it locally:
   ```bash
   npx serve dist
   ```

### Optional site metadata in `data.json`

```json
{
  "site": {
    "brand": "USER",
    "pageTitle": "Software Engineer | Portfolio",
    "footerText": "Built with care & code."
  }
}
```

If omitted, sensible defaults are used (`USER`, `Portfolio`, etc.).

---

## Deployment

The important rule: **only deploy the `dist/` folder** — never the raw `src/data.json` or template files.

### Option A: Coolify

1. Create a new Resource: **Static Site** (or Nixpacks / Node.js).
2. Connect your Git repository.
3. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Deploy. Coolify serves only the generated HTML, keeping `data.json` off the public website.

### Option B: GitHub Pages (recommended for this repo)

The repository includes a GitHub Actions workflow that builds and deploys only `dist/`.

**One-time setup:**

1. Go to **Repository Settings → Pages → Build and deployment**.
2. Set **Source** to **GitHub Actions** (not "Deploy from a branch").
3. Push to `main`. The workflow in `.github/workflows/deploy.yml` runs automatically.

**Privacy note:** Visitors only receive the built `index.html`. However, if the repository is **public**, anyone can still read `src/data.json` on GitHub. Use a **private repository** if the raw source data should not be visible.

---

## Privacy Model

| Location | What visitors see | What repo viewers see (public repo) |
|---|---|---|
| Live website | Built `index.html` only | — |
| Git repository | — | `src/data.json`, template, build script |
| Email address | Assembled on interaction only | Split as `user` / `domain` in JSON |
