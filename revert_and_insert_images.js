const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = 'c:\\workspace\\itstory';
const filesToRevert = [
    'databases.html',
    'os.html',
    'was.html',
    'web-structure.html',
    'web-styling.html',
    'web-interaction.html',
    'web-tools.html'
];

// 1. Revert the files to their original state (before the childish rewrite)
console.log('Reverting files...');
filesToRevert.forEach(file => {
    execSync(`git checkout HEAD -- ${file}`, { cwd: dir });
    console.log(`Reverted ${file}`);
});

// 2. Insert the <img> tags into the reverted files
console.log('\nInserting <img> tags...');
filesToRevert.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const filenameWithoutExt = file.replace('.html', '');

    // Regex to find the year and the start of the story div
    const regex = /(<p class="event-detail__year">(\d{4})<\/p>[\s\S]*?<div class="event-detail__story">)/g;
    
    content = content.replace(regex, (match, p1, p2) => {
        return `${p1}\n\t\t\t\t\t<img src="assets/images/story_${filenameWithoutExt}_${p2}.png" alt="${p2}년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">`;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Inserted images into ${file}`);
});

console.log('\nDone!');
