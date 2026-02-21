const fs = require('fs');
const cheerio = require('cheerio');
const content = fs.readFileSync('c:/workspace/itstory/computers.html', 'utf-8');
const $ = cheerio.load(content);
let texts = [];
$('.timeline-group__summary, .event-detail__summary, .event-detail__story, .event-detail__notes').each((i, el) => {
    texts.push($(el).text().trim());
});
console.log(texts.slice(0, 5).join('\n\n'));
