const cheerio = require('cheerio');
const html = '<body><template id="t1"><div class="a">Old</div></template></body>';
const $ = cheerio.load(html);

$('template').each((i, el) => {
  const templateHtml = $(el).html();
  const $template = cheerio.load(templateHtml, null, false);
  $template('.a').text('New');
  $(el).html($template.html());
});

console.log($.html());
