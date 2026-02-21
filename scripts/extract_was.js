const fs = require('fs');
const html = fs.readFileSync('c:/workspace/itstory/was.html', 'utf8');
const matches = html.match(/<div class="event-detail__(?:story|notes)">[\s\S]*?<\/div>/g);
if (matches) {
    matches.forEach((m, i) => {
        console.log(`--- Match ${i} ---`);
        console.log(m);
    });
} else {
    console.log('No matches found.');
}
