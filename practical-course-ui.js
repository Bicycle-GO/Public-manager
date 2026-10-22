import { practicalParts, practicalChapters, courseSources, findPracticalChapter, practicalChapterUrl, practicalQuestionUrl, normalizePracticalCourse } from './practical-course.js';
import { practicalAreas, practicalEdition } from './practical-data.js';
import { findPracticalCoreLearning } from './practical-core-learning.js';
import { captureReviewLearning } from './practical-registration-learning.js';

export const courseEsc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const esc = courseEsc;
const num = value => String(value).padStart(2,'0');
export const courseList = (values, tag = 'ol') => `<${tag}>${values.map(value=>`<li>${esc(value)}</li>`).join('')}</${tag}>`;
const partUrl = part => `#theory/practical/part/${part}`;
export const courseReferences = chapter => `<div class="pr-source-links">${chapter.refs.map(key=>`<a href="${esc(courseSources[key][1])}" target="_blank" rel="noopener noreferrer">${esc(courseSources[key][0])} ↗</a>`).join('')}</div>`;
const heading = (title,description,eyebrow='PRACTICAL FOUNDATIONS · 7 PARTS') => `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${esc(title)}</h1><p>${esc(description)}</p></div><a class="soft-button" href="#theory/practical/print">실기 이론 전체 · 인쇄</a></div>`;
const scope = () => `<aside class="pc-scope"><strong>학습 목차와 출제기준을 함께 확인하세요</strong><p>요청하신 7개 PART·18개 주제를 위한 자체 작성 학습자료입니다. 첨부 출제기준의 8개 주요항목·25개 세부항목은 별도 대응표로 연결했습니다. 사례·모범답안·자가점검은 학습용이며 공식 기출·채점기준이 아닙니다. 법제도는 기관 유형·공고와 시험의 적용 기준일을 확인합니다.</p><a href="#theory/practical/criteria">출제기준 대응표 보기 →</a><small>자료 정리·공식 안내 확인: 2026. 10. 21.</small></aside>`;

function partCard(part,state) {
  const chapters=practicalChapters.filter(ch=>ch.part===part.id),done=chapters.filter(ch=>state.completed.includes(ch.id)).length;
  return `<article class="pc-part-card"><div class="pc-card-top"><span>PART ${num(part.id)}</span><small>${done}/${chapters.length} 학습 완료</small></div><h2><a href="${partUrl(part.id)}">${esc(part.title)}</a></h2><p>${esc(part.summary)}</p><ol>${chapters.map(ch=>`<li><a href="${practicalChapterUrl(ch)}"><span>${state.completed.includes(ch.id)?'✓':num(chapters.indexOf(ch)+1)}</span><strong>${esc(ch.title)}</strong><span aria-hidden="true">→</span></a></li>`).join('')}</ol><a class="pc-part-link" href="${partUrl(part.id)}">PART ${num(part.id)} 학습하기 →</a></article>`;
}

function overview(state) {
  const next=findPracticalChapter(state.lastChapter) || practicalChapters.find(ch=>!state.completed.includes(ch.id)) || practicalChapters[0];
  return `${heading('실기 기본이론','등록부터 입찰·계약·리스크·분쟁까지, 업무 흐름에 따라 이해하는 7개 PART·18개 주제입니다.')}
  <section class="pc-hero"><div><span class="pr-pill">필기 다음, 실무를 이해하는 단계</span><h2>개념을 이해하고,<br>업무 순서로 기억하세요.</h2><p>핵심 용어 → 쉬운 설명 → 처리 절차 → 서류 → 사례 해설<br>직접 답안을 쓰는 연습은 예상문제의 실기에서 이어갑니다.</p><div class="pc-actions"><a class="button" href="${practicalChapterUrl(next)}">${state.lastChapter?'이어서':'첫 주제'} 학습하기 →</a><a class="soft-button" href="#practice/practical">실기 예상문제 풀기</a></div></div><div class="pc-hero-count"><strong>${state.completed.length}<span>/ 18</span></strong><p>실기 기본이론 학습 완료</p><span>7 PART · 18 CHAPTER</span></div></section>
  <div class="pr-facts"><span><b>실기과목</b> ${esc(practicalEdition.subject)}</span><span><b>검정방법</b> ${esc(practicalEdition.method)}</span><span><b>시험시간</b> 2시간 30분</span><span><b>기준 적용기간</b> ${esc(practicalEdition.period)}</span></div><nav class="pc-part-jumps" aria-label="실기 PART 바로가기">${practicalParts.map(p=>`<a href="${partUrl(p.id)}">PART ${num(p.id)}</a>`).join('')}</nav><div class="pc-parts-grid">${practicalParts.map(p=>partCard(p,state)).join('')}</div>
  <section class="pc-plan"><h2>이 순서로 공부해 보세요</h2><ol><li><strong>1회독 · 절차 이해</strong><p>PART 1→7을 읽고 주제마다 누가 무엇을 확인하는지 말로 설명합니다.</p></li><li><strong>2회독 · 비교와 서류</strong><p>등록·자격, PQ·적격심사, E/S·과업변경처럼 비슷한 개념을 구별합니다.</p></li><li><strong>3회독 · 답안 작성</strong><p>예상문제 → 실기에서 조건·근거·판단·조치를 직접 쓰고 해설과 비교합니다.</p></li></ol><a href="#mock/practical">150분 실기 모의고사로 확인하기 →</a></section>${scope()}`;
}

export function renderCourseCase(chapter, expanded=false) {
  return `<details class="pc-case" ${expanded?'open':''}><summary>사례로 이해하기 · 문제와 단계별 해설</summary><div><p class="pc-scenario">${esc(chapter.scenario)}</p>${chapter.answer.map((answer,i)=>`<section><h4>${num(i+1)} · 답안의 핵심</h4><p>${esc(answer)}</p><p class="pc-reason"><strong>왜 이렇게 쓰나요?</strong> ${esc(chapter.reasons[i])}</p></section>`).join('')}<a href="${practicalQuestionUrl('course',chapter.id)}">이 사례에 직접 답안 작성하기 →</a></div></details>`;
}

export function renderCoreLearning(chapter, printable=false) {
  const core=captureReviewLearning[chapter.id]||findPracticalCoreLearning(chapter.id);
  if(!core)return '';
  return `<section class="pc-section pc-core-learning" aria-label="캡처 주제 보충 학습">
    <h3>보충 학습 · ${esc(core.title)}</h3>
    <aside class="pc-scope"><strong>${esc(core.provenance)}</strong><p>${esc(core.scope)}</p><small>${esc(core.scopeNote||'이 보충자료는 앞서 받은 시장분석·수요예측·원가계산 캡처 범위를 다룹니다. 전자책 전체 내용을 확인·요약한 자료는 아닙니다.')} 보충 설명 정리: 2026. 10. 23.</small></aside>
    <section class="pc-explanation"><h4>이 내용을 익히면 할 수 있는 일</h4>${courseList(core.objectives,'ul')}</section>
    ${core.notes.map(note=>`<section class="pc-explanation"><h4>${esc(note.title)}</h4><p>${esc(note.text)}</p></section>`).join('')}
    ${core.comparisons.map(group=>`<section class="pc-explanation"><h4>${esc(group.title)}</h4><dl class="pc-terms">${group.items.map(([title,text])=>`<div><dt>${esc(title)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl></section>`).join('')}
    ${core.examples.map(example=>`<details class="pc-case" ${printable?'open':''}><summary>${esc(example.title)} · 단계별 풀이</summary><div><p class="pc-scenario">${esc(example.condition)}</p>${example.steps.map(([title,text],i)=>`<section><h4>${num(i+1)} · ${esc(title)}</h4><p>${esc(text)}</p></section>`).join('')}<p class="pc-reason"><strong>답안으로 연결하기</strong>${esc(example.conclusion)}</p></div></details>`).join('')}
    <section class="pc-documents"><h4>내 답안에 적용할 작성 틀</h4>${courseList(core.answerFrame,'ul')}</section>
    <section class="pc-explanation"><h4>스스로 설명한 뒤 확인하세요</h4>${core.selfExplain.map(([question,answer])=>`<details class="pc-case" ${printable?'open':''}><summary>${esc(question)}</summary><div><p>${esc(answer)}</p></div></details>`).join('')}</section>
    ${core.refs?`<section class="pc-explanation"><h4>검토에 사용한 공식 자료 · 2026. 10. 23.</h4><ul>${core.refs.map(ref=>`<li><a href="${esc(ref.url)}" target="_blank" rel="noopener noreferrer">${esc(ref.title)} ↗</a></li>`).join('')}</ul></section>`:''}
    ${printable?'':`<nav aria-label="이 단원의 핵심문제"><h4>예상문제에서 직접 써 보기</h4><p>개념을 이해했다면 핵심문제의 조건을 읽고 답안을 작성한 뒤 해설과 비교하세요.</p><ul>${core.questions.map((id,i)=>`<li><a class="pc-back" href="${practicalQuestionUrl(core.questionSource||'core',id)}">단원 핵심문제 ${num(i+1)} · 문제·답안 연습 →</a></li>`).join('')}</ul></nav>`}
  </section>`;
}

export function renderCourseBody(chapter, printable=false) {
  return `<p class="pc-intro">${esc(chapter.intro)}</p>
    <section class="pc-section"><h3>01 · 먼저 익힐 용어</h3><dl class="pc-terms">${chapter.terms.map(([title,text])=>`<div><dt>${esc(title)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl></section>
    <section class="pc-section"><h3>02 · 개념을 쉽게 이해하기</h3>${chapter.sections.map(([title,text],i)=>`<section class="pc-explanation"><h4><span>${i+1}</span> ${esc(title)}</h4><p>${esc(text)}</p></section>`).join('')}</section>
    ${renderCoreLearning(chapter,printable)}
    <section class="pc-section"><h3>03 · 업무 처리 순서</h3>${courseList(chapter.steps)}</section>
    <section class="pc-section pc-documents"><h3>04 · 작성·확인할 서류</h3>${courseList(chapter.documents,'ul')}</section>
    ${renderCourseCase(chapter,printable)}
    <section class="pc-section pc-traps"><h3>05 · 헷갈리지 않도록 확인하기</h3>${courseList(chapter.pitfalls,'ul')}</section>
    <section class="pc-section"><h3>06 · 내 말로 설명할 수 있나요?</h3>${courseList(chapter.checks,'ul')}<p class="pr-help">세 문장을 답안의 점검 기준으로 활용하세요. 직접 작성·체크하는 기능은 예상문제 → 실기에 있습니다.</p></section>
    <section class="pc-section"><h3>공식 자료와 적용 근거</h3>${courseReferences(chapter)}<p class="pr-help">본문은 개념 학습을 위한 설명입니다. 세부 수치·기한·예외·서류는 해당 공고와 현행 적용 기준을 확인하세요.</p></section>`;
}

function reading(chapter,state) {
  const part=practicalParts.find(p=>p.id===chapter.part),siblings=practicalChapters.filter(ch=>ch.part===part.id),index=practicalChapters.indexOf(chapter),prev=practicalChapters[index-1],next=practicalChapters[index+1],done=state.completed.includes(chapter.id);
  return `${heading(chapter.title,part.title,`실기 기본이론 · PART ${num(part.id)} · CHAPTER ${num(siblings.indexOf(chapter)+1)}`)}<nav class="pr-breadcrumb" aria-label="실기 이론 경로"><a href="#theory/practical">실기 전체 목차</a><span>/</span><a href="${partUrl(part.id)}">PART ${num(part.id)}</a><span>/</span><span>${esc(chapter.title)}</span></nav><div class="pc-reading-layout"><aside class="pc-reading-nav"><h2>PART ${num(part.id)}</h2><p>${esc(part.title)}</p><nav aria-label="이 PART의 주제">${siblings.map(ch=>`<a href="${practicalChapterUrl(ch)}" ${ch.id===chapter.id?'aria-current="page"':''}><span>${state.completed.includes(ch.id)?'✓':num(siblings.indexOf(ch)+1)}</span>${esc(ch.title)}</a>`).join('')}</nav><a href="#theory/practical">7개 PART 전체 보기 →</a><a href="${practicalQuestionUrl('course',chapter.id)}">관련 실기 예상문제 →</a><small>약 ${chapter.minutes}분 · 핵심 개념과 업무 절차</small></aside><article class="pc-reading-card">${renderCourseBody(chapter)}<div class="pc-reading-actions"><span>실기 이론 ${state.completed.length}/18 완료</span><button class="button ${done?'outline':''}" data-pc-complete="${chapter.id}" aria-pressed="${done}">${done?'✓ 이론 학습 완료 · 누르면 해제':'이 주제의 이론 학습 완료'}</button></div><nav class="pr-pagination" aria-label="이전·다음 실기 이론">${prev?`<a href="${practicalChapterUrl(prev)}">← 이전<small>${esc(prev.title)}</small></a>`:'<a href="#theory/practical">← 전체 목차</a>'}${next?`<a href="${practicalChapterUrl(next)}">다음 →<small>${esc(next.title)}</small></a>`:'<a href="#practice/practical">실기 예상문제 풀기 →</a>'}</nav></article></div>`;
}

function criteria() {
  return `${heading('실기 출제기준 대응표','7개 PART는 학습용 목차이며, 첨부된 출제기준은 8개 주요항목·25개 세부항목입니다.')}<p class="pc-scope">아래 연결은 개념과 사례를 함께 공부하기 위한 학습상 대응입니다. 한 세부항목이 여러 주제에 연결될 수 있으며, 공식 출제범위의 변경을 의미하지 않습니다.</p><div class="pc-criteria">${practicalAreas.map(area=>`<section class="pc-part-card"><h2>${area.id}. ${esc(area.title)}</h2>${area.units.map(unit=>`<div class="pc-criteria-row"><h3>${esc(unit.title)}</h3><div>${practicalChapters.filter(ch=>ch.units.includes(unit.id)).map(ch=>`<a href="${practicalChapterUrl(ch)}">PART ${ch.part} · ${esc(ch.title)} →</a>`).join('')}<a class="pc-practice-link" href="${practicalQuestionUrl('unit',unit.id)}">기존 사례 답안 연습 →</a></div></div>`).join('')}</section>`).join('')}</div>`;
}

export function renderPracticalCourse({segment='',unitId='',chapterId='',course={}}={}) {
  const state=normalizePracticalCourse(course);
  let html;
  if(segment==='print') html=`${heading('실기 기본이론 전체 학습자료','7개 PART·18개 주제의 개념·절차·서류·사례 해설을 인쇄합니다.')}<div class="pr-print-tools"><button class="button" data-pr-action="print">인쇄 · PDF 저장</button><a href="#theory/practical">실기 목차로</a></div>${practicalParts.map(part=>`<section class="pc-print-part"><h2>PART ${num(part.id)}. ${esc(part.title)}</h2>${practicalChapters.filter(ch=>ch.part===part.id).map(ch=>`<article class="pc-reading-card pc-print-chapter"><h2>${esc(ch.title)}</h2>${renderCourseBody(ch,true)}</article>`).join('')}</section>`).join('')}${scope()}`;
  else if(segment==='criteria') html=criteria();
  else {
    const part=practicalParts.find(p=>segment==='part'&&String(p.id)===unitId),chapter=findPracticalChapter(chapterId);
    if(part&&chapter?.part===part.id) html=reading(chapter,state);
    else if(part) html=`${heading(`PART ${num(part.id)}. ${part.title}`,part.summary)}<a class="pc-back" href="#theory/practical">← 실기 기본이론 전체 목차</a><div class="pc-parts-grid pc-single-part">${partCard(part,state)}</div><section class="pc-scope"><h2>이 PART의 학습 목표</h2><p>${esc(part.summary)} 주제를 읽은 뒤 사례를 해설과 비교하고, 예상문제에서 직접 답안을 작성하세요.</p><a href="${practicalChapterUrl(practicalChapters.find(ch=>ch.part===part.id))}">첫 주제 읽기 →</a></section>`;
    else html=overview(state);
  }
  return `<div class="practical practical-course ${segment==='print'?'pr-print-view':''}">${html}</div>`;
}
