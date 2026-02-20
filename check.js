const fs = require('fs');
const content = fs.readFileSync('c:/workspace/itstory/networks.html', 'utf8');
const matches = content.match(/<p class="timeline-group__summary">.*?<\/p>/gs);
console.log(matches.slice(0, 2).join('\n'));
