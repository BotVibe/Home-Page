# Agent Context & Architecture

This file provides critical context for AI agents working on this repository in the future. **Read this before modifying the codebase.**

## Architecture Overview
This project is a **Custom Static Site Generator (SSG)** portfolio. It does NOT use complex frameworks like Next.js, nor does it fetch JSON dynamically at runtime via the browser. 

The primary goal of this architecture is to provide the user with a highly convenient editing experience (via JSON) while ensuring **100% SEO optimization** and **Spam Protection**.

### The Build Process
1. `src/data.json` contains all user content, including CV, projects, and the obfuscated email address.
2. `src/template.html` contains the HTML structure with text placeholders (e.g., `{{PROFILE_GREETING}}`).
3. `build.js` is a native Node.js script (zero dependencies) that reads the JSON, processes logic (like counting projects), replaces the placeholders in the template, and outputs the final HTML.
4. The output is written to `dist/index.html`.

## Critical Rules for Agents

1. **Do NOT edit the root `index.html`:** A root `index.html` should not exist. The final generated file lives in `dist/index.html` and should never be manually edited.
2. **Do NOT use Client-Side Fetching for Content:** Content must be injected at build time (`build.js`) for SEO reasons. Do not revert to `fetch('data.json')` in the client script.
3. **Where to Edit Content:** If the user asks to update their CV, add a project, or fix a typo, edit `src/data.json`.
4. **Where to Edit Layout/Design:** Edit `src/template.html` and then run `npm run build` to test.
5. **Where to Edit Logic:** If the user wants a new dynamic feature (e.g., calculating a new statistic), modify `build.js` to process the data and inject a new `{{TOKEN}}` into the template.
6. **Email Obfuscation:** The user's email is split into `user` and `domain` inside `data.json`. `build.js` injects a Javascript event listener into the template that dynamically assembles the `mailto:` link only upon user interaction (hover/click). Do NOT hardcode the email into the HTML to prevent bot spam.
7. **Deployment:** The project is designed to be deployed by pointing a static hosting service (Coolify, Vercel, Netlify, GitHub Pages) to the `dist/` directory after running `npm run build`.
