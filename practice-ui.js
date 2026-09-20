import { lessons, questions } from './data.js';
import { chapterLabel, resolveLessonId } from './curriculum.js';
import { overviewConversation } from './overview-questions.js';

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
    return `<section class="section practice-chapter"><div class="section-title"><h2><span class="chapter-code">${chapterLabel(l.chapter)}</span> ${esc(l.title)}</h2><a href="#practice/${subjectId}/${l.id}">${list.length}문항 · 단원별 보기 →</a></div>${l.id === '1-01' ? `<div class="card overview-question-intro"><span class="subject-label">공유 대화 핵심문제 업데이트</span><h3>05~21번 · 개요를 이해하는 17문항</h3><p>체계·목표·7R·대상물·이해관계자·역사·법령·절차·2024년 통계를 정리했습니다. 정답 확인 후 풀이 과정, 보기별 이유, 공공기관을 가정한 사례와 암기 포인트를 읽어 보세요.</p><p class="small-text">대화에서 확인한 05~21번을 반영했습니다. 모호한 질문과 사실관계는 보정하고 해설에 이유를 표시했습니다. 기존 핵심문제와 추가 확인문제도 함께 제공하며, 공식 기출문제로 표시하지 않습니다.</p><div class="overview-intro-actions"><button class="button" data-action="start-overview">공유 대화 17문항 풀기 →</button><a href="${overviewConversation}" target="_blank" rel="noopener noreferrer">바탕이 된 대화 보기 ↗</a></div></div>` : ''}${core.length ? `<h3 class="practice-group-title">단원별 핵심문제</h3><div class="question-list">${core.map(renderRow).join('')}</div>` : ''}${extra.length ? `${core.length ? '<h3 class="practice-group-title">추가 확인문제</h3>' : ''}<div class="question-list">${extra.map(renderRow).join('')}</div>` : ''}</section>`;
  }).join('');
}

export function renderQuestionContext(q) {
  return `${q.sourceNumber ? `<p class="question-origin">공유 대화 ${String(q.sourceNumber).padStart(2,'0')}번 · ${esc(q.topic)}${q.adapted ? ' · 학습용 보정' : ''}</p>` : ''}${q.passage?.length ? `<section class="question-passage" aria-label="문제 보기"><h3>보기</h3>${q.passage.map(line => `<p>${esc(line)}</p>`).join('')}</section>` : ''}`;
}

export function renderQuestionExplanation(q) {
  const detail = q.details;
  return `<p>${esc(q.explanation)}</p>${detail ? `<div class="detailed-explanation"><h3>${esc(detail.conceptTitle || '개념 이해')}</h3><p>${esc(detail.concept)}</p>${detail.steps?.length ? `<section class="solution-process"><h3>단계별 풀이 과정</h3><ol>${detail.steps.map(([title,body]) => `<li><strong>${esc(title)}</strong><p>${esc(body)}</p></li>`).join('')}</ol></section>` : ''}<h3>보기별 해설</h3><ol class="choice-rationale">${detail.choices.map((choice, i) => `<li class="${i === q.answer ? 'correct-choice' : ''}"><strong>${i + 1}번 · ${esc(choice.title)}</strong><p>${esc(choice.reason)}</p></li>`).join('')}</ol><section class="explanation-example"><span class="subject-label">이해를 돕는 가상 사례</span><h3>${esc(detail.example.title)}</h3><p>${esc(detail.example.situation)}</p><ul>${detail.example.effects.map(effect => `<li>${esc(effect)}</li>`).join('')}</ul></section><p class="explanation-takeaway"><strong>기억할 한 문장</strong><br>${esc(detail.takeaway)}</p><p>${esc(detail.caution)}</p>${detail.correction ? `<section class="question-correction"><h3>원문과 달라진 점 · 확인한 근거</h3><p>${esc(detail.correction)}</p></section>` : ''}<div class="explanation-sources"><strong>해설 참고 자료</strong>${detail.sources.map(source => `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ↗</a>`).join('')}</div></div>` : ''}`;
}
