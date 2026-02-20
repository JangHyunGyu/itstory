const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = 'c:\\workspace\\itstory';
const filesToFix = [
    'databases.html',
    'os.html',
    'was.html',
    'web-structure.html',
    'web-styling.html',
    'web-interaction.html',
    'web-tools.html'
];

filesToFix.forEach(file => {
    const filePath = path.join(dir, file);
    const currentContent = fs.readFileSync(filePath, 'utf8');
    
    // Get original content from HEAD
    const originalContent = execSync(`git show HEAD:${file}`, { cwd: dir, encoding: 'utf8' });
    
    // Extract <main> from original content
    const mainRegex = /(<main class="page__main" id="main" role="main">[\s\S]*?<\/main>)/;
    const originalMainMatch = originalContent.match(mainRegex);
    
    if (!originalMainMatch) {
        console.error(`Could not find <main> in original ${file}`);
        return;
    }
    
    let newMainContent = originalMainMatch[1];
    const filenameWithoutExt = file.replace('.html', '');
    
    // Insert <img> tags into the original <main> content
    const imgRegex = /(<p class="event-detail__year">(\d{4})<\/p>[\s\S]*?<div class="event-detail__story">)/g;
    newMainContent = newMainContent.replace(imgRegex, (match, p1, p2) => {
        return `${p1}\n\t\t\t\t\t<img src="assets/images/story_${filenameWithoutExt}_${p2}.png" alt="${p2}년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">`;
    });
    
    // Replace <main> in current content with the new <main> content
    const updatedContent = currentContent.replace(mainRegex, newMainContent);
    
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Fixed ${file}`);
});

console.log('Done!');
