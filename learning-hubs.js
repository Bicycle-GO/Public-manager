import { practicalExpectedBank, practicalSourceCounts } from './practical-bank.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function renderCourseTabs(section, selected) {
  const label = section === 'theory' ? '기본이론' : section === 'practice' ? '예상문제' : '모의고사';
  return `<nav class="course-mode-tabs" aria-label="${label} 구분"><a href="#${section}">전체 ${label}</a><a href="#${section}/written" ${selected === 'written' ? 'aria-current="page"' : ''}>필기 ${label}</a><a href="#${section}/practical" ${selected === 'practical' ? 'aria-current="page"' : ''}>실기 ${label}</a></nav>`;
}

function card({ mode, title, subtitle, count, details, href, action, progress }) {
  return `<article class="course-choice ${mode === 'practical' ? 'course-choice-practical' : ''}"><div class="course-choice-top"><span>${mode === 'practical' ? '02 · 실기' : '01 · 필기'}</span><span>${esc(subtitle)}</span></div><h2>${esc(title)}</h2><p class="course-choice-count">${esc(count)}</p><ul>${details.map(text => `<li>${esc(text)}</li>`).join('')}</ul><div class="course-choice-bottom"><p>${esc(progress)}</p><a class="button ${mode === 'practical' ? 'path-practical' : ''}" href="${href}">${esc(action)} →</a></div></article>`;
}

export function renderTheoryHub(writtenCompleted = 0, practicalCompleted = 0) {
  return `<div class="page-heading"><div><div class="eyebrow">FOUNDATIONS · WRITTEN & PRACTICAL</div><h1>기본이론</h1><p>필기로 개념을 이해하고, 실기로 업무 절차와 답안 작성의 기초를 다지세요.</p></div></div><div class="course-choices">${card({ mode:'written', title:'필기 기본이론', subtitle:'개념 · 비교 · 객관식 연결', count:'3개 PART · 18개 CHAPTER', details:['공공조달의 이해·계획·입찰·계약관리', '핵심 개념·비교표·사례와 계산 예제', 'CHAPTER별 예상문제와 복습 연결'], href:'#theory/written', action:'필기 기본이론 학습하기', progress:`기존 이론 학습 ${writtenCompleted}/18단원 완료` })}${card({ mode:'practical', title:'실기 기본이론', subtitle:'업무 절차 · 서류 · 필답형 기초', count:'7개 PART · 18개 CHAPTER', details:['등록·계획·원가·계약·유형별 관리·리스크·법제도', '핵심 개념 → 처리 절차 → 서류와 사례 해설', '예상문제의 실기 답안 연습·출제기준 대응표 연결'], href:'#theory/practical', action:'실기 기본이론 학습하기', progress:`실기 기본이론 ${practicalCompleted}/18주제 완료` })}</div><section class="course-bridge"><h2>이론을 익혔다면 모의고사로 확인하세요</h2><p>필기는 객관식 풀이와 자동 채점으로, 실기는 제한시간 안의 답안 작성과 제출 후 자가점검으로 연습합니다.</p><a href="#mock">필기·실기 모의고사 선택 →</a></section>`;
}

export function renderMockHub(writtenCount = 0, practicalCount = 0, active = null) {
  return `<div class="page-heading"><div><div class="eyebrow">MOCK EXAMS · CHOOSE YOUR STAGE</div><h1>모의고사</h1><p>준비하는 시험을 선택하고, 필기와 실기에 맞는 방식으로 실력을 확인하세요.</p></div></div>${active ? `<aside class="course-resume"><div><strong>진행 중인 실기 모의고사가 있습니다.</strong><p>작성한 답안은 저장되어 있으며 다른 화면에서도 제한시간은 계속됩니다.</p></div><a class="button" href="#mock/practical/run">이어서 응시하기 →</a></aside>` : ''}<div class="course-choices">${card({ mode:'written', title:'필기 모의고사', subtitle:'객관식 · 자동 채점', count:'60문항·90분 / 80문항·120분', details:['과목별 객관식 4지선다 무작위 출제', '제출 후 과목별 점수·평균·해설 확인', '기존 오답노트·북마크·응시 기록 연결'], href:'#mock/written', action:'필기 모의고사 선택하기', progress:`필기 응시 기록 ${writtenCount}회` })}${card({ mode:'practical', title:'실기 모의고사', subtitle:'필답형 · 제출 후 자가점검', count:'8개 영역 종합 / 캡처 12문제', details:['150분 동안 서술·단답·계산 답안 작성', '답안 자동 저장·재접속 이어하기·시간 종료 제출', '제출 후 모범답안·상세 풀이·자가점검 확인'], href:'#mock/practical', action:'실기 모의고사 선택하기', progress:`실기 제출 기록 ${practicalCount}회 · 문항 구성·자가점검 배점은 학습용` })}</div>`;
}

export function renderPracticeHub(writtenCount=452, writtenAnswered=0, practicalCompleted=0) {
  return `<div class="page-heading"><div><div class="eyebrow">EXPECTED QUESTIONS · WRITTEN & PRACTICAL</div><h1>예상문제</h1><p>필기는 객관식 개념 확인, 실기는 사례·계산·서술 답안 작성으로 연습하세요.</p></div></div><div class="course-choices">${card({mode:'written',title:'필기 예상문제',subtitle:'객관식 · CHAPTER별 풀이',count:`3개 PART · ${writtenCount}문항`,details:['PART·CHAPTER별 문제와 상세 해설','풀이 상태별 복습·오답노트·북마크','기존 풀이 기록과 연결'],href:'#practice/written',action:'필기 문제 풀기',progress:`최근 답안 기록 ${writtenAnswered}문항`})}${card({mode:'practical',title:'실기 예상문제',subtitle:'사례 · 계산 · 답안 연습',count:`7개 PART · ${practicalExpectedBank.length}문제`,details:[`단원 핵심문제 검토본 ${practicalSourceCounts.review}개`,`주제별 사례 ${practicalSourceCounts.course}개 · 핵심 응용문제 ${practicalSourceCounts.core}개`,`출제기준 사례 ${practicalSourceCounts.unit}개 · 캡처 문제 ${practicalSourceCounts.capture}개`,'나의 답안 자동 저장·모범답안·상세 풀이·자가점검'],href:'#practice/practical',action:'실기 문제·답안 연습하기',progress:`실기 문제 학습 완료 ${practicalCompleted}/${practicalExpectedBank.length}`})}</div><section class="course-bridge"><h2>개념이 헷갈리면 기본이론으로 돌아가세요</h2><p>각 실기 문제에서 관련 PART의 기본이론으로 이동할 수 있습니다. 시간 제한 연습은 필기·실기 모의고사에서 진행합니다.</p><a href="#theory">필기·실기 기본이론 보기 →</a></section>`;
}

// Preserve old record IDs while consolidating every answer-writing route under practice.
export function resolveCourseRoute(hash = '') {
  const parts = hash.replace(/^#/, '').split('/');
  const [page = '', first = '', second = '', third = '', fourth = ''] = parts;
  const capture = id => ({page:'practice',mode:'practical',source:'capture',questionId:id,canonical:'#practice/practical/capture'+(id?'/'+id:'')});
  const legacyUnit = (area,id) => id ? {page:'practice',mode:'practical',source:'unit',questionId:id,canonical:'#practice/practical/unit/'+id} : {page:'theory',mode:'practical',segment:'criteria',canonical:'#theory/practical/criteria'};
  if(page==='practical') {
    if(first==='questions')return capture(second);
    if(first==='print')return {page:'practice',mode:'practical',source:'print',canonical:'#practice/practical/print'};
    if(/^[1-8]$/.test(first))return legacyUnit(first,second);
    return {page:'theory',mode:'practical',canonical:'#theory/practical'};
  }
  if (page === 'theory') {
    if (first === 'practical') {
      if(second==='questions')return capture(third);
      if(/^[1-8]$/.test(second))return legacyUnit(second,third);
      return { page, mode:'practical', segment:second, unitId:third, chapterId:fourth };
    }
    if (first === 'written') {
      if (['1','2','3'].includes(second)) return { page, mode:'written', subjectId:second, lessonId:third, canonical:'#theory/' + second + (third ? '/' + third : '') };
      return { page, mode:'written' };
    }
    if (['1','2','3'].includes(first)) return { page, mode:'written', subjectId:first, lessonId:second };
    return { page, mode:'hub' };
  }
  if(page==='practice') {
    if(first==='practical')return {page,mode:'practical',source:second,questionId:third};
    if(first==='written') {
      if(['1','2','3'].includes(second))return {page,mode:'written',subjectId:second,lessonId:third,statusId:fourth,canonical:'#practice/'+second+(third?'/'+third:'')+(fourth?'/'+fourth:'')};
      return {page,mode:'written'};
    }
    if(['1','2','3'].includes(first))return {page,mode:'written',subjectId:first,lessonId:second,statusId:third};
    return {page,mode:'hub'};
  }
  if (page === 'mock') return { page, mode:['written','practical'].includes(first) ? first : 'hub', view:second, resultId:third };
  return { page, subjectId:first, lessonId:second, statusId:third, segment:first, unitId:second };
}
