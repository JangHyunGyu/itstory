const fs = require('fs');
const path = require('path');

const dir = 'c:\\workspace\\itstory';
const files = fs.readdirSync(dir).filter(f => f.endsWith('-en.html'));

const replacements = {
    '>Home Hub<': '>Home<',
    '>Computer Chronicle<': '>Birth of Computers<',
    '>Network Chronicle<': '>Internet & Communication<',
    '>Database Chronicle<': '>Data Storage<',
    '>OS Chronicle<': '>The Brain of Computers (OS)<',
    '>Web Dev Chronicle<': '>Visible Web (Frontend)<',
    '"Web Dev Chronicle"': '"Visible Web (Frontend)"',
    '>Web Dev Hub<': '>Frontend Hub<',
    '>Web Structure Chronicle<': '>Building the Skeleton (HTML)<',
    '>Styling Evolution Chronicle<': '>Styling & Design (CSS)<',
    '>Browser Interaction Chronicle<': '>Adding Movement (JS)<',
    '>Web Tools Chronicle<': '>Faster & Easier (Tools)<',
    '>Web Server Chronicle<': '>Invisible Backend (Server)<',
    
    // home-cta links
    '>Open Network Chronicle<': '>Open Internet & Communication<',
    '>Open Computer Chronicle<': '>Open Birth of Computers<',
    '>Open OS Chronicle<': '>Open The Brain of Computers<',
    '>Open Web Chronicle<': '>Open Visible Web<',
    '>Open Web Server Chronicle<': '>Open Invisible Backend<',
    '>Open Database Chronicle<': '>Open Data Storage<'
};

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    for (const [oldText, newText] of Object.entries(replacements)) {
        content = content.replace(new RegExp(oldText, 'g'), newText);
    }

    // Wrap WAS link in a group to match the frontend group
    const wasRegex = /(<div class="page__topic-nav-group" role="group" aria-label="Visible Web \(Frontend\)">[\s\S]*?<\/div>)\s*(<a href="was-en.html"([^>]*)>Invisible Backend \(Server\)<\/a>)/;
    
    if (wasRegex.test(content)) {
        content = content.replace(wasRegex, `$1\n\t\t\t\t\t<div class="page__topic-nav-group" role="group" aria-label="Invisible Backend (Server)">\n\t\t\t\t\t\t<span class="page__topic-nav-label">Invisible Backend (Server)</span>\n\t\t\t\t\t\t<a href="was-en.html"$2 data-topic-role="parent">Invisible Backend (Server)</a>\n\t\t\t\t\t</div>`);
    }

    // Fix malformed WAS link if any
    content = content.replace(/<a href="was-en\.html"<a href="was-en\.html"[^>]*>Invisible Backend \(Server\)<\/a> data-topic-role="parent">Invisible Backend \(Server\)<\/a>/g, '<a href="was-en.html" data-topic-role="parent">Invisible Backend (Server)</a>');
    content = content.replace(/<a href="was-en\.html"<a href="was-en\.html" class="is-current">Invisible Backend \(Server\)<\/a> data-topic-role="parent">Invisible Backend \(Server\)<\/a>/g, '<a href="was-en.html" class="is-current" data-topic-role="parent">Invisible Backend (Server)</a>');

    // Update <title> tags
    let newTitle = '';
    switch(file) {
        case 'index-en.html': newTitle = 'IT History Timeline Hub: Computers, Internet, OS, DB, Web | ArcherLab IT Story'; break;
        case 'computers-en.html': newTitle = 'Birth of Computers | ArcherLab IT Story'; break;
        case 'networks-en.html': newTitle = 'Internet & Communication | ArcherLab IT Story'; break;
        case 'databases-en.html': newTitle = 'Data Storage | ArcherLab IT Story'; break;
        case 'os-en.html': newTitle = 'The Brain of Computers (OS) | ArcherLab IT Story'; break;
        case 'web-en.html': newTitle = 'Visible Web (Frontend) | ArcherLab IT Story'; break;
        case 'web-structure-en.html': newTitle = 'Building the Skeleton (HTML) | ArcherLab IT Story'; break;
        case 'web-styling-en.html': newTitle = 'Styling & Design (CSS) | ArcherLab IT Story'; break;
        case 'web-interaction-en.html': newTitle = 'Adding Movement (JS) | ArcherLab IT Story'; break;
        case 'web-tools-en.html': newTitle = 'Faster & Easier (Tools) | ArcherLab IT Story'; break;
        case 'was-en.html': newTitle = 'Invisible Backend (Server) | ArcherLab IT Story'; break;
    }

    if (newTitle) {
        content = content.replace(/<title>.*<\/title>/, `<title>${newTitle}</title>`);
    }

    // Update JSON-LD
    const jsonLdReplacements = {
        '"name": "Computer Chronicle"': '"name": "Birth of Computers"',
        '"name": "Network Chronicle"': '"name": "Internet & Communication"',
        '"name": "Database Chronicle"': '"name": "Data Storage"',
        '"name": "OS Chronicle"': '"name": "The Brain of Computers (OS)"',
        '"name": "Web Chronicle"': '"name": "Visible Web (Frontend)"',
        '"name": "Web Structure Chronicle"': '"name": "Building the Skeleton (HTML)"',
        '"name": "Styling Evolution Chronicle"': '"name": "Styling & Design (CSS)"',
        '"name": "Browser Interaction Chronicle"': '"name": "Adding Movement (JS)"',
        '"name": "Web Tools Chronicle"': '"name": "Faster & Easier (Tools)"',
        '"name": "Web Server Chronicle"': '"name": "Invisible Backend (Server)"'
    };

    for (const [oldText, newText] of Object.entries(jsonLdReplacements)) {
        content = content.replace(new RegExp(oldText, 'g'), newText);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated English file ${file}`);
});
