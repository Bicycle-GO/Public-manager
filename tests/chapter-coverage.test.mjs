
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {questions,lessons} from '../data.js';
import {chapterReview,chapterCoverage,relatedQuestions,renderChapterReview} from '../chapter-review.js';
import {renderPracticeDirectory} from '../practice-ui.js';
import {renderLessonGuide} from '../lesson-content.js';

test('Source audit distinguishes missing originals from registered and related questions',()=>{
 assert.equal(createHash('sha256').update(JSON.stringify(questions)).digest('hex'),'0c767af787be64834ec289e16e2368c5ed894656b139138895431796644cb27b');
 assert.deepEqual(chapterCoverage('3-04'),{total:1,conversation:0,existing:1,related:15});
 assert.deepEqual(chapterCoverage('3-05'),{total:1,conversation:0,existing:1,related:5});
 assert.deepEqual(chapterCoverage('3-06'),{total:5,conversation:4,existing:1,related:12});
 for(const id of Object.keys(chapterReview)){
  const related=relatedQuestions(id);
  assert.equal(related.length,new Set(related.map(q=>q.id)).size);
  for(const q of related){
   assert.equal(q,questions.find(record=>record.id===q.id));
   assert.notEqual(q.lesson,id);
  }
  const html=renderChapterReview(id);
  assert.ok(html.includes('원문 미확보'));
  assert.ok(html.includes('중복 합산하지 않습니다'));
  assert.ok(html.includes('원래 위치:'));
  assert.equal((html.match(/data-action="single-question"/g)||[]).length,related.length);
  assert.ok(!html.includes('undefined'));
 }
 assert.match(chapterReview['3-06'].missing,/01~21번/);
 assert.match(chapterReview['3-06'].missing,/별도의/);
});
test('Source coverage is visible in directory, theory and filtered chapter view',()=>{
 const directory=renderPracticeDirectory(3,{answers:{},bookmarks:[]});
 assert.equal((directory.match(/class="coverage-status"/g)||[]).length,3);
 for(const id of Object.keys(chapterReview)){
  assert.ok(directory.includes(chapterReview[id].sourceStatus));
  const html=renderLessonGuide(lessons.find(l=>l.id===id));
  assert.ok(html.includes(chapterReview[id].sourceStatus));
  const filtered=renderChapterReview(id,{withRelated:false});
  assert.ok(filtered.includes('미반영 범위'));
  assert.ok(!filtered.includes('single-question'));
  assert.ok(!filtered.includes('start-related'));
 }
 assert.equal(renderChapterReview('3-07'),'');
 assert.deepEqual(relatedQuestions('unknown'),[]);
 assert.equal(chapterCoverage('unknown'),null);
});
