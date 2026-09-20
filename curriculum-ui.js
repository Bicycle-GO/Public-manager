import { subjects, lessons, questions } from './data.js';
import { curriculum, partLabel, chapterLabel } from './curriculum.js';

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const chapterUrl = lesson => `#theory/${lesson.subject}/${lesson.id}`;

export function renderCurriculumOutline(completed = []) {
  return `<div class="curriculum-outline" aria-label="${esc(curriculum.title)} 전체 목차">${subjects.map(s => {
    const list = lessons.filter(l => l.subject === s.id);
    return `<section class="card curriculum-part"><div class="curriculum-part-heading"><span class="subject-label">${partLabel(s.id)}</span><h2>${esc(s.title)}</h2><p>${list.length}개 CHAPTER · ${list.filter(l => completed.includes(l.id)).length}개 학습 완료</p></div><ol>${list.map(l => `<li><a href="${chapterUrl(l)}"><span class="chapter-code">${chapterLabel(l.chapter)}</span><span class="chapter-description"><strong>${esc(l.title)}</strong><small>${esc(l.summary)}</small></span><span class="chapter-state">${completed.includes(l.id) ? '완료 ✓' : '읽기 →'}</span></a></li>`).join('')}</ol><a class="curriculum-practice" href="#practice/${s.id}">${partLabel(s.id)} 연습문제 ${questions.filter(q=>q.subject===s.id).length}문항 →</a></section>`;
  }).join('')}</div>`;
}

export function renderChapterNavigation(activeLesson, completed = []) {
  return `<aside class="card chapter-nav curriculum-nav"><a class="curriculum-volume" href="#theory">${esc(curriculum.title)}</a>${subjects.map(s => `<details ${activeLesson.subject === s.id ? 'open' : ''}><summary><span>${partLabel(s.id)}</span><strong>${esc(s.title)}</strong></summary>${lessons.filter(l=>l.subject===s.id).map(l => `<a class="${l.id===activeLesson.id?'current':''}" ${l.id===activeLesson.id?'aria-current="page"':''} href="${chapterUrl(l)}"><span class="chapter-code">${chapterLabel(l.chapter)}</span><strong>${esc(l.title)}</strong><small>약 ${l.minutes}분${completed.includes(l.id)?' · 학습 완료':''}</small></a>`).join('')}</details>`).join('')}<a class="chapter-practice" href="#practice/${activeLesson.subject}">이 PART의 연습문제 →</a></aside>`;
}
