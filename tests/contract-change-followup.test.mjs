import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {questions,lessons} from '../data.js';
import {followupQuestions,renderPracticeGroups,renderQuestionContext,renderQuestionExplanation,questionsByStatus} from '../practice-ui.js';
import {renderLessonGuide} from '../lesson-content.js';
import {renderMaterialTopics} from '../study-ui.js';
import {changeFollowupExamples} from '../contract-change-followup-study.js';

const added=questions.filter(q=>q.id>=338 && q.id<=343);

test('Change questions 13–18 append six stable records and preserve the preceding 337 questions',()=>{
  assert.equal(createHash('sha256').update(JSON.stringify(questions.filter(q=>q.id<=337))).digest('hex'),'19a6d72c220c06bd16d78d6a056dc96df93279c1290cfabbc84b993f63a59ae2');
  assert.deepEqual(added.map(q=>q.id),[338,339,340,341,342,343]);
  assert.deepEqual(added.map(q=>q.sourceNumber),[13,14,15,16,17,18]);
  assert.deepEqual(added.map(q=>q.answer),[2,3,1,3,2,2]);
  for(const q of added){
    assert.equal(q.lesson,'3-02');assert.equal(q.collection,'contract-change');
    assert.equal(new Set(q.options).size,4);
    assert.deepEqual(q.details.choices.map(c=>c.title),q.options);
    assert.ok(q.details.steps.length>=3 && q.details.example.effects.length>=2);
    assert.ok(q.details.sources.some(s=>s.url.includes('law.go.kr')));
    const context=renderQuestionContext(q),explanation=renderQuestionExplanation(q);
    assert.ok(!context.includes(q.details.takeaway));
    for(const heading of ['단계별 풀이 과정','보기별 해설','가상 사례','기억할 한 문장'])assert.ok(explanation.includes(heading));
    assert.ok(!explanation.includes('undefined') && !explanation.includes('chatgpt-content-reference'));
  }
  assert.match(added[4].details.concept,/이상/);
  assert.match(added[5].details.concept,/입찰금액/);
});

test('The expanded twenty-five-question launcher and review state keep original and added source numbers together',()=>{
  const list=followupQuestions('contract-change');
  assert.equal(list.length,25);
  const page=renderPracticeGroups(3,lessons.find(l=>l.id==='3-02'),q=>`<b data-q="${q.id}"></b>`);
  assert.ok(page.includes('01~25번') && page.includes('25문항 풀기'));
  assert.ok(!page.includes('12문항 풀기'));
  for(const q of list)assert.equal(page.split(`data-q="${q.id}"`).length-1,1);
  const state={answers:{337:list[11].answer,338:0},bookmarks:['q337','q343']};
  assert.deepEqual(questionsByStatus(list,state,'wrong').map(q=>q.id),[338]);
  assert.deepEqual(questionsByStatus(list,state,'saved').map(q=>q.id),[337,343]);
  assert.equal(questionsByStatus(list,state,'unanswered').length,23);
});

test('Follow-up theory distinguishes weighted price change and all three advance-settlement amounts',()=>{
  const {itemAdjustment,advance,termination,bidBond}=changeFollowupExamples;
  const total=itemAdjustment.reduce((s,x)=>s+x.base,0),delta=itemAdjustment.reduce((s,x)=>s+x.base*x.rate,0);
  assert.equal(delta,8000000);assert.equal(delta/total,.08);
  const settle=advance.paid*advance.progress/advance.contract;
  assert.equal(settle,12000000);assert.equal(advance.progress-settle,28000000);assert.equal(advance.paid-settle,18000000);
  assert.equal(termination.accepted+termination.withdrawal,32000000);
  assert.equal(bidBond.bid*bidBond.rate,10000000);
  const html=renderLessonGuide(lessons.find(l=>l.id==='3-02'));
  for(const term of ['13~18번','25문항','원상회복','7.5%','8%','12,000,000원','28,000,000원','18,000,000원','인정 비용','입찰금액'])assert.ok(html.includes(term),term);
  for(const term of ['품목조정률·지수조정률','미정산 잔액','중간검사','원상회복'])assert.ok(renderMaterialTopics(term).includes('#theory/3/3-02'),term);
  const other=renderLessonGuide(lessons.find(l=>l.id==='3-01'));
  assert.ok(!other.includes('aria-label="계약변경·종결 13~18번 보충 학습"'));
});
