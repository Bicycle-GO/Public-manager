import { subjects, lessons, questions, sources } from './data.js';
import { renderLessonGuide } from './lesson-content.js';
import { renderStudyMaterials, renderStudyNotes, renderMaterialTopics } from './study-ui.js';
import { curriculum, partLabel, chapterLabel, resolveLessonId, migrateStudyState } from './curriculum.js';
import { renderCurriculumOutline, renderChapterNavigation, renderPartDirectory, chapterUrl } from './curriculum-ui.js';

import { findChapter, practiceQuestions, renderChapterFilter, renderPracticeGroups, renderQuestionExplanation, renderQuestionContext } from './practice-ui.js';

const paths = {
 book: '<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Z"/><path d="M12 5v15"/>',
 home: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 pen: '<path d="m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15v5Z"/><path d="M13 20h8"/>',
 clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 file: '<path d="M14 3H5v18h14V8l-5-5Z"/><path d="M14 3v6h5M8 13h8M8 17h5"/>',
 bookmark: '<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
 chart: '<path d="M4 3v17h17M8 15v-4M13 15V6M18 15V9"/>',
 building: '<path d="m3 8 9-5 9 5H3ZM5 10v8M10 10v8M14 10v8M19 10v8M3 21h18"/>',
 arrow: '<path d="M4 12h15m-5-5 5 5-5 5"/>',
 chevron: '<path d="m9 5 7 7-7 7"/>',
 check: '<path d="m5 12 4 4L19 6"/>',
 search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 bell: '<path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3ZM10 21h4"/>',
 flame: '<path d="M12 3c1 5 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 0 3 2 4 2 4s3-3 1-9Z"/>',
 target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',
 external: '<path d="M14 3h7v7M21 3l-11 11M10 4H4v16h16v-6"/>',
 close: '<path d="m6 6 12 12M6 18 18 6"/>',
 leaf: '<path d="M20 3C9 1 2 8 7 16s16 1 13-13ZM5 21 16 9"/>',
 trophy: '<path d="M7 3h10v7a5 5 0 0 1-10 0V3ZM7 5H3v4c0 3 4 4 4 4m10-8h4v4c0 3-4 4-4 4M12 15v6M8 21h8"/>',
 menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
 sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v2M12 21v2M1 12h2M21 12h2M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2"/>',
 calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18M7 15h3M14 15h3"/>',
 refresh: '<path d="M20 8V3l-3 3a8 8 0 1 0 3 10M20 8h-5"/>'
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const day = () => new Date().toLocaleDateString('en-CA');
const initial = () => ({ curriculumVersion: curriculum.version, completed: [], answers: {}, bookmarks: [], activity: {}, goal: 5, examDate: '', lastLesson: null, exams: [] });
let state = initial();
try {
 const saved = JSON.parse(localStorage.getItem('jodalon-v1'));
 if (saved && Array.isArray(saved.completed) && Array.isArray(saved.bookmarks) && saved.answers && saved.activity) {
  state = { ...state, ...migrateStudyState(saved) };
  if(saved.curriculumVersion !== curriculum.version) localStorage.setItem('jodalon-v1',JSON.stringify(state));
 }
} catch { /* Start fresh if storage is unavailable or invalid. */ }
let page = 'dashboard', filter = 0, query = '', quiz = null, selected = null, revealed = false;
let examInterval;
let activeLesson = null, practiceChapter = null;
const save = () => { try { localStorage.setItem('jodalon-v1', JSON.stringify(state)); } catch { toast('저장 공간을 사용할 수 없어 이번 학습은 새로고침 시 사라질 수 있습니다.'); } };
const touch = () => { state.activity[day()] = (state.activity[day()] || 0) + 1; };
const answerCount = () => Object.keys(state.answers).length;
const correctCount = () => Object.entries(state.answers).filter(([id, answer]) => questions.find(q => q.id === +id)?.answer === answer).length;
const wrongQuestions = () => questions.filter(q => state.answers[q.id] !== undefined && state.answers[q.id] !== q.answer);
const percent = () => Math.round(state.completed.length / lessons.length * 100);
const streak = () => { let count = 0, d = new Date(); if (!state.activity[day()]) d.setDate(d.getDate()-1); while (state.activity[d.toLocaleDateString('en-CA')]) { count++; d.setDate(d.getDate()-1); } return count; };
const nextLesson = () => lessons.find(l => !state.completed.includes(l.id)) || lessons[0];
const external = (url, text) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${text} ${icon('external')}</a>`;
const navItems = [['dashboard','home','학습 대시보드'],['materials','file','학습자료 · 14일 계획'],['theory','book','기본이론'],['practice','pen','예상문제'],['mock','clock','모의고사'],['wrong','file','오답노트'],['saved','bookmark','북마크']];

function shell() {
 document.querySelector('#app').innerHTML = `<aside class="sidebar">
   <a class="brand" href="#dashboard"><span class="brand-symbol">${icon('book')}</span><span>조달<span class="brand-on">온</span><small>합격을 켜는 학습 공간</small></span></a>
   <div class="course-label">공공조달관리사 <span>2026</span></div>
   <div class="nav-caption">MY LEARNING</div><nav aria-label="학습 메뉴">${navItems.map(([id,i,label]) => `<a href="#${id}" class="nav-link ${page === id ? 'active' : ''}">${icon(i)}<span>${label}</span>${id === 'wrong' && wrongQuestions().length ? `<b>${wrongQuestions().length}</b>` : ''}${id === 'practice' ? '<em>NEW</em>' : ''}</a>`).join('')}</nav>
   <div class="nav-divider"></div><a class="nav-link ${page === 'info' ? 'active' : ''}" href="#info">${icon('info')}<span>시험 안내 · 학습 자료</span></a>
   <div class="sidebar-bottom"><div class="encourage">${icon('leaf')}<strong>작은 배움이 모여,<br>합격이라는 큰 변화로.</strong><p>오늘의 한 걸음도 응원해요.</p><span class="little-path"></span></div><div class="local-profile"><div class="avatar">나</div><div><strong>나의 학습 공간</strong><small><span class="status-dot"></span> 이 브라우저에 자동 저장</small></div></div></div>
 </aside><div class="workspace"><header class="topbar"><div class="breadcrumb"><button class="icon-button mobile-menu" data-action="menu" aria-label="메뉴 열기">${icon('menu')}</button><span>나의 학습 공간</span>${icon('chevron')}<strong>${navItems.find(n => n[0] === page)?.[2] || '시험 안내'}</strong></div><div class="top-actions"><span class="today">${new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'long'})}</span><button class="icon-button" data-action="notice" aria-label="학습 안내">${icon('bell')}<i></i></button><span class="avatar small">나</span></div></header><main id="main" tabindex="-1"></main><footer>© 2026 조달온 <span>배움이 쌓이는 나만의 공간</span><a href="#info">학습 콘텐츠 및 출처 안내 ${icon('external')}</a></footer></div>`;
}
function render() {
 clearInterval(examInterval);
 shell();
 const main = document.querySelector('#main');
 if (page === 'dashboard') main.innerHTML = dashboard();
 else if (page === 'materials') main.innerHTML = renderStudyMaterials(state);
 else if (page === 'theory') main.innerHTML = theory();
 else if (page === 'practice') main.innerHTML = practice();
 else if (page === 'wrong') main.innerHTML = review(false);
 else if (page === 'saved') main.innerHTML = review(true);
 else if (page === 'mock') main.innerHTML = mock();
 else main.innerHTML = info();
 if (quiz) renderQuiz();
}
function head(eyebrow,title,subtitle,extra='') { return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${subtitle}</p></div>${extra}</div>`; }
function dashboard() {
 const next = state.lastLesson ? lessons.find(l=>l.id===state.lastLesson && !state.completed.includes(l.id)) || nextLesson() : nextLesson();
 const count = answerCount();
 return `${head('YOUR LEARNING JOURNEY','오늘도, 합격에 한 걸음 더','꾸준함이 실력이 되는 곳. 나만의 속도로 차근차근 시작해 보세요.',`<button class="soft-button" data-action="goal">${icon('target')} 학습 목표 설정</button>`)}
 <a class="materials-shortcut" href="#materials"><div><strong>제1편 공공조달관리사 필기</strong><span>3개 PART · ${lessons.length}개 CHAPTER · 연습문제 ${questions.length}문항 · 14일 학습계획</span></div><b>학습자료 보기 →</b></a>
 <div class="dashboard-columns"><div class="primary-column">
  <section class="hero"><div class="hero-content"><span class="hero-tag"><span></span> 공공조달관리사 합격 프로젝트</span><h2>기초부터 탄탄하게,<br>합격까지 빈틈없이.</h2><p>핵심 이론을 이해하고, 문제로 확인하세요.<br>오늘의 학습이 내일의 자신감이 됩니다.</p><button class="button light" data-action="lesson" data-id="${next.id}">${state.completed.length || state.lastLesson ? '이어서 학습하기' : '첫 학습 시작하기'} ${icon('arrow')}</button><div class="hero-foot">${icon('check')} 기본이론 <span>·</span> 예상문제 <span>·</span> 오답 복습을 한 곳에서</div></div><div class="hero-art" aria-hidden="true"><div class="orb orb-one"></div><div class="orb orb-two"></div><div class="floating-spark spark-one">✧</div><div class="floating-spark spark-two">✦</div><div class="book-stack book-back"></div><div class="book-stack book-front"><span>PUBLIC<br>PROCUREMENT</span><div class="cover-seal">${icon('building')}</div><strong>공공조달관리사</strong><small>THE FIRST STEP</small><div class="book-lines"></div></div><div class="art-check">${icon('check')}</div><div class="art-leaf leaf-one"></div><div class="art-leaf leaf-two"></div><div class="art-shadow"></div></div></section>
  <section class="stats" aria-label="나의 학습 통계"><div class="stat"><span class="stat-icon green">${icon('book')}</span><div><span>이론 학습률</span><strong>${percent()}<small>%</small></strong><p>${state.completed.length} / ${lessons.length}개 단원 완료</p></div></div><div class="stat"><span class="stat-icon blue">${icon('pen')}</span><div><span>풀어본 문제</span><strong>${count}<small>문제</small></strong><p>총 ${questions.length}문제 중</p></div></div><div class="stat"><span class="stat-icon orange">${icon('target')}</span><div><span>나의 정답률</span><strong>${count ? Math.round(correctCount()/count*100) : 0}<small>%</small></strong><p>${count ? '문제별 최근 답안 기준' : '첫 문제를 풀어보세요'}</p></div></div></section>
  <section class="section"><div class="section-title"><h2>제1편 · PART별 이론 <span class="count-pill">3개 PART</span></h2><a href="#theory">전체 보기 ${icon('chevron')}</a></div><div class="subject-grid">${subjects.map(subjectCard).join('')}</div></section>
  <section class="section"><div class="section-title"><h2>오늘의 학습 추천 <span class="tiny-label">조금씩, 꾸준히</span></h2></div><div class="recommend-grid"><button class="recommend" data-action="quick-quiz"><span class="recommend-icon green">${icon('pen')}</span><div><span class="small-label">DAILY PRACTICE</span><h3>하루 5문제 챌린지</h3><p>짧게 풀고, 확실하게 내 것으로.</p><span class="recommend-meta">5문제 <i>·</i> 약 5분</span></div>${icon('arrow')}</button><button class="recommend" data-action="navigate" data-page="wrong"><span class="recommend-icon peach">${icon('refresh')}</span><div><span class="small-label">REVIEW & GROW</span><h3>틀린 문제, 다시 한 번</h3><p>헷갈렸던 개념을 실력으로 바꿔요.</p><span class="recommend-meta">복습할 문제 <b>${wrongQuestions().length}개</b></span></div>${icon('arrow')}</button></div></section>
 </div><aside class="secondary-column"><section class="card goal-card"><div class="mini-heading"><h2>나의 학습 목표</h2><span>${icon('target')}</span></div><div class="goal-ring" style="--progress:${Math.min(100,(state.activity[day()]||0)/state.goal*100)}"><div><small>오늘의 학습</small><strong>${state.activity[day()]||0}<span> / ${state.goal}</span></strong><span>활동 완료</span></div></div><p class="goal-message">${(state.activity[day()]||0)>=state.goal ? '오늘의 목표 달성! 멋진 하루예요.' : '작은 성취를 하나씩 채워보세요.'}</p><div class="week-days">${weekDays()}</div><div class="streak">${icon('flame')} <b>${streak()}일 연속</b> <span>학습 ${streak() ? '중이에요!' : '시작해 볼까요?'}</span></div></section>
 <section class="card continue-card"><div class="mini-heading"><h2>${state.lastLesson ? '이어서 학습하기' : '오늘의 첫 단원'}</h2>${icon('book')}</div><span class="subject-label">제${next.subject}과목 · 기본이론</span><h3>${next.title}</h3><p>${next.summary}</p><div class="progress-track"><span style="width:${percent()}%"></span></div><div class="continue-meta"><span>전체 이론 ${percent()}% 완료</span><span>약 ${next.minutes}분</span></div><button class="button outline full" data-action="lesson" data-id="${next.id}">학습하러 가기 ${icon('arrow')}</button></section>
 <section class="exam-banner"><span class="exam-badge">2026 국가기술자격</span><h3>공공조달관리사<br>시험을 준비하고 있나요?</h3><p>시험 정보와 공식 자료를<br>한 곳에서 확인하세요.</p><a href="#info">시험 안내 확인하기 ${icon('arrow')}</a><span class="banner-decoration">${icon('calendar')}</span></section>
 </aside></div><div class="source-note">${icon('info')} 기본 개념을 익히는 입문 학습 콘텐츠와 학습용 예상문제를 제공합니다. 최신 출제기준과 법령은 공식 자료를 함께 확인해 주세요.</div>`;
}
function weekDays() {
 let date = new Date(); const weekday = (date.getDay()+6)%7; date.setDate(date.getDate()-weekday);
 return ['월','화','수','목','금','토','일'].map((label,i)=>{ let d = new Date(date); d.setDate(d.getDate()+i); const key = d.toLocaleDateString('en-CA'); return `<div><span>${label}</span><b class="${state.activity[key] ? 'done' : ''} ${key===day() ? 'current' : ''}">${state.activity[key] ? icon('check') : d.getDate()}</b></div>`; }).join('');
}
function subjectCard(s) { const total=lessons.filter(l=>l.subject===s.id).length; const done = lessons.filter(l=>l.subject===s.id && state.completed.includes(l.id)).length; return `<article class="subject-card"><div class="subject-card-top"><span class="subject-icon ${s.color}">${icon(s.icon)}</span><span>${partLabel(s.id)}</span></div><h3>${s.title}</h3><p>${s.desc}</p><div class="tags">${s.tags.map(t=>`<span>${t}</span>`).join('')}</div><div class="subject-progress"><span>학습 진도 <b>${done}/${total}</b></span><strong>${Math.round(done/total*100)}%</strong></div><div class="progress-track"><span style="width:${Math.round(done/total*100)}%"></span></div><button data-action="subject" data-id="${s.id}">학습 시작하기 ${icon('arrow')}</button></article>`; }
function tabs() { return `<div class="tabs" role="group" aria-label="과목 선택">${[{id:0,title:'전체 PART'},...subjects].map(s=>`<button class="${filter===s.id?'selected':''}" data-action="filter" data-id="${s.id}" aria-pressed="${filter===s.id}">${s.id ? `${partLabel(s.id)} · ${s.short}` : s.title}</button>`).join('')}</div>`; }

function subjectOverview(kind) {
 const isTheory=kind==='theory';
 if(isTheory) return head('VOLUME 01 · THEORY',curriculum.title,'공부할 PART를 선택하세요. 각 PART의 목차와 본문을 별도 페이지에서 학습합니다.')+renderPartDirectory(state.completed);
 return head(isTheory?'SUBJECT LIBRARY':'QUESTION BANK',isTheory?'과목별 기본이론':'과목별 예상문제',isTheory?'공부할 과목을 선택하세요. 과목별 페이지에서 단원을 순서대로 읽을 수 있습니다.':'연습할 과목을 선택하세요. 이론과 분리된 문제 페이지에서 집중해서 풀어보세요.')+
 '<div class="subject-library">'+subjects.map(s=>{
 const count=isTheory?lessons.filter(l=>l.subject===s.id).length:questions.filter(q=>q.subject===s.id).length;
 return '<a class="card library-card" href="#'+kind+'/'+s.id+'"><span class="subject-icon '+s.color+'">'+icon(s.icon)+'</span><div><span class="subject-label">PART 0'+s.id+'</span><h2>'+s.title+'</h2><p>'+s.desc+'</p><span class="library-meta">'+(isTheory?'기본이론 '+count+'단원':'예상문제 '+count+'문항 · 정답 및 해설')+'</span></div><span class="library-open">'+(isTheory?'이론 학습하기':'문제 보러 가기')+' '+icon('arrow')+'</span></a>';
 }).join('')+'</div>';
}
function theory() {
 if(!filter) return subjectOverview('theory');
 const s=subjects.find(s=>s.id===filter), l=activeLesson;
 const list=lessons.filter(item=>item.subject===filter);
 if(!l) return head(curriculum.title,partLabel(s.id)+' '+s.title,'이 PART의 '+list.length+'개 CHAPTER 중 공부할 단원을 선택하세요.', '<a class="soft-button" href="#theory">PART 선택으로</a>')+tabs()+renderCurriculumOutline(state.completed,s.id);
 const chapterIndex=list.findIndex(item=>item.id===l.id);
 const previous=list[chapterIndex-1], next=list[chapterIndex+1];
 return head(curriculum.title,partLabel(s.id)+' '+s.title,chapterLabel(l.chapter)+' · '+l.title+' · 이 PART의 '+list.length+'개 장', '<a class="soft-button" href="#theory/'+s.id+'">이 PART 목차 보기</a>')+
 tabs()+'<div class="reading-layout">'+renderChapterNavigation(l,state.completed)+'<div class="card reading-card"><article class="lesson-content"><div class="eyebrow">'+partLabel(s.id)+' · '+chapterLabel(l.chapter)+'</div><h2>'+l.title+'</h2><p class="lesson-summary">'+l.summary+'</p><div class="lesson-tools"><span>'+icon('clock')+' 약 '+l.minutes+'분</span><button class="soft-button '+(state.bookmarks.includes('l'+l.id)?'bookmarked':'')+'" data-action="bookmark-lesson" data-id="'+l.id+'">'+icon('bookmark')+' '+(state.bookmarks.includes('l'+l.id)?'저장됨':'북마크')+'</button></div>'+l.sections.map(([title,content],i)=>'<section><h3><span>'+String(i+1).padStart(2,'0')+'</span>'+title+'</h3><p>'+content+'</p></section>').join('')+renderLessonGuide(l)+renderStudyNotes(l)+'<div class="takeaway"><strong>'+icon('info')+' 핵심 정리</strong><p>'+l.takeaway+'</p></div><div class="lesson-source">관련 공식 자료 '+external(sources[l.source],sourceLabel(l.source))+'</div><p class="muted small-text">자체 작성한 입문용 학습 자료입니다. 상세 요건은 현행 법령과 공식 교재를 확인하세요.</p></article><div class="reading-actions"><span>'+partLabel(s.id)+' · '+(chapterIndex+1)+' / '+list.length+'개 CHAPTER</span><button class="button" data-action="complete-lesson" data-id="'+l.id+'">'+icon('check')+' '+(state.completed.includes(l.id)?'학습 완료됨':'학습 완료하기')+'</button></div><div class="chapter-pagination">'+(previous?'<a href="'+chapterUrl(previous)+'">← '+partLabel(previous.subject)+' · '+chapterLabel(previous.chapter)+'<small>'+previous.title+'</small></a>':'<a href="#theory/'+s.id+'">← '+partLabel(s.id)+' 목차</a>')+(next?'<a href="'+chapterUrl(next)+'">'+partLabel(next.subject)+' · '+chapterLabel(next.chapter)+' →<small>'+next.title+'</small></a>':'<a href="#practice/'+s.id+'">'+partLabel(s.id)+' 예상문제로 확인 →</a>')+'</div></div></div>';
}
function sourceLabel(key) { return key==='pps' ? '공공조달역량개발원 표준교재' : new URL(sources[key]).hostname.endsWith('law.go.kr') ? '국가법령정보센터' : '조달청 공식 안내'; }

function openLesson(id) {
 const l=lessons.find(l=>l.id===resolveLessonId(id));if(!l)return;
 if(quiz){openLessonModal(id);return;}
 go('theory/'+l.subject+'/'+l.id);
}

function theoryList() {
 return `${head('BUILD YOUR FOUNDATION','차근차근, 기본이론','개념을 이해하고 핵심 포인트를 정리하며 나만의 기초를 다져보세요.')}<div class="toolbar">${tabs()}<label class="search-field">${icon('search')}<input type="search" placeholder="단원 검색" aria-label="단원 검색" value="${esc(query)}" id="lesson-search"></label></div><div id="lesson-list">${lessonList()}</div>`;
}
function lessonList() {
 const filtered = lessons.filter(l=>(!filter || l.subject===filter) && (l.title+l.summary).includes(query));
 if (!filtered.length) return empty('search','검색 결과가 없어요','다른 단어로 검색하거나 과목 필터를 변경해 보세요.');
 return subjects.filter(s=>filtered.some(l=>l.subject===s.id)).map(s=>`<section class="section lesson-group"><div class="section-title"><h2><span class="subject-icon ${s.color}">${icon(s.icon)}</span> 제${s.id}과목. ${s.title}</h2><span>${filtered.filter(l=>l.subject===s.id).length}개 단원</span></div><div class="card">${filtered.filter(l=>l.subject===s.id).map(l=>`<div class="lesson-row"><span class="lesson-number ${state.completed.includes(l.id)?'complete':''}">${state.completed.includes(l.id)?icon('check'):chapterLabel(l.chapter)}</span><button class="lesson-title" data-action="lesson" data-id="${l.id}"><h3>${l.title}</h3><p>${l.summary}</p></button><span class="duration">${icon('clock')} ${l.minutes}분</span><button class="icon-button ${state.bookmarks.includes('l'+l.id)?'bookmarked':''}" data-action="bookmark-lesson" data-id="${l.id}" aria-label="${esc(l.title)} 북마크" aria-pressed="${state.bookmarks.includes('l'+l.id)}">${icon('bookmark')}</button><button class="soft-button" data-action="lesson" data-id="${l.id}">${state.completed.includes(l.id)?'다시 읽기':'학습하기'} ${icon('chevron')}</button></div>`).join('')}</div></section>`).join('');
}
function practice() {
 if (!filter) return subjectOverview('practice');
 const filtered = practiceQuestions(filter, practiceChapter?.id);
 const title = practiceChapter ? chapterLabel(practiceChapter.chapter)+' '+practiceChapter.title : partLabel(filter)+' · 예상문제';
 const subtitle = practiceChapter ? partLabel(filter)+' · '+subjects[filter-1].title : subjects[filter-1].title+' · CHAPTER별로 문제를 풀고 해설을 확인하세요.';
 return head('QUESTION BANK',title,subtitle,'<button class="button" data-action="start-filtered">'+icon('pen')+' '+(practiceChapter?'이 CHAPTER':'이 PART')+' '+filtered.length+'문항 풀기</button>')+'<div class="notice-line">'+icon('info')+' 학습용 연습문항 '+filtered.length+'개입니다. 핵심문제는 정답 확인 후 보기별 해설과 사례를 제공합니다.</div>'+tabs()+renderChapterFilter(filter,practiceChapter)+(practiceChapter?'<a class="practice-theory-link" href="'+chapterUrl(practiceChapter)+'">이 CHAPTER의 기본이론 읽기 →</a>':'')+renderPracticeGroups(filter,practiceChapter,questionRow);
}
function questionRow(q) {
 const answered = state.answers[q.id] !== undefined;
 const correct = state.answers[q.id]===q.answer;
 return `<article class="question-row card"><span class="question-index">${q.sourceNumber ? '<small>대화</small>'+String(q.sourceNumber).padStart(2,'0') : String(q.id).padStart(2,'0')}</span><button class="question-title" data-action="single-question" data-id="${q.id}"><div><span class="subject-label">제${q.subject}과목</span><span class="difficulty">${q.core?'단원별 핵심문제':q.difficulty}</span>${answered ? `<span class="answer-status ${correct?'correct':'incorrect'}">${correct?'정답':'복습 필요'}</span>` : ''}</div><h3>${q.text}</h3>${q.adapted?'<span class="adapted-badge">학습용 보정 · 해설에서 확인</span>':''}<p>${chapterLabel(lessons.find(l=>l.id===q.lesson).chapter)} · ${lessons.find(l=>l.id===q.lesson).title}</p></button><button class="icon-button ${state.bookmarks.includes('q'+q.id)?'bookmarked':''}" data-action="bookmark-question" data-id="${q.id}" aria-label="${q.sourceNumber?'대화 '+q.sourceNumber:q.id}번 문제 북마크" aria-pressed="${state.bookmarks.includes('q'+q.id)}">${icon('bookmark')}</button><button class="round-arrow" data-action="single-question" data-id="${q.id}" aria-label="${q.sourceNumber?'대화 '+q.sourceNumber:q.id}번 문제 풀기">${icon('arrow')}</button></article>`;
}
function empty(i,title,desc,button='<a class="button" href="#practice">예상문제 풀기 '+icon('arrow')+'</a>') { return `<div class="empty card"><span class="empty-icon">${icon(i)}</span><h2>${title}</h2><p>${desc}</p>${button}</div>`; }
function review(saved) {
 const list = saved ? questions.filter(q=>state.bookmarks.includes('q'+q.id)) : wrongQuestions();
 const savedLessons = saved ? lessons.filter(l=>state.bookmarks.includes('l'+l.id)) : [];
 return `${head(saved?'KEEP WHAT MATTERS':'REVIEW & GROW',saved?'다시 보고 싶은, 북마크':'틀린 만큼 성장하는, 오답노트',saved?'기억해 두고 싶은 이론과 문제를 한 곳에 모았어요.':'틀린 문제를 다시 풀고, 헷갈린 개념을 확실하게 정리해 보세요.',list.length ? `<button class="button" data-action="${saved?'review-saved':'review-wrong'}">${icon('refresh')} ${list.length}문제 다시 풀기</button>` : '')}${savedLessons.length ? `<section class="section"><h2>저장한 이론</h2><div class="saved-lessons">${savedLessons.map(l=>`<button class="card saved-lesson" data-action="lesson" data-id="${l.id}">${icon('book')}<div><span class="subject-label">제${l.subject}과목</span><h3>${l.title}</h3></div>${icon('chevron')}</button>`).join('')}</div></section>` : ''}${list.length?`<div class="question-list">${list.map(questionRow).join('')}</div>`:!savedLessons.length?empty(saved?'bookmark':'check',saved?'북마크가 아직 없어요':'복습할 오답이 없어요',saved?'이론이나 문제의 북마크 아이콘을 눌러 저장해 보세요.':'예상문제를 풀면 틀린 문제들이 이곳에 모여요. 다시 맞히면 자동으로 정리됩니다.') : ''}`;
}
function mock() {
 return `${head('CHECK YOUR READINESS','실력을 점검하는, 미니 모의고사','시간 안에 문제를 풀고 과목별 결과로 다음 학습 방향을 찾아보세요.')}<div class="mock-layout"><section class="card mock-intro"><span class="large-icon">${icon('clock')}</span><span class="eyebrow">MINI MOCK EXAM</span><h2>나의 현재 실력은 어느 정도일까요?</h2><p>3개 과목에서 무작위로 4문제씩 출제됩니다.<br>시험이 끝나면 채점 결과와 해설을 확인할 수 있어요.</p><div class="mock-facts"><div><strong>12<span>문제</span></strong><small>과목별 4문제</small></div><div><strong>15<span>분</span></strong><small>제한 시간</small></div><div><strong>3<span>과목</span></strong><small>기본 개념 점검</small></div></div><button class="button" data-action="start-exam">미니 모의고사 시작 ${icon('arrow')}</button><small class="mock-note">학습용 ${questions.length}문항에서 출제되며 실제 시험 구성·난도와 다릅니다.</small></section><section class="card exam-history"><h2>${icon('chart')} 최근 응시 기록</h2>${state.exams.length ? state.exams.slice(-5).reverse().map(e=>`<div class="history-row"><div><strong>${new Date(e.date).toLocaleDateString('ko-KR')}</strong><small>${e.correct} / ${e.total}문제 정답</small></div><b>${Math.round(e.correct/e.total*100)}<small>점</small></b></div>`).join('') : `<div class="history-empty">${icon('file')}<p>아직 응시 기록이 없어요.<br>첫 모의고사에 도전해 보세요.</p></div>`}</section></div>`;
}
function info() {
 return `${head('YOUR EXAM GUIDE','시험 안내 · 학습 자료','공식 정보로 준비하고, 검증된 자료로 학습의 깊이를 더하세요.')}<section class="card info-intro"><span class="exam-badge">국가기술자격</span><h2>공공조달관리사</h2><p>공공조달 전 과정에 대한 전문지식과 실무능력을 검증하는 자격입니다. 원서접수, 시험 일정, 출제기준은 큐넷에서 최신 공고를 확인하세요.</p>${external(sources.exam,'정부 공식 시험 안내')}${external(sources.qnet,'큐넷 바로가기')}</section><div class="info-grid"><section class="card info-box"><h2>${icon('book')} 필기 학습 과목</h2>${subjects.map(s=>`<p><span class="subject-label">제${s.id}과목</span> ${s.title}</p>`).join('')}<p class="muted">실기 과목: 공공조달관리 실무</p>${external(sources.subjects,'국가기술자격법 시행규칙 · 시험과목')}</section><section class="card info-box"><h2>${icon('building')} 공식 자료실</h2>${external(sources.pps,'공공조달역량개발원 · 표준교재')}${external(sources.law,'국가계약법 · 국가법령정보센터')}${external(sources.local,'지방계약법 · 국가법령정보센터')}${external(sources.qnet,'큐넷 · 시험 공고 및 출제기준')}</section></div><section class="card info-box"><h2>이 학습 공간의 콘텐츠 안내</h2><a href="#materials">필기 핵심 학습자료 · 14일 계획 보기 →</a><p>제1편 공공조달관리사 필기를 3개 PART·${lessons.length}개 CHAPTER로 구성하고 심화 정리·비교표·계산 예제를 더해 학습용 연습문제 ${questions.length}개로 구성한 학습 공간입니다. 공식 기출문제나 전체 출제범위를 대체하는 교재가 아니며, 합격을 보장하지 않습니다. 과목 구성은 공식 법령 자료를 참고했고, 이론과 해설은 기본 개념을 학습하기 위해 자체 작성했습니다.</p><p>법령상 금액, 기한과 세부 예외는 개정될 수 있어 이 콘텐츠에서는 구체적 수치 암기보다 개념 이해를 중심으로 다룹니다. 응시 전 최신 법령, 큐넷 출제기준과 표준교재를 함께 확인해 주세요. 웹 학습자료 업데이트: 2026. 9. 20. 추가 자료의 반영 범위는 학습자료 페이지에서 확인할 수 있습니다.</p><p>학습 진도, 최근 답안, 북마크와 모의고사 기록은 이 브라우저에만 저장됩니다. 다른 기기와 동기화되지 않으며 브라우저 데이터 삭제 시 지워집니다.</p><button class="soft-button" data-action="export">${icon('file')} 학습 기록 내보내기</button></section>`;
}
function openLessonModal(id) {
 const l = lessons.find(l=>l.id===id); if (!l) return;
 state.lastLesson = id; save();
 const modal = document.querySelector('#modal');
 modal.innerHTML = `<div class="modal-top"><span class="subject-label">제${l.subject}과목 · ${subjects[l.subject-1].title}</span><button class="icon-button" data-action="close-modal" aria-label="닫기">${icon('close')}</button></div><article class="lesson-content"><div class="eyebrow">${partLabel(l.subject)} · ${chapterLabel(l.chapter)}</div><h2>${l.title}</h2><p class="lesson-summary">${l.summary}</p><div class="lesson-tools"><span>${icon('clock')} 약 ${l.minutes}분</span><button class="soft-button ${state.bookmarks.includes('l'+id)?'bookmarked':''}" data-action="bookmark-lesson" data-id="${id}">${icon('bookmark')} ${state.bookmarks.includes('l'+id)?'저장됨':'북마크'}</button></div>${l.sections.map(([title,content],i)=>`<section><h3><span>${String(i+1).padStart(2,'0')}</span>${title}</h3><p>${content}</p></section>`).join('')}${renderLessonGuide(l)}${renderStudyNotes(l)}<div class="takeaway"><strong>${icon('leaf')} 꼭 기억하세요</strong><p>${l.takeaway}</p></div><div class="lesson-source">관련 공식 자료 ${external(sources[l.source],sourceLabel(l.source))}</div><p class="muted small-text">자체 작성한 입문용 개념 학습 자료입니다. 상세 적용 요건은 현행 법령과 공식 교재를 확인하세요.</p></article><div class="modal-bottom"><button class="soft-button" data-action="lesson-quiz" data-id="${id}">관련 문제 풀기 ${icon('arrow')}</button><button class="button" data-action="complete-lesson" data-id="${id}">${icon('check')} ${state.completed.includes(id)?'학습 완료됨':'학습 완료하기'}</button></div>`;
 if (!modal.open) modal.showModal();
 modal.scrollTop = 0;
}
function startQuiz(list, mode='practice') {
 if (!list.length) return;
 quiz = { list, index: 0, mode, answers: {}, checked: {}, deadline: mode==='exam'?Date.now()+15*60*1000:null };
 selected = null; revealed = false;
 document.querySelector('#modal').close();
 renderQuiz();
 document.querySelector('#main').focus();
 window.scrollTo(0,0);
}
function renderQuiz() {
 clearInterval(examInterval);
 const q = quiz.list[quiz.index]; selected = quiz.answers[q.id] ?? null; revealed = !!quiz.checked[q.id];
 document.querySelector('#main').innerHTML = `${head(quiz.mode==='exam'?'MINI MOCK EXAM':'PRACTICE MAKES PROGRESS',quiz.mode==='exam'?'미니 모의고사':'예상문제 풀이','한 문제씩 집중하며, 배운 내용을 확인해 보세요.',`<button class="soft-button" data-action="exit-quiz">그만 풀기 ${icon('close')}</button>`)}<div class="quiz-layout"><section class="card quiz-card"><div class="quiz-top"><span class="subject-label">${partLabel(q.subject)} · ${chapterLabel(lessons.find(l=>l.id===q.lesson).chapter)}</span><span>${quiz.index+1} <span class="muted">/ ${quiz.list.length}문제</span></span></div><div class="progress-track"><span style="width:${(quiz.index+1)/quiz.list.length*100}%"></span></div><div class="quiz-question"><span class="difficulty">${q.core?'단원별 핵심문제':q.difficulty}</span><button class="icon-button ${state.bookmarks.includes('q'+q.id)?'bookmarked':''}" data-action="bookmark-question" data-id="${q.id}" aria-label="문제 북마크" aria-pressed="${state.bookmarks.includes('q'+q.id)}">${icon('bookmark')}</button><h2><span>Q${String(quiz.index+1).padStart(2,'0')}.</span> ${q.text}</h2></div>${renderQuestionContext(q)}<div class="options" role="group" aria-label="답안 선택">${q.options.map((option,i)=>`<button class="option ${selected===i?'chosen':''} ${revealed && q.answer===i?'right':''} ${revealed && selected===i && q.answer!==i?'wrong':''}" data-action="select-answer" data-id="${i}" aria-pressed="${selected===i}" ${revealed?'disabled':''}><span>${i+1}</span><span>${option}</span>${revealed && q.answer===i ? icon('check'):''}</button>`).join('')}</div>${revealed ? `<div class="explanation ${selected===q.answer?'success':'error'}" role="status"><strong>${icon(selected===q.answer?'check':'info')} ${selected===q.answer?'정답이에요!':'조금 아쉬워요. 정답은 '+(q.answer+1)+'번이에요.'}</strong>${renderQuestionExplanation(q)}<button class="text-button" data-action="lesson" data-id="${q.lesson}">관련 이론 읽기 ${icon('arrow')}</button></div>`:''}<div class="quiz-bottom"><button class="soft-button" data-action="prev-question" ${quiz.index===0?'disabled':''}>이전 문제</button>${quiz.mode==='exam' ? `<button class="button" data-action="${quiz.index===quiz.list.length-1?'submit-exam':'next-question'}">${quiz.index===quiz.list.length-1?'답안 제출하기':'다음 문제'} ${icon('arrow')}</button>` : revealed ? `<button class="button" data-action="next-question">${quiz.index===quiz.list.length-1?'학습 결과 보기':'다음 문제'} ${icon('arrow')}</button>` : `<button class="button" data-action="check-answer" ${selected===null?'disabled':''}>정답 확인하기 ${icon('check')}</button>`}</div></section><aside class="card quiz-side"><h3>${quiz.mode==='exam'?icon('clock')+' 남은 시간':'문제 한눈에 보기'}</h3>${quiz.mode==='exam'?'<div class="timer" id="timer"></div>':''}<div class="question-dots">${quiz.list.map((item,i)=>`<button class="${i===quiz.index?'current':''} ${quiz.answers[item.id]!==undefined?'answered':''}" data-action="jump-question" data-id="${i}" aria-label="${i+1}번 문제로 이동">${i+1}</button>`).join('')}</div><p>${quiz.mode==='exam'?'답안은 제출 후 채점됩니다. 미응답 문항은 오답으로 처리됩니다.':'답안을 확인하면 학습 기록에 저장돼요. 오답은 다시 풀며 복습해 보세요.'}</p><span class="small-text muted">${q.origin || '자체 제작 개념 확인용 문항'}</span></aside></div>`;
 if (quiz.mode==='exam') { updateTimer(); examInterval = setInterval(updateTimer,1000); }
}
function updateTimer() {
 if (!quiz || quiz.mode!=='exam') return;
 const remaining = Math.max(0,Math.ceil((quiz.deadline-Date.now())/1000));
 const timer = document.querySelector('#timer');
 if (timer) timer.textContent = `${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;
 if (!remaining) finishQuiz();
}
function recordAnswer(q, answer) { state.answers[q.id] = answer; touch(); save(); }
function finishQuiz() {
 clearInterval(examInterval);
 const result = quiz;
 if (result.mode==='exam') { result.list.forEach(q=>recordAnswer(q,result.answers[q.id]??-1)); state.exams.push({date:new Date().toISOString(),correct:result.list.filter(q=>result.answers[q.id]===q.answer).length,total:result.list.length}); state.exams=state.exams.slice(-50); save(); }
 const answered = result.mode==='exam' ? result.list : result.list.filter(q=>result.checked[q.id]);
 const correct = answered.filter(q=>result.answers[q.id]===q.answer).length;
 quiz = null; shell();
 document.querySelector('#main').innerHTML = `${head('ONE STEP FORWARD','오늘도 한 걸음 성장했어요','결과를 돌아보고, 헷갈린 개념을 다시 확인해 보세요.')}<section class="card result-card"><span class="large-icon">${icon('trophy')}</span><h2>학습을 완료했어요!</h2><div class="result-score">${answered.length?Math.round(correct/answered.length*100):0}<span>점</span></div><p>${answered.length}문제 중 <strong>${correct}문제 정답</strong> · ${result.mode === 'exam' ? result.list.filter(q => result.answers[q.id] === undefined).length : result.list.length-answered.length}문제 ${result.mode === 'exam' ? '미응답' : '미완료'}</p><div class="subject-results">${subjects.filter(s=>answered.some(q=>q.subject===s.id)).map(s=>{const all=answered.filter(q=>q.subject===s.id),right=all.filter(q=>result.answers[q.id]===q.answer).length;return `<div><span>${s.short}</span><div class="progress-track"><span style="width:${right/all.length*100}%"></span></div><strong>${right}/${all.length}</strong></div>`;}).join('')}</div><div class="result-actions"><a href="#wrong" class="soft-button" data-action="navigate" data-page="wrong">오답노트 보기</a><button class="button" data-action="navigate" data-page="dashboard">대시보드로 ${icon('arrow')}</button></div></section><section class="section"><h2>문제별 해설</h2>${answered.map(q=>`<article class="card result-explanation"><span class="answer-status ${result.answers[q.id]===q.answer?'correct':'incorrect'}">${result.answers[q.id]===q.answer?'정답':'오답'}</span><h3>${q.text}</h3>${renderQuestionContext(q)}<p>내 답: ${result.answers[q.id]===undefined || result.answers[q.id]===-1?'미응답':q.options[result.answers[q.id]]}<br><strong>정답: ${q.options[q.answer]}</strong></p>${renderQuestionExplanation(q)}<button class="text-button" data-action="lesson" data-id="${q.lesson}">관련 이론 보기 ${icon('arrow')}</button></article>`).join('')}</section>`;
 window.scrollTo(0,0);
}
function toast(message) { const el=document.querySelector('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),3500); }
function go(target) { quiz=null; filter=0; query=''; if (location.hash==='#'+target) {route();} else location.hash=target; window.scrollTo(0,0); }
function shuffled(list) { const result=[...list]; for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];} return result; }
function confirmDialog(title,description,action,label) { const m=document.querySelector('#modal');m.innerHTML=`<div class="modal-top"><h2>${title}</h2><button class="icon-button" data-action="close-modal" aria-label="닫기">${icon('close')}</button></div><div class="dialog-body"><p>${description}</p><button class="button" data-action="${action}">${label}</button></div>`;m.showModal(); }
document.addEventListener('click',event=>{
 const el=event.target.closest('[data-action]');
 if(!el){
  const link=event.target.closest('a[href^="#"]');
  if(quiz && link?.getAttribute('href')===location.hash){event.preventDefault();go(location.hash.slice(1));}
  return;
 }
 const action=el.dataset.action,id=el.dataset.id;
 if(action==='navigate'){event.preventDefault();go(el.dataset.page);}
 if(action==='menu') document.querySelector('.sidebar').classList.toggle('open');
 if(action==='lesson') openLesson(id);
 if(action==='close-modal') document.querySelector('#modal').close();
 if(action==='study-plan'){const plan=document.querySelector('#study-plan');if(plan){plan.focus({preventScroll:true});plan.scrollIntoView({block:'start'});}}
 if(action==='subject') go('theory/'+id);
 if(action==='filter') go(page+(Number(id)?'/'+id:''));
 if(action==='bookmark-lesson'||action==='bookmark-question'){
  const key=(action==='bookmark-lesson'?'l':'q')+id;const has=state.bookmarks.includes(key);state.bookmarks=has?state.bookmarks.filter(x=>x!==key):[...state.bookmarks,key];save();
  if(document.querySelector('#modal').open && action==='bookmark-lesson'){const scroll=document.querySelector('#modal').scrollTop;openLessonModal(id);document.querySelector('#modal').scrollTop=scroll;} else if(quiz) renderQuiz();else render();
  toast(has?'북마크를 해제했어요.':'북마크에 저장했어요.');
 }
 if(action==='complete-lesson'){if(!state.completed.includes(id)){state.completed.push(id);touch();save();}document.querySelector('#modal').close();render();toast('학습 완료! 오늘도 한 걸음 성장했어요.');}
 if(action==='lesson-quiz'){const l=lessons.find(l=>l.id===id);if(l)go('practice/'+l.subject+'/'+l.id);}
 if(action==='single-question') startQuiz([questions.find(q=>q.id===Number(id))]);
 if(action==='start-overview') startQuiz(questions.filter(q=>q.lesson==='1-01' && q.sourceNumber));
 if(action==='start-filtered'){const list=practiceQuestions(filter,practiceChapter?.id);startQuiz([...list.filter(q=>q.core),...list.filter(q=>!q.core)]);}
 if(action==='quick-quiz') startQuiz(shuffled(questions).slice(0,5));
 if(action==='review-wrong') startQuiz(wrongQuestions());
 if(action==='review-saved') startQuiz(questions.filter(q=>state.bookmarks.includes('q'+q.id)));
 if(action==='start-exam') startQuiz(shuffled(subjects.flatMap(s=>shuffled(questions.filter(q=>q.subject===s.id)).slice(0,4))),'exam');
 if(action==='select-answer' && quiz && !revealed){quiz.answers[quiz.list[quiz.index].id]=Number(id);renderQuiz();}
 if(action==='check-answer' && quiz && selected!==null && !revealed){const q=quiz.list[quiz.index];quiz.checked[q.id]=true;recordAnswer(q,selected);renderQuiz();}
 if(action==='prev-question'&&quiz&&quiz.index>0){quiz.index--;renderQuiz();}
 if(action==='jump-question'&&quiz){quiz.index=Number(id);renderQuiz();}
 if(action==='next-question'&&quiz){if(quiz.index<quiz.list.length-1){quiz.index++;renderQuiz();}else finishQuiz();}
 if(action==='submit-exam'&&quiz){const missing=quiz.list.filter(q=>quiz.answers[q.id]===undefined).length;confirmDialog('답안을 제출할까요?',missing?`아직 ${missing}문제를 풀지 않았어요. 미응답 문제는 오답으로 처리됩니다.`:'모든 문제를 풀었어요. 제출하면 채점 결과와 해설을 확인할 수 있습니다.','confirm-submit','제출하고 결과 보기');}
 if(action==='confirm-submit'){document.querySelector('#modal').close();if(quiz)finishQuiz();}
 if(action==='exit-quiz') confirmDialog('학습을 마칠까요?',quiz.mode==='exam'?'진행 중인 모의고사 답안은 제출되지 않습니다.':'이미 정답을 확인한 문제의 기록은 저장됩니다.','confirm-exit','학습 마치기');
 if(action==='confirm-exit'){document.querySelector('#modal').close();quiz=null;render();}
 if(action==='notice') confirmDialog('나의 속도로, 꾸준히','이론을 완료하거나 문제의 정답을 확인하면 오늘의 학습 활동이 쌓입니다. 학습 기록은 이 브라우저에 자동으로 저장됩니다.','close-modal','확인했어요');
 if(action==='goal'){
  const m=document.querySelector('#modal');m.innerHTML=`<div class="modal-top"><h2>나의 학습 목표</h2><button class="icon-button" data-action="close-modal" aria-label="닫기">${icon('close')}</button></div><form id="goal-form" class="dialog-body"><label for="goal-number">하루 학습 활동 목표</label><p>이론 한 단원 완료 또는 문제 한 번 채점이 활동 1회로 기록됩니다.</p><select id="goal-number" name="goal">${[3,5,10,15,20].map(n=>`<option value="${n}" ${state.goal===n?'selected':''}>하루 ${n}회</option>`).join('')}</select><button class="button" type="submit">목표 저장하기 ${icon('check')}</button></form>`;m.showModal();
 }
 if(action==='export'){const url=URL.createObjectURL(new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),...state},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`jodalon-progress-${day()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('학습 기록을 내보냈어요.');}
});
document.addEventListener('input',event=>{if(event.target.id==='material-search'){document.querySelector('#material-topics').innerHTML=renderMaterialTopics(event.target.value);}if(event.target.id==='lesson-search'){query=event.target.value;document.querySelector('#lesson-list').innerHTML=lessonList();}});
document.addEventListener('change',event=>{if(event.target.id==='practice-chapter')go('practice/'+filter+(event.target.value?'/'+event.target.value:''));});
document.addEventListener('submit',event=>{if(event.target.id==='goal-form'){event.preventDefault();state.goal=Number(new FormData(event.target).get('goal'));save();document.querySelector('#modal').close();render();toast('새 학습 목표를 저장했어요.');}});
function route(){
 const [requested, subjectId, lessonId] = location.hash.slice(1).split('/');
 page=[...navItems.map(n=>n[0]),'info'].includes(requested)?requested:'dashboard';
 filter=['theory','practice'].includes(page) && subjects.some(s=>s.id===Number(subjectId)) ? Number(subjectId) : 0;
 activeLesson=page==='theory' && filter ? findChapter(filter,lessonId) : null;
 practiceChapter=page==='practice' && filter ? findChapter(filter,lessonId) : null;
 if(activeLesson){state.lastLesson=activeLesson.id;save();}
 const routedChapter=activeLesson || practiceChapter;
 if(routedChapter && lessonId!==routedChapter.id) history.replaceState(null,'','#'+page+'/'+filter+'/'+routedChapter.id);
 document.querySelector('#modal').close();
 quiz=null;query='';render();window.scrollTo(0,0);
}
window.addEventListener('hashchange',route);
window.addEventListener('beforeunload',event=>{if(quiz?.mode==='exam'){event.preventDefault();event.returnValue='';}});
route();
