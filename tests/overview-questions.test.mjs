import test from 'node:test';
import assert from 'node:assert/strict';
import {questions} from '../data.js';
import {overviewCoreQuestions,overviewConversation} from '../overview-questions.js';
import {renderQuestionContext,renderQuestionExplanation,practiceQuestions} from '../practice-ui.js';

test('Shared conversation 05–21 adds 17 stable IDs only to the overview chapter',()=>{
  assert.deepEqual(overviewCoreQuestions.map(q=>q.sourceNumber),Array.from({length:17},(_,i)=>i+5));
  assert.deepEqual(overviewCoreQuestions.map(q=>q.id),Array.from({length:17},(_,i)=>i+38));
  assert.deepEqual(questions.slice(0,37).map(q=>q.id),Array.from({length:37},(_,i)=>i+1));
  assert.equal(practiceQuestions(1,'1-01').length,19);
  for(const q of overviewCoreQuestions){
    assert.equal(q.lesson,'1-01');
    assert.equal(q.subject,1);
    assert.equal(q.details.steps.length,3);
    assert.equal(q.details.choices.length,4);
    assert.ok(q.details.steps.every(([title,body])=>title.trim() && body.trim()));
    assert.ok(q.details.example.situation && q.details.example.effects.length>=2);
    assert.ok(q.details.sources.some(s=>s.url===overviewConversation));
    const html=renderQuestionExplanation(q);
    assert.ok(html.includes('단계별 풀이 과정'));
    assert.ok(html.includes(q.details.example.title));
    assert.equal(html.includes('원문과 달라진 점'),!!q.adapted);
  }
});

test('Corrected ambiguous questions keep their limits visible and single-answer intent clear',()=>{
  const get=no=>overviewCoreQuestions.find(q=>q.sourceNumber===no);
  assert.match(get(5).text,/운영적 체계/);
  assert.match(get(9).text,/사회적 책임 공공조달/);
  assert.match(get(9).details.choices[3].reason,/올바른 연결/);
  assert.equal(get(9).answer,2);
  assert.equal(get(15).passage.length,4);
  assert.match(get(15).passage[2],/블록체인만/);
  assert.match(get(15).details.correction,/근거 원문을 확인하지 못해/);
  assert.equal(get(15).answer,1);
  assert.match(get(16).explanation,/제3항.*금지.*제4항.*무효/);
  assert.match(get(18).text,/제3조/);
  assert.match(get(20).passage[0],/교육기관.*기타 묶음/);
});

test('2024 calculations use the correct denominator and explicitly defined institution grouping',()=>{
  const companyPercent=583351/602681*100;
  assert.equal(companyPercent.toFixed(1),'96.8');
  const other=1088+1462+539+286+42772;
  assert.equal(other,46147);
  assert.equal(5608+7162+12840+other,71757);
  assert.equal((other/71757*100).toFixed(1),'64.3');
  const stats=overviewCoreQuestions.filter(q=>[7,20].includes(q.sourceNumber));
  assert.ok(stats.every(q=>q.text.includes('2024') && q.answer===3));
});

test('Passages render before solving without revealing corrections or solutions and escape content',()=>{
  const q=overviewCoreQuestions.find(q=>q.sourceNumber===15);
  const context=renderQuestionContext(q);
  assert.ok(q.passage.every(p=>context.includes(p)));
  assert.ok(context.includes('공유 대화 15번'));
  assert.ok(!context.includes(q.explanation));
  assert.ok(!context.includes(q.details.correction));
  assert.ok(!context.includes('정답은'));
  const escaped=renderQuestionContext({...q,passage:['<img src=x onerror=alert(1)>']});
  assert.ok(!escaped.includes('<img'));
  assert.ok(escaped.includes('&lt;img'));
});
