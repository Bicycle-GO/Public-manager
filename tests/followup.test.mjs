import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {questions,lessons} from '../data.js';
import {followupQuestions,questionLabel,renderPracticeGroups,renderQuestionContext,renderQuestionExplanation,questionsByStatus} from '../practice-ui.js';
import {renderLessonGuide} from '../lesson-content.js';
import {renderMaterialTopics} from '../study-ui.js';

const sets=[['law1-followup','1-05',162],['law2-followup','1-06',187],['planning-followup','2-01',212],['proposal-followup','2-02',237]];
const added=questions.filter(q=>q.id>161);

test('One hundred follow-up questions preserve all previous question records and progress IDs',()=>{
  assert.equal(createHash('sha256').update(JSON.stringify(questions.filter(q=>q.id<=161))).digest('hex'),'b6fecb56d20468c97ecc7e05c64cb79c0bf79dfa3f37ce72f0786eeb3855f1ed');
  assert.equal(added.length,100);
  for(const [collection,lesson,start] of sets){
    const list=followupQuestions(collection);
    assert.deepEqual(list.map(q=>q.id),Array.from({length:25},(_,i)=>start+i));
    assert.deepEqual(list.map(q=>q.sourceNumber),Array.from({length:25},(_,i)=>i+1));
    assert.ok(list.every(q=>q.lesson===lesson && q.subject===Number(lesson[0]) && q.core && q.type==='multiple'));
  }
  assert.deepEqual(followupQuestions('unknown'),[]);
});

test('Dedicated follow-up launchers and state filters isolate each chapter and keep repeated source numbers distinct',()=>{
  for(const [collection,lesson] of sets){
    const chapter=lessons.find(l=>l.id===lesson),list=followupQuestions(collection);
    const html=renderPracticeGroups(chapter.subject,chapter,q=>`<p data-q="${q.id}"></p>`);
    assert.ok(html.includes(`data-id="${collection}"`));
    for(const q of list)assert.equal(html.split(`data-q="${q.id}"`).length-1,1);
    const q=list[0], state={answers:{1:0,[q.id]:(q.answer+1)%4},bookmarks:['q1','q'+q.id]};
    assert.deepEqual(questionsByStatus(list,state,'wrong'),[q]);
    assert.deepEqual(questionsByStatus(list,state,'saved'),[q]);
    assert.equal(questionsByStatus(list,state,'unanswered').length,24);
    assert.ok(!renderPracticeGroups(chapter.subject,chapter,()=>'', [q]).includes('start-followup'));
  }
  assert.equal(new Set(sets.map(([c])=>questionLabel(followupQuestions(c)[0]))).size,4);
});

test('Every new question reveals complete reasoning only after grading while statement passages remain visible',()=>{
  for(const q of added){
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options).size,4);
    assert.equal(q.details.choices.length,4);
    assert.ok(q.details.steps.length>=3 && q.details.example.effects.length>=2);
    assert.ok(q.details.concept && q.details.takeaway && q.details.sources.length);
    const context=renderQuestionContext(q),html=renderQuestionExplanation(q);
    assert.ok(!context.includes(q.topic),`Topic leaked on ${q.id}`);
    assert.ok(!context.includes(q.details.takeaway),`Takeaway leaked on ${q.id}`);
    for(const line of q.passage||[])assert.ok(context.includes(line));
    for(const heading of ['단계별 풀이 과정','보기별 해설','가상 사례','기억할 한 문장'])assert.ok(html.includes(heading));
    assert.equal((html.match(/class="correct-choice"/g)||[]).length,1);
    assert.ok(!html.includes('undefined') && !html.includes('chatgpt-content-reference'));
  }
});

test('Latest response-and-proposal set corrects answer 23 and keeps legal conditions in the question itself',()=>{
  const list=followupQuestions('proposal-followup'),q=n=>list[n-1];
  assert.equal(q(23).answer,0);
  assert.equal(q(23).options[0],'ㄱ·ㄴ');
  assert.ok(q(23).details.correction.includes('②') && q(23).details.correction.includes('①'));
  assert.ok(q(3).text.includes('가상') && q(3).details.concept.includes('법정'));
  assert.ok(q(8).options[q(8).answer].includes('면제 요건'));
  assert.ok(q(15).text.includes('공고에'));
  assert.ok(q(17).details.concept.includes('부가가치세'));
  assert.ok(q(25).text.includes('요건을 충족'));
  for(const n of [21,23,25])assert.ok(q(n).passage.length>=3);
});

test('Reconstructed legal and planning questions visibly explain changed premises and current rules',()=>{
  const law1=followupQuestions('law1-followup'),law2=followupQuestions('law2-followup'),plan=followupQuestions('planning-followup');
  assert.equal(law1[18].answer,3);
  assert.equal(law2[11].answer,0);
  assert.equal(law2[22].answer,1);
  assert.ok(plan[15].options[plan[15].answer].includes('7'));
  for(const q of [law1[18],law2[11],law2[22],plan[15],plan[16]])assert.ok(q.details.correction);
});

test('All four theory pages and supplemental searches expose the right follow-up content',()=>{
  const terms={'1-05':'선금','1-06':'대지급','2-01':'수요예측','2-02':'RFI'};
  for(const [,id] of sets){
    const lesson=lessons.find(l=>l.id===id),html=renderLessonGuide(lesson);
    assert.ok(html.includes(`#practice/${lesson.subject}/${id}`));
    assert.ok(html.includes('<table') && html.includes('<details>'));
    assert.ok(!html.includes('undefined') && !html.includes('chatgpt-content-reference'));
    assert.ok(renderMaterialTopics(terms[id]).includes(`#theory/${lesson.subject}/${id}`));
  }
  const html=renderLessonGuide(lessons.find(l=>l.id==='2-02'));
  assert.ok(html.includes('5억600만원') && html.includes('9,700만원~1억300만원'));
});
