const fs = require('fs');
const cheerio = require('cheerio');
const content = fs.readFileSync('c:/workspace/itstory/computers.html', 'utf-8');
const $ = cheerio.load(content);
let totalLength = 0;
$('.timeline-group__summary, .event-detail__summary, .event-detail__story, .event-detail__notes').each((i, el) => {
    totalLength += $(el).text().length;
});
console.log('Total text length:', totalLength);
