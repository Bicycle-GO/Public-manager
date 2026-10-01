import test from 'node:test';
import assert from 'node:assert/strict';
import {questions} from '../data.js';
import {getQuestionDetails} from '../question-solutions.js';
import {renderQuestionExplanation} from '../practice-ui.js';
import {createServer} from '../server.mjs';

test('Every question has option-level reasoning; all 36 short explanations gain a full solution without mutating questions',()=>{
  const snapshot=JSON.stringify(questions);
  for(const q of questions){
    const detail=getQuestionDetails(q);
    assert.ok(detail,`Missing details for ${q.id}`);
    assert.equal(detail.choices.length,q.options.length);
    assert.ok(detail.choices.every(c=>c.title && c.reason));
    if(q.id<=36){
      assert.equal(detail.steps.length,3);
      assert.ok(detail.steps.every(([title,body])=>title && body.length>30));
      assert.ok(detail.example.situation && detail.example.effects.length>=2);
      assert.ok(detail.concept.length>50 && detail.takeaway);
      const html=renderQuestionExplanation(q,q.answer);
      assert.ok(html.includes('단계별 풀이 과정') && html.includes('보기별 해설'));
      assert.ok(html.includes(detail.example.title));
    }
  }
  assert.equal(JSON.stringify(questions),snapshot);
});

test('Wrong selections show their own reasoning alongside the correct answer; correct selections show a single answer card',()=>{
  const q=questions.find(q=>q.id===11),detail=getQuestionDetails(q);
  const wrong=renderQuestionExplanation(q,0);
  assert.ok(wrong.includes('내가 고른 보기') && wrong.includes('정답 보기'));
  assert.ok(wrong.includes(detail.choices[0].reason));
  assert.ok(wrong.includes('selected-choice'));
  const right=renderQuestionExplanation(q,q.answer);
  assert.ok(right.includes('내 답 · 정답 보기'));
  assert.ok(!right.includes('내가 고른 보기') && !right.includes('selected-choice'));
  for(const value of [undefined,null,-1,99,NaN]){
    const html=renderQuestionExplanation(q,value);
    assert.ok(!html.includes('내가 고른 보기') && !html.includes('undefined'));
  }
});

test('OX and negative-stem questions identify the answer choice without calling every answer statement true',()=>{
  const ox=questions.find(q=>q.id===82);
  const html=renderQuestionExplanation(ox,0);
  assert.ok(html.includes('O · 옳다') && html.includes('X · 틀리다'));
  assert.ok(html.includes('OX 판단 근거'));
  const negative=questions.find(q=>q.id===152);
  assert.ok(negative.text.includes('옳지 않은'));
  const wrong=renderQuestionExplanation(negative,0);
  assert.ok(wrong.includes(negative.details.choices[negative.answer].reason));
  assert.ok(wrong.includes('정답 보기'));
});

test('Calculation explanations distinguish totals, settlement and percentage conversion and escape display content',()=>{
  const get=id=>getQuestionDetails(questions.find(q=>q.id===id));
  assert.match(get(11).steps[1][1],/200만 원.*180만 원/);
  assert.match(get(27).steps[1][1],/360 ÷ 3 = 120/);
  assert.match(get(28).steps[0][1],/1\.1S/);
  assert.match(get(29).steps[2][1],/3,000 − 정산액 600 = 2,400/);
  assert.match(get(30).steps[0][1],/0\.1 ÷ 100 = 0\.001/);
  const q=questions.find(q=>q.id===1);
  const unsafe='<img src=x onerror=alert(1)>';
  const html=renderQuestionExplanation({...q,options:[unsafe,...q.options.slice(1)]},0);
  assert.ok(html.includes('&lt;img') && !html.includes(unsafe));
});

test('Default server login stays jin even when an old password environment variable is present',async t=>{
  const old=process.env.APP_PASSWORD;
  process.env.APP_PASSWORD='outdated-test-password';
  let server;
  try { server=createServer(); }
  finally { if(old===undefined)delete process.env.APP_PASSWORD;else process.env.APP_PASSWORD=old; }
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>server.close(resolve)));
  const base=`http://127.0.0.1:${server.address().port}`;
  const wrong=await fetch(base+'/login',{method:'POST',body:'password=outdated-test-password',redirect:'manual'});
  assert.equal(wrong.status,401);
  const login=await fetch(base+'/login',{method:'POST',body:'password=jin',redirect:'manual'});
  assert.equal(login.status,303);
  const cookie=login.headers.get('set-cookie').split(';')[0];
  assert.equal((await fetch(base+'/question-solutions.js',{headers:{cookie}})).status,200);
  assert.equal((await fetch(base+'/answer-explanations.css',{headers:{cookie}})).status,200);
});
