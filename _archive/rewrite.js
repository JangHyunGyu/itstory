const fs = require('fs');
const text = fs.readFileSync('networks.html', 'utf-8');
const updated = text.replace(/<div class="event-detail__story">([\s\S]*?)<\/div>/g, (match) => {
  const img = match.match(/<img[^>]*>/);
  return <div class="event-detail__story">\n\t\t\t\t\t\n\t\t\t\t\t<p>이 시기의 네트워크 기술은 새로운 도전에 직면했습니다. 기존의 방식으로는 해결하기 어려운 문제들이 발생했고, 이를 극복하기 위한 혁신적인 아이디어가 필요했습니다.</p>\n\t\t\t\t\t<p>엔지니어와 연구자들은 끊임없는 실험과 연구를 통해 새로운 프로토콜과 시스템을 개발했습니다. 이러한 노력은 오늘날 우리가 사용하는 안정적이고 빠른 네트워크 환경의 기반이 되었습니다.</p>\n\t\t\t\t</div>;
}).replace(/<div class="event-detail__notes">([\s\S]*?)<\/div>/g, <div class="event-detail__notes">\n\t\t\t\t\t<p>이러한 기술적 진보는 단순한 속도 향상을 넘어, 데이터의 신뢰성과 보안성을 크게 높였습니다. 결과적으로 전 세계가 더욱 긴밀하게 연결되는 계기가 되었습니다.</p>\n\t\t\t\t</div>);
fs.writeFileSync('networks_updated.html', updated);
