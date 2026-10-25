import test from 'node:test';
import assert from 'node:assert/strict';
import { practicalParts, practicalChapters, practicalQuestionUrl } from '../practical-course.js';
import { practicalExpectedBank } from '../practical-bank.js';
import { renderPracticalQuestions, filterPracticalQuestions } from '../practical-question-ui.js';
import { renderPracticalCourse } from '../practical-course-ui.js';
import { resolveCourseRoute } from '../learning-hubs.js';

test('Practical question entry follows the theory curriculum with seven PART cards and eighteen chapter destinations',()=>{
  const html=renderPracticalQuestions();
  assert.equal((html.match(/data-pq-part-card="/g)||[]).length,7);
  assert.equal((html.match(/class="pq-card"/g)||[]).length,0);
  for(const part of practicalParts){
    const count=practicalExpectedBank.filter(q=>q.part===part.id).length;
    assert.ok(html.includes(`data-pq-part-card="${part.id}"`));
    assert.ok(html.includes(part.title)&&html.includes(`${count}문제`));
  }
  for(const ch of practicalChapters)assert.ok(html.includes(`#practice/practical/part/${ch.part}/${ch.id}`),ch.id);
  assert.ok(html.includes('#practice/practical/all')&&html.includes('#practice/practical/print'));
});

test('Every PART shows all and only its questions grouped by the matching theory chapters',()=>{
  const seen=new Set();
  for(const part of practicalParts){
    const html=renderPracticalQuestions({source:'part',questionId:String(part.id)});
    const bank=practicalExpectedBank.filter(q=>q.part===part.id);
    assert.equal((html.match(/class="pq-card"/g)||[]).length,bank.length,part.id);
    assert.equal((html.match(/data-pq-chapter-group="/g)||[]).length,practicalChapters.filter(ch=>ch.part===part.id).length);
    for(const q of practicalExpectedBank){
      const present=html.includes(`href="${practicalQuestionUrl(q.source,q.id)}"`);
      assert.equal(present,q.part===part.id,q.source+':'+q.id);
      if(present)seen.add(q.source+':'+q.id);
    }
  }
  assert.equal(seen.size,practicalExpectedBank.length);
});

test('Chapter URLs scope lists, support reload routing and offer paths back from every question format',()=>{
  for(const ch of practicalChapters){
    const target=resolveCourseRoute(`#practice/practical/part/${ch.part}/${ch.id}`);
    assert.deepEqual(target,{page:'practice',mode:'practical',source:'part',questionId:String(ch.part),chapterId:ch.id});
    const html=renderPracticalQuestions(target);
    const expected=practicalExpectedBank.filter(q=>q.chapter.id===ch.id);
    assert.equal((html.match(/class="pq-card"/g)||[]).length,expected.length,ch.id);
    for(const q of expected)assert.ok(html.includes(practicalQuestionUrl(q.source,q.id)),q.id);
    const theory=renderPracticalCourse({segment:'part',unitId:String(ch.part),chapterId:ch.id});
    assert.ok(theory.includes(`href="#practice/practical/part/${ch.part}/${ch.id}">관련 단원 예상문제`));
  }
  for(const source of ['course','unit','capture','core','review']){
    const q=practicalExpectedBank.find(q=>q.source===source);
    const html=renderPracticalQuestions({source,questionId:q.id});
    assert.ok(html.includes(`href="#practice/practical/part/${q.part}">← PART ${q.part}`),source);
    assert.ok(html.includes(`href="#practice/practical/part/${q.part}/${q.chapter.id}"`),source);
  }
  assert.equal((renderPracticalQuestions({source:'part',questionId:'invalid'}).match(/data-pq-part-card="/g)||[]).length,7);
  const wrongChapter=renderPracticalQuestions({source:'part',questionId:'1',chapterId:'sp3-01'});
  assert.equal((wrongChapter.match(/class="pq-card"/g)||[]).length,practicalExpectedBank.filter(q=>q.part===1).length);
});

test('Existing answer and completion records appear in scoped lists and PART progress without mutations',()=>{
  const q=practicalExpectedBank.find(q=>q.source==='review'&&q.part===3);
  const reviewPractice={completed:[q.id],drafts:{[q.id]:'작성한 답안'},checks:{[q.id]:[0]}};
  const before=JSON.stringify(reviewPractice);
  const overview=renderPracticalQuestions({reviewPractice});
  assert.ok(overview.includes('답안 작성 1 · 학습 완료 1'));
  const part=renderPracticalQuestions({source:'part',questionId:'3',chapterId:q.chapter.id,reviewPractice});
  assert.ok(part.includes('data-pq-status="completed" data-pq-written="true"'));
  assert.ok(part.includes('답안 작성 1 · 완료 1'));
  const all=renderPracticalQuestions({source:'all',reviewPractice});
  assert.equal((all.match(/class="pq-card"/g)||[]).length,practicalExpectedBank.length);
  assert.equal(JSON.stringify(reviewPractice),before);
});

test('Filtering a PART hides empty chapter groups and restores them after clearing the search',()=>{
  const nodes=[{hidden:false,dataset:{pqPart:'1',pqChapter:'sp1-01',pqSource:'review',pqBatch:'drive-20261024',pqWritten:'false',pqStatus:'unwritten',pqTitle:'등록 권한 점검'}},{hidden:false,dataset:{pqPart:'1',pqChapter:'sp1-02',pqSource:'review',pqBatch:'drive-20261024',pqWritten:'false',pqStatus:'unwritten',pqTitle:'목록 번호 확인'}}];
  const groups=nodes.map(node=>({hidden:false,querySelectorAll(){return [node];}}));
  const values={source:'all',batch:'all',status:'all',search:'등록'},count={},empty={};
  const root={querySelector(selector){if(selector==='#pq-visible-count')return count;if(selector==='#pq-no-results')return empty;const key=selector.match(/data-pq-filter="(.*?)"/)?.[1];return values[key]===undefined?null:{value:values[key]};},querySelectorAll(selector){return selector==='.pq-card'?nodes:groups;}};
  filterPracticalQuestions(root);
  assert.deepEqual(groups.map(g=>g.hidden),[false,true]);assert.equal(count.textContent,'1문제 표시');
  values.search='';filterPracticalQuestions(root);
  assert.deepEqual(groups.map(g=>g.hidden),[false,false]);assert.equal(count.textContent,'2문제 표시');
  values.search='없는문제';filterPracticalQuestions(root);
  assert.deepEqual(groups.map(g=>g.hidden),[true,true]);assert.equal(empty.hidden,false);
});
