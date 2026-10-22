import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewedQuestions,findReviewedQuestion,normalizeReviewedPractice} from '../practical-capture-review.js';
import {captureReviewLearning} from '../practical-registration-learning.js';
import {renderPracticalQuestions,practicalExpectedBank} from '../practical-question-ui.js';
import {renderPracticalCourse} from '../practical-course-ui.js';
import {practicalSourceCounts} from '../practical-bank.js';

test('Five supplied files map to eleven reviewed questions without losing continued or partial source boundaries',()=>{
  assert.equal(reviewedQuestions.length,11);
  assert.equal(new Set(reviewedQuestions.map(q=>q.id)).size,11);
  assert.deepEqual([...new Set(reviewedQuestions.flatMap(q=>q.sourceFiles))].sort(),['실기1.PNG','실기2-1.PNG','실기2.PNG','실기3.PNG','실기4.PNG'].sort());
  assert.deepEqual(findReviewedQuestion('review-reg-08').sourceFiles,['실기3.PNG','실기4.PNG']);
  assert.match(findReviewedQuestion('review-catalog-03').sourceNote+' '+findReviewedQuestion('review-catalog-03').reviewNotice,/일부|하단|잘린|뒷부분은 캡처에 없습니다/);
  for(const q of reviewedQuestions){
    assert.ok(q.sourceNumber&&q.reviewNotice&&q.sourceNote,q.id);
    assert.equal(q.answer.length,q.reasons.length,q.id);
    assert.ok(q.concepts.length>=2&&q.blueprint.length>=3&&q.checks.length>=3,q.id);
    assert.ok(q.refs.length&&q.corrections.length,q.id);
    for(const ref of q.refs)assert.equal(new URL(ref.url).protocol,'https:');
  }
  assert.equal(practicalSourceCounts.review,11);
  assert.equal(practicalExpectedBank.length,78);
});

test('Reviewed answers correct key source errors instead of teaching stale numbers or authentication as current rules',()=>{
  const answer=id=>findReviewedQuestion(id).answer.join(' ');
  assert.match(answer('review-reg-01'),/225\.1|225조\s*1[,.]?000/);
  assert.match(answer('review-reg-04'),/금융인증/);
  assert.match(answer('review-reg-05'),/폐지|의무.*없|현행.*적용/);
  assert.match(answer('review-reg-07'),/공지/);
  assert.match(answer('review-reg-08'),/권한|등록된|등록.*대리인/);
  assert.match(answer('review-catalog-02'),/8자리/);
  assert.match(answer('review-catalog-03'),/목록번호/);
  assert.match(answer('review-catalog-03'),/일련번호/);
});

test('Reviewed drafts remain isolated and escaped across question, directory and print views',()=>{
  const id='review-reg-08',draft='</textarea><script>bad()</script>';
  const raw={completed:[id,id,'core-data-01'],drafts:{[id]:draft,'core-data-01':'다른 저장소'},checks:{[id]:[0,0,-1,999,'1']}};
  const before=JSON.stringify(raw);
  assert.deepEqual(normalizeReviewedPractice(raw),{completed:[id],drafts:{[id]:draft},checks:{[id]:[0]}});
  assert.equal(JSON.stringify(raw),before);
  for(const invalid of [null,7,'bad',[],{drafts:[],checks:1,completed:{}}])assert.deepEqual(normalizeReviewedPractice(invalid),{completed:[],drafts:{},checks:{}});
  const html=renderPracticalQuestions({source:'review',questionId:id,reviewPractice:raw});
  assert.ok(html.includes('data-pq-source="review"'));
  assert.ok(html.includes('캡처의 표현')&&html.includes('검토 이유'));
  assert.ok(html.includes('&lt;/textarea&gt;&lt;script&gt;')&&!html.includes(draft));
  const printed=renderPracticalQuestions({source:'print',reviewPractice:raw});
  assert.ok(!printed.includes('<textarea')&&!printed.includes(draft));
  for(const q of reviewedQuestions)assert.ok(printed.includes(q.title)&&printed.includes(q.sourceFiles[0]));
});

test('Part 1 theory and question directory expose all source-reviewed destinations',()=>{
  for(const [chapterId,notes]of Object.entries(captureReviewLearning)){
    const html=renderPracticalCourse({segment:'part',unitId:'1',chapterId});
    assert.ok(html.includes(notes.title));
    for(const id of notes.questions){assert.ok(findReviewedQuestion(id));assert.ok(html.includes('#practice/practical/review/'+id));}
  }
  const html=renderPracticalQuestions();
  assert.equal((html.match(/class="pq-card"/g)||[]).length,78);
  assert.ok(html.includes('전체 78문제'));
  for(const q of reviewedQuestions)assert.ok(html.includes('#practice/practical/review/'+q.id));
});
