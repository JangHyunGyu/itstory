const cheerio = require('cheerio');
const html = '<template id="t1"><div class="a">Old</div></template>';
const $ = cheerio.load(html);
console.log('find:', $('template').find('.a').length);
$('template .a').text('New');
console.log($.html());
