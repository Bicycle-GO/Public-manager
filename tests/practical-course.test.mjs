import test from 'node:test';
import assert from 'node:assert/strict';
import { practicalParts, practicalChapters, courseSources, chapterForUnit, chapterForCapture, normalizePracticalCourse, normalizeCoursePractice, practicalChapterUrl } from '../practical-course.js';
import { practicalUnits } from '../practical-data.js';
import { workbookQuestions } from '../practical-workbook.js';
import { practicalExpectedBank, renderPracticalQuestions } from '../practical-question-ui.js';
import { coreQuestions } from '../practical-core-questions.js';
import { reviewedQuestions } from '../practical-capture-review.js';
import { renderPracticalCourse } from '../practical-course-ui.js';
import { resolveCourseRoute, renderPracticeHub, renderCourseTabs } from '../learning-hubs.js';

test('Requested practical curriculum contains seven PARTs and eighteen substantive learning topics in order',()=>{
  assert.equal(practicalParts.length,7);
  assert.deepEqual(practicalParts.map(p=>practicalChapters.filter(ch=>ch.part===p.id).length),[2,2,3,4,3,2,2]);
  assert.deepEqual(practicalChapters.map(ch=>ch.title),[
    '나라장터(KONEPS) 사용자 등록 실무','공급 유형별 물품목록화 실무','조달데이터허브 및 시장분석','수요예측 및 마케팅 전략',
    '원가계산 및 비목 산정','입찰서류 작성 및 평가 대응','적격심사 및 PQ 실무','제안서 작성 실무',
    '낙찰 및 계약 체결','계약변경(E/S) 및 종결','공동계약 관리','MAS 계약 및 쇼핑몰 운영','공사·용역계약 특성',
    '혁신·디지털서비스 계약','리스크 식별 및 영향도 분석','리스크 대응 및 통계전략','전략적 조달 및 우선구매','부정당제재 및 분쟁 해결'
  ]);
  assert.equal(new Set(practicalChapters.map(ch=>ch.id)).size,18);
  for(const ch of practicalChapters){
    assert.ok(ch.intro.length>65,ch.id);
    assert.equal(ch.terms.length,3);assert.equal(ch.sections.length,3);assert.equal(ch.steps.length,4);
    for(const [,text] of ch.sections)assert.ok(text.length>75,ch.id);
    assert.ok(ch.documents.length>=2&&ch.pitfalls.length>=2&&ch.checks.length===3);
    assert.ok(ch.scenario.length>50);assert.equal(ch.answer.length,ch.reasons.length);
    for(const key of ch.refs)assert.ok(courseSources[key]&&new URL(courseSources[key][1]).protocol==='https:');
  }
});

test('Crosswalk preserves all original twenty-five criteria and twelve capture questions without duplicating bank IDs',()=>{
  for(const unit of practicalUnits){const ch=chapterForUnit(unit.id);assert.ok(ch&&ch.units.includes(unit.id),unit.id);}
  for(const q of workbookQuestions){const ch=chapterForCapture(q.id);assert.ok(ch&&ch.captures.includes(q.id),q.id);}
  assert.equal(practicalExpectedBank.length,55+coreQuestions.length+reviewedQuestions.length);
  assert.equal(new Set(practicalExpectedBank.map(q=>q.source+':'+q.id)).size,55+coreQuestions.length+reviewedQuestions.length);
  assert.deepEqual(practicalExpectedBank.filter(q=>!['core','review'].includes(q.source)).reduce((r,q)=>(r[q.source]=(r[q.source]||0)+1,r),{}),{course:18,unit:25,capture:12});
  assert.equal(chapterForUnit('p5-2').part,5);
  const crosswalk=renderPracticalCourse({segment:'criteria'});
  for(const unit of practicalUnits)assert.ok(crosswalk.includes('unit/'+unit.id));
});

test('Practical course stores are independent from legacy answers and reject invalid references or check indices',()=>{
  const legacy={completed:['p1-1'],drafts:{'p1-1':'기존 답안'},checks:{'p1-1':[0]}};
  const before=JSON.stringify(legacy);
  assert.deepEqual(normalizePracticalCourse(legacy),{completed:[],lastChapter:null});
  assert.deepEqual(normalizePracticalCourse({completed:['sp1-01','sp1-01','bad'],lastChapter:'sp7-02'}),{completed:['sp1-01'],lastChapter:'sp7-02'});
  assert.deepEqual(normalizeCoursePractice({completed:['sp2-01','bad'],drafts:{'sp2-01':'25%','bad':'x','sp1-01':12},checks:{'sp2-01':[0,0,2,3,-1,'1']}}),{completed:['sp2-01'],drafts:{'sp2-01':'25%'},checks:{'sp2-01':[0,2]}});
  for(const value of [null,2,'bad']){
    assert.deepEqual(normalizePracticalCourse(value),{completed:[],lastChapter:null});
    assert.deepEqual(normalizeCoursePractice(value),{completed:[],drafts:{},checks:{}});
  }
  assert.equal(JSON.stringify(legacy),before);
});

test('Theory renders all eighteen reading destinations without answer inputs; exercises and print safely restore drafts',()=>{
  const overview=renderPracticalCourse();
  for(const ch of practicalChapters){
    assert.ok(overview.includes(practicalChapterUrl(ch)));
    const html=renderPracticalCourse({segment:'part',unitId:String(ch.part),chapterId:ch.id});
    assert.ok(html.includes(ch.title)&&html.includes('data-pc-complete="'+ch.id+'"'));
    assert.ok(!html.includes('<textarea')&&!html.includes('type="checkbox"'));
    assert.ok(html.includes('#practice/practical/course/'+ch.id));
  }
  const attack='</textarea><script>window.injected=true</script>';
  const value={drafts:{'sp1-01':attack},completed:['sp1-01'],checks:{'sp1-01':[0]}};
  const page=renderPracticalQuestions({source:'course',questionId:'sp1-01',coursePractice:value});
  assert.ok(page.includes('&lt;/textarea&gt;&lt;script&gt;')&&!page.includes(attack));
  assert.ok(page.includes('data-pq-draft="sp1-01"')&&page.includes('풀이와 작성 이유'));
  assert.ok(page.includes('data-pq-check="sp1-01" value="0" checked'));
  const theoryPrint=renderPracticalCourse({segment:'print'}),questionPrint=renderPracticalQuestions({source:'print',coursePractice:value});
  for(const ch of practicalChapters)assert.ok(theoryPrint.includes(ch.title)&&questionPrint.includes(ch.scenario));
  assert.ok(questionPrint.includes('&lt;script&gt;')&&!questionPrint.includes('<textarea'));
  assert.equal((questionPrint.match(/class="wb-print-question"/g)||[]).length,12);
});

test('Expected questions have written and practical entry points and every old practical draft URL remains reachable',()=>{
  assert.equal(resolveCourseRoute('#practice').mode,'hub');
  assert.equal(resolveCourseRoute('#practice/written').mode,'written');
  assert.deepEqual(resolveCourseRoute('#practice/2/2-04/wrong'),{page:'practice',mode:'written',subjectId:'2',lessonId:'2-04',statusId:'wrong'});
  assert.deepEqual(resolveCourseRoute('#theory/practical/part/4/sp4-04'),{page:'theory',mode:'practical',segment:'part',unitId:'4',chapterId:'sp4-04'});
  for(const unit of practicalUnits)assert.equal(resolveCourseRoute('#theory/practical/'+unit.areaId+'/'+unit.id).canonical,'#practice/practical/unit/'+unit.id);
  for(const q of workbookQuestions)assert.equal(resolveCourseRoute('#practical/questions/'+q.id).canonical,'#practice/practical/capture/'+q.id);
  const hub=renderPracticeHub(),tabs=renderCourseTabs('practice','practical');
  assert.ok(hub.includes('필기 예상문제')&&hub.includes('실기 예상문제')&&hub.includes(`${practicalExpectedBank.length}문제`));
  assert.ok(tabs.includes('실기 예상문제')&&tabs.includes('href="#practice/practical" aria-current="page"'));
});

test('Worked cases distinguish price bases, changes, PQ, joint responsibility and statistical signals',()=>{
  const text=id=>JSON.stringify(practicalChapters.find(ch=>ch.id===id));
  assert.ok(text('sp3-01').includes('3,337,400원')&&text('sp3-01').includes('94,000원'));
  assert.ok(text('sp4-03').includes('8,000,000원')&&text('sp4-03').includes('조정 대상 대가'));
  assert.ok(text('sp3-03').includes('사업수행능력평가')&&text('sp3-03').includes('낙찰 확정이 아니다'));
  assert.ok(text('sp4-04').includes('대외 책임')&&text('sp4-04').includes('구성원 교체'));
  assert.ok(text('sp6-02').includes('36÷40×100=90%')&&text('sp6-02').includes('내부 경보선'));
});
