import { lessons, questions } from './data.js';
import { chapterLabel, resolveLessonId } from './curriculum.js';

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function findChapter(subjectId, lessonId) {
  return lessons.find(l => l.subject === subjectId && l.id === resolveLessonId(lessonId)) || null;
}

export function practiceQuestions(subjectId, lessonId = null) {
  return questions.filter(q => (!subjectId || q.subject === subjectId) && (!lessonId || q.lesson === lessonId));
}

export function renderChapterFilter(subjectId, activeChapter) {
  return `<label class="practice-chapter-filter" for="practice-chapter">CHAPTER 선택<select id="practice-chapter"><option value="">이 PART의 전체 CHAPTER</option>${lessons.filter(l => l.subject === subjectId).map(l => `<option value="${l.id}" ${activeChapter?.id === l.id ? 'selected' : ''}>${chapterLabel(l.chapter)} · ${esc(l.title)}</option>`).join('')}</select></label>`;
}

export function renderPracticeGroups(subjectId, activeChapter, renderRow) {
  return lessons.filter(l => l.subject === subjectId && (!activeChapter || l.id === activeChapter.id)).map(l => {
    const list = practiceQuestions(subjectId, l.id);
    const core = list.filter(q => q.core);
    const extra = list.filter(q => !q.core);
    return `<section class="section practice-chapter"><div class="section-title"><h2><span class="chapter-code">${chapterLabel(l.chapter)}</span> ${esc(l.title)}</h2><a href="#practice/${subjectId}/${l.id}">${list.length}문항 · 단원별 보기 →</a></div>${core.length ? `<h3 class="practice-group-title">단원별 핵심문제</h3><div class="question-list">${core.map(renderRow).join('')}</div>` : ''}${extra.length ? `${core.length ? '<h3 class="practice-group-title">추가 확인문제</h3>' : ''}<div class="question-list">${extra.map(renderRow).join('')}</div>` : ''}</section>`;
  }).join('');
}

export function renderQuestionExplanation(q) {
  const detail = q.details;
  return `<p>${esc(q.explanation)}</p>${detail ? `<div class="detailed-explanation"><h3>개념 이해 · 협의와 광의</h3><p>${esc(detail.concept)}</p><h3>보기별 해설</h3><ol class="choice-rationale">${detail.choices.map((choice, i) => `<li class="${i === q.answer ? 'correct-choice' : ''}"><strong>${i + 1}번 · ${esc(choice.title)}</strong><p>${esc(choice.reason)}</p></li>`).join('')}</ol><section class="explanation-example"><span class="subject-label">이해를 돕는 가상 사례</span><h3>${esc(detail.example.title)}</h3><p>${esc(detail.example.situation)}</p><ul>${detail.example.effects.map(effect => `<li>${esc(effect)}</li>`).join('')}</ul></section><p class="explanation-takeaway"><strong>기억할 한 문장</strong><br>${esc(detail.takeaway)}</p><p>${esc(detail.caution)}</p><div class="explanation-sources"><strong>해설 참고 자료</strong>${detail.sources.map(source => `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ↗</a>`).join('')}</div></div>` : ''}`;
}
