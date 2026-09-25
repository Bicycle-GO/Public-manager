import test from 'node:test';
import assert from 'node:assert/strict';
import { questions, lessons } from '../data.js';
import { chapter03Questions as added } from '../chapter03-questions.js';
import { electronicMemory, electronicQuestionGroups } from '../electronic-procurement.js';
import { electronicQuestions, attachmentQuestions, questionLabel, renderPracticeGroups, renderQuestionContext, renderQuestionExplanation, questionsByStatus } from '../practice-ui.js';
import { renderLessonGuide } from '../lesson-content.js';
import { renderMaterialTopics, renderStudyNotes } from '../study-ui.js';
import { electronicTopics } from '../electronic-procurement.js';

const chapter=lessons.find(l=>l.id==='1-03');

test('Chapter 03 appends 25 distinct questions with the supplied answer positions',()=>{
  assert.deepEqual(added.map(q=>q.id),Array.from({length:25},(_,i)=>102+i));
  assert.deepEqual(added.map(q=>q.providedNumber),Array.from({length:25},(_,i)=>i+1));
  assert.deepEqual(added.map(q=>q.answer+1),[3,4,2,4,2,3,2,3,4,2,3,2,2,4,3,3,2,3,3,3,3,3,2,1,2]);
  assert.equal(questions.filter(q=>q.id<=101).length,101);
  assert.equal(new Set(questions.map(q=>q.id)).size,361);
  assert.ok(added.every(q=>q.lesson==='1-03' && q.subject===1 && q.type==='multiple' && q.core && q.reconstructed));
  assert.ok(added.every(q=>!q.attachmentNumber && !q.sourceNumber));
});

test('New set is isolated from prior attachments and each question appears once in chapter practice',()=>{
  assert.deepEqual(electronicQuestions(),added);
  assert.equal(attachmentQuestions().length,43);
  const html=renderPracticeGroups(1,chapter,q=>`<p data-id="${q.id}">${questionLabel(q)}</p>`);
  assert.ok(html.includes('data-action="start-chapter03"') && html.includes('제공자료 예상문제 · 25문항'));
  assert.ok(!html.includes('start-chapter02'));
  for(const q of added) assert.equal(html.split(`data-id="${q.id}"`).length-1,1);
  assert.ok(!renderPracticeGroups(1,lessons.find(l=>l.id==='1-02'),()=> '').includes('start-chapter03'));
  const filtered=renderPracticeGroups(1,chapter,q=>String(q.id),[added[0]]);
  assert.ok(filtered.includes('제공자료 예상문제 · 1문항') && !filtered.includes('start-chapter03'));
});

test('Pre-answer context conceals explanations while solutions cover every choice and provenance',()=>{
  for(const q of added){
    const context=renderQuestionContext(q), explanation=renderQuestionExplanation(q);
    assert.ok(context.includes(questionLabel(q)));
    assert.ok(!context.includes(q.topic) && !context.includes(q.explanation) && !context.includes(q.details.takeaway));
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options).size,4);
    assert.equal(q.details.choices.length,4);
    assert.equal((explanation.match(/class="correct-choice"/g)||[]).length,1);
    assert.ok(explanation.includes(q.explanation) && explanation.includes(q.details.takeaway));
    assert.ok(explanation.includes('재구성') && explanation.includes('해설 참고 자료'));
    assert.ok(!explanation.includes('undefined'));
    for(const ref of q.details.sources) assert.equal(new URL(ref.url).protocol,'https:');
  }
});

test('Corrections explicitly address platform name, old security, unverified staging, and disclosure scope',()=>{
  for(const n of [2,4,6,11,13,14,15,19,20,22]){
    const q=added[n-1];
    assert.ok(q.adapted && q.details.correction && q.details.sources.length);
    assert.ok(renderQuestionExplanation(q).includes('원문과 달라진 점'));
  }
  assert.match(added[1].details.correction,/UN.*단정하지/);
  assert.match(added[3].details.correction,/2024년 1월 1일 폐지/);
  assert.equal(added[13].options[added[13].answer],'이음장터');
  assert.match(added[13].details.correction,/이용장터.*이음장터/);
  assert.match(added[21].options[added[21].answer],/공개 범위와 시점/);
  assert.match(added[12].explanation,/이미 체결된.*실제 구매 단계/);
  assert.match(added[16].explanation,/관련 특수조건과 업무처리규정/);
});

test('New question answers and bookmarks reuse existing review state independently',()=>{
  const [q,other]=added;
  const state={answers:{1:1,59:1,[q.id]:(q.answer+1)%4},bookmarks:['q59','q'+q.id]};
  assert.deepEqual(questionsByStatus(added,state,'wrong'),[q]);
  assert.deepEqual(questionsByStatus(added,state,'saved'),[q]);
  assert.ok(questionsByStatus(added,state,'unanswered').includes(other));
  state.answers[q.id]=q.answer;
  assert.equal(questionsByStatus(added,state,'wrong').length,0);
  assert.deepEqual(questionsByStatus(added,state,'correct'),[q]);
  assert.equal(state.answers[59],1);
});

test('Theory, related concepts, and materials search cover the four themes and corrections',()=>{
  const html=renderLessonGuide(chapter);
  assert.equal(electronicQuestionGroups.length,4);
  assert.equal(electronicMemory.length,10);
  for(const term of ['Single Window','MAS','벤처나라','혁신장터','디지털서비스몰','이음장터','UNSPSC','목록화','세부품명번호','품명 신설','품목 등록']){
    assert.ok(html.includes(term),term);
    assert.ok(renderMaterialTopics(term).includes('#theory/1/1-03'),term);
  }
  assert.ok(html.includes('분류 8 + 식별 8 = 16자리') && html.includes('10자리'));
  assert.ok(html.includes('드론 30대') && html.includes('가상 업무 사례'));
  assert.ok(html.includes('규격·기술 / 가격의 2단계 경쟁입찰'));
  assert.ok(html.includes('#practice/1/1-03') && html.includes('#theory/3/3-05'));
  assert.ok(!renderLessonGuide(lessons.find(l=>l.id==='1-04')).includes('electronic-procurement'));
  const combined=html+renderStudyNotes(chapter);
  for(const [,body] of electronicTopics) assert.equal(combined.split(body).length-1,1,'Search indexing must not duplicate theory paragraphs');
});
