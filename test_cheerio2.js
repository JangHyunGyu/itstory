const cheerio = require('cheerio');
const html = '<template id="t1"><div class="a">Old</div></template>';
const $ = cheerio.load(html);
console.log('html:', $('template').html());
console.log('children:', $('template').children().length);
