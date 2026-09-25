import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {questions,lessons} from '../data.js';
import {bidExecutionQuestions as added} from '../bid-execution-questions.js';
import {bidQuestions,renderPracticeGroups,renderQuestionContext,renderQuestionExplanation,questionsByStatus} from '../practice-ui.js';
import {bidPriceAverage} from '../bid-execution.js';
import {renderLessonGuide} from '../lesson-content.js';
import {renderMaterialTopics} from '../study-ui.js';

test('Bid conversation is appended without changing any of the prior 151 question records',()=>{
  assert.equal(createHash('sha256').update(JSON.stringify(questions.filter(q=>q.id<=151))).digest('hex'),'646f7aea4d7a66873c27d632c1c7c9a126145eb56d7dcc5f0d422f37fdd6d953');
  assert.deepEqual(added.map(q=>q.id),Array.from({length:10},(_,i)=>152+i));
  assert.deepEqual(added.map(q=>q.answer+1),[3,3,3,3,3,3,4,3,4,2]);
  assert.ok(added.every(q=>q.subject===2 && q.lesson==='2-03'));
});

test('The dedicated bid set and status filters never mix old chapter questions',()=>{
  assert.deepEqual(bidQuestions().filter(q=>q.sourceNumber<=10),added);
  assert.equal(bidQuestions().length,25);
  const chapter=lessons.find(l=>l.id==='2-03');
  const html=renderPracticeGroups(2,chapter,q=>`<p data-id="${q.id}"></p>`);
  assert.ok(html.includes('start-bid-execution'));
  for(const q of added) assert.equal(html.split(`data-id="${q.id}"`).length-1,1);
  const q=added[0],state={answers:{151:1,[q.id]:0},bookmarks:['q151','q'+q.id]};
  assert.deepEqual(questionsByStatus(added,state,'wrong'),[q]);
  assert.deepEqual(questionsByStatus(added,state,'saved'),[q]);
  state.answers[q.id]=q.answer;
  assert.equal(questionsByStatus(added,state,'wrong').length,0);
  const filtered=renderPracticeGroups(2,chapter,()=>'', [q]);
  assert.ok(!filtered.includes('start-bid-execution'));
});

test('Each bid answer has complete reasoning without leaking the answer topic before grading',()=>{
  for(const q of added){
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options).size,4);
    assert.equal(q.details.choices.length,4);
    assert.ok(q.details.steps.length>=3 && q.details.example.effects.length>=2);
    assert.ok(q.details.takeaway && q.details.sources.length);
    assert.ok(!renderQuestionContext(q).includes(q.topic));
    const html=renderQuestionExplanation(q);
    assert.ok(html.includes('단계별 풀이 과정') && html.includes('보기별 해설') && html.includes('가상 사례'));
    assert.ok(!html.includes('undefined') && !html.includes('chatgpt-content-reference'));
    assert.equal((html.match(/class="correct-choice"/g)||[]).length,1);
  }
  for(const no of [3,4,5,6,7,8,10]) assert.ok(added[no-1].details.correction);
});

test('Bid theory calculates the example correctly and is discoverable by the added terms',()=>{
  assert.equal(bidPriceAverage,99875000);
  const html=renderLessonGuide(lessons.find(l=>l.id==='2-03'));
  assert.ok(html.includes('99,875,000') && html.includes('#practice/2/2-03'));
  assert.ok(html.includes('제39조 제3항') && html.includes('마감일 전일까지'));
  assert.equal((html.match(/<details>/g)||[]).length,10);
  for(const term of ['공동수급','투찰','낙찰하한율','공식 연기','담합']) assert.ok(renderMaterialTopics(term).includes('#theory/2/2-03'),term);
  assert.ok(!renderLessonGuide(lessons.find(l=>l.id==='1-03')).includes('bid-execution'));
});
