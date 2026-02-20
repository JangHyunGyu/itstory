import re

with open('c:/workspace/itstory/computers.html', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (
        r'<p class="timeline-group__summary">매일매일 끝없는 숫자 계산에 지친 수학자 아저씨들이 "기계가 대신 계산해 주면 얼마나 좋을까\?"라는 고민을 했죠\. 그래서 톱니바퀴를 뚝딱뚝딱 조립하기 시작했답니다\.</p>',
        '<p class="timeline-group__summary">매일 반복되는 숫자 계산에 지친 수학자들은 "기계가 대신 계산해 주면 얼마나 좋을까?"라는 고민을 했습니다. 그래서 톱니바퀴를 이용한 기계식 계산기를 고안하기 시작했습니다.</p>'
    ),
    (
        r'<p class="timeline-group__summary">사람이 일일이 말해주지 않아도, 구멍 뚫린 카드와 기호만 있으면 기계가 스스로 움직일 수 있다는 신기한 생각이 퐁퐁 솟아나기 시작했어요\.</p>',
        '<p class="timeline-group__summary">사람이 일일이 개입하지 않아도, 구멍 뚫린 카드와 기호만 있으면 기계가 정해진 절차에 따라 스스로 작동할 수 있다는 혁신적인 아이디어가 등장했습니다.</p>'
    ),
    (
        r'<p class="timeline-group__summary">"계산한다는 건 도대체 뭘까\?"라는 깊은 고민과 함께, 전기로 움직이는 신기한 회로 실험이 나란히 시작된 재미있는 시기였답니다\.</p>',
        '<p class="timeline-group__summary">"계산한다는 행위의 본질은 무엇일까?"라는 수학적 고민과 함께, 전기를 이용한 논리 회로 실험이 본격적으로 시작된 시기입니다.</p>'
    ),
    (
        r'<p class="timeline-group__summary">반짝이는 진공관 수천 개를 모아서 눈 깜짝할 사이에 정답을 척척 내놓는 마법 같은 전자식 컴퓨터가 드디어 세상에 짠! 하고 나타났어요\.</p>',
        '<p class="timeline-group__summary">수천 개의 진공관을 연결해 인간이 며칠 걸릴 계산을 단 몇 초 만에 해결하는 최초의 범용 전자식 컴퓨터가 세상에 등장했습니다.</p>'
    ),
    (
        r'<p class="timeline-group__summary">회사와 나라에서 컴퓨터를 일꾼으로 쓰기 시작했어요\. 뜨거운 진공관 대신 작고 튼튼한 트랜지스터가 등장해서 컴퓨터가 훨씬 작고 똑똑해졌답니다\.</p>',
        '<p class="timeline-group__summary">기업과 정부 기관이 컴퓨터를 업무에 도입하기 시작했습니다. 크고 뜨거운 진공관 대신 작고 효율적인 트랜지스터가 발명되면서 컴퓨터는 비약적으로 발전했습니다.</p>'
    ),
    (
        r'<p class="timeline-group__summary">"컴퓨터를 바꿔도 쓰던 프로그램은 그대로 쓰고 싶어요!"라는 사람들의 소원이 모여서, 어떤 기계든 척척 맞춰주는 똑똑한 운영체제가 태어났어요\.</p>',
        '<p class="timeline-group__summary">"하드웨어를 교체해도 기존 소프트웨어를 그대로 사용할 수 없을까?"라는 산업계의 요구에 부응하여, 호환성을 갖춘 시스템과 현대적인 운영체제가 탄생했습니다.</p>'
    ),
    (
        r'<p class="timeline-group__summary">컴퓨터의 뇌를 작은 칩 하나에 쏙 넣는 마법이 일어났어요! 덕분에 "우리 집에도 컴퓨터를 놓고 싶어!"라는 꿈이 진짜로 이루어졌답니다\.</p>',
        '<p class="timeline-group__summary">컴퓨터의 핵심 연산 장치를 작은 칩 하나에 집적한 마이크로프로세서가 발명되었습니다. 덕분에 개인용 컴퓨터(PC) 시대의 막이 올랐습니다.</p>'
    ),
    (
        r'<p class="timeline-group__summary">누구나 쉽게 쓸 수 있는 개인용 컴퓨터가 쏟아져 나왔어요\. 그리고 전 세계의 문서를 거미줄처럼 연결하는 신기한 마법도 우리 생활 속으로 쏙 들어왔죠\.</p>',
        '<p class="timeline-group__summary">표준화된 개인용 컴퓨터가 대중화되며 사무실과 가정에 보급되었습니다. 또한 전 세계의 정보를 연결하는 월드 와이드 웹(WWW)의 개념이 처음 제안되었습니다.</p>'
    ),
    (
        r'<p class="timeline-group__summary">인터넷이 쌩쌩 달리면서 누구나 공짜로 쓰는 프로그램이 생겨났어요\. 마우스로 예쁜 그림을 콕콕 누르기만 하면 되는 쉬운 컴퓨터 세상이 활짝 열렸답니다\.</p>',
        '<p class="timeline-group__summary">인터넷의 대중화와 함께 오픈소스 생태계가 성장했습니다. 마우스로 아이콘을 클릭하는 직관적인 그래픽 사용자 인터페이스(GUI)가 표준으로 자리 잡았습니다.</p>'
    ),
    (
        r'<p class="timeline-group__summary">필요할 때만 구름 너머의 컴퓨터를 빌려 쓰는 신기한 클라우드 세상이 열렸어요\. 게다가 주머니 속에 쏙 들어가는 똑똑한 전화기까지 등장했답니다\.</p>',
        '<p class="timeline-group__summary">필요한 만큼만 컴퓨팅 자원을 빌려 쓰는 클라우드 서비스가 등장했습니다. 또한, 손안의 컴퓨터인 스마트폰이 출시되며 모바일 시대가 본격화되었습니다.</p>'
    ),
    (
        r'<p class="timeline-group__summary">정보가 산더미처럼 쌓이면서, 컴퓨터가 스스로 공부하는 인공지능이 쑥쑥 자라났어요\. 프로그램을 상자에 담아 어디든 쉽게 옮기는 마법 같은 기술도 생겨났죠\.</p>',
        '<p class="timeline-group__summary">방대한 데이터와 향상된 연산 능력을 바탕으로 딥러닝 기술이 비약적으로 발전했습니다. 소프트웨어를 쉽게 배포하고 관리할 수 있는 컨테이너 기술도 도입되었습니다.</p>'
    ),
    (
        r'<p class="timeline-group__summary">모든 능력을 하나로 합친 슈퍼 칩이 노트북을 엄청나게 빠르게 만들었어요\. 게다가 사람처럼 글을 쓰고 그림을 그리는 인공지능 친구가 우리 곁에 찾아왔답니다\.</p>',
        '<p class="timeline-group__summary">고성능 통합 칩(SoC)의 등장으로 개인용 기기의 성능이 극대화되었습니다. 또한, 인간의 언어를 이해하고 창작하는 생성형 AI가 산업 전반에 혁신을 일으키고 있습니다.</p>'
    ),
    (
        r'<p class="event-detail__summary">밤마다 숫자와 씨름하던 찰스 배비지 할아버지가 "아휴, 기계가 대신 계산해 주면 좋겠네!"라며 멋진 그림을 그린 순간이에요\.</p>',
        '<p class="event-detail__summary">매일 밤 복잡한 수작업 계산과 씨름하던 수학자 찰스 배비지가 "기계가 오류 없이 계산을 대신해 주면 어떨까?"라는 아이디어를 구체화한 순간입니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1822\.png" alt="1822년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>수학자 찰스 배비지 할아버지는 "지루한 계산은 기계가 척척 해줬으면 좋겠어!"라는 고민을 했죠\. 그래서 빙글빙글 도는 톱니바퀴를 모아 복잡한 계산을 하는 기계를 상상했어요\. 비록 끝까지 만들지는 못했지만, "기계도 계산을 할 수 있다!"는 멋진 꿈을 우리에게 선물했답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1822.png" alt="1822년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>수학자 찰스 배비지는 항해나 천문학에 쓰이는 수치 표의 잦은 오류를 해결하고자 했습니다. 그는 톱니바퀴의 회전을 이용해 다항식의 차이를 계산하는 \'차분기관\'을 설계했습니다. 비록 당시의 기술적 한계로 완성하지는 못했지만, 기계가 논리적인 연산을 수행할 수 있다는 가능성을 최초로 제시했습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>배비지 할아버지가 생각한 \'차분기관\'은 어려운 수학 문제를 쉬운 덧셈으로 쪼개서 기계가 반복하게 만드는 마법 같은 설계였어요\. 금속 막대와 바퀴의 움직임으로 숫자를 읽어내는 아주 똑똑한 아이디어였죠\. 이 멋진 생각 덕분에 훗날 진짜 컴퓨터가 태어날 수 있었답니다\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>차분기관은 복잡한 곱셈과 나눗셈을 단순한 덧셈의 반복으로 변환하여 처리하는 혁신적인 구조였습니다. 금속 기어의 물리적인 맞물림을 통해 데이터를 저장하고 연산하는 이 개념은, 훗날 현대 컴퓨터 아키텍처의 중요한 밑거름이 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">똑똑한 아이다 러브레이스 아주머니가 "구멍 뚫린 카드만 바꾸면 기계가 다른 일도 할 수 있어!"라는 재미있는 상상을 노트에 적은 날이에요\.</p>',
        '<p class="event-detail__summary">수학자 아이다 러브레이스가 "기계에 입력하는 명령어만 바꾸면 단순한 계산을 넘어 다양한 작업을 수행할 수 있다"는 현대적 프로그래밍의 개념을 최초로 기록했습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1843\.png" alt="1843년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>아이다 러브레이스 아주머니는 "기계에 명령이 적힌 카드만 쏙쏙 바꿔 끼우면, 숫자 계산은 물론이고 아름다운 음악도 연주할 수 있을 거야!"라고 생각했어요\. 기계의 몸통과 기계에게 내리는 명령을 따로따로 생각한 세상에서 가장 첫 번째 아이디어였답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1843.png" alt="1843년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>아이다 러브레이스는 배비지의 후속 설계인 \'분석기관\'을 연구하며 놀라운 통찰을 남겼습니다. 그녀는 기계가 단순히 숫자를 계산하는 것을 넘어, 규칙과 기호를 다루는 범용적인 도구가 될 수 있다고 보았습니다. 하드웨어(기계)와 소프트웨어(명령어)를 분리해서 생각한 역사상 첫 번째 사례입니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>아이다 아주머니는 구멍이 뽕뽕 뚫린 카드로 기계에게 할 일을 알려주는 방법을 생각했어요\. 계산하는 곳과 기억하는 곳을 나누고, "이럴 땐 이렇게 해!"라는 조건을 달아주는 똑똑한 방법도 글로 남겼죠\. 기계가 숫자 말고도 여러 가지 기호를 다룰 수 있다는 걸 처음으로 알아낸 대단한 발견이었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>그녀는 천공 카드를 이용해 기계에 명령을 입력하는 방식을 제안했습니다. 연산 장치와 메모리를 구분하고, 조건문이나 반복문 같은 현대 프로그래밍의 핵심 논리를 노트에 기록했습니다. 이는 컴퓨터가 숫자뿐만 아니라 음악이나 문자 등 모든 형태의 정보를 처리할 수 있음을 예견한 놀라운 통찰이었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"우리가 종이에 연필로 계산하는 걸 기계가 똑같이 따라 하면 어떨까\?"라는 앨런 튜링 아저씨의 호기심에서 시작된 이야기예요\.</p>',
        '<p class="event-detail__summary">"인간이 수학 문제를 푸는 논리적 과정을 기계로 구현할 수 있을까?"라는 앨런 튜링의 근본적인 질문에서 현대 컴퓨터 과학이 태동했습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1936\.png" alt="1936년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>앨런 튜링 아저씨는 "사람이 종이 빈칸에 숫자를 적으며 계산하는 걸 기계가 흉내 낼 수 있을까\?"라는 고민을 했죠\. 그래서 끝없이 긴 종이테이프에 기호를 썼다 지웠다 하는 아주 단순한 기계를 머릿속으로 그렸어요\. 놀랍게도 이 상상이 오늘날 우리가 쓰는 모든 컴퓨터의 할아버지가 되었답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1936.png" alt="1936년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>앨런 튜링은 인간이 종이에 기호를 적고 지우며 계산하는 과정을 추상화하여, 무한히 긴 테이프와 읽기/쓰기 장치로 구성된 가상의 기계를 고안했습니다. \'튜링 머신\'이라 불리는 이 개념적 모델은, 어떤 복잡한 논리적 문제라도 일련의 단순한 단계로 쪼개어 기계적으로 해결할 수 있음을 증명했습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>튜링 아저씨가 상상한 기계는 할 일 목록, 지금 상태, 그리고 기호가 적힌 긴 테이프로 이루어져 있어요\. 기계의 눈과 손이 테이프를 한 칸씩 움직이며 기호를 읽고 쓰는 방식이죠\. 이 덕분에 아무리 복잡한 계산도 아주 작은 조각으로 나누어 생각할 수 있게 되었고, 컴퓨터가 할 수 있는 일과 없는 일을 분명하게 알게 되었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>튜링 머신은 상태(State), 규칙(Rule), 그리고 데이터를 기록하는 테이프(Tape)로 이루어집니다. 이 단순한 모델은 알고리즘과 계산 가능성의 수학적 토대를 마련했으며, 오늘날 모든 컴퓨터가 작동하는 기본 원리인 \'범용 튜링 머신\'의 개념을 확립했습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"우리 학생들이 어려운 수학 문제 풀다가 쓰러지겠어!"라는 선생님의 따뜻한 걱정이 전기로 움직이는 계산기를 만들게 했어요\.</p>',
        '<p class="event-detail__summary">복잡한 연립방정식을 푸느라 고생하는 학생들을 돕기 위해, 존 아타나소프 교수가 진공관과 전기를 이용한 최초의 전자식 계산기를 고안했습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1937\.png" alt="1937년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>아타나소프 선생님은 "학생들이 계산만 하다가 지치면 안 되는데\.\.\."라는 고민을 했죠\. 그래서 무거운 톱니바퀴 대신 찌릿찌릿 전기를 이용해 0과 1을 기억하는 신기한 계산기를 뚝딱뚝딱 만들었어요\. 이 발명품이 훗날 엄청나게 큰 전자 컴퓨터들의 멋진 조상님이 되었답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1937.png" alt="1937년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>아이오와 주립대학의 아타나소프 교수는 학생들이 복잡한 방정식을 푸는 데 너무 많은 시간을 쏟는 것을 안타까워했습니다. 그는 기존의 기계식 톱니바퀴 대신, 전기의 흐름을 이용해 0과 1의 이진법으로 연산하는 전자식 계산기(ABC)를 설계했습니다. 이는 현대 전자 컴퓨터의 핵심 원리를 최초로 구현한 사례입니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>이 기계는 0과 1만 쓰는 이진수, 전기로 껐다 켜는 스위치, 그리고 스스로 계산하는 능력을 하나로 합친 아주 놀라운 발명품이었어요\. 전기를 담아두는 통에 숫자를 기억하고, 결과는 구멍 뚫린 카드에 쏙쏙 남겼죠\. 이 멋진 실험 덕분에 더 크고 빠른 컴퓨터들이 태어날 수 있었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>아타나소프-베리 컴퓨터(ABC)는 이진수 체계, 진공관을 이용한 전자식 스위치, 그리고 연산과 메모리의 분리라는 현대 컴퓨터의 세 가지 필수 요소를 모두 갖추고 있었습니다. 비록 범용 컴퓨터는 아니었지만, 전자식 컴퓨팅의 가능성을 실증한 중요한 이정표가 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"대포알이 어디로 날아갈지 빨리 계산해 줄 수 없나요\?"라는 부탁에 1만 8천 개의 반짝이는 진공관이 짠! 하고 대답한 순간이에요\.</p>',
        '<p class="event-detail__summary">포탄의 탄도 계산을 자동화하기 위해 개발된 ENIAC은 1만 8천 개의 진공관을 탑재하여 압도적인 연산 속도를 증명한 최초의 범용 전자 컴퓨터입니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1946\.png" alt="1946년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>에니악은 집채만큼 커다란 몸집에 전구처럼 생긴 진공관을 1만 8천 개나 품고 있는 거인 계산기였어요\. 비록 사람들이 복잡한 전선을 일일이 손으로 꽂아야 했지만, 사람이 며칠 밤을 새워야 할 계산을 눈 깜짝할 새인 몇 초 만에 뚝딱 해치웠답니다\. 전기로 움직이는 컴퓨터가 얼마나 대단한지 세상에 널리 알린 멋진 친구였죠\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1946.png" alt="1946년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>제2차 세계대전 당시, 미군은 포탄의 궤적을 계산하는 데 엄청난 인력과 시간을 소모하고 있었습니다. 이를 해결하기 위해 개발된 ENIAC은 방 하나를 가득 채울 만큼 거대했고 1만 8천 개의 진공관을 사용했습니다. 비록 프로그램을 바꾸려면 수많은 전선을 직접 다시 꽂아야 했지만, 인간이 며칠 걸릴 계산을 단 몇 초 만에 끝내는 혁신적인 속도를 보여주었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>에니악은 여러 개의 계산 회로를 한꺼번에 윙윙 돌려서 1초에 수천 번이나 계산을 할 수 있었어요\. 스위치를 켜고 끄고 굵은 선을 직접 연결해서 할 일을 알려줘야 했지만, 이전 기계들과는 비교도 안 될 만큼 엄청나게 빨랐어요\. 이 거인 덕분에 다음 세대의 더 똑똑한 컴퓨터 아이디어들이 쑥쑥 자라날 수 있었답니다\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>ENIAC은 1초에 5,000번의 덧셈을 수행할 수 있었으며, 이는 기존 기계식 계산기보다 1,000배 이상 빠른 속도였습니다. 물리적인 배선 연결(Patch코드)로 프로그래밍을 해야 하는 한계가 있었지만, 전자식 연산의 압도적인 효율성을 입증하며 본격적인 컴퓨터 시대의 개막을 알렸습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"아휴, 매번 전선 갈아 끼우기 너무 힘들어!"라는 투덜거림이 "명령을 컴퓨터 머릿속에 쏙 넣어두자!"라는 멋진 생각으로 바뀐 순간이에요\.</p>',
        '<p class="event-detail__summary">"프로그램을 바꿀 때마다 전선을 다시 연결해야 하는 번거로움을 어떻게 해결할까?"라는 고민에서 \'프로그램 내장 방식\'이 탄생했습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1949\.png" alt="1949년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>에드삭은 "매번 복잡하게 전선을 꽂았다 뺐다 하지 말고, 할 일 목록을 숫자처럼 컴퓨터 머릿속에 기억시켜 두자!"라는 고민을 했죠\. 이 멋진 생각 덕분에, 겉모습은 그대로 두고 속마음\(소프트웨어\)만 쏙쏙 바꾸면 여러 가지 일을 척척 해내는 진짜 현대적인 컴퓨터가 태어났답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1949.png" alt="1949년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>ENIAC의 가장 큰 단점은 새로운 작업을 지시할 때마다 수많은 케이블을 물리적으로 다시 연결해야 한다는 것이었습니다. 폰 노이만과 연구자들은 명령어(프로그램)를 데이터처럼 컴퓨터의 메모리 내부에 저장하는 방식을 고안했습니다. EDSAC은 이 \'프로그램 내장 방식\'을 최초로 실용화하여, 하드웨어 변경 없이 소프트웨어만 교체해 다양한 작업을 수행하는 현대적 컴퓨터의 원형이 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>에드삭은 할 일 목록과 숫자를 같은 기억 창고에 보관하는 마법을 처음으로 보여준 컴퓨터예요\. 찰랑거리는 수은을 이용한 기억 장치에 천 개 정도의 단어를 담아두고, 자주 쓰는 명령은 미리 준비해 두었다가 필요할 때 쏙쏙 꺼내 썼죠\. 덕분에 사람들은 땀 뻘뻘 흘리며 전선을 만지지 않고도 새로운 프로그램을 마음껏 만들어 볼 수 있었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>EDSAC은 수은 지연선 메모리를 사용하여 명령어와 데이터를 동일한 저장 공간에 보관했습니다. 이를 통해 물리적인 배선 작업 없이도 메모리에 적재된 소프트웨어를 수정하는 것만으로 컴퓨터의 동작을 제어할 수 있게 되었습니다. 이는 프로그래밍이라는 새로운 분야가 탄생하는 결정적인 계기가 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"우와! 기계가 사람보다 먼저 선거 결과를 맞혔다고요\?" 깜짝 놀란 사람들의 환호성과 함께 컴퓨터가 우리 곁으로 다가온 날이에요\.</p>',
        '<p class="event-detail__summary">컴퓨터가 미국 대통령 선거 결과를 정확히 예측하며 대중의 이목을 사로잡았고, 본격적인 상업용 컴퓨터 시대가 열렸습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1951\.png" alt="1951년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>유니박은 텔레비전에 나와서 선거 결과를 사람보다 훨씬 빨리 척척 맞혀서 온 세상을 깜짝 놀라게 했어요\. 그걸 본 회사 사장님들은 "우리 회사 물건 세는 일도 저 똑똑한 기계한테 맡기고 싶어!"라며 줄을 섰죠\. 드디어 컴퓨터가 어두운 연구실을 나와서 사람들을 돕는 멋진 일꾼이 된 거랍니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1951.png" alt="1951년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>1952년 미국 대선 방송에서 UNIVAC I은 초기 개표 결과만으로 아이젠하워의 압승을 정확히 예측해 세상을 놀라게 했습니다. 군사나 과학 연구용으로만 쓰이던 컴퓨터가 대중에게 그 위력을 각인시킨 순간이었습니다. 이후 기업들은 급여 계산이나 재고 관리 등 복잡한 비즈니스 업무를 처리하기 위해 앞다투어 컴퓨터를 도입하기 시작했습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>유니박 I은 길쭉한 자기테이프에 정보를 담고, 1초에 무려 1900번이나 덧셈을 할 수 있었어요\. 컴퓨터 기계뿐만 아니라 회사에 딱 맞는 프로그램도 만들어주고 고장 나면 고쳐주는 서비스까지 함께 팔았죠\. 이때부터 컴퓨터는 돈을 주고 사고파는 아주 중요한 \'상품\'이 되었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>UNIVAC I은 천공 카드 대신 자기 테이프를 사용하여 데이터 입출력 속도를 획기적으로 높였습니다. 또한, 하드웨어 판매뿐만 아니라 유지보수와 소프트웨어 지원을 포함한 비즈니스 모델을 확립하여, 컴퓨터가 연구실의 실험 장비를 넘어 상업적인 산업으로 자리 잡는 데 기여했습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"휴, 이제 펑! 하고 터질 걱정은 없겠지\?" 뜨거운 진공관 대신 작고 시원한 트랜지스터 친구가 찾아와 연구실이 평화로워졌어요\.</p>',
        '<p class="event-detail__summary">크고 발열이 심하며 수명이 짧았던 진공관을 대체할 작고 안정적인 \'트랜지스터\'가 도입되면서 컴퓨터 하드웨어의 혁신이 일어났습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1956\.png" alt="1956년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>옛날 컴퓨터 속에 있던 진공관은 너무 뜨거워서 툭하면 고장이 났어요\. "어떻게 하면 컴퓨터가 아프지 않을까\?"라는 고민을 했죠\. 그래서 작고 단단한 \'트랜지스터\'라는 새 친구로 바꿔주었더니, 컴퓨터가 훨씬 작아지고 튼튼해졌어요\. 이제 윙윙 돌아가는 시끄러운 에어컨 없이도 컴퓨터가 쌩쌩 잘 돌아가게 되었답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1956.png" alt="1956년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>초기 컴퓨터에 사용된 진공관은 전력 소모가 많고 열이 심하게 발생해 자주 고장 났습니다. 이를 해결하기 위해 반도체 소자인 \'트랜지스터\'를 컴퓨터에 적용하기 시작했습니다. 트랜지스터는 진공관보다 훨씬 작고 전력 소모가 적으며 내구성이 뛰어났습니다. 덕분에 거대한 냉각 시설 없이도 안정적으로 작동하는 작고 강력한 컴퓨터를 만들 수 있게 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>트랜지스터를 쓴 컴퓨터는 전기도 아주 조금 먹고 고장도 잘 나지 않았어요\. 덕분에 밤낮없이 켜 두어도 끄떡없었죠\. IBM 7000 시리즈 같은 회사용 컴퓨터들이 이 멋진 기술을 쓰기 시작하면서, 컴퓨터를 유지하는 데 드는 돈을 엄청나게 아낄 수 있었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>트랜지스터의 도입은 컴퓨터의 소형화와 신뢰성 향상을 이끌었습니다. IBM 7000 시리즈 등 트랜지스터 기반의 2세대 컴퓨터들은 기업의 데이터 처리 비용을 크게 절감시켰고, 이후 집적회로(IC) 시대로 나아가는 중요한 기술적 징검다리가 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"새 컴퓨터를 사도 예전 프로그램이랑 친하게 지내게 해 주세요!"라는 사람들의 소원이 마법 같은 System/360을 태어나게 했어요\.</p>',
        '<p class="event-detail__summary">"하드웨어를 업그레이드할 때마다 소프트웨어를 새로 짜야 하는 비용을 줄일 수 없을까?"라는 기업들의 고민이 호환성 아키텍처를 탄생시켰습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1964\.png" alt="1964년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>옛날에는 컴퓨터를 새것으로 바꾸면, 힘들게 만든 프로그램도 처음부터 다시 만들어야 했어요\. 그래서 IBM 아저씨들은 "어떤 기계든 똑같은 언어로 대화하게 만들자!"라는 멋진 규칙을 정했죠\. 덕분에 한 번 만든 프로그램을 이 컴퓨터, 저 컴퓨터에서 모두 쓸 수 있게 되면서 컴퓨터 세상이 쑥쑥 커졌답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1964.png" alt="1964년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>과거에는 컴퓨터 모델이 다르면 명령어 구조도 달라서, 기계를 바꿀 때마다 소프트웨어를 처음부터 다시 개발해야 했습니다. IBM은 이 문제를 해결하기 위해 소형 모델부터 대형 모델까지 동일한 명령어 세트를 공유하는 System/360 제품군을 발표했습니다. 하드웨어와 소프트웨어를 분리하고 \'호환성\'이라는 개념을 정립한 역사적인 순간이었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>System/360은 정보를 8비트씩 묶어서 다루고, 모든 컴퓨터가 똑같은 명령어를 알아듣게 만들었어요\. 한 번 정성껏 만든 소프트웨어를 작고 싼 컴퓨터부터 크고 비싼 컴퓨터까지 어디서든 다시 쓸 수 있었죠\. 이 똑똑한 방법은 커다란 회사용 컴퓨터들의 훌륭한 모범이 되었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>System/360은 8비트를 1바이트로 묶어 처리하는 현대적인 데이터 단위를 확립했습니다. 한 번 개발한 소프트웨어를 성능이 다른 여러 기종에서 그대로 실행할 수 있게 됨으로써, 소프트웨어 산업이 하드웨어에 종속되지 않고 독립적으로 성장할 수 있는 기반을 마련했습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"모든 걸 똑같은 상자에 담아서 정리하면 어떨까\?"라는 반짝이는 아이디어가 유닉스\(UNIX\)라는 멋진 문화를 만들어냈어요\.</p>',
        '<p class="event-detail__summary">"복잡한 시스템 대신, 작고 명확한 도구들을 조합해 유연하게 사용할 수 없을까?"라는 철학이 UNIX 운영체제를 탄생시켰습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1969\.png" alt="1969년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>컴퓨터 박사님들은 "너무 복잡한 건 싫어! 레고 블록처럼 작고 귀여운 도구들을 찰칵찰칵 연결해서 쓰자!"라는 고민을 했죠\. 컴퓨터 안의 모든 것을 똑같은 모양의 파일처럼 다루기로 한 이 단순하고 멋진 생각은, 오늘날 우리가 쓰는 스마트폰과 컴퓨터의 튼튼한 뿌리가 되었답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1969.png" alt="1969년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>벨 연구소의 개발자들은 거대하고 복잡한 운영체제 대신, 단순하고 우아한 시스템을 원했습니다. 그들은 "모든 것을 파일로 취급한다"는 원칙 아래, 한 가지 일만 잘하는 작은 유틸리티들을 파이프라인으로 연결해 복잡한 작업을 수행하는 UNIX를 개발했습니다. 이 철학은 현대 운영체제 설계의 근간이 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>유닉스는 "모든 것을 파일처럼 생각하자"는 규칙과, 작은 프로그램들을 파이프라는 통로로 연결해서 쓰는 재미있는 방법을 만들었어요\. 귀찮은 일을 알아서 척척 해주는 자동화 마법도 부렸죠\. 이 멋진 아이디어들이 모여서 리눅스나 맥OS 같은 훌륭한 운영체제들이 태어날 수 있었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>UNIX는 하드웨어 장치부터 프로세스 간 통신까지 모든 것을 파일 시스템 인터페이스로 통합했습니다. 또한 C 언어로 재작성되어 다양한 하드웨어로 쉽게 이식될 수 있었습니다. 이러한 유연성과 모듈화 철학은 훗날 Linux와 macOS 등 수많은 현대 운영체제의 뼈대가 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"우와! 이 조그만 손톱만 한 조각에 똑똑한 두뇌가 다 들어있다고요\?" 사람들의 놀란 입이 떡 벌어진 신기한 날이에요\.</p>',
        '<p class="event-detail__summary">거대한 컴퓨터의 중앙처리장치(CPU)를 손톱만 한 실리콘 칩 하나에 집적한 최초의 상업용 마이크로프로세서가 등장했습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1971\.png" alt="1971년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>커다란 계산기의 뇌를 아주아주 작은 칩 하나에 쏙 넣을 수 있을까요\? 인텔이라는 회사의 마법사들이 "우리가 해볼게!"라며 진짜로 만들어냈어요\. 덕분에 윙윙 냉장고, 빵빵 자동차, 삑삑 장난감 어디에나 똑똑한 지능을 불어넣을 수 있는 마법의 시대가 활짝 열렸답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1971.png" alt="1971년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>인텔의 엔지니어들은 일본의 계산기 회사로부터 여러 개의 맞춤형 칩을 만들어 달라는 의뢰를 받았습니다. 하지만 그들은 여러 칩을 만드는 대신, 소프트웨어만 바꾸면 다양한 용도로 쓸 수 있는 범용 연산 칩 하나를 설계했습니다. 이것이 바로 컴퓨터의 두뇌를 하나의 칩에 담아낸 최초의 마이크로프로세서, 인텔 4004입니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>인텔 4004라는 이 작은 칩 안에는 무려 2300개의 트랜지스터 요정들이 살고 있었어요\. 다른 기억 장치와 손을 잡고 여러 기계의 똑똑한 두뇌 역할을 척척 해냈죠\. 복잡한 뇌를 작은 칩 하나로 뚝딱 해결하면서, 기계를 만드는 돈과 시간을 엄청나게 아낄 수 있었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>인텔 4004는 2,300개의 트랜지스터를 집적한 4비트 프로세서로, 당시 방 하나 크기의 초기 컴퓨터와 맞먹는 연산 능력을 갖추고 있었습니다. 이 작은 칩의 발명으로 인해 가전제품, 자동차, 산업용 기기 등 모든 사물에 컴퓨팅 능력을 부여하는 임베디드 시스템과 개인용 컴퓨터 시대가 열리게 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"플러그만 꽂으면 우리 집에서도 뿅뿅 게임을 할 수 있대요!"라는 신나는 소문이 온 동네에 퍼져나갔어요\.</p>',
        '<p class="event-detail__summary">복잡한 조립 과정 없이 전원만 켜면 바로 사용할 수 있는 완성형 개인용 컴퓨터가 등장하여 대중화의 길을 열었습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1977\.png" alt="1977년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>스티브 워즈니악 아저씨는 "어려운 조립 없이, 텔레비전처럼 전원만 켜면 바로 쓸 수 있는 컴퓨터를 만들자!"라는 고민을 했죠\. 덕분에 뚝딱뚝딱 조립할 필요 없이 따뜻한 거실에 앉아 숙제도 하고 재미있는 게임도 할 수 있게 되었어요\. 컴퓨터가 친근한 가전제품 친구가 된 거랍니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1977.png" alt="1977년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>초기 개인용 컴퓨터는 부품을 사서 직접 납땜하고 조립해야 하는 전문가들의 전유물이었습니다. 스티브 워즈니악과 스티브 잡스는 키보드와 모니터 연결 단자가 일체화된 플라스틱 케이스의 Apple II를 선보였습니다. 가전제품처럼 전원만 켜면 바로 작동하는 이 기기 덕분에 컴퓨터는 연구실을 벗어나 일반 가정과 학교로 빠르게 보급되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>애플 II는 텔레비전 화면을 연결하고, 정보를 저장하는 곳도 있고, 컴퓨터와 대화하는 언어\(BASIC\)도 미리 들어있어서 "사서 바로 쓰는" 아주 편리한 친구였어요\. 덕분에 학교와 회사로 빠르게 퍼져나갔고, 이 친구를 위한 재미있는 프로그램들도 쑥쑥 함께 자라났어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>Apple II는 컬러 그래픽을 지원하고 BASIC 프로그래밍 언어를 내장하여 누구나 쉽게 소프트웨어를 개발할 수 있었습니다. 특히 \'비지칼크(VisiCalc)\'라는 스프레드시트 프로그램이 큰 성공을 거두면서, 개인용 컴퓨터가 단순한 취미용 기기를 넘어 강력한 업무용 도구로 인정받는 계기가 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"어려운 말 대신 쉬운 말만 쓰면 훨씬 빠르지 않을까\?" 칠판 앞의 재미있는 토론이 쌩쌩 달리는 새로운 칩을 만들었어요\.</p>',
        '<p class="event-detail__summary">"복잡한 명령어 대신 자주 쓰는 단순한 명령어만 남기면 처리 속도를 높일 수 있지 않을까?"라는 발상의 전환이 RISC 아키텍처를 탄생시켰습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1980\.png" alt="1980년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>컴퓨터에게 너무 복잡한 명령을 내리면 끙끙대느라 오히려 느려진답니다\. 그래서 "자주 쓰는 아주 쉬운 명령만 남겨두자!"라는 고민을 했죠\. 이렇게 칩을 다시 예쁘게 꾸몄더니, 컴퓨터가 깃털처럼 가벼워져서 훨씬 빨리 달리게 되었어요\. 지금 우리가 쓰는 스마트폰의 훌륭한 조상님이랍니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1980.png" alt="1980년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>당시 컴퓨터 칩들은 프로그래머의 편의를 위해 점점 더 복잡한 명령어(CISC)를 추가하고 있었습니다. 하지만 IBM의 연구진은 실제 프로그램들이 복잡한 명령어보다는 단순한 명령어를 훨씬 더 자주 사용한다는 사실을 발견했습니다. 이에 따라 명령어의 종류를 줄이고 실행 속도를 극대화하는 RISC(축소 명령어 세트 컴퓨터) 구조를 제안했습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>801이라는 칩은 명령어의 길이를 똑같이 맞추고, 물건을 가져오고 저장하는 일을 따로따로 나누는 똑똑한 규칙\(RISC\)을 처음 보여주었어요\. 복잡한 길이 단순해지니 달리는 속도를 훨씬 높일 수 있었죠\. 짧고 쉬운 명령들을 레고처럼 조립해서 어려운 일도 척척 해낼 수 있다는 걸 증명한 멋진 실험이었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>IBM 801 프로젝트는 명령어의 길이를 고정하고, 메모리 접근과 연산을 분리하여 파이프라인 처리를 최적화했습니다. 이 단순하고 효율적인 설계 철학은 훗날 스마트폰과 태블릿을 지배하는 ARM 프로세서 아키텍처의 핵심 기반이 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"우리끼리만 알지 말고, 만드는 방법을 모두에게 알려주자!"라는 착한 마음이 전 세계에 컴퓨터 친구들을 가득 채웠어요\.</p>',
        '<p class="event-detail__summary">IBM이 개인용 컴퓨터의 하드웨어 규격을 공개하면서, 누구나 호환 기종을 만들 수 있는 개방형 생태계가 형성되었습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1981\.png" alt="1981년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>IBM 아저씨들은 꽁꽁 숨겨두었던 컴퓨터 설계도를 활짝 펼쳐 보여주었어요\. "누구나 동네 가게에서 부품을 사서 뚝딱뚝딱 조립할 수 있어요!"라고 말했죠\. 이 멋진 나눔 덕분에 똑같이 생긴 쌍둥이 컴퓨터들이 쏟아져 나왔고, 전 세계 어느 사무실에 가도 컴퓨터를 볼 수 있게 되었답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1981.png" alt="1981년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>대형 컴퓨터 시장의 강자였던 IBM은 개인용 컴퓨터 시장에 뒤늦게 진입하면서 이례적인 결정을 내렸습니다. 독자적인 부품 대신 시중에서 쉽게 구할 수 있는 범용 부품을 사용하고, 하드웨어 설계도와 기본 입출력 시스템(BIOS)의 인터페이스를 외부에 공개한 것입니다. 이 개방형 정책은 \'IBM 호환 PC\'라는 거대한 시장을 창출했습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>IBM PC는 인텔의 두뇌와 마이크로소프트의 운영체제를 썼어요\. 게다가 새로운 부품을 꽂을 수 있는 빈자리와 컴퓨터를 깨우는 비밀 주문\(BIOS\)까지 모두에게 알려주었죠\. 덕분에 다른 회사들도 쉽게 똑같은 컴퓨터를 만들 수 있었고, 이게 바로 오늘날 우리가 쓰는 컴퓨터 세상의 튼튼한 밑바탕이 되었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>IBM PC는 인텔의 프로세서와 마이크로소프트의 MS-DOS 운영체제를 채택했습니다. 개방된 규격 덕분에 수많은 제조사들이 호환 부품과 소프트웨어를 개발할 수 있었고, 이는 하드웨어 가격 하락과 PC의 폭발적인 대중화를 이끄는 원동력이 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"손가락으로 톡! 누르기만 하면 다른 책으로 슝~ 날아갈 수 있다면\?" 팀 버너스-리 아저씨의 재미있는 상상이 거대한 거미줄을 만들었어요\.</p>',
        '<p class="event-detail__summary">"전 세계의 연구 자료를 하이퍼링크로 쉽게 연결하고 탐색할 수 있다면 어떨까?"라는 아이디어가 월드 와이드 웹(WWW)을 탄생시켰습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1989\.png" alt="1989년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>팀 버너스-리 아저씨는 "세상의 모든 문서가 거미줄처럼 끈끈하게 연결되면 얼마나 좋을까\?"라는 고민을 했죠\. 마우스로 파란 글씨를 톡! 누르기만 하면 지구 반대편에 있는 친구의 일기장도 볼 수 있는 신기한 \'웹\(Web\)\'이 태어났고, 이때부터 신나는 인터넷 세상이 활짝 열렸답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1989.png" alt="1989년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>유럽 입자 물리 연구소(CERN)의 팀 버너스-리는 수많은 연구자들이 흩어진 자료를 쉽게 공유할 수 있는 방법을 고민했습니다. 그는 문서 안의 특정 단어를 클릭하면 다른 문서로 바로 이동할 수 있는 \'하이퍼텍스트\' 개념을 인터넷에 적용했습니다. 이것이 바로 오늘날 우리가 매일 사용하는 월드 와이드 웹(WWW)의 시작입니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>웹은 아주 쉬운 규칙과 문서 모양을 만들어서, 서로 다르게 생긴 컴퓨터들을 하나로 묶어주었어요\. 곧이어 인터넷 바다를 항해하는 브라우저 배와 정보를 나눠주는 서버 항구들이 생겨났고, 누구나 쉽게 정보를 주고받는 멋진 통로가 완성되었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>그는 웹의 3대 요소인 HTML(문서 형식), URI(주소 체계), HTTP(통신 규약)를 설계하고 최초의 웹 브라우저와 서버를 개발했습니다. 특히 이 모든 기술을 특허 없이 무료로 공개함으로써, 인터넷이 전 세계적인 정보 공유의 장으로 폭발적으로 성장할 수 있는 기반을 마련했습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"제가 재미로 만든 프로그램인데, 공짜니까 다 같이 가지고 놀아볼래요\?"라는 편지 한 통이 온 세상을 들썩이게 했어요\.</p>',
        '<p class="event-detail__summary">"취미로 만든 운영체제 커널을 공개하니, 관심 있는 분들은 함께 개선해 봅시다"라는 한 대학생의 메시지가 오픈소스 혁명을 일으켰습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1991\.png" alt="1991년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>리누스 토르발스라는 대학생 형이 "심심해서 만들어본 컴퓨터 프로그램인데, 다 같이 써보자!"라며 선물을 주었어요\. 전 세계의 똑똑한 친구들이 모여들어 "여긴 내가 고칠게!", "여긴 내가 예쁘게 꾸밀게!"라며 힘을 합쳤죠\. 이 멋진 협동 작전은 지금 엄청나게 큰 슈퍼컴퓨터부터 우리 손의 스마트폰까지 움직이는 마법의 힘이 되었답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1991.png" alt="1991년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>핀란드의 대학생 리누스 토르발스는 개인용 PC에서 작동하는 운영체제 커널을 개발하고, 그 소스 코드를 인터넷에 무료로 공개했습니다. 전 세계의 수많은 개발자들이 자발적으로 코드 수정과 기능 추가에 참여하면서, 리눅스는 역사상 가장 성공적인 집단 지성의 결과물이 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>리눅스는 누구나 마음대로 고치고 친구들에게 나눠줄 수 있는 착한 약속\(GPL\)을 했어요\. 덕분에 필요한 프로그램을 쏙쏙 골라 담는 바구니도 생기고, 사람들의 입맛에 딱 맞는 여러 가지 모양의 리눅스들이 쑥쑥 자라나게 되었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>리눅스는 누구나 자유롭게 사용하고 수정할 수 있는 GPL 라이선스를 채택했습니다. 이 개방적인 생태계 덕분에 리눅스는 서버, 슈퍼컴퓨터, 안드로이드 스마트폰, 가전제품 등 현대 IT 인프라를 지탱하는 가장 핵심적인 운영체제로 자리 잡았습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"우와! 예쁜 그림 버튼만 콕 누르면 마법처럼 창이 열려요!" 사람들의 환호성 속에 윈도우 95가 화려하게 등장했어요\.</p>',
        '<p class="event-detail__summary">복잡한 명령어 대신 직관적인 그래픽 인터페이스와 시작 버튼을 도입한 Windows 95가 출시되며 PC의 대중화를 이끌었습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_1995\.png" alt="1995년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>컴퓨터를 켜면 무서운 까만 화면 대신, 친절한 "시작" 버튼이 방긋 웃으며 반겨주었어요\. "어떻게 하면 컴퓨터를 더 쉽게 쓸 수 있을까\?"라는 고민 끝에, 마우스로 예쁜 그림\(아이콘\)을 콕콕 누르기만 하면 되는 마법의 화면이 탄생했죠\. 덕분에 할아버지, 할머니, 어린아이까지 누구나 신나게 인터넷 탐험을 떠날 수 있게 되었답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_1995.png" alt="1995년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>이전까지 컴퓨터를 다루려면 검은 화면에 복잡한 텍스트 명령어를 직접 입력해야 했습니다. 마이크로소프트는 화면 하단에 \'시작\' 버튼과 작업 표시줄을 배치하고, 마우스로 아이콘을 클릭해 프로그램을 실행하는 직관적인 그래픽 사용자 인터페이스(GUI)를 Windows 95에 도입했습니다. 이는 컴퓨터 초보자도 쉽게 기기를 다룰 수 있게 한 혁명적인 변화였습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>윈도우 95는 선만 꽂으면 바로 알아채는 똑똑한 기능과, 인터넷에 쉽게 연결하는 마법을 한 상자에 담아 선물했어요\. 인터넷을 보는 브라우저와 글을 쓰는 프로그램들이 널리 퍼지면서, 누구나 쉽게 소프트웨어를 사서 쓰는 즐거운 세상이 활짝 열렸어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>Windows 95는 하드웨어를 연결하면 자동으로 인식하는 플러그 앤 플레이(Plug and Play) 기능과 내장된 인터넷 브라우저를 제공했습니다. 멀티미디어와 인터넷 접속이 기본 기능으로 통합되면서, PC는 단순한 업무용 기기를 넘어 가정의 필수적인 엔터테인먼트 및 통신 도구로 자리매김했습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"쓰던 장난감은 그대로 두고, 놀이터만 엄청나게 넓혀줄게!"라는 AMD 아저씨들의 멋진 약속이 진짜로 이루어진 날이에요\.</p>',
        '<p class="event-detail__summary">"기존 32비트 소프트웨어와의 호환성을 유지하면서 메모리 한계를 극복할 수 없을까?"라는 고민이 x86-64 아키텍처를 탄생시켰습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_2003\.png" alt="2003년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>AMD 아저씨들은 "옛날 프로그램도 잘 돌아가면서, 기억력은 훨씬 좋아지는 마법의 칩을 만들자!"라는 고민을 했죠\. 다른 사람들이 아예 처음부터 다시 만들자고 고집을 부릴 때, "익숙한 것에 힘을 더해주자!"라는 지혜로운 선택을 했어요\.</p>\s*<p>컴퓨터를 관리하는 사람들은 만세를 불렀어요\. "우와! 프로그램을 다시 만들 필요 없이, 기억 장치만 꽂으면 컴퓨터가 헐크처럼 힘이 세지네!" 이 방법이 너무너무 좋아서, 결국 다른 회사들도 이 멋진 아이디어를 따라 하게 되었답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_2003.png" alt="2003년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>당시 컴퓨터는 32비트 구조의 한계로 인해 4GB 이상의 메모리를 사용할 수 없었습니다. 경쟁사가 기존 소프트웨어와 호환되지 않는 완전히 새로운 64비트 구조를 제안했을 때, AMD는 기존 32비트 프로그램들을 그대로 실행하면서도 64비트의 넓은 메모리 공간을 활용할 수 있는 x86-64 아키텍처를 발표했습니다.</p>\n\t\t\t\t\t<p>기업과 개발자들은 기존에 투자한 소프트웨어 자산을 버리지 않고도 시스템 성능을 업그레이드할 수 있다는 점에 열광했습니다. 이 실용적인 접근 방식은 시장에서 큰 성공을 거두었고, 결국 업계 표준으로 자리 잡아 오늘날 대부분의 PC와 서버가 이 구조를 따르게 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>x86-64는 컴퓨터가 한 번에 꿀꺽 삼킬 수 있는 정보의 양을 두 배로 쑥 늘려준 마법이에요\. 덕분에 컴퓨터가 엄청나게 넓은 기억의 방을 자유롭게 쓸 수 있게 되어서, 오늘날 우리가 즐기는 화려한 게임이나 엄청나게 많은 정보를 다루는 일이 가능해졌어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>x86-64 아키텍처는 프로세서가 한 번에 처리할 수 있는 데이터의 크기를 확장하여, 대용량 메모리 접근과 고성능 연산을 가능하게 했습니다. 이는 고해상도 3D 게임, 대규모 데이터베이스 처리, 복잡한 과학 연산 등 현대 컴퓨팅 환경이 요구하는 막대한 자원을 뒷받침하는 핵심 기술이 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"컴퓨터 한 대 사려면 너무 오래 걸려요!"라는 투덜거림에, "이제 마법 주문 한 번이면 구름 위에서 컴퓨터가 뚝딱 나타나요!"라고 대답한 날이에요\.</p>',
        '<p class="event-detail__summary">"서버를 직접 구매하고 설치하는 번거로움 없이, 필요한 만큼만 컴퓨팅 자원을 빌려 쓸 수 없을까?"라는 발상이 클라우드 컴퓨팅 시대를 열었습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_2006\.png" alt="2006년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>옛날에는 인터넷 가게를 열려면 비싸고 무거운 컴퓨터를 직접 사서 낑낑대며 돌봐야 했어요\. 하지만 아마존 아저씨들은 "수돗물 틀어 쓰듯이, 컴퓨터도 필요할 때만 빌려 쓰고 돈을 내면 어떨까\?"라는 기발한 고민을 했죠\.</p>\s*<p>프로그램을 만드는 사람들은 신이 나서 춤을 추었어요\. "야호! 이제 마우스 클릭 몇 번이면 엄청나게 센 슈퍼컴퓨터를 빌릴 수 있어!" 덕분에 돈이 없는 젊은이들도 반짝이는 아이디어만 있으면, 전 세계 사람들이 쓰는 멋진 서비스를 뚝딱 만들 수 있게 되었답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_2006.png" alt="2006년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>과거에는 인터넷 서비스를 시작하려면 값비싼 서버 장비를 직접 구매하고 네트워크 환경을 구축해야 했습니다. 아마존(AWS)은 자사의 남는 서버 자원을 활용해, 전기나 수도처럼 컴퓨팅 자원을 필요한 만큼만 인터넷을 통해 대여해 주는 EC2(Elastic Compute Cloud) 서비스를 선보였습니다.</p>\n\t\t\t\t\t<p>개발자들은 더 이상 하드웨어 구매에 큰돈을 들이거나 서버가 도착할 때까지 기다릴 필요가 없어졌습니다. 클릭 몇 번만으로 수 분 내에 가상의 서버를 생성하고, 사용자가 몰리면 즉시 서버를 늘릴 수 있게 되었습니다. 이는 초기 자본이 부족한 스타트업들이 혁신적인 서비스를 빠르게 출시할 수 있는 든든한 기반이 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>이것이 바로 구름 너머의 컴퓨터를 빌려 쓰는 \'클라우드 컴퓨팅\'의 시작이에요\. 내 방에 시끄러운 컴퓨터를 두지 않아도, 멀리 있는 거대한 컴퓨터 마을의 힘을 빌려 쓸 수 있죠\. 덕분에 누구나 쉽고 싸게 자신만의 인터넷 세상을 열 수 있는 멋진 시대가 왔어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>클라우드 컴퓨팅은 IT 인프라의 패러다임을 \'소유\'에서 \'대여\'로 완전히 바꾸어 놓았습니다. 기업들은 인프라 관리의 부담을 덜고 서비스 개발에만 집중할 수 있게 되었으며, 이는 넷플릭스나 우버 같은 글로벌 서비스들이 전 세계로 빠르게 확장할 수 있는 핵심 원동력이 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"전화도 하고, 노래도 듣고, 인터넷도 하는 요술 방망이가 내 손안에 쏙 들어왔다고요\?" 온 세상이 깜짝 놀란 마법 같은 날이에요\.</p>',
        '<p class="event-detail__summary">전화기, 미디어 플레이어, 인터넷 통신 기기를 하나의 터치스크린 기기로 통합한 스마트폰이 등장하며 모바일 혁명이 시작되었습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_2007\.png" alt="2007년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>스티브 잡스 아저씨가 무대 위에서 "전화기랑 음악 재생기랑 인터넷 기기를 하나로 찰싹 합쳤습니다!"라고 외쳤을 때, 세상 사람들은 눈이 휘둥그레졌어요\. "어떻게 하면 손가락 하나로 모든 걸 할 수 있을까\?"라는 고민이, 누구나 재미있는 장난감\(앱\)을 만들어 팔 수 있는 신나는 장터까지 열어주었죠\.</p>\s*<p>발명가들은 "우와! 내가 만든 장난감이 전 세계 친구들의 주머니 속으로 쏙 들어간다니!"라며 가슴이 두근거렸어요\. 곧이어 친구들과 수다 떠는 앱, 예쁜 사진을 자랑하는 앱들이 쏟아져 나와서 우리의 매일매일을 마법처럼 바꿔놓았답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_2007.png" alt="2007년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>애플의 스티브 잡스는 물리적인 키보드를 없애고 멀티 터치스크린을 탑재한 아이폰을 발표했습니다. 직관적인 터치 조작만으로 웹서핑, 음악 감상, 통화 등 모든 기능을 매끄럽게 사용할 수 있는 이 기기는, 휴대폰을 단순한 통신 수단에서 \'주머니 속의 강력한 컴퓨터\'로 재정의했습니다.</p>\n\t\t\t\t\t<p>이듬해 열린 앱스토어(App Store)는 전 세계의 개발자들이 자신이 만든 애플리케이션을 쉽게 배포하고 판매할 수 있는 생태계를 조성했습니다. 소셜 미디어, 모바일 게임, 길 찾기 등 수많은 앱이 쏟아져 나오며 사람들의 일상과 소통 방식을 근본적으로 변화시켰습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>아이폰은 \'내 손안의 작은 컴퓨터\' 시대를 활짝 열었어요\. 특히 누구나 자기가 만든 프로그램을 팔 수 있는 \'앱스토어\'라는 장터는, 기계를 만드는 회사뿐만 아니라 아이디어가 반짝이는 모든 사람에게 기회를 주어 세상을 크게 변화시키는 마법의 씨앗이 되었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>아이폰과 앱스토어의 결합은 하드웨어와 소프트웨어 생태계가 완벽하게 조화를 이룬 모바일 플랫폼의 표준을 제시했습니다. 이는 언제 어디서나 인터넷에 접속하고 정보를 소비하는 \'모바일 온리(Mobile-only)\' 시대를 여는 결정적인 전환점이 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"그림만 그리던 수천 명의 꼬마 요정들에게 수학 문제도 맡겨볼까요\?"라는 재미있는 제안이 과학자들을 춤추게 했어요\.</p>',
        '<p class="event-detail__summary">"그래픽 처리에 특화된 병렬 연산 능력을 일반적인 과학 계산에도 활용할 수 없을까?"라는 아이디어가 GPU의 범용적 활용을 이끌어냈습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_2007\.png" alt="2007년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>원래 그래픽 카드\(GPU\)는 예쁜 게임 화면을 쓱쓱 그리는 화가 요정들이었어요\. 그런데 엔비디아 아저씨들은 "이 부지런한 요정들에게 게임 말고 다른 일도 시켜보면 어떨까\?"라는 기발한 고민을 했죠\.</p>\s*<p>"자, 이제 화가 요정들에게 수학 계산도 맡겨보세요!"라고 문을 활짝 열어주자, 과학자들은 만세를 불렀어요\. "야호! 비싼 슈퍼컴퓨터가 없어도 복잡한 실험을 척척 해낼 수 있어!" 이 멋진 생각이 훗날 똑똑한 인공지능\(AI\) 친구를 깨우는 마법의 열쇠가 될 줄은 아무도 몰랐답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_2007.png" alt="2007년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>그래픽 처리 장치(GPU)는 화면의 수많은 픽셀을 동시에 그리기 위해 수천 개의 작은 코어로 이루어져 있습니다. 엔비디아는 이 강력한 병렬 처리 능력을 그래픽 렌더링뿐만 아니라 일반적인 연산 작업에도 사용할 수 있도록 CUDA(Compute Unified Device Architecture)라는 프로그래밍 플랫폼을 발표했습니다.</p>\n\t\t\t\t\t<p>과학자와 연구자들은 값비싼 슈퍼컴퓨터 대신, 상대적으로 저렴한 GPU를 이용해 복잡한 시뮬레이션과 방대한 데이터 분석을 빠르게 수행할 수 있게 되었습니다. 이 기술적 도약은 훗날 막대한 연산량이 필요한 딥러닝과 인공지능 기술이 폭발적으로 성장할 수 있는 핵심적인 하드웨어 기반이 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>CUDA는 그림을 그리던 그래픽 카드를 \'수학 천재\'로 변신시켜 주는 마법의 지팡이예요\. 쉬운 계산을 한꺼번에 엄청나게 많이 해내는 요정들의 능력을 빌려서, 오늘날 컴퓨터가 스스로 공부하는 딥러닝과 인공지능 기술이 쑥쑥 자라날 수 있는 튼튼한 밭을 일구었답니다\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>CUDA의 등장으로 GPU는 단순한 디스플레이 부품을 넘어 범용 병렬 컴퓨팅(GPGPU) 장치로 진화했습니다. 수천 개의 코어가 동시에 연산을 수행하는 이 구조는, 수많은 행렬 곱셈이 필요한 인공 신경망 학습에 완벽하게 부합하며 현대 AI 혁명의 숨은 주역이 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"우와! 컴퓨터가 틀리는 횟수가 반으로 뚝 떨어졌어요!"라는 기쁜 소식이 인공지능 마을에 큰 잔치를 열었어요\.</p>',
        '<p class="event-detail__summary">이미지 인식 대회에서 딥러닝 알고리즘이 기존의 한계를 깨고 압도적인 성능 향상을 보여주며 인공지능의 새로운 시대를 열었습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_2012\.png" alt="2012년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>오랫동안 컴퓨터는 사진 속의 야옹이와 멍멍이도 잘 구별하지 못하는 바보였어요\. 하지만 제프리 힌튼 할아버지와 제자들은 "수학 천재 요정\(GPU\)들의 힘을 빌려 사람의 뇌를 흉내 내보자!"라는 멋진 도전을 했고, 결과는 정말 깜짝 놀랄 만했어요\.</p>\s*<p>컴퓨터가 사진 속 물건들을 사람처럼 척척 알아맞히기 시작한 거예요! "이게 진짜 된다고\?" 깜짝 놀란 과학자들은 앞다투어 수학 천재 요정들을 모셔갔고, 이때부터 바둑을 두는 알파고나 글을 쓰는 챗GPT 같은 똑똑한 인공지능 친구들이 쑥쑥 자라나기 시작했답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_2012.png" alt="2012년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>오랫동안 컴퓨터 비전 분야에서는 기계가 사진 속 사물을 정확히 인식하는 데 큰 어려움을 겪고 있었습니다. 제프리 힌튼 교수 연구팀은 인간의 뇌 신경망을 모방한 \'심층 신경망(Deep Learning)\' 구조와 GPU의 강력한 병렬 연산 능력을 결합한 \'AlexNet\'을 선보였습니다.</p>\n\t\t\t\t\t<p>2012년 이미지넷(ImageNet) 대회에서 AlexNet은 2위 모델과 압도적인 격차를 벌리며 우승을 차지했습니다. 기계가 스스로 데이터의 특징을 학습하는 딥러닝의 위력이 증명된 이 사건은, 이후 자율주행, 음성 인식, 의료 진단 등 산업 전반에 걸친 인공지능 붐을 촉발하는 결정적인 계기가 되었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>딥러닝은 사람의 머릿속 뇌세포들이 서로 손을 잡고 있는 모습을 흉내 낸 인공지능 기술이에요\. 엄청나게 많은 사진을 보고 공부해야 해서 시간이 아주 오래 걸렸지만, 그래픽 카드\(GPU\)의 도움 덕분에 짧은 시간 안에 똑똑해질 수 있었고, 드디어 인공지능의 황금빛 시대가 활짝 열렸어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>딥러닝은 방대한 데이터 속에서 패턴을 찾아내는 데 탁월한 성능을 발휘합니다. 과거에는 연산 능력의 한계로 실용화되지 못했지만, 대량의 데이터 축적과 GPU 하드웨어의 발전이 맞물리면서 비로소 그 잠재력을 폭발시킬 수 있었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"다른 동네로 이사 가도 내 장난감이 똑같이 움직이게 해 주세요!"라는 부탁에 튼튼한 마법 상자가 짠! 하고 나타났어요\.</p>',
        '<p class="event-detail__summary">"개발 환경과 운영 환경이 달라서 발생하는 오류를 어떻게 해결할까?"라는 고민에서 소프트웨어를 규격화하는 컨테이너 기술이 도입되었습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_2014\.png" alt="2014년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>프로그램을 다른 컴퓨터로 옮길 때마다 "어\? 내 방에선 잘 됐는데 여기선 왜 고장 나지\?"라며 울상을 짓는 일이 많았어요\. "어떻게 하면 이사 갈 때 방을 통째로 옮길 수 있을까\?"라는 고민 끝에 \'컨테이너\'라는 튼튼한 마법 상자가 탄생했죠\. 이삿짐을 커다란 철제 상자에 통째로 담아 배에 싣는 것처럼, 프로그램과 그 친구들을 한 상자에 쏙 묶어버린 거예요\.</p>\s*<p>이제 발명가들은 "내 방에서 잘 되면, 구름 위 컴퓨터에서도 무조건 잘 돼!"라며 활짝 웃게 되었어요\. 덕분에 하루에도 수십 번씩 장난감을 새것으로 뚝딱뚝딱 바꿔줄 수 있게 되었답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_2014.png" alt="2014년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>소프트웨어를 개발자의 컴퓨터에서 서버로 옮길 때, 운영체제나 설정의 차이로 인해 프로그램이 제대로 작동하지 않는 문제가 빈번했습니다. 이를 해결하기 위해 등장한 도커(Docker) 등의 컨테이너 기술은, 프로그램의 실행에 필요한 모든 라이브러리와 설정 파일을 하나의 표준화된 패키지로 묶어버렸습니다.</p>\n\t\t\t\t\t<p>컨테이너로 포장된 소프트웨어는 개인 노트북이든 거대한 클라우드 서버든 환경에 구애받지 않고 동일하게 실행됩니다. 이 기술 덕분에 개발과 배포 과정이 획기적으로 단축되었고, 거대한 서비스를 수많은 작은 조각(마이크로서비스)으로 나누어 안정적으로 운영하는 현대적인 아키텍처가 가능해졌습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>컨테이너 기술은 프로그램을 포장하고 배달하는 마법 같은 방법이에요\. 어떤 컴퓨터에 가든 똑같은 모습으로 씩씩하게 일할 수 있도록 지켜주기 때문에, 수많은 사람이 모이는 커다란 인터넷 서비스를 흔들림 없이 튼튼하게 운영하는 데 꼭 필요한 보물 같은 기술이 되었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>컨테이너 기술과 이를 효율적으로 관리하는 쿠버네티스(Kubernetes) 같은 오케스트레이션 도구의 결합은, 수천 대의 서버를 마치 하나의 거대한 컴퓨터처럼 유연하게 다룰 수 있게 해 주었습니다. 이는 넷플릭스나 구글 같은 대규모 서비스가 무중단으로 업데이트를 진행할 수 있는 핵심 비결입니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"윙윙 선풍기 소리도 안 나는데 무거운 짐을 번쩍번쩍 들어요!"라는 놀라운 소문이 온 동네를 발칵 뒤집어 놓았어요\.</p>',
        '<p class="event-detail__summary">발열과 전력 소모는 획기적으로 줄이면서도 압도적인 성능을 발휘하는 통합형 칩(SoC)이 PC 시장의 패러다임을 바꿨습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_2020\.png" alt="2020년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>애플 아저씨들은 "왜 노트북은 항상 뜨겁고 윙윙 시끄러운 소리를 내야 할까\?"라는 고민을 했죠\. 그래서 조그만 스마트폰에 들어가는 똑똑한 칩을 크게 키워서 노트북용 슈퍼 칩\(M1\)을 만들었어요\. 결과는 정말 마법 같았답니다!</p>\s*<p>밥\(배터리\)을 한 번만 먹어도 하루 종일 쌩쌩 달리고, 힘은 덩치 큰 컴퓨터보다 훨씬 셌어요\. 시끄러운 선풍기 소리 하나 없이 조용하게 일하는 이 노트북을 보고 사람들은 "혹시 우주인이 몰래 도와준 거 아니야\?"라며 깜짝 놀랐어요\. 컴퓨터의 상식을 완전히 깨버린 신나는 사건이었죠\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_2020.png" alt="2020년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>애플은 기존의 인텔 프로세서 대신, 스마트폰과 태블릿에서 축적한 ARM 기반의 저전력 설계 기술을 PC에 적용한 M1 칩을 발표했습니다. CPU, GPU, 메모리 등 컴퓨터의 주요 부품을 하나의 칩에 통합(SoC)하여 데이터 병목 현상을 해소하고 효율성을 극대화했습니다.</p>\n\t\t\t\t\t<p>M1 칩을 탑재한 노트북은 냉각 팬이 거의 돌지 않을 정도로 발열이 적으면서도, 기존의 고성능 데스크톱을 뛰어넘는 연산 속도와 놀라운 배터리 수명을 보여주었습니다. 이는 "고성능을 내려면 전력을 많이 소모하고 열이 많이 난다"는 기존 PC 업계의 상식을 완전히 뒤집은 혁신이었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>Apple M1은 계산하는 뇌, 그림 그리는 뇌, 기억하는 방을 작은 칩 하나에 옹기종기 모아놓은 \'통합 칩\'이에요\. 친구들이 가까이 모여 있으니 심부름 갈 필요가 없어서 속도는 엄청 빠르고 전기는 아주 조금만 먹는답니다\. 이때부터 컴퓨터 마을 사람들은 "얼마나 전기를 아끼면서 일을 잘하느냐"를 가장 중요하게 생각하게 되었어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>M1 칩의 성공은 전력 대 성능비(Performance per Watt)가 현대 컴퓨팅 기기의 가장 중요한 기준임을 증명했습니다. 통합 메모리 아키텍처(UMA)를 통해 부품 간의 데이터 복사 과정을 생략함으로써, 모바일 기기의 설계 철학이 고성능 PC 시장에서도 완벽하게 통할 수 있음을 보여주었습니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<p class="event-detail__summary">"이 거대한 기계들이 전부 똑똑한 로봇 친구 한 명을 가르치기 위한 거라고요\?" 사람들의 입이 떡 벌어지는 거대한 인공지능 학교가 세워졌어요\.</p>',
        '<p class="event-detail__summary">인간 수준의 언어 능력을 갖춘 생성형 AI를 훈련하고 서비스하기 위해, 전례 없는 규모의 초거대 컴퓨팅 인프라가 구축되고 있습니다.</p>'
    ),
    (
        r'<div class="event-detail__story">\s*<img src="assets/images/story_computers_2023\.png" alt="2023년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\s*<p>사람처럼 말하고 글을 쓰는 챗GPT 같은 똑똑한 인공지능 친구가 나타나면서, 컴퓨터 마을의 풍경이 완전히 바뀌었어요\. "어떻게 하면 이 친구를 더 똑똑하게 가르칠 수 있을까\?"라는 고민 끝에, 정보를 보관만 하던 창고가 엄청난 계산을 척척 해내는 거대한 학교로 변신했죠\.</p>\s*<p>회사들은 인공지능을 가르치는 특별한 칩 수만 개를 손에 손잡게 연결해서 어마어마하게 큰 \'인공지능 공장\'을 짓고 있어요\. 우리가 "옛날이야기 하나 해줘!"라고 말할 때마다, 보이지 않는 구름 너머에서는 수많은 슈퍼컴퓨터 요정들이 땀을 뻘뻘 흘리며 쉴 새 없이 계산을 하고 있답니다\.</p>\s*</div>',
        '<div class="event-detail__story">\n\t\t\t\t\t<img src="assets/images/story_computers_2023.png" alt="2023년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n\t\t\t\t\t<p>ChatGPT로 대표되는 대규모 언어 모델(LLM)과 생성형 AI의 등장은 IT 산업의 지형을 완전히 바꾸어 놓았습니다. 인간의 언어를 이해하고 자연스럽게 대화하며 코드를 작성하는 이 거대한 AI 모델을 훈련시키기 위해서는 상상을 초월하는 연산 능력이 필요했습니다.</p>\n\t\t\t\t\t<p>빅테크 기업들은 수만 개의 고성능 AI 가속기(GPU/NPU)를 초고속 네트워크로 연결한 거대한 AI 전용 데이터센터를 구축하고 있습니다. 사용자가 프롬프트를 입력할 때마다, 클라우드 너머의 거대한 컴퓨팅 인프라가 실시간으로 방대한 확률 계산을 수행하여 가장 적절한 답변을 생성해 냅니다.</p>\n\t\t\t\t</div>'
    ),
    (
        r'<div class="event-detail__notes">\s*<p>스스로 글을 쓰고 그림을 그리는 생성형 AI는 상상할 수 없을 만큼 엄청난 계산 능력이 필요해요\. 그래서 수천 개의 그래픽 카드\(GPU\) 요정들을 빛보다 빠르게 연결하는 마법 같은 기술이 아주 중요해졌죠\. 이제 데이터를 모아두는 커다란 창고는 단순한 보관함을 넘어, 세상에서 가장 크고 똑똑한 거인 계산기로 쑥쑥 진화하고 있어요\.</p>\s*</div>',
        '<div class="event-detail__notes">\n\t\t\t\t\t<p>생성형 AI 시대의 도래로 컴퓨팅의 중심은 단순한 데이터 저장과 웹 서비스 호스팅에서 \'대규모 병렬 연산\'으로 이동했습니다. AI 모델의 크기가 기하급수적으로 커짐에 따라, 칩 설계부터 냉각 시스템, 전력 공급에 이르기까지 인프라 전반에 걸친 새로운 기술 혁신이 가속화되고 있습니다.</p>\n\t\t\t\t</div>'
    )
]

for old, new in replacements:
    content, count = re.subn(old, new, content)
    if count == 0:
        print(f"Failed to replace: {old[:50]}...")

with open('c:/workspace/itstory/computers.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
