import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluationSourceQuestions as added} from '../evaluation-questions.js';
import {evaluationAverageExamples,evaluationReviewTimes,renderEvaluationPrinciples} from '../evaluation-principles.js';
import {lessons} from '../data.js';
import {followupQuestions,practiceQuestions,renderQuestionContext,renderQuestionExplanation,renderPracticeGroups,questionsByStatus,questionLabel} from '../practice-ui.js';
import {renderMaterialTopics} from '../study-ui.js';
const chapter=lessons.find(l=>l.id==='2-04');
test('Evaluation source 01–25 has a dedicated set and one row each alongside ten shared and one original question',()=>{
 assert.deepEqual(added.map(q=>q.id),Array.from({length:25},(_,i)=>403+i));
 assert.deepEqual(added.map(q=>q.sourceNumber),Array.from({length:25},(_,i)=>1+i));
 assert.deepEqual(added.map(q=>q.answer+1),[3,2,2,3,3,3,3,2,3,2,2,2,1,3,3,3,4,3,2,3,3,2,3,3,2]);
 assert.deepEqual(followupQuestions('evaluation-source'),added);
 assert.equal(practiceQuestions(2,'2-04').length,36);
 const html=renderPracticeGroups(2,chapter,q=>`<b data-q="${q.id}"></b>`);
 for(const q of practiceQuestions(2,'2-04'))assert.equal(html.split(`data-q="${q.id}"`).length-1,1);
 assert.equal((html.match(/data-id="evaluation-source"/g)||[]).length,1);
 assert.ok(!html.includes('undefined'));
});
test('New answers retain four rationales, provenance and corrections without exposing solution topics before grading',()=>{
 for(const q of added){
  assert.equal(q.options.length,new Set(q.options).size);
  assert.equal(q.details.choices.length,4);
  assert.equal(q.details.steps.length,3);
  assert.ok(q.details.sources.some(s=>new URL(s.url).hostname.endsWith('.go.kr')));
  assert.ok(q.details.example.situation && q.details.takeaway);
  const before=renderQuestionContext(q),after=renderQuestionExplanation(q);
  assert.ok(before.includes(questionLabel(q)));
  assert.ok(!before.includes(q.topic));
  assert.ok(!before.includes(q.details.concept));
  for(const choice of q.details.choices)assert.ok(after.includes(choice.reason));
  if(q.adapted)assert.ok(after.includes(q.details.correction));
 }
 assert.deepEqual(added.filter(q=>q.reconstructedStem).map(q=>q.sourceNumber),[3,10,16]);
 const q=added[16];
 assert.equal(q.options[q.answer],'12명');
 assert.match(q.text,/국가.*사업금액 70억원.*구축/);
 assert.match(added[19].options[added[19].answer],/종합점수 100점 기준 5점/);
 assert.match(added[11].details.correction,/정답 문구는 바뀌었습니다/);
 assert.match(added[22].text,/미리 배포하지 않은/);
});
test('New question history, wrong answers and bookmarks remain independent from shared conversation numbering',()=>{
 const q=added[0], other=added[1];
 const state={answers:{277:2,[q.id]:(q.answer+1)%4,[other.id]:other.answer},bookmarks:['q403','q277']};
 assert.deepEqual(questionsByStatus(added,state,'wrong'),[q]);
 assert.deepEqual(questionsByStatus(added,state,'saved'),[q]);
 state.answers[q.id]=q.answer;
 assert.equal(questionsByStatus(added,state,'wrong').length,0);
 assert.equal(state.answers[277],2);
 assert.equal(questionsByStatus(added,state,'unanswered').length,23);
});
test('Worked averages remove only the required number of tied extremes and theory exposes scoped exceptions through search',()=>{
 for(const e of evaluationAverageExamples){
  const kept=[...e.scores].sort((a,b)=>a-b).slice(e.exclude,-e.exclude);
  assert.deepEqual(kept,e.kept);
  assert.equal(Number((kept.reduce((a,b)=>a+b,0)/kept.length).toFixed(4)),e.result);
 }
 assert.deepEqual(evaluationReviewTimes.map(r=>r[2]),[60,90,120,150,150,180]);
 const html=renderEvaluationPrinciples();
 for(const phrase of ['일반: 기술+가격 70점 이상','기술점수도 같으면 추첨','180분은 최대 한도가 아닙니다','조사','12명 이상으로 구성'])assert.ok(html.includes(phrase),phrase);
 for(const term of ['제척','사전접촉','검토시간','대형 SW','점수 집계','가격평가 산식'])assert.ok(renderMaterialTopics(term).includes('#theory/2/2-04'),term);
});
