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

        // Check static assets and extensionless HTML page links
        if (cleanRef.endsWith('.html') || cleanRef.endsWith('.css') || cleanRef.endsWith('.js') ||
            cleanRef.endsWith('.png') || cleanRef.endsWith('.svg') || cleanRef.endsWith('.jpg') ||
            cleanRef.endsWith('.json') || cleanRef.endsWith('.xml') || cleanRef.endsWith('.txt') ||
            cleanRef.endsWith('.ico')) {
            const refPath = path.join(ROOT, cleanRef.replace(/^\//, ''));
            check(fs.existsSync(refPath),
                `${htmlFile}: ref "${cleanRef}" OK`,
                `${htmlFile}: ref "${cleanRef}" NOT FOUND`);
        } else if (!path.extname(cleanRef)) {
            const slug = cleanRef.replace(/^\//, '');
            const targetFile = slug ? `${slug}.html` : 'index.html';
            check(fileExists(targetFile) || fileExists(slug),
                `${htmlFile}: extensionless ref "${cleanRef}" -> "${targetFile}" OK`,
                `${htmlFile}: extensionless ref "${cleanRef}" NOT FOUND`);
        }
    }
}

// ─── 6. Internal page links consistency ───
console.log('\n[6] Internal page links');

const seoHtmlFiles = fs.existsSync(path.join(ROOT, 'seo'))
    ? fs.readdirSync(path.join(ROOT, 'seo')).filter(f => f.endsWith('.html')).map(f => `seo/${f}`)
    : [];

for (const htmlFile of [...allHtmlFiles, ...seoHtmlFiles]) {
    const content = fs.readFileSync(path.join(ROOT, htmlFile), 'utf-8');
    const hrefRegex = /href="([^"]+)"/g;
    let match;

    while ((match = hrefRegex.exec(content)) !== null) {
        const rawHref = match[1];
        if (/^(?:#|data:|javascript:|\/\/|mailto:|tel:)/.test(rawHref)) continue;
        const cleanHref = rawHref.split('?')[0].split('#')[0];
        if (!cleanHref || cleanHref === '/') continue;
        if (/^https?:\/\//.test(cleanHref)) {
            if (/^https:\/\/(?:itstory\.)?archerlab\.dev\/[^\s"]*\.html$/i.test(cleanHref)) {
                fail(`${htmlFile} still links to .html URL: ${rawHref}`);
            }
            continue;
        }
        if (/\.html$/i.test(cleanHref)) {
            fail(`${htmlFile} contains internal .html link: ${rawHref}`);
            continue;
        }
        if (!path.extname(cleanHref)) {
            const targetFile = `${cleanHref.replace(/^\//, '')}.html`;
            check(fileExists(targetFile),
                `${htmlFile} -> "${rawHref}" resolves to ${targetFile}`,
                `${htmlFile} -> "${rawHref}" BROKEN LINK`);
        }
    }
}

// ─── 7. JSON-LD structured data and visible-content parity ───
console.log('\n[7] JSON-LD structured data');

for (const htmlFile of allHtmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, htmlFile), 'utf-8');
    const body = content.split(/<body\b/i)[1] || '';
    const jsonLdRegex = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
    const jsonLdBlocks = [...content.matchAll(jsonLdRegex)];
    let pageIdentityCount = 0;

    check(
        jsonLdBlocks.length > 0,
        `${htmlFile}: found ${jsonLdBlocks.length} JSON-LD block(s)`,
        `${htmlFile}: JSON-LD MISSING`
    );

    for (const [index, jsonLdMatch] of jsonLdBlocks.entries()) {
        try {
            const data = JSON.parse(jsonLdMatch[1]);
            pass(`${htmlFile}: JSON-LD block ${index + 1} is valid JSON`);
            const nodes = Array.isArray(data?.['@graph']) ? data['@graph'] : [data];

            for (const node of nodes) {
                if (!node || typeof node !== 'object') continue;

                if (node['@type'] === 'FAQPage') {
                    const questions = Array.isArray(node.mainEntity) ? node.mainEntity : [];
                    check(
                        questions.length > 0,
                        `${htmlFile}: FAQ schema has questions`,
                        `${htmlFile}: FAQ schema has no questions`
                    );
                    for (const item of questions) {
                        const question = item?.name || '';
                        const answer = item?.acceptedAnswer?.text || '';
                        check(
                            Boolean(question && answer && body.includes(question) && body.includes(answer)),
                            `${htmlFile}: FAQ content is visible`,
                            `${htmlFile}: FAQ schema contains content not visible in the page`
                        );
                    }
                }

                if (node['@id'] && /#(?:article|collection)$/.test(node['@id'])) {
                    pageIdentityCount++;
                    check(
                        Boolean(node.url && node.datePublished && node.dateModified && node.author && node.publisher),
                        `${htmlFile}: page identity has URL, dates, author, and publisher`,
                        `${htmlFile}: page identity is missing required provenance fields`
                    );
                    if (node['@type'] === 'Article') {
                        check(
                            Array.isArray(node.citation) && node.citation.length > 0,
                            `${htmlFile}: article identity links visible sources`,
                            `${htmlFile}: article identity has no source citations`
                        );
                    }
                }
            }
        } catch (e) {
            fail(`${htmlFile}: JSON-LD block ${index + 1} parse error: ${e.message}`);
        }
    }

    check(
        pageIdentityCount === 1,
        `${htmlFile}: exactly one page identity schema`,
        `${htmlFile}: expected one page identity schema, found ${pageIdentityCount}`
    );

    const h1Count = (content.match(/<h1\b/gi) || []).length;
    check(
        h1Count === 1,
        `${htmlFile}: exactly one H1`,
        `${htmlFile}: expected one H1, found ${h1Count}`
    );
}

// ─── 8. SVG story images referenced in content pages ───
console.log('\n[8] SVG story images in assets/images');

const svgFiles = fs.readdirSync(path.join(ROOT, 'assets', 'images'))
    .filter(f => f.startsWith('story_') && f.endsWith('.png'));

check(svgFiles.length > 0, `Found ${svgFiles.length} story PNG images`, 'No story PNG images found');

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
        `${page}: ${pageSvgs.length} story PNGs with prefix "${prefix}"`,
        `${page}: No story PNGs found with prefix "${prefix}"`);
}

// ─── 9. Korean/English story image parity ───
console.log('\n[9] Story image parity');

function storyImageMap(html) {
    const map = new Map();
    const templateRe = /<template id="event-([^"]+)"[\s\S]*?<\/template>/g;
    let match;
    while ((match = templateRe.exec(html)) !== null) {
        const imageTag = match[0].match(/<img\b[^>]*class="story-image"[^>]*>/);
        const src = imageTag ? (imageTag[0].match(/\ssrc="([^"]+)"/) || [])[1] : '';
        map.set(match[1], src || '');
    }
    return map;
}

for (let i = 0; i < koreanPages.length; i++) {
    const ko = koreanPages[i];
    const en = englishPages[i];
    if (!fileExists(ko) || !fileExists(en)) continue;
    const koImages = storyImageMap(fs.readFileSync(path.join(ROOT, ko), 'utf-8'));
    const enImages = storyImageMap(fs.readFileSync(path.join(ROOT, en), 'utf-8'));
    const ids = new Set([...koImages.keys(), ...enImages.keys()]);
    for (const id of ids) {
        const koSrc = koImages.get(id) || '';
        const enSrc = enImages.get(id) || '';
        check(
            koSrc === enSrc,
            `${ko}: ${id} story image matches English`,
            `${ko}: ${id} story image "${koSrc || '(none)'}" != English "${enSrc || '(none)'}"`
        );
        if (koSrc && !fileExists(koSrc)) {
            fail(`${ko}: ${id} image file missing ${koSrc}`);
        }
    }
}

// ─── 10. Story PNG duplicate attributes ───
console.log('\n[10] Story PNG well-formed attributes');

function duplicateSvgAttributes(text) {
    const stripped = text.replace(/<!--[\s\S]*?-->/g, '');
    const tagRe = /<([A-Za-z][\w:.-]*)\b([^<>]*)>/g;
    const found = [];
    let tagMatch;
    while ((tagMatch = tagRe.exec(stripped)) !== null) {
        const seen = new Set();
        const attrRe = /([:\w.-]+)\s*=\s*(?:"[^"]*"|'[^']*')/g;
        let attrMatch;
        while ((attrMatch = attrRe.exec(tagMatch[2])) !== null) {
            const name = attrMatch[1].toLowerCase();
            if (seen.has(name)) found.push(name);
            seen.add(name);
        }
    }
    return found;
}

for (const svgName of svgFiles) {
    const pngBuf = fs.readFileSync(path.join(ROOT, 'assets', 'images', svgName));
    const validPng = pngBuf.length > 1024 && pngBuf[0] === 0x89 && pngBuf[1] === 0x50 && pngBuf[2] === 0x4E && pngBuf[3] === 0x47;
    check(
        validPng,
        `${svgName}: valid PNG (${pngBuf.length} bytes)`,
        `${svgName}: invalid PNG`
    );
}

// ─── 11. Other required files ───
console.log('\n[11] Other project files');

const otherFiles = [
    'robots.txt',
    'sitemap.xml',
    'CNAME',
];

for (const file of otherFiles) {
    check(fileExists(file), `${file} exists`, `${file} MISSING`);
}

// ─── 12. Sitemap and canonical URLs ───
console.log('\n[12] Sitemap and canonical URLs');

const sitemapText = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf-8');
const sitemapLocs = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
const sitemapAlts = [...sitemapText.matchAll(/<xhtml:link\b[^>]*href="([^"]+)"/g)].map(m => m[1].trim());

check(
    sitemapLocs.length === 27,
    `sitemap.xml has 27 <loc> URLs`,
    `sitemap.xml expected 27 <loc> URLs, found ${sitemapLocs.length}`
);
check(
    [...sitemapLocs, ...sitemapAlts].every(u => !/\.html$/i.test(u)),
    'sitemap.xml contains zero .html URLs',
    'sitemap.xml still contains .html URL(s)'
);

for (const loc of sitemapLocs) {
    const pathname = new URL(loc).pathname;
    const htmlRel = pathname === '/' ? 'index.html' : `${pathname.replace(/^\//, '')}.html`;
    if (!fileExists(htmlRel)) {
        fail(`sitemap target file missing: ${htmlRel} (${loc})`);
        continue;
    }
    const pageHtml = fs.readFileSync(path.join(ROOT, htmlRel), 'utf-8');
    const canonical = (pageHtml.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i) || [])[1];
    const ogUrl = (pageHtml.match(/<meta\b[^>]*property="og:url"[^>]*content="([^"]+)"/i) || [])[1];
    check(
        canonical === loc,
        `${htmlRel}: canonical matches sitemap (${loc})`,
        `${htmlRel}: canonical "${canonical}" !== sitemap "${loc}"`
    );
    check(
        ogUrl === loc,
        `${htmlRel}: og:url matches sitemap (${loc})`,
        `${htmlRel}: og:url "${ogUrl}" !== sitemap "${loc}"`
    );
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
