import {chromium} from 'file:///C:/Users/kwg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({channel:'msedge',headless:true}),context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage();
try {
 await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:3015/?final=desktop#theory/practical');await page.locator('.pr-facts').waitFor();assert.ok((await page.locator('.pr-facts').innerText()).includes('2시간 30분'));await page.screenshot({path:'tmp/practical-course-theory-desktop.png',fullPage:true,animations:'disabled'});
 for(const width of [390,320]) {
  await page.setViewportSize({width,height:844});await page.goto('http://127.0.0.1:3015/?final='+width+'#theory/practical');await page.locator('.pr-facts').waitFor();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(width===390)await page.screenshot({path:'tmp/practical-course-theory-mobile.png',fullPage:true,animations:'disabled'});
  await page.locator('[data-action="menu"]').click();const target=page.locator('.sidebar a[href="#practice/practical"]');await target.click();await page.locator('.pq-card').first().waitFor();assert.equal(await page.locator('.pq-card').count(),55);
 }
 await page.goto('http://127.0.0.1:3015/?final=focus#practice/practical/course/sp1-01');await page.locator('[data-pq-complete]').click();assert.equal(await page.locator('[data-pq-complete]').evaluate(el=>document.activeElement===el),true);
 await page.goto('http://127.0.0.1:3015/?final=filters#practice/practical');await page.locator('[data-pq-filter="status"]').selectOption('written');assert.equal(await page.locator('.pq-card:visible').count(),0);await page.locator('[data-pq-filter="status"]').selectOption('unwritten');assert.equal(await page.locator('.pq-card:visible').count(),55);
 const path='tmp/practical-course-browser-check.json',report=JSON.parse(fs.readFileSync(path));report.checks.push('Updated exam facts and mobile sidebar entry work at 390px/320px; completion keeps focus and blank completed answers stay unwritten.');fs.writeFileSync(path,JSON.stringify(report,null,2));console.log('Final mobile menu, exam facts, focus and written-status checks passed.');
}finally{await context.close();await browser.close();}
