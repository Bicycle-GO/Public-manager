import { practicalChapters, practicalParts, practicalChapterUrl, practicalQuestionUrl, findPracticalChapter, chapterForUnit, chapterForCapture, normalizeCoursePractice } from './practical-course.js';
import { courseEsc as esc, courseList, courseReferences } from './practical-course-ui.js';
import { practicalUnits, normalizePracticalState } from './practical-data.js';
import { normalizeWorkbookState } from './practical-workbook.js';
import { renderWorkbook, renderWorkbookPrint, renderWorkbookLinks } from './practical-workbook-ui.js';
import { teaching, exercise } from './practical-ui.js';
import { practicalExpectedBank, practicalSourceLabels, practicalSourceCounts, practicalBankSummary } from './practical-bank.js';
import { findCoreQuestion, normalizeCorePractice } from './practical-core-questions.js';
import { findReviewedQuestion, normalizeReviewedPractice } from './practical-capture-review.js';
import { renderCoreQuestion, renderCoreQuestionPrint } from './practical-core-ui.js';
export { practicalExpectedBank } from './practical-bank.js';

const sourceNames=Object.fromEntries(Object.entries(practicalSourceLabels).map(([key,label])=>[key,`${label} ${practicalSourceCounts[key]}`]));
const heading=(title,description)=>`<div class="page-heading"><div><div class="eyebrow">EXPECTED QUESTIONS · PRACTICAL</div><h1>${esc(title)}</h1><p>${esc(description)}</p></div><a class="soft-button" href="#practice/practical/print">실기 문제 전체 · 인쇄</a></div>`;
const breadcrumb=chapter=>`<nav class="pr-breadcrumb" aria-label="실기 예상문제 경로"><a href="#practice">예상문제</a><span>/</span><a href="#practice/practical">실기 전체 문제</a><span>/</span><a href="${practicalChapterUrl(chapter)}">PART ${chapter.part} · 관련 기본이론 →</a></nav>`;
const storeFor=(q,state)=>q.source==='review'?state.practicalCaptureReview:q.source==='core'?state.practicalCorePractice:q.source==='course'?state.practicalCoursePractice:q.source==='unit'?state.practical:state.practicalWorkbook;

function directory(state) {
  const total=practicalExpectedBank.length;
  const completed=practicalExpectedBank.filter(q=>storeFor(q,state).completed.includes(q.id)).length,written=practicalExpectedBank.filter(q=>storeFor(q,state).drafts[q.id]?.trim()).length;
  return `${heading('실기 예상문제','7개 PART의 사례와 기존 출제기준·캡처 문제를 한곳에서 풀고 답안 작성까지 연습하세요.')}<section class="pq-intro"><div><span class="pr-pill">필답형 · 계산 · 서술 · 단답 연습</span><h2>먼저 써 보고, 이유를 이해하세요.</h2><p>조건 확인 → 나의 답안 작성 → 모범답안·풀이 비교 → 자가점검<br>입력한 답안은 이 브라우저에 자동 저장됩니다.</p></div><div><strong>${total}<span>문제</span></strong><p>${esc(practicalBankSummary)}</p><small>답안 작성 ${written}/${total} · 완료 ${completed}/${total}</small></div></section><aside class="pc-scope"><strong>5장 캡처 검토 · PART 1 단원 핵심문제 ${practicalSourceCounts.review}개</strong><p>나라장터 등록·인증 8문제와 물품목록화 3문제를 정리했습니다. 아래 ‘문제 구성’에서 ‘단원 핵심문제 · 검토본’을 선택하세요. 원문과 공식 안내를 대조한 수정 이유, 쉬운 개념 설명, 답안 작성 틀과 단계별 풀이를 제공합니다. 목록화 03의 잘린 부분은 공식 자료로 보충했습니다.</p><p>앞서 제공한 시장분석·수요예측/STP·원가계산 주제의 핵심 응용문제 ${practicalSourceCounts.core}개도 계속 학습할 수 있습니다.</p></aside><div class="pq-toolbar"><label>PART<select data-pq-filter="part"><option value="all">전체 7개 PART</option>${practicalParts.map(p=>`<option value="${p.id}">PART ${p.id} · ${esc(p.title)}</option>`).join('')}</select></label><label>단원<select data-pq-filter="chapter"><option value="all">전체 18개 단원</option>${practicalChapters.map(ch=>`<option value="${ch.id}">PART ${ch.part} · ${esc(ch.title)}</option>`).join('')}</select></label><label>문제 구성<select data-pq-filter="source"><option value="all">전체 ${total}문제</option>${Object.entries(sourceNames).map(([key,name])=>`<option value="${key}">${name}</option>`).join('')}</select></label><label>학습 상태<select data-pq-filter="status"><option value="all">전체 상태</option><option value="unwritten">아직 미작성</option><option value="written">답안 작성함</option><option value="completed">학습 완료</option></select></label><label>문제 검색<input type="search" data-pq-filter="search" placeholder="예: 공동계약, 원가계산"></label></div><div class="pq-results"><p role="status" id="pq-visible-count">${total}문제 표시</p><a href="#theory/practical">실기 기본이론 목차 →</a></div><div class="pq-grid">${practicalExpectedBank.map(q=>{
    const saved=storeFor(q,state),done=saved.completed.includes(q.id),draft=!!saved.drafts[q.id]?.trim();
    return `<article class="pq-card" data-pq-part="${q.part}" data-pq-chapter="${q.chapter.id}" data-pq-source="${q.source}" data-pq-status="${done?'completed':draft?'written':'unwritten'}" data-pq-written="${draft}" data-pq-title="${esc(q.title+' '+q.chapter.title)}"><div class="pq-card-meta"><span>PART ${q.part} · ${esc(q.kind)}</span><small>${done?'✓ 학습 완료':draft?'작성한 답안 있음':'아직 미작성'}</small></div><h2><a href="${practicalQuestionUrl(q.source,q.id)}">${esc(q.title)}</a></h2><p>${sourceNames[q.source].replace(/ \d+$/,'')} · ${esc(practicalParts[q.part-1].title)}</p><div><a href="${practicalQuestionUrl(q.source,q.id)}">문제·답안 연습 →</a><a href="${practicalChapterUrl(q.chapter)}">기본이론</a></div></article>`;
  }).join('')}</div><p id="pq-no-results" class="pc-scope" hidden>조건에 맞는 문제가 없습니다. PART·단원·문제 구성·상태·검색어를 바꿔 보세요.</p><aside class="pc-scope"><strong>학습 기록은 그대로 이어집니다</strong><p>기존 출제기준 25개 사례와 캡처 12개 문제의 답안·자가점검·완료 기록은 유지됩니다. 주제별 사례·핵심 응용문제·단원 핵심문제 검토본·기본이론의 완료 기록은 각각 저장합니다. 문항과 점검표는 자체 학습용이며 공식 기출·채점표가 아닙니다.</p><a href="#mock/practical">실기 모의고사로 시간 연습하기 →</a></aside>`;
}

function courseQuestion(chapter,state) {
  const done=state.completed.includes(chapter.id),checks=state.checks[chapter.id]||[],draft=state.drafts[chapter.id]||'';
  return `${heading(chapter.title,'새 기본이론 18개 주제와 연결한 자체 작성 사례 · 조건과 절차를 나누어 답해 보세요.')}${breadcrumb(chapter)}<article class="pc-reading-card pq-writing"><span class="pr-pill">PART ${chapter.part} · 주제별 사례</span><h2>문제</h2><p class="pc-scenario">${esc(chapter.scenario)}</p><label for="pq-draft">나의 답안</label><p id="pq-draft-help" class="pr-help">질문의 요구사항과 개수를 확인한 뒤 조건·근거·판단·조치를 써 보세요. 정오 자동 채점은 하지 않으며 해설과 비교해 직접 점검합니다.</p><textarea id="pq-draft" rows="9" data-pq-draft="${chapter.id}" aria-describedby="pq-draft-help" placeholder="1. 문제의 조건과 적용 기준을 확인한다.&#10;2. 판단·처리 절차와 확인할 서류를 설명한다.&#10;3. 후속 조치와 기록을 정리한다.">${esc(draft)}</textarea><p id="pq-save-status" class="pr-save-status" role="status" aria-live="polite">${draft?'저장된 답안을 불러왔습니다.':'입력하면 이 브라우저에 자동 저장됩니다.'}</p><details class="pc-case"><summary>모범답안 · 자세한 풀이 · 자가점검</summary><div><p class="pr-help">표현이 같을 필요는 없습니다. 아래 내용과 조건·판단·절차가 맞는지 비교하세요. 사례와 해설은 자체 작성했습니다.</p>${chapter.answer.map((answer,i)=>`<section><h3>${String(i+1).padStart(2,'0')} · 답안 예시</h3><p>${esc(answer)}</p><p class="pc-reason"><strong>풀이와 작성 이유</strong> ${esc(chapter.reasons[i])}</p></section>`).join('')}<section class="pc-traps"><h3>자주 하는 실수</h3>${courseList(chapter.pitfalls,'ul')}</section><fieldset class="pq-checks"><legend>내 답안의 핵심 내용을 직접 확인하세요</legend>${chapter.checks.map((text,i)=>`<label><input type="checkbox" data-pq-check="${chapter.id}" value="${i}" ${checks.includes(i)?'checked':''}><span>${esc(text)}</span></label>`).join('')}</fieldset><p id="pq-check-status" role="status">자가점검 ${checks.length}/${chapter.checks.length} 충족</p><h3>개념을 다시 확인하려면</h3><p>${esc(chapter.intro)}</p><a href="${practicalChapterUrl(chapter)}">용어·절차·서류를 기본이론에서 읽기 →</a>${courseReferences(chapter)}</div></details><button class="button ${done?'outline':''}" data-pq-complete="${chapter.id}" aria-pressed="${done}">${done?'✓ 이 문제 학습 완료 · 누르면 해제':'이 문제 학습 완료하기'}</button><p class="pr-help">완료는 직접 표시합니다. 답안을 수정하면 완료·자가점검을 초기화하여 다시 확인하도록 돕습니다.</p></article>`;
}

function printable(state) {
  return `${heading('실기 예상문제 전체 학습자료',`${practicalBankSummary} · 총 ${practicalExpectedBank.length}문제와 모범답안입니다.`)}<div class="pr-print-tools"><button class="button" data-pr-action="print">인쇄 · PDF 저장</button><a href="#practice/practical">실기 문제 목차</a></div>${practicalParts.map(part=>`<section class="pc-print-part"><h2>PART ${part.id}. ${esc(part.title)}</h2>${practicalExpectedBank.filter(q=>q.part===part.id&&q.source!=='capture').map(q=>{
    if(q.source==='review')return renderCoreQuestionPrint(findReviewedQuestion(q.id),state.practicalCaptureReview);
    if(q.source==='core')return renderCoreQuestionPrint(findCoreQuestion(q.id),state.practicalCorePractice);
    const chapter=q.source==='course'?findPracticalChapter(q.id):null,unit=chapter||practicalUnits.find(u=>u.id===q.id),saved=storeFor(q,state);
    return `<article class="pc-reading-card pc-print-chapter"><span>${sourceNames[q.source]}</span><h3>${esc(q.title)}</h3><p>${esc(chapter?chapter.scenario:unit.prompt)}</p>${saved.drafts[q.id]?`<h4>나의 답안</h4><p class="pr-print-draft">${esc(saved.drafts[q.id])}</p>`:''}<h4>모범답안</h4>${courseList(unit.answer)}${chapter?`<h4>작성 이유</h4>${courseList(chapter.reasons)}`:''}<h4>자가점검</h4>${courseList(unit.checks,'ul')}</article>`;
  }).join('')}</section>`).join('')}${renderWorkbookPrint(state.practicalWorkbook,true)}`;
}

export function renderPracticalQuestions({source='',questionId='',practical={},workbook={},coursePractice={},corePractice={},reviewPractice={}}={}) {
  const state={practical:normalizePracticalState(practical),practicalWorkbook:normalizeWorkbookState(workbook),practicalCoursePractice:normalizeCoursePractice(coursePractice),practicalCorePractice:normalizeCorePractice(corePractice),practicalCaptureReview:normalizeReviewedPractice(reviewPractice)};
  let html;
  if(source==='print') html=printable(state);
  else if(source==='review'&&findReviewedQuestion(questionId)) html=renderCoreQuestion(findReviewedQuestion(questionId),state.practicalCaptureReview);
  else if(source==='core'&&findCoreQuestion(questionId)) html=renderCoreQuestion(findCoreQuestion(questionId),state.practicalCorePractice);
  else if(source==='capture') {
    const chapter=chapterForCapture(questionId);
    html=`${chapter?breadcrumb(chapter):'<a class="pc-back" href="#practice/practical">← 실기 예상문제 전체</a>'}${renderWorkbook(questionId,state.practicalWorkbook)}`;
  } else if(source==='course'&&findPracticalChapter(questionId)) html=courseQuestion(findPracticalChapter(questionId),state.practicalCoursePractice);
  else if(source==='unit'&&practicalUnits.some(u=>u.id===questionId)) {
    const unit=practicalUnits.find(u=>u.id===questionId),chapter=chapterForUnit(questionId);
    html=`${heading(unit.title,'첨부 출제기준의 세부항목에 연결한 기존 사례 · 저장한 답안을 이어서 작성하세요.')}${breadcrumb(chapter)}<article class="pc-reading-card"><details class="pc-case"><summary>관련 개념·절차 먼저 보기</summary><div>${teaching(unit)}<a href="${practicalChapterUrl(chapter)}">새 기본이론에서 더 자세히 읽기 →</a></div></details>${exercise(unit,state.practical)}${renderWorkbookLinks(unit.id,state.practicalWorkbook)}</article>`;
  } else html=directory(state);
  return `<div class="practical practical-questions ${source==='print'||questionId==='print'?'pr-print-view':''}">${html}</div>`;
}

export function filterPracticalQuestions(root=document) {
  const value=key=>root.querySelector(`[data-pq-filter="${key}"]`)?.value||'all';
  const part=value('part'),chapter=value('chapter'),source=value('source'),status=value('status'),search=(root.querySelector('[data-pq-filter="search"]')?.value||'').trim().toLocaleLowerCase();
  let count=0;
  root.querySelectorAll('.pq-card').forEach(card=>{
    const matches=(part==='all'||card.dataset.pqPart===part)&&(chapter==='all'||card.dataset.pqChapter===chapter)&&(source==='all'||card.dataset.pqSource===source)&&(status==='all'||(status==='written'?card.dataset.pqWritten==='true':status==='unwritten'?card.dataset.pqWritten!=='true':card.dataset.pqStatus===status))&&card.dataset.pqTitle.toLocaleLowerCase().includes(search);
    card.hidden=!matches;if(matches)count++;
  });
  const countNode=root.querySelector('#pq-visible-count');if(countNode)countNode.textContent=`${count}문제 표시`;
  const empty=root.querySelector('#pq-no-results');if(empty)empty.hidden=count!==0;
}
