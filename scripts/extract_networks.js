const fs = require('fs');
const html = fs.readFileSync('c:/workspace/itstory/networks.html', 'utf8');
const regex = /<div class="event-detail__(story|notes)">([\s\S]*?)<\/div>/g;
let match;
const results = [];
while ((match = regex.exec(html)) !== null) {
    results.push({
        type: match[1],
        content: match[2],
        index: match.index
    });
}
fs.writeFileSync('c:/workspace/itstory/networks_extracted.json', JSON.stringify(results, null, 2));
