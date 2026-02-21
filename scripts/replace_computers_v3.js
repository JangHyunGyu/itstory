const fs = require('fs');

const filePath = 'c:/workspace/itstory/computers.html';
let content = fs.readFileSync(filePath, 'utf-8');

const replacements = [
    [
        '<p class="event-detail__summary">"대포알이 어디로 날아갈지 빨리 계산해 줄 수 없나요\\?"라는 부탁에 1만 8천 개의 반짝이는 진공관이 짠! 하고 대답한 순간이에요\\.</p>',
        '<p class="event-detail__summary">포탄의 궤적을 신속하게 계산해야 하는 군사적 필요성에 의해, 최초의 범용 전자식 컴퓨터인 ENIAC이 개발되었습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_1946\\.png" alt="1946년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>에니악은 집채만큼 커다란 몸집에 전구처럼 생긴 진공관을 1만 8천 개나 품고 있는 거인 계산기였어요\\. 비록 사람들이 복잡한 전선을 일일이 손으로 꽂아야 했지만, 사람이 며칠 밤을 새워야 할 계산을 눈 깜짝할 새인 몇 초 만에 뚝딱 해치웠답니다\\. 전기로 움직이는 컴퓨터가 얼마나 대단한지 세상에 널리 알린 멋진 친구였죠\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1946.png" alt="1946년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>제2차 세계대전 당시, 미군은 포탄의 탄도 표를 계산하는 데 엄청난 인력과 시간을 소모하고 있었습니다. 이를 해결하기 위해 존 모클리와 J. 프레스퍼 에커트는 약 1만 8천 개의 진공관을 사용한 거대한 전자식 컴퓨터, ENIAC(에니악)을 개발했습니다.</p>\n\t\t\t\t\t<p>ENIAC은 기존의 기계식 계산기보다 1,000배 이상 빠른 속도로 연산을 수행했습니다. 사람이 20시간 걸려 풀던 탄도 방정식을 단 30초 만에 해결하는 놀라운 성능을 보여주며, 본격적인 전자식 컴퓨팅 시대의 개막을 알렸습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<div class="event-detail__notes">\\s*<p>에니악은 여러 개의 계산 회로를 한꺼번에 윙윙 돌려서 1초에 수천 번이나 계산을 할 수 있었어요\\. 스위치를 켜고 끄고 굵은 선을 직접 연결해서 할 일을 알려줘야 했지만, 이전 기계들과는 비교도 안 될 만큼 엄청나게 빨랐어요\\. 이 거인 덕분에 다음 세대의 더 똑똑한 컴퓨터 아이디어들이 쑥쑥 자라날 수 있었답니다\\.</p>\\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>ENIAC은 튜링 완전(Turing-complete)한 최초의 범용 전자 컴퓨터였습니다. 다만, 새로운 프로그램을 실행하려면 수많은 케이블과 스위치를 직접 다시 연결해야 하는 하드웨어적인 프로그래밍 방식을 사용했습니다. 이는 훗날 폰 노이만 구조(내장형 프로그램 방식)가 등장하는 계기가 되었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<p class="event-detail__summary">"아휴, 매번 전선 갈아 끼우기 너무 힘들어!"라는 투덜거림이 "명령을 컴퓨터 머릿속에 쏙 넣어두자!"라는 멋진 생각으로 바뀐 순간이에요\\.</p>',
        '<p class="event-detail__summary">"프로그램을 실행할 때마다 하드웨어 배선을 다시 해야 하는 비효율을 어떻게 해결할까?"라는 고민에서 내장형 프로그램 방식이 탄생했습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_1949\\.png" alt="1949년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>에드삭은 "매번 복잡하게 전선을 꽂았다 뺐다 하지 말고, 할 일 목록을 숫자처럼 컴퓨터 머릿속에 기억시켜 두자!"라는 고민을 했죠\\. 이 멋진 생각 덕분에, 겉모습은 그대로 두고 속마음\\(소프트웨어\\)만 쏙쏙 바꾸면 여러 가지 일을 척척 해내는 진짜 현대적인 컴퓨터가 태어났답니다\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1949.png" alt="1949년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>초기 컴퓨터는 새로운 작업을 수행할 때마다 수많은 케이블을 다시 연결해야 했습니다. 폰 노이만은 데이터뿐만 아니라 프로그램 명령어 자체도 컴퓨터 내부의 메모리에 저장하여 실행하는 \'내장형 프로그램 방식\'을 제안했습니다.</p>\n\t\t\t\t\t<p>영국 케임브리지 대학에서 개발된 EDSAC은 이 폰 노이만 구조를 최초로 실용화한 컴퓨터입니다. 하드웨어의 물리적인 변경 없이 소프트웨어만 교체하여 다양한 작업을 수행할 수 있게 됨으로써, 진정한 의미의 범용 컴퓨터 시대가 열렸습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<div class="event-detail__notes">\\s*<p>에드삭은 할 일 목록과 숫자를 같은 기억 창고에 보관하는 마법을 처음으로 보여준 컴퓨터예요\\. 찰랑거리는 수은을 이용한 기억 장치에 천 개 정도의 단어를 담아두고, 자주 쓰는 명령은 미리 준비해 두었다가 필요할 때 쏙쏙 꺼내 썼죠\\. 덕분에 사람들은 땀 뻘뻘 흘리며 전선을 만지지 않고도 새로운 프로그램을 마음껏 만들어 볼 수 있었어요\\.</p>\\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>EDSAC은 수은 지연선 메모리를 사용하여 명령어와 데이터를 동일한 저장 공간에 보관했습니다. 또한, 자주 사용하는 서브루틴(Subroutine) 라이브러리를 도입하여 프로그래밍의 효율성을 크게 높였습니다. 오늘날 우리가 사용하는 모든 컴퓨터와 스마트폰은 이 폰 노이만 구조를 기본 아키텍처로 채택하고 있습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<p class="event-detail__summary">"우와! 기계가 사람보다 먼저 선거 결과를 맞혔다고요\\?" 깜짝 놀란 사람들의 환호성과 함께 컴퓨터가 우리 곁으로 다가온 날이에요\\.</p>',
        '<p class="event-detail__summary">컴퓨터가 연구실을 벗어나 기업과 정부의 데이터 처리에 활용되기 시작하며, 상업용 컴퓨터 시대의 막이 올랐습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_1951\\.png" alt="1951년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>유니박은 텔레비전에 나와서 선거 결과를 사람보다 훨씬 빨리 척척 맞혀서 온 세상을 깜짝 놀라게 했어요\\. 그걸 본 회사 사장님들은 "우리 회사 물건 세는 일도 저 똑똑한 기계한테 맡기고 싶어!"라며 줄을 섰죠\\. 드디어 컴퓨터가 어두운 연구실을 나와서 사람들을 돕는 멋진 일꾼이 된 거랍니다\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1951.png" alt="1951년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>ENIAC의 개발자인 모클리와 에커트가 설립한 회사에서 제작한 UNIVAC I은 세계 최초의 상업용 컴퓨터입니다. 1952년 미국 대통령 선거 당시, 개표가 채 끝나기도 전에 CBS 방송을 통해 아이젠하워의 압승을 정확하게 예측하여 대중에게 컴퓨터의 위력을 각인시켰습니다.</p>\n\t\t\t\t\t<p>이후 UNIVAC은 인구 조사국, 보험사, 대기업 등에 도입되어 방대한 데이터를 처리하는 데 사용되었습니다. 컴퓨터가 단순한 과학 계산용 도구를 넘어, 비즈니스와 행정 업무의 효율성을 극대화하는 필수적인 인프라로 자리 잡기 시작한 것입니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<div class="event-detail__notes">\\s*<p>유니박 I은 길쭉한 자기테이프에 정보를 담고, 1초에 무려 1900번이나 덧셈을 할 수 있었어요\\. 컴퓨터 기계뿐만 아니라 회사에 딱 맞는 프로그램도 만들어주고 고장 나면 고쳐주는 서비스까지 함께 팔았죠\\. 이때부터 컴퓨터는 돈을 주고 사고파는 아주 중요한 \\\'상품\\\'이 되었어요\\.</p>\\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>UNIVAC I은 천공 카드 대신 자기 테이프(Magnetic Tape)를 주 저장 매체로 사용하여 데이터 입출력 속도를 획기적으로 개선했습니다. 또한, 숫자뿐만 아니라 알파벳 문자 데이터도 원활하게 처리할 수 있어 상업적인 데이터베이스 관리에 적합했습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<p class="event-detail__summary">"휴, 이제 펑! 하고 터질 걱정은 없겠지\\?" 뜨거운 진공관 대신 작고 시원한 트랜지스터 친구가 찾아와 연구실이 평화로워졌어요\\.</p>',
        '<p class="event-detail__summary">크고 발열이 심한 진공관을 대체할 작고 효율적인 반도체 소자, 트랜지스터의 발명은 현대 전자 산업의 기반을 마련했습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_1956\\.png" alt="1956년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>옛날 컴퓨터 속에 있던 진공관은 너무 뜨거워서 툭하면 고장이 났어요\\. "어떻게 하면 컴퓨터가 아프지 않을까\\?"라는 고민을 했죠\\. 그래서 작고 단단한 \\\'트랜지스터\\\'라는 새 친구로 바꿔주었더니, 컴퓨터가 훨씬 작아지고 튼튼해졌어요\\. 이제 윙윙 돌아가는 시끄러운 에어컨 없이도 컴퓨터가 쌩쌩 잘 돌아가게 되었답니다\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1956.png" alt="1956년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>초기 컴퓨터에 사용된 진공관은 전력 소모가 많고 열이 심하게 발생하며 수명이 짧다는 치명적인 단점이 있었습니다. 벨 연구소의 존 바딘, 월터 브래튼, 윌리엄 쇼클리는 반도체 물질(게르마늄)을 이용해 전류의 흐름을 제어하는 \'트랜지스터\'를 발명했습니다.</p>\n\t\t\t\t\t<p>손톱보다 작은 트랜지스터는 진공관과 동일한 역할을 하면서도 크기는 훨씬 작고, 전력 소모는 적으며, 내구성은 뛰어났습니다. 이 혁신적인 발명 덕분에 컴퓨터는 소형화, 경량화, 대중화의 길을 걸을 수 있었으며, 현대 모든 전자기기의 핵심 부품으로 자리 잡았습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<div class="event-detail__notes">\\s*<p>트랜지스터를 쓴 컴퓨터는 전기도 아주 조금 먹고 고장도 잘 나지 않았어요\\. 덕분에 밤낮없이 켜 두어도 끄떡없었죠\\. IBM 7000 시리즈 같은 회사용 컴퓨터들이 이 멋진 기술을 쓰기 시작하면서, 컴퓨터를 유지하는 데 드는 돈을 엄청나게 아낄 수 있었어요\\.</p>\\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>트랜지스터는 전기 신호를 증폭하거나 스위치 역할을 하는 반도체 소자입니다. 수십억 개의 트랜지스터가 모여 0과 1의 디지털 신호를 처리하는 논리 회로를 구성합니다. 트랜지스터의 발명은 진공관 시대를 종식시키고, 고집적 반도체(IC) 시대를 여는 결정적인 도약이었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<p class="event-detail__summary">"새 컴퓨터를 사도 예전 프로그램이랑 친하게 지내게 해 주세요!"라는 사람들의 소원이 마법 같은 System/360을 태어나게 했어요\\.</p>',
        '<p class="event-detail__summary">"하드웨어가 업그레이드될 때마다 소프트웨어를 새로 작성해야 하는 비효율을 어떻게 해결할까?"라는 고민에서 호환성을 갖춘 IBM System/360이 탄생했습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_1964\\.png" alt="1964년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>옛날에는 컴퓨터를 새것으로 바꾸면, 힘들게 만든 프로그램도 처음부터 다시 만들어야 했어요\\. 그래서 IBM 아저씨들은 "어떤 기계든 똑같은 언어로 대화하게 만들자!"라는 멋진 규칙을 정했죠\\. 덕분에 한 번 만든 프로그램을 이 컴퓨터, 저 컴퓨터에서 모두 쓸 수 있게 되면서 컴퓨터 세상이 쑥쑥 커졌답니다\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1964.png" alt="1964년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>과거에는 컴퓨터 모델마다 명령어 체계가 달라서, 새로운 컴퓨터를 도입하면 기존에 사용하던 소프트웨어를 처음부터 다시 개발해야 했습니다. 기업들은 막대한 비용과 시간 낭비에 시달렸습니다. IBM은 이 문제를 해결하기 위해 \'호환성(Compatibility)\'이라는 개념을 도입한 System/360 제품군을 발표했습니다.</p>\n\t\t\t\t\t<p>System/360은 소형 모델부터 대형 모델까지 동일한 명령어 집합(Instruction Set)을 공유했습니다. 덕분에 기업은 작은 컴퓨터에서 개발한 프로그램을 향후 더 큰 컴퓨터로 업그레이드하더라도 수정 없이 그대로 사용할 수 있게 되었습니다. 이는 소프트웨어 자산의 가치를 보호하는 혁명적인 변화였습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<div class="event-detail__notes">\\s*<p>System/360은 정보를 8비트씩 묶어서 다루고, 모든 컴퓨터가 똑같은 명령어를 알아듣게 만들었어요\\. 한 번 정성껏 만든 소프트웨어를 작고 싼 컴퓨터부터 크고 비싼 컴퓨터까지 어디서든 다시 쓸 수 있었죠\\. 이 똑똑한 방법은 커다란 회사용 컴퓨터들의 훌륭한 모범이 되었어요\\.</p>\\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>System/360의 성공으로 하드웨어 아키텍처와 소프트웨어가 분리되는 현대적인 컴퓨팅 환경이 확립되었습니다. 또한, 다중 프로그래밍과 시분할 처리를 지원하는 강력한 운영체제(OS/360)가 도입되어, 컴퓨터 자원을 효율적으로 관리하는 기반이 마련되었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<p class="event-detail__summary">"모든 걸 똑같은 상자에 담아서 정리하면 어떨까\\?"라는 반짝이는 아이디어가 유닉스\\(UNIX\\)라는 멋진 문화를 만들어냈어요\\.</p>',
        '<p class="event-detail__summary">"복잡한 운영체제 대신, 단순하고 모듈화된 도구들을 조합하여 사용할 수 없을까?"라는 철학에서 UNIX 운영체제가 탄생했습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_1969\\.png" alt="1969년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>컴퓨터 박사님들은 "너무 복잡한 건 싫어! 레고 블록처럼 작고 귀여운 도구들을 찰칵찰칵 연결해서 쓰자!"라는 고민을 했죠\\. 컴퓨터 안의 모든 것을 똑같은 모양의 파일처럼 다루기로 한 이 단순하고 멋진 생각은, 오늘날 우리가 쓰는 스마트폰과 컴퓨터의 튼튼한 뿌리가 되었답니다\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1969.png" alt="1969년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>벨 연구소의 켄 톰슨과 데니스 리치는 거대하고 복잡한 운영체제 개발 프로젝트(Multics)에 실망하여, 작고 효율적인 새로운 운영체제인 UNIX를 개발했습니다. UNIX는 "한 가지 일을 잘하는 작은 프로그램들을 만들고, 이들을 파이프(Pipe)로 연결하여 복잡한 작업을 수행한다"는 독창적인 철학을 바탕으로 설계되었습니다.</p>\n\t\t\t\t\t<p>또한, 하드웨어 장치부터 일반 데이터까지 시스템의 모든 것을 \'파일\'이라는 동일한 형태로 취급하는 계층적 파일 시스템을 도입했습니다. 이러한 단순성과 유연성 덕분에 UNIX는 학계와 산업계로 빠르게 퍼져나갔으며, 오늘날 Linux와 macOS, Android 등 현대 운영체제의 근간이 되었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<div class="event-detail__notes">\\s*<p>유닉스는 "모든 것을 파일처럼 생각하자"는 규칙과, 작은 프로그램들을 파이프라는 통로로 연결해서 쓰는 재미있는 방법을 만들었어요\\. 귀찮은 일을 알아서 척척 해주는 자동화 마법도 부렸죠\\. 이 멋진 아이디어들이 모여서 리눅스나 맥OS 같은 훌륭한 운영체제들이 태어날 수 있었어요\\.</p>\\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>UNIX는 초기에는 어셈블리어로 작성되었으나, 이후 C 언어로 재작성되면서 하드웨어에 종속되지 않는 뛰어난 이식성(Portability)을 확보했습니다. 이는 운영체제가 특정 하드웨어 제조사의 전유물에서 벗어나 다양한 플랫폼으로 확장될 수 있는 결정적인 계기가 되었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<p class="event-detail__summary">"우와! 이 조그만 손톱만 한 조각에 똑똑한 두뇌가 다 들어있다고요\\?" 사람들의 놀란 입이 떡 벌어진 신기한 날이에요\\.</p>',
        '<p class="event-detail__summary">"복잡한 연산 회로를 하나의 작은 칩에 모두 집적할 수 없을까?"라는 발상에서 세계 최초의 상용 마이크로프로세서인 인텔 4004가 탄생했습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_1971\\.png" alt="1971년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>커다란 계산기의 뇌를 아주아주 작은 칩 하나에 쏙 넣을 수 있을까요\\? 인텔이라는 회사의 마법사들이 "우리가 해볼게!"라며 진짜로 만들어냈어요\\. 덕분에 윙윙 냉장고, 빵빵 자동차, 삑삑 장난감 어디에나 똑똑한 지능을 불어넣을 수 있는 마법의 시대가 활짝 열렸답니다\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1971.png" alt="1971년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>일본의 계산기 제조사 비지컴(Busicom)은 인텔에 새로운 전자계산기를 위한 12개의 맞춤형 칩 설계를 의뢰했습니다. 그러나 인텔의 엔지니어 테드 호프와 페데리코 파진은 복잡한 맞춤형 칩 대신, 소프트웨어로 제어할 수 있는 범용 연산 장치를 하나의 칩에 통합하는 아이디어를 제안했습니다.</p>\n\t\t\t\t\t<p>그 결과, CPU의 핵심 기능(연산 및 제어)을 단일 실리콘 칩에 집적한 세계 최초의 마이크로프로세서 \'인텔 4004\'가 탄생했습니다. 손톱만 한 크기의 이 칩은 과거 방 하나를 차지했던 ENIAC과 맞먹는 연산 능력을 갖추고 있었으며, 개인용 컴퓨터(PC) 혁명의 기술적 토대가 되었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<div class="event-detail__notes">\\s*<p>인텔 4004라는 이 작은 칩 안에는 무려 2300개의 트랜지스터 요정들이 살고 있었어요\\. 다른 기억 장치와 손을 잡고 여러 기계의 똑똑한 두뇌 역할을 척척 해냈죠\\. 복잡한 뇌를 작은 칩 하나로 뚝딱 해결하면서, 기계를 만드는 돈과 시간을 엄청나게 아낄 수 있었어요\\.</p>\\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>마이크로프로세서는 중앙처리장치(CPU)의 기능을 하나의 집적회로(IC)에 담은 것입니다. 하드웨어를 변경하지 않고도 소프트웨어 명령어만 바꾸면 다양한 용도로 활용할 수 있는 이 범용성 덕분에, 가전제품부터 산업용 기기까지 모든 분야에 컴퓨터 기술이 스며들 수 있었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<p class="event-detail__summary">"플러그만 꽂으면 우리 집에서도 뿅뿅 게임을 할 수 있대요!"라는 신나는 소문이 온 동네에 퍼져나갔어요\\.</p>',
        '<p class="event-detail__summary">"전문가가 아닌 일반인도 가정에서 쉽게 사용할 수 있는 컴퓨터를 만들자"는 목표로 개발된 Apple II가 개인용 컴퓨터의 대중화를 이끌었습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_1977\\.png" alt="1977년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>스티브 워즈니악 아저씨는 "어려운 조립 없이, 텔레비전처럼 전원만 켜면 바로 쓸 수 있는 컴퓨터를 만들자!"라는 고민을 했죠\\. 덕분에 뚝딱뚝딱 조립할 필요 없이 따뜻한 거실에 앉아 숙제도 하고 재미있는 게임도 할 수 있게 되었어요\\. 컴퓨터가 친근한 가전제품 친구가 된 거랍니다\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1977.png" alt="1977년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>초기의 개인용 컴퓨터는 사용자가 직접 부품을 납땜하고 조립해야 하는 전문가들의 전유물이었습니다. 스티브 워즈니악과 스티브 잡스는 플라스틱 케이스에 키보드와 전원 공급 장치를 일체화하고, 일반 TV를 모니터로 사용할 수 있는 완성형 컴퓨터 \'Apple II\'를 출시했습니다.</p>\n\t\t\t\t\t<p>Apple II는 컬러 그래픽을 지원하고 VisiCalc와 같은 혁신적인 스프레드시트 소프트웨어를 구동할 수 있어, 가정뿐만 아니라 교육 기관과 중소기업에서도 폭발적인 인기를 끌었습니다. 이는 컴퓨터가 친숙한 가전제품처럼 대중의 일상 속으로 들어오는 결정적인 계기가 되었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<div class="event-detail__notes">\\s*<p>애플 II는 텔레비전 화면을 연결하고, 정보를 저장하는 곳도 있고, 컴퓨터와 대화하는 언어\\(BASIC\\)도 미리 들어있어서 "사서 바로 쓰는" 아주 편리한 친구였어요\\. 덕분에 학교와 회사로 빠르게 퍼져나갔고, 이 친구를 위한 재미있는 프로그램들도 쑥쑥 함께 자라났어요\\.</p>\\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>Apple II는 개방형 슬롯 구조를 채택하여 사용자가 메모리를 확장하거나 플로피 디스크 드라이브 등 다양한 주변기기를 쉽게 추가할 수 있었습니다. 이러한 확장성은 서드파티 하드웨어 및 소프트웨어 생태계가 자생적으로 성장하는 든든한 토대가 되었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<p class="event-detail__summary">"어려운 말 대신 쉬운 말만 쓰면 훨씬 빠르지 않을까\\?" 칠판 앞의 재미있는 토론이 쌩쌩 달리는 새로운 칩을 만들었어요\\.</p>',
        '<p class="event-detail__summary">"복잡한 명령어 대신, 자주 쓰이는 단순한 명령어만으로 프로세서를 설계하면 어떨까?"라는 발상에서 RISC 아키텍처가 탄생했습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_1980\\.png" alt="1980년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>컴퓨터에게 너무 복잡한 명령을 내리면 끙끙대느라 오히려 느려진답니다\\. 그래서 "자주 쓰는 아주 쉬운 명령만 남겨두자!"라는 고민을 했죠\\. 이렇게 칩을 다시 예쁘게 꾸몄더니, 컴퓨터가 깃털처럼 가벼워져서 훨씬 빨리 달리게 되었어요\\. 지금 우리가 쓰는 스마트폰의 훌륭한 조상님이랍니다\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1980.png" alt="1980년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>초기 프로세서 설계자들은 프로그래밍을 쉽게 만들기 위해 하나의 명령어로 복잡한 작업을 수행할 수 있는 CISC(Complex Instruction Set Computer) 방식을 선호했습니다. 그러나 IBM의 존 코크 연구팀은 실제 프로그램이 실행될 때 복잡한 명령어는 거의 사용되지 않고, 단순한 명령어들이 주로 사용된다는 사실을 발견했습니다.</p>\n\t\t\t\t\t<p>그들은 자주 사용되는 단순한 명령어들만으로 프로세서를 설계하여 실행 속도를 극대화하는 RISC(Reduced Instruction Set Computer) 아키텍처를 제안했습니다. 이 설계 철학은 프로세서의 크기와 전력 소모를 줄이면서도 성능을 높일 수 있어, 오늘날 스마트폰과 태블릿에 널리 쓰이는 ARM 프로세서의 핵심 기반이 되었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<div class="event-detail__notes">\\s*<p>801이라는 칩은 명령어의 길이를 똑같이 맞추고, 물건을 가져오고 저장하는 일을 따로따로 나누는 똑똑한 규칙\\(RISC\\)을 처음 보여주었어요\\. 복잡한 길이 단순해지니 달리는 속도를 훨씬 높일 수 있었죠\\. 짧고 쉬운 명령들을 레고처럼 조립해서 어려운 일도 척척 해낼 수 있다는 걸 증명한 멋진 실험이었어요\\.</p>\\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>RISC 아키텍처는 명령어의 길이를 고정하고 파이프라이닝(Pipelining) 기술을 적극적으로 활용하여 매 클럭 사이클마다 하나의 명령어를 처리하는 것을 목표로 합니다. 이는 하드웨어의 복잡성을 줄이고 컴파일러의 최적화 기술에 더 많이 의존하는 현대적인 프로세서 설계의 패러다임 전환이었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<p class="event-detail__summary">"우리끼리만 알지 말고, 만드는 방법을 모두에게 알려주자!"라는 착한 마음이 전 세계에 컴퓨터 친구들을 가득 채웠어요\\.</p>',
        '<p class="event-detail__summary">"누구나 책상 위에 자신만의 컴퓨터를 가질 수 없을까?"라는 비전이 IBM PC를 통해 현실화되며, 개인용 컴퓨터의 대중화 시대가 열렸습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_1981\\.png" alt="1981년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>IBM 아저씨들은 꽁꽁 숨겨두었던 컴퓨터 설계도를 활짝 펼쳐 보여주었어요\\. "누구나 동네 가게에서 부품을 사서 뚝딱뚝딱 조립할 수 있어요!"라고 말했죠\\. 이 멋진 나눔 덕분에 똑같이 생긴 쌍둥이 컴퓨터들이 쏟아져 나왔고, 전 세계 어느 사무실에 가도 컴퓨터를 볼 수 있게 되었답니다\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1981.png" alt="1981년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>1970년대 후반 애플 등이 주도하던 초기 개인용 컴퓨터 시장에, 대형 컴퓨터의 강자였던 IBM이 \'IBM PC(Model 5150)\'를 출시하며 본격적으로 뛰어들었습니다. IBM은 개발 기간을 단축하기 위해 자사의 독자적인 부품 대신, 인텔의 프로세서와 마이크로소프트의 운영체제(MS-DOS) 등 기성품을 조합하는 개방형 아키텍처(Open Architecture)를 채택했습니다.</p>\n\t\t\t\t\t<p>IBM이 하드웨어 설계 명세를 공개하자, 수많은 제조사가 IBM PC와 호환되는 \'클론(Clone)\' 컴퓨터를 생산하기 시작했습니다. 이는 치열한 경쟁과 가격 하락을 유도했고, 결과적으로 개인용 컴퓨터가 전 세계의 사무실과 가정으로 빠르게 보급되는 기폭제가 되었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<div class="event-detail__notes">\\s*<p>IBM PC는 인텔의 두뇌와 마이크로소프트의 운영체제를 썼어요\\. 게다가 새로운 부품을 꽂을 수 있는 빈자리와 컴퓨터를 깨우는 비밀 주문\\(BIOS\\)까지 모두에게 알려주었죠\\. 덕분에 다른 회사들도 쉽게 똑같은 컴퓨터를 만들 수 있었고, 이게 바로 오늘날 우리가 쓰는 컴퓨터 세상의 튼튼한 밑바탕이 되었어요\\.</p>\\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>IBM PC의 개방형 아키텍처는 하드웨어와 소프트웨어 생태계를 분리하여 각각의 전문 기업이 성장할 수 있는 토양을 마련했습니다. 이 과정에서 인텔(CPU)과 마이크로소프트(OS)가 PC 산업의 새로운 권력으로 부상하는 \'윈텔(Wintel)\' 동맹의 서막이 열렸습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<p class="event-detail__summary">"손가락으로 톡! 누르기만 하면 다른 책으로 슝~ 날아갈 수 있다면\\?" 팀 버너스-리 아저씨의 재미있는 상상이 거대한 거미줄을 만들었어요\\.</p>',
        '<p class="event-detail__summary">"전 세계의 연구자들이 흩어져 있는 문서를 쉽게 연결하고 공유할 수 없을까?"라는 팀 버너스리의 아이디어가 월드 와이드 웹(WWW)의 탄생으로 이어졌습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_1989\\.png" alt="1989년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>팀 버너스-리 아저씨는 "세상의 모든 문서가 거미줄처럼 끈끈하게 연결되면 얼마나 좋을까\\?"라는 고민을 했죠\\. 마우스로 파란 글씨를 톡! 누르기만 하면 지구 반대편에 있는 친구의 일기장도 볼 수 있는 신기한 \\\'웹\\(Web\\)\\\'이 태어났고, 이때부터 신나는 인터넷 세상이 활짝 열렸답니다\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1989.png" alt="1989년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>유럽 입자 물리 연구소(CERN)의 연구원 팀 버너스리는 수많은 과학자가 작성한 방대한 논문과 자료를 효율적으로 관리하고 공유하는 데 어려움을 겪고 있었습니다. 그는 문서 안의 특정 단어를 클릭하면 관련된 다른 문서로 즉시 이동할 수 있는 \'하이퍼텍스트(Hypertext)\' 개념을 인터넷에 적용하기로 했습니다.</p>\n\t\t\t\t\t<p>그는 문서를 작성하는 언어(HTML), 문서를 주고받는 규칙(HTTP), 그리고 문서의 주소(URL)를 고안하여 \'월드 와이드 웹(WWW)\'을 창시했습니다. 1993년 CERN이 이 기술을 누구나 무료로 사용할 수 있도록 공개하면서, 웹은 폭발적으로 성장하여 오늘날 우리가 아는 인터넷 세상의 기반이 되었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<div class="event-detail__notes">\\s*<p>웹은 아주 쉬운 규칙과 문서 모양을 만들어서, 서로 다르게 생긴 컴퓨터들을 하나로 묶어주었어요\\. 곧이어 인터넷 바다를 항해하는 브라우저 배와 정보를 나눠주는 서버 항구들이 생겨났고, 누구나 쉽게 정보를 주고받는 멋진 통로가 완성되었어요\\.</p>\\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>월드 와이드 웹은 인터넷이라는 물리적인 통신망 위에 구축된 거대한 정보 공간입니다. 팀 버너스리가 웹의 핵심 기술에 대한 특허를 주장하지 않고 퍼블릭 도메인으로 공개한 결정은, 인터넷이 특정 기업에 종속되지 않고 인류 공동의 지식 저장소로 발전하는 데 결정적인 역할을 했습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<p class="event-detail__summary">"제가 재미로 만든 프로그램인데, 공짜니까 다 같이 가지고 놀아볼래요\\?"라는 편지 한 통이 온 세상을 들썩이게 했어요\\.</p>',
        '<p class="event-detail__summary">"누구나 자유롭게 사용하고 수정할 수 있는 운영체제를 만들자"는 리누스 토발즈의 프로젝트가 전 세계 개발자들의 참여를 이끌어내며 오픈소스 혁명을 일으켰습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_1991\\.png" alt="1991년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>리누스 토르발스라는 대학생 형이 "심심해서 만들어본 컴퓨터 프로그램인데, 다 같이 써보자!"라며 선물을 주었어요\\. 전 세계의 똑똑한 친구들이 모여들어 "여긴 내가 고칠게!", "여긴 내가 예쁘게 꾸밀게!"라며 힘을 합쳤죠\\. 이 멋진 협동 작전은 지금 엄청나게 큰 슈퍼컴퓨터부터 우리 손의 스마트폰까지 움직이는 마법의 힘이 되었답니다\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1991.png" alt="1991년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>핀란드의 대학생 리누스 토발즈는 개인용 PC에서 구동되는 유닉스(Unix) 호환 운영체제의 커널을 취미로 개발하기 시작했습니다. 그는 자신이 작성한 소스 코드를 인터넷에 무료로 공개하며, 전 세계의 해커와 개발자들에게 자유로운 수정과 재배포를 허락했습니다.</p>\n\t\t\t\t\t<p>이 작은 시작은 \'오픈소스(Open Source)\'라는 거대한 소프트웨어 개발 운동으로 번졌습니다. 수많은 개발자가 자발적으로 참여하여 버그를 수정하고 기능을 추가하면서, 리눅스는 상용 운영체제를 뛰어넘는 안정성과 성능을 갖추게 되었습니다. 오늘날 리눅스는 스마트폰(안드로이드)부터 거대한 클라우드 서버, 슈퍼컴퓨터에 이르기까지 IT 인프라의 핵심을 지탱하고 있습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<div class="event-detail__notes">\\s*<p>리눅스는 누구나 마음대로 고치고 친구들에게 나눠줄 수 있는 착한 약속\\(GPL\\)을 했어요\\. 덕분에 필요한 프로그램을 쏙쏙 골라 담는 바구니도 생기고, 사람들의 입맛에 딱 맞는 여러 가지 모양의 리눅스들이 쑥쑥 자라나게 되었어요\\.</p>\\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>리눅스의 성공은 소프트웨어를 독점적인 상품이 아닌, 공유하고 협력하여 발전시키는 \'지식의 공유재\'로 바라보는 오픈소스 철학의 승리입니다. 집단 지성을 활용한 이 개발 방식은 현대 소프트웨어 산업의 표준으로 자리 잡았습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<p class="event-detail__summary">"우와! 예쁜 그림 버튼만 콕 누르면 마법처럼 창이 열려요!" 사람들의 환호성 속에 윈도우 95가 화려하게 등장했어요\\.</p>',
        '<p class="event-detail__summary">"복잡한 텍스트 명령어 대신, 직관적인 그래픽으로 컴퓨터를 조작할 수 없을까?"라는 요구가 Windows 95의 대성공으로 이어지며 GUI 시대를 열었습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_1995\\.png" alt="1995년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>컴퓨터를 켜면 무서운 까만 화면 대신, 친절한 "시작" 버튼이 방긋 웃으며 반겨주었어요\\. "어떻게 하면 컴퓨터를 더 쉽게 쓸 수 있을까\\?"라는 고민 끝에, 마우스로 예쁜 그림\\(아이콘\\)을 콕콕 누르기만 하면 되는 마법의 화면이 탄생했죠\\. 덕분에 할아버지, 할머니, 어린아이까지 누구나 신나게 인터넷 탐험을 떠날 수 있게 되었답니다\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1995.png" alt="1995년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>과거의 PC는 검은 화면에 텍스트 명령어를 직접 입력해야 하는 MS-DOS 환경이 주류였기 때문에 일반 대중이 접근하기 어려웠습니다. 마이크로소프트가 출시한 Windows 95는 마우스를 이용해 아이콘과 창을 조작하는 그래픽 사용자 인터페이스(GUI)를 본격적으로 대중화시켰습니다.</p>\n\t\t\t\t\t<p>특히 화면 왼쪽 아래에 자리 잡은 \'시작(Start)\' 버튼과 작업 표시줄은 컴퓨터 조작의 직관성을 극대화했습니다. Windows 95의 폭발적인 성공은 PC가 전문가의 도구를 넘어 가정의 필수 가전제품으로 자리 잡는 결정적인 계기가 되었으며, 인터넷 익스플로러를 기본 탑재하여 웹의 대중화에도 크게 기여했습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<div class="event-detail__notes">\\s*<p>윈도우 95는 선만 꽂으면 바로 알아채는 똑똑한 기능과, 인터넷에 쉽게 연결하는 마법을 한 상자에 담아 선물했어요\\. 인터넷을 보는 브라우저와 글을 쓰는 프로그램들이 널리 퍼지면서, 누구나 쉽게 소프트웨어를 사서 쓰는 즐거운 세상이 활짝 열렸어요\\.</p>\\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>Windows 95는 16비트 DOS 기반에서 벗어나 32비트 선점형 멀티태스킹을 지원하는 현대적인 운영체제로의 전환점이었습니다. 플러그 앤 플레이(Plug and Play) 기능을 도입하여 하드웨어 설치의 번거로움을 줄이고, 사용자 친화적인 컴퓨팅 환경의 표준을 확립했습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<p class="event-detail__summary">"쓰던 장난감은 그대로 두고, 놀이터만 엄청나게 넓혀줄게!"라는 AMD 아저씨들의 멋진 약속이 진짜로 이루어진 날이에요\\.</p>',
        '<p class="event-detail__summary">"기존 32비트 소프트웨어와의 호환성을 유지하면서 메모리 한계를 극복할 수 없을까?"라는 고민에서 x86-64 아키텍처가 탄생했습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_2003\\.png" alt="2003년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>AMD 아저씨들은 "옛날 프로그램도 잘 돌아가면서, 기억력은 훨씬 좋아지는 마법의 칩을 만들자!"라는 고민을 했죠\\. 다른 사람들이 아예 처음부터 다시 만들자고 고집을 부릴 때, "익숙한 것에 힘을 더해주자!"라는 지혜로운 선택을 했어요\\.</p>\\s*<p>컴퓨터를 관리하는 사람들은 만세를 불렀어요\\. "우와! 프로그램을 다시 만들 필요 없이, 기억 장치만 꽂으면 컴퓨터가 헐크처럼 힘이 세지네!" 이 방법이 너무너무 좋아서, 결국 다른 회사들도 이 멋진 아이디어를 따라 하게 되었답니다\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_2003.png" alt="2003년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>2000년대 초반, 컴퓨터가 처리해야 할 데이터가 급증하면서 기존 32비트 아키텍처의 메모리 인식 한계(약 4GB)가 문제로 대두되었습니다. 인텔은 기존 구조를 버리고 완전히 새로운 64비트 아키텍처(Itanium)를 제안했지만, 호환성 문제로 시장의 외면을 받았습니다.</p>\n\t\t\t\t\t<p>반면 AMD는 기존 32비트 x86 명령어 세트를 확장하여 64비트 연산을 지원하는 \'x86-64(AMD64)\' 아키텍처를 발표했습니다. 기존 소프트웨어를 그대로 사용할 수 있으면서도 메모리 한계를 극복한 이 실용적인 접근 방식은 시장의 표준으로 자리 잡았고, 결국 인텔도 이를 수용하게 되었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<div class="event-detail__notes">\\s*<p>x86-64는 컴퓨터가 한 번에 꿀꺽 삼킬 수 있는 정보의 양을 두 배로 쑥 늘려준 마법이에요\\. 덕분에 컴퓨터가 엄청나게 넓은 기억의 방을 자유롭게 쓸 수 있게 되어서, 오늘날 우리가 즐기는 화려한 게임이나 엄청나게 많은 정보를 다루는 일이 가능해졌어요\\.</p>\\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>x86-64 아키텍처의 도입으로 PC와 서버는 이론상 16엑사바이트(EB)라는 방대한 메모리 공간을 다룰 수 있게 되었습니다. 이는 고해상도 3D 게임, 대규모 데이터베이스, 가상화 기술 등 메모리 집약적인 현대 컴퓨팅 환경이 발전할 수 있는 필수적인 기반이 되었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<p class="event-detail__summary">"컴퓨터 한 대 사려면 너무 오래 걸려요!"라는 투덜거림에, "이제 마법 주문 한 번이면 구름 위에서 컴퓨터가 뚝딱 나타나요!"라고 대답한 날이에요\\.</p>',
        '<p class="event-detail__summary">"남는 서버 자원을 다른 기업에 빌려주면 어떨까?"라는 아마존의 아이디어가 클라우드 컴퓨팅이라는 새로운 산업을 창출했습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_2006\\.png" alt="2006년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>옛날에는 인터넷 가게를 열려면 비싸고 무거운 컴퓨터를 직접 사서 낑낑대며 돌봐야 했어요\\. 하지만 아마존 아저씨들은 "수돗물 틀어 쓰듯이, 컴퓨터도 필요할 때만 빌려 쓰고 돈을 내면 어떨까\\?"라는 기발한 고민을 했죠\\.</p>\\s*<p>프로그램을 만드는 사람들은 신이 나서 춤을 추었어요\\. "야호! 이제 마우스 클릭 몇 번이면 엄청나게 센 슈퍼컴퓨터를 빌릴 수 있어!" 덕분에 돈이 없는 젊은이들도 반짝이는 아이디어만 있으면, 전 세계 사람들이 쓰는 멋진 서비스를 뚝딱 만들 수 있게 되었답니다\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_2006.png" alt="2006년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>전자상거래 기업 아마존은 연말 쇼핑 시즌의 폭주하는 트래픽을 감당하기 위해 막대한 서버 인프라를 구축했습니다. 하지만 평상시에는 유휴 자원이 넘쳐나는 비효율이 발생했습니다. 아마존은 이 남는 컴퓨팅 자원을 가상화 기술을 통해 외부 개발자와 기업에 임대하는 서비스(AWS EC2)를 시작했습니다.</p>\n\t\t\t\t\t<p>이것이 바로 현대적인 \'클라우드 컴퓨팅\'의 시작입니다. 기업들은 더 이상 값비싼 서버 장비를 직접 구매하고 관리할 필요 없이, 인터넷을 통해 필요한 만큼의 컴퓨팅 파워와 저장 공간을 빌려 쓰고 사용한 만큼만 비용을 지불하게 되었습니다. 이는 스타트업들이 초기 자본 없이도 혁신적인 서비스를 빠르게 출시할 수 있는 든든한 기반이 되었습니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<div class="event-detail__notes">\\s*<p>이것이 바로 구름 너머의 컴퓨터를 빌려 쓰는 \\\'클라우드 컴퓨팅\\\'의 시작이에요\\. 내 방에 시끄러운 컴퓨터를 두지 않아도, 멀리 있는 거대한 컴퓨터 마을의 힘을 빌려 쓸 수 있죠\\. 덕분에 누구나 쉽고 싸게 자신만의 인터넷 세상을 열 수 있는 멋진 시대가 왔어요\\.</p>\\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>클라우드 컴퓨팅은 IT 인프라를 소유(CAPEX)의 개념에서 구독(OPEX)의 개념으로 전환시켰습니다. 트래픽 변화에 따라 서버를 즉각적으로 늘리거나 줄일 수 있는 유연성(Elasticity)은 넷플릭스, 우버 등 글로벌 스케일의 서비스가 안정적으로 운영될 수 있는 핵심 동력입니다.</p>\n\t\t\t\t</div>'
    ],
    [
        '<p class="event-detail__summary">"전화도 하고, 노래도 듣고, 인터넷도 하는 요술 방망이가 내 손안에 쏙 들어왔다고요\\?" 온 세상이 깜짝 놀란 마법 같은 날이에요\\.</p>',
        '<p class="event-detail__summary">"전화기, 미디어 플레이어, 인터넷 통신 기기를 하나의 직관적인 터치 기기로 통합할 수 없을까?"라는 비전이 스마트폰 시대를 열었습니다.</p>'
    ],
    [
        '<div class="event-detail__story">\\s*<img src="assets/images/story_computers_2007\\.png" alt="2007년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\\s*<p>스티브 잡스 아저씨가 무대 위에서 "전화기랑 음악 재생기랑 인터넷 기기를 하나로 찰싹 합쳤습니다!"라고 외쳤을 때, 세상 사람들은 눈이 휘둥그레졌어요\\. "어떻게 하면 손가락 하나로 모든 걸 할 수 있을까\\?"라는 고민이, 누구나 재미있는 장난감\\(앱\\)을 만들어 팔 수 있는 신나는 장터까지 열어주었죠\\.</p>\\s*<p>발명가들은 "우와! 내가 만든 장난감이 전 세계 친구들의 주머니 속으로 쏙 들어간다니!"라며 가슴이 두근거렸어요\\. 곧이어 친구들과 수다 떠는 앱, 예쁜 사진을 자랑하는 앱들이 쏟아져 나와서 우리의 매일매일을 마법처럼 바꿔놓았답니다\\.</p>\\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_2007.png" alt="2007년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>애플의 스티브 잡스는 물리적인 키보드를 없애고 멀티 터치스크린을 탑재한 아이폰을 발표했습니다. 직관적인 터치 조작만으로 웹서핑, 음악 감상, 통화 등 모든 기능을 매끄럽게 사용할 수 있는 이 기기는, 휴대폰을 단순한 통신 수단에서 \'주머니 속의 강력한 컴퓨터\'로 재정의했습니다.</p>\n\t\t\t\t\t<p>이듬해 열린 앱스토어(App Store)는 전 세계의 개발자들이 자신이 만든 애플리케이션을 쉽게 배포하고 판매할 수 있는 생태계를 조성했습니다. 소셜 미디어, 모바일 게임, 길 찾기 등 수많은 앱이 쏟아져 나오며 사람들의 일상과 소통 방식을 근본적으로 변화시켰습니다.</p>\n\t\t\t\t</div>'
    ]
];

let totalReplaced = 0;
for (const [regexStr, newStr] of replacements) {
    const regex = new RegExp(regexStr, 'g');
    const matches = content.match(regex);
    if (matches) {
        content = content.replace(regex, newStr);
        totalReplaced++;
    } else {
        console.log("Failed to match:", regexStr.substring(0, 50) + "...");
    }
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log(`Done! Replaced ${totalReplaced} items.`);
