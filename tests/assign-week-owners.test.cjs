'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  getStudyWeek,
  getAssignmentWeek,
  getWeekToFinalize,
  deadlineForWeek,
  presentersForWeek,
  parsePartItems,
  assignWeekOwners,
  fillUnassignedOwners
} = require('../scripts/assign-week-owners.js');
const { formatCountdown } = require('../assets/js/study-week.js');

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS ${name}`);
}

test('week 1 starts Friday 2026-08-07 in Seoul', () => {
  assert.equal(getStudyWeek(new Date('2026-08-06T23:59:59+09:00')), 0);
  assert.equal(getStudyWeek(new Date('2026-08-07T00:00:00+09:00')), 1);
  assert.equal(getStudyWeek(new Date('2026-08-13T23:59:59+09:00')), 1);
});

test('Friday 18:00 KST maps to that calendar week', () => {
  assert.equal(getStudyWeek(new Date('2026-08-14T18:00:00+09:00')), 2);
  assert.equal(getStudyWeek(new Date('2026-09-04T18:00:00+09:00')), 5);
  assert.equal(getStudyWeek(new Date('2026-09-18T18:00:00+09:00')), 7);
  assert.equal(getStudyWeek(new Date('2026-09-25T18:00:00+09:00')), 8);
});

test('assignment stays open until Wednesday 20:00 before that Friday session', () => {
  assert.equal(deadlineForWeek(8).toISOString(), new Date('2026-09-23T20:00:00+09:00').toISOString());
  assert.equal(getAssignmentWeek(new Date('2026-09-16T19:59:59+09:00')), 7);
  assert.equal(getAssignmentWeek(new Date('2026-09-16T20:00:00+09:00')), 8);
  assert.equal(getAssignmentWeek(new Date('2026-09-19T09:00:00+09:00')), 8);
  assert.equal(getAssignmentWeek(new Date('2026-09-23T19:59:59+09:00')), 8);
  assert.equal(getAssignmentWeek(new Date('2026-09-23T20:00:00+09:00')), 9);
  assert.equal(getWeekToFinalize(new Date('2026-09-23T20:05:00+09:00')), 8);
});

test('countdown clock formats remaining time', () => {
  assert.equal(formatCountdown(0), '00:00:00');
  assert.equal(formatCountdown(5 * 1000), '00:00:05');
  assert.equal(formatCountdown(((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000), '2일 03:04:05');
});

test('presenter pool grows from week 4', () => {
  assert.deepEqual(presentersForWeek(3), ['장현규', '김유진', '김수민', '변진수']);
  assert.equal(presentersForWeek(4).length, 5);
  assert.ok(presentersForWeek(4).includes('김태훈'));
});

test('keeps already assigned presenters and fills only empty slots', () => {
  const html = `<th class="week-cell" scope="row"><span>회차</span>07</th>
<td class="parts-cell"><ol class="parts"><li><span class="part-topic">Flexbox</span><span class="part-owner">김유진</span></li><li><span class="part-topic">Grid</span></li><li><span class="part-topic">Position과 Stacking Context</span><span class="part-owner">김수민</span></li><li><span class="part-topic">Overflow와 스크롤 컨테이너</span></li><li><span class="part-topic">반응형 레이아웃</span></li></ol></td>`;
  const result = assignWeekOwners(html, 7, () => 0);
  assert.equal(result.changed, true);
  assert.match(result.html, /<span class="part-topic">Flexbox<\/span><span class="part-owner">김유진<\/span>/);
  assert.match(result.html, /<span class="part-topic">Position과 Stacking Context<\/span><span class="part-owner">김수민<\/span>/);
  assert.equal(result.newlyAssigned.length, 3);
  assert.equal(result.newlyAssigned.some((item) => item.owner === '김유진' || item.owner === '김수민'), false);
});

test('fills only empty slots with leftover people', () => {
  const items = [
    { topic: 'Flexbox', owner: '김유진' },
    { topic: 'Grid', owner: '' },
    { topic: 'Position과 Stacking Context', owner: '김수민' },
    { topic: 'Overflow와 스크롤 컨테이너', owner: '' },
    { topic: '반응형 레이아웃', owner: '' }
  ];
  const assigned = fillUnassignedOwners(items, 7, () => 0);
  assert.equal(assigned[0].owner, '김유진');
  assert.equal(assigned[2].owner, '김수민');
  assert.deepEqual(
    assigned.filter((item) => !['김유진', '김수민'].includes(item.owner)).map((item) => item.owner).sort(),
    ['김태훈', '변진수', '장현규'].sort()
  );
  assert.equal(new Set(assigned.map((item) => item.owner)).size, 5);
});

test('parses both plain topics and existing owner spans', () => {
  const plain = parsePartItems('<li>Grid</li><li>Flexbox</li>');
  assert.deepEqual(plain, [
    { topic: 'Grid', owner: '' },
    { topic: 'Flexbox', owner: '' }
  ]);
  const mixed = parsePartItems(
    '<li><span class="part-topic">Grid</span></li><li><span class="part-topic">Flexbox</span><span class="part-owner">김유진</span></li>'
  );
  assert.equal(mixed[0].owner, '');
  assert.equal(mixed[1].owner, '김유진');
});

test('does not rewrite a fully assigned week', () => {
  const html = `<th class="week-cell" scope="row"><span>회차</span>07</th>
<td class="parts-cell"><ol class="parts"><li><span class="part-topic">Flexbox</span><span class="part-owner">김유진</span></li></ol></td>`;
  const result = assignWeekOwners(html, 7, () => 0);
  assert.equal(result.changed, false);
  assert.equal(result.reason, 'already-assigned');
  assert.equal(result.html, html);
});

test('assigns missing week 8 owners in compact markup', () => {
  const html = `<th class="week-cell" scope="row"><span>회차</span>08</th>
<td class="parts-cell"><ol class="parts"><li>HTML 파싱과 DOM</li><li>CSSOM</li><li>렌더 트리와 레이아웃</li><li>페인트와 합성</li><li>렌더링 타이밍과 성능</li></ol></td>`;
  const result = assignWeekOwners(html, 8, () => 0);
  assert.equal(result.changed, true);
  assert.equal(result.newlyAssigned.length, 5);
  const owners = result.newlyAssigned.map((item) => item.owner).sort();
  assert.deepEqual(owners, ['김수민', '김유진', '김태훈', '변진수', '장현규']);
  assert.match(result.html, /<span class="part-topic">HTML 파싱과 DOM<\/span><span class="part-owner">/);
  assert.equal(result.html.includes('<li>CSSOM</li>'), false);
});

test('leaves other weeks untouched', () => {
  const html = `<th class="week-cell" scope="row"><span>회차</span>07</th>
<ol class="parts"><li>Flexbox</li></ol>
<th class="week-cell" scope="row"><span>회차</span>08</th>
<ol class="parts"><li>HTML 파싱과 DOM</li><li>CSSOM</li><li>렌더 트리와 레이아웃</li><li>페인트와 합성</li><li>렌더링 타이밍과 성능</li></ol>`;
  const result = assignWeekOwners(html, 8, () => 0);
  assert.equal(result.changed, true);
  assert.match(result.html, /<ol class="parts"><li>Flexbox<\/li><\/ol>/);
});

test('out of range weeks are a no-op', () => {
  const html = '<ol class="parts"><li>Grid</li></ol>';
  assert.equal(assignWeekOwners(html, 0).reason, 'out-of-range');
  assert.equal(assignWeekOwners(html, 22).reason, 'out-of-range');
});

test('assignment is idempotent after empty slots are filled', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'roadmap.html'), 'utf8');
  const filled = assignWeekOwners(source, 8, () => 0);
  const again = assignWeekOwners(filled.html, 8, () => 0);
  assert.equal(again.changed, false);
});

test('remote combo choices are kept before random fill', () => {
  const html = `<th class="week-cell" scope="row"><span>회차</span>08</th>
<td class="parts-cell"><ol class="parts"><li>HTML 파싱과 DOM</li><li>CSSOM</li><li>렌더 트리와 레이아웃</li><li>페인트와 합성</li><li>렌더링 타이밍과 성능</li></ol></td>`;
  const result = assignWeekOwners(html, 8, () => 0, { CSSOM: '김유진', 'HTML 파싱과 DOM': '장현규' });
  assert.match(result.html, /<span class="part-topic">HTML 파싱과 DOM<\/span><span class="part-owner">장현규<\/span>/);
  assert.match(result.html, /<span class="part-topic">CSSOM<\/span><span class="part-owner">김유진<\/span>/);
});

test('roadmap includes study-week countdown assets', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'roadmap.html'), 'utf8');
  assert.match(html, /assets\/js\/study-week\.js/);
  assert.match(html, /수요일 20시 자동 배정까지/);
  assert.match(html, /assets\/js\/presenter-select\.js/);
  assert.match(html, /<span class="part-topic">Flexbox<\/span><span class="part-owner">김유진<\/span>/);
});

console.log(`assign-week-owners: ${passed} cases passed`);
