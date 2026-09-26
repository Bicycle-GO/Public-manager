import test from 'node:test';
import assert from 'node:assert/strict';
import { questions, lessons } from '../data.js';
import { chapter02ExpectedQuestions as expected, chapter02OxQuestions as ox, chapter02AttachmentQuestions as added } from '../chapter02-questions.js';
import { attachmentQuestions, answerLabel, questionLabel, renderPracticeGroups, renderQuestionContext, renderQuestionExplanation, questionsByStatus } from '../practice-ui.js';
import { renderLessonGuide } from '../lesson-content.js';
import { renderMaterialTopics } from '../study-ui.js';
import { oecdPrinciples } from '../procurement-methods.js';

test('Attachment adds 23 MC and 20 OX with distinct stable IDs and supplied answer keys',()=>{
  assert.deepEqual(expected.map(q=>q.id),Array.from({length:23},(_,i)=>59+i));
  assert.deepEqual(ox.map(q=>q.id),Array.from({length:20},(_,i)=>82+i));
  assert.deepEqual(expected.map(q=>q.answer+1),[2,2,4,3,4,2,3,2,1,4,2,4,2,3,2,3,3,2,2,2,3,2,3]);
  assert.deepEqual(ox.map(q=>q.options[q.answer]),['X','O','X','O','X','O','X','X','X','O','X','X','X','X','X','O','O','O','X','O']);
  assert.ok(added.every(q=>q.lesson==='1-02' && q.subject===1 && !q.sourceNumber));
  assert.equal(questions.filter(q=>q.id<=58).length,58);
  assert.equal(new Set(questions.map(q=>q.id)).size,373);
  assert.ok(expected.every(q=>q.reconstructed && q.options.length===4));
  assert.ok(ox.every(q=>q.type==='ox' && q.options.join(',')==='O,X'));
});

test('Quiz sets do not mix attachment numbering with earlier conversation questions',()=>{
  assert.deepEqual(attachmentQuestions('multiple'),expected);
  assert.deepEqual(attachmentQuestions('ox'),ox);
  assert.deepEqual(questions.filter(q=>q.lesson==='1-02' && q.sourceNumber>=22 && q.sourceNumber<=25).map(q=>q.id),[55,56,57,58]);
  const html=renderPracticeGroups(1,lessons.find(l=>l.id==='1-02'),q=>`<p data-id="${q.id}">${questionLabel(q)}</p>`);
  for(const action of ['start-chapter02-expected','start-chapter02-ox','start-principles']) assert.ok(html.includes(`data-action="${action}"`));
  assert.ok(html.includes('첨부 예상문제 · 23문항') && html.includes('첨부 OX · 20문항'));
  for(const q of added) assert.equal(html.split(`data-id="${q.id}"`).length-1,1);
  assert.ok(!renderPracticeGroups(2,null,()=> '').includes('start-chapter02'));
});

test('Both question types render explanations while pre-answer context reveals no solution',()=>{
  for(const q of added){
    const context=renderQuestionContext(q), explanation=renderQuestionExplanation(q);
    assert.ok(context.includes(questionLabel(q)));
    assert.ok(!context.includes(q.explanation));
    assert.ok(!context.includes(q.details.takeaway));
    assert.ok(explanation.includes(q.explanation) && explanation.includes(q.details.takeaway));
    assert.equal((explanation.match(/class="correct-choice"/g)||[]).length,1);
    assert.equal(q.details.choices.length,q.options.length);
    assert.ok(!explanation.includes('undefined'));
    if(q.type==='ox'){
      assert.ok(['O','X'].includes(answerLabel(q)));
      assert.ok(explanation.includes('OX 판단 근거'));
      assert.ok(!explanation.includes('1번 · O'));
    }
  }
  assert.equal(answerLabel(ox[0],-1),'미응답');
  assert.equal(answerLabel(expected[0]),'2번');
  assert.ok(!renderQuestionContext(expected[5]).includes('통합성'));
  assert.ok(!renderQuestionContext(expected[6]).includes('접근성'));
});

test('OX wrong answers, saved questions, and retries use the existing state without rewriting other IDs',()=>{
  const [x,o]=ox;
  const state={answers:{1:1,[x.id]:0,[o.id]:0},bookmarks:['q'+x.id,'q55']};
  assert.deepEqual(questionsByStatus(ox,state,'wrong'),[x]);
  assert.deepEqual(questionsByStatus(ox,state,'correct'),[o]);
  assert.deepEqual(questionsByStatus(ox,state,'saved'),[x]);
  state.answers[x.id]=1;
  assert.equal(questionsByStatus(ox,state,'wrong').length,0);
  assert.equal(state.answers[1],1);
  const html=renderPracticeGroups(1,lessons.find(l=>l.id==='1-02'),q=>String(q.id),[x]);
  assert.ok(html.includes('첨부 OX · 1문항') && !html.includes('start-chapter02-ox'));
});

test('Ambiguous source statements preserve legal conditions and disclose corrections',()=>{
  assert.match(expected[10].text,/적격자로 확정/);
  assert.match(expected[17].options[1],/경쟁에 부칠 여유가 없고 법정 요건/);
  assert.match(expected[18].options[1],/대체품이 없고/);
  assert.match(expected[21].text,/공사.*분할 허용 사유 없이/);
  assert.match(ox[7].explanation,/전자견적/);
  assert.match(ox[13].explanation,/5인.*2인.*5인 미만/);
  for(const index of [15,19]){
    assert.ok(ox[index].adapted && ox[index].details.correction);
    assert.ok(renderQuestionExplanation(ox[index]).includes('원문과 달라진 점'));
  }
  assert.match(ox[15].explanation,/예외/);
  assert.match(ox[19].explanation,/적용 규정과 생략 요건/);
});

test('Theory and materials search cover attachment concepts only in the intended chapter',()=>{
  const chapter=lessons.find(l=>l.id==='1-02'),html=renderLessonGuide(chapter);
  assert.equal(oecdPrinciples.length,12);
  for(const term of ['TCO','OECD','2단계','적격심사','협상','RFQ','Sole Source','Single Source','ERA','정부구매카드']){
    assert.ok(html.includes(term),term);
    assert.ok(renderMaterialTopics(term).includes('#theory/1/1-02'),term);
  }
  assert.ok(!renderLessonGuide(lessons.find(l=>l.id==='1-03')).includes('procurement-methods'));
});
