import test from 'node:test';
import assert from 'node:assert/strict';
import { practicalAreas, practicalUnits, practicalEdition, practicalPlan, normalizePracticalState, practicalProgress } from '../practical-data.js';
import { renderPractical } from '../practical-ui.js';
import { lessons } from '../data.js';

test('Practical course matches all eight areas and twenty-five subitems in the attachment', () => {
  assert.deepEqual(practicalAreas.map(a => a.title), ['공공조달 입찰 참가 준비', '공공조달 입찰계획 수립', '입찰실행 관리', '계약일반 관리', '공급대상물 유형별 계약 관리', '공공조달 리스크 관리', '공공조달 법제도 활용', '전자조달시스템 활용']);
  assert.deepEqual(practicalAreas.map(a => a.units.map(u => u.title)), [
    ['공공조달 참여 준비하기', '입찰자격 정보 관리하기', '경쟁입찰참가자격 신청하기'],
    ['환경분석하기', '조달 수요정보 수집하기', '공급계획 수립하기'],
    ['입찰서류 작성하기', '입찰평가 기준 검증하기', '협상 관리하기'],
    ['계약 체결 관리하기', '계약 이행 관리하기', '계약 변경 관리하기', '계약 종결 관리하기'],
    ['공사계약 관리하기', '물품계약 관리하기', '용역계약 관리하기'],
    ['공급리스크 식별하기', '위험도 평가하기', '리스크 대응계획 수립하기', '리스크 발생 모니터링하기'],
    ['법령 활용하기', '분쟁 대응하기', '우대제도 활용하기'],
    ['전자조달시스템 이용하기', '조달데이터 활용하기']
  ]);
  assert.equal(new Set(practicalUnits.map(u => u.id)).size, 25);
  assert.equal(practicalEdition.minutes, 150);
  assert.equal(practicalEdition.method, '필답형');
  for (const area of practicalAreas) for (const id of area.written) assert.ok(lessons.some(l => l.id === id), id);
});

test('Every subitem has usable teaching, a work product, an independent scenario and three assessment points', () => {
  for (const u of practicalUnits) {
    for (const key of ['concept', 'document', 'pitfall', 'prompt']) assert.ok(u[key].length >= 25, `${u.id}: ${key}`);
    assert.equal(u.steps.length, 3);
    assert.equal(u.answer.length, 3);
    assert.equal(u.checks.length, 3);
    for (const text of [...u.steps, ...u.answer, ...u.checks]) assert.ok(text.length > 12);
  }
  assert.equal(new Set(practicalUnits.map(u => u.prompt)).size, 25);
  assert.deepEqual(practicalPlan.flatMap(p => p.areas), practicalAreas.map(a => a.id));
});

test('Saved practical records reject unknown IDs and invalid check indices without altering written state', () => {
  const old = { completed: ['1-01'], answers: { 403: 1 }, bookmarks: ['q403'] };
  const source = { ...old, practical: { completed: ['p1-1', 'p1-1', 'unknown'], drafts: { 'p1-1': '내 답안', unknown: 'bad', 'p1-2': 7 }, checks: { 'p1-1': [0, 0, 2, -1, 3, '1'], unknown: [0] } } };
  const snapshot = JSON.stringify(source);
  const normalized = normalizePracticalState(source.practical);
  assert.deepEqual(normalized, { completed: ['p1-1'], drafts: { 'p1-1': '내 답안' }, checks: { 'p1-1': [0, 2] } });
  assert.equal(JSON.stringify(source), snapshot);
  assert.deepEqual(source.completed, old.completed);
  for (const value of [null, undefined, 'bad', 42, { completed: {}, drafts: null, checks: null }]) assert.deepEqual(normalizePracticalState(value), { completed: [], drafts: {}, checks: {} });
});

test('Practical progress counts actual writing and explicit completion separately, including area filters', () => {
  const state = { completed: ['p1-1', 'p2-1'], drafts: { 'p1-1': '  ', 'p1-2': '답안' }, checks: { 'p1-2': [0, 1] } };
  assert.deepEqual(practicalProgress(state), { total: 25, completed: 2, written: 1, checked: 2, possible: 75 });
  assert.deepEqual(practicalProgress(state, 1), { total: 3, completed: 1, written: 1, checked: 2, possible: 9 });
});

test('Learning and print views escape stored answers, preserve prerequisites and expose all printable content', () => {
  const attack = '</textarea><img src=x onerror=alert(1)>';
  const data = { practical: { drafts: { 'p1-1': attack } }, writtenLessons: lessons, writtenCompleted: ['1-01'] };
  const overview = renderPractical(data);
  for (const a of practicalAreas) for (const u of a.units) assert.ok(overview.includes(`#practical/${a.id}/${u.id}`));
  const page = renderPractical({ ...data, segment: '1', unitId: 'p1-1' });
  assert.ok(page.includes('&lt;/textarea&gt;&lt;img'));
  assert.ok(!page.includes(attack));
  assert.ok(page.includes('href="#theory/1/1-01"'));
  assert.ok(page.includes('모범답안과 자가점검 펼치기'));
  assert.ok(page.includes('<details class="pr-model">'));
  const print = renderPractical({ ...data, segment: 'print' });
  for (const u of practicalUnits) for (const answer of u.answer) assert.ok(print.includes(answer.replaceAll('>', '&gt;').replaceAll('<', '&lt;').replaceAll('&', '&amp;')) || print.includes(answer));
  assert.ok(print.includes('실기 전체 학습자료'));
  assert.ok(!print.includes('data-pr-draft='));
});
