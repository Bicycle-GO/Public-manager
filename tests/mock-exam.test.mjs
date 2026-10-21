import test from 'node:test';
import assert from 'node:assert/strict';
import { questions } from '../data.js';
import { createMockExam, gradeMockExam, mockFormats } from '../mock-exam.js';

for (const [id, format] of Object.entries(mockFormats)) {
  test(`${id} selects unique four-choice questions in subject order without changing the bank`, () => {
    const before = questions.map(q => q.id);
    for (let round = 0; round < 20; round++) {
      const list = createMockExam(questions, id);
      assert.equal(list.length, format.counts.reduce((a,b)=>a+b,0));
      assert.equal(new Set(list.map(q=>q.id)).size, list.length);
      assert.ok(list.every(q => q.type !== 'ox' && q.options.length === 4));
      assert.deepEqual(list.map(q=>q.subject), format.counts.flatMap((n,i)=>Array(n).fill(i+1)));
    }
    assert.deepEqual(questions.map(q=>q.id), before);
    assert.notDeepEqual(createMockExam(questions,id,()=>0).map(q=>q.id), createMockExam(questions,id,()=>0.99).map(q=>q.id));
  });
}

test('Default exam is 60 questions; duplicate source rows cannot inflate available questions', () => {
  assert.equal(createMockExam(questions).length,60);
  const list = createMockExam([...questions,...questions]);
  assert.equal(new Set(list.map(q=>q.id)).size,60);
  assert.throws(()=>createMockExam(questions.filter(q=>q.subject!==3)), /부족/);
  assert.throws(()=>createMockExam(questions,'unknown'), /유형/);
});

const scoreWith = counts => {
  const list = createMockExam(questions,'official80',()=>0.5);
  const answers = {};
  for (const subject of [1,2,3]) list.filter(q=>q.subject===subject).slice(0,counts[subject-1]).forEach(q=>answers[q.id]=q.answer);
  return gradeMockExam(list,answers);
};

test('Official exam averages subject scores equally, not the 80-question correct ratio', () => {
  const result = scoreWith([12,20,12]);
  assert.deepEqual(result.scores.map(item=>item.score),[40,100,40]);
  assert.equal(result.average,60);
  assert.equal(result.passed,true); // 44 / 80 = 55% is not the subject average.
});

test('A failing subject or an average under 60 prevents passing; unanswered items count as incorrect', () => {
  assert.equal(scoreWith([11,20,30]).passed,false);
  assert.equal(scoreWith([17,12,18]).passed,false);
  assert.equal(scoreWith([18,12,18]).passed,true);
  const empty=scoreWith([0,0,0]);
  assert.equal(empty.average,0);
  assert.equal(empty.passed,false);
  assert.deepEqual(empty.scores.map(item=>item.total),[30,20,30]);
});
