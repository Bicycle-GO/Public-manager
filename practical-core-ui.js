import { findPracticalChapter, practicalChapterUrl } from './practical-course.js';
import { courseEsc as esc, courseList, courseReferences } from './practical-course-ui.js';

function hints(question) {
  return `<h3>문제를 풀기 위한 개념</h3><dl class="pc-terms">${question.concepts.map(([term,text])=>`<div><dt>${esc(term)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl><h3>답안 작성 순서</h3>${courseList(question.blueprint)}`;
}

function explanation(question) {
  return question.answer.map((answer,i)=>`<section><h3>${i+1}. 답안 예시</h3><p class="pr-print-draft">${esc(answer)}</p><p class="pc-reason"><strong>풀이와 작성 이유</strong>${esc(question.reasons[i])}</p></section>`).join('');
}

function renderSourceReview(question) {
  if(!Array.isArray(question.sourceFiles))return '';
  return `<section class="pc-section"><h3>원문과 공식 안내를 비교해 보세요</h3><p class="pr-help">검토 대상: ${esc(question.sourceFiles.join(' / '))} · ${esc(question.sourceNumber)}</p>${question.corrections.map(item=>`<section class="pc-traps"><h4>캡처의 표현</h4><p>${esc(item.original)}</p><h4>학습할 내용</h4><p>${esc(item.corrected)}</p><p class="pc-reason"><strong>검토 이유</strong>${esc(item.reason)}</p></section>`).join('')}<h4>확인한 공식 자료 · 2026. 10. 23.</h4><ul>${question.refs.map(ref=>`<li><a href="${esc(ref.url)}" target="_blank" rel="noopener noreferrer">${esc(ref.title)} ↗</a></li>`).join('')}</ul></section>`;
}

export function renderCoreQuestion(question, state) {
  const reviewed=Array.isArray(question.sourceFiles),source=reviewed?'review':'core',label=reviewed?'단원 핵심문제 · 검토본':'핵심 응용문제';
  const chapter=findPracticalChapter(question.chapterId),done=state.completed.includes(question.id),draft=state.drafts[question.id]||'',checks=state.checks[question.id]||[];
  return `<div class="page-heading"><div><div class="eyebrow">PRACTICAL · CORE APPLICATION</div><h1>${esc(question.title)}</h1><p>${reviewed?'제공된 핵심문제를 공식 자료와 대조한': '핵심 개념을 새로운 조건에 적용하는'} ${esc(question.kind)} · 권장 ${question.minutes}분</p></div><a class="soft-button" href="#practice/practical">실기 예상문제 전체</a></div>
  <nav class="pr-breadcrumb" aria-label="실기 핵심 응용문제 경로"><a href="#practice/practical">실기 예상문제</a><span>/</span><a href="${practicalChapterUrl(chapter)}">PART ${chapter.part} · ${esc(chapter.title)}</a></nav>
  <article class="pc-reading-card pq-writing"><span class="pr-pill">${label} · ${esc(question.kind)}</span>${reviewed?`<aside class="pc-scope"><strong>자료 ${esc(question.sourceNumber)} · ${esc(question.sourceFiles.join(' / '))}</strong><p>${esc(question.reviewNotice)}</p></aside>`:''}<h2>문제</h2><p class="pc-scenario">${esc(question.scenario)}</p>
  <details class="pc-case"><summary>막힐 때 보기 · 핵심 개념과 답안 작성 틀</summary><div>${hints(question)}</div></details>
  <label for="pq-draft">나의 답안</label><p id="pq-draft-help" class="pr-help">계산형은 식 → 숫자 대입 → 단위 → 해석, 서술형은 개념 → 사례에 적용 → 판단 근거 순서로 작성하세요. 해설과 비교하여 직접 점검합니다.</p>
  <textarea id="pq-draft" rows="10" data-pq-draft="${question.id}" data-pq-source="${source}" aria-describedby="pq-draft-help" placeholder="조건과 구하려는 값을 먼저 적고, 판단이나 계산 과정을 설명해 보세요.">${esc(draft)}</textarea><p id="pq-save-status" class="pr-save-status" role="status" aria-live="polite">${draft?'저장된 답안을 불러왔습니다.':'입력하면 이 브라우저에 자동 저장됩니다.'}</p>
  <details class="pc-case"><summary>모범답안 · 단계별 풀이 · 자가점검</summary><div>${explanation(question)}${renderSourceReview(question)}<section class="pc-traps"><h3>자주 하는 실수</h3>${courseList(question.pitfalls,'ul')}</section>
  <fieldset class="pq-checks"><legend>내 답안의 핵심 내용을 직접 확인하세요</legend>${question.checks.map((text,i)=>`<label><input type="checkbox" data-pq-check="${question.id}" value="${i}" data-pq-source="${source}" ${checks.includes(i)?'checked':''}><span>${esc(text)}</span></label>`).join('')}</fieldset><p id="pq-check-status" role="status">자가점검 ${checks.length}/${question.checks.length} 충족</p><h3>관련 개념 다시 읽기</h3><p>${esc(question.intro)}</p><a href="${practicalChapterUrl(chapter)}">${esc(chapter.title)} · 기본이론 →</a>${courseReferences(chapter)}</div></details>
  <button class="button ${done?'outline':''}" data-pq-complete="${question.id}" data-pq-source="${source}" aria-pressed="${done}">${done?'✓ 이 문제 학습 완료 · 누르면 해제':'이 문제 학습 완료하기'}</button><p class="pr-help">완료는 직접 표시합니다. 답안을 수정하면 완료·자가점검을 초기화합니다.</p><aside class="pc-scope"><strong>학습자료의 범위</strong><p>${esc(question.sourceNote)}</p></aside></article>`;
}

export function renderCoreQuestionPrint(question,state) {
  const label=Array.isArray(question.sourceFiles)?'단원 핵심문제 · 검토본':'핵심 응용문제';
  const chapter=findPracticalChapter(question.chapterId),draft=state.drafts[question.id]||'';
  return `<article class="pc-reading-card pc-print-chapter"><span>${label} · PART ${chapter.part} · ${esc(question.kind)}</span><h3>${esc(question.title)}</h3>${question.reviewNotice?`<p class="pr-help">${esc(question.reviewNotice)}</p>`:''}<p class="pc-scenario">${esc(question.scenario)}</p>${draft?`<h4>나의 답안</h4><p class="pr-print-draft">${esc(draft)}</p>`:''}<div class="pc-section">${hints(question)}<h3>모범답안과 단계별 풀이</h3>${explanation(question)}${renderSourceReview(question)}<h3>자주 하는 실수</h3>${courseList(question.pitfalls,'ul')}<h3>자가점검</h3>${courseList(question.checks,'ul')}<p class="pr-help">${esc(question.sourceNote)}</p></div></article>`;
}
