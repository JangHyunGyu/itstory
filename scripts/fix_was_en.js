const fs = require('fs');
const path = require('path');

const dir = 'c:\\workspace\\itstory';
const files = fs.readdirSync(dir).filter(f => f.endsWith('-en.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix malformed WAS link
    content = content.replace(/<a href="was-en\.html"<a href="was-en\.html"[^>]*>Invisible Backend \(Server\)<\/a> data-topic-role="parent">Invisible Backend \(Server\)<\/a>/g, '<a href="was-en.html" data-topic-role="parent">Invisible Backend (Server)</a>');
    content = content.replace(/<a href="was-en\.html"<a href="was-en\.html" class="is-current">Invisible Backend \(Server\)<\/a> data-topic-role="parent">Invisible Backend \(Server\)<\/a>/g, '<a href="was-en.html" class="is-current" data-topic-role="parent">Invisible Backend (Server)</a>');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed WAS link in ${file}`);
});
