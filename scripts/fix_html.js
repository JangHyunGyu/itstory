const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'web-interaction.html');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the beginning
content = content.replace('<html lang="ko"><head></head><body>\uFEFF', '<!DOCTYPE html>\n<html lang="ko">\n<head>');

// Fix the end of head and beginning of body
content = content.replace('</script>\n\n\n\n\t<div class="page">', '</script>\n</head>\n<body>\n\t<div class="page">');

// Fix the end of the file
content = content.replace('</body></html>', '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed HTML structure');
