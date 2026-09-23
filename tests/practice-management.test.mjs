import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../data.js';
import {practiceQuestions, questionsByStatus, renderPracticeDirectory, renderPracticeStatus, renderPracticeNavigation, renderPracticeGroups} from '../practice-ui.js';

test('Each PART directory links only to its ordered chapter management pages',()=>{
  for(const part of [1,2,3]){
    const html=renderPracticeDirectory(part,{answers:{},bookmarks:[]});
    const links=[...html.matchAll(/href="#practice\/(\d)\/(\d-\d{2})"/g)];
    assert.deepEqual(links.map(m=>m[2]),lessons.filter(l=>l.subject===part).map(l=>l.id));
    assert.ok(links.every(m=>+m[1]===part));
    assert.ok(!html.includes('data-action="single-question"'));
  }
});

test('Chapter status counts partition answered records and keep bookmarks independent',()=>{
  const list=practiceQuestions(1,'1-02'),[a,b,c]=list;
  const state={answers:{[a.id]:a.answer,[b.id]:(b.answer+1)%4,999:0},bookmarks:['q'+a.id,'q'+c.id,'l1-02','q999']};
  const snapshot=structuredClone(state);
  assert.deepEqual(questionsByStatus(list,state,'correct').map(q=>q.id),[a.id]);
  assert.deepEqual(questionsByStatus(list,state,'wrong').map(q=>q.id),[b.id]);
  assert.equal(questionsByStatus(list,state,'unanswered').length,list.length-2);
  assert.deepEqual(questionsByStatus(list,state,'saved').map(q=>q.id),[a.id,c.id]);
  assert.deepEqual(state,snapshot);
  const chapter=lessons.find(l=>l.id==='1-02');
  const html=renderPracticeStatus(chapter,state,'wrong');
  assert.ok(html.includes('href="#practice/1/1-02/wrong" aria-current="page"'));
  assert.equal((html.match(/aria-current/g)||[]).length,1);
  assert.ok(renderPracticeDirectory(1,state).includes('풀이 완료 2 / 8'));
  const filtered=renderPracticeGroups(1,chapter,q=>`<p data-id="${q.id}">question</p>`,questionsByStatus(list,state,'wrong'));
  assert.ok(filtered.includes(`data-id="${b.id}"`));
  assert.ok(!filtered.includes(`data-id="${a.id}"`));
  assert.ok(!filtered.includes('start-principles'));
});

test('Chapter pagination stays inside its PART and exposes a return to the directory',()=>{
  for(const chapter of lessons){
    const html=renderPracticeNavigation(chapter);
    assert.ok(html.includes(`href="#practice/${chapter.subject}"`));
    for(const [,part,id] of html.matchAll(/href="#practice\/(\d)\/(\d-\d{2})"/g)){
      assert.equal(+part,chapter.subject);
      assert.equal(Math.abs(lessons.find(l=>l.id===id).chapter-chapter.chapter),1);
    }
  }
});
