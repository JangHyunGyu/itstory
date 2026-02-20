const fs = require('fs');
const content = fs.readFileSync('c:\\workspace\\itstory\\os.html', 'utf-8');

console.log('timeline-group__summary:', (content.match(/<p class="timeline-group__summary">[\s\S]*?<\/p>/g) || []).length);
console.log('event-detail__summary:', (content.match(/<p class="event-detail__summary">[\s\S]*?<\/p>/g) || []).length);
console.log('event-detail__story:', (content.match(/<div class="event-detail__story">[\s\S]*?<\/div>/g) || []).length);
console.log('event-detail__notes:', (content.match(/<div class="event-detail__notes">[\s\S]*?<\/div>/g) || []).length);
