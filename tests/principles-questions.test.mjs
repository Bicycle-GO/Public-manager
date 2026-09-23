import test from 'node:test';
import assert from 'node:assert/strict';
import { questions } from '../data.js';
import { principlesCoreQuestions } from '../principles-questions.js';
import { findChapter, practiceQuestions, renderPracticeGroups, renderQuestionContext, renderQuestionExplanation } from '../practice-ui.js';

test('Conversation 22–25 adds four stable IDs to chapter 02, preserving chapter 01', () => {
  assert.deepEqual(principlesCoreQuestions.map(q=>q.id),[55,56,57,58]);
  assert.deepEqual(principlesCoreQuestions.map(q=>q.sourceNumber),[22,23,24,25]);
  assert.deepEqual(principlesCoreQuestions.map(q=>q.answer),[3,1,1,1]);
  assert.ok(principlesCoreQuestions.every(q=>q.lesson==='1-02' && q.subject===1 && q.core));
  assert.equal(practiceQuestions(1,'1-02').length,8);
  assert.equal(practiceQuestions(1,'1-01').length,19);
  assert.equal(questions.filter(q=>q.id<=54).length,54);
});

test('Every added question explains the reasoning, all choices, an example and a memory point', () => {
  for(const q of principlesCoreQuestions) {
    const d=q.details;
    assert.equal(d.steps.length,3);
    assert.ok(d.steps.every(([title,body])=>title && body.length>20));
    assert.equal(d.choices.length,4);
    assert.ok(d.choices.every(c=>c.reason.length>25));
    assert.equal(d.example.effects.length,3);
    assert.ok(d.takeaway && d.caution && d.sources.length);
    const html=renderQuestionExplanation(q);
    assert.ok(html.includes('단계별 풀이 과정') && html.includes('보기별 해설'));
    assert.ok(html.includes('이해를 돕는 가상 사례') && html.includes(d.takeaway));
    assert.equal((html.match(/class="correct-choice"/g)||[]).length,1);
    assert.ok(!renderQuestionContext(q).includes(q.explanation));
  }
});

test('Source ambiguities and historical dates are explicit before grading and explained after it', () => {
  const [,law,agencies,efficiency]=principlesCoreQuestions;
  assert.equal(law.passage.length,4);
  assert.match(law.text,/보정/);
  assert.match(law.details.correction,/재정경제부와 조달청/);
  assert.match(law.details.correction,/원문/);
  assert.match(agencies.text,/2026년 조직 통합 이전/);
  assert.match(agencies.details.correction,/1968년/);
  assert.match(agencies.details.caution,/2026년 4월 1일/);
  assert.match(efficiency.passage[0],/210조원으로 가정/);
  assert.match(efficiency.details.steps[1][1],/2조 1,000억원/);
  assert.equal(210*0.01,2.1);
  for(const q of [law,agencies,efficiency]) assert.ok(q.adapted && renderQuestionExplanation(q).includes('원문과 달라진 점'));
});

test('Only chapter 02 exposes its four-question action and keeps ordinary questions after core questions', () => {
  const html=renderPracticeGroups(1,findChapter(1,'1-02'),q=>`<article id="q${q.id}">${q.text}</article>`);
  assert.ok(html.includes('data-action="start-principles"'));
  assert.ok(html.includes('8문항') && html.includes('22~25번'));
  assert.ok(!html.includes('start-overview'));
  const ordinary=practiceQuestions(1,'1-02').find(q=>!q.core);
  assert.ok(html.indexOf('id="q55"')<html.indexOf(`id="q${ordinary.id}"`));
  assert.ok(!renderPracticeGroups(1,findChapter(1,'1-01'),()=> '').includes('start-principles'));
});
