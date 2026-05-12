# Personal Portfolio (Static Site Generator)

A blazing fast, SEO-optimized, and easily maintainable personal portfolio website.

This project uses a custom, zero-dependency Node.js build script to combine a clean HTML template with your structured JSON data. This gives you the best of both worlds: **simple content management via JSON** and **perfect SEO** since the output is pure static HTML.

## 🚀 Features
- **Centralized Content:** All texts, project links, and stats are managed in a single file (`src/data.json`).
- **SEO Optimized:** Content is injected at build time, meaning search engines see the full text instantly without needing to execute JavaScript.
- **Anti-Spam Protection:** E-Mail addresses are heavily obfuscated. They are not present in the HTML source code and only assemble when a user interacts with the UI.
- **Dynamic Stats:** Project counts are automatically calculated during the build process.
- **Zero Dependencies:** The build script (`build.js`) uses native Node.js functionality. No heavy `node_modules` required.

---

## 📂 Project Structure

```text
├── src/
│   ├── data.json       <-- 📝 EDIT YOUR CONTENT HERE
│   └── template.html   <-- 🎨 The HTML layout with {{PLACEHOLDERS}}
├── build.js            <-- ⚙️ The Node.js compiler script
├── package.json        <-- 📦 Defines the build command
└── dist/               <-- 🚀 Output directory (created after build)
    └── index.html      <-- The final, deployed website
```

---

## 💻 Local Development

1. **Edit Content:** Open `src/data.json` and change your texts, CV, or projects.
2. **Build the Site:** Run the following command in your terminal:
   ```bash
   npm run build
   ```
3. **Test:** The finished website will be inside the `dist/` folder. You can open `dist/index.html` in your browser or serve it via a local web server (e.g. `npx serve dist`).

---

## 🌍 Deployment Guides

Because the project generates pure static HTML, it can be deployed for free on almost any platform. The important rule is: **Only deploy the `dist/` folder!**

### Option A: Deployment via Coolify

1. Create a new Resource in Coolify: **Static Site** (or Nixpacks / Node.js).
2. Connect your Git repository.
3. Configure the Build Settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist` (or `/dist`)
4. Click Deploy. Coolify will automatically run the build script and securely serve only the generated HTML file, keeping your `data.json` private.

### Option B: Deployment via GitHub Pages

The repository is already fully configured for GitHub Pages via GitHub Actions!

1. Go to your Repository Settings > Pages > **Build and deployment** > Source: **GitHub Actions**.
2. Commit and push your code. The included `.github/workflows/deploy.yml` workflow will automatically build your site and host the `dist/` folder.
