import { workbookEdition, workbookQuestions, workbookGroups, workbookSources, normalizeWorkbookState, workbookProgress } from './practical-workbook.js';
import { costFoundation } from './practical-workbook.js';
import { chapterForUnit, practicalChapterUrl } from './practical-course.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const url = id => `#practice/practical/capture${id ? '/' + id : ''}`;
const lines = (items, tag = 'ol') => `<${tag}>${items.map(text => `<li>${esc(text)}</li>`).join('')}</${tag}>`;
const refs = keys => keys.map(key => `<a href="${esc(workbookSources[key].url)}" target="_blank" rel="noopener noreferrer">${esc(workbookSources[key].title)} ↗</a>`).join('');
const terms = values => `<dl class="wb-terms">${values.map(([term, text]) => `<div><dt>${esc(term)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl>`;
const table = (caption, headers, rows) => ({ caption, headers, rows });

function gridTable(value) {
  return `<div class="wb-table-wrap" role="region" aria-label="${esc(value.caption)}" tabindex="0"><table><caption>${esc(value.caption)}</caption><thead><tr>${value.headers.map(text => `<th scope="col">${esc(text)}</th>`).join('')}</tr></thead><tbody>${value.rows.map(row => `<tr>${row.map((text, i) => `<${i ? 'td' : 'th scope="row"'}>${esc(text)}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function heading(title, description, print = false) {
  return `<div class="page-heading"><div><div class="eyebrow">PRACTICAL WORKBOOK · CAPTURE STUDY</div><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${print ? '' : `<a class="soft-button" href="${url('print')}">12문제 전체 · 인쇄</a>`}</div>`;
}

export function renderWorkbookShortcut(value) {
  const p = workbookProgress(value);
  return `<section class="wb-shortcut"><div><span class="pr-pill">캡처 8장 · 새 실기 문제 12개</span><h2>개념을 이해하고, 답안까지 직접 써 보세요.</h2><p>조달데이터·수요예측·STP·원가계산을 쉬운 설명과 단계별 풀이로 공부합니다.</p><div class="wb-shortcut-meta"><span>계산형 5</span><span>서술형 4</span><span>괄호형 2</span><span>단답형 1</span><span>작성 ${p.written}/12 · 완료 ${p.completed}/12</span></div></div><a class="button" href="${url()}">캡처 실기 문제 풀기 →</a></section>`;
}

export function renderWorkbookLinks(unitId, value) {
  const questions = workbookQuestions.filter(q => q.units.includes(unitId));
  if (!questions.length) return '';
  const state = normalizeWorkbookState(value);
  return `<section class="wb-linked"><h3>캡처 문제로 더 연습하기</h3><p>이 개념을 실제 서술·계산 답안으로 연결해 보세요.</p>${questions.map(q => `<a href="${url(q.id)}"><span>${q.kind}</span>${esc(q.title)}<small>${state.completed.includes(q.id) ? '학습 완료 ✓' : '자세한 풀이 →'}</small></a>`).join('')}</section>`;
}

function provenance() {
  return `<section class="wb-provenance"><h2>캡처 반영 범위와 학습 기준</h2><p>${esc(workbookEdition.scope)}</p><p>${esc(workbookEdition.calculationRule)}</p><p>2024년 통계는 기준연도를 유지합니다. 공식 발표값과 반올림된 제시 비율로 다시 계산한 값은 구분하며, 법제도는 해당 시험의 적용 기준일과 공고를 확인합니다. STP와 수요예측의 단계·지표는 캡처의 학습 분류입니다.</p><small>정리·검산: ${workbookEdition.updated} · 원문 보정은 각 문제의 풀이에 사유와 함께 표시합니다.</small></section>`;
}

function directory(value) {
  const state = normalizeWorkbookState(value), p = workbookProgress(state);
  return `${heading(workbookEdition.title, '문제의 뜻부터 이해하고, 계산·서술의 근거를 따라 답안을 완성하세요.')}<nav class="pr-breadcrumb" aria-label="실기 경로"><a href="#practice/practical">실기 전체 문제</a><span>/</span><span>캡처 문제 12개</span></nav>
  <section class="wb-intro"><span class="pr-pill">캡처 8장 → 12문제 · 풀이 확장</span><h2>왜 이 답인지 알면,<br>스스로 쓸 수 있습니다.</h2><p>문제를 읽고 → 쉬운 개념을 확인하고 → 단계별로 풀고 → 답안 예시와 비교하세요.<br>총 12문제의 나의 답안과 자가점검은 기존 단원 학습 기록과 구분하여 저장됩니다.</p><div class="wb-intro-steps"><span>01 문제·조건</span><span>02 개념·풀이</span><span>03 나의 답안</span><span>04 누락 점검</span></div></section>
  <div class="pr-stats wb-stats"><div><span>직접 작성한 답안</span><strong>${p.written}<small> / 12</small></strong></div><div><span>학습 완료한 문제</span><strong>${p.completed}<small> / 12</small></strong></div><div><span>자가점검 충족</span><strong>${p.checked}<small> / ${p.possible}</small></strong></div></div>
  <section class="wb-filter-bar" aria-label="캡처 문제 필터"><label>문제 유형<select id="wb-kind-filter" data-workbook-filter><option value="all">전체 유형 · 12문제</option>${['계산형', '서술형', '괄호형', '단답형'].map(kind => `<option value="${kind}">${kind} · ${workbookQuestions.filter(q => q.kind === kind).length}문제</option>`).join('')}</select></label><label>학습 상태<select id="wb-status-filter" data-workbook-filter><option value="all">전체 상태</option><option value="unwritten">미작성</option><option value="written">작성한 문제</option><option value="completed">학습 완료</option><option value="review">점검이 남은 답안</option></select></label><p id="wb-filter-count" role="status">12문제</p></section>
  ${workbookGroups.map(group => `<section class="wb-question-group" data-wb-group="${group.id}"><div class="pr-section-heading"><div><span class="eyebrow">${group.id === 'data' ? 'DATA' : group.id === 'planning' ? 'PLAN & STRATEGY' : 'COST CALCULATION'}</span><h2>${esc(group.title)}</h2><p>${esc(group.description)}</p></div><span>${group.count}문제</span></div><div class="wb-question-grid">${workbookQuestions.filter(q => q.group === group.id).map(q => {
    const written = Boolean(state.drafts[q.id]?.trim()), completed = state.completed.includes(q.id), checked = state.checks[q.id]?.length || 0;
    return `<a class="wb-question-card" href="${url(q.id)}" data-kind="${q.kind}" data-written="${written}" data-completed="${completed}" data-review="${written && checked < q.checks.length}"><div class="wb-card-top"><span class="wb-kind ${q.kind === '계산형' ? 'wb-kind-calc' : ''}">${q.kind}</span><span>${completed ? '완료 ✓' : written ? '답안 작성됨' : '아직 작성 전'}</span></div><span class="wb-number">${esc(group.title)} ${q.number}</span><h3>${esc(q.title)}</h3><p>${esc(q.tasks[0])}</p><div class="wb-card-bottom"><span>약 ${q.minutes}분 · 캡처 ${q.captures.join('·')} 기반</span><strong>문제와 풀이 →</strong></div></a>`;
  }).join('')}</div></section>`).join('')}<p id="wb-filter-empty" class="wb-filter-empty" hidden>조건에 맞는 문제가 없습니다. 유형이나 학습 상태를 바꿔 보세요.</p>
  <section class="pr-panel wb-correction-summary"><h2>헷갈리는 부분은 이렇게 구분했습니다</h2><ul><li>통계: 제시값 계산 결과와 2024년 공식 발표값을 구분합니다.</li><li>이익률: 매출액 대비 17.6%와 원가 대비 21.3%의 분모를 밝힙니다.</li><li>원가: 일반관리비·이윤·부가세가 각각 어떤 금액에 붙는지 설명합니다.</li><li>제도: 인증·지역제한·구매목표의 적용 조건과 예외를 보완합니다.</li></ul></section>${provenance()}`;
}

function questionContent(q) {
  return `<section class="wb-problem" aria-labelledby="wb-problem-title-${q.id}"><div class="wb-problem-tags"><span class="wb-kind ${q.kind === '계산형' ? 'wb-kind-calc' : ''}">${q.kind}</span><span>권장 ${q.minutes}분 · 캡처 ${q.captures.join('·')} 기반</span></div><h3 id="wb-problem-title-${q.id}">문제</h3><p class="wb-stem">${esc(q.stem)}</p>${q.given.length ? gridTable(table('주어진 자료와 계산 조건', ['항목', '내용'], q.given)) : ''}<h4>답안에 써야 할 내용</h4>${lines(q.tasks)}${q.costKey ? `<p class="wb-condition">계산 기준: 제시 요율·산정기초는 연습 가정입니다. 별도 지시가 없으면 각 비율 금액에서 원 미만을 반올림합니다.</p>` : ''}</section>`;
}

function solution(q) {
  return `<div class="wb-solution-content"><section class="wb-solution-section"><span class="eyebrow">UNDERSTAND</span><h3>1. 용어를 쉬운 말로 이해하기</h3>${terms(q.concepts)}${q.explanation.map(text => `<p>${esc(text)}</p>`).join('')}</section>
  ${q.costKey ? `<section class="wb-cost-map"><h3>계산의 전체 흐름</h3>${costFoundation.explanation.map(text => `<p>${esc(text)}</p>`).join('')}${lines(costFoundation.flow)}<p>${esc(costFoundation.caution)}</p></section>` : ''}
  <section class="wb-solution-section"><span class="eyebrow">STEP BY STEP</span><h3>2. 왜 이렇게 푸는지, 단계별로 보기</h3><ol class="wb-worked-steps">${q.steps.map((item, i) => `<li><div class="wb-step-heading"><span>${i + 1}</span><h4>${esc(item.title)}</h4></div><p>${esc(item.body)}</p>${item.formula ? `<div class="wb-formula"><span>계산식</span><p>${esc(item.formula)}</p></div>` : ''}${item.result ? `<p class="wb-step-result">→ ${esc(item.result)}</p>` : ''}</li>`).join('')}</ol>${q.table ? gridTable(q.table) : ''}</section>
  <section class="wb-answer-guide"><span class="eyebrow">WRITE YOUR ANSWER</span><h3>3. 답안의 뼈대 만들기</h3>${lines(q.blueprint)}<p>질문에서 요구한 개수와 순서를 지키세요. 계산형은 산식·대입·결과·단위를, 서술형은 용어·이유·조치를 연결하면 답안의 근거가 보입니다.</p></section>
  <section class="wb-model-answer"><h3>4. 실제 답안은 이렇게 작성하세요</h3><p class="pr-help">자체 작성한 학습용 예시입니다. 문장을 그대로 외우기보다 조건과 핵심 내용을 포함해 자기 말로 설명해 보세요.</p>${lines(q.answer)}</section>
  <section class="wb-common-mistakes"><h3>5. 자주 하는 실수</h3>${lines(q.pitfalls, 'ul')}</section>
  ${q.corrections.length ? `<section class="wb-corrections"><h3>캡처에서 바로잡거나 보완한 내용</h3>${q.corrections.map(item => `<article><p><strong>캡처 내용</strong>${esc(item.original)}</p><p><strong>학습자료 반영</strong>${esc(item.corrected)}</p><p><strong>이유</strong>${esc(item.reason)}</p></article>`).join('')}</section>` : ''}
  ${q.sources.length ? `<section class="wb-sources"><h3>확인한 공식 자료와 참고 링크</h3>${refs(q.sources)}<p>역사적 통계는 2024년 기준을 유지합니다. 법령의 실제 적용은 시험의 적용 기준일·대상 기관·공고를 함께 확인하세요.</p></section>` : '<p class="pr-help">STP의 개념과 적용은 캡처 내용을 학습용으로 재구성했습니다.</p>'}</div>`;
}

function writing(q, state) {
  const checked = state.checks[q.id] || [], completed = state.completed.includes(q.id);
  return `<section class="wb-writing"><div class="wb-writing-top"><h3>나의 답안 작성</h3><button class="soft-button" data-workbook-action="learn">처음이라면 개념부터 읽기 ↓</button></div><label for="wb-draft-${q.id}">조건과 근거를 연결해 직접 써 보세요.</label><p id="wb-draft-help" class="pr-help">${q.kind === '계산형' ? '중간 계산식과 단위를 남기세요. ' : '질문에서 요구한 개수와 순서에 맞춰 쓰세요. '}이 브라우저에 자동 저장됩니다.</p><textarea id="wb-draft-${q.id}" data-workbook-draft="${q.id}" aria-describedby="wb-draft-help" rows="8" placeholder="1. 문제의 조건과 핵심 개념을 정리합니다.&#10;2. 계산식이나 판단 이유를 씁니다.&#10;3. 요구한 항목과 단위를 확인해 마무리합니다.">${esc(state.drafts[q.id] || '')}</textarea><p class="pr-save-status" id="wb-save-status" role="status">${state.drafts[q.id] ? '저장한 답안을 불러왔습니다.' : '입력하면 자동 저장됩니다.'}</p></section>
  <details class="wb-solution"><summary>쉬운 개념 · 자세한 풀이 · 답안 예시 펼치기</summary>${solution(q)}<section class="wb-self-check"><h3>6. 내 답안에서 빠진 내용 확인</h3><p>모범답안과 비교하여 충족한 항목을 직접 표시하세요. 공식 배점·자동 정오 판정은 아닙니다.</p><fieldset><legend>${esc(q.title)} 자가점검</legend>${q.checks.map((text, index) => `<label><input type="checkbox" data-workbook-check="${q.id}" value="${index}" ${checked.includes(index) ? 'checked' : ''}><span>${esc(text)}</span></label>`).join('')}</fieldset><p class="wb-check-status" role="status">자가점검 ${checked.length}/${q.checks.length} 충족</p></section></details>
  <div class="wb-completion"><button class="button ${completed ? 'outline' : ''}" data-workbook-action="complete" data-id="${q.id}" aria-pressed="${completed}">${completed ? '✓ 이 문제 학습 완료 · 누르면 해제' : '이 문제 학습 완료하기'}</button><p class="pr-help">답안을 고치면 자가점검과 완료 표시를 초기화해 다시 확인할 수 있습니다.</p></div>`;
}

function questionPage(q, value) {
  const state = normalizeWorkbookState(value), index = workbookQuestions.indexOf(q), group = workbookGroups.find(g => g.id === q.group);
  return `${heading(q.title, `${group.title} · ${q.number}번 · ${q.kind}`)}<nav class="pr-breadcrumb" aria-label="실기 문제 경로"><a href="#practice/practical">실기 전체 문제</a><span>/</span><a href="${url()}">캡처 문제 12개</a><span>/</span><span>${group.title} ${q.number}</span></nav><div class="wb-reading-layout"><aside class="wb-question-nav"><h2>캡처 문제 목록</h2>${workbookGroups.map(g => `<section><h3>${esc(g.title)}</h3>${workbookQuestions.filter(item => item.group === g.id).map(item => `<a href="${url(item.id)}" ${item.id === q.id ? 'aria-current="page"' : ''}><span>${state.completed.includes(item.id) ? '✓' : item.number}</span><span>${esc(item.title)}</span></a>`).join('')}</section>`).join('')}<a class="soft-button" href="${url()}">유형·상태별 문제 보기 →</a></aside><article class="wb-detail">${questionContent(q)}${writing(q, state)}<section class="wb-linked-theory"><h3>연결된 실기 기본개념</h3>${q.units.map(id => `<a href="${practicalChapterUrl(chapterForUnit(id))}">PART ${chapterForUnit(id).part} · ${esc(chapterForUnit(id).title)} 복습 →</a>`).join('')}</section><nav class="pr-pagination" aria-label="이전·다음 캡처 문제">${index ? `<a href="${url(workbookQuestions[index - 1].id)}">← 이전 문제<small>${esc(workbookQuestions[index - 1].title)}</small></a>` : `<a href="${url()}">← 전체 문제</a>`}${index < workbookQuestions.length - 1 ? `<a href="${url(workbookQuestions[index + 1].id)}">다음 문제 →<small>${esc(workbookQuestions[index + 1].title)}</small></a>` : `<a href="${url()}">전체 문제로 →</a>`}</nav></article></div>`;
}

export function renderWorkbookPrint(value, embedded = false) {
  const state = normalizeWorkbookState(value);
  return `<section class="wb-print-content">${embedded ? '<h2>첨부 캡처 기반 실기 12문제와 상세 풀이</h2>' : heading('캡처 실기 12문제 · 전체 학습자료', '문제·개념·풀이·모범답안·저장한 나의 답안을 함께 인쇄할 수 있습니다.', true)}${embedded ? '' : `<div class="pr-print-tools"><button class="button" data-pr-action="print">인쇄 · PDF로 저장</button><a class="soft-button" href="${url()}">문제 목록으로</a></div>`}${workbookQuestions.map(q => `<article class="wb-print-question"><h2>${esc(workbookGroups.find(g => g.id === q.group).title)} ${q.number} · ${esc(q.title)}</h2>${questionContent(q)}${state.drafts[q.id] ? `<h3>저장한 나의 답안</h3><p class="pr-print-draft">${esc(state.drafts[q.id])}</p>` : ''}${solution(q)}<section class="wb-self-check"><h3>자가점검</h3>${lines(q.checks, 'ul')}</section></article>`).join('')}${provenance()}</section>`;
}

export function renderWorkbook(id = '', value = {}) {
  if (id === 'print') return `<div class="wb-print-view">${renderWorkbookPrint(value)}</div>`;
  const question = workbookQuestions.find(q => q.id === id);
  return `<div class="wb-workbook">${question ? questionPage(question, value) : directory(value)}</div>`;
}

export function filterWorkbookCards(root = document) {
  const kind = root.querySelector('#wb-kind-filter')?.value || 'all';
  const status = root.querySelector('#wb-status-filter')?.value || 'all';
  let count = 0;
  root.querySelectorAll('.wb-question-card').forEach(card => {
    const statusMatch = status === 'all' || (status === 'unwritten' && card.dataset.written === 'false') || (status === 'written' && card.dataset.written === 'true') || (status === 'completed' && card.dataset.completed === 'true') || (status === 'review' && card.dataset.review === 'true');
    card.hidden = !((kind === 'all' || card.dataset.kind === kind) && statusMatch);
    if (!card.hidden) count++;
  });
  root.querySelectorAll('.wb-question-group').forEach(group => { group.hidden = !group.querySelector('.wb-question-card:not([hidden])'); });
  const result = root.querySelector('#wb-filter-count'), empty = root.querySelector('#wb-filter-empty');
  if (result) result.textContent = `${count}문제`;
  if (empty) empty.hidden = count > 0;
}

export { solution as renderWorkbookSolution };
