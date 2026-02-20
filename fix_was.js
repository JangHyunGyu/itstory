const fs = require('fs');
const path = require('path');

const dir = 'c:\\workspace\\itstory';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.includes('-en.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the malformed WAS link
    content = content.replace(/<a href="was\.html"<a href="was\.html"[^>]*>보이지 않는 뒷단 \(백엔드\)<\/a> data-topic-role="parent">보이지 않는 뒷단 \(백엔드\)<\/a>/g, '<a href="was.html" data-topic-role="parent">보이지 않는 뒷단 (백엔드)</a>');
    
    // Also fix if it has class="is-current"
    content = content.replace(/<a href="was\.html"<a href="was\.html" class="is-current">보이지 않는 뒷단 \(백엔드\)<\/a> data-topic-role="parent">보이지 않는 뒷단 \(백엔드\)<\/a>/g, '<a href="was.html" class="is-current" data-topic-role="parent">보이지 않는 뒷단 (백엔드)</a>');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
});
