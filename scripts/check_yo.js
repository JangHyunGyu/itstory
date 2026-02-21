const fs = require('fs');
const cheerio = require('cheerio');
const content = fs.readFileSync('c:/workspace/itstory/computers.html', 'utf-8');
const $ = cheerio.load(content);
$('.timeline-group__summary, .event-detail__summary, .event-detail__story, .event-detail__notes').each((i, el) => {
    const text = $(el).text();
    if (text.includes('요')) console.log(text);
});
