import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {questions,lessons} from '../data.js';
import {followupQuestions,questionLabel,questionsByStatus,renderPracticeGroups,renderQuestionContext,renderQuestionExplanation} from '../practice-ui.js';
import {renderLessonGuide} from '../lesson-content.js';
import {renderMaterialTopics} from '../study-ui.js';
import {changeFinalExamples} from '../contract-change-final-study.js';

const additions=questions.filter(q=>q.id>=344 && q.id<=361);
const change=followupQuestions('contract-change'),goods=followupQuestions('goods-contract');

test('Eighteen appended questions preserve the previous 343 records and their saved-answer IDs',()=>{
  assert.equal(createHash('sha256').update(JSON.stringify(questions.filter(q=>q.id<=343))).digest('hex'),'f9f269c3d260d8a67ebf290a8139b1795e6cce67e4fece7f10f4714507ea2bb7');
  assert.deepEqual(additions.map(q=>q.id),Array.from({length:18},(_,i)=>344+i));
  assert.deepEqual(additions.map(q=>q.answer),[2,1,2,3,3,3,0,2,1,1,1,2,0,2,2,2,1,2]);
  for(const q of additions){
    assert.equal(q.subject,3);
    assert.equal(q.lesson,q.id<=350?'3-02':'3-03');
    assert.equal(new Set(q.options).size,4);
    assert.deepEqual(q.details.choices.map(c=>c.title),q.options);
    assert.ok(q.details.steps.length>=3 && q.details.example.effects.length>=2);
    assert.ok(q.details.correction && q.details.sources.length>=2);
    assert.ok(q.details.sources.every(s=>s.title && /^https:\/\//.test(s.url)));
    const context=renderQuestionContext(q),explanation=renderQuestionExplanation(q);
    assert.ok(!context.includes(q.topic) && !context.includes(q.details.takeaway));
    for(const title of ['단계별 풀이 과정','보기별 해설','가상 사례','기억할 한 문장','원문과 달라진 점'])assert.ok(explanation.includes(title));
    assert.equal((explanation.match(/class="correct-choice"/g)||[]).length,1);
    assert.ok(!explanation.includes('undefined') && !explanation.includes('chatgpt-content-reference'));
  }
});

test('Chapter launchers, repeated source numbering, and review filters remain independent',()=>{
  for(const [list,count,id,range] of [[change,25,'3-02','01~25번'],[goods,23,'3-03','01~23번']]){
    assert.equal(list.length,count);
    assert.deepEqual(list.map(q=>q.sourceNumber),Array.from({length:count},(_,i)=>i+1));
    const html=renderPracticeGroups(3,lessons.find(l=>l.id===id),q=>`<b data-q="${q.id}"></b>`);
    assert.ok(html.includes(range) && html.includes(`${count}문항 풀기`));
    for(const q of list)assert.equal(html.split(`data-q="${q.id}"`).length-1,1);
  }
  assert.notEqual(questionLabel(change[0]),questionLabel(goods[0]));
  const state={answers:{344:change[18].answer,351:0},bookmarks:['q344','q351']};
  assert.deepEqual(questionsByStatus(change,state,'correct').map(q=>q.id),[344]);
  assert.deepEqual(questionsByStatus(goods,state,'wrong').map(q=>q.id),[351]);
  assert.deepEqual(questionsByStatus(change,state,'saved').map(q=>q.id),[344]);
  assert.deepEqual(questionsByStatus(goods,state,'saved').map(q=>q.id),[351]);
  assert.equal(questionsByStatus(goods,state,'unanswered').length,22);
});

test('Rewritten questions state the conditions needed for one defensible answer',()=>{
  assert.match(change[18].options[3],/30%/);
  assert.match(change[18].details.correction,/③.*④/);
  assert.match(change[21].options.join(' '),/계약금액.*5천만원/);
  assert.match(change[22].text,/대형공공성.*기둥.*내력벽/);
  assert.match(change[23].options[2],/기한.*검사/);
  assert.match(change[24].details.correction,/모든.*법정 절차/);
  assert.match(goods[1].text,/중소기업자간 경쟁제품/);
  assert.match(goods[4].details.correction,/고정 배점/);
  assert.match(goods[6].details.concept,/선적항.*매수인/);
  assert.match(goods[7].details.concept,/산정단가.*낙찰률/);
  assert.match(goods[8].text,/최소 요건/);
  assert.match(goods[10].text,/완료대가/);
});

test('Worked delay examples and searchable theory are scoped to the right chapters',()=>{
  const {delay,partial,goods:goodsDelay,warranty}=changeFinalExamples;
  const base=delay.contract-delay.accepted;
  assert.equal(base*delay.rate*delay.days,15000000);
  assert.equal(base*delay.capRate,300000000);
  assert.equal((partial.contract-partial.accepted)*partial.capRate,180000000);
  assert.equal(goodsDelay.contract*goodsDelay.rate*goodsDelay.days,1500000);
  assert.equal(warranty.contract*warranty.agreedRate,15000000);
  const changeHtml=renderLessonGuide(lessons.find(l=>l.id==='3-02'));
  const goodsHtml=renderLessonGuide(lessons.find(l=>l.id==='3-03'));
  for(const term of ['19~25번','25문항','180,000,000원','대형공공성','납부형태'])assert.ok(changeHtml.includes(term),term);
  for(const term of ['01~23','EXW','CIF','76.5','낙찰률','14일','5일'])assert.ok(goodsHtml.includes(term),term);
  assert.ok(!goodsHtml.includes('계약변경·종결 19~25번 보충 학습'));
  for(const [query,id] of [['지체상금 상한','3-02'],['대형공공성','3-02'],['EXW','3-03'],['CIF','3-03'],['제조등록','3-03']])assert.ok(renderMaterialTopics(query).includes(`#theory/3/${id}`),query);
});
