import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {questions,lessons} from '../data.js';
import {evaluationQuestions,evaluationQuestionIds,evaluationThresholds,evaluationScoreRows,evaluationTieExample,questionInChapter,renderEvaluationStudy} from '../evaluation-study.js';
import {practiceQuestions,questionsByStatus,renderPracticeDirectory,renderPracticeGroups,renderPracticeStatus,renderQuestionExplanation} from '../practice-ui.js';
import {renderLessonGuide} from '../lesson-content.js';
import {renderMaterialTopics} from '../study-ui.js';
const chapter=lessons.find(l=>l.id==='2-04');

test('Evaluation chapter keeps its shared records and appends twenty-five source questions without changing existing records',()=>{
 assert.equal(createHash('sha256').update(JSON.stringify(questions.filter(q=>q.id<=402))).digest('hex'),'0c767af787be64834ec289e16e2368c5ed894656b139138895431796644cb27b');
 assert.deepEqual(evaluationQuestions.map(q=>q.sourceNumber),[1,2,7,11,15,16,20,21,22,23]);
 assert.deepEqual(evaluationQuestions.map(q=>q.id),evaluationQuestionIds);
 assert.deepEqual(practiceQuestions(2,'2-04').map(q=>q.id),[15,...evaluationQuestionIds,...Array.from({length:25},(_,i)=>403+i)]);
 assert.equal(practiceQuestions(2,'2-05').length,25);
 assert.equal(practiceQuestions(2).length,135);
 assert.equal(questions.length,427);
 assert.equal(practiceQuestions(1,'2-04').length,0);
 for(const q of evaluationQuestions){
  assert.equal(q,questions.find(record=>record.id===q.id));
  assert.equal(q.lesson,'2-05');
  assert.ok(questionInChapter(q,'2-04') && questionInChapter(q,'2-05'));
  assert.ok(!questionInChapter(q,'3-04'));
 }
});

test('Evaluation status filters use shared answer and bookmark IDs without duplicating rows',()=>{
 const q=evaluationQuestions[0],other=evaluationQuestions[1];
 const state={answers:{[q.id]:q.answer,[other.id]:(other.answer+1)%4},bookmarks:['q'+other.id]};
 const list=practiceQuestions(2,'2-04');
 assert.equal(questionsByStatus(list,state,'unanswered').length,34);
 assert.deepEqual(questionsByStatus(list,state,'correct'),[q]);
 assert.deepEqual(questionsByStatus(list,state,'wrong'),[other]);
 assert.deepEqual(questionsByStatus(list,state,'saved'),[other]);
 for(const status of ['wrong','saved']){
  assert.ok(questionsByStatus(practiceQuestions(2,'2-05'),state,status).includes(other));
  const html=renderPracticeGroups(2,chapter,q=>`<b data-q="${q.id}"></b>`,questionsByStatus(list,state,status));
  assert.equal((html.match(/data-q=/g)||[]).length,1);
  assert.ok(!html.includes('data-action="start-evaluation"'));
 }
 const html=renderPracticeGroups(2,chapter,q=>`<b data-q="${q.id}"></b>`);
 for(const q of list)assert.equal(html.split(`data-q="${q.id}"`).length-1,1);
 assert.match(html,/원래 수록 CHAPTER 05/);
 assert.match(renderPracticeStatus(chapter,state),/정답 <b>1<\/b>/);
 assert.match(renderPracticeDirectory(2,state),/전용 25문항 \+ 기존 1문항 \+ CHAPTER 05 공유 10문항/);
});

test('Evaluation theory distinguishes source coverage and current scoring from mistaken conversation corrections',()=>{
 const html=renderLessonGuide(chapter);
 for(const term of ['70·가격 30','59.5점','68점','76.5점','기술점수 59점','E사가','경미한','위원별·항목별','원문 01~25번 전체를 확인','공식 불복','낙찰·계약'])assert.ok(html.includes(term),term);
 assert.ok(!html.includes('undefined'));
 assert.equal(renderEvaluationStudy({id:'2-05'}),'');
 assert.deepEqual(evaluationThresholds.map(r=>r.threshold),[59.5,68,76.5]);
 assert.deepEqual(evaluationScoreRows.filter(r=>r.eligible).sort((a,b)=>b.total-a.total).map(r=>r.name),['B','A']);
 assert.equal(evaluationScoreRows.find(r=>r.name==='C').eligible,false);
 assert.equal(evaluationTieExample[0].technical+evaluationTieExample[0].price,evaluationTieExample[1].technical+evaluationTieExample[1].price);
 assert.ok(evaluationTieExample[1].majorItem>evaluationTieExample[0].majorItem);
 assert.equal(evaluationQuestions.find(q=>q.sourceNumber===20).answer,2);
});

test('Evaluation search and shared explanations expose concepts, steps, every choice, examples and source corrections',()=>{
 for(const term of ['정량평가','협상적격자','동점 처리','평가자료 보완','결과 분석'])assert.ok(renderMaterialTopics(term).includes('#theory/2/2-04'),term);
 for(const q of evaluationQuestions){
  const html=renderQuestionExplanation(q);
  for(const term of ['단계별 풀이 과정','보기별 해설','가상 사례','기억할 한 문장','해설 참고 자료'])assert.ok(html.includes(term),q.id+': '+term);
  assert.equal(q.details.choices.length,4);
 }
});
