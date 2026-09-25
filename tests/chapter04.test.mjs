import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { questions, lessons } from '../data.js';
import { chapter04Questions as added } from '../chapter04-questions.js';
import { strategicMemory, strategicQuestionGroups, strategicTopics, strategicLccExample, lccTotal } from '../strategic-procurement.js';
import { strategicQuestions, electronicQuestions, attachmentQuestions, questionLabel, renderPracticeGroups, renderQuestionContext, renderQuestionExplanation, questionsByStatus } from '../practice-ui.js';
import { renderLessonGuide } from '../lesson-content.js';
import { renderMaterialTopics, renderStudyNotes } from '../study-ui.js';

const chapter=lessons.find(l=>l.id==='1-04');
const escaped = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('Chapter 04 appends 25 questions and preserves all previous 126 question records',()=>{
  assert.deepEqual(added.map(q=>q.id),Array.from({length:25},(_,i)=>127+i));
  assert.deepEqual(added.map(q=>q.providedNumber),Array.from({length:25},(_,i)=>i+1));
  assert.deepEqual(added.map(q=>q.answer+1),[3,3,3,1,2,2,4,3,3,3,4,1,2,3,2,3,3,4,3,4,3,3,2,1,3]);
  const prior=questions.filter(q=>q.id<=126);
  assert.equal(createHash('sha256').update(JSON.stringify(prior)).digest('hex'),'c180dfb93741df746268448be39600b5b66f15a03f16fdf17e999f6a0462cb2c');
  assert.equal(new Set(questions.map(q=>q.id)).size,261);
  assert.equal(questions.filter(q=>q.type==='ox').length,20);
  assert.ok(added.every(q=>q.lesson==='1-04' && q.subject===1 && q.type==='multiple' && q.core && q.reconstructed));
});

test('Strategic set has an isolated launch action and renders once per question with status filtering',()=>{
  assert.deepEqual(strategicQuestions(),added);
  assert.equal(electronicQuestions().length,25);
  assert.equal(attachmentQuestions().length,43);
  const html=renderPracticeGroups(1,chapter,q=>`<p data-id="${q.id}">${questionLabel(q)}</p>`);
  assert.ok(html.includes('data-action="start-chapter04"') && html.includes('제공자료 예상문제 · 25문항'));
  assert.ok(!html.includes('start-chapter03') && !html.includes('start-chapter02'));
  for(const q of added) assert.equal(html.split(`data-id="${q.id}"`).length-1,1);
  assert.ok(!renderPracticeGroups(1,lessons.find(l=>l.id==='1-03'),()=> '').includes('start-chapter04'));
  const filtered=renderPracticeGroups(1,chapter,q=>String(q.id),[added[0]]);
  assert.ok(filtered.includes('제공자료 예상문제 · 1문항') && !filtered.includes('start-chapter04'));
  const q=added[16],state={answers:{59:1,102:2,[q.id]:1},bookmarks:['q59','q'+q.id]};
  assert.deepEqual(questionsByStatus(added,state,'wrong'),[q]);
  assert.deepEqual(questionsByStatus(added,state,'saved'),[q]);
  assert.equal(questionsByStatus(added,state,'unanswered').length,24);
  state.answers[q.id]=q.answer;
  assert.equal(questionsByStatus(added,state,'wrong').length,0);
  assert.deepEqual(questionsByStatus(added,state,'correct'),[q]);
  assert.equal(state.answers[59],1);
});

test('Solutions cover four distinct choices and sources, while context exposes only necessary passages',()=>{
  for(const q of added){
    const context=renderQuestionContext(q), explanation=renderQuestionExplanation(q);
    assert.ok(context.includes(questionLabel(q)));
    assert.ok(!context.includes(q.topic) && !context.includes(q.explanation) && !context.includes(q.details.takeaway));
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options).size,4);
    assert.equal(q.details.choices.length,4);
    assert.equal((explanation.match(/class="correct-choice"/g)||[]).length,1);
    assert.ok(explanation.includes(escaped(q.explanation)) && explanation.includes(escaped(q.details.takeaway)));
    assert.ok(explanation.includes('재구성') && explanation.includes('해설 참고 자료'));
    assert.ok(!explanation.includes('undefined'));
    for(const ref of q.details.sources) assert.equal(new URL(ref.url).protocol,'https:');
  }
  for(const n of [18,20,24]){
    assert.equal(added[n-1].passage.length,3);
    for(const line of added[n-1].passage) assert.ok(renderQuestionContext(added[n-1]).includes(escaped(line)));
  }
});

test('Current-law corrections distinguish rates, denominators, designation period, and ministry name',()=>{
  assert.equal(added[10].options[added[10].answer],'1.1% 이상');
  assert.match(added[10].text,/공사를 제외한/);
  assert.equal(added[3].options[added[3].answer],'1%');
  assert.equal(added[16].options[added[16].answer],'3년');
  assert.match(added[16].explanation,/추가 지정.*기간이 끝날 때까지/);
  assert.match(added[16].details.correction,/② 2년.*③ 3년/);
  assert.equal(added[14].options[added[14].answer],'기후에너지환경부');
  assert.match(added[7].options[added[7].answer],/중소기업 물품 구매액의 15%/);
  assert.match(added[1].explanation,/각각의 5%.*공사 구매총액의 3%/);
  assert.match(added[13].explanation,/요건을 충족하는 중견기업/);
  assert.match(added[22].text,/네 보기.*분모가 서로 다르/);
  for(const n of [3,7,11,14,15,17,18,20,21,22,23,24]){
    assert.ok(added[n-1].adapted && added[n-1].details.correction);
    assert.ok(renderQuestionExplanation(added[n-1]).includes('원문과 달라진 점'));
  }
});

test('LCC worked example compares the same five years and the quiz calculation agrees',()=>{
  assert.equal(strategicLccExample.years,5);
  assert.deepEqual(strategicLccExample.alternatives.map(lccTotal),[355,285]);
  assert.equal(lccTotal(strategicLccExample.alternatives[0])-lccTotal(strategicLccExample.alternatives[1]),70);
  assert.match(strategicLccExample.assumption,/성능.*동일.*할인율.*생략/);
  assert.match(added[20].options[added[20].answer],/355만원.*285만원.*70만원/);
});

test('Theory and material search expose strategic concepts without duplicating full paragraphs',()=>{
  const html=renderLessonGuide(chapter);
  assert.equal(strategicQuestionGroups.length,4);
  assert.equal(strategicMemory.length,8);
  for(const term of ['ESG','직접생산','공사용자재','사회적기업','중증장애인','기후에너지환경부','LCC','NEP','중견기업','고의','중소기업 물품 구매액']){
    assert.ok(html.includes(term),term);
    assert.ok(renderMaterialTopics(term).includes('#theory/1/1-04'),term);
  }
  assert.ok(html.includes('1.1%') && html.includes('15%') && html.includes('3년'));
  assert.ok(html.includes('5년 총비용') && html.includes('성능·사용량·비교기간 5년 동일'));
  assert.ok(html.includes('#practice/1/1-04') && html.includes('법령 확인 2026. 9. 24.'));
  assert.ok(!renderLessonGuide(lessons.find(l=>l.id==='1-03')).includes('strategic-procurement'));
  const combined=html+renderStudyNotes(chapter);
  for(const [,body] of strategicTopics) assert.equal(combined.split(escaped(body)).length-1,1);
});
