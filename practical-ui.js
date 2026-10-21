import { renderWorkbook, renderWorkbookShortcut, renderWorkbookLinks, renderWorkbookPrint } from './practical-workbook-ui.js';
import { practicalAreas, practicalUnits, practicalEdition, practicalSources, practicalPlan, answerFramework, practicalProgress, normalizePracticalState } from './practical-data.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const number = n => String(n).padStart(2, '0');
const link = (area, unit = '') => `#practical/${area}${unit ? '/' + unit : ''}`;
const list = (values, tag = 'ol') => `<${tag}>${values.map(value => `<li>${esc(value)}</li>`).join('')}</${tag}>`;
const sourceLinks = refs => refs.map(key => `<a href="${esc(practicalSources[key].url)}" target="_blank" rel="noopener noreferrer">${esc(practicalSources[key].title)} ↗</a>`).join('');

export function renderLearningPath(writtenCompleted = 0) {
  return `<section class="learning-path" aria-label="필기에서 실기로 이어지는 학습 과정"><a href="#theory/written"><span class="path-step">01</span><div><small>제1편 · 개념과 문제 풀이</small><strong>필기 기본이론</strong><p>3개 PART · 18개 CHAPTER · 이론 ${writtenCompleted}/18 완료</p></div><span aria-hidden="true">→</span></a><a href="#theory/practical" class="path-practical"><span class="path-step">02</span><div><small>제2편 · 절차와 답안 작성</small><strong>실기 기본이론</strong><p>7개 PART · 18개 주제 · 필답형 기초 학습</p></div><span aria-hidden="true">→</span></a></section>`;
}

function heading(title, description, eyebrow = 'VOLUME 02 · PRACTICAL') {
  return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${esc(title)}</h1><p>${esc(description)}</p></div><a class="soft-button" href="#practical/print">전체 학습자료 · 인쇄</a></div>`;
}

function facts() {
  return `<div class="pr-facts"><span><b>실기과목</b> ${practicalEdition.subject}</span><span><b>검정방법</b> ${practicalEdition.method}</span><span><b>시험시간</b> 2시간 30분</span><span><b>기준 적용기간</b> ${practicalEdition.period}</span></div>`;
}

function scope() {
  return `<section class="pr-source-note"><h2>학습자료의 범위와 확인 근거</h2><p>${esc(practicalEdition.provenance)}</p><p>출제기준의 상위 항목은 첨부 이미지 기준입니다. 상세 금액·기한·예외는 시험의 법령 적용 기준일, 기관 유형과 공고를 확인하세요. 교재의 장별 구성이 공식 출제범위와 항상 일치하는 것은 아닙니다.</p><div class="pr-source-links">${sourceLinks(['exam', 'learning'])}</div><small>자료 작성: ${practicalEdition.updated} · 링크는 관련 규정·안내를 확인하기 위한 참고 자료입니다.</small></section>`;
}

function plan() {
  return `<section class="pr-section" id="practical-plan" tabindex="-1"><div class="pr-section-heading"><div><span class="eyebrow">28 DAY STUDY PLAN</span><h2>필기 다음, 4주 실기 학습계획</h2></div><span>하루 40~60분 권장 · 자체 제안 계획</span></div><div class="pr-plan-grid">${practicalPlan.map(item => `<article class="pr-panel"><span class="pr-week">${item.week}주차 · ${item.days}</span><h3>${esc(item.title)}</h3><p>주요항목 ${item.areas.join('·')}</p>${list(item.tasks, 'ul')}</article>`).join('')}</div></section>`;
}

function timedPractice() {
  return `<section class="pr-panel pr-timed"><span class="eyebrow">150 MINUTE WRITING PRACTICE</span><h2>마지막 주, 150분 종합 작성 연습</h2><p>각 영역의 첫 사례 1개씩, 총 8문항으로 연습합니다. <strong>8문항 구성과 시간 배분은 앱의 연습용 제안이며 실제 시험 문항 수·배점을 뜻하지 않습니다.</strong> 먼저 문제만 읽고 종이에 답안을 쓴 뒤 모범답안으로 누락을 점검하세요.</p><div class="pr-time-grid"><div><strong>10분</strong><span>조건·질문 분석</span></div><div><strong>120분</strong><span>8문항 작성 · 각 15분</span></div><div><strong>20분</strong><span>누락·근거·단위 검토</span></div></div><div class="pr-chip-links">${practicalAreas.map(area => `<a href="${link(area.id, area.units[0].id)}">${number(area.id)} ${esc(area.units[0].title)} →</a>`).join('')}</div></section>`;
}

function overview(state, writtenLessons, writtenCompleted, workbook) {
  const progress = practicalProgress(state);
  const next = practicalUnits.find(item => !state.completed.includes(item.id)) || practicalUnits[0];
  return `${heading('실기 기본이론', practicalEdition.title+' · 필기 개념을 업무 절차와 사례 답안으로 연결하세요.')}${renderLearningPath(writtenCompleted.length)}
  <section class="pr-hero"><div><span class="pr-pill">첨부 출제기준에 맞춘 학습 과정</span><h2>알고 있는 개념을,<br>쓸 수 있는 답안으로.</h2><p>핵심 개념을 읽고 업무 순서를 정리한 뒤,<br>사례에 답하며 실기 서술 능력을 키워 보세요.</p><a class="button" href="${link(next.areaId, next.id)}">${progress.completed ? '다음 세부항목 학습하기' : '실기 첫 학습 시작하기'} →</a><a class="pr-hero-plan" href="#practical" data-pr-action="plan">4주 계획 보기 ↓</a></div><div class="pr-hero-summary"><span>공공조달 관리실무</span><strong>8<span>개 주요항목</span></strong><strong>25<span>개 세부항목 · 사례 연습</span></strong><p>필답형 · 2시간 30분</p></div></section>${facts()}
  ${renderWorkbookShortcut(workbook)}
  <section class="pr-stats" aria-label="실기 학습 현황"><div><span>세부항목 학습 완료</span><strong>${progress.completed}<small> / ${progress.total}</small></strong></div><div><span>직접 작성한 사례 답안</span><strong>${progress.written}<small> / ${progress.total}</small></strong></div><div><span>자가점검 충족 항목</span><strong>${progress.checked}<small> / ${progress.possible}</small></strong></div></section>
  <section class="pr-section"><div class="pr-section-heading"><div><span class="eyebrow">EXAM CRITERIA · 01–08</span><h2>출제기준에 따라 차례로 공부하기</h2></div><span>명칭·순서: 사용자 첨부 이미지</span></div><div class="pr-area-grid">${practicalAreas.map(area => {
    const p = practicalProgress(state, area.id);
    const prerequisites = area.written.map(id => writtenLessons.find(l => l.id === id)).filter(Boolean);
    const done = prerequisites.filter(l => writtenCompleted.includes(l.id)).length;
    return `<article class="pr-area-card"><div class="pr-area-top"><span class="pr-area-number">${number(area.id)}</span><span>${p.completed}/${p.total} 학습 완료</span></div><h3><a href="${link(area.id)}">${esc(area.title)}</a></h3><p>${esc(area.focus)}</p><ul>${area.units.map(item => `<li><a href="${link(area.id, item.id)}"><span>${state.completed.includes(item.id) ? '✓' : '·'}</span>${esc(item.title)}<span aria-hidden="true">→</span></a></li>`).join('')}</ul><div class="pr-prerequisite">필기 연결 ${prerequisites.length}단원 · ${done}단원 완료 <a href="${link(area.id)}">복습과 실기 학습 →</a></div></article>`;
  }).join('')}</div></section>
  <section class="pr-panel pr-framework"><span class="eyebrow">HOW TO WRITE</span><h2>조건 → 근거 → 판단·절차 → 조치·기록</h2><p>질문에서 요구한 개수와 작성 주체를 먼저 확인합니다. 네 단계는 답안을 정리하기 위한 학습 틀이며 모든 문제의 정답 형식은 아닙니다.</p><div>${answerFramework.map(([title, body], i) => `<article><span>${i + 1}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('')}</div></section>
  ${plan()}${timedPractice()}${scope()}`;
}

export function teaching(item) {
  return `<section class="pr-lesson-section"><h3>01 · 핵심 개념</h3><p>${esc(item.concept)}</p></section><section class="pr-lesson-section"><h3>02 · 업무 처리 순서</h3>${list(item.steps)}</section><section class="pr-work-product"><h3>03 · 작성할 서류와 기록</h3><p>${esc(item.document)}</p></section>${item.calculation ? `<section class="pr-calculation"><h3>계산 원리 확인</h3><p>${esc(item.calculation.formula)}</p><strong>${esc(item.calculation.expression)}</strong><p>${esc(item.calculation.note)}</p></section>` : ''}<section class="pr-pitfall"><h3>답안에서 주의할 점</h3><p>${esc(item.pitfall)}</p></section>`;
}

export function exercise(item, state) {
  const checked = state.checks[item.id] || [];
  const completed = state.completed.includes(item.id);
  return `<section class="pr-exercise" aria-labelledby="exercise-${item.id}"><span class="pr-pill">자체 작성 · 필답형 연습</span><h3 id="exercise-${item.id}">04 · 사례에 직접 답해 보세요</h3><p class="pr-prompt">${esc(item.prompt)}</p><label for="draft-${item.id}">나의 답안</label><p class="pr-help" id="draft-help-${item.id}">조건·근거·처리 순서·후속 조치를 써 보세요. 답안은 이 브라우저의 학습 기록에 자동 저장됩니다.</p><textarea id="draft-${item.id}" data-pr-draft="${item.id}" aria-describedby="draft-help-${item.id}" rows="7" placeholder="1. 문제의 조건과 적용 기준을 확인한다.&#10;2. 판단 근거와 처리 절차를 설명한다.&#10;3. 후속 조치와 남길 기록을 정리한다.">${esc(state.drafts[item.id] || '')}</textarea><div class="pr-save-status" role="status" aria-live="polite" id="pr-save-status">${state.drafts[item.id] ? '저장된 답안을 불러왔습니다.' : '입력하면 자동 저장됩니다.'}</div>
  <details class="pr-model"><summary>모범답안과 자가점검 펼치기</summary><p class="pr-help">아래는 학습용 예시입니다. 표현이 같아야 하는 것은 아니며, 질문의 조건과 핵심 내용이 맞는지 비교하세요. 자동 정오 판정·공식 점수는 제공하지 않습니다.</p>${list(item.answer)}<fieldset><legend>내 답안의 핵심 내용을 직접 확인하세요</legend>${item.checks.map((text, index) => `<label><input type="checkbox" data-pr-check="${item.id}" value="${index}" ${checked.includes(index) ? 'checked' : ''}><span>${esc(text)}</span></label>`).join('')}</fieldset><p class="pr-check-status" role="status">자가점검 ${checked.length}/3 충족</p></details>
  <button class="button ${completed ? 'outline' : ''}" data-pr-action="complete" data-id="${item.id}" aria-pressed="${completed}">${completed ? '✓ 학습 완료 · 누르면 해제' : '이 세부항목 학습 완료하기'}</button><p class="pr-help">학습 완료는 직접 표시합니다. 답안을 고치면 자가점검을 초기화하여 다시 확인하도록 돕습니다.</p></section>`;
}

function areaPage(area, requestedUnit, state, writtenLessons, writtenCompleted, workbook) {
  const item = area.units.find(u => u.id === requestedUnit) || area.units[0];
  const index = practicalUnits.findIndex(u => u.id === item.id);
  const previous = practicalUnits[index - 1], next = practicalUnits[index + 1];
  return `${heading(area.title, area.focus, `VOLUME 02 · 주요항목 ${number(area.id)}`)}<nav class="pr-breadcrumb" aria-label="실기 경로"><a href="#practical">실기 전체 목차</a><span>/</span><span>주요항목 ${area.id}</span><span>/</span><span>${esc(item.title)}</span></nav>
  <div class="pr-reading-layout"><aside class="pr-reading-nav"><label for="pr-area-select">주요항목 이동</label><select id="pr-area-select">${practicalAreas.map(a => `<option value="${a.id}" ${a.id === area.id ? 'selected' : ''}>${a.id}. ${esc(a.title)}</option>`).join('')}</select><nav aria-label="이 영역의 세부항목">${area.units.map((u, i) => `<a href="${link(area.id, u.id)}" ${u.id === item.id ? 'aria-current="page"' : ''}><span>${state.completed.includes(u.id) ? '✓' : i + 1}</span>${esc(u.title)}</a>`).join('')}</nav><div class="pr-written-links"><h2>필기에서 먼저 복습하기</h2><p>필기를 모두 완료하지 않아도 실기를 시작할 수 있습니다.</p>${area.written.map(id => {
    const lesson = writtenLessons.find(l => l.id === id);
    return lesson ? `<a href="#theory/${lesson.subject}/${lesson.id}"><span>${writtenCompleted.includes(id) ? '✓ 완료' : '복습'}</span>${esc(lesson.title)} ↗</a>` : '';
  }).join('')}</div><a class="soft-button" href="#practical">8개 영역 전체 보기</a></aside>
  <article class="pr-lesson"><div class="pr-lesson-heading"><span class="eyebrow">주요항목 ${number(area.id)} · 세부항목 ${area.units.indexOf(item) + 1}/${area.units.length}</span><h2>${esc(item.title)}</h2><p>개념 이해 → 업무 절차 → 서류 확인 → 사례 작성 → 자가점검</p></div>${teaching(item)}${exercise(item, state)}${renderWorkbookLinks(item.id, workbook)}<section class="pr-lesson-sources"><h3>관련 공식 자료</h3>${sourceLinks(area.refs)}<p>절차는 학습용으로 정리했습니다. 법정 수치·예외·서류는 적용 규정과 공고의 기준을 확인하세요.</p></section><nav class="pr-pagination" aria-label="이전·다음 실기 세부항목">${previous ? `<a href="${link(previous.areaId, previous.id)}">← 이전<small>${esc(previous.title)}</small></a>` : '<a href="#practical">← 실기 목차</a>'}${next ? `<a href="${link(next.areaId, next.id)}">다음 →<small>${esc(next.title)}</small></a>` : '<a href="#practical">전체 복습으로 →</a>'}</nav></article></div>`;
}

function printable(state, workbook) {
  return `${heading('실기 전체 학습자료', '25개 세부항목과 캡처 기반 12문제를 한 번에 읽고 인쇄하거나 PDF로 저장하세요.')}<div class="pr-print-tools"><button class="button" data-pr-action="print">인쇄 · PDF로 저장</button><a class="soft-button" href="#practical">실기 목차로</a><p>브라우저 인쇄 창에서 PDF 저장을 선택할 수 있습니다. 모범답안과 저장한 내 답안도 포함됩니다.</p></div>${facts()}<section class="pr-print-intro"><h2>답안 작성 기본 틀</h2>${list(answerFramework.map(([title, text]) => `${title}: ${text}`))}</section>${practicalAreas.map(area => `<section class="pr-print-area"><h2>${area.id}. ${esc(area.title)}</h2>${area.units.map(item => `<article class="pr-panel pr-print-unit"><h3>${esc(item.title)}</h3>${teaching(item)}<h4>사례 연습</h4><p>${esc(item.prompt)}</p>${state.drafts[item.id] ? `<h4>저장한 나의 답안</h4><p class="pr-print-draft">${esc(state.drafts[item.id])}</p>` : ''}<h4>학습용 모범답안</h4>${list(item.answer)}<h4>자가점검</h4>${list(item.checks, 'ul')}</article>`).join('')}<div class="pr-source-links">${sourceLinks(area.refs)}</div></section>`).join('')}${renderWorkbookPrint(workbook, true)}${plan()}${scope()}`;
}

export function renderPractical({ segment = '', unitId = '', practical = {}, workbook = {}, writtenLessons = [], writtenCompleted = [] } = {}) {
  const state = normalizePracticalState(practical);
  let content;
  if (segment === 'questions') content = renderWorkbook(unitId, workbook);
  else if (segment === 'print') content = printable(state, workbook);
  else {
    const area = practicalAreas.find(a => String(a.id) === segment);
    content = area ? areaPage(area, unitId, state, writtenLessons, writtenCompleted, workbook) : overview(state, writtenLessons, writtenCompleted, workbook);
  }
  return `<div class="practical ${(segment === 'print' || (segment === 'questions' && unitId === 'print')) ? 'pr-print-view' : ''}">${content}</div>`;
}
