const fs = require('fs');
const path = require('path');

const dir = 'c:\\workspace\\itstory';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.includes('-en.html'));

const replacements = {
    '>홈 허브<': '>홈<',
    '>컴퓨터 연대기<': '>컴퓨터의 탄생<',
    '>네트워크 연대기<': '>인터넷과 통신<',
    '>데이터베이스 연대기<': '>데이터 저장소<',
    '>운영체제 연대기<': '>컴퓨터를 움직이는 뇌<',
    '>웹 제작 연대기<': '>눈에 보이는 웹 (프론트엔드)<',
    '"웹 제작 연대기"': '"눈에 보이는 웹 (프론트엔드)"',
    '>웹 제작 연대기 허브<': '>프론트엔드 허브<',
    '>웹 문서 설계 연대기<': '>뼈대 만들기 (HTML)<',
    '>스타일링 진화 연대기<': '>예쁘게 꾸미기 (CSS)<',
    '>브라우저 인터랙션 연대기<': '>움직임 더하기 (JS)<',
    '>웹 제작 도구 연대기<': '>더 쉽고 빠르게 (도구들)<',
    '>웹 서버 연대기<': '>보이지 않는 뒷단 (백엔드)<'
};

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace navigation text and other occurrences
    for (const [oldText, newText] of Object.entries(replacements)) {
        content = content.replace(new RegExp(oldText, 'g'), newText);
    }

    // Wrap WAS link in a group to match the frontend group
    const wasRegex = /(<div class="page__topic-nav-group" role="group" aria-label="눈에 보이는 웹 \(프론트엔드\)">[\s\S]*?<\/div>)\s*(<a href="was.html"([^>]*)>보이지 않는 뒷단 \(백엔드\)<\/a>)/;
    
    if (wasRegex.test(content)) {
        content = content.replace(wasRegex, `$1\n\t\t\t\t\t<div class="page__topic-nav-group" role="group" aria-label="보이지 않는 뒷단 (백엔드)">\n\t\t\t\t\t\t<span class="page__topic-nav-label">보이지 않는 뒷단 (백엔드)</span>\n\t\t\t\t\t\t<a href="was.html"$2 data-topic-role="parent">보이지 않는 뒷단 (백엔드)</a>\n\t\t\t\t\t</div>`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
});
