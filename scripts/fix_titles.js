const fs = require('fs');
const path = require('path');

const dir = 'c:\\workspace\\itstory';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.includes('-en.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Reset titles based on filename
    let newTitle = '';
    switch(file) {
        case 'index.html': newTitle = 'IT 역사 타임라인 허브: 컴퓨터·인터넷·OS·DB·웹 | ArcherLab IT Story'; break;
        case 'computers.html': newTitle = '컴퓨터의 탄생 | ArcherLab IT Story'; break;
        case 'networks.html': newTitle = '인터넷과 통신 | ArcherLab IT Story'; break;
        case 'databases.html': newTitle = '데이터 저장소 | ArcherLab IT Story'; break;
        case 'os.html': newTitle = '컴퓨터를 움직이는 뇌 | ArcherLab IT Story'; break;
        case 'web.html': newTitle = '눈에 보이는 웹 (프론트엔드) | ArcherLab IT Story'; break;
        case 'web-structure.html': newTitle = '뼈대 만들기 (HTML) | ArcherLab IT Story'; break;
        case 'web-styling.html': newTitle = '예쁘게 꾸미기 (CSS) | ArcherLab IT Story'; break;
        case 'web-interaction.html': newTitle = '움직임 더하기 (JS) | ArcherLab IT Story'; break;
        case 'web-tools.html': newTitle = '더 쉽고 빠르게 (도구들) | ArcherLab IT Story'; break;
        case 'was.html': newTitle = '보이지 않는 뒷단 (백엔드) | ArcherLab IT Story'; break;
    }

    if (newTitle) {
        content = content.replace(/<title>.*<\/title>/, `<title>${newTitle}</title>`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed title in ${file}`);
});
