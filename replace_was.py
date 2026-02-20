import re

with open('c:/workspace/itstory/was.html', 'r', encoding='utf-8') as f:
    html = f.read()

replacements = [
    # Match 0
    """<div class="event-detail__story">
\t\t\t\t\t\t\t\t\t\t<img src="assets/images/story_was_1990.png" alt="1990년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
\t\t\t\t\t\t\t\t\t\t<p>1990년 말, 팀 버너스-리는 연구소의 컴퓨터에 <code>httpd</code>라는 프로그램을 설치하고 동료들에게 시연을 선보였습니다. 웹 브라우저에서 주소를 입력하자, 컴퓨터는 해당 문서를 찾아 화면에 띄워주었습니다. 링크를 클릭하는 것만으로 다른 연구 노트를 바로 확인할 수 있게 되자, 연구실의 게시판은 서로 연결된 거대한 문서 보관소로 탈바꿈했습니다.</p>
\t\t\t\t\t\t\t\t\t\t<p>처음에는 연구소 내부에서만 사용되었지만, 1991년 여름에 프로그램과 설명서가 공개되면서 전 세계의 다른 연구 기관들도 앞다투어 이 서버를 설치하기 시작했습니다. 복잡한 과정 없이 문서를 공유할 수 있다는 사실이 알려지며, 웹 서버는 단순한 실험을 넘어 실제 서비스로 발전할 수 있다는 가능성을 증명했습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 1
    """<div class="event-detail__notes">
\t\t\t\t\t\t\t\t\t\t<p>CERN httpd는 정적인 문서나 폴더 목록을 보여주는 기본적인 기능을 제공하며, 훗날 웹 서버가 더 복잡한 작업을 처리할 수 있는 기반을 마련했습니다. 사용자의 요청을 받아 해석하고 알맞은 결과를 돌려준다는 웹 서버의 핵심적인 역할이 이때 처음으로 확립되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 2
    """<div class="event-detail__story">
\t\t\t\t\t\t\t\t\t\t<img src="assets/images/story_was_1993.png" alt="1993년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
\t\t\t\t\t\t\t\t\t\t<p>초기 웹 브라우저인 모자이크(Mosaic)를 개발한 마크 안드리센과 에릭 빈나는 웹 서버 역시 누구나 쉽게 설치할 수 있어야 한다고 생각했습니다. 1993년 11월, 그들은 누구나 다운로드할 수 있는 공간에 서버 프로그램과 설명서를 공개했습니다. 대학과 커뮤니티의 개발자들은 이를 즉시 설치해 보고, 개선할 점을 활발하게 공유했습니다.</p>
\t\t\t\t\t\t\t\t\t\t<p>NCSA HTTPd는 접속 권한 관리, 기록 남기기, 외부 프로그램 연동 등 실용적인 기능을 기본으로 갖추고 있어 교육 기관은 물론 상업적인 서비스에도 널리 쓰였습니다. 이후 등장한 주요 웹 서버들이 모두 이 프로그램의 코드를 바탕으로 만들어지면서, 웹 서버 기술은 개방적인 협력을 통해 빠르게 발전하기 시작했습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 3
    """<div class="event-detail__notes">
\t\t\t\t\t\t\t\t\t\t<p>누구나 코드를 볼 수 있는 오픈소스 웹 서버가 대중화되면서, 개발자들이 직접 기능을 고치고 추가하는 문화가 자리 잡았습니다. 웹 서버가 기본적인 요청 처리를 전담하고, 그 뒤에서 별도의 프로그램이 복잡한 계산을 맡는 역할 분담 구조가 이때부터 뚜렷해지기 시작했습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 4
    """<div class="event-detail__story">
\t\t\t\t\t\t\t\t\t\t<img src="assets/images/story_was_1995.png" alt="1995년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
\t\t\t\t\t\t\t\t\t\t<p>1995년 초, 기존 웹 서버의 업데이트가 느려지자 개발자들은 직접 패치를 모아 '아파치(Apache)' 그룹을 결성했습니다. 그해 12월에 정식 버전을 발표하며, 필요한 기능만 블록처럼 조립해서 쓸 수 있는 모듈 방식을 선보였습니다. 운영자들은 이 유연한 구조에 열광하며 활발하게 의견을 나누었습니다.</p>
\t\t\t\t\t\t\t\t\t\t<p>보안 통신, 트래픽 분산 등 필수적인 기능들이 모듈 형태로 빠르게 추가되자, 통신사와 포털 사이트들은 아파치를 기본 웹 서버로 채택했습니다. 전 세계 웹 서버의 과반수가 아파치를 사용하게 되면서, 무료로 공개된 소프트웨어도 상업용 제품 못지않게 뛰어나다는 사실이 증명되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 5
    """<div class="event-detail__notes">
\t\t\t\t\t\t\t\t\t\t<p>아파치는 요청을 처리하는 방식을 효율적으로 개선하고, 필요한 기능만 뗐다 붙일 수 있는 모듈 시스템을 도입해 웹 서버의 확장성을 크게 높였습니다. 앞단에는 아파치를 두고, 뒷단에는 실제 비즈니스 로직을 처리하는 서버를 배치하는 구조가 업계의 표준으로 자리 잡는 계기가 되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 6
    """<div class="event-detail__story">
\t\t\t\t\t\t\t\t\t\t<img src="assets/images/story_was_1994.png" alt="1994년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
\t\t\t\t\t\t\t\t\t\t<p>1994년, 넷스케이프의 엔지니어들은 인터넷 통신을 암호화하는 SSL 기술을 개발하고 브라우저 주소창에 <code>https://</code>를 도입했습니다. 시연 과정에서 주소창에 자물쇠 아이콘이 나타났고, 사용자와 서버가 주고받는 모든 데이터가 안전하게 암호화되어 전송되는 것을 눈으로 확인할 수 있었습니다.</p>
\t\t\t\t\t\t\t\t\t\t<p>온라인 쇼핑몰을 준비하던 기업들은 고객의 신용카드 정보를 안전하게 보호할 수 있게 되자 본격적으로 웹 결제 시스템을 도입하기 시작했습니다. 금융권과 결제 회사들은 믿을 수 있는 인증 체계를 구축하며 안전한 전자상거래의 토대를 마련했습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 7
    """<div class="event-detail__notes">
\t\t\t\t\t\t\t\t\t\t<p>SSL은 인터넷 통신에 암호화와 데이터 위변조 방지, 서버 신원 확인 기능을 더해 보안을 크게 강화했습니다. 이 기술은 오늘날 우리가 매일 사용하는 HTTPS의 기반이 되었으며, 웹 서버가 암호화 처리를 전담하게 되면서 뒷단의 애플리케이션 서버는 복잡한 보안 로직 없이 데이터 처리에만 집중할 수 있게 되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 8
    """<div class="event-detail__story">
\t\t\t\t\t\t\t\t\t\t<img src="assets/images/story_was_1996.png" alt="1996년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
\t\t\t\t\t\t\t\t\t\t<p>1996년, 아파치 개발팀은 다른 서버로 요청을 대신 전달해 주는 '프록시(Proxy)' 기능을 추가했습니다. 서버 관리자는 설정 파일에 단 몇 줄을 적어 넣는 것만으로, 사용자의 요청을 뒷단에 있는 다른 서버로 자연스럽게 넘겨줄 수 있게 되었습니다.</p>
\t\t\t\t\t\t\t\t\t\t<p>웹 호스팅 업체들은 이미지나 텍스트 같은 단순한 파일은 앞단의 아파치가 바로 처리하고, 복잡한 계산이 필요한 요청만 뒷단의 서버로 보내는 방식을 빠르게 도입했습니다. 덕분에 보안 검사나 데이터 임시 저장(캐싱) 같은 작업도 앞단에서 한 번에 효율적으로 관리할 수 있게 되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 9
    """<div class="event-detail__notes">
\t\t\t\t\t\t\t\t\t\t<p>프록시 기능의 도입으로 웹 서버가 사용자의 요청을 받아 적절한 뒷단 서버로 분배하는 '리버스 프록시' 역할이 보편화되었습니다. 이로 인해 사용자와 직접 맞닿는 프론트 웹 서버와 실제 비즈니스 로직을 처리하는 백엔드 애플리케이션 서버를 분리하는 현대적인 웹 아키텍처가 실무의 표준으로 자리 잡았습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 10
    """<div class="event-detail__story">
\t\t\t\t\t\t\t\t\t\t<img src="assets/images/story_was_1998.png" alt="1998년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
\t\t\t\t\t\t\t\t\t\t<p>1998년 5월, 장원송이라는 개발자는 리눅스 운영체제를 활용해 여러 대의 서버로 트래픽을 골고루 나눠주는 기술을 공개했습니다. 평범한 PC 한 대가 수천 건의 접속 요청을 받아 뒤에 있는 여러 대의 서버로 원활하게 분산시키는 데 성공한 것입니다.</p>
\t\t\t\t\t\t\t\t\t\t<p>기업들은 비싼 전용 장비를 사는 대신, 저렴한 리눅스 컴퓨터 여러 대를 묶어 서버가 다운되지 않도록 안정적인 시스템을 구축하기 시작했습니다. 여기에 서버에 문제가 생기면 자동으로 다른 서버로 연결해 주는 도구들이 더해지면서, 중단 없는 서비스 운영이 훨씬 쉬워졌습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 11
    """<div class="event-detail__notes">
\t\t\t\t\t\t\t\t\t\t<p>LVS는 네트워크 단계에서 접속 요청을 효율적으로 분산시키고, 특정 사용자가 항상 같은 서버에 접속하도록 유지하는 기능을 제공했습니다. 덕분에 서버를 여러 대로 늘려도 사용자는 끊김 없이 서비스를 이용할 수 있었으며, 이는 훗날 등장하는 다양한 로드밸런싱 기술의 중요한 밑거름이 되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 12
    """<div class="event-detail__story">
\t\t\t\t\t\t\t\t\t\t<img src="assets/images/story_was_1997.png" alt="1997년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
\t\t\t\t\t\t\t\t\t\t<p>초기 웹은 사용자가 누구인지 기억하지 못하는 구조였습니다. 이를 해결하기 위해 자바(Java) 진영에서는 '세션(Session)'이라는 개념을 도입했습니다. 개발자가 "장바구니에 상품 추가" 같은 명령을 내리면, 서버가 알아서 사용자를 식별하고 정보를 유지해 주는 방식이었습니다.</p>
\t\t\t\t\t\t\t\t\t\t<p>은행이나 쇼핑몰은 이 기술을 활용해 로그인 상태나 장바구니 정보를 안전하게 보관할 수 있게 되었습니다. 개발자들은 복잡한 사용자 식별 과정을 직접 구현할 필요가 없어졌고, 접속자가 크게 늘어나도 서버가 안정적으로 상태를 유지해 주어 서비스 품질이 크게 향상되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 13
    """<div class="event-detail__notes">
\t\t\t\t\t\t\t\t\t\t<p>세션 기술은 쿠키를 활용해 사용자를 식별하고 데이터를 유지하는 표준적인 방법을 제시했습니다. 이후 다양한 프로그래밍 언어와 프레임워크들이 이 방식을 채택하면서, 웹 서버가 사용자의 상태 관리를 책임지고 프론트엔드는 식별표(쿠키)만 전달하는 효율적인 구조가 널리 퍼지게 되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 14
    """<div class="event-detail__story">
\t\t\t\t\t\t\t\t\t\t<img src="assets/images/story_was_2005.png" alt="2005년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
\t\t\t\t\t\t\t\t\t\t<p>2003년 한 블로그 서비스에서 시작된 Memcached는 2005년에 대중에게 공개되었습니다. 이 기술은 컴퓨터의 아주 빠른 임시 저장소(메모리)를 여러 서버가 함께 쓸 수 있게 해 주었습니다. 많은 웹 서비스들이 자주 찾는 데이터나 로그인 정보를 이곳에 저장해 데이터베이스의 부담을 크게 줄였습니다.</p>
\t\t\t\t\t\t\t\t\t\t<p>이후 플리커, 유튜브, 페이스북 같은 대형 서비스들이 이 기술을 활용해 엄청난 트래픽을 감당하는 사례를 공유했습니다. 데이터를 외부의 빠른 저장소에 따로 보관하게 되면서, 사용자가 어느 서버에 접속하든 항상 같은 정보를 빠르게 받아볼 수 있는 분산 처리 환경이 대규모 서비스의 기본이 되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 15
    """<div class="event-detail__notes">
\t\t\t\t\t\t\t\t\t\t<p>Memcached는 네트워크를 통해 여러 서버가 하나의 거대한 메모리를 공유하는 것과 같은 효과를 냅니다. 자주 사용하는 데이터를 이곳에 보관하면 데이터베이스를 매번 조회할 필요가 없어 속도가 빨라지고, 서버를 여러 대로 늘려도 데이터의 일관성을 쉽게 유지할 수 있습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 16
    """<div class="event-detail__story">
\t\t\t\t\t\t\t\t\t\t<img src="assets/images/story_was_1997.png" alt="1997년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
\t\t\t\t\t\t\t\t\t\t<p>자바 개발자 회의에서 웹 요청을 처리하는 새로운 표준 방식이 소개되었습니다. 사용자가 웹 페이지에서 정보를 입력하고 전송 버튼을 누르면, 서버의 프로그램이 그 데이터를 읽어 들여 새로운 결과 화면을 만들어내는 과정이 시연되었습니다.</p>
\t\t\t\t\t\t\t\t\t\t<p>은행과 공공기관들은 수많은 접속자의 요청을 일관된 규칙으로 안전하게 처리할 수 있다는 점에 주목하여 이 기술의 도입을 적극적으로 검토했습니다. 이를 계기로 자바 생태계는 기업용 웹 서버 시장을 주도할 수 있는 강력한 기술적 기반을 다지게 되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 17
    """<div class="event-detail__notes">
\t\t\t\t\t\t\t\t\t\t<p>서블릿(Servlet) 규격은 웹 요청과 응답을 다루는 표준화된 방법을 정의했습니다. 덕분에 개발자는 어떤 회사의 서버를 쓰든 동일한 코드로 프로그램을 만들 수 있었고, 서버 제조사들은 보안이나 동시 접속 처리 같은 기반 기술에 집중할 수 있게 되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 18
    """<div class="event-detail__story">
\t\t\t\t\t\t\t\t\t\t<img src="assets/images/story_was_1999.png" alt="1999년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
\t\t\t\t\t\t\t\t\t\t<p>1999년 자바 개발자 행사에서 한 개발자가 노트북으로 간단한 명령어를 실행했습니다. 화면에 귀여운 고양이 로고가 나타나고, 곧이어 웹 브라우저에 동적으로 생성된 페이지가 뜨자 사람들은 환호했습니다. 복잡한 설정 없이 웹 서버가 바로 구동되는 순간이었습니다.</p>
\t\t\t\t\t\t\t\t\t\t<p>이 기술을 주도하던 썬 마이크로시스템즈는 기술의 대중화를 위해 이 '톰캣(Tomcat)'이라는 프로그램의 코드를 무료로 공개했습니다. 개발자들은 톰캣을 다운로드하고 폴더에 파일 하나만 복사해 넣으면, 누구나 쉽게 자신만의 웹 애플리케이션을 인터넷에 서비스할 수 있게 되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 19
    """<div class="event-detail__notes">
\t\t\t\t\t\t\t\t\t\t<p>톰캣은 웹 서버와 애플리케이션 실행 환경을 하나로 통합하여 개발과 테스트를 매우 편리하게 만들었습니다. 개발 환경과 실제 서비스 환경을 똑같이 맞출 수 있어 오류를 줄이는 데 큰 도움이 되었으며, 자바 기반 웹 개발의 사실상 표준으로 자리 잡았습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 20
    """<div class="event-detail__story">
\t\t\t\t\t\t\t\t\t\t<img src="assets/images/story_was_2003.png" alt="2003년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
\t\t\t\t\t\t\t\t\t\t<p>2003년, 로드 존슨은 기존의 기업용 자바 기술이 너무 무겁고 복잡하다는 점을 지적하며 '스프링(Spring)'이라는 새로운 뼈대(프레임워크)를 발표했습니다. 그는 복잡한 서버 환경 없이도 프로그램의 핵심 기능들이 잘 작동하는지 쉽게 테스트할 수 있는 방법을 시연해 보였습니다.</p>
\t\t\t\t\t\t\t\t\t\t<p>기업의 개발팀들은 이 가볍고 유연한 기술에 큰 매력을 느꼈습니다. 기존의 무거운 시스템을 걷어내고, 핵심 비즈니스 로직에만 집중할 수 있는 스프링 기반의 개발 방식으로 빠르게 전환하기 시작했습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 21
    """<div class="event-detail__notes">
\t\t\t\t\t\t\t\t\t\t<p>스프링은 프로그램의 각 부품을 유연하게 조립하고, 데이터베이스 연결이나 보안 같은 공통적인 작업을 알아서 처리해 주는 기능을 제공했습니다. 덕분에 개발자들은 복잡한 기반 기술에 신경 쓰지 않고 서비스의 핵심 기능 구현에만 집중할 수 있게 되었으며, 프로그램의 확장과 유지보수도 훨씬 쉬워졌습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 22
    """<div class="event-detail__story">
\t\t\t\t\t\t\t\t\t\t<img src="assets/images/story_was_2011.png" alt="2011년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
\t\t\t\t\t\t\t\t\t\t<p>2011년 4월, 개발자 이고르 시소예프는 '엔진엑스(Nginx)'라는 새로운 웹 서버의 정식 버전을 발표했습니다. 성능 테스트 결과, 이 서버는 아주 적은 컴퓨터 자원만으로도 수만 명의 동시 접속을 거뜬히 처리해 내는 놀라운 효율성을 보여주었습니다.</p>
\t\t\t\t\t\t\t\t\t\t<p>빠르게 성장하는 스타트업들은 이미지나 영상 같은 파일은 엔진엑스가 직접 처리하게 하고, 복잡한 데이터 처리는 뒷단의 서버로 넘기는 방식을 채택했습니다. 설정 파일 몇 줄만으로 트래픽을 분산시키고 데이터를 임시 저장할 수 있어, 적은 수의 서버로도 엄청난 사용자를 감당할 수 있었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 23
    """<div class="event-detail__notes">
\t\t\t\t\t\t\t\t\t\t<p>엔진엑스는 접속 요청이 들어올 때마다 새로운 작업 공간을 만드는 대신, 하나의 작업 공간에서 여러 요청을 동시에 효율적으로 처리하는 방식을 사용했습니다. 이 가볍고 빠른 특성 덕분에 현대의 복잡한 웹 서비스 아키텍처에서 트래픽을 분배하는 핵심적인 역할을 맡게 되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 24
    """<div class="event-detail__story">
\t\t\t\t\t\t\t\t\t\t<img src="assets/images/story_was_2014.png" alt="2014년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
\t\t\t\t\t\t\t\t\t\t<p>2014년, 한 개발자 행사에서 발표자가 명령어 한 줄을 입력하자 텅 빈 프로젝트가 생성되었고, 이를 실행하자 단 몇 초 만에 웹 서버가 구동되었습니다. 과거에는 수많은 설정 파일을 작성해야 했던 복잡한 과정이 완전히 생략된 것을 보고 관객들은 감탄했습니다.</p>
\t\t\t\t\t\t\t\t\t\t<p>개발팀은 이제 복잡한 설정 대신 꼭 필요한 옵션 몇 가지만 적어 넣고, 완성된 프로그램을 하나의 파일로 묶어 쉽게 배포할 수 있게 되었습니다. 거대한 시스템을 여러 개의 작은 서비스로 쪼개어 관리하는 최신 개발 트렌드에 완벽하게 들어맞는 도구였습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 25
    """<div class="event-detail__notes">
\t\t\t\t\t\t\t\t\t\t<p>스프링 부트(Spring Boot)는 자주 사용하는 설정들을 미리 세팅해 두고, 웹 서버까지 프로그램 안에 내장시켜 배포 과정을 극도로 단순화했습니다. 덕분에 개발자들은 인프라 설정에 들이는 시간을 줄이고, 작고 독립적인 서비스를 빠르게 개발하고 배포하는 데 집중할 수 있게 되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 26
    """<div class="event-detail__story">
\t\t\t\t\t\t\t\t\t\t<img src="assets/images/story_was_2014.png" alt="2014년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
\t\t\t\t\t\t\t\t\t\t<p>2014년 아마존 웹 서비스(AWS) 행사에서, 서버를 미리 준비하거나 관리할 필요가 전혀 없는 새로운 실행 환경인 '람다(Lambda)'가 소개되었습니다. 화면에 짧은 코드를 입력하고 저장하자 즉시 웹 주소가 만들어졌고, 누군가 그 주소로 접속할 때만 코드가 실행되는 모습이 시연되었습니다.</p>
\t\t\t\t\t\t\t\t\t\t<p>스타트업들은 로그인 처리나 이미지 크기 변환 같은 특정 기능들을 람다로 옮겨 서버 관리의 부담을 덜어냈습니다. 프로그램은 점점 더 작은 단위로 쪼개졌고, 서버를 켜둔 시간이 아니라 코드가 실제로 실행된 시간만큼만 비용을 내면 되어 경제적이었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 27
    """<div class="event-detail__notes">
\t\t\t\t\t\t\t\t\t\t<p>서버리스(Serverless) 모델은 트래픽이 몰리면 자동으로 처리 용량을 늘려주고, 사용자가 없을 때는 비용이 발생하지 않아 운영 효율을 극대화했습니다. 개발자는 서버의 운영체제나 네트워크 설정 등을 전혀 신경 쓸 필요 없이, 오직 서비스의 핵심 로직을 작성하는 데만 집중할 수 있게 되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 28
    """<div class="event-detail__story">
\t\t\t\t\t\t\t\t\t\t<img src="assets/images/story_was_2015.png" alt="2015년의 이야기 그림" class="story-image" style="width:100%; border-radius:8px; margin-bottom:1rem;">
\t\t\t\t\t\t\t\t\t\t<p>2015년 가을, 쿠버네티스(Kubernetes) 개발팀은 복잡한 네트워크 설정을 간단한 문서 몇 줄로 해결할 수 있는 '인그레스(Ingress)' 기능을 발표했습니다. 시연 화면에서 접속 주소 규칙을 하나 추가하자, 시스템이 알아서 사용자의 요청을 알맞은 서비스로 정확하게 연결해 주었습니다.</p>
\t\t\t\t\t\t\t\t\t\t<p>운영팀은 수많은 프로그램의 네트워크 연결을 일일이 설정하던 고된 작업에서 해방되었습니다. 이제는 프로그램 코드를 업데이트할 때 네트워크 연결 규칙도 함께 문서 형태로 작성하여 배포하면, 시스템이 전체적인 트래픽 흐름을 자동으로 관리해 주는 시대가 열렸습니다.</p>
\t\t\t\t\t\t\t\t\t</div>""",
    # Match 29
    """<div class="event-detail__notes">
\t\t\t\t\t\t\t\t\t\t<p>인그레스는 외부에서 들어오는 접속 요청을 클러스터 내부의 적절한 서비스로 연결해 주는 똑똑한 문지기 역할을 합니다. 보안 통신(HTTPS) 처리나 도메인 기반의 트래픽 분배 같은 복잡한 네트워크 관리를 표준화된 방식으로 쉽게 설정할 수 있게 해 주어, 현대적인 클라우드 환경의 필수 요소가 되었습니다.</p>
\t\t\t\t\t\t\t\t\t</div>"""
]

matches = re.findall(r'<div class="event-detail__(?:story|notes)">.*?</div>', html, re.DOTALL)

if len(matches) != len(replacements):
    print(f"Error: Found {len(matches)} matches but have {len(replacements)} replacements.")
else:
    for i in range(len(matches)):
        html = html.replace(matches[i], replacements[i])
    
    with open('c:/workspace/itstory/was.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Successfully replaced all matches.")
