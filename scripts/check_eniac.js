const fs = require('fs');
const cheerio = require('cheerio');
const content = fs.readFileSync('c:/workspace/itstory/computers.html', 'utf-8');
const $ = cheerio.load(content);
console.log($('.event-detail__summary').eq(2).text().trim());
