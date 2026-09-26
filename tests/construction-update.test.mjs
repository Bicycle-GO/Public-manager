
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {questions,lessons} from '../data.js';
import {constructionQuestions,constructionSpecialQuestions as special,constructionGeneralQuestions as general} from '../construction-questions.js';
import {constructionExamples,constructionReview} from '../construction-study.js';
import {renderLessonGuide} from '../lesson-content.js';
import {followupQuestions,renderPracticeGroups,renderQuestionContext,renderQuestionExplanation,questionsByStatus} from '../practice-ui.js';
import {renderMaterialTopics} from '../study-ui.js';

test('Construction update preserves all 373 records and separates repeated source numbers',()=>{
 assert.equal(createHash('sha256').update(JSON.stringify(questions.filter(q=>q.id<=373))).digest('hex'),'83ab105f35bcc2d603af2765ad4b305280e84b3f1f8be7b13233a192952e5022');
 assert.deepEqual(constructionQuestions.map(q=>q.id),Array.from({length:29},(_,i)=>374+i));
 assert.deepEqual(special.map(q=>q.sourceNumber),Array.from({length:25},(_,i)=>i+1));
 assert.deepEqual(general.map(q=>q.sourceNumber),[22,23,24,25]);
 assert.deepEqual(special.map(q=>q.answer),[2,3,2,0,1,1,1,2,2,3,0,2,2,3,2,2,1,1,2,1,2,2,2,1,2]);
 assert.deepEqual(general.map(q=>q.answer),[3,1,0,2]);
 assert.equal(followupQuestions('construction-special').length,25);
 assert.equal(followupQuestions('construction-general').length,4);
 assert.ok(special.every(q=>q.lesson==='3-07'));
 assert.ok(general.every(q=>q.lesson==='3-06'));
});
test('All new explanations disclose corrections and keep solutions out of pre-answer context',()=>{
 for(const q of constructionQuestions){
  assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
  assert.deepEqual(q.details.choices.map(c=>c.title),q.options);
  assert.equal(q.details.steps.length,3);assert.ok(q.details.example.effects.length>=2);
  assert.ok(q.details.correction && q.details.sources.length>=2);
  const html=renderQuestionExplanation(q),context=renderQuestionContext(q);
  for(const label of ['단계별 풀이 과정','보기별 해설','가상 사례','기억할 한 문장','원문과 달라진 점'])assert.ok(html.includes(label));
  assert.equal((html.match(/class="correct-choice"/g)||[]).length,1);
  assert.ok(!context.includes(q.details.takeaway));
  assert.ok(!html.includes('undefined')&&!html.includes('chatgpt-content-reference'));
 }
 assert.match(special[1].details.correction,/계약신뢰도/);
 assert.match(special[5].options[1],/낙찰률/);
 assert.match(special[9].details.correction,/복수정답/);
 assert.match(special[16].details.correction,/통계 근거/);
 assert.match(special[18].options[2],/협의/);
 assert.match(special[24].options[2],/3천만원 이상.*30일 초과/);
});
test('Chapter practice, search, and theory expose the correct sets and preserve review states',()=>{
 for(const [id,list,range] of [['3-07',special,'01~25번'],['3-06',general,'22~25번']]){
  const l=lessons.find(x=>x.id===id);
  const html=renderPracticeGroups(3,l,q=>'<b data-q="'+q.id+'"></b>');
  assert.ok(html.includes(range));assert.ok(html.includes(list.length+'문항 풀기'));
  for(const q of list)assert.equal(html.split('data-q="'+q.id+'"').length-1,1);
  const theory=renderLessonGuide(l);assert.ok(theory.includes('data-action="study-section"'));
  assert.ok(!theory.includes('href="#construction-topic-'));
 }
 for(const keyword of ['협의단가','하도급지킴이','SOQ','기술제안입찰'])assert.ok(renderMaterialTopics(keyword).includes('#theory/3/3-07'));
 assert.ok(renderMaterialTopics('실비정산').includes('#theory/3/3-06'));
 assert.ok(renderLessonGuide(lessons.find(l=>l.id==='3-04')).includes('#theory/3/3-07'));
 const state={answers:{374:2,375:0,399:3,351:2},bookmarks:['q375','q399','q351']};
 assert.deepEqual(questionsByStatus(special,state,'wrong').map(q=>q.id),[375]);
 assert.deepEqual(questionsByStatus(general,state,'correct').map(q=>q.id),[399]);
 assert.equal(questionsByStatus(special,state,'unanswered').length,23);
});
test('Worked unit prices and mandatory-payment boundary examples are accurate',()=>{
 const e=constructionExamples;
 assert.equal(e.unit*e.awardRatio,80000);
 const average=(e.unit+e.unit*e.awardRatio)/2;
 assert.equal(average,90000);assert.equal(average*e.quantity,9000000);
 const meets=(amount,days)=>amount>=e.minAmount&&days>e.minDaysExclusive;
 assert.equal(meets(30000000,30),false);assert.equal(meets(30000000,31),true);assert.equal(meets(29000000,60),false);
 const html=renderLessonGuide(lessons.find(l=>l.id==='3-07'));
 for(const v of ['80,000원','90,000원','9,000,000원','원문 정답·문구 검토표'])assert.ok(html.includes(v));
 for(const n of ['17','19','25'])assert.ok(constructionReview.some(row=>row[0]===n));
});
