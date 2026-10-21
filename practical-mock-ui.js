import { practicalMockFormats, practicalExamQuestion, gradePracticalSelfCheck, practicalTimeRemaining, answeredPracticalCount } from './practical-mock.js';
import { practicalAreas, practicalUnits } from './practical-data.js';
import { workbookQuestions } from './practical-workbook.js';
import { renderWorkbookSolution } from './practical-workbook-ui.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list = values => `<ol>${values.map(text=>`<li>${esc(text)}</li>`).join('')}</ol>`;
export const practicalResultUrl = id => '#mock/practical/result/' + encodeURIComponent(id);
export const formatRemaining = seconds => `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
const head = (title, description, action='') => `<div class="page-heading"><div><div class="eyebrow">PRACTICAL MOCK EXAM · WRITTEN ANSWERS</div><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${action}</div>`;

function instructions() {
  return `<section class="pm-instructions"><h2>실기 모의고사 이용 방법</h2><ol><li>문제 조건에 따라 서술·단답·계산 답안을 작성합니다. 응시 중에는 모범답안과 풀이를 표시하지 않습니다.</li><li>답안과 남은 시간은 저장됩니다. 다른 화면으로 이동하거나 새로고침해도 기존 마감시각까지 시간이 계속됩니다.</li><li>제출하거나 시간이 끝나면 답안을 확정하고 모범답안·상세 풀이와 비교합니다.</li><li>자가점검 후 ‘이 문제 점검 완료’를 눌러 점수를 반영합니다. 미응답은 0점입니다.</li></ol><p>150분은 첨부 실기 출제기준의 시험시간에 맞춘 연습입니다. 8·12문항 구성, 동일 문항 비중과 점검 배점은 앱의 학습용 제안이며 공식 문항 수·채점표·합격 판정이 아닙니다.</p></section>`;
}

function historyRow(result) {
  const score=gradePracticalSelfCheck(result);
  return `<a class="pm-history-row" href="${practicalResultUrl(result.id)}"><div><strong>${new Date(result.submittedAt).toLocaleDateString('ko-KR')}</strong><span>${practicalMockFormats[result.formatId].label} · 작성 ${score.answered}/${score.total}</span><small>${result.reason==='timeout'?'시간 종료 제출':'직접 제출'} · 점검 ${score.reviewed}/${score.total}</small></div><b>${score.complete?score.score.toFixed(1)+'점':'점검 중'}<small>결과·풀이 →</small></b></a>`;
}

function intro(state, selected) {
  const format=practicalMockFormats[selected] || practicalMockFormats.comprehensive8;
  return `${head('실기 모의고사','시간 안에 답안을 쓰고, 제출 후 풀이와 자가점검으로 보완하세요.')}<div class="pm-intro-layout"><section class="pm-format-panel"><span class="pr-pill">공공조달 관리실무 · 필답형 연습</span><h2>응시할 실기 모의고사를 선택하세요</h2><fieldset class="pm-format-picker"><legend>실기 모의고사 유형</legend>${Object.entries(practicalMockFormats).map(([id,item])=>`<label><input type="radio" name="practical-mock-format" value="${id}" ${selected===id?'checked':''} ${state.active?'disabled':''}><span><strong>${item.label}</strong><small>${item.count}문항 · ${item.minutes}분</small><p>${esc(item.description)}</p></span></label>`).join('')}</fieldset><div class="pm-format-facts"><div><strong>${format.count}</strong><span>연습 문항</span></div><div><strong>${format.minutes}분</strong><span>제한시간</span></div><div><strong>자가점검</strong><span>제출 후 풀이와 비교</span></div></div>${state.active?`<aside class="pm-active-note"><strong>저장된 실기 모의고사를 이어서 응시하세요.</strong><p>${practicalMockFormats[state.active.formatId].label} · ${answeredPracticalCount(state.active)}/${state.active.questionIds.length} 답안 작성</p><a class="button" href="#mock/practical/run">이어서 응시하기 →</a></aside>`:`<button class="button" data-pm-action="start" data-id="${selected}">${format.label} 시작 →</button>`}<a class="pm-theory-link" href="#theory/practical">실기 기본이론 먼저 복습하기 →</a></section><section class="pm-history"><h2>실기 응시 기록</h2><p>필기 모의고사 기록과 구분하여 보관합니다.</p>${state.history.length?state.history.slice().reverse().map(historyRow).join(''):'<div class="pm-empty-history">아직 제출한 실기 모의고사가 없습니다.<br>첫 답안 작성을 시작해 보세요.</div>'}</section></div>${instructions()}`;
}

function problem(q) {
  return `<div class="pm-question-label"><span class="wb-kind ${q.calculation?'wb-kind-calc':''}">${esc(q.kind)}</span><span>주요항목 ${q.areaId} · ${esc(practicalAreas.find(a=>a.id===q.areaId).title)}</span></div><h2>${esc(q.title)}</h2><p class="pm-stem">${esc(q.stem)}</p>${q.given.length?`<div class="wb-table-wrap" tabindex="0" role="region" aria-label="문제의 주어진 자료"><table><caption>주어진 자료와 조건</caption><thead><tr><th scope="col">항목</th><th scope="col">내용</th></tr></thead><tbody>${q.given.map(([title,body])=>`<tr><th scope="row">${esc(title)}</th><td>${esc(body)}</td></tr>`).join('')}</tbody></table></div>`:''}${q.tasks.length?`<div class="pm-question-tasks"><h3>답안에 포함할 내용</h3>${list(q.tasks)}</div>`:''}`;
}

function run(attempt) {
  const q=practicalExamQuestion(attempt.questionIds[attempt.index]);
  const answered=answeredPracticalCount(attempt);
  return `${head('실기 모의고사 응시',`${practicalMockFormats[attempt.formatId].label} · ${attempt.questionIds.length}문항`, '<a class="soft-button" href="#mock/practical">응시 안내 · 기록</a>')}<div class="pm-exam-layout"><aside class="pm-exam-side"><h2>남은 시간</h2><p class="pm-timer" id="pm-timer" aria-live="off">${formatRemaining(practicalTimeRemaining(attempt))}</p><p id="pm-answered-count">작성 ${answered} / ${attempt.questionIds.length}문항</p><nav class="pm-question-dots" aria-label="실기 모의고사 문제 이동">${attempt.questionIds.map((id,index)=>`<button data-pm-action="jump" data-index="${index}" class="${index===attempt.index?'current':''} ${attempt.answers[id]?.trim()?'answered':''}" ${index===attempt.index?'aria-current="step"':''} aria-label="${index+1}번 문제로 이동">${index+1}</button>`).join('')}</nav><p class="pm-timer-note">시간 종료 시 자동 제출됩니다.<br>다른 화면에서도 시간은 계속됩니다.</p><button class="button" data-pm-action="submit">실기 답안 제출하기</button></aside><article class="pm-exam-question"><div class="pm-question-progress"><strong>${attempt.index+1}번 문제</strong><span>전체 ${attempt.questionIds.length}문항</span></div>${problem(q)}<section class="pm-writing"><label for="pm-draft">나의 실기 답안</label><p id="pm-draft-help">계산형은 산식·대입·결과·단위를, 서술형은 조건·근거·처리 순서를 작성하세요.</p><textarea id="pm-draft" data-pm-draft="${esc(q.id)}" aria-describedby="pm-draft-help" rows="10" placeholder="문제에서 요구한 순서대로 답안을 작성하세요.">${esc(attempt.answers[q.id] || '')}</textarea><p id="pm-save-status" role="status">${attempt.answers[q.id]?'저장된 응시 답안을 불러왔습니다.':'입력한 답안은 자동 저장됩니다.'}</p></section><div class="pm-question-pagination"><button class="soft-button" data-pm-action="jump" data-index="${attempt.index-1}" ${attempt.index===0?'disabled':''}>← 이전 문제</button>${attempt.index+1<attempt.questionIds.length?`<button class="button" data-pm-action="jump" data-index="${attempt.index+1}">다음 문제 →</button>`:'<button class="button" data-pm-action="submit">전체 답안 제출 →</button>'}</div></article></div>`;
}

function unitSolution(q) {
  const item=practicalUnits.find(u=>u.id===q.sourceId);
  return `<div class="pm-unit-solution"><h3>핵심 개념</h3><p>${esc(item.concept)}</p><h3>판단과 업무 처리 순서</h3>${list(item.steps)}<div class="pr-work-product"><h3>작성할 서류와 기록</h3><p>${esc(item.document)}</p></div>${item.calculation?`<div class="pr-calculation"><h3>계산 원리</h3><p>${esc(item.calculation.formula)}</p><strong>${esc(item.calculation.expression)}</strong><p>${esc(item.calculation.note)}</p></div>`:''}<h3>모범답안 예시</h3>${list(item.answer)}<div class="pr-pitfall"><h3>헷갈리는 점</h3><p>${esc(item.pitfall)}</p></div></div>`;
}

export function practicalReviewSummary(result) {
  const grade=gradePracticalSelfCheck(result);
  return `<div class="pm-review-score">${grade.complete?grade.score.toFixed(1):grade.reviewed?grade.score.toFixed(1):'—'}<span>${grade.reviewed?'점':'점검 전'}</span></div><p class="pm-selfgrade-label">${grade.complete?'자가점검 완료':'잠정 자가점검 · 남은 문항을 확인하세요'}</p><p class="pm-reviewed-count">점검 완료 ${grade.reviewed}/${grade.total}문항 · 작성 ${grade.answered}/${grade.total} · 미응답 ${grade.total-grade.answered}</p>`;
}

function resultPage(result) {
  const grade=gradePracticalSelfCheck(result);
  return `${head('실기 모의고사 결과',`${practicalMockFormats[result.formatId].label} · ${result.reason==='timeout'?'시간 종료로 자동 제출':'제출 완료'}`, '<a class="soft-button" href="#mock/practical">실기 응시 안내 · 기록</a>')}<section class="pm-result-card"><span class="pr-pill">작성 답안 확정 · 제출 후 복습</span><h2>모범답안과 비교하며 직접 점검하세요</h2><div id="pm-review-summary">${practicalReviewSummary(result)}</div><p class="pm-score-explainer">각 문항은 같은 비중이며, 문항별 핵심점검 충족 비율을 반영합니다. 작성한 답안의 점검 완료 버튼을 눌러 점수에 반영하세요. 미응답은 0점입니다. 이 점수는 학습용 자가점검이며 공식 정오 판정·합격 판정은 제공하지 않습니다.</p><div class="pm-result-actions"><a class="button" href="#mock/practical">실기 모의고사 다시 선택</a><a class="soft-button" href="#theory/practical">실기 기본이론 복습</a></div></section><section class="pm-results-list"><h2>문제별 답안과 자세한 풀이</h2><p>작성한 답안은 제출 당시 내용으로 보관됩니다. 체크를 바꾸면 해당 문항을 다시 점검 완료하세요.</p>${result.questionIds.map((id,index)=>{
    const q=practicalExamQuestion(id), row=grade.rows[index], checked=result.checks[id] || [];
    return `<details class="pm-review-question" ${index===0?'open':''}><summary><span>${index+1}번 · ${esc(q.title)}</span><small>${!row.written?'미응답 · 0점':row.reviewed?'점검 완료':'점검 필요'}</small></summary><div class="pm-review-body">${problem(q)}<h3>제출한 나의 답안</h3><p class="pm-submitted-answer">${esc(result.answers[id]?.trim() ? result.answers[id] : '미응답 — 작성한 답안이 없습니다.')}</p><div class="pm-submitted-solution">${q.source==='capture'?renderWorkbookSolution(workbookQuestions.find(item=>item.id===q.sourceId)):unitSolution(q)}</div><section class="pm-self-check"><h3>내 답안의 핵심 내용 점검</h3><fieldset><legend>${index+1}번 자가점검</legend>${q.checks.map((text,n)=>`<label><input type="checkbox" data-pm-check="${esc(id)}" data-result="${esc(result.id)}" value="${n}" ${checked.includes(n)&&row.written?'checked':''} ${row.written?'':'disabled'}><span>${esc(text)}</span></label>`).join('')}</fieldset><p data-pm-check-status="${esc(id)}">${row.checked}/${row.possible} 충족${row.written?'':' · 미응답은 0점입니다.'}</p><button class="soft-button" data-pm-action="reviewed" data-id="${esc(id)}" data-result="${esc(result.id)}" ${row.written?'':'disabled'}>${row.reviewed&&row.written?'✓ 점검 완료 · 다시 반영':'이 문제 점검 완료'}</button><a href="${q.theoryUrl}">관련 개념과 문제 다시 학습 →</a></section></div></details>`;
  }).join('')}</section>`;
}

export function renderPracticalMock({ state, formatId='comprehensive8', view='', resultId='' }) {
  let content;
  if (view==='run' && state.active) content=run(state.active);
  else if (view==='result') {
    const result=state.history.find(item=>item.id===resultId);
    content=result?resultPage(result):`${head('응시 기록을 찾을 수 없습니다.','실기 응시 기록에서 제출한 모의고사를 선택하세요.')}<a class="button" href="#mock/practical">실기 모의고사로 이동</a>`;
  } else content=intro(state,formatId);
  return `<div class="practical practical-mock">${content}</div>`;
}
