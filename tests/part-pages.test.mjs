import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, subjects, questions } from '../data.js';
import { renderPartDirectory, renderCurriculumOutline, renderChapterNavigation } from '../curriculum-ui.js';
import { findChapter, practiceQuestions, renderPracticeGroups, renderQuestionExplanation } from '../practice-ui.js';

test('PART directory and individual outlines keep chapters in their own PART', () => {
  const directory = renderPartDirectory(['1-01']);
  assert.equal((directory.match(/href="#theory\/[123]"/g) || []).length, 3);
  assert.ok(!directory.includes('#theory/1/1-01'));
  for (const subject of subjects) {
    const list = lessons.filter(l => l.subject === subject.id);
    for (const html of [renderCurriculumOutline([], subject.id), renderChapterNavigation(list[0])]) {
      const links = [...html.matchAll(/href="#theory\/(\d)\/(\d-\d{2})"/g)];
      assert.deepEqual(links.map(m => m[2]), list.map(l => l.id));
      assert.ok(links.every(m => Number(m[1]) === subject.id));
    }
  }
});

test('PART routes have no implicit chapter and chapter matching rejects other PARTs', () => {
  assert.equal(findChapter(1), null);
  assert.equal(findChapter(1, 'invalid'), null);
  assert.equal(findChapter(1, '2-01'), null);
  assert.equal(findChapter(1, '1-01').id, '1-01');
  assert.equal(findChapter(1, '1-2').id, '1-05');
});

test('Chapter question lists exclude other chapters and group the new core question first', () => {
  const chapter = findChapter(1, '1-01');
  const list = practiceQuestions(1, chapter.id);
  assert.deepEqual(list.map(q => q.id), [31, 37, ...Array.from({length:17},(_,i)=>38+i)]);
  assert.equal(practiceQuestions(1).length, 29);
  assert.equal(practiceQuestions(2, chapter.id).length, 0);
  const html = renderPracticeGroups(1, chapter, q => `<article id="q${q.id}">${q.text}</article>`);
  assert.ok(html.includes('단원별 핵심문제'));
  assert.ok(html.indexOf('id="q37"') < html.indexOf('id="q31"'));
  assert.ok(!html.includes('#practice/1/1-02'));
});

test('Modern procurement question explains answer 2, all four choices and an illustrative case', () => {
  const q = questions.find(q => q.id === 37);
  assert.equal(q.answer, 1);
  assert.equal(q.lesson, '1-01');
  assert.match(q.options[q.answer], /사회적 기업.*친환경 재생용지/);
  assert.equal(q.details.choices.length, 4);
  const html = renderQuestionExplanation(q);
  assert.ok(html.includes('정답은 ②번'));
  assert.ok(html.includes('시립도서관'));
  assert.ok(html.includes('무조건 위법이라고 단정할 수는 없습니다'));
  assert.ok(html.includes('공정성·적법한 절차'));
  for (const choice of q.details.choices) assert.ok(html.includes(choice.reason));
  for (const source of q.details.sources) assert.equal(new URL(source.url).hostname.replace(/^www\./, ''), 'pps.go.kr');
  const ordinary = questions.find(q => !q.details);
  assert.equal(renderQuestionExplanation(ordinary), `<p>${ordinary.explanation}</p>`);
});
