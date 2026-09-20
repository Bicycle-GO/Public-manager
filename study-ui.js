import { subjects, lessons, questions, sources } from './data.js';
import { curriculum, partLabel, chapterLabel } from './curriculum.js';
import { renderCurriculumOutline } from './curriculum-ui.js';
import { materialEdition, studyPlan, studyNotes } from './study-materials.js';

const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lessonLink = id => `#theory/${id.split('-')[0]}/${id}`;
const labels = {procurement:'조달사업법',conflict:'공직자의 이해충돌 방지법',services:'조달청 용역 개요·종류',serviceProcess:'조달청 용역 계약절차',contractTypes:'조달청 계약종류',construction:'공사계약일반조건',constructionTypes:'조달청 시설공사종류',subcontract:'건설산업기본법', law: '국가계약법', local: '지방계약법', decree: '국가계약법 시행령', civil: '민법', sme: '중소기업 판로지원법', green: '녹색제품 구매촉진법', innovation: '조달청 혁신조달 안내', electronic: '전자조달법', methods: '조달청 계약방법 안내', advance: '정부 입찰·계약 집행기준', mas: '조달청 MAS 2단계경쟁 안내', pps: '공공조달역량개발원 표준교재' };
const sourceLink = key => `<a href="${esc(sources[key])}" target="_blank" rel="noopener noreferrer">${esc(labels[key] || key)} ↗</a>`;

export function renderStudyNotes(lesson) {
  const note = studyNotes[lesson.id];
  if (!note) return '';
  return `<div class="study-notes"><div class="study-section-heading"><span class="eyebrow">STUDY NOTES</span><h2>핵심 심화 정리</h2><p>개념을 비교하고, 계산으로 확인하세요.</p></div>
    ${note.topics.map(([title, body]) => `<section><h3>${esc(title)}</h3><p>${esc(body)}</p></section>`).join('')}
    ${note.table ? `<section><h3>${esc(note.table.title)}</h3><div class="lesson-table-wrap" tabindex="0" role="region" aria-label="${esc(note.table.title)}"><table class="lesson-table"><caption>${esc(note.table.title)}</caption><thead><tr>${note.table.headers.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${note.table.rows.map(row => `<tr>${row.map((cell, i) => `<${i ? 'td' : 'th scope="row"'}>${esc(cell)}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</tbody></table></div></section>` : ''}
    ${(note.calculations || []).map(c => `<section class="calculation-card"><span class="case-label">계산 연습 · 가상 조건</span><h3>${esc(c.title)}</h3><p>${esc(c.premise)}</p><div class="calculation-formula">${esc(c.formula)}</div><details><summary>풀이와 정답 보기</summary><ol>${c.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol><p class="calculation-result">${esc(c.result)}</p></details><p class="calculation-note">${esc(c.note)}</p></section>`).join('')}
    <section class="study-checkpoint"><h3>복습 체크</h3><p>${esc(note.checkpoint)}</p><a class="text-button" href="#practice/${lesson.subject}">${partLabel(lesson.subject)} 연습문제로 확인하기 →</a></section>
    <div class="study-sources"><strong>관련 공식 자료</strong>${note.sources.map(sourceLink).join('')}</div>
  </div>`;
}

export function renderMaterialTopics(search = '') {
  const needle = search.trim().toLocaleLowerCase('ko-KR');
  const matches = lessons.filter(l => [l.title, l.summary, ...l.sections.flat(), ...l.guide.terms.flat(), ...studyNotes[l.id].topics.flat(), ...(studyNotes[l.id].calculations || []).map(c => c.title), studyNotes[l.id].table?.title || ''].join(' ').toLocaleLowerCase('ko-KR').includes(needle));
  if (!matches.length) return '<p class="material-empty" role="status">일치하는 단원이 없습니다. 다른 용어로 검색해 보세요.</p>';
  return `<p class="material-result-count" role="status">${matches.length}개 단원${needle ? ` · “${esc(search.trim())}” 검색 결과` : ''}</p><div class="material-topic-grid">${matches.map(l => `<a class="material-topic" href="${lessonLink(l.id)}"><span class="subject-label">${partLabel(l.subject)} · ${chapterLabel(l.chapter)}</span><h3>${esc(l.title)}</h3><p>${studyNotes[l.id].topics.map(([title]) => esc(title)).join(' · ')}</p><span class="material-topic-meta">${studyNotes[l.id].table ? '비교표 · ' : ''}${studyNotes[l.id].calculations ? `계산 ${studyNotes[l.id].calculations.length}개 · ` : ''}이론 읽기 →</span></a>`).join('')}</div>`;
}

export function renderStudyMaterials(state) {
  const calculationCount = Object.values(studyNotes).reduce((sum, n) => sum + (n.calculations?.length || 0), 0);
  return `<div class="page-heading"><div><div class="eyebrow">STUDY COLLECTION</div><h1>${curriculum.title}</h1><p>3개 PART · 18개 CHAPTER의 흐름을 잡고, 비교·계산·문제로 복습하세요.</p></div><a class="soft-button" href="#theory">과목별 이론 보기 →</a></div>
    <section class="card material-intro"><div><span class="case-label">웹 학습자료 · ${materialEdition.updated} 업데이트</span><h2>읽고, 비교하고, 풀어보는<br>나의 필기 학습 가이드</h2><p>기본이론에 핵심 심화 정리를 더했습니다.<br>단원을 읽은 뒤 확인문제와 해설로 이해를 점검하세요.</p><div class="material-intro-actions"><a class="button" href="#theory/1/1-01">PART 01부터 시작하기 →</a><button class="soft-button" data-action="study-plan">14일 학습계획 보기</button></div></div><dl class="material-metrics"><div><dt>과목별 이론</dt><dd>${lessons.length}<span>단원</span></dd></div><div><dt>계산 예제</dt><dd>${calculationCount}<span>개</span></dd></div><div><dt>자체 연습문제</dt><dd>${questions.length}<span>문항</span></dd></div></dl></section>
    <details class="card material-provenance"><summary>자료의 구성과 반영 범위</summary><p>${esc(materialEdition.provenance)}</p><p>용역·MAS·공사·하도급 등 새로 분리한 장에도 본문과 사례·확인문제를 구성했습니다. 웹의 ${questions.length}문항은 자체 연습문제입니다. 금액기준·기한·특례와 시험 적용 법령은 해당 회차 공식 공고에서 확인하세요.</p></details>
    <section class="section"><div class="section-title"><h2>제1편 전체 목차</h2><span>PART 01 · 6장 / PART 02 · 5장 / PART 03 · 7장</span></div>${renderCurriculumOutline(state.completed)}</section>
    <section class="section"><div class="section-title"><h2>필요한 내용 찾아보기</h2></div><label class="material-search" for="material-search">학습 용어 검색<input id="material-search" type="search" placeholder="예: 선금, 예정가격, 해제, 드론" aria-controls="material-topics"></label><div id="material-topics">${renderMaterialTopics()}</div></section>
    <section class="section" id="study-plan" tabindex="-1"><div class="section-title"><h2>14일 학습계획</h2><span>하루 1~2개 CHAPTER, 마지막 이틀은 복습</span></div><p class="material-plan-note">웹용 추천 일정입니다. 단원 완료 여부와 과목별 풀이 수는 기존 학습 기록에 연결됩니다.</p><ol class="study-plan">${studyPlan.map(p => { const complete = p.lessons.length && p.lessons.every(id => state.completed.includes(id)); return `<li class="card plan-day ${complete ? 'plan-read' : ''}"><span class="plan-number">DAY ${String(p.day).padStart(2, '0')}</span><div><h3>${esc(p.title)}${complete ? '<span class="plan-status">이론 읽기 완료</span>' : ''}</h3><p>${esc(p.task)}</p><div class="plan-links">${p.lessons.map(id => `<a href="${lessonLink(id)}">${partLabel(Number(id[0]))} · ${chapterLabel(Number(id.split('-')[1]))} →</a>`).join('')}${p.practice ? `<a href="#practice/${p.practice}">${partLabel(p.practice)} 문제 (${questions.filter(q => q.subject === p.practice && state.answers[q.id] !== undefined).length}/${questions.filter(q => q.subject === p.practice).length}) →</a>` : ''}${p.route ? `<a href="#${p.route}">${p.route === 'mock' ? '미니 모의고사' : '오답노트'} →</a>` : ''}</div></div></li>`; }).join('')}</ol></section>
    <section class="card material-final"><h2>시험 전 마지막 점검</h2><p>비교표의 차이를 설명할 수 있는지, 계산의 단위·비율·조건을 확인했는지 점검하세요. 틀린 문제는 해설의 ‘관련 이론’에서 다시 읽을 수 있습니다.</p><div class="study-sources"><a href="${sources.qnet}" target="_blank" rel="noopener noreferrer">큐넷 · 해당 회차 공고·출제기준 ↗</a><a href="${sources.pps}" target="_blank" rel="noopener noreferrer">공공조달역량개발원 · 표준교재 ↗</a><a href="#info">시험 안내와 공식 자료 더 보기 →</a></div></section>`;
}
