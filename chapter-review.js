
import { questions, lessons } from './data.js';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const chapterReview={
 '3-04':{
  title:'용역계약 절차 및 이행',
  sourceStatus:'용역 추가 원문 미확인',
  missing:'현재 조회 가능한 대화에서 이 단원의 추가 문제 원문을 확인하지 못했습니다. 이전에 제공되었는지와 번호·전체 문항 수는 미확인 상태이며, 자료 누락으로 단정하지 않습니다.',
  groups:[
   {title:'착수·과업·인력과 성과관리',ids:[302,303,316,317,320,322]},
   {title:'지체·검사·대가·정산',ids:[308,330,331,334,342]},
   {title:'기술용역 평가와 낙찰',ids:[380,381,390,397]}
  ]
 },
 '3-05':{
  title:'다수공급자계약(MAS)관리',
  sourceStatus:'MAS 추가 원문 미확인',
  missing:'현재 조회 가능한 대화에서 MAS 관리의 추가 문제 원문을 확인하지 못했습니다. 이전 제공 여부는 미확인 상태입니다. 아래 관련 복습은 기존 전자조달·조달계획 문제를 연결한 것이며, 새 원문을 추가한 것이 아닙니다.',
  groups:[
   {title:'계약 구조와 종합쇼핑몰',ids:[107,223]},
   {title:'2단계경쟁과 가격관리',ids:[114,118,122]}
  ]
 },
 '3-06':{
  title:'공사계약관리',
  sourceStatus:'대화 22~25번 반영 · 01~21번 원문 미확인',
  missing:'공사계약 묶음은 22~25번 본문을 확인해 반영했습니다. 01~21번은 현재 조회에서 원문과 이전 제공 여부를 확인하지 못했습니다. CHAPTER 07의 01~25번은 별도의 공사 특화·하도급 문제 묶음입니다.',
  groups:[
   {title:'금액 조정·보증·지체·하자',ids:[324,326,327,333,336,348]},
   {title:'공사 심사·입찰과 설계변경',ids:[374,376,377,379,388,392]}
  ]
 }
};
export function relatedQuestions(lessonId){
 const review=chapterReview[lessonId];
 if(!review)return [];
 const ids=[...new Set(review.groups.flatMap(g=>g.ids))];
 return ids.map(id=>questions.find(q=>q.id===id)).filter(Boolean);
}
export function chapterCoverage(lessonId){
 if(!chapterReview[lessonId])return null;
 const own=questions.filter(q=>q.lesson===lessonId);
 const imported=own.filter(q=>q.collection==='construction-general');
 return {total:own.length,conversation:imported.length,existing:own.length-imported.length,related:relatedQuestions(lessonId).length};
}
export function renderCoverageBadge(lessonId){
 const review=chapterReview[lessonId];
 return review?'<span class="coverage-status">'+esc(review.sourceStatus)+'</span>':'';
}
export function renderChapterReview(lessonId,{withRelated=true}={}){
 const review=chapterReview[lessonId],coverage=chapterCoverage(lessonId);
 if(!review)return '';
 return '<section class="card chapter-source-review" aria-label="'+esc(review.title)+' 수록 현황"><span class="subject-label">문항 수록 재검토 · 2026. 10. 1.</span><h2>수록 현황과 원문 확인 상태</h2><p><strong>'+esc(review.sourceStatus)+'</strong></p><p>'+esc(review.missing)+'</p><dl class="coverage-counts"><div><dt>이 단원 등록</dt><dd>'+coverage.total+'문항</dd></div><div><dt>확인된 대화 문항</dt><dd>'+coverage.conversation+'문항</dd></div><div><dt>기존 확인문제</dt><dd>'+coverage.existing+'문항</dd></div></dl><p class="small-text">관련 문항은 원래 단원의 번호·정답·풀이 기록을 유지합니다. 이 단원의 등록 수나 원문 반영 수에 중복 합산하지 않습니다.</p>'+
 (withRelated?'<h3>기존 자료로 연계 복습 · '+coverage.related+'문항</h3><div class="overview-intro-actions"><button class="button" data-action="start-related" data-id="'+lessonId+'">관련 '+coverage.related+'문항 모아 풀기 →</button><a href="#theory/3/'+lessonId+'">이 단원 기본이론 →</a></div>'+review.groups.map(group=>'<section><h4>'+esc(group.title)+'</h4><ul class="related-question-links">'+group.ids.map(id=>{
 const q=questions.find(x=>x.id===id),lesson=lessons.find(l=>l.id===q.lesson);
 const number=q.sourceNumber?'대화 '+String(q.sourceNumber).padStart(2,'0')+'번':q.providedNumber?'제공자료 '+String(q.providedNumber).padStart(2,'0')+'번':'기존 확인문제';
 return '<li><button class="soft-button" data-action="single-question" data-id="'+q.id+'">'+esc(q.topic||q.text)+'</button><small>원래 위치: PART '+String(q.subject).padStart(2,'0')+' · CHAPTER '+String(lesson.chapter).padStart(2,'0')+' '+esc(lesson.title)+' · '+number+'</small></li>';
 }).join('')+'</ul></section>').join(''):'')+
 '<p class="small-text">추가 원문이 확인되면 출처와 번호를 대조해 반영합니다. 조회 결과에 없다는 사실만으로 이전 자료의 제공 여부나 누락 여부를 확정할 수 없습니다.</p></section>';
}
