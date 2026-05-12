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

Object.keys(data.projects).forEach(k => {
    const len = data.projects[k].items.length;
    totalProjects += len;
    if (k === 'webflow') webflowCount += len;
    if (k === 'shopify') shopifyCount += len;
});

const statsSummary = `${totalProjects} Projects | ${webflowCount} Webflow | ${shopifyCount} Shopify`;

// Replace simple fields
html = html.replace('{{STATS_SUMMARY}}', statsSummary);
html = html.replace('{{PROFILE_GREETING}}', data.profile.greeting);
html = html.replace('{{PROFILE_TITLE}}', data.profile.title);
html = html.replace('{{PROFILE_ABOUT}}', data.profile.about);
html = html.replace('{{PROFILE_AVATAR}}', data.profile.avatar);

// Replace Social Links
let socialHtml = '';
if (data.profile.social.linkedin && data.profile.social.linkedin !== '#') {
    socialHtml += `<a href="${data.profile.social.linkedin}" target="_blank" class="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:border-[var(--lime)] dark:hover:border-[var(--lime)] hover:text-[var(--lime)] transition-colors flex items-center gap-2 glitch-on-hover" data-text="LinkedIn"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>LinkedIn</a>`;
}
if (data.profile.social.github && data.profile.social.github !== '#') {
    socialHtml += `<a href="${data.profile.social.github}" target="_blank" class="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:border-[var(--lime)] dark:hover:border-[var(--lime)] hover:text-[var(--lime)] transition-colors flex items-center gap-2 glitch-on-hover" data-text="GitHub"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>GitHub</a>`;
}

// Anti-Spam Email Injector
let emailScript = '';
if (data.profile.social.email && data.profile.social.email.user) {
    const user = data.profile.social.email.user;
    const domain = data.profile.social.email.domain;
    
    // Obfuscated display text fallback
    socialHtml += `<a href="#" id="obf-email" class="px-4 py-2 bg-[var(--lime)] text-black hover:bg-[var(--lime-hover)] transition-colors flex items-center gap-2 font-bold glitch-on-hover" data-text="Kontakt"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" /></svg><span id="obf-email-text">E-Mail anzeigen</span></a>`;
    
    emailScript = `
        const el = document.getElementById('obf-email');
        const txt = document.getElementById('obf-email-text');
        if (el) {
            const constructMail = () => {
                const m = '${user}' + String.fromCharCode(64) + '${domain}';
                el.href = 'mailto:' + m;
                txt.innerText = m;
                el.setAttribute('data-text', m);
            };
            el.addEventListener('mouseover', constructMail);
            el.addEventListener('click', constructMail);
        }
    `;
}
html = html.replace('{{SOCIAL_LINKS}}', socialHtml);
html = html.replace('{{EMAIL_SCRIPT}}', emailScript);

// Replace Tech Stack
html = html.replace('{{TECH_DESCRIPTION}}', data.techStack.description);
let toolsHtml = '';
data.techStack.tools.forEach(t => {
    toolsHtml += `<div class="flex items-center gap-2"><span class="w-2 h-2" style="background-color: ${t.color}"></span> ${t.name}</div>`;
});
html = html.replace('{{TECH_TOOLS}}', toolsHtml);

html = html.replace('{{RADAR_LABELS}}', JSON.stringify(data.techStack.radarLabels));
html = html.replace('{{RADAR_DATA}}', JSON.stringify(data.techStack.radarData));

// Replace CV
let cvHtml = '';
data.cv.forEach((item, index) => {
    const isFirst = index === 0;
    cvHtml += `
    <div class="relative pl-8">
        <div class="timeline-node ${!isFirst ? 'border-gray-400 dark:border-gray-500' : ''}"></div>
        <div class="flex flex-col md:flex-row md:items-baseline gap-2 mb-2">
            <h3 class="text-xl font-bold">${item.role}</h3>
            <span class="font-mono text-sm ${isFirst ? 'text-[var(--lime)] bg-[var(--lime)]/10 px-2 py-0.5' : 'opacity-60'}">${item.period}</span>
        </div>
        <p class="text-sm font-bold opacity-70 mb-3">${item.company}</p>
        <p class="opacity-80 max-w-2xl text-sm leading-relaxed">${item.description}</p>
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
            imageHtml = `<div class="h-40 bg-gray-100 dark:bg-gray-900 mb-4 flex items-center justify-center font-mono text-[var(--lime)] text-xs border border-transparent group-hover:border-[${category.color}]/30"><img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover" onerror="this.style.display='none'; this.parentNode.innerHTML='[IMG_PLACEHOLDER]'"/></div>`;
        } else {
            imageHtml = `<div class="h-40 bg-gray-100 dark:bg-gray-900 mb-4 flex items-center justify-center font-mono text-[var(--lime)] text-xs border border-transparent group-hover:border-[${category.color}]/30">[IMG_PLACEHOLDER]</div>`;
        }
        itemsHtml += `
        <a href="${item.link}" target="_blank" class="snap-start min-w-[300px] md:min-w-[400px] bg-white dark:bg-[var(--midnight-light)] border border-gray-200 dark:border-gray-800 p-6 hover:-translate-y-2 hover:border-[${category.color}] transition-all group block glitch-on-hover" data-text="${item.title}">
            ${imageHtml}
            <h4 class="font-bold text-lg mb-2 group-hover:text-[${category.color}] transition-colors">${item.title}</h4>
            <p class="text-sm opacity-70 mb-4">${item.description}</p>
            <span class="text-xs font-mono border-b border-transparent group-hover:border-[${category.color}] text-[${category.color}]">${item.linkText} -></span>
        </a>`;
    });
    projectsHtml += `
    <section class="w-full border-y border-[${category.color}] bg-[${category.color}]/5 py-12 mb-8" style="border-color: ${category.color}">
        <div class="max-w-6xl mx-auto px-6">
            <div class="flex items-center gap-3 mb-6">
                <span class="w-3 h-3" style="background-color: ${category.color}"></span>
                <h3 class="text-2xl font-bold tracking-tight">${category.title}</h3>
            </div>
            <div class="flex overflow-x-auto gap-6 pb-6 hide-scrollbar snap-x">
                ${itemsHtml}
            </div>
        </div>
    </section>`;
});
html = html.replace('{{PROJECT_SECTIONS}}', projectsHtml);

fs.writeFileSync(outputPath, html);
console.log('Build completed! Output saved to dist/index.html');
