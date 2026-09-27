import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {questions,lessons} from '../data.js';
import {evaluationCoreQuestions as core,evaluationExpectedQuestions as expected,evaluationPracticeQuestions as added} from '../evaluation-questions.js';
import {attachmentEvaluationExample} from '../evaluation-foundations.js';
import {practiceQuestions,questionsByStatus,renderPracticeGroups,renderQuestionContext,renderQuestionExplanation,questionLabel} from '../practice-ui.js';
import {renderLessonGuide} from '../lesson-content.js';
import {renderMaterialTopics} from '../study-ui.js';

test('New core and expected sets append 25 unique IDs without changing any of the original 402 questions',()=>{
 assert.equal(createHash('sha256').update(JSON.stringify(questions.filter(q=>q.id<=402))).digest('hex'),'0c767af787be64834ec289e16e2368c5ed894656b139138895431796644cb27b');
 assert.deepEqual(added.map(q=>q.id),Array.from({length:25},(_,i)=>403+i));
 assert.deepEqual(core.map(q=>q.practiceNumber),Array.from({length:10},(_,i)=>i+1));
 assert.deepEqual(expected.map(q=>q.practiceNumber),Array.from({length:15},(_,i)=>i+1));
 assert.equal(new Set(questions.map(q=>q.id)).size,427);
 assert.equal(practiceQuestions(2,'2-04').length,36);
 assert.equal(practiceQuestions(2,'2-05').length,25);
 assert.equal(practiceQuestions(2).length,135);
 assert.ok(added.every(q=>q.lesson==='2-04'&&q.subject===2&&!q.sourceNumber));
 assert.ok(core.every(q=>q.core&&q.origin.includes('자체 제작')));
 assert.ok(expected.slice(0,7).every(q=>q.adapted&&q.origin.includes('첨부 예상')));
 assert.equal(expected[1].reconstructed,true);
 assert.equal(expected[7].origin.includes('점수표'),true);
 assert.ok(expected.slice(8).every(q=>!q.adapted));
});

test('All 25 new solutions explain every choice, three reasoning steps, fictional cases and memory points after grading',()=>{
 for(const q of added){
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options).size,4);
  assert.equal(q.details.steps.length,3);
  assert.equal(q.details.choices.length,4);
  assert.ok(q.details.steps.every(([title,body])=>title.trim().length>0&&body.trim().length>0));
  assert.ok(q.details.choices.every(c=>c.reason.trim().length>0));
  assert.ok(q.details.example.effects.length>=2);
  const context=renderQuestionContext(q),html=renderQuestionExplanation(q);
  assert.ok(context.includes(questionLabel(q)));
  assert.ok(!context.includes(q.details.takeaway)&&!context.includes(q.details.concept));
  for(const line of q.passage)assert.ok(context.includes(line));
  for(const term of ['단계별 풀이 과정','보기별 해설','가상 사례','기억할 한 문장','해설 참고 자료'])assert.ok(html.includes(term),q.id+' '+term);
  assert.equal((html.match(/class="correct-choice"/g)||[]).length,1);
  assert.ok(!html.includes('undefined')&&!html.includes('chatgpt-content-reference'));
  assert.ok(q.details.sources.every(s=>s?.title&&new URL(s.url).hostname.endsWith('.go.kr')));
 }
});

test('Question groups put core and expected sets before shared questions and retain independent review state',()=>{
 const chapter=lessons.find(l=>l.id==='2-04');
 const row=q=>`<span data-q="${q.id}"></span>`;
 const html=renderPracticeGroups(2,chapter,row);
 for(const q of practiceQuestions(2,'2-04'))assert.equal(html.split(`data-q="${q.id}"`).length-1,1);
 assert.ok(html.indexOf('data-q="403"')<html.indexOf('data-q="413"'));
 assert.ok(html.indexOf('data-q="413"')<html.indexOf('data-q="277"'));
 for(const action of ['start-evaluation-core','start-evaluation-expected','start-evaluation-all'])assert.ok(html.includes(action));
 const state={answers:{403:core[0].answer,413:(expected[0].answer+1)%4,277:2},bookmarks:['q413','q277']};
 const list=practiceQuestions(2,'2-04');
 assert.deepEqual(questionsByStatus(list,state,'wrong').map(q=>q.id),[413]);
 assert.deepEqual(questionsByStatus(list,state,'saved').map(q=>q.id),[277,413]);
 const filtered=renderPracticeGroups(2,chapter,row,questionsByStatus(list,state,'wrong'));
 assert.equal((filtered.match(/data-q=/g)||[]).length,1);
 assert.ok(!filtered.includes('start-evaluation-all'));
 assert.ok(!practiceQuestions(2,'2-05').some(q=>q.id===413));
});

test('Attachment answer keys, threshold boundaries, score rankings and multi-step scenarios are correct',()=>{
 assert.deepEqual(expected.slice(0,7).map(q=>q.answer),[2,0,2,1,3,3,2]);
 assert.deepEqual(expected.slice(7).map(q=>q.answer),[1,3,1,2,0,3,1,2]);
 assert.equal(expected[0].options[expected[0].answer],'68점');
 assert.equal(80*.85,68);
 assert.equal(70*.85,59.5);
 assert.ok(59.5>=70*.85 && 59.4<70*.85);
 const {technicalMaximum,rows}=attachmentEvaluationExample;
 const eligible=rows.filter(([,tech])=>tech>=technicalMaximum*.85);
 assert.deepEqual(eligible.map(([name,tech,price])=>[name,tech+price]),[['A',89],['B',88]]);
 assert.equal(72+17,89);assert.equal(74+13,87);
 assert.ok(expected[14].details.steps[0][1].includes('A 67점은 미달'));
 assert.ok(expected[14].details.steps[1][1].includes('B가 1순위'));
 assert.ok(expected[14].details.steps[2][1].includes('C와 협상'));
});

test('Foundation learning is reachable through theory, question links and material search with source labels',()=>{
 const html=renderLessonGuide(lessons.find(l=>l.id==='2-04'));
 for(const term of ['입찰제안평가 기초 학습','배점한도','80 × 85 ÷ 100','C의 기술은 66점','목적·금액·기간·보증·위험·지체','새 문제 25문항','핵심 10문항','예상 15문항','복원하지 않았습니다'])assert.ok(html.includes(term),term);
 assert.ok(html.indexOf('evaluation-foundations')<html.indexOf('evaluation-study'));
 assert.ok(html.includes('data-id="420"'));
 for(const term of ['가격평가점수','68점 계산','계약서·보증금'])assert.ok(renderMaterialTopics(term).includes('#theory/2/2-04'),term);
});
