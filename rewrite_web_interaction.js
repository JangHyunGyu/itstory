const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'web-interaction.html');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  {
    old: `<p class="timeline-group__summary">브라우저에 JavaScript가 들어오고 XMLHttpRequest가 더해지자, 개발자들은 폼 검증과 데이터\n							갱신을 즉시 처리하는 실험에 뛰어들었습니다.</p>`,
    new: `<p class="timeline-group__summary">웹 브라우저에 자바스크립트라는 마법의 지팡이가 생겼어요! 덕분에 화면이 깜빡이지 않고도 새로운 소식을 짠! 하고 보여줄 수 있게 되었답니다.</p>`
  },
  {
    old: `<p class="timeline-group__summary">Ajax 열풍이 일어나고 Node.js가 등장하면서 “브라우저와 서버를 같은 언어로 돌리자”는 목소리가\n							커졌습니다.</p>`,
    new: `<p class="timeline-group__summary">에이잭스(Ajax)라는 멋진 마법이 유행하면서, "웹 브라우저와 서버 친구가 같은 언어로 대화하면 어떨까?"라는 재미있는 상상을 하게 되었어요.</p>`
  },
  {
    old: `<p class="timeline-group__summary">React가 상태 중심 UI를 보여주고 Service Worker가 오프라인 경험을 가능하게 하며, 웹앱이\n							네이티브 앱과 맞붙기 시작했습니다.</p>`,
    new: `<p class="timeline-group__summary">리액트(React) 요정이 나타나 화면을 레고 블록처럼 조립하게 도와주었어요. 인터넷이 끊겨도 끄떡없는 튼튼한 웹 세상이 열렸답니다!</p>`
  },
  {
    old: `<p class="timeline-group__summary">WebAssembly와 WebGPU가 안정화되자, 팀들은 “브라우저만 열면 게임과 AI가 돌아간다”고 실시간\n							협업 도구를 데모하기 시작했습니다.</p>`,
    new: `<p class="timeline-group__summary">이제는 무거운 프로그램을 설치하지 않아도 웹 브라우저 안에서 쌩쌩 돌아가는 멋진 3D 게임과 똑똑한 인공지능 친구를 만날 수 있게 되었어요!</p>`
  },
  {
    old: `<p class="event-detail__summary">“브라우저가 입력을 바로 처리하네?” 넷스케이프에 스크립트 언어가 들어오면서 폼 검증과 인터랙션이 즉시 가능해졌습니다.</p>`,
    new: `<p class="event-detail__summary">"우와, 내가 누른 버튼이 바로 움직여요!" 웹 브라우저에 마법의 주문이 생기면서 화면이 살아 숨 쉬기 시작했답니다.</p>`
  },
  {
    old: `<div class="event-detail__story">\n					<p>넷스케이프 사무실에서 브렌던 아이크는 10일 만에 Mocha 프로토타입을 완성했습니다. 내부 데모에서 버튼을 클릭하자 경고창이 뜨는 모습을 본 동료는 “브라우저가 사용자\n						입력을 바로 처리하네!”라고 놀랐습니다.</p>\n					<p>곧 출시된 Navigator 2.0에서 폼 유효성 검사가 동작하자, 웹 마스터들은 “서버까지 가지 않아도 즉시 메시지를 보여줄 수 있다.”며 가능성을 탐색했습니다.</p>\n				</div>`,
    new: `<div class="event-detail__story">\n					<img src="assets/images/story_web-interaction_1995.png" alt="1995년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n					<p>옛날 옛적 넷스케이프라는 마을에 브렌던이라는 뚝딱뚝딱 발명가가 살았어요. 그는 단 10일 만에 화면을 움직이게 하는 마법의 주문을 만들어냈죠! 버튼을 콕 누르자 뿅! 하고 알림창이 뜨는 걸 보고 친구들은 깜짝 놀랐어요.</p>\n					<p>"우와! 멀리 있는 서버 할아버지한테 물어보지 않아도, 브라우저가 바로바로 대답을 해주네!" 사람들은 이 신기한 마법으로 무엇을 더 할 수 있을지 신나게 상상하기 시작했답니다.</p>\n				</div>`
  },
  {
    old: `<div class="event-detail__notes">\n					<p>JavaScript는 동적으로 DOM을 조작하고, 이벤트 루프로 사용자 입력을 처리하는 언어로 자리 잡았습니다. 이 사건 이후 브라우저는 단순한 문서 뷰어를 넘어 상호작용\n						플랫폼이 되기 시작했습니다.</p>\n				</div>`,
    new: `<div class="event-detail__notes">\n					<p>이 마법의 이름이 바로 '자바스크립트(JavaScript)'랍니다. 자바스크립트 덕분에 딱딱한 글자만 있던 웹 페이지가 우리가 누르고 만질 수 있는 재미있는 놀이터로 변신하게 되었어요.</p>\n				</div>`
  },
  {
    old: `<p class="event-detail__summary">“버튼이 춤을 추네!” Flash 플레이어가 배포되자 웹사이트는 음악과 모션으로 사용자 시선을 붙잡았습니다.</p>`,
    new: `<p class="event-detail__summary">"우와, 버튼이 덩실덩실 춤을 춰요!" 플래시(Flash) 요정이 나타나 웹사이트에 신나는 음악과 화려한 움직임을 선물했답니다.</p>`
  },
  {
    old: `<div class="event-detail__story">\n					<p>1996년 Macromedia는 FutureSplash를 인수해 Flash 1.0을 공개했습니다. 한 에이전시 디자이너는 마우스를 올리면 반응하는 네비게이션을 만들어 보여\n						주며 “GIF로는 못 하던 일이 가능해졌어요.”라고 말했습니다.</p>\n					<p>브랜드 사이트와 뮤직비디오 프로모션이 Flash를 채택했고, 방송국은 “로딩 바가 끝나면 풀 화면 애니메이션이 펼쳐진다”고 홍보했습니다. 사용자들은 처음으로 브라우저에서 풀\n						모션 인터랙션을 경험했습니다.</p>\n				</div>`,
    new: `<div class="event-detail__story">\n					<img src="assets/images/story_web-interaction_1996.png" alt="1996년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n					<p>1996년, 매크로미디어라는 곳에서 '플래시(Flash)'라는 멋진 그림 도구를 세상에 내놓았어요. 한 디자이너가 마우스를 올리면 반짝반짝 빛나는 메뉴를 만들며 "이제 멈춰있는 그림 대신 살아 움직이는 그림을 그릴 수 있어요!"라며 기뻐했죠.</p>\n					<p>곧이어 수많은 웹사이트들이 플래시로 예쁜 애니메이션과 신나는 뮤직비디오를 만들기 시작했어요. 사람들은 웹 브라우저 안에서 마치 만화 영화를 보는 것처럼 즐거운 시간을 보냈답니다.</p>\n				</div>`
  },
  {
    old: `<div class="event-detail__notes">\n					<p>Flash는 벡터 그래픽, 타임라인 애니메이션, ActionScript 스크립트를 제공하면서 웹 인터랙션을 시각적으로 표현할 수 있게 했습니다. 표준 기반이 아니었지만\n						“브라우저 안에서 앱처럼 움직인다”는 기대를 키워, 이후 캔버스, SVG, WebGL 같은 표준 기술 개발에 자극을 주었습니다.</p>\n				</div>`,
    new: `<div class="event-detail__notes">\n					<p>플래시는 웹을 아주 화려하게 꾸며주는 마법사였어요. 비록 지금은 다른 마법들에게 자리를 물려주었지만, "웹에서도 이렇게 멋진 움직임을 만들 수 있구나!"라는 꿈을 심어준 아주 고마운 친구랍니다.</p>\n				</div>`
  },
  {
    old: `<p class="event-detail__summary">Outlook Web Access 팀이 “리로드 없이 메일을 갱신하자”라며 붙인 XMLHttpRequest가 비동기 웹의 문을\n					열었습니다.</p>`,
    new: `<p class="event-detail__summary">"화면이 깜빡이지 않고도 새 편지가 도착했어요!" 조용히 편지를 배달해 주는 비밀 우체부 아저씨가 등장했답니다.</p>`
  },
  {
    old: `<div class="event-detail__story">\n					<p>IE 팀은 Outlook Web Access에 빠른 메일 목록을 제공하기 위해 ActiveX 기반 XMLHttpRequest를 도입했습니다. 기업 고객이 “새로고침 없이\n						메일이 도착하네!”라고 반응하자, 개발 문서가 급히 배포됐습니다.</p>\n					<p>모질라와 Safari도 비슷한 기능을 구현하며 API를 정비했고, 이 기능이 표준 논의로 이어졌습니다.</p>\n				</div>`,
    new: `<div class="event-detail__story">\n					<img src="assets/images/story_web-interaction_1999.png" alt="1999년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n					<p>어느 날, 이메일을 만드는 팀에서 "새 편지가 올 때마다 화면 전체를 다시 그리는 건 너무 힘들어!"라는 고민을 했죠. 그래서 화면 뒤에서 몰래 편지만 쏙 가져오는 '비밀 우체부'를 만들었어요.</p>\n					<p>사람들은 "우와! 새로고침 버튼을 누르지 않았는데 새 편지가 뿅 하고 나타났어!"라며 신기해했어요. 다른 브라우저 친구들도 이 멋진 비밀 우체부를 따라 만들기 시작했답니다.</p>\n				</div>`
  },
  {
    old: `<div class="event-detail__notes">\n					<p>XMLHttpRequest는 비동기 네트워크 요청을 가능하게 해 SPA의 전조가 되었습니다. 이후 Fetch API로 확장되며 브라우저가 서버와 실시간 대화하는 기반이\n						되었습니다.</p>\n				</div>`,
    new: `<div class="event-detail__notes">\n					<p>이 비밀 우체부의 진짜 이름은 'XMLHttpRequest'예요. 이 우체부 덕분에 우리가 웹사이트를 보면서도 뒤에서는 새로운 정보를 계속 받아올 수 있는 아주 똑똑한 웹 세상이 열리게 되었어요.</p>\n				</div>`
  },
  {
    old: `<p class="event-detail__summary">“이제 웹도 앱이다.” Ajax라는 이름이 붙자 구글 지도와 지메일이 웹앱의 상징이 되었습니다.</p>`,
    new: `<p class="event-detail__summary">"웹사이트가 마치 내 컴퓨터에 깔린 프로그램 같아요!" 에이잭스(Ajax)라는 멋진 이름이 생기면서 웹의 새로운 시대가 열렸어요.</p>`
  },
  {
    old: `<div class="event-detail__story">\n					<p>A List Apart의 글이 공개되자, 제품 매니저들은 회의실에서 구글 지도를 돌려 보였습니다. 지도 화면이 부드럽게 이동하는 모습을 본 임원은 “웹에서도 데스크톱 앱 같은\n						경험이 가능하군.”이라고 감탄했습니다.</p>\n					<p>스타트업 팀은 즉시 Ajax 프레임워크를 찾아보고, 개발자 모임에서는 비동기 요청과 DOM 업데이트 패턴이 활발히 공유되었습니다.</p>\n				</div>`,
    new: `<div class="event-detail__story">\n					<img src="assets/images/story_web-interaction_2005.png" alt="2005년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n					<p>어느 날, 사람들이 모여 구글 지도를 보며 깜짝 놀랐어요. 마우스로 지도를 쓱쓱 끌어당기는데 화면이 끊기지 않고 부드럽게 움직였거든요! "우와, 웹사이트가 진짜 프로그램처럼 부드럽게 움직이네!"</p>\n					<p>이 멋진 마법에 '에이잭스(Ajax)'라는 멋진 이름이 붙여졌어요. 수많은 발명가들이 이 마법을 배우기 위해 모여들었고, 더 재미있고 편리한 웹사이트들을 만들기 시작했답니다.</p>\n				</div>`
  },
  {
    old: `<div class="event-detail__notes">\n					<p>Ajax는 비동기 요청, DOM 조작, JSON 데이터 교환을 한 묶음으로 소개했습니다. 이 용어 덕분에 경영진과 개발자가 같은 언어로 미래 웹앱을 논의할 수 있게\n						되었습니다.</p>\n				</div>`,
    new: `<div class="event-detail__notes">\n					<p>에이잭스는 화면 뒤에서 몰래 데이터를 가져와서 필요한 부분만 쏙쏙 바꿔주는 기술이에요. 이 기술 덕분에 우리는 기다림 없이 빠르고 부드러운 웹사이트를 즐길 수 있게 되었답니다.</p>\n				</div>`
  },
  {
    old: `<p class="event-detail__summary">존 레식은 “한 줄이면 됩니다.”라고 말하며 <code>$("#menu li")</code> 데모를 선보였고, 전 세계 개발자가\n					같은 API를 쓰기 시작했습니다.</p>`,
    new: `<p class="event-detail__summary">"복잡한 주문은 이제 그만! 짧은 주문 한 줄이면 충분해요." 제이쿼리(jQuery) 요정이 나타나 마법을 아주 쉽게 만들어 주었어요.</p>`
  },
  {
    old: `<div class="event-detail__story">\n					<p>2006년 BarCamp에서 레식은 슬라이드 대신 브라우저 콘솔을 열어 \`$("#todo li").addClass("done")\`를 실행했습니다. 관객은 “브라우저마다 다르게\n						동작하던 작업이 한 번에 끝나네!”라며 환호했습니다.</p>\n					<p>곧이어 플러그인 생태계가 폭발하며 슬라이더, 모달, Ajax 래퍼가 공유되었습니다. 디자이너와 개발자는 같은 API로 이벤트와 애니메이션을 다뤘습니다.</p>\n				</div>`,
    new: `<div class="event-detail__story">\n					<img src="assets/images/story_web-interaction_2006.png" alt="2006년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n					<p>존이라는 똑똑한 마법사가 나타나 사람들에게 짧은 주문 하나를 보여주었어요. "수리수리 마수리, 얍!" 그러자 복잡했던 화면이 한 번에 짠! 하고 바뀌었죠. 사람들은 "우와! 브라우저마다 달랐던 복잡한 주문이 이렇게 쉬워지다니!"라며 기뻐했어요.</p>\n					<p>이 마법의 이름은 '제이쿼리'였어요. 제이쿼리 덕분에 누구나 쉽게 예쁜 슬라이드와 팝업창을 만들 수 있게 되었고, 웹 세상은 더욱 풍성하고 아름다워졌답니다.</p>\n				</div>`
  },
  {
    old: `<div class="event-detail__notes">\n					<p>jQuery는 CSS 선택자 기반 DOM 조작, 체이닝, Ajax 헬퍼를 제공해 브라우저 호환성을 숨겼습니다. 프론트엔드는 인터랙션 구현 속도를 크게 높였고, 백엔드는\n						REST/JSON 응답으로 데이터를 제공하며 협업 구조를 단순화했습니다.</p>\n				</div>`,
    new: `<div class="event-detail__notes">\n					<p>제이쿼리는 복잡하고 어려운 자바스크립트 마법을 아주 쉽고 간단하게 쓸 수 있게 도와주는 친절한 도우미였어요. 덕분에 웹을 만드는 사람들이 훨씬 더 빠르고 즐겁게 일할 수 있었답니다.</p>\n				</div>`
  },
  {
    old: `<p class="event-detail__summary">“서버도 자바스크립트로 돌릴 수 있네.” Node.js 발표가 이벤트 루프 기반 서버 열풍을 불러왔습니다.</p>`,
    new: `<p class="event-detail__summary">"웹 브라우저에서 쓰던 마법을 서버에서도 쓸 수 있다고요?" 노드제이에스(Node.js)가 등장하며 자바스크립트의 무대가 넓어졌어요.</p>`
  },
  {
    old: `<div class="event-detail__story">\n					<p>JSConf에서 달은 실시간 채팅 데모를 보여주며 “동시 연결을 수만 개까지 처리할 수 있다.”고 설명했습니다. 발표 후 개발자들은 노트북을 펼쳐 \`npm install\`을\n						입력했고, 즉시 헬로월드 서버가 실행되는 것을 보고 환호했습니다.</p>\n					<p>몇 달 뒤 GitHub에 수많은 웹소켓 예제가 올라오며, 스타트업이 실시간 앱을 Node.js로 구축하기 시작했습니다.</p>\n				</div>`,
    new: `<div class="event-detail__story">\n					<img src="assets/images/story_web-interaction_2009.png" alt="2009년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n					<p>라이언이라는 발명가가 무대에 올라와 신기한 마술 상자를 보여주었어요. "이 상자를 쓰면 수만 명의 친구들이 동시에 채팅을 해도 끄떡없어요!" 사람들은 깜짝 놀라며 너도나도 마술 상자를 열어보았죠.</p>\n					<p>이 마술 상자의 이름은 '노드제이에스'였어요. 이제 사람들은 웹 브라우저뿐만 아니라 보이지 않는 서버 마을에서도 자바스크립트 마법을 마음껏 부릴 수 있게 되었답니다.</p>\n				</div>`
  },
  {
    old: `<div class="event-detail__notes">\n					<p>Node.js는 V8 엔진과 이벤트 루프를 재사용해 서버에서도 JavaScript를 활용하도록 했습니다. 프런트와 백엔드 로직을 하나의 언어로 다루게 되면서, 인터랙션 개발\n						사이클이 빨라졌습니다.</p>\n				</div>`,
    new: `<div class="event-detail__notes">\n					<p>노드제이에스 덕분에 앞모습을 꾸미는 요정들과 뒷모습을 챙기는 요정들이 같은 언어로 대화할 수 있게 되었어요. 그래서 훨씬 더 빠르고 멋진 웹사이트를 만들 수 있게 되었답니다.</p>\n				</div>`
  },
  {
    old: `<p class="event-detail__summary">IETF가 WebSocket을 승인하자 제품팀은 “폴링 없이 채팅이 된다!”며 대화형 서비스를 본격화했습니다.</p>`,
    new: `<p class="event-detail__summary">"이제 편지를 기다리지 않고 바로바로 이야기할 수 있어요!" 웹소켓(WebSocket)이라는 마법의 전화기가 생겼답니다.</p>`
  },
  {
    old: `<div class="event-detail__story">\n					<p>2011년, HTML5 표준화 회의장에서 이안 히콘은 브라우저-서버 간 양방향 소켓 데모를 보여주었습니다. 콘솔에 “Hello”를 치자 서버가 즉시 답했고, 참석자들은 “이제\n						롱 폴링을 버려도 되겠네요.”라고 말했다.</p>\n					<p>트레이딩, 게임, 고객 지원 챗봇이 WebSocket으로 실시간 알림을 구현했고, 기업용 메신저는 기존 폴링 코드에서 벗어나 서버 부하를 크게 줄였습니다.</p>\n				</div>`,
    new: `<div class="event-detail__story">\n					<img src="assets/images/story_web-interaction_2011.png" alt="2011년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n					<p>옛날에는 서버 할아버지에게 "새 소식 있어요?"라고 계속 물어봐야 했어요. 하지만 어느 날, '웹소켓'이라는 마법의 전화기가 발명되었죠! "안녕!" 하고 인사하면 서버 할아버지가 즉시 "안녕!" 하고 대답해 주었어요.</p>\n					<p>사람들은 "우와! 이제 계속 물어보지 않아도 바로바로 이야기를 나눌 수 있네!"라며 기뻐했어요. 덕분에 우리는 친구들과 실시간으로 신나게 채팅도 하고 게임도 즐길 수 있게 되었답니다.</p>\n				</div>`
  },
  {
    old: `<div class="event-detail__notes">\n					<p>WebSocket은 하나의 TCP 연결에서 양방향 메시지를 주고받아 지연을 줄였습니다. 프론트엔드는 이벤트 기반 상태 업데이트를 구현하고, 백엔드는 메시지 브로커와 연계해\n						실시간 시스템을 구축했습니다. 이는 이후 GraphQL Subscriptions, WebRTC 같은 스트리밍 기술의 토대를 닦았습니다.</p>\n				</div>`,
    new: `<div class="event-detail__notes">\n					<p>웹소켓은 브라우저와 서버를 튼튼한 파이프로 연결해 주는 기술이에요. 이 파이프를 통해 언제든지 빠르고 끊김 없이 서로 대화를 나눌 수 있게 되었답니다.</p>\n				</div>`
  },
  {
    old: `<p class="event-detail__summary">“UI를 함수처럼 생각해 보자.” React가 컴포넌트와 가상 DOM 개념을 대중화했습니다.</p>`,
    new: `<p class="event-detail__summary">"화면을 레고 블록처럼 조립해 볼까요?" 리액트(React) 요정이 나타나 웹을 만드는 새로운 방법을 알려주었어요.</p>`
  },
  {
    old: `<div class="event-detail__story">\n					<p>JSConf EU 발표에서 조던 워클르는 “UI를 함수처럼 생각해 보세요.”라고 소개했습니다. 데모에서 버튼을 눌러도 DOM을 직접 건드리지 않고 화면이 갱신되자, 관중석에서\n						“와!” 하는 탄성이 나왔습니다.</p>\n					<p>곧바로 GitHub에 React 저장소가 올라오고, 초기 사용자는 TodoMVC를 구현해 블로그에 공유했습니다.</p>\n				</div>`,
    new: `<div class="event-detail__story">\n					<img src="assets/images/story_web-interaction_2013.png" alt="2013년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n					<p>조던이라는 마법사가 무대에 올라와 신기한 레고 블록을 보여주었어요. "화면을 통째로 그리지 말고, 작은 블록들로 나누어 조립해 보세요!" 버튼을 누르자 필요한 블록만 쏙쏙 바뀌는 걸 보고 사람들은 "우와!" 하고 탄성을 질렀죠.</p>\n					<p>이 마법의 이름은 '리액트'였어요. 사람들은 리액트 블록을 이리저리 조립하며 훨씬 더 크고 멋진 웹사이트 성을 뚝딱뚝딱 짓기 시작했답니다.</p>\n				</div>`
  },
  {
    old: `<div class="event-detail__notes">\n					<p>React는 Virtual DOM과 단방향 데이터 흐름을 기반으로 컴포넌트 패턴을 정착시켰습니다. UI를 상태 기반으로 관리하면서 대형 인터랙션을 유지하기 쉬워졌고, 이후\n						수많은 프레임워크가 비슷한 철학을 채택했습니다.</p>\n				</div>`,
    new: `<div class="event-detail__notes">\n					<p>리액트는 화면의 모습을 기억해 두었다가, 바뀐 부분만 아주 빠르게 고쳐주는 똑똑한 요정이에요. 덕분에 복잡한 화면도 엉키지 않고 예쁘게 관리할 수 있게 되었답니다.</p>\n				</div>`
  },
  {
    old: `<p class="event-detail__summary">“브라우저를 꺼도 알림이 온다.” Service Worker 초안이 오프라인 웹앱의 핵심으로 떠올랐습니다.</p>`,
    new: `<p class="event-detail__summary">"인터넷이 끊겨도 웹사이트가 열려요!" 서비스 워커(Service Worker)라는 든든한 수호천사가 나타났답니다.</p>`
  },
  {
    old: `<div class="event-detail__story">\n					<p>크롬 개발자 서밋에서 팀은 푸시 알림을 시연했습니다. 브라우저를 닫아도 알림이 도착하자 관객들은 박수를 쳤습니다. PWA라는 개념이 곧 등장했고, 개발자들은 매니페스트와 캐시\n						전략을 학습하기 시작했습니다.</p>\n					<p>신문사 웹팀은 지하철에서 기사 읽기를 돕기 위해 오프라인 캐시를 도입했습니다. 독자는 “기사가 로딩되지 않아 답답했던 일이 줄었어요.”라고 피드백했습니다.</p>\n				</div>`,
    new: `<div class="event-detail__story">\n					<img src="assets/images/story_web-interaction_2014.png" alt="2014년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n					<p>어느 날, 브라우저를 닫았는데도 "띠링!" 하고 새로운 소식이 도착했어요! 사람들은 깜짝 놀라며 박수를 쳤죠. 인터넷이 연결되지 않은 깊은 산속이나 지하철에서도 웹사이트를 볼 수 있게 된 거예요.</p>\n					<p>이 모든 건 '서비스 워커'라는 수호천사 덕분이었어요. 수호천사가 미리 재미있는 이야기들을 가방에 담아두었다가, 인터넷이 끊기면 짠! 하고 꺼내서 보여주었거든요.</p>\n				</div>`
  },
  {
    old: `<div class="event-detail__notes">\n					<p>Service Worker는 백그라운드에서 네트워크 요청을 가로채고 캐시를 제어할 수 있게 했습니다. 네이티브 앱에서만 가능했던 오프라인과 푸시 경험이 웹으로 들어오며,\n						브라우저 상호작용의 범위가 크게 넓어졌습니다.</p>\n				</div>`,
    new: `<div class="event-detail__notes">\n					<p>서비스 워커는 브라우저 뒤에서 조용히 일하며 데이터를 저장해 주는 고마운 친구예요. 덕분에 웹사이트도 진짜 스마트폰 앱처럼 언제 어디서나 든든하게 사용할 수 있게 되었답니다.</p>\n				</div>`
  },
  {
    old: `<p class="event-detail__summary">Hacking Team 유출로 드러난 Flash 취약점(CVE-2015-5119)이 전 세계 브라우저를 멈춰 세웠습니다.</p>`,
    new: `<p class="event-detail__summary">"앗, 플래시 성에 나쁜 악당이 들어왔어요!" 전 세계 브라우저 마을에 비상이 걸렸던 아찔한 사건이 있었답니다.</p>`
  },
  {
    old: `<div class="event-detail__story">\n					<p>2015년 7월, 이탈리아 보안업체 Hacking Team 내부 자료가 공개되자 “여기에 제로데이가 있다”는 보고가 트위터로 번졌습니다. 다음 날 아침, 한 브라우저\n						엔지니어는 긴급 화상회의에서 “Adobe가 오늘 안에 패치를 낸다고 확인했어요. 우리도 기본 설정에서 Flash를 막읍시다.”라고 제안했습니다.</p>\n					<p>Mozilla는 그날 Firefox의 모든 버전에서 Flash를 블록리스트에 올렸고, Facebook 보안 책임자 알렉스 스타모스도 “Flash 퇴출 시계를 맞춰야 한다.”고\n						공개적으로 압박했습니다. 국내 포털 운영팀도 오후 배포에서 “업무용 포털이 멈췄다”는 고객센터 연락을 받고 대체 콘텐츠를 긴급 적용했습니다.</p>\n				</div>`,
    new: `<div class="event-detail__story">\n					<img src="assets/images/story_web-interaction_2015.png" alt="2015년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n					<p>어느 여름날, 화려하고 멋진 플래시 성에 나쁜 악당들이 몰래 들어올 수 있는 비밀 통로가 발견되었어요! 마을 사람들은 깜짝 놀라 "위험해! 당장 플래시 성의 문을 닫아야 해!"라고 외쳤죠.</p>\n					<p>브라우저 마을의 촌장님들은 서둘러 회의를 열고, 사람들을 보호하기 위해 플래시 성으로 가는 길을 꽁꽁 막아버렸어요. 이 사건을 계기로 사람들은 더 안전하고 튼튼한 새로운 성을 짓기로 결심했답니다.</p>\n				</div>`
  },
  {
    old: `<div class="event-detail__notes">\n					<p>Adobe는 APSB15-16 패치를 배포하며 CVE-2015-5119와 CVE-2015-5122 등 중대 취약점을 수정했습니다. 이 사고는 Flash 의존 서비스를\n						NPAPI·ActiveX 기반에서 JavaScript와 HTML5로 전환하게 만든 전환점이었고, 주요 브라우저가 기본적으로 Flash를 비활성화하도록 정책을 바꾸는 계기가\n						되었습니다.</p>\n				</div>`,
    new: `<div class="event-detail__notes">\n					<p>이 무서운 사건 이후로, 웹 마을 사람들은 플래시 대신 더 안전하고 표준화된 HTML5라는 새로운 마법을 사용하기 시작했어요. 아쉽지만 플래시 요정과는 서서히 작별 인사를 나누게 되었답니다.</p>\n				</div>`
  },
  {
    old: `<p class="event-detail__summary">HTML 파서 버그가 Cloudflare 캐시에서 세션 토큰과 요청 데이터가 새어 나가게 만든 사고였습니다.</p>`,
    new: `<p class="event-detail__summary">"어머나, 비밀 편지가 밖으로 새어 나갔어요!" 클라우드플레어(Cloudflare) 마을에서 일어난 깜짝 놀랄 소동이었어요.</p>`
  },
  {
    old: `<div class="event-detail__story">\n					<p>2017년 2월, 구글의 프로젝트 제로 연구원 타비스 오만디는 새벽 0시에 Cloudflare에 전화를 걸어 “랜덤 사이트에서 다른 사용자의 쿠키가 보여요.”라고 알렸습니다.\n						몇 분 뒤 Cloudflare SRE 팀 채널이 붉은색 경고로 가득 찼고, 한 SRE 엔지니어는 “HTML 리라이터 모듈을 끄고 전 세계 캐시를 비워야 합니다.”라고\n						외쳤습니다.</p>\n					<p>블로그 공지가 올라오자, 팀은 고객사 목록을 훑으며 “로그아웃 처리와 토큰 교체를 안내합시다.”라고 협의했습니다. 국내 스타트업 CTO도 “Cloudflare를 통과하는\n						로그인 트래픽은 모두 세션 무효화하라.”는 메시지를 사내 슬랙에 올렸습니다.</p>\n				</div>`,
    new: `<div class="event-detail__story">\n					<img src="assets/images/story_web-interaction_2017.png" alt="2017년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n					<p>어느 깊은 밤, 한 똑똑한 탐정이 클라우드플레어 마을의 경비원에게 다급하게 전화를 걸었어요. "큰일 났어요! 사람들의 소중한 비밀 편지가 길거리에 흩날리고 있어요!" 경비원들은 깜짝 놀라 비상벨을 울렸죠.</p>\n					<p>마을 사람들은 서둘러 흩어진 편지들을 줍고, 혹시 모를 위험에 대비해 모두의 자물쇠 비밀번호를 새로 바꾸도록 안내했어요. 정말 가슴이 철렁 내려앉는 밤이었답니다.</p>\n				</div>`
  },
  {
    old: `<div class="event-detail__notes">\n					<p>Cloudflare는 버그가 HTML 파서의 경계 조건 오류에서 비롯됐다고 설명하며, 2017년 2월 13일부터 18일까지 누수가 있었다고 공식 발표했습니다. 이 사고는\n						리버스 프록시와 CDN 단계에서도 보안 사고 대응 체계가 필요하다는 사실을 일깨웠고, 주요 서비스가 자동 세션 무효화와 보안 모니터링을 강화하는 계기가 되었습니다.</p>\n				</div>`,
    new: `<div class="event-detail__notes">\n					<p>이 사건은 아무리 튼튼한 성벽이라도 작은 틈새로 비밀이 샐 수 있다는 걸 알려주었어요. 이후로 웹 마을 사람들은 성벽을 더욱 꼼꼼하게 살피고, 비밀을 지키는 방법을 더욱 단단하게 만들었답니다.</p>\n				</div>`
  },
  {
    old: `<p class="event-detail__summary">“설치 없이 3D 모델링이 돼?” WebAssembly 1.0 권고가 나오자 고성능 앱이 웹으로 옮겨오기 시작했습니다.</p>`,
    new: `<p class="event-detail__summary">"무거운 프로그램도 웹에서 깃털처럼 가볍게 돌아가요!" 웹어셈블리(WebAssembly)라는 엄청난 힘을 가진 영웅이 등장했어요.</p>`
  },
  {
    old: `<div class="event-detail__story">\n					<p>오토데스크 엔지니어는 C++ 코드베이스를 WebAssembly로 컴파일하고, 브라우저에서 3D 모델링을 시연했습니다. 관객은 “로컬 앱과 차이가 없어요.”라며 놀랐습니다.\n					</p>\n					<p>교육 스타트업은 피아노 튜터 앱을 WebAssembly로 옮겨, 저사양 기기에서도 음성 분석을 수행하게 했습니다.</p>\n				</div>`,
    new: `<div class="event-detail__story">\n					<img src="assets/images/story_web-interaction_2020.png" alt="2020년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n					<p>어느 날, 한 발명가가 무거운 3D 찰흙 놀이를 웹 브라우저 안에서 쓱쓱 해내는 모습을 보여주었어요. 사람들은 "우와! 컴퓨터에 무거운 프로그램을 깔지 않았는데도 이렇게 빠르다니!"라며 눈이 휘둥그레졌죠.</p>\n					<p>이 엄청난 힘의 비밀은 바로 '웹어셈블리'였어요. 웹어셈블리 영웅 덕분에 낡은 컴퓨터에서도 복잡한 피아노 소리를 척척 알아듣는 신기한 마법이 가능해졌답니다.</p>\n				</div>`
  },
  {
    old: `<div class="event-detail__notes">\n					<p>WebAssembly는 빠른 로딩과 네이티브에 가까운 성능을 제공해, 브라우저가 고성능 애플리케이션 플랫폼으로 도약하는 기반이 되었습니다. 다양한 언어가 웹 런타임을 목표로\n						삼게 되었습니다.</p>\n				</div>`,
    new: `<div class="event-detail__notes">\n					<p>웹어셈블리는 브라우저가 아주 어려운 수학 문제도 순식간에 풀 수 있게 도와주는 똑똑한 번역기예요. 덕분에 웹은 단순한 문서를 넘어, 무엇이든 할 수 있는 만능 놀이터가 되었답니다.</p>\n				</div>`
  },
  {
    old: `<p class="event-detail__summary">Chrome 94가 WebCodecs를 도입하자 “브라우저에서 직접 인코더를 돌리자”는 실시간 미디어 실험이 폭발했습니다.\n				</p>`,
    new: `<p class="event-detail__summary">"버벅거림 없이 매끄러운 영상을 즐겨요!" 웹코덱(WebCodecs) 요정이 나타나 영상 마술을 부리기 시작했어요.</p>`
  },
  {
    old: `<div class="event-detail__story">\n					<p>2021년 Google I/O 세션에서 발표를 맡은 엔지니어는 WebCodecs로 웹캠 피드를 8ms 안에 처리하는 데모를 보여주었습니다. 참가자들은 “이제 스트리밍 앱이\n						데스크톱 앱과 같은 속도를 내네!”라고 놀랐습니다.</p>\n					<p>협업 화이트보드, 클라우드 게임, 비디오 편집 SaaS가 WebCodecs를 도입해 저지연 영상 전송과 AR 필터를 구현했습니다. 기존 WebRTC 파이프라인에 새로운 가속\n						옵션이 더해졌습니다.</p>\n				</div>`,
    new: `<div class="event-detail__story">\n					<img src="assets/images/story_web-interaction_2021.png" alt="2021년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n					<p>한 마술사가 무대에 올라와 눈 깜짝할 새에 영상을 뚝딱뚝딱 편집하는 모습을 보여주었어요. "우와! 영상이 하나도 끊기지 않고 물 흐르듯 자연스러워요!" 사람들은 박수를 치며 환호했죠.</p>\n					<p>이 마술의 비밀은 '웹코덱' 요정이었어요. 요정의 도움으로 친구들과 얼굴에 재미있는 스티커를 붙이며 영상 통화를 하고, 멀리 떨어져 있어도 함께 신나게 게임을 즐길 수 있게 되었답니다.</p>\n				</div>`
  },
  {
    old: `<div class="event-detail__notes">\n					<p>WebCodecs는 디코더·인코더에 직접 접근하게 해 GPU 가속과 하드웨어 코덱을 활용할 수 있게 했습니다. 프론트엔드는 영상·음성 처리 지연을 줄였고, 백엔드는 가벼운\n						바이트스트림을 제공하며 협업 도구와 미디어 서비스의 품질을 높였습니다.</p>\n				</div>`,
    new: `<div class="event-detail__notes">\n					<p>웹코덱은 무거운 영상 데이터를 아주 작고 가볍게 포장해서 빠르게 배달해 주는 기술이에요. 덕분에 우리는 웹에서도 텔레비전처럼 선명하고 끊김 없는 영상을 볼 수 있게 되었어요.</p>\n				</div>`
  },
  {
    old: `<p class="event-detail__summary">“드라이버 설치 없이 120fps가 나오네.” 안정화된 WebGPU가 웹에서 게임과 AI를 실행하는 길을 열었습니다.</p>`,
    new: `<p class="event-detail__summary">"웹 브라우저가 슈퍼컴퓨터로 변신했어요!" 웹지피유(WebGPU)라는 강력한 마법 지팡이가 등장했답니다.</p>`
  },
  {
    old: `<div class="event-detail__story">\n					<p>게임 스튜디오 실험실에서 개발자들은 WebGPU 데모를 실행하고, 3D 장면이 초당 120프레임으로 돌아가는 것을 확인했습니다. “드라이버 설치 없이도 이 정도면\n						충분하네요.”라는 말이 나왔습니다.</p>\n					<p>AI 스타트업은 브라우저에서 직접 모델을 실행해, 사용자가 파일을 업로드하지 않아도 실시간 추론 결과를 볼 수 있게 했습니다.</p>\n				</div>`,
    new: `<div class="event-detail__story">\n					<img src="assets/images/story_web-interaction_2023.png" alt="2023년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">\n					<p>어느 날, 게임을 만드는 요정들이 모여 신기한 마법 지팡이를 휘둘렀어요. 그러자 웹 브라우저 안에서 엄청나게 화려하고 빠른 3D 게임이 쌩쌩 돌아가기 시작했죠! "우와, 복잡한 설치 없이도 이렇게 멋진 게임을 할 수 있다니!"</p>\n					<p>이 마법 지팡이의 이름은 '웹지피유'였어요. 이 지팡이 덕분에 똑똑한 인공지능 친구도 웹 브라우저 안으로 쏙 들어와서, 우리가 묻는 말에 척척 대답해 줄 수 있게 되었답니다.</p>\n				</div>`
  },
  {
    old: `<div class="event-detail__notes">\n					<p>WebGPU는 낮은 수준의 GPU API를 제공해 웹에서도 고성능 그래픽과 병렬 계산을 가능하게 했습니다. 이는 브라우저 상호작용을 새로운 층위로 끌어올리며, 실시간 협업과\n						시뮬레이션 서비스에 큰 변화를 주고 있습니다.</p>\n				</div>`,
    new: `<div class="event-detail__notes">\n					<p>웹지피유는 컴퓨터의 숨겨진 힘을 웹 브라우저가 마음껏 쓸 수 있게 해주는 열쇠예요. 이 열쇠 덕분에 앞으로 웹 세상에서는 우리가 상상하는 모든 것이 현실이 될 수 있을 거예요!</p>\n				</div>`
  }
];

let allReplaced = true;
for (let i = 0; i < replacements.length; i++) {
  const r = replacements[i];
  if (content.includes(r.old)) {
    content = content.replace(r.old, r.new);
  } else {
    console.error('Could not find replacement ' + i);
    console.error('Expected:', r.old);
    allReplaced = false;
  }
}

if (allReplaced) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated web-interaction.html');
} else {
  console.log('Failed to update some parts.');
}
