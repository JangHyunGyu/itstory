const fs = require('fs');
const content = fs.readFileSync('c:\\workspace\\itstory\\databases.html', 'utf8');
const mainRegex = /(<main class="page__main" id="main" role="main">[\s\S]*?<\/main>)/;
console.log(mainRegex.test(content));
