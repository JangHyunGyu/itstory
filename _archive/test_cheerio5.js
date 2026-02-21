const cheerio = require('cheerio');
const html = '<template id="t1"><div class="a">Old</div></template>';
const $ = cheerio.load(html);

$('template').each((i, el) => {
  const templateHtml = $(el).html();
  const $template = cheerio.load(templateHtml, null, false);
  $template('.a').text('New');
  console.log('templateHtml:', templateHtml);
  console.log('$template.html():', $template.html());
  $(el).html($template.html());
});
