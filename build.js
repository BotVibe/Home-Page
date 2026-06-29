const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');
const dataPath = path.join(srcDir, 'data.json');
const templatePath = path.join(srcDir, 'template.html');
const outputPath = path.join(distDir, 'index.html');

if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
let html = fs.readFileSync(templatePath, 'utf-8');

// Calculate stats
let totalProjects = 0;
let webflowCount = 0;
let shopifyCount = 0;
let customCount = 0;

Object.keys(data.projects).forEach(k => {
    const len = data.projects[k].items.length;
    totalProjects += len;
    if (k === 'webflow') webflowCount += len;
    if (k === 'shopify') shopifyCount += len;
    if (k === 'custom') customCount += len;
});

const statsSummary = `${totalProjects} Projects | ${customCount} Custom | ${shopifyCount} Shopify | ${webflowCount} Webflow`;

const pageTitle = data.site?.pageTitle || 'Portfolio';
const siteBrand = data.site?.brand || 'USER';
const footerText = data.site?.footerText || 'Built with care & code.';
const copyrightYear = new Date().getFullYear();

// Replace simple fields
html = html.replaceAll('{{PAGE_TITLE}}', pageTitle);
html = html.replaceAll('{{SITE_BRAND}}', siteBrand);
html = html.replaceAll('{{FOOTER_TEXT}}', footerText);
html = html.replaceAll('{{COPYRIGHT_YEAR}}', copyrightYear);
html = html.replaceAll('{{STATS_SUMMARY}}', statsSummary);
html = html.replaceAll('{{PROFILE_GREETING}}', data.profile.greeting);
html = html.replaceAll('{{PROFILE_TITLE}}', data.profile.title);
html = html.replaceAll('{{PROFILE_ABOUT}}', data.profile.about);
html = html.replaceAll('{{PROFILE_AVATAR}}', data.profile.avatar);

// Replace Social Links
let socialHtml = '';
if (data.profile.social.linkedin && data.profile.social.linkedin !== '#') {
    socialHtml += `<a href="${data.profile.social.linkedin}" target="_blank" rel="noopener noreferrer" class="neo-btn px-4 py-2 bg-[var(--card-bg)] dark:bg-[var(--card-bg-dark)] text-[var(--text)] dark:text-[var(--text-dark)] hover:bg-[var(--accent-alt)] hover:text-black transition-colors flex items-center gap-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>LinkedIn</a>`;
}
if (data.profile.social.github && data.profile.social.github !== '#') {
    socialHtml += `<a href="${data.profile.social.github}" target="_blank" rel="noopener noreferrer" class="neo-btn px-4 py-2 bg-[var(--card-bg)] dark:bg-[var(--card-bg-dark)] text-[var(--text)] dark:text-[var(--text-dark)] hover:bg-[var(--accent-alt)] hover:text-black transition-colors flex items-center gap-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>GitHub</a>`;
}

// Anti-Spam Email Injector
let emailScript = '';
if (data.profile.social.email && data.profile.social.email.user) {
    const user = data.profile.social.email.user;
    const domain = data.profile.social.email.domain;
    
    socialHtml += `<a href="#" id="obf-email" class="neo-btn px-4 py-2 bg-[var(--accent)] text-black hover:bg-[var(--accent-yellow)] transition-colors flex items-center gap-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" /></svg><span id="obf-email-text">E-Mail anzeigen</span></a>`;
    
    emailScript = `
        const el = document.getElementById('obf-email');
        const txt = document.getElementById('obf-email-text');
        if (el) {
            const constructMail = () => {
                const m = '${user}' + String.fromCharCode(64) + '${domain}';
                el.href = 'mailto:' + m;
                txt.innerText = m;
            };
            el.addEventListener('mouseover', constructMail);
            el.addEventListener('click', constructMail);
        }
        const footerEl = document.getElementById('obf-email-footer');
        if (footerEl) {
            const constructFooterMail = () => {
                const m = '${user}' + String.fromCharCode(64) + '${domain}';
                footerEl.href = 'mailto:' + m;
            };
            footerEl.addEventListener('mouseover', constructFooterMail);
            footerEl.addEventListener('click', constructFooterMail);
        }
    `;
}
html = html.replace('{{SOCIAL_LINKS}}', socialHtml);

// Footer links (reuse social data)
let footerLinksHtml = '';
if (data.profile.social.github && data.profile.social.github !== '#') {
    footerLinksHtml += `<a href="${data.profile.social.github}" target="_blank" rel="noopener noreferrer" class="neo-btn px-4 py-2 bg-[var(--card-bg)] text-black font-mono text-sm font-bold hover:bg-[var(--accent-yellow)] transition-colors">GITHUB</a>`;
}
if (data.profile.social.linkedin && data.profile.social.linkedin !== '#') {
    footerLinksHtml += `<a href="${data.profile.social.linkedin}" target="_blank" rel="noopener noreferrer" class="neo-btn px-4 py-2 bg-[var(--card-bg)] text-black font-mono text-sm font-bold hover:bg-[var(--accent-yellow)] transition-colors">LINKEDIN</a>`;
}
if (data.profile.social.email && data.profile.social.email.user) {
    footerLinksHtml += `<a href="#" id="obf-email-footer" class="neo-btn px-4 py-2 bg-[var(--card-bg)] text-black font-mono text-sm font-bold hover:bg-[var(--accent-yellow)] transition-colors">EMAIL</a>`;
}
html = html.replace('{{FOOTER_LINKS}}', footerLinksHtml);
html = html.replace('{{EMAIL_SCRIPT}}', emailScript);

// Replace Tech Stack
html = html.replace('{{TECH_DESCRIPTION}}', data.techStack.description);
let toolsHtml = '';
data.techStack.tools.forEach(t => {
    toolsHtml += `<div class="flex items-center gap-2"><span class="w-3 h-3 themed-category-dot" style="background-color: ${t.color}"></span><span class="font-bold">${t.name}</span></div>`;
});
html = html.replace('{{TECH_TOOLS}}', toolsHtml);

html = html.replace('{{RADAR_LABELS}}', JSON.stringify(data.techStack.radarLabels));
html = html.replace('{{RADAR_DATA}}', JSON.stringify(data.techStack.radarData));

// Replace CV
let cvHtml = '';
data.cv.forEach((item, index) => {
    const isFirst = index === 0;
    const periodClass = isFirst
        ? 'neo-btn px-3 py-1 bg-[var(--accent-yellow)] text-black text-sm'
        : 'font-mono text-sm text-muted';
    cvHtml += `
    <div class="relative pl-10">
        <div class="timeline-node ${!isFirst ? 'bg-[var(--accent-alt)]' : ''}"></div>
        <div class="flex flex-col md:flex-row md:items-baseline gap-2 mb-2">
            <h3 class="text-xl font-extrabold">${item.role}</h3>
            <span class="${periodClass}">${item.period}</span>
        </div>
        <p class="text-sm font-bold mb-3">${item.company}</p>
        <p class="max-w-2xl text-sm leading-relaxed">${item.description}</p>
    </div>`;
});
html = html.replace('{{CV_ITEMS}}', cvHtml);

// Replace Projects
let projectsHtml = '';
Object.keys(data.projects).forEach(k => {
    const category = data.projects[k];
    let itemsHtml = '';
    category.items.forEach(item => {
        let imageHtml = '';
        if (item.image && item.image !== "[IMG_PLACEHOLDER]") {
            imageHtml = `<div class="h-40 neo-border mb-4 flex items-center justify-center font-mono text-xs img-placeholder"><img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.parentNode.innerHTML='[IMG_PLACEHOLDER]'"/></div>`;
        } else {
            imageHtml = `<div class="h-40 neo-border mb-4 flex items-center justify-center font-mono text-xs img-placeholder">[IMG_PLACEHOLDER]</div>`;
        }
        itemsHtml += `
        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="snap-start min-w-[300px] md:min-w-[400px] neo-card bg-[var(--card-bg)] dark:bg-[var(--card-bg-dark)] text-[var(--text)] dark:text-[var(--text-dark)] p-6 group block">
            ${imageHtml}
            <h4 class="font-extrabold text-lg mb-2">${item.title}</h4>
            <p class="text-sm mb-4">${item.description}</p>
            <span class="text-xs font-mono font-bold underline" style="color: ${category.color}">${item.linkText} →</span>
        </a>`;
    });
    projectsHtml += `
    <section class="project-band w-full py-12 mb-8" style="--band-color: ${category.color};">
        <div class="max-w-6xl mx-auto px-6">
            <div class="flex items-center gap-3 mb-6">
                <span class="w-4 h-4 themed-category-dot" style="background-color: ${category.color}"></span>
                <h3 class="text-2xl font-black tracking-tight">${category.title}</h3>
            </div>
            <div class="flex overflow-x-auto gap-6 pb-6 hide-scrollbar snap-x">
                ${itemsHtml}
            </div>
        </div>
    </section>`;
});
html = html.replace('{{PROJECT_SECTIONS}}', projectsHtml);

fs.writeFileSync(outputPath, html);
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('Build completed! Output saved to dist/index.html');
