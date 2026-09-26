import {chromium} from 'file:///C:/Users/양지민/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {questions} from '../data.js';
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage(),errors=[],failed=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',response=>{if(response.url().startsWith('http://127.0.0.1:3000')&&response.status()>=400)failed.push(response.url());});
const go=async route=>{const url='http://127.0.0.1:3000/#'+route;if(page.url()===url)await page.reload();else await page.goto(url);await page.waitForSelector('main h1');};
const action=name=>page.locator(`[data-action="${name}"]`);
const getState=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('jodalon-v1')));
const question=async()=>{const text=await page.locator('.quiz-question h2').innerText();const q=questions.find(q=>text.endsWith(q.text));assert.ok(q,text);return q;};
try {
 await go('practice/1/1-01');
 await action('start-filtered').click();
 assert.equal(await page.locator('.quiz-chapter-link').getAttribute('href'),'#practice/1/1-01');
 let q=await question();
 await page.locator(`[data-action="select-answer"][data-id="${q.answer}"]`).click();await action('check-answer').click();
 await page.screenshot({path:'tmp/quiz-chapter-desktop.png'});
 await page.locator('.quiz-chapter-link').click();
 assert.equal(await page.locator('.quiz-card').count(),0);assert.equal((await getState()).answers[q.id],q.answer);
 await go('practice/2/2-04');await page.locator('main [data-action="start-evaluation"]').click();
 q=await question();assert.equal(q.lesson,'2-05');
 assert.equal(await page.locator('.quiz-chapter-link').getAttribute('href'),'#practice/2/2-04');
 await page.locator('.quiz-chapter-link').click();assert.equal(await page.locator('.quiz-card').count(),0);
 await go('dashboard');await action('quick-quiz').click();q=await question();
 assert.equal(await page.locator('.quiz-chapter-link').getAttribute('href'),`#practice/${q.subject}/${q.lesson}`);
 await page.locator('.quiz-chapter-link').click();
 console.log('Chapter return: same route, shared chapter, mixed quiz, graded records passed');
 await go('mock');
 assert.equal(await page.locator('input[value="practice60"]').isChecked(),true);
 await page.screenshot({path:'tmp/mock-format-desktop.png'});
 await action('start-exam').click();
 assert.equal(await action('jump-question').count(),60);assert.equal(await page.locator('.quiz-chapter-link').count(),0);
 assert.match(await page.locator('#timer').innerText(),/^(90:00|89:5\d)$/);
 const examined=[];
 for(let i=0;i<60;i++) {
  q=await question();examined.push(q);
  assert.equal(q.subject,Math.floor(i/20)+1);assert.notEqual(q.type,'ox');
  assert.equal(await action('select-answer').count(),4);
  if(i!==59)await page.locator(`[data-action="select-answer"][data-id="${q.answer}"]`).click();
  if(i===0) {
   await page.locator(`[data-action="select-answer"][data-id="${(q.answer+1)%4}"]`).click();
   await page.locator(`[data-action="select-answer"][data-id="${q.answer}"]`).click();
  }
  assert.equal(await page.locator('.explanation').count(),0);assert.equal(await action('check-answer').count(),0);
  if(i<59)await action('next-question').click();
 }
 assert.equal(new Set(examined.map(q=>q.id)).size,60);
 await action('submit-exam').click();assert.ok((await page.locator('#modal').innerText()).includes('1문제'));
 await action('confirm-submit').click();
 assert.ok((await page.locator('.result-card').innerText()).includes('59문제 정답'));
 assert.ok((await page.locator('.exam-verdict').innerText()).includes('합격 기준 충족'));
 let state=await getState();assert.equal(state.exams.at(-1).total,60);assert.equal(state.exams.at(-1).correct,59);assert.equal(state.answers[examined.at(-1).id],-1);
 console.log('60-question exam: unique 20 per subject, answer changes, deferred grading, unanswered scoring passed');
 await page.locator('.nav-link[href="#mock"]').click();await page.locator('input[value="official80"]').check();
 // Preserve bank order so the 7R explanation with a long English list is always covered on mobile.
 await page.evaluate(()=>{Math.random=()=>0.999999;});await action('start-exam').click();
 assert.equal(await action('jump-question').count(),80);assert.match(await page.locator('#timer').innerText(),/^(120:00|119:5\d)$/);
 for(const [index,subject] of [[0,1],[29,1],[30,2],[49,2],[50,3],[79,3]]) {
  await page.locator(`[data-action="jump-question"][data-id="${index}"]`).click();assert.equal((await question()).subject,subject);
 }
 await page.locator('[data-action="jump-question"][data-id="0"]').click();
 await page.setViewportSize({width:390,height:844});
 await page.waitForTimeout(300);
 await page.evaluate(()=>window.scrollTo(0,0));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 assert.ok(await page.locator('.exam-question-dots').evaluate(el=>el.clientHeight<=176));
 await page.screenshot({path:'tmp/mock-exam-mobile.png'});
 await page.locator('[data-action="jump-question"][data-id="79"]').click();
 assert.ok(await page.locator('.exam-question-dots').evaluate(el=>{const current=el.querySelector('.current');return current.offsetTop>=el.scrollTop && current.offsetTop+current.offsetHeight<=el.scrollTop+el.clientHeight+1;}));
 await action('exit-quiz').click();await action('confirm-exit').click();
 assert.equal((await getState()).exams.length,1);
 await page.clock.install();await action('start-exam').click();
 await page.locator('[data-action="jump-question"][data-id="79"]').click();await action('submit-exam').click();
 await page.clock.fastForward(120*60*1000+1000);
 await page.waitForSelector('.result-card');
 assert.equal(await page.locator('#modal[open]').count(),0);
 state=await getState();assert.equal(state.exams.at(-1).total,80);assert.equal(state.exams.at(-1).correct,0);assert.equal(state.exams.at(-1).passed,false);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 assert.equal(state.exams.length,2);
 await go('mock');assert.equal(await page.locator('.history-row').count(),2);
 await page.screenshot({path:'tmp/mock-format-mobile.png'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 await go('practice/1/1-02');await action('start-chapter02-ox').click();
 assert.equal(await action('select-answer').count(),2);
 await page.screenshot({path:'tmp/quiz-chapter-mobile.png'});
 await page.locator('.quiz-chapter-link').click();assert.equal(await page.locator('.quiz-card').count(),0);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 await page.reload();assert.equal((await getState()).exams.length,2);
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const result={chapterReturn:true,sharedChapterReturn:true,mixedQuizReturn:true,gradedRecordsPreserved:true,practice60:true,official80:true,subjectDistribution:true,unique:true,oxExcluded:true,answerChanges:true,deferredGrading:true,unanswered:true,expiryDuringConfirmation:true,cancelNotRecorded:true,mobileNoOverflow:true,persistence:true,errors,failed};
 fs.writeFileSync('tmp/mock-navigation-browser-check.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
} finally {await context.close();await browser.close();}
