
import {chromium} from 'file:///C:/Users/kwg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {constructionQuestions} from '../construction-questions.js';
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();
const errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:3000')&&r.status()>=400)failed.push(r.url());});
const go=async route=>{await page.goto('http://127.0.0.1:3000/#'+route);await page.waitForSelector('main h1');};
try{
 await go('practice/3/3-03');
 await page.locator('button.question-title[data-action="single-question"][data-id="351"]').click();
 await page.locator('[data-action="select-answer"][data-id="2"]').click();
 await page.locator('[data-action="check-answer"]').click();
 await page.locator('[data-action="bookmark-question"]').click();
 for(const [collection,chapter] of [['construction-special','3-07'],['construction-general','3-06']]){
  await go('practice/3/'+chapter);
  await page.locator('[data-action="start-followup"][data-id="'+collection+'"]').click();
  const list=constructionQuestions.filter(q=>q.collection===collection);
  assert.equal(await page.locator('[data-action="jump-question"]').count(),list.length);
  for(let i=0;i<list.length;i++){
   const q=list[i];const chosen=q.id===392?0:q.answer;
   assert.ok((await page.locator('.quiz-question h2').innerText()).includes(q.text));
   assert.equal(await page.locator('.explanation').count(),0);
   await page.locator('[data-action="select-answer"][data-id="'+chosen+'"]').click();
   await page.locator('[data-action="check-answer"]').click();
   assert.equal(await page.locator('.option.right').getAttribute('data-id'),String(q.answer));
   const explanation=await page.locator('.explanation').innerText();
   for(const label of ['단계별 풀이 과정','보기별 해설','가상 사례','기억할 한 문장','원문과 달라진 점'])assert.ok(explanation.includes(label));
   if(q.id===392){await page.locator('[data-action="bookmark-question"]').click();await page.screenshot({path:'tmp/construction-answer-19.png',fullPage:true});}
   if(i<list.length-1)await page.locator('[data-action="next-question"]').click();
  }
 }
 await go('practice/3/3-07/wrong');
 assert.equal(await page.locator('button.question-title[data-action="single-question"][data-id="392"]').count(),1);
 await page.reload();
 assert.equal(await page.locator('button.question-title[data-action="single-question"][data-id="392"]').count(),1);
 let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('jodalon-v1')));
 assert.equal(saved.answers[351],2);assert.ok(saved.bookmarks.includes('q351')&&saved.bookmarks.includes('q392'));
 assert.equal(saved.answers[392],0);assert.equal(Object.keys(saved.answers).length,30);
 await go('theory/3/3-07');
 assert.ok((await page.locator('main').innerText()).includes('원문 정답·문구 검토표'));
 await page.locator('[data-action="study-section"][data-target="construction-topic-392"]').click();
 assert.ok(page.url().endsWith('#theory/3/3-07'));
 assert.equal(await page.evaluate(()=>document.activeElement.id),'construction-topic-392');
 await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:'tmp/construction-theory-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 await go('practice/3/3-07');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 await page.screenshot({path:'tmp/construction-practice-mobile.png'});
 await go('theory/3/3-07');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 await page.setViewportSize({width:1440,height:1000});
 await go('materials');
 await page.locator('#material-search').fill('협의단가');
 assert.ok(await page.locator('#material-topics a[href="#theory/3/3-07"]').count()>0);
 await page.locator('#material-topics a[href="#theory/3/3-07"]').first().click();
 assert.ok(page.url().endsWith('#theory/3/3-07'));
 await go('practice/3/3-06');
 assert.ok((await page.locator('main').innerText()).includes('총 5문항'));
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const result={questionsGraded:29,correct:28,intentionallyWrong:1,oldRecordPreserved:true,bookmarkAndWrongSurviveReload:true,chapterCounts:{'3-07':26,'3-06':5},searchAndTheoryJump:true,mobileOverflow:false,consoleErrors:errors,failedRequests:failed};
 fs.writeFileSync('tmp/construction-browser-check.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await context.close();await browser.close();}
