
import {chromium} from 'file:///C:/Users/kwg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {relatedQuestions,chapterCoverage} from '../chapter-review.js';
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage(),errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:3000')&&r.status()>=400)failed.push(r.url());});
const go=async route=>{await page.goto('http://127.0.0.1:3000/#'+route);await page.waitForSelector('main h1');};
try{
 await go('practice/3');
 assert.equal(await page.locator('.coverage-status').count(),3);
 const result={};
 for(const id of ['3-04','3-05','3-06']){
  await go('practice/3/'+id);
  assert.ok((await page.locator('.chapter-source-review').innerText()).includes('原文'.replace('原文','원문 미확보')));
  const qs=relatedQuestions(id),c=chapterCoverage(id);
  assert.equal(await page.locator('.related-question-links button').count(),qs.length);
  await page.locator('[data-action="start-related"]').click();
  assert.equal(await page.locator('[data-action="jump-question"]').count(),qs.length);
  for(let i=0;i<qs.length;i++){
   const q=qs[i];
   assert.ok((await page.locator('.quiz-question h2').innerText()).includes(q.text));
   await page.locator('[data-action="select-answer"][data-id="'+q.answer+'"]').click();
   await page.locator('[data-action="check-answer"]').click();
   assert.equal(await page.locator('.option.right').getAttribute('data-id'),String(q.answer));
   if(i===0)await page.locator('[data-action="bookmark-question"]').click();
   if(i<qs.length-1)await page.locator('[data-action="next-question"]').click();
  }
  await go('theory/3/'+id);
  assert.equal(await page.locator('.chapter-source-review').count(),1);
  await page.locator('.related-question-links button').first().click();
  assert.ok((await page.locator('.quiz-question h2').innerText()).includes(qs[0].text));
  await go('practice/3/'+id+'/unanswered');
  assert.equal(await page.locator('[data-action="start-related"]').count(),0);
  assert.ok((await page.locator('.chapter-source-review').innerText()).includes('미반영 범위'));
  await page.setViewportSize({width:390,height:844});
  await go('practice/3/'+id);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  if(id==='3-05')await page.screenshot({path:'tmp/mas-source-review-mobile.png',fullPage:true});
  await go('theory/3/'+id);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  await page.setViewportSize({width:1440,height:1000});
  result[id]={registered:c.total,related:qs.length,graded:qs.length,missingSourceVisible:true,noMobileOverflow:true};
 }
 await page.reload();
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('jodalon-v1')));
 for(const id of ['3-04','3-05','3-06']){
  const list=relatedQuestions(id);
  for(const q of list)assert.equal(state.answers[q.id],q.answer);
  assert.ok(state.bookmarks.includes('q'+list[0].id));
 }
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 await go('practice/3');await page.screenshot({path:'tmp/chapter-source-review-desktop.png',fullPage:true});
 const output={chapters:result,answersPreservedAfterReload:true,consoleErrors:errors,failedRequests:failed};
 fs.writeFileSync('tmp/chapter-coverage-browser.json',JSON.stringify(output,null,2));console.log(JSON.stringify(output));
}finally{await context.close();await browser.close();}
