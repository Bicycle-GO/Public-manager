import test from 'node:test';
import assert from 'node:assert/strict';
import {questions,lessons} from '../data.js';
import {
 computeEvaluation,computeTrimmedAverage,computeOwnershipCost,
 getLessonMotionIds,getQuestionMotionId,getMotionLesson,
 renderMotionLearning,renderLessonMotion,renderQuestionMotion
} from '../motion-learning.js';
import {renderQuestionContext,renderQuestionExplanation} from '../practice-ui.js';

test('Evaluation motion calculations apply the technical threshold before total-score ranking and include equality',()=>{
 const input={technicalMaximum:80,rows:[
  {name:'A',technical:74,price:15},
  {name:'B',technical:70,price:18},
  {name:'C',technical:66,price:20}
 ]};
 const snapshot=JSON.stringify(input);
 const result=computeEvaluation(input);
 assert.equal(result.threshold,68);
 assert.deepEqual(result.rows.map(r=>[r.name,r.total,r.eligible]),[['A',89,true],['B',88,true],['C',86,false]]);
 assert.equal(result.rows.find(r=>r.name==='A').rank,1);
 assert.equal(result.rows.find(r=>r.name==='B').rank,2);
 assert.ok(!result.rows.find(r=>r.name==='C').rank);
 const boundary=computeEvaluation({technicalMaximum:70,rows:[
  {name:'A',technical:59.5,price:20},{name:'B',technical:59.4,price:30}
 ]});
 assert.equal(boundary.threshold,59.5);
 assert.deepEqual(boundary.rows.map(r=>r.eligible),[true,false]);
 assert.equal(JSON.stringify(input),snapshot,'The calculation must not alter the question scenario');
});

test('Trimmed averages remove only the specified number of tied extreme scores and preserve the original input',()=>{
 const eight=[60,60,80,85,90,90,95,95],snapshot=[...eight];
 const first=computeTrimmedAverage(eight,1);
 assert.deepEqual(first.kept,[60,80,85,90,90,95]);
 assert.equal(first.excluded.length,2);
 assert.equal(first.sum,500);
 assert.ok(Math.abs(first.average-500/6)<0.0001);
 assert.deepEqual(eight,snapshot);
 const twelve=computeTrimmedAverage([50,60,70,75,80,85,90,90,95,95,100,100],2);
 assert.deepEqual(twelve.kept,[70,75,80,85,90,90,95,95]);
 assert.equal(twelve.excluded.length,4);
 assert.equal(twelve.sum,680);
 assert.equal(twelve.average,85);
 const unsorted=computeTrimmedAverage([95,60,85,80,60,95,90,90],1);
 assert.deepEqual(unsorted.kept,first.kept);
});

test('TCO motion uses purchase plus the whole usage period plus disposal, keeping the original question example',()=>{
 const a=computeOwnershipCost({purchase:1000,annual:200,years:5,disposal:50});
 const b=computeOwnershipCost({purchase:1300,annual:100,years:5,disposal:50});
 assert.equal(a,2050);
 assert.equal(b,1850);
 assert.equal(a-b,200);
 assert.ok(1000<1300 && a>b,'The cheaper purchase can have the greater five-year ownership cost');
});

test('Motion lessons expose manual controls and a readable full explanation without starting automatically',()=>{
 for(const id of ['evaluation','evaluation70','evaluation-next','average','average12','tco','lifecycle']){
  const model=getMotionLesson(id);
  assert.ok(model?.title && model.description && model.assumptions,id);
  assert.ok(model.steps.length>=3,id);
  assert.ok(model.steps.every(step=>step.title && step.caption),id);
  const html=renderMotionLearning(id);
  assert.ok(html.includes('motion-learning') && html.includes('data-motion="'+id+'"'),id);
  assert.ok(html.includes('data-motion-step="0"'),id);
  for(const action of ['previous','play','next','reset','step'])
   assert.ok(html.includes('data-motion-control="'+action+'"'),id+' '+action);
  assert.ok(html.includes('data-motion-speed'),id+' speed');
  assert.ok(html.includes('motion-transcript'),id+' transcript');
  for(const step of model.steps)assert.ok(html.includes(step.title),id+' readable step');
  assert.ok(!html.includes('autoplay') && !html.includes('undefined') && !html.includes('NaN'),id);
 }
});

test('Theory and graded explanations connect only relevant motion examples and never expose them in the question prompt',()=>{
 const before=JSON.stringify(questions);
 assert.deepEqual(getLessonMotionIds('2-04'),['evaluation','average']);
 for(const id of ['1-02','1-04','2-01'])assert.deepEqual(getLessonMotionIds(id),['tco']);
 for(const id of ['3-01','3-02'])assert.deepEqual(getLessonMotionIds(id),['lifecycle']);
 assert.deepEqual(getLessonMotionIds('missing'),[]);
 for(const [id,key] of [[420,'evaluation'],[277,'evaluation70'],[427,'evaluation-next'],[442,'average'],[452,'average'],[61,'tco'],[92,'tco'],[219,'tco']]){
  const q=questions.find(q=>q.id===id);
  assert.equal(getQuestionMotionId(q),key,String(id));
  assert.ok(renderQuestionMotion(q).includes('data-motion="'+key+'"'),String(id));
  assert.ok(!renderQuestionContext(q).includes('data-motion='),'No answer-bearing motion before grading for '+id);
  assert.ok(renderQuestionExplanation(q,q.answer).includes('data-motion="'+key+'"'),'Graded solution '+id);
 }
 const unrelated=questions.find(q=>q.id===403);
 assert.equal(getQuestionMotionId(unrelated),null);
 assert.equal(renderQuestionMotion(unrelated),'');
 assert.ok(!renderQuestionExplanation(unrelated).includes('data-motion='));
 const theory=renderLessonMotion(lessons.find(l=>l.id==='2-04'));
 assert.ok(theory.includes('data-motion="evaluation"') && theory.includes('data-motion="average"'));
 assert.equal(JSON.stringify(questions),before,'Rendering animations must not change question data or answers');
});

