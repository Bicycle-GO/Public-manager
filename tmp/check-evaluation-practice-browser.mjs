import {chromium} from 'file:///C:/Users/kwg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {questions} from '../data.js';
import {evaluationCoreQuestions as core,evaluationExpectedQuestions as expected} from '../evaluation-questions.js';
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage(),errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:3000')&&r.status()>=400)failed.push(r.url());});
let serial=0;
const go=async route=>{await page.goto('http://127.0.0.1:3000/?evaluationCheck='+(++serial)+'#'+route);await page.waitForSelector('main h1');};
const rows=()=>page.locator('main button.question-title[data-action="single-question"]');
const select=async answer=>{
 await page.locator('main [data-action="select-answer"][data-id="'+answer+'"]').click();
 await page.locator('main [data-action="check-answer"]').click();
};
try{
 await go('practice/2');
 const card=page.locator('.practice-chapter-card[href="#practice/2/2-04"]');
 assert.ok((await card.innerText()).includes('총 36문항'));
 assert.ok((await page.locator('main').innerText()).includes('총 135문항'));
 await card.click();
 await page.waitForURL(url=>url.hash==='#practice/2/2-04');
 assert.equal(await rows().count(),36);
 await page.screenshot({path:'tmp/evaluation-expanded-practice-desktop.png'});
 // Existing shared question record must survive the new practice collections.
 await page.locator('main button.question-title[data-id="277"]').click();
 const old=questions.find(q=>q.id===277);
 await select(old.answer);
 await page.locator('main [data-action="bookmark-question"]').click();
 await page.locator('main [data-action="next-question"]').click();
 assert.equal(await page.locator('.result-actions a').first().getAttribute('href'),'#practice/2/2-04');
 for(const [kind,bank,wrongAt] of [['core',core,2],['expected',expected,14]]){
  await go('practice/2/2-04');
  await page.locator('main [data-action="start-evaluation-'+kind+'"]').click();
  assert.equal(await page.locator('main [data-action="jump-question"]').count(),bank.length);
  for(let i=0;i<bank.length;i++){
   const q=bank[i];
   assert.ok((await page.locator('.quiz-question h2').innerText()).includes(q.text));
   await select(i===wrongAt?(q.answer+1)%4:q.answer);
   assert.equal(await page.locator('.option.right').getAttribute('data-id'),String(q.answer));
   for(const term of ['단계별 풀이 과정','보기별 해설','가상 사례','기억할 한 문장'])
    assert.ok((await page.locator('.explanation').innerText()).includes(term),q.id+' '+term);
   if(i===0){
    await page.locator('main [data-action="bookmark-question"]').click();
    await page.locator('.explanation [data-action="lesson"][data-id="2-04"]').click();
    await page.waitForSelector('#modal[open] .evaluation-foundations');
    assert.ok((await page.locator('#modal .evaluation-foundations').innerText()).includes('80 × 0.85 = 68점'));
    await page.locator('#modal [data-action="close-modal"]').click();
   }
   if(q.id===420){
    await page.locator('.explanation').scrollIntoViewIfNeeded();
    await page.screenshot({path:'tmp/evaluation-expanded-solution-desktop.png'});
   }
   await page.locator('main [data-action="next-question"]').click();
  }
  assert.equal(await page.locator('.result-actions a').first().getAttribute('href'),'#practice/2/2-04');
  assert.ok((await page.locator('.result-score').innerText()).includes(kind==='core'?'90':'93'));
 }
 await go('practice/2/2-04/wrong');
 assert.deepEqual(await rows().evaluateAll(ns=>ns.map(n=>Number(n.dataset.id)).sort((a,b)=>a-b)),[405,427]);
 assert.equal(await page.locator('main [data-action="start-evaluation-all"]').count(),0);
 for(const id of [405,427]){
  await go('practice/2/2-04/wrong');
  await page.locator('main button.question-title[data-id="'+id+'"]').click();
  await select(questions.find(q=>q.id===id).answer);
  await page.locator('main [data-action="next-question"]').click();
 }
 await go('practice/2/2-04/wrong');
 assert.equal(await rows().count(),0);
 await go('practice/2/2-04/saved');
 assert.deepEqual(await rows().evaluateAll(ns=>ns.map(n=>Number(n.dataset.id)).sort((a,b)=>a-b)),[277,403,413]);
 await go('practice/2/2-05/saved');
 assert.equal(await rows().count(),1);
 assert.equal(await rows().getAttribute('data-id'),'277');
 await go('practice/2/2-05');
 assert.equal(await rows().count(),25);
 await go('practice/2/2-04/unanswered');
 assert.equal(await rows().count(),10);
 await go('practice/2/2-04');
 await page.locator('main [data-action="start-evaluation-all"]').click();
 assert.equal(await page.locator('main [data-action="jump-question"]').count(),25);
 await go('practice/2/2-04');
 await page.locator('main [data-action="start-filtered"]').click();
 assert.equal(await page.locator('main [data-action="jump-question"]').count(),36);
 await go('practice/2/2-04');
 const shared=page.locator('main [data-action="start-evaluation"]');
 await shared.locator('xpath=ancestor::details').locator('summary').click();
 await shared.click();
 assert.equal(await page.locator('main [data-action="jump-question"]').count(),10);
 await go('theory/2/2-04');
 assert.equal(await page.locator('.evaluation-foundations').count(),1);
 assert.equal(await page.locator('.evaluation-study').count(),1);
 await page.locator('.evaluation-foundations').scrollIntoViewIfNeeded();
 await page.screenshot({path:'tmp/evaluation-expanded-foundations-desktop.png'});
 await page.locator('.evaluation-foundations [data-action="single-question"][data-id="420"]').click();
 assert.ok((await page.locator('.question-passage').innerText()).includes('74'));
 await go('materials');
 await page.locator('#material-search').fill('68점 계산');
 assert.equal(await page.locator('#material-topics a[href="#theory/2/2-04"]').count(),1);
 await page.setViewportSize({width:390,height:844});
 for(const route of ['practice/2','practice/2/2-04','theory/2/2-04']){
  await go(route);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,route+' overflow');
  if(route==='practice/2/2-04')await page.screenshot({path:'tmp/evaluation-expanded-practice-mobile.png'});
  if(route==='theory/2/2-04'){
   await page.locator('.evaluation-foundations').scrollIntoViewIfNeeded();
   await page.screenshot({path:'tmp/evaluation-expanded-foundations-mobile.png'});
  }
 }
 await page.locator('.evaluation-foundations [data-action="single-question"][data-id="420"]').click();
 await select(questions.find(q=>q.id===420).answer);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'graded mobile overflow');
 await page.locator('.explanation').scrollIntoViewIfNeeded();
 await page.screenshot({path:'tmp/evaluation-expanded-solution-mobile.png'});
 await go('practice/2/2-04');
 await page.reload();
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('jodalon-v1')));
 for(const q of [old,...core,...expected])assert.equal(state.answers[q.id],q.answer);
 assert.equal(Object.keys(state.answers).length,26);
 assert.ok(state.bookmarks.includes('q277'));
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const output={chapter:'2-04',available:36,newCore:10,newExpected:15,existingOwn:1,shared:10,global:427,part2:135,gradedNew:25,existingRecordPreserved:true,wrongRetry:true,bookmarks:true,sourceChapterStill25:true,resultReturnsToStartingChapter:true,foundationFromQuizAndSearch:true,persistAfterReload:true,mobileNoOverflow:true,consoleErrors:errors,failedRequests:failed};
 fs.writeFileSync('tmp/evaluation-expanded-browser-check.json',JSON.stringify(output,null,2));
 console.log(JSON.stringify(output));
}finally{await context.close();await browser.close();}

