import test from 'node:test';
import assert from 'node:assert/strict';
import { coreQuestions, findCoreQuestion, normalizeCorePractice } from '../practical-core-questions.js';
import { practicalCoreLearning } from '../practical-core-learning.js';
import { practicalExpectedBank, practicalSourceCounts } from '../practical-bank.js';
import { findPracticalChapter } from '../practical-course.js';
import { renderPracticalQuestions } from '../practical-question-ui.js';
import { renderPracticalCourse } from '../practical-course-ui.js';

test('Supplemental questions and theory link only the three chapters supported by supplied captures',()=>{
  assert.equal(coreQuestions.length,12);
  assert.equal(new Set(coreQuestions.map(q=>q.id)).size,12);
  assert.deepEqual([...new Set(coreQuestions.map(q=>q.chapterId))].sort(),['sp2-01','sp2-02','sp3-01']);
  for(const [chapterId,notes] of Object.entries(practicalCoreLearning)) {
    assert.ok(findPracticalChapter(chapterId));
    assert.equal(coreQuestions.filter(q=>q.chapterId===chapterId).length,4);
    for(const id of notes.questions)assert.equal(findCoreQuestion(id)?.chapterId,chapterId);
    const ch=findPracticalChapter(chapterId);
    const page=renderPracticalCourse({segment:'part',unitId:String(ch.part),chapterId});
    assert.ok(page.includes(notes.title));
    for(const id of notes.questions)assert.ok(page.includes('#practice/practical/core/'+id));
  }
  for(const q of coreQuestions) {
    assert.equal(q.answer.length,q.reasons.length,q.id);
    assert.ok(q.answer.length>=3&&q.checks.length>=3,q.id);
    assert.ok(q.concepts.length>=2&&q.blueprint.length>=3,q.id);
    assert.ok(q.sourceNote.includes('캡처'),q.id);
  }
  assert.equal(practicalExpectedBank.length,78);
  assert.deepEqual(practicalSourceCounts,{course:18,unit:25,capture:12,core:12,review:11});
});

test('New answer storage rejects invalid fields while preserving valid answers and checklist indices',()=>{
  const id=coreQuestions[0].id;
  const raw={completed:[id,id,'sp2-01','missing'],drafts:{[id]:'내 풀이','missing':'x'},checks:{[id]:[0,0,1,-1,999,'1']}};
  const before=JSON.stringify(raw);
  assert.deepEqual(normalizeCorePractice(raw),{completed:[id],drafts:{[id]:'내 풀이'},checks:{[id]:[0,1]}});
  assert.equal(JSON.stringify(raw),before);
  for(const value of [null,7,'bad',[],{drafts:null,checks:12,completed:{}}])assert.deepEqual(normalizeCorePractice(value),{completed:[],drafts:{},checks:{}});
  const hostile=JSON.parse('{"drafts":{"__proto__":{"polluted":true}},"checks":{"constructor":[0]},"completed":["__proto__"]}');
  assert.deepEqual(normalizeCorePractice(hostile),{completed:[],drafts:{},checks:{}});
  assert.equal({}.polluted,undefined);
});

test('Core answers render and print escaped with their own state and complete explanations',()=>{
  const q=coreQuestions[0],attack='</textarea><script>bad()</script>';
  const corePractice={completed:[q.id],drafts:{[q.id]:attack},checks:{[q.id]:[0]}};
  const view=renderPracticalQuestions({source:'core',questionId:q.id,corePractice});
  assert.ok(view.includes('data-pq-source="core"')&&view.includes('aria-pressed="true"'));
  assert.ok(view.includes('&lt;/textarea&gt;&lt;script&gt;')&&!view.includes(attack));
  assert.ok(view.includes('답안 작성 순서')&&view.includes('풀이와 작성 이유'));
  const printed=renderPracticalQuestions({source:'print',corePractice});
  assert.ok(printed.includes('&lt;/textarea&gt;')&&!printed.includes(attack));
  assert.ok(!printed.includes('<textarea'));
  for(const item of coreQuestions)assert.ok(printed.includes(item.title)&&printed.includes(item.answer[0]));
  const legacy=renderPracticalQuestions({source:'course',questionId:'sp2-01',corePractice,coursePractice:{drafts:{'sp2-01':'기존 답안'}}});
  assert.ok(legacy.includes('기존 답안')&&!legacy.includes('&lt;/textarea&gt;'));
});

test('Directory totals include new questions without losing chapter filters or legacy links',()=>{
  const html=renderPracticalQuestions();
  assert.equal((html.match(/class="pq-card"/g)||[]).length,78);
  assert.ok(html.includes('data-pq-filter="chapter"'));
  for(const entry of practicalExpectedBank)assert.ok(html.includes(`#practice/practical/${entry.source}/${entry.id}`));
  assert.ok(html.includes('전체 78문제')&&html.includes('핵심 응용문제 12'));
});
