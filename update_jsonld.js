const fs = require('fs');
const path = require('path');

const dir = 'c:\\workspace\\itstory';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.includes('-en.html'));

const replacements = {
    '"name": "컴퓨터 연대기"': '"name": "컴퓨터의 탄생"',
    '"name": "네트워크 연대기"': '"name": "인터넷과 통신"',
    '"name": "데이터베이스 연대기"': '"name": "데이터 저장소"',
    '"name": "운영체제 연대기"': '"name": "컴퓨터를 움직이는 뇌"',
    '"name": "웹 연대기"': '"name": "눈에 보이는 웹 (프론트엔드)"',
    '"name": "웹 문서 설계 연대기"': '"name": "뼈대 만들기 (HTML)"',
    '"name": "스타일링 진화 연대기"': '"name": "예쁘게 꾸미기 (CSS)"',
    '"name": "브라우저 인터랙션 연대기"': '"name": "움직임 더하기 (JS)"',
    '"name": "웹 제작 도구 연대기"': '"name": "더 쉽고 빠르게 (도구들)"',
    '"name": "웹 서버 연대기"': '"name": "보이지 않는 뒷단 (백엔드)"'
};

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    for (const [oldText, newText] of Object.entries(replacements)) {
        content = content.replace(new RegExp(oldText, 'g'), newText);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated JSON-LD in ${file}`);
});
