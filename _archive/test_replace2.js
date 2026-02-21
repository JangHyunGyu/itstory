const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = 'c:\\workspace\\itstory';
const file = 'databases.html';
const filePath = path.join(dir, file);
const currentContent = fs.readFileSync(filePath, 'utf8');

const originalContent = execSync(`git show HEAD:${file}`, { cwd: dir, encoding: 'utf8' });
const mainRegex = /(<main class="page__main" id="main" role="main">[\s\S]*?<\/main>)/;
const originalMainMatch = originalContent.match(mainRegex);

let newMainContent = originalMainMatch[1];
const filenameWithoutExt = file.replace('.html', '');

const imgRegex = /(<p class="event-detail__year">(\d{4})<\/p>[\s\S]*?<div class="event-detail__story">)/g;
newMainContent = newMainContent.replace(imgRegex, (match, p1, p2) => {
    return `${p1}\n\t\t\t\t\t<img src="assets/images/story_${filenameWithoutExt}_${p2}.png" alt="${p2}년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">`;
});

const updatedContent = currentContent.replace(mainRegex, () => newMainContent);

console.log('currentContent length:', currentContent.length);
console.log('updatedContent length:', updatedContent.length);
console.log('originalContent length:', originalContent.length);
console.log('newMainContent length:', newMainContent.length);
console.log('Is equal?', currentContent === updatedContent);
