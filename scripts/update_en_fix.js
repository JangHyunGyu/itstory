const fs = require('fs');
const path = require('path');

const dir = 'c:\\workspace\\itstory';
const files = fs.readdirSync(dir).filter(f => f.endsWith('-en.html'));

const replacements = {
    '>Computers Timeline<': '>Birth of Computers<',
    '>Networks Timeline<': '>Internet & Communication<',
    '>Database Timeline<': '>Data Storage<',
    '>Operating Systems Timeline<': '>The Brain of Computers (OS)<',
    '>Web Making<': '>Visible Web (Frontend)<',
    '"Web making timelines"': '"Visible Web (Frontend)"',
    '>Web Timeline Hub<': '>Frontend Hub<',
    '>Document Structure Timeline<': '>Building the Skeleton (HTML)<',
    '>Styling Evolution Timeline<': '>Styling & Design (CSS)<',
    '>Browser Interaction Timeline<': '>Adding Movement (JS)<',
    '>Web Tools Timeline<': '>Faster & Easier (Tools)<',
    '>Web Server Timeline<': '>Invisible Backend (Server)<',
    
    // home-cta links
    '>Open Networks Timeline<': '>Open Internet & Communication<',
    '>Open Computers Timeline<': '>Open Birth of Computers<',
    '>Open OS Timeline<': '>Open The Brain of Computers<',
    '>Open Web Timeline<': '>Open Visible Web<',
    '>Open Web Server Timeline<': '>Open Invisible Backend<',
    '>Open Database Timeline<': '>Open Data Storage<'
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

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated English file ${file}`);
});
