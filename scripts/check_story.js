const fs = require('fs');
const cheerio = require('cheerio');
const content = fs.readFileSync('c:/workspace/itstory/computers.html', 'utf-8');
const $ = cheerio.load(content);
console.log($('.event-detail__story').first().text().trim());
console.log($('.event-detail__notes').first().text().trim());
