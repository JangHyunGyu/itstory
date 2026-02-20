const fs = require('fs');
const content = fs.readFileSync('c:/workspace/itstory/databases.html', 'utf-8');
console.log('timeline-group__summary:', (content.match(/class="timeline-group__summary"/g) || []).length);
console.log('event-detail__summary:', (content.match(/class="event-detail__summary"/g) || []).length);
console.log('event-detail__story:', (content.match(/class="event-detail__story"/g) || []).length);
console.log('event-detail__notes:', (content.match(/class="event-detail__notes"/g) || []).length);
