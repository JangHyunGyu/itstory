const fs = require('fs');
let content = fs.readFileSync('c:\\workspace\\itstory\\os.html', 'utf-8');

console.log('Before:', content.includes('마법의 주문을'));

content = content.replace(/<p class="timeline-group__summary">[\s\S]*?<\/p>/g, () => {
    return '<p class="timeline-group__summary">REPLACED</p>';
});

console.log('After:', content.includes('마법의 주문을'));
console.log('Replaced count:', (content.match(/REPLACED/g) || []).length);
