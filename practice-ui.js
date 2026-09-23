import { lessons, questions } from './data.js';
import { chapterLabel, partLabel, resolveLessonId } from './curriculum.js';
import { overviewConversation } from './overview-questions.js';
import { principlesConversation } from './principles-questions.js';

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function principlesIntro(lessonId) {
  if (lessonId !== '1-02') return '';
  return `<div class="card overview-question-intro"><span class="subject-label">대화 핵심문제 업데이트 · CHAPTER 02</span><h3>22~25번 · 원칙과 법제도를 연결하는 4문항</h3><p>성숙도 5단계(VFM)·법적 체계·해외 조달기관·재정 운영 효율성을 공부합니다. 정답 확인 후 단계별 풀이, 보기별 해설, 공공기관 가상 사례와 암기 포인트를 확인하세요.</p><p class="small-text">23번은 법률별 역할을 묻도록 보정했고, 24번은 역사적 기관 연혁을 기준으로 합니다. 25번의 금액은 계산 가정입니다. 원문과 달라진 점과 확인 근거를 각 해설에 표시했습니다.</p><div class="overview-intro-actions"><button class="button" data-action="start-principles">대화 22~25번 4문항 풀기 →</button><a href="${principlesConversation}">바탕이 된 대화 보기 ↗</a></div></div>`;
}

export function findChapter(subjectId, lessonId) {
  return lessons.find(l => l.subject === subjectId && l.id === resolveLessonId(lessonId)) || null;
}

export function practiceQuestions(subjectId, lessonId = null) {
  return questions.filter(q => (!subjectId || q.subject === subjectId) && (!lessonId || q.lesson === lessonId));
}

export const practiceStatuses = [['all','전체'],['unanswered','미풀이'],['correct','정답'],['wrong','오답'],['saved','북마크']];

export function questionsByStatus(list, state, status = 'all') {
  const answers = state.answers || {}, bookmarks = state.bookmarks || [];
  return list.filter(q => status === 'unanswered' ? answers[q.id] === undefined
    : status === 'correct' ? answers[q.id] !== undefined && answers[q.id] === q.answer
    : status === 'wrong' ? answers[q.id] !== undefined && answers[q.id] !== q.answer
    : status === 'saved' ? bookmarks.includes('q'+q.id) : true);
}

export function renderPracticeDirectory(subjectId, state) {
  return `<section aria-label="CHAPTER별 문제 관리" class="practice-directory">${lessons.filter(l=>l.subject===subjectId).map(l=>{
    const list=practiceQuestions(subjectId,l.id), remaining=questionsByStatus(list,state,'unanswered').length;
    const wrong=questionsByStatus(list,state,'wrong').length, saved=questionsByStatus(list,state,'saved').length;
    const done=list.length-remaining, progress=list.length?Math.round(done/list.length*100):0;
    return `<a class="card practice-chapter-card" href="#practice/${subjectId}/${l.id}"><span class="chapter-code">${chapterLabel(l.chapter)}</span><h2>${esc(l.title)}</h2><p class="practice-card-total">총 ${list.length}문항 · 핵심 ${list.filter(q=>q.core).length}문항</p><div class="practice-card-progress"><span>풀이 완료 ${done} / ${list.length}</span><strong>${progress}%</strong></div><div class="progress-track"><span style="width:${progress}%"></span></div><div class="practice-card-counts"><span>미풀이 <b>${remaining}</b></span><span>오답 <b>${wrong}</b></span><span>북마크 <b>${saved}</b></span></div><span class="practice-card-open">문제 관리 페이지 →</span></a>`;
  }).join('')}</section>`;
}

export function renderPracticeStatus(chapter, state, activeStatus = 'all') {
  const list=practiceQuestions(chapter.subject,chapter.id), base=`#practice/${chapter.subject}/${chapter.id}`;
  return `<nav class="practice-status-tabs" aria-label="문제 상태별 보기">${practiceStatuses.map(([key,label])=>`<a href="${base}${key==='all'?'':'/'+key}" ${key===activeStatus?'aria-current="page"':''}>${label} <b>${questionsByStatus(list,state,key).length}</b></a>`).join('')}</nav><p class="practice-status-note">정답·오답은 마지막으로 채점한 답안 기준입니다. 북마크는 다른 상태와 중복될 수 있습니다.</p>`;
}

export function renderPracticeNavigation(chapter) {
  const list=lessons.filter(l=>l.subject===chapter.subject), index=list.findIndex(l=>l.id===chapter.id);
  return `<nav class="practice-chapter-navigation" aria-label="예상문제 CHAPTER 이동"><a href="#practice/${chapter.subject}">← ${partLabel(chapter.subject)} CHAPTER 목록</a><div>${[list[index-1],list[index+1]].filter(Boolean).map(l=>`<a href="#practice/${l.subject}/${l.id}">${l.chapter<chapter.chapter?'← 이전':'다음 →'} ${chapterLabel(l.chapter)}<small>${esc(l.title)}</small></a>`).join('')}</div></nav>`;
}

export function renderChapterFilter(subjectId, activeChapter) {
  return `<label class="practice-chapter-filter" for="practice-chapter">CHAPTER 선택<select id="practice-chapter"><option value="">이 PART의 전체 CHAPTER</option>${lessons.filter(l => l.subject === subjectId).map(l => `<option value="${l.id}" ${activeChapter?.id === l.id ? 'selected' : ''}>${chapterLabel(l.chapter)} · ${esc(l.title)}</option>`).join('')}</select></label>`;
}

export function renderPracticeGroups(subjectId, activeChapter, renderRow, visibleQuestions = null) {
  return lessons.filter(l => l.subject === subjectId && (!activeChapter || l.id === activeChapter.id)).map(l => {
    const list = (visibleQuestions || practiceQuestions(subjectId, l.id)).filter(q=>q.lesson===l.id);
    const core = list.filter(q => q.core);
    const extra = list.filter(q => !q.core);
    return `<section class="section practice-chapter"><div class="section-title"><h2><span class="chapter-code">${chapterLabel(l.chapter)}</span> ${esc(l.title)}</h2><a href="#practice/${subjectId}/${l.id}">${list.length}문항 · 단원별 보기 →</a></div>${visibleQuestions && visibleQuestions.length !== practiceQuestions(subjectId,l.id).length ? '' : l.id === '1-01' ? `<div class="card overview-question-intro"><span class="subject-label">공유 대화 핵심문제 업데이트</span><h3>05~21번 · 개요를 이해하는 17문항</h3><p>체계·목표·7R·대상물·이해관계자·역사·법령·절차·2024년 통계를 정리했습니다. 정답 확인 후 풀이 과정, 보기별 이유, 공공기관을 가정한 사례와 암기 포인트를 읽어 보세요.</p><p class="small-text">대화에서 확인한 05~21번을 반영했습니다. 모호한 질문과 사실관계는 보정하고 해설에 이유를 표시했습니다. 기존 핵심문제와 추가 확인문제도 함께 제공하며, 공식 기출문제로 표시하지 않습니다.</p><div class="overview-intro-actions"><button class="button" data-action="start-overview">공유 대화 17문항 풀기 →</button><a href="${overviewConversation}" target="_blank" rel="noopener noreferrer">바탕이 된 대화 보기 ↗</a></div></div>` : principlesIntro(l.id)}${core.length ? `<h3 class="practice-group-title">단원별 핵심문제</h3><div class="question-list">${core.map(renderRow).join('')}</div>` : ''}${extra.length ? `${core.length ? '<h3 class="practice-group-title">추가 확인문제</h3>' : ''}<div class="question-list">${extra.map(renderRow).join('')}</div>` : ''}</section>`;
  }).join('');
}

export function renderQuestionContext(q) {
  return `${q.sourceNumber ? `<p class="question-origin">공유 대화 ${String(q.sourceNumber).padStart(2,'0')}번 · ${esc(q.topic)}${q.adapted ? ' · 학습용 보정' : ''}</p>` : ''}${q.passage?.length ? `<section class="question-passage" aria-label="문제 보기"><h3>보기</h3>${q.passage.map(line => `<p>${esc(line)}</p>`).join('')}</section>` : ''}`;
}

export function renderQuestionExplanation(q) {
  const detail = q.details;
  return `<p>${esc(q.explanation)}</p>${detail ? `<div class="detailed-explanation"><h3>${esc(detail.conceptTitle || '개념 이해')}</h3><p>${esc(detail.concept)}</p>${detail.steps?.length ? `<section class="solution-process"><h3>단계별 풀이 과정</h3><ol>${detail.steps.map(([title,body]) => `<li><strong>${esc(title)}</strong><p>${esc(body)}</p></li>`).join('')}</ol></section>` : ''}<h3>보기별 해설</h3><ol class="choice-rationale">${detail.choices.map((choice, i) => `<li class="${i === q.answer ? 'correct-choice' : ''}"><strong>${i + 1}번 · ${esc(choice.title)}</strong><p>${esc(choice.reason)}</p></li>`).join('')}</ol><section class="explanation-example"><span class="subject-label">이해를 돕는 가상 사례</span><h3>${esc(detail.example.title)}</h3><p>${esc(detail.example.situation)}</p><ul>${detail.example.effects.map(effect => `<li>${esc(effect)}</li>`).join('')}</ul></section><p class="explanation-takeaway"><strong>기억할 한 문장</strong><br>${esc(detail.takeaway)}</p><p>${esc(detail.caution)}</p>${detail.correction ? `<section class="question-correction"><h3>원문과 달라진 점 · 확인한 근거</h3><p>${esc(detail.correction)}</p></section>` : ''}<div class="explanation-sources"><strong>해설 참고 자료</strong>${detail.sources.map(source => `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ↗</a>`).join('')}</div></div>` : ''}`;
}
