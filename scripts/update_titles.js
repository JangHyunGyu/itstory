const fs = require('fs');
const path = require('path');

const dir = 'c:\\workspace\\itstory';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.includes('-en.html'));

const replacements = {
    '>네트워크 연대기 열기<': '>인터넷과 통신 열기<',
    '>컴퓨터 연대기 열기<': '>컴퓨터의 탄생 열기<',
    '>운영체제 연대기 열기<': '>컴퓨터를 움직이는 뇌 열기<',
    '>웹 연대기 열기<': '>눈에 보이는 웹 열기<',
    '>웹 서버 연대기 열기<': '>보이지 않는 뒷단 열기<',
    '>데이터베이스 연대기 열기<': '>데이터 저장소 열기<'
};

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    for (const [oldText, newText] of Object.entries(replacements)) {
        content = content.replace(new RegExp(oldText, 'g'), newText);
    }

    // Update <title> tags
    content = content.replace(/<title>.*컴퓨터 연대기.*<\/title>/, '<title>컴퓨터의 탄생 | ArcherLab IT Story</title>');
    content = content.replace(/<title>.*네트워크 연대기.*<\/title>/, '<title>인터넷과 통신 | ArcherLab IT Story</title>');
    content = content.replace(/<title>.*데이터베이스 연대기.*<\/title>/, '<title>데이터 저장소 | ArcherLab IT Story</title>');
    content = content.replace(/<title>.*운영체제 연대기.*<\/title>/, '<title>컴퓨터를 움직이는 뇌 | ArcherLab IT Story</title>');
    content = content.replace(/<title>.*웹 연대기.*<\/title>/, '<title>눈에 보이는 웹 (프론트엔드) | ArcherLab IT Story</title>');
    content = content.replace(/<title>.*웹 문서 설계 연대기.*<\/title>/, '<title>뼈대 만들기 (HTML) | ArcherLab IT Story</title>');
    content = content.replace(/<title>.*스타일링 진화 연대기.*<\/title>/, '<title>예쁘게 꾸미기 (CSS) | ArcherLab IT Story</title>');
    content = content.replace(/<title>.*브라우저 인터랙션 연대기.*<\/title>/, '<title>움직임 더하기 (JS) | ArcherLab IT Story</title>');
    content = content.replace(/<title>.*웹 제작 도구 연대기.*<\/title>/, '<title>더 쉽고 빠르게 (도구들) | ArcherLab IT Story</title>');
    content = content.replace(/<title>.*웹 서버 연대기.*<\/title>/, '<title>보이지 않는 뒷단 (백엔드) | ArcherLab IT Story</title>');
    content = content.replace(/<title>.*IT 역사 타임라인 허브.*<\/title>/, '<title>IT 역사 타임라인 허브: 컴퓨터·인터넷·OS·DB·웹 | ArcherLab IT Story</title>');

    // Update <h1> tags
    content = content.replace(/<h1 class="timeline-header__title">컴퓨터 연대기<\/h1>/, '<h1 class="timeline-header__title">컴퓨터의 탄생</h1>');
    content = content.replace(/<h1 class="timeline-header__title">네트워크 연대기<\/h1>/, '<h1 class="timeline-header__title">인터넷과 통신</h1>');
    content = content.replace(/<h1 class="timeline-header__title">데이터베이스 연대기<\/h1>/, '<h1 class="timeline-header__title">데이터 저장소</h1>');
    content = content.replace(/<h1 class="timeline-header__title">운영체제 연대기<\/h1>/, '<h1 class="timeline-header__title">컴퓨터를 움직이는 뇌</h1>');
    content = content.replace(/<h1 class="timeline-header__title">웹 연대기<\/h1>/, '<h1 class="timeline-header__title">눈에 보이는 웹 (프론트엔드)</h1>');
    content = content.replace(/<h1 class="timeline-header__title">웹 문서 설계 연대기<\/h1>/, '<h1 class="timeline-header__title">뼈대 만들기 (HTML)</h1>');
    content = content.replace(/<h1 class="timeline-header__title">스타일링 진화 연대기<\/h1>/, '<h1 class="timeline-header__title">예쁘게 꾸미기 (CSS)</h1>');
    content = content.replace(/<h1 class="timeline-header__title">브라우저 인터랙션 연대기<\/h1>/, '<h1 class="timeline-header__title">움직임 더하기 (JS)</h1>');
    content = content.replace(/<h1 class="timeline-header__title">웹 제작 도구 연대기<\/h1>/, '<h1 class="timeline-header__title">더 쉽고 빠르게 (도구들)</h1>');
    content = content.replace(/<h1 class="timeline-header__title">웹 서버 연대기<\/h1>/, '<h1 class="timeline-header__title">보이지 않는 뒷단 (백엔드)</h1>');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated titles and headers in ${file}`);
});
