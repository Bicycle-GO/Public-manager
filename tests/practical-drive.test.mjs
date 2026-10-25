import test from 'node:test';
import assert from 'node:assert/strict';
import { driveReviewedQuestions } from '../practical-drive-review.js';
import { driveSources } from '../practical-drive-sources.js';
import { driveLearning } from '../practical-drive-learning.js';
import { captureReviewedQuestions, reviewedQuestions, normalizeReviewedPractice } from '../practical-capture-review.js';
import { practicalExpectedBank } from '../practical-bank.js';
import { findPracticalChapter } from '../practical-course.js';
import { renderPracticalCourse } from '../practical-course-ui.js';
import { renderPracticalQuestions, filterPracticalQuestions } from '../practical-question-ui.js';

test('All 46 Drive photographs have traceable coverage and every new question cites a reviewed photograph',()=>{
  assert.equal(driveSources.length,46);
  assert.equal(new Set(driveSources.map(s=>s.filename)).size,46);
  assert.equal(new Set(driveSources.map(s=>s.fileId)).size,46);
  const questions=new Map(driveReviewedQuestions.map(q=>[q.id,q]));
  const files=new Set(driveSources.map(s=>s.filename));
  assert.equal(questions.size,driveReviewedQuestions.length);
  assert.equal(practicalExpectedBank.length,78+questions.size);
  assert.equal(captureReviewedQuestions.length,11);
  for(const source of driveSources){
    assert.ok(source.page&&source.status&&source.topics.length,source.filename);
    assert.ok(source.questionIds.length,source.filename);
    for(const id of source.questionIds)assert.ok(questions.has(id),source.filename+': '+id);
  }
  for(const q of questions.values()){
    assert.ok(findPracticalChapter(q.chapterId),q.id);
    assert.equal(q.batch,'drive-20261024');
    assert.equal(q.answer.length,q.reasons.length,q.id);
    assert.ok(q.answer.length>=3&&q.concepts.length>=2&&q.blueprint.length>=3&&q.checks.length>=3,q.id);
    assert.ok(q.sourceNumber&&q.sourceNote&&q.reviewNotice,q.id);
    assert.ok(q.sourceFiles.length,q.id);
    for(const filename of q.sourceFiles)assert.ok(files.has(filename),q.id+': '+filename);
    assert.ok(driveSources.some(s=>s.questionIds.includes(q.id)),q.id);
    for(const ref of q.refs)assert.equal(new URL(ref.url).protocol,'https:');
  }
});

test('New theory retains existing supplements and links each new question to its chapter',()=>{
  for(const [chapterId,supplements] of Object.entries(driveLearning)){
    const chapter=findPracticalChapter(chapterId);
    assert.ok(chapter,chapterId);
    const html=renderPracticalCourse({segment:'part',unitId:String(chapter.part),chapterId});
    for(const notes of supplements){
      assert.ok(html.includes(notes.title),chapterId);
      assert.ok(notes.notes.length&&notes.examples.length&&notes.selfExplain.length,notes.title);
      for(const id of notes.questions){
        assert.equal(driveReviewedQuestions.find(q=>q.id===id)?.chapterId,chapterId,id);
        assert.ok(html.includes('#practice/practical/review/'+id),id);
      }
    }
  }
  for(const q of driveReviewedQuestions)assert.ok(driveLearning[q.chapterId]?.some(n=>n.questions.includes(q.id)),q.id);
  const printed=renderPracticalCourse({segment:'print'});
  for(const supplements of Object.values(driveLearning))for(const notes of supplements)assert.ok(printed.includes(notes.title));
});

test('Drive and older reviewed answers coexist, escape drafts and appear in question and print views',()=>{
  const q=driveReviewedQuestions[0],old=captureReviewedQuestions[0],attack='</textarea><script>bad()</script>';
  const raw={drafts:{[q.id]:attack,[old.id]:'기존 답안',unknown:'bad'},completed:[q.id,old.id,'unknown'],checks:{[q.id]:[0,0,-1,999]}};
  const state=normalizeReviewedPractice(raw);
  assert.deepEqual(state.drafts,{[old.id]:'기존 답안',[q.id]:attack});
  assert.deepEqual(state.checks[q.id],[0]);
  assert.deepEqual(state.completed,[q.id,old.id]);
  for(const item of driveReviewedQuestions){
    const html=renderPracticalQuestions({source:'review',questionId:item.id,reviewPractice:raw});
    assert.ok(html.includes('data-pq-draft="'+item.id+'"')&&html.includes('data-pq-source="review"'),item.id);
    assert.ok(html.includes(item.sourceFiles[0])&&html.includes('2026-10-24'),item.id);
    assert.ok(!html.includes(attack));
  }
  const print=renderPracticalQuestions({source:'print',reviewPractice:raw});
  assert.ok(print.includes('&lt;/textarea&gt;')&&!print.includes('<textarea'));
  for(const item of reviewedQuestions)assert.ok(print.includes(item.title)&&print.includes(item.sourceFiles[0]));
});

test('Directory supports intersecting Drive batch, chapter and filename search without hiding older questions by default',()=>{
  const html=renderPracticalQuestions({source:'all'});
  assert.equal((html.match(/class="pq-card"/g)||[]).length,practicalExpectedBank.length);
  assert.ok(html.includes('data-pq-filter="batch"')&&html.includes('사진 46장'));
  assert.ok(html.includes('전체 '+practicalExpectedBank.length+'문제'));
  const q=driveReviewedQuestions[0];
  const values={part:'all',chapter:'all',source:'all',batch:'drive-20261024',status:'all',search:''};
  const nodes=practicalExpectedBank.map(item=>({hidden:false,dataset:{pqPart:String(item.part),pqChapter:item.chapter.id,pqSource:item.source,pqBatch:item.batch||'existing',pqTitle:item.title+' '+(item.searchText||''),pqWritten:'false',pqStatus:'unwritten'}}));
  const count={},empty={};
  const root={querySelector(selector){if(selector==='#pq-visible-count')return count;if(selector==='#pq-no-results')return empty;const key=selector.match(/data-pq-filter="(.*?)"/)?.[1];return {value:values[key]};},querySelectorAll(selector){return selector==='.pq-card'?nodes:[];}};
  filterPracticalQuestions(root);
  assert.equal(nodes.filter(n=>!n.hidden).length,driveReviewedQuestions.length);
  values.chapter=q.chapterId;values.search=q.sourceFiles[0];filterPracticalQuestions(root);
  assert.ok(nodes.some(n=>!n.hidden));
  assert.ok(nodes.filter(n=>!n.hidden).every(n=>n.dataset.pqBatch==='drive-20261024'&&n.dataset.pqChapter===q.chapterId&&n.dataset.pqTitle.includes(q.sourceFiles[0])));
  values.search='존재하지않는자료xyz';filterPracticalQuestions(root);
  assert.equal(count.textContent,'0문제 표시');assert.equal(empty.hidden,false);
});

test('Worked calculations retain independently checked amounts and distinguish their legal or exercise bases',()=>{
  const text=id=>driveReviewedQuestions.find(q=>q.id===id).answer.join(' ').replaceAll(' ','');
  assert.ok(text('drive-a-05').includes('19,228,000원')); // (16m + 0.8m + 0.68m) × 1.1
  assert.ok(text('drive-b-11').includes('10,000,000원')&&text('drive-b-11').includes('1,000,000원'));
  assert.ok(text('drive-b-05').includes('6,400,000원')); // 200m × 0.032
  assert.ok(text('drive-c-07').includes('3,464,450원')); // (2.9m + .145m + .1045m) × 1.1
  assert.ok(text('drive-c-14').includes('789,705,000원')&&text('drive-c-14').includes('784,000,000원'));
  assert.ok(text('drive-c-18').includes('68점')&&text('drive-c-18').includes('A는기술통과선미달'));
  assert.ok(text('drive-c-30').includes('90,000원'));
  assert.ok(text('drive-c-31').includes('150,000원'));
});
