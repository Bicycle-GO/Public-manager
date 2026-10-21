import {chromium} from 'file:///C:/Users/kwg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {practicalChapters,practicalChapterUrl} from '../practical-course.js';
import {practicalExpectedBank} from '../practical-question-ui.js';
import {createPracticalAttempt,submitPracticalAttempt} from '../practical-mock.js';

const origin='http://127.0.0.1:3015',browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage(),errors=[],failed=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)failed.push(r.url());});
let navigation=0;
const go=async path=>{await page.goto(origin+'/?check='+ ++navigation+'#'+path.replace(/^#/,''));await page.locator('main h1').waitFor();};
const snapshot=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('jodalon-v1')));
const noOverflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow on '+page.url());
const shot=async name=>page.screenshot({path:'tmp/practical-course-'+name+'.png',fullPage:true,animations:'disabled'});
try{
 await go('theory');
 const oldAttempt=createPracticalAttempt('capture12');oldAttempt.answers[oldAttempt.questionIds[0]]='기존 모의고사 답안';
 const oldResult=submitPracticalAttempt(oldAttempt);
 const baseline={curriculumVersion:2,completed:['1-01'],answers:{403:1},bookmarks:['q403','l1-01'],activity:{},goal:5,exams:[{date:'2026-10-20T03:00:00.000Z',format:'practice60',correct:30,total:60,average:50,passed:false}],practical:{completed:['p1-1'],drafts:{'p1-1':'기존 출제기준 답안'},checks:{'p1-1':[0]}},practicalWorkbook:{completed:['cap-cost-01'],drafts:{'cap-cost-01':'기존 캡처 답안'},checks:{'cap-cost-01':[0]}},practicalExams:{active:null,history:[oldResult]}};
 await page.evaluate(value=>localStorage.setItem('jodalon-v1',JSON.stringify(value)),baseline);await page.reload();
 await page.locator('.course-choice').first().waitFor();
 assert.equal(await page.locator('.sidebar .nav-link[href="#practice"]').innerText(),'예상문제');
 assert.equal(await page.locator('.sidebar .nav-course-children a').count(),2);
 assert.equal(await page.locator('.sidebar .nav-link[href="#practical/questions"]').count(),0);
 await page.locator('.course-choice a[href="#theory/practical"]').click();await page.locator('.pc-part-card').first().waitFor();
 assert.equal(await page.locator('.pc-part-card').count(),7);assert.equal(await page.locator('.pc-part-card li').count(),18);
 await noOverflow();await shot('theory-desktop');
 const restored=await snapshot();
 assert.deepEqual(restored.completed,baseline.completed);assert.deepEqual(restored.answers,baseline.answers);assert.deepEqual(restored.bookmarks,baseline.bookmarks);
 assert.deepEqual(restored.practical,baseline.practical);assert.deepEqual(restored.practicalWorkbook,baseline.practicalWorkbook);assert.equal(restored.practicalExams.history[0].id,oldResult.id);
 assert.deepEqual(restored.practicalCourse?.completed||[],[]);assert.equal(await page.locator('.pc-hero-count>strong').innerText(),'0/ 18');checks.push('Legacy written/practical/workbook/exam records preserved; new course starts independently.');
 await page.locator('.pc-part-card li a').first().click();await page.locator('[data-pc-complete]').waitFor();
 assert.equal(await page.locator('main textarea').count(),0);await page.locator('[data-pc-complete]').click();
 assert.equal((await snapshot()).practicalCourse.completed[0],'sp1-01');await page.reload();await page.locator('[data-pc-complete][aria-pressed="true"]').waitFor();
 await shot('lesson-desktop');
 await page.locator('.pc-reading-nav a[href="#practice/practical/course/sp1-01"]').click();await page.locator('#pq-draft').waitFor();
 const draft='1. 자격·등록과 기준일을 확인한다.\n2. 대표자 변경·권한·승인을 검토한다. </textarea><script>window.injected=true</script>';
 await page.locator('#pq-draft').fill(draft);await page.locator('details.pc-case>summary').click();await page.locator('[data-pq-check]').first().check();
 await page.locator('[data-pq-complete]').click();assert.ok((await snapshot()).practicalCoursePractice.completed.includes('sp1-01'));
 await page.reload();await page.locator('#pq-draft').waitFor();assert.equal(await page.locator('#pq-draft').inputValue(),draft);assert.equal(await page.evaluate(()=>window.injected),undefined);
 assert.deepEqual((await snapshot()).practicalCoursePractice.checks['sp1-01'],[0]);
 await page.locator('#pq-draft').fill('수정한 답안: 등록·대리인 권한·승인 결과를 확인한다.');
 assert.deepEqual((await snapshot()).practicalCoursePractice.checks['sp1-01'],[]);assert.ok(!(await snapshot()).practicalCoursePractice.completed.includes('sp1-01'));
 assert.ok((await snapshot()).practicalCourse.completed.includes('sp1-01'));checks.push('New chapter completion and case drafts/checks restore; editing resets case review only and escapes HTML.');
 await go('practice');assert.equal(await page.locator('.course-choice').count(),2);await shot('expected-hub-desktop');
 await page.locator('.course-choice a[href="#practice/practical"]').click();await page.locator('.pq-card').first().waitFor();assert.equal(await page.locator('.pq-card:visible').count(),55);
 await shot('questions-desktop');await page.locator('[data-pq-filter="source"]').selectOption('course');assert.equal(await page.locator('.pq-card:visible').count(),18);
 await page.locator('[data-pq-filter="part"]').selectOption('4');assert.equal(await page.locator('.pq-card:visible').count(),4);
 await page.locator('[data-pq-filter="search"]').fill('공동');assert.equal(await page.locator('.pq-card:visible').count(),1);
 await page.locator('[data-pq-filter="search"]').fill('없는키워드');assert.equal(await page.locator('.pq-card:visible').count(),0);assert.equal(await page.locator('#pq-no-results').isVisible(),true);
 await page.locator('[data-pq-filter="search"]').fill('');await page.locator('[data-pq-filter="part"]').selectOption('all');await page.locator('[data-pq-filter="source"]').selectOption('all');
 await page.locator('[data-pq-filter="status"]').selectOption('written');assert.equal(await page.locator('.pq-card:visible').count(),3);checks.push('All 55 practical questions and combined PART/source/status/search filters work.');
 await go('practical/1/p1-1');assert.ok(page.url().endsWith('#practice/practical/unit/p1-1'));assert.equal(await page.locator('[data-pr-draft]').inputValue(),'기존 출제기준 답안');
 await page.locator('[data-pr-draft]').fill('기존 사례 수정 저장');await page.reload();assert.equal(await page.locator('[data-pr-draft]').inputValue(),'기존 사례 수정 저장');
 await go('theory/practical/questions/cap-cost-01');assert.ok(page.url().endsWith('#practice/practical/capture/cap-cost-01'));assert.equal(await page.locator('[data-workbook-draft]').inputValue(),'기존 캡처 답안');
 await page.locator('[data-workbook-draft]').fill('2,800,000원 → 3,337,400원');await page.locator('.wb-solution>summary').click();assert.ok((await page.locator('.wb-solution').innerText()).includes('3,337,400'));
 await page.locator('[data-workbook-check]').first().check();await page.locator('[data-workbook-action="complete"]').click();await page.reload();assert.equal(await page.locator('[data-workbook-draft]').inputValue(),'2,800,000원 → 3,337,400원');
 await page.locator('.wb-linked-theory a').first().click();assert.ok(page.url().includes('#theory/practical/part/'));checks.push('Old unit and capture URLs redirect to expected questions and retain editable answers. Capture solutions link to new theory.');
 for(const ch of practicalChapters){await go(practicalChapterUrl(ch));assert.equal(await page.locator('main h1').innerText(),ch.title);assert.equal(await page.locator('main textarea').count(),0);await noOverflow();}
 for(const q of practicalExpectedBank){await go('practice/practical/'+q.source+'/'+q.id);assert.equal(await page.locator('main textarea').count(),1);}
 checks.push('Every one of the 18 theory topics and 55 practical problem destinations renders.');
 await go('theory/practical/criteria');assert.equal(await page.locator('.pc-criteria-row').count(),25);
 await go('theory/practical/print');assert.equal(await page.locator('.pc-print-chapter').count(),18);assert.equal(await page.locator('main textarea').count(),0);
 await go('practice/practical/print');assert.equal(await page.locator('.pc-print-chapter').count(),43);assert.equal(await page.locator('.wb-print-question').count(),12);
 await go('practice/written');assert.equal(await page.locator('.library-card').count(),3);
 await page.locator('.library-card[href="#practice/1"]').click();assert.ok((await page.locator('main').innerText()).includes('CHAPTER별 문제 관리'));
 await go('practice/1/1-01');await page.locator('.question-row').first().locator('[data-action="single-question"]').first().click();await page.locator('.quiz-card').waitFor();assert.equal(await page.locator('.option').count(),4);checks.push('Written PART/chapter quiz remains accessible with four choices; crosswalk and print views cover every practical item.');
 await go('mock/written');assert.equal(await page.locator('[name="mock-format"]').count(),2);
 await go('mock/practical');assert.equal(await page.locator('[name="practical-mock-format"]').count(),2);assert.ok((await page.locator('.pm-history').innerText()).includes('캡처 12문제'));
 await page.locator('[data-pm-action="start"]').click();await page.locator('#pm-draft').waitFor();assert.equal(await page.locator('.pm-question-dots button').count(),8);await page.locator('#pm-draft').fill('통합 후 모의고사 답안');await page.reload();assert.equal(await page.locator('#pm-draft').inputValue(),'통합 후 모의고사 답안');checks.push('Written/practical mock choices, existing history and active practical answer restoration remain available.');
 for(const width of [390,320]){
   await page.setViewportSize({width,height:844});
   for(const route of ['theory/practical','theory/practical/part/4/sp4-04','practice','practice/practical','practice/practical/course/sp4-04','practice/practical/capture/cap-cost-02']){await go(route);await noOverflow();if(width===390)await shot(route==='theory/practical'?'theory-mobile':route==='practice/practical'?'questions-mobile':route==='theory/practical/part/4/sp4-04'?'lesson-mobile':route==='practice/practical/course/sp4-04'?'answer-mobile':route==='practice'?'expected-hub-mobile':'capture-mobile');}
 }
 checks.push('390px and 320px layouts fit without horizontal page overflow.');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 const report={ok:true,checks,errors,failed,visitedTheory:18,visitedPractical:55};fs.writeFileSync('tmp/practical-course-browser-check.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await context.close();await browser.close();}
