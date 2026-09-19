'use strict';

const assert = require('node:assert/strict');
const { applySelection, presentersForWeek } = require('../scripts/presenter-assign.js');

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS ${name}`);
}

const presenters = presentersForWeek(8);
const topics = ['HTML 파싱과 DOM', 'CSSOM', '렌더 트리와 레이아웃', '페인트와 합성', '렌더링 타이밍과 성능'];

test('defaults to unassigned and keeps a person on only one topic', () => {
  const first = applySelection({}, 'CSSOM', '김유진', presenters, topics);
  assert.equal(first['HTML 파싱과 DOM'], '');
  assert.equal(first.CSSOM, '김유진');
  const moved = applySelection(first, '페인트와 합성', '김유진', presenters, topics);
  assert.equal(moved.CSSOM, '');
  assert.equal(moved['페인트와 합성'], '김유진');
});

test('hides a selected person from remaining capacity by occupying that name', () => {
  const assigned = applySelection(
    { CSSOM: '김유진', 'HTML 파싱과 DOM': '장현규' },
    '렌더 트리와 레이아웃',
    '변진수',
    presenters,
    topics
  );
  const taken = Object.values(assigned).filter(Boolean);
  assert.equal(taken.includes('김태훈'), false);
  assert.equal(new Set(taken).size, 3);
});

test('auto-selects the last remaining person when four are chosen', () => {
  const four = {
    'HTML 파싱과 DOM': '장현규',
    CSSOM: '김유진',
    '렌더 트리와 레이아웃': '김수민',
    '페인트와 합성': '변진수',
    '렌더링 타이밍과 성능': ''
  };
  const filled = applySelection(four, '페인트와 합성', '변진수', presenters, topics);
  assert.equal(filled['렌더링 타이밍과 성능'], '김태훈');
  assert.equal(Object.values(filled).filter(Boolean).length, 5);
});

test('rejects unknown people and topics', () => {
  assert.throws(() => applySelection({}, '없는 주제', '김유진', presenters, topics), /unknown-topic/);
  assert.throws(() => applySelection({}, 'CSSOM', '홍길동', presenters, topics), /unknown-person/);
});

console.log(`presenter-assign: ${passed} cases passed`);
