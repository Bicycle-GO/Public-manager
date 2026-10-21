import {chromium} from 'file:///C:/Users/kwg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:3013')&&r.status()>=400)failed.push(r.url());});
try{
 await page.goto('http://127.0.0.1:3013/?remaining=official80#mock/written');
 await page.locator('input[name="mock-format"][value="official80"]').check();
 await page.locator('[data-action="start-exam"]').click();
 assert.equal(await page.locator('[data-action="jump-question"]').count(),80);
 await page.locator('[data-action="select-answer"]').first().click();
 await page.locator('[data-action="jump-question"]').last().click();
 await page.locator('[data-action="submit-exam"]').click();
 await page.locator('[data-action="confirm-submit"]').click();
 await page.locator('.result-card').waitFor();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('jodalon-v1')));
 assert.equal(saved.exams.at(-1).format,'official80');
 assert.equal(saved.exams.at(-1).total,80);
 await page.goto('http://127.0.0.1:3013/?remaining=print#practical/print');
 await page.locator('.pr-print-unit').first().waitFor();
 assert.equal(new URL(page.url()).hash,'#theory/practical/print');
 assert.equal(await page.locator('.pr-print-unit').count(),25);
 assert.equal(await page.locator('.wb-print-question').count(),12);
 await page.emulateMedia({media:'print'});
 assert.equal(await page.locator('.course-mode-tabs').isVisible(),false);
 assert.equal(await page.locator('.sidebar').isVisible(),false);
 await page.emulateMedia({media:'screen'});
 await page.goto('http://127.0.0.1:3013/?remaining=part#theory/1');
 await page.locator('main h1').waitFor();
 assert.equal(await page.locator('main .page-heading a').getAttribute('href'),'#theory/written');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const report={
  mainFlow:'The main browser run completed all assertions through practical exams, deadline recovery, mobile layouts and written 60-question submission. Its final same-URL navigation did not reload the written selector; the navigation helper was corrected.',
  theoryModes:['written','practical'],mockModes:['written','practical'],writtenFormats:[60,80],practicalFormats:[8,12],
  savedDeadlineAndAnswers:true,manualSubmission:true,timeoutDuringExam:true,expiredOnReload:true,
  selfCheckAndReviewPersistence:true,oldLearningRecordsPreserved:true,mobileWidths:[390,320],
  remainingFlow:'Targeted browser verification confirmed official80 selection/submission, 25-unit plus 12-question printing, hidden navigation in print media and the written PART return link.',
  printPreserved:true,errors,failed
 };
 fs.writeFileSync('tmp/learning-modes-browser-check.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
