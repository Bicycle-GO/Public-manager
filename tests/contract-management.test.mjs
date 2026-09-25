import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {questions,lessons} from '../data.js';
import {followupQuestions,questionLabel,renderPracticeGroups,renderQuestionContext,renderQuestionExplanation,questionsByStatus} from '../practice-ui.js';
import {renderLessonGuide} from '../lesson-content.js';
import {renderMaterialTopics} from '../study-ui.js';
import {managementExamples} from '../contract-management-study.js';

const general=followupQuestions('contract-management'),change=followupQuestions('contract-change').filter(q=>q.sourceNumber<=12);
const added=questions.filter(q=>q.id>=301 && q.id<=337);

test('Contract management adds 37 stable IDs while keeping all previous 300 records intact',()=>{
  assert.equal(createHash('sha256').update(JSON.stringify(questions.filter(q=>q.id<=300))).digest('hex'),'07af38fc9f6779a4bb3510a9024a229ca5b4ae47e2c1efec239f77c9a12aac82');
  assert.deepEqual(added.map(q=>q.id),Array.from({length:37},(_,i)=>301+i));
  for(const [list,count,lesson] of [[general,25,'3-01'],[change,12,'3-02']]){
    assert.equal(list.length,count);
    assert.deepEqual(list.map(q=>q.sourceNumber),Array.from({length:count},(_,i)=>i+1));
    assert.ok(list.every(q=>q.subject===3 && q.lesson===lesson && q.core));
  }
});

test('Chapter launchers and review filters separate the two source sequences',()=>{
  for(const [list,id] of [[general,'3-01'],[change,'3-02']]){
    const lesson=lessons.find(l=>l.id===id),html=renderPracticeGroups(3,lesson,q=>`<b data-q="${q.id}"></b>`);
    assert.ok(html.includes(`${followupQuestions(list[0].collection).length}문항 풀기`));
    assert.ok(html.includes(`data-id="${list[0].collection}"`));
    for(const q of list)assert.equal(html.split(`data-q="${q.id}"`).length-1,1);
    const q=list[0],state={answers:{300:2,[q.id]:(q.answer+1)%4},bookmarks:['q300','q'+q.id]};
    assert.deepEqual(questionsByStatus(list,state,'wrong'),[q]);
    assert.deepEqual(questionsByStatus(list,state,'saved'),[q]);
    assert.equal(questionsByStatus(list,state,'unanswered').length,list.length-1);
    assert.ok(!renderPracticeGroups(3,lesson,()=>'', [q]).includes('start-followup'));
  }
  assert.notEqual(questionLabel(general[0]),questionLabel(change[0]));
});

test('All questions have complete structured teaching and reveal only source metadata before grading',()=>{
  for(const q of added){
    assert.equal(new Set(q.options).size,4);
    assert.deepEqual(q.details.choices.map(c=>c.title),q.options);
    assert.ok(q.details.steps.length>=3 && q.details.example.effects.length>=2);
    assert.ok(q.details.concept && q.details.takeaway && q.details.sources.length>=1);
    assert.ok(q.details.sources.every(s=>s.title && s.url));
    const context=renderQuestionContext(q),html=renderQuestionExplanation(q);
    assert.ok(!context.includes(q.topic) && !context.includes(q.details.takeaway));
    assert.equal((html.match(/class="correct-choice"/g)||[]).length,1);
    assert.ok(!html.includes('undefined') && !html.includes('chatgpt-content-reference'));
    for(const term of ['단계별 풀이 과정','보기별 해설','가상 사례','기억할 한 문장'])assert.ok(html.includes(term));
  }
  assert.ok(general[22].reconstructedStem);
  assert.ok(renderQuestionContext(general[22]).includes('질문 복원'));
  assert.equal(added.filter(q=>q.reconstructedStem).length,1);
});

test('CPI, construction bond, new-item rules and committee wording correct source inaccuracies',()=>{
  assert.equal(general[13].answer,1);
  assert.match(general[13].options[1],/25%/);
  assert.match(general[13].details.correction,/20%/);
  assert.equal(change[7].answer,1);
  assert.match(change[7].options[1],/(10|십)/);
  assert.match(change[7].details.correction,/15/);
  assert.equal(change[10].answer,2);
  assert.match(change[10].details.correction,/65/);
  assert.match(change[11].options.join(' '),/재정경제부/);
  for(const q of [general[2],general[4],general[12],general[13],general[22],change[0],change[7],change[10],change[11]])assert.ok(q.details.correction);
});

test('Worked examples use the right units, denominators and monetary amounts',()=>{
  assert.equal(managementExamples.personMonths,15);
  const {pv,ev,ac}=managementExamples.evm;
  assert.equal(ev/pv,.8);assert.equal(ev/ac,.8);assert.equal((ac-ev)/ev,.25);
  assert.equal(managementExamples.serviceDelay,12500000);
  assert.equal(managementExamples.constructionDelay,15000000);
  assert.equal(managementExamples.constructionBond,200000000);
  const {estimatedUnit,awardRatio,quantity}=managementExamples.newItem;
  assert.equal(estimatedUnit*awardRatio*quantity,8000000);
  assert.equal((estimatedUnit+estimatedUnit*awardRatio)/2,90000);
});

test('Both theory pages and material search cover the new content with source-specific notices',()=>{
  const first=renderLessonGuide(lessons.find(l=>l.id==='3-01')),second=renderLessonGuide(lessons.find(l=>l.id==='3-02'));
  for(const term of ['12,500,000','15,000,000','25%','23번','복원','SPI','CPI'])assert.ok(first.includes(term),term);
  for(const term of ['90,000','30%','제65조','재정경제부','10%','14일','5일'])assert.ok(second.includes(term),term);
  assert.ok(first.includes('#practice/3/3-01') && second.includes('#practice/3/3-02'));
  assert.ok(!second.includes('aria-label="계약관리 일반 절차 보충 학습"'));
  for(const [id,terms] of [['3-01',['CMP','CPI','직접지급','M/M']],['3-02',['신규비목','90일','분쟁조정위원회','공사 계약보증금']]]){
    for(const term of terms)assert.ok(renderMaterialTopics(term).includes(`#theory/3/${id}`),term);
  }
});
