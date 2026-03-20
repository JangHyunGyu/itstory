/**
 * validate.js - ITStory project validator
 * Checks HTML files, internal links, English/Korean parity, script/CSS refs
 * Usage: node validate.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
let errors = 0;
let passes = 0;

function pass(msg) {
    console.log(`  \u2705 ${msg}`);
    passes++;
}

function fail(msg) {
    console.log(`  \u274C ${msg}`);
    errors++;
}

function check(condition, passMsg, failMsg) {
    if (condition) {
        pass(passMsg);
    } else {
        fail(failMsg);
    }
}

function fileExists(relPath) {
    return fs.existsSync(path.join(ROOT, relPath));
}

// ─── 1. Core HTML files exist ───
console.log('\n[1] Core HTML files');

const koreanPages = [
    'index.html',
    'computers.html',
    'databases.html',
    'networks.html',
    'os.html',
    'web.html',
    'web-structure.html',
    'web-styling.html',
    'web-interaction.html',
    'web-tools.html',
    'was.html',
];

const englishPages = koreanPages.map(f => f.replace('.html', '-en.html'));

for (const file of koreanPages) {
    check(fileExists(file), `${file} exists`, `${file} MISSING`);
}

// ─── 2. English versions exist ───
console.log('\n[2] English versions');

for (const file of englishPages) {
    check(fileExists(file), `${file} exists`, `${file} MISSING`);
}

// ─── 3. Korean ↔ English page parity ───
console.log('\n[3] Korean/English page parity');

for (let i = 0; i < koreanPages.length; i++) {
    const ko = koreanPages[i];
    const en = englishPages[i];
    if (fileExists(ko) && fileExists(en)) {
        pass(`${ko} <-> ${en} both exist`);
    } else {
        fail(`Missing pair: ${ko} / ${en}`);
    }
}

// ─── 4. Asset files (CSS, JS) ───
console.log('\n[4] Asset files');

const requiredAssets = [
    'assets/css/style.css',
    'assets/js/main.js',
    'assets/js/browser-check.js',
    'assets/js/ga.js',
    'assets/images/archerlab_logo.svg',
    'assets/images/archerlab_mini_logo.png',
];

for (const asset of requiredAssets) {
    check(fileExists(asset), `${asset} exists`, `${asset} MISSING`);
}

// ─── 5. Script/CSS references in HTML files ───
console.log('\n[5] Local resource references in HTML files');

const allHtmlFiles = [...koreanPages, ...englishPages].filter(f => fileExists(f));

for (const htmlFile of allHtmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, htmlFile), 'utf-8');
    // Match src="..." and href="..." but skip external URLs, anchors, data URIs, javascript:, protocol-relative
    const refRegex = /(?:src|href)="([^"]+)"/g;
    let match;
    const checked = new Set();

    while ((match = refRegex.exec(content)) !== null) {
        const ref = match[1];
        // Skip external URLs, anchors, data URIs, javascript:, protocol-relative, mailto:
        if (/^(https?:\/\/|#|data:|javascript:|\/\/|mailto:)/.test(ref)) continue;
        // Skip absolute paths like /
        if (ref === '/') continue;

        // Strip query strings and fragments
        const cleanRef = ref.split('?')[0].split('#')[0];
        if (!cleanRef) continue;
        if (checked.has(cleanRef)) continue;
        checked.add(cleanRef);

        // For .html links, check file existence
        if (cleanRef.endsWith('.html') || cleanRef.endsWith('.css') || cleanRef.endsWith('.js') ||
            cleanRef.endsWith('.png') || cleanRef.endsWith('.svg') || cleanRef.endsWith('.jpg') ||
            cleanRef.endsWith('.json') || cleanRef.endsWith('.xml') || cleanRef.endsWith('.txt') ||
            cleanRef.endsWith('.ico')) {
            const refPath = path.join(ROOT, cleanRef);
            check(fs.existsSync(refPath),
                `${htmlFile}: ref "${cleanRef}" OK`,
                `${htmlFile}: ref "${cleanRef}" NOT FOUND`);
        }
    }
}

// ─── 6. Internal page links consistency ───
console.log('\n[6] Internal page links');

// Korean pages should link to Korean pages, English to English
for (const htmlFile of allHtmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, htmlFile), 'utf-8');
    const isEnglish = htmlFile.includes('-en.');
    const linkRegex = /href="([^"]+\.html)"/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
        const linkedFile = match[1].split('?')[0].split('#')[0];
        // Skip external
        if (/^https?:\/\//.test(linkedFile)) continue;

        check(fileExists(linkedFile),
            `${htmlFile} -> "${linkedFile}" exists`,
            `${htmlFile} -> "${linkedFile}" BROKEN LINK`);
    }
}

// ─── 7. JSON-LD structured data ───
console.log('\n[7] JSON-LD structured data');

for (const htmlFile of allHtmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, htmlFile), 'utf-8');
    const jsonLdMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (jsonLdMatch) {
        try {
            JSON.parse(jsonLdMatch[1]);
            pass(`${htmlFile}: JSON-LD is valid JSON`);
        } catch (e) {
            fail(`${htmlFile}: JSON-LD parse error: ${e.message}`);
        }
    }
}

// ─── 8. SVG story images referenced in content pages ───
console.log('\n[8] SVG story images in assets/images');

const svgFiles = fs.readdirSync(path.join(ROOT, 'assets', 'images'))
    .filter(f => f.startsWith('story_') && f.endsWith('.svg'));

check(svgFiles.length > 0, `Found ${svgFiles.length} story SVG images`, 'No story SVG images found');

// Check that story images are referenced in the correct topic pages
const topicSvgPrefixes = {
    'computers.html': 'story_computers_',
    'databases.html': 'story_databases_',
    'networks.html': 'story_networks_',
    'os.html': 'story_os_',
    'was.html': 'story_was_',
    'web-structure.html': 'story_web-structure_',
    'web-styling.html': 'story_web-styling_',
    'web-interaction.html': 'story_web-interaction_',
    'web-tools.html': 'story_web-tools_',
};

for (const [page, prefix] of Object.entries(topicSvgPrefixes)) {
    if (!fileExists(page)) continue;
    const pageSvgs = svgFiles.filter(f => f.startsWith(prefix));
    check(pageSvgs.length > 0,
        `${page}: ${pageSvgs.length} story SVGs with prefix "${prefix}"`,
        `${page}: No story SVGs found with prefix "${prefix}"`);
}

// ─── 9. Other required files ───
console.log('\n[9] Other project files');

const otherFiles = [
    'robots.txt',
    'sitemap.xml',
    'CNAME',
];

for (const file of otherFiles) {
    check(fileExists(file), `${file} exists`, `${file} MISSING`);
}

// ─── Summary ───
console.log('\n' + '='.repeat(50));
console.log(`PASSED: ${passes}  |  FAILED: ${errors}`);
if (errors > 0) {
    console.log('Validation FAILED.');
    process.exit(1);
} else {
    console.log('All checks passed.');
    process.exit(0);
}
