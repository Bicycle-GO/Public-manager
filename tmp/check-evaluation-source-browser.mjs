import {chromium} from 'file:///C:/Users/양지민/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {evaluationSourceQuestions as added} from '../evaluation-questions.js';
import {evaluationQuestions as shared} from '../evaluation-study.js';
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage(),errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:3000')&&r.status()>=400)failed.push(r.url());});
const go=async route=>{await page.goto('http://127.0.0.1:3000/#'+route);await page.waitForSelector('main h1');};
const rows=()=>page.locator('button.question-title[data-action="single-question"]');
const choose=async q=>{await page.locator(`[data-action="select-answer"][data-id="${q.answer}"]`).click();await page.locator('[data-action="check-answer"]').click();};
try{
 await go('dashboard');
 assert.ok((await page.locator('main').innerText()).length>100);
 await go('practice/2');
 assert.ok((await page.locator('main').innerText()).includes('총 135문항'));
 const card=page.locator('.practice-chapter-card[href="#practice/2/2-04"]');
 assert.ok((await card.innerText()).includes('총 36문항'));
 await card.click();
 assert.equal(await rows().count(),36);
 assert.equal(await page.locator('[data-action="start-followup"][data-id="evaluation-source"]').count(),1);
 await page.screenshot({path:'tmp/evaluation-source-practice-desktop.png'});
 await page.locator('[data-action="start-followup"][data-id="evaluation-source"]').click();
 assert.equal(await page.locator('[data-action="jump-question"]').count(),25);
 for(let i=0;i<added.length;i++){
  const q=added[i],selected=i===16?(q.answer+1)%4:q.answer;
  assert.ok((await page.locator('.quiz-question h2').innerText()).endsWith(q.text));
  assert.equal(await page.locator('.detailed-explanation').count(),0);
  await page.locator(`[data-action="select-answer"][data-id="${selected}"]`).click();
  await page.locator('[data-action="check-answer"]').click();
  assert.equal(await page.locator('.option.right').getAttribute('data-id'),String(q.answer));
  const explanation=await page.locator('.explanation').innerText();
  for(const term of ['단계별 풀이 과정','보기별 해설','가상 사례','기억할 한 문장','해설 참고 자료'])assert.ok(explanation.includes(term),q.id+':'+term);
  if(i===0){
   await page.locator('[data-action="bookmark-question"]').click();
   await page.locator('.explanation [data-action="lesson"][data-id="2-04"]').click();
   await page.waitForSelector('#modal[open] .evaluation-principles');
   assert.ok((await page.locator('#modal').innerText()).includes('제척·기피·회피'));
   await page.locator('#modal [data-action="close-modal"]').click();
  }
  if(i===16){
   assert.ok(explanation.includes('④ 12명'));
   await page.locator('.explanation').scrollIntoViewIfNeeded();
   await page.screenshot({path:'tmp/evaluation-source-answer-17.png'});
  }
  await page.locator('[data-action="next-question"]').click();
 }
 assert.ok((await page.locator('.result-score').innerText()).includes('96'));
 assert.equal(await page.locator('.result-actions a').first().getAttribute('href'),'#practice/2/2-04');
 await page.locator('.result-actions a').first().click();
 await go('practice/2/2-04/wrong');
 assert.equal(await rows().count(),1);
 assert.equal(await rows().getAttribute('data-id'),'419');
 await rows().click();await choose(added[16]);
 await page.locator('[data-action="next-question"]').click();
 await go('practice/2/2-04/wrong');assert.equal(await rows().count(),0);
 await go('practice/2/2-04/saved');assert.equal(await rows().count(),1);
 assert.equal(await rows().getAttribute('data-id'),'403');
 await go('practice/2/2-04');
 await page.locator('main [data-action="start-evaluation"]').click();
 assert.equal(await page.locator('[data-action="jump-question"]').count(),10);
 await choose(shared[0]);await page.locator('[data-action="bookmark-question"]').click();
 await go('practice/2/2-05/saved');assert.equal(await rows().count(),1);
 assert.equal(await rows().getAttribute('data-id'),String(shared[0].id));
 await go('practice/2/2-04');
 await page.locator('[data-action="start-filtered"]').click();
 assert.equal(await page.locator('[data-action="jump-question"]').count(),36);
 await go('theory/2/2-04');
 assert.equal(await page.locator('main .evaluation-principles').count(),1);
 const comparison=page.getByRole('region',{name:'일반 기준 비교 · 특별 기준·공고 조건 별도 확인'});
 await comparison.scrollIntoViewIfNeeded();
 await page.screenshot({path:'tmp/evaluation-source-theory-desktop.png'});
 for(const detail of await page.locator('main .evaluation-principles details').all())await detail.locator('summary').click();
 assert.ok((await page.locator('main .evaluation-principles').innerText()).includes('83.3333점'));
 await page.locator('main .evaluation-principles [data-action="start-followup"]').first().click();
 assert.equal(await page.locator('[data-action="jump-question"]').count(),25);
 await go('materials');await page.locator('#material-search').fill('사전접촉');
 assert.equal(await page.locator('#material-topics a[href="#theory/2/2-04"]').count(),1);
 await page.setViewportSize({width:390,height:844});
 for(const route of ['practice/2','practice/2/2-04','theory/2/2-04']){
  await go(route);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,route+' overflow');
  if(route==='practice/2/2-04')await page.screenshot({path:'tmp/evaluation-source-practice-mobile.png'});
 }
 await page.reload();
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('jodalon-v1')));
 for(const q of added)assert.equal(state.answers[q.id],q.answer);
 assert.ok(state.bookmarks.includes('q403'));
 assert.ok(state.bookmarks.includes('q277'));
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const result={total:427,part2:135,chapter:36,newSet:25,sharedSet:10,gradedNew:25,retry:true,bookmark:true,sharedRecords:true,theoryModal:true,search:true,mobileNoOverflow:true,persistAfterReload:true,errors,failed};
 fs.writeFileSync('tmp/evaluation-source-browser-check.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify(result));
}finally{await context.close();await browser.close();}
