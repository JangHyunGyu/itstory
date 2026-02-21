const cheerio = require('cheerio');
const html = '<template id="t1"><div class="a">Old</div></template>';
const $ = cheerio.load(html);
$('template').find('.a').text('New');
console.log($.html());
