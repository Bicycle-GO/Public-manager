import test from 'node:test';
import assert from 'node:assert/strict';
import { renderTheoryHub, renderMockHub, renderCourseTabs, resolveCourseRoute } from '../learning-hubs.js';
import { practicalExamBank, practicalMockFormats, practicalExamQuestion, createPracticalAttempt, submitPracticalAttempt, practicalTimeRemaining, normalizePracticalExams, gradePracticalSelfCheck } from '../practical-mock.js';
import { renderPracticalMock } from '../practical-mock-ui.js';

test('Theory and mock exam hubs separate written and practical learning with working destination tabs',()=>{
  const theory=renderTheoryHub(3,4), mock=renderMockHub(2,3);
  for(const [html,section] of [[theory,'theory'],[mock,'mock']])for(const mode of ['written','practical'])assert.ok(html.includes(`href="#${section}/${mode}"`));
  assert.ok(theory.includes('필기 기본이론')&&theory.includes('실기 기본이론'));
  assert.ok(theory.includes('3/18')&&theory.includes('4/18'));
  assert.ok(mock.includes('필기 모의고사')&&mock.includes('실기 모의고사'));
  assert.ok(renderCourseTabs('theory','practical').includes('href="#theory/practical" aria-current="page"'));
  assert.ok(renderMockHub(0,0,createPracticalAttempt()).includes('#mock/practical/run'));
});

test('Existing chapter and practical links resolve without losing saved record identifiers',()=>{
  assert.deepEqual(resolveCourseRoute('#theory'),{page:'theory',mode:'hub'});
  assert.deepEqual(resolveCourseRoute('#theory/written'),{page:'theory',mode:'written'});
  assert.deepEqual(resolveCourseRoute('#theory/1/1-01'),{page:'theory',mode:'written',subjectId:'1',lessonId:'1-01'});
  assert.deepEqual(resolveCourseRoute('#practical/4/p4-3'),{page:'practice',mode:'practical',source:'unit',questionId:'p4-3',canonical:'#practice/practical/unit/p4-3'});
  assert.equal(resolveCourseRoute('#practical').canonical,'#theory/practical');
  assert.equal(resolveCourseRoute('#practical/print').canonical,'#practice/practical/print');
  assert.equal(resolveCourseRoute('#practical/questions/cap-cost-01').page,'practice');
  assert.deepEqual(resolveCourseRoute('#mock/practical/result/test-record'),{page:'mock',mode:'practical',view:'result',resultId:'test-record'});
  assert.equal(resolveCourseRoute('#theory/practical/questions/cap-data-03').canonical,'#practice/practical/capture/cap-data-03');
});

test('Comprehensive practical exams cover eight areas and include calculations without mutating the bank',()=>{
  const before=JSON.stringify(practicalExamBank);
  for(let i=0;i<15;i++){
    const attempt=createPracticalAttempt('comprehensive8');
    assert.equal(attempt.questionIds.length,8);
    assert.equal(new Set(attempt.questionIds).size,8);
    const items=attempt.questionIds.map(practicalExamQuestion);
    assert.deepEqual(items.map(q=>q.areaId),[1,2,3,4,5,6,7,8]);
    assert.ok(items.filter(q=>q.calculation).length>=2);
    assert.equal(attempt.deadline-attempt.startedAt,150*60000);
  }
  assert.equal(JSON.stringify(practicalExamBank),before);
  assert.throws(()=>createPracticalAttempt('bad'),RangeError);
});

test('Capture practice uses all twelve questions exactly once with the original mix of types',()=>{
  const attempt=createPracticalAttempt('capture12');
  assert.equal(attempt.questionIds.length,12);
  assert.equal(new Set(attempt.questionIds).size,12);
  assert.ok(attempt.questionIds.every(id=>id.startsWith('capture:')));
  assert.deepEqual(attempt.questionIds.map(practicalExamQuestion).reduce((r,q)=>(r[q.kind]=(r[q.kind]||0)+1,r),{}),{'계산형':5,'서술형':4,'괄호형':2,'단답형':1});
  assert.equal(practicalMockFormats.capture12.minutes,150);
});

test('Deadline calculations survive reload and submitted answers are copied and isolated from active edits',()=>{
  const active=createPracticalAttempt('comprehensive8',()=>.5,1000000);
  active.answers[active.questionIds[0]]='계산 과정';
  assert.equal(practicalTimeRemaining(active,active.deadline-1),1);
  assert.equal(practicalTimeRemaining(active,active.deadline),0);
  assert.equal(practicalTimeRemaining(active,active.deadline+1000),0);
  const restored=normalizePracticalExams({active,history:[]}).active;
  assert.deepEqual(restored,active);
  const result=submitPracticalAttempt(active,'timeout',active.deadline);
  active.answers[active.questionIds[0]]='수정';
  assert.equal(result.answers[result.questionIds[0]],'계산 과정');
  assert.equal(result.reason,'timeout');
});

test('Self-check scores require explicit review, keep equal question weights and force blank answers to zero',()=>{
  const attempt=createPracticalAttempt('capture12');
  const result=submitPracticalAttempt(attempt);
  assert.equal(gradePracticalSelfCheck(result).score,0);
  for(const id of result.questionIds){
    result.answers[id]='내 답안';
    result.checks[id]=practicalExamQuestion(id).checks.map((_,i)=>i);
  }
  assert.equal(gradePracticalSelfCheck(result).score,0);
  assert.equal(gradePracticalSelfCheck(result).complete,false);
  result.reviewed=[...result.questionIds];
  assert.equal(gradePracticalSelfCheck(result).score,100);
  assert.equal(gradePracticalSelfCheck(result).complete,true);
  result.answers[result.questionIds[0]]='   ';
  const grade=gradePracticalSelfCheck(result);
  assert.equal(grade.score,91.7);
  assert.equal(grade.answered,11);
  assert.equal(grade.rows[0].score,0);
});

test('Saved exam data rejects invalid references, duplicate questions and invalid checklist indices',()=>{
  const a=createPracticalAttempt(), r=submitPracticalAttempt(a);
  r.answers[a.questionIds[0]]='답';
  r.checks[a.questionIds[0]]=[0,0,-1,999,'1'];
  r.reviewed=[a.questionIds[0],'unknown'];
  const saved=normalizePracticalExams({active:{...a,questionIds:Array(8).fill('unknown')},history:[r,r,{bad:true}]});
  assert.equal(saved.active,null);
  assert.equal(saved.history.length,1);
  assert.deepEqual(saved.history[0].checks[a.questionIds[0]],[0]);
  assert.deepEqual(saved.history[0].reviewed,[a.questionIds[0]]);
  for(const value of [null,'bad',42])assert.deepEqual(normalizePracticalExams(value),{active:null,history:[]});
});

test('Practical exam does not render solutions before submission and safely restores typed answers',()=>{
  const active=createPracticalAttempt('capture12');
  const id=active.questionIds[0];
  active.answers[id]='</textarea><script>window.injected=true</script>';
  const run=renderPracticalMock({state:{active,history:[]},view:'run'});
  assert.ok(run.includes('&lt;/textarea&gt;&lt;script&gt;'));
  assert.ok(!run.includes('window.injected=true</script>'));
  assert.ok(!run.includes('pm-submitted-solution')&&!run.includes('data-pm-check='));
  assert.ok(!run.includes('실제 답안은 이렇게 작성'));
  const result=submitPracticalAttempt(active);
  const html=renderPracticalMock({state:{active:null,history:[result]},view:'result',resultId:result.id});
  assert.ok(html.includes('pm-submitted-solution')&&html.includes('data-pm-check='));
  assert.ok(!html.includes('data-pm-draft='));
  assert.ok(html.includes('공식 정오 판정·합격 판정은 제공하지 않습니다.'));
});
