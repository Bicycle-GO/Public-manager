import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {questions,lessons} from '../data.js';
import {bidQuestions,followupQuestions,questionLabel,renderPracticeGroups,renderQuestionContext,renderQuestionExplanation,questionsByStatus} from '../practice-ui.js';
import {renderLessonGuide} from '../lesson-content.js';
import {renderMaterialTopics} from '../study-ui.js';
import {awardScoreExample,advanceSettlement,delayAmount} from '../bid-followup-study.js';

const added=questions.filter(q=>q.id>=262 && q.id<=300);
const execution=bidQuestions(),award=followupQuestions('award-contract');

test('Thirty-nine additions preserve every previous question record and explicitly skip absent source question 06',()=>{
  assert.equal(createHash('sha256').update(JSON.stringify(questions.filter(q=>q.id<=261))).digest('hex'),'6533bfa4d59c2afbd231290f315d3e02ddb0eb235e3e2615d040976175ab90c6');
  assert.deepEqual(added.map(q=>q.id),Array.from({length:39},(_,i)=>262+i));
  assert.deepEqual(execution.map(q=>q.sourceNumber),Array.from({length:25},(_,i)=>i+1));
  assert.deepEqual(award.map(q=>q.sourceNumber),Array.from({length:25},(_,i)=>i+1).filter(n=>n!==6));
  assert.ok(execution.every(q=>q.subject===2 && q.lesson==='2-03'));
  assert.ok(award.every(q=>q.subject===2 && q.lesson==='2-05'));
});

test('Updated launchers isolate 25 execution and 24 award questions, preserve filters and distinguish repeated source numbers',()=>{
  for(const [id,list,action] of [['2-03',execution,'start-bid-execution'],['2-05',award,'start-followup']]){
    const lesson=lessons.find(l=>l.id===id),html=renderPracticeGroups(2,lesson,q=>`<b data-q="${q.id}"></b>`);
    assert.ok(html.includes(action) && html.includes(`${list.length}문항 풀기`));
    for(const q of list)assert.equal(html.split(`data-q="${q.id}"`).length-1,1);
    const q=list.at(-1),state={answers:{1:0,[q.id]:(q.answer+1)%4},bookmarks:['q1','q'+q.id]};
    assert.deepEqual(questionsByStatus(list,state,'wrong'),[q]);
    assert.deepEqual(questionsByStatus(list,state,'saved'),[q]);
    assert.equal(questionsByStatus(list,state,'unanswered').length,list.length-1);
    assert.ok(!renderPracticeGroups(2,lesson,()=>'', [q]).includes(action));
  }
  assert.notEqual(questionLabel(execution[0]),questionLabel(award[0]));
  const html=renderPracticeGroups(2,lessons.find(l=>l.id==='2-05'),()=> '');
  assert.ok(html.includes('06번') && html.includes('본문이 없어'));
});

test('New solutions cover every option and fictional example without leaking answers; ordering passages remain visible',()=>{
  for(const q of added){
    assert.equal(new Set(q.options).size,4);
    assert.equal(q.details.choices.length,4);
    assert.deepEqual(q.details.choices.map(c=>c.title),q.options);
    assert.ok(q.details.steps.length>=3 && q.details.example.effects.length>=2);
    assert.ok(q.details.sources.some(s=>s.url.includes('.go.kr/')));
    assert.ok(q.details.takeaway && q.details.concept);
    const context=renderQuestionContext(q),explanation=renderQuestionExplanation(q);
    assert.ok(!context.includes(q.topic) && !context.includes(q.details.takeaway));
    for(const line of q.passage||[])assert.ok(context.includes(line));
    assert.equal((explanation.match(/class="correct-choice"/g)||[]).length,1);
    assert.ok(!explanation.includes('undefined') && !explanation.includes('chatgpt-content-reference'));
    for(const label of ['단계별 풀이 과정','보기별 해설','가상 사례','기억할 한 문장'])assert.ok(explanation.includes(label));
  }
  assert.ok(execution.find(q=>q.sourceNumber===15).passage.length===4);
});

test('Official-law corrections address misleading source answers instead of propagating them',()=>{
  const a=n=>award.find(q=>q.sourceNumber===n),e=n=>execution.find(q=>q.sourceNumber===n);
  assert.equal(a(20).answer,2);
  assert.match(a(20).options[2],/70/);
  assert.match(a(20).details.correction,/80:20/);
  assert.match(a(22).options[a(22).answer],/사회적 책임/);
  assert.match(a(23).details.concept,/세부평가항목/);
  assert.ok(a(18).details.correction.includes('88%'));
  assert.equal(e(11).answer,3);
  assert.match(e(11).text,/지방/);
  for(const q of [a(8),a(14),a(17),a(18),a(20),a(22),a(23),e(20),e(21),e(22),e(23),e(25)])assert.ok(q.details.correction);
});

test('Theory has correct worked calculations and the two chapter additions are searchable',()=>{
  assert.equal(awardScoreExample.technicalMaximum*awardScoreExample.qualifyingRatio,59.5);
  assert.equal(advanceSettlement,120000000);
  assert.equal(delayAmount,2500000);
  const html=renderLessonGuide(lessons.find(l=>l.id==='2-05'));
  for(const term of ['59.5점','68점','1억2천만원','1억8천만원','2,500,000','70 : 가격 30','06번','24문항','사회적 책임'])assert.ok(html.includes(term),term);
  for(const [id,terms] of [['2-03',['대리권','RFP','구성원 자격']],['2-05',['선금 정산','동점 처리','70:30','지체상금률']]]){
    for(const term of terms)assert.ok(renderMaterialTopics(term).includes(`#theory/2/${id}`),term);
  }
  assert.ok(!renderLessonGuide(lessons.find(l=>l.id==='2-03')).includes('aria-label="낙찰자 결정 및 계약 핵심정리"'));
});
