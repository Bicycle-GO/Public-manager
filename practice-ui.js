import { lessons, questions } from './data.js';
import { chapterLabel, partLabel, resolveLessonId } from './curriculum.js';
import {renderCoverageBadge} from './chapter-review.js';
import {questionInChapter, renderEvaluationPracticeIntro} from './evaluation-study.js';
import { overviewConversation } from './overview-questions.js';
import { principlesConversation } from './principles-questions.js';

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const followupSets = [
  {collection:'evaluation-source',lesson:'2-04',subject:2,label:'입찰제안평가',date:'2026. 9. 26.'},
  {collection:'construction-special',lesson:'3-07',subject:3,label:'공사 특화·하도급',date:'2026. 9. 26.',range:'01~25번',summary:'종합심사·기술형 입찰 → 설계변경 → PQ·SOQ·TP → 통보·보증·전자지급을 연결하세요.',note:'원문 02·06·10·12·13·15·17·19·25번의 모호한 보기와 해설을 보완했습니다. 특히 17번은 절차 식별 문제로 재구성했고, 19·25번은 원문에 정확한 답이 없어 보기를 수정했습니다. 보정 이유와 정답 비교는 이론과 채점 후 해설에 표시합니다.'},
  {collection:'construction-general',lesson:'3-06',subject:3,label:'공사계약 후속',date:'2026. 9. 26.',range:'22~25번',summary:'준공검사·대안입찰·재하도급·실비정산을 확인하세요.',note:'앞선 공사계약 묶음에서 본문이 확인된 22~25번 4문항입니다. 이번에 01~21번을 복원하지 않았으며, CHAPTER 07의 별도 01~25번과 번호가 겹쳐도 다른 묶음으로 관리합니다.'},
  {collection:'law1-followup',lesson:'1-05',subject:1,label:'핵심 법령1',summary:'전자문서·계약 성립 → 보증·선금·지체상금 → 분쟁조정의 조건을 확인하세요.'},
  {collection:'law2-followup',lesson:'1-06',subject:1,label:'핵심 법령2·공정조달',summary:'조달사업·기관별 규정 → 공정조달·제재 → 권리구제를 구분하세요.'},
  {collection:'planning-followup',lesson:'2-01',subject:2,label:'조달 계획',summary:'수요예측·시장조사 → 비용·가격 → 위험과 일정을 연결하세요.'},
  {collection:'proposal-followup',lesson:'2-02',subject:2,label:'조달요구 응대·제안',summary:'RFI·RFQ·RFP → 사전규격·공고 → 참가자격·공동수급을 정리하세요. 23번 정답은 ① ㄱ·ㄴ으로 바로잡았습니다.'},
  {collection:'award-contract',lesson:'2-05',subject:2,label:'낙찰·계약',date:'2026. 9. 26.',range:'01~05·07~25번',summary:'협상순위·배점·동점 처리 → 계약·선금·보증 → 지체·정산·권리구제를 연결하세요.',note:'원대화의 06번은 정답표만 있고 문제 본문이 없어 제외했습니다. 나머지 24문항은 원문 번호를 유지합니다.'},
  {collection:'contract-management',lesson:'3-01',subject:3,label:'계약관리 일반',date:'2026. 9. 26.',summary:'CMP·착수·인력 → 위험·EVM·성과 → 하도급·지체·하자관리를 연결하세요.',note:'23번은 제공된 보기와 해설을 바탕으로 누락된 질문을 복원했습니다. CPI 등 계산 해석과 법령상 조건을 보완한 이유는 해설에 표시합니다.'},
  {collection:'contract-change',lesson:'3-02',subject:3,label:'계약변경·종결',date:'2026. 9. 26.',range:'01~25번',summary:'금액 조정·신규비목 → 검사·지급·보증 → 종료·분쟁 해결을 정리하세요.',note:'후속 19~25번을 추가했습니다. 지체상금 상한과 검사기간, 보증금 면제·귀속, 건축물 하자기간의 조건을 보완했습니다. 원문의 복수정답과 모호한 보기를 고친 이유를 해설에서 확인하세요.'},
  {collection:'goods-contract',lesson:'3-03',subject:3,label:'물품 계약관리',date:'2026. 9. 26.',range:'01~23번',summary:'구매·제조·단가 → 등록·규격·낙찰 → EXW·CIF → 변경·선금·검사를 연결하세요.',note:'첨부 12~17번과 후속 18~23번까지 반영했습니다. 해제·취소, 소액수의 조건, 외자·신용장, 국방·혁신조달과 관리전환·양여를 구분합니다. 원문 보정 이유와 공식 근거는 채점 후 해설에 표시합니다.'}
];

export function followupQuestions(collection) {
  return followupSets.some(set=>set.collection===collection) ? questions.filter(q=>q.collection===collection) : [];
}

function followupIntro(lessonId) {
  const set=followupSets.find(s=>s.lesson===lessonId);
  if(!set || lessonId==='2-04')return '';
  return `<div class="card overview-question-intro"><span class="subject-label">후속 대화 업데이트 · ${set.date||'2026. 9. 25.'}</span><h3>${esc(set.label)} 핵심문제 ${set.range||'01~25번'}</h3><p>${esc(set.summary)}</p><p>각 문항에 단계별 풀이·보기별 해설·공공기관 가상 사례·암기 포인트를 제공합니다.</p>${set.note?`<p class="small-text">${esc(set.note)}</p>`:''}<p class="small-text">대화 내용을 공식 근거와 대조한 학습용 문항입니다. 정답표 오류와 모호한 조건을 보완한 이유는 채점 후 해설에서 확인할 수 있습니다. 아래 전체 문제 수에는 기존 확인문제도 포함됩니다.</p><div class="overview-intro-actions"><button class="button" data-action="start-followup" data-id="${set.collection}">${esc(set.label)} ${followupQuestions(set.collection).length}문항 풀기 →</button><a href="#theory/${set.subject}/${set.lesson}">보충 이론과 사례 읽기 →</a></div></div>`;
}

export function questionLabel(q) {
  const set=followupSets.find(s=>s.collection===q.collection);
  if(set)return `${set.label} 대화 ${String(q.sourceNumber).padStart(2,'0')}번`;
  if(q.collection==='bid-execution')return `입찰 실행 대화 ${String(q.sourceNumber).padStart(2,'0')}번`;
  if (q.providedNumber) return `제공자료 예상문제 ${String(q.providedNumber).padStart(2,'0')}번`;
  if (q.attachmentNumber) return `첨부 ${q.type==='ox'?'OX':'예상문제'} ${String(q.attachmentNumber).padStart(2,'0')}번`;
  return q.sourceNumber ? `대화 ${q.sourceNumber}번` : `${q.id}번`;
}

export function answerLabel(q, index = q.answer) {
  if (!Number.isInteger(index) || index < 0 || index >= q.options.length) return '미응답';
  return q.type==='ox' ? q.options[index] : `${index+1}번`;
}

export function attachmentQuestions(type) {
  return questions.filter(q=>q.collection==='chapter02-attachment' && (!type || q.type===type));
}

export function electronicQuestions() {
  return questions.filter(q=>q.collection==='chapter03-provided');
}

export function strategicQuestions() {
  return questions.filter(q=>q.collection==='chapter04-provided');
}

export function bidQuestions() {
  return questions.filter(q=>q.collection==='bid-execution');
}

function bidIntro(lessonId) {
  if (lessonId !== '2-03') return '';
  return `<div class="card overview-question-intro"><span class="subject-label">참조 대화 업데이트 · 2026. 9. 26.</span><h3>입찰 실행 핵심문제 01~25번</h3><p>기존 01~10번에 후속 11~25번을 추가했습니다. 설명회·전자입찰 → 공동수급·예정가격 → 보증 확약·등록 변경·대리권과 무효를 연결하세요. 각 문항에 단계별 풀이, 보기별 해설, 공공기관 가상 사례와 암기 포인트를 제공합니다.</p><p class="small-text">법령 조문·제출기한·적용 범위를 보완한 학습용 문항입니다. 원문과 달라진 점은 해설에 표시합니다. 아래 문제 수와 풀이 진도에는 기존 확인문제도 포함됩니다.</p><div class="overview-intro-actions"><button class="button" data-action="start-bid-execution">입찰 실행 25문항 풀기 →</button><a href="#theory/2/2-03">입찰 흐름과 계산 사례 읽기 →</a><a href="#practice/2/2-05">낙찰·계약 후속 24문항 →</a></div></div>`;
}

function strategicIntro(lessonId) {
  if (lessonId !== '1-04') return '';
  return `<div class="card overview-question-intro"><span class="subject-label">제공 학습자료 업데이트 · CHAPTER 04</span><h3>전략적 공공조달 핵심 예상문제 25개</h3><p>중소기업·사회적 가치 → 녹색구매·LCC → 기술·혁신 → ESG와 성과를 연결해 풀어 보세요. 구매비율은 분모와 함께 기억하고, 정답 확인 후 보기별 해설을 읽으세요.</p><p class="small-text">전체 선택지가 없는 자료를 바탕으로 재구성한 학습용 문항입니다. 2026. 9. 24. 확인한 법령에 따라 11번 비율, 15번 부처명, 17번 지정기간과 정답 등을 보정했습니다. 원문과 달라진 점은 해설에 표시하며 공식 기출문제로 제공하지 않습니다.</p><div class="overview-intro-actions"><button class="button" data-action="start-chapter04">전략적 조달 25문항 풀기 →</button><a href="#theory/1/1-04">네 묶음 기본개념 읽기 →</a></div></div>`;
}

function electronicIntro(lessonId) {
  if (lessonId !== '1-03') return '';
  return `<div class="card overview-question-intro"><span class="subject-label">제공 학습자료 업데이트 · CHAPTER 03</span><h3>전자조달 핵심 예상문제 25개</h3><p>전자조달·나라장터 → 종합쇼핑몰·MAS → 특화 플랫폼 → 물품목록번호를 연결해 풀어 보세요. 정답 확인 후 보기별 이유와 암기 포인트를 제공합니다.</p><p class="small-text">전체 선택지가 없는 제공자료를 바탕으로 정답 번호를 유지하여 보기를 재구성했습니다. 용어·제도 설명을 수정한 문항은 해설에 이유와 공식 근거를 표시합니다. 공식 기출문제가 아닌 학습용 문항입니다.</p><div class="overview-intro-actions"><button class="button" data-action="start-chapter03">제공자료 25문항 풀기 →</button><a href="#theory/1/1-03">네 묶음 기본개념 읽기 →</a></div></div>`;
}

function principlesIntro(lessonId) {
  if (lessonId !== '1-02') return '';
  return `<div class="card overview-question-intro"><span class="subject-label">첨부 학습자료 업데이트 · CHAPTER 02</span><h3>예상문제 23개 + OX 20개</h3><p>5대 원칙·TCO·OECD 12원칙부터 입찰·낙찰·수의계약까지 확인하세요. 정답 확인 후 보기별 해설과 암기 포인트를 읽고, 오답과 북마크로 다시 풀 수 있습니다.</p><p class="small-text">첨부에는 객관식 전체 보기가 없어 정답 번호와 취지를 유지해 선택지를 재구성했습니다. 법령상 조건이 필요한 문장은 보정하고 해설에 이유와 참고 근거를 표시했습니다. 공식 기출문제가 아닌 학습용 문항입니다.</p><div class="overview-intro-actions"><button class="button" data-action="start-chapter02-expected">첨부 예상문제 23개 풀기 →</button><button class="soft-button" data-action="start-chapter02-ox">OX 20개 풀기 →</button></div><details><summary>기존 대화 22~25번 4문항</summary><p>성숙도 5단계(VFM)·법적 체계·해외 조달기관·재정 운영 효율성을 다루는 기존 문항입니다.</p><div class="overview-intro-actions"><button class="soft-button" data-action="start-principles">대화 22~25번 4문항 풀기 →</button><a href="${principlesConversation}">바탕이 된 대화 보기 ↗</a></div></details></div>`;
}

export function findChapter(subjectId, lessonId) {
  return lessons.find(l => l.subject === subjectId && l.id === resolveLessonId(lessonId)) || null;
}

export function practiceQuestions(subjectId, lessonId = null) {
  return questions.filter(q => (!subjectId || q.subject === subjectId) && (!lessonId || questionInChapter(q, lessonId)));
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
    return `<a class="card practice-chapter-card" href="#practice/${subjectId}/${l.id}"><span class="chapter-code">${chapterLabel(l.chapter)}</span><h2>${esc(l.title)}</h2>${renderCoverageBadge(l.id)}${l.id==='2-04'?'<p class="small-text">전용 25문항 + 기존 1문항 + CHAPTER 05 공유 10문항 · 학습기록 공유</p>':''}<p class="practice-card-total">총 ${list.length}문항 · 핵심 ${list.filter(q=>q.core).length}문항</p><div class="practice-card-progress"><span>풀이 완료 ${done} / ${list.length}</span><strong>${progress}%</strong></div><div class="progress-track"><span style="width:${progress}%"></span></div><div class="practice-card-counts"><span>미풀이 <b>${remaining}</b></span><span>오답 <b>${wrong}</b></span><span>북마크 <b>${saved}</b></span></div><span class="practice-card-open">문제 관리 페이지 →</span></a>`;
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
    const list = (visibleQuestions || practiceQuestions(subjectId, l.id)).filter(q=>questionInChapter(q,l.id));
    const shared = list.filter(q=>q.lesson!==l.id);
    const expected = list.filter(q => q.collection==='chapter02-attachment' && q.type==='multiple');
    const ox = list.filter(q => q.collection==='chapter02-attachment' && q.type==='ox');
    const provided = list.filter(q => ['chapter03-provided','chapter04-provided'].includes(q.collection));
    const evaluation = list.filter(q=>q.collection==='evaluation-source');
    const core = list.filter(q => q.lesson===l.id && q.core && !['chapter02-attachment','chapter03-provided','chapter04-provided','evaluation-source'].includes(q.collection));
    const extra = list.filter(q => q.lesson===l.id && !q.core);
    return `<section class="section practice-chapter"><div class="section-title"><h2><span class="chapter-code">${chapterLabel(l.chapter)}</span> ${esc(l.title)}</h2><a href="#practice/${subjectId}/${l.id}">${list.length}문항 · 단원별 보기 →</a></div>${visibleQuestions && visibleQuestions.length !== practiceQuestions(subjectId,l.id).length ? '' : l.id === '1-01' ? `<div class="card overview-question-intro"><span class="subject-label">공유 대화 핵심문제 업데이트</span><h3>05~21번 · 개요를 이해하는 17문항</h3><p>체계·목표·7R·대상물·이해관계자·역사·법령·절차·2024년 통계를 정리했습니다. 정답 확인 후 풀이 과정, 보기별 이유, 공공기관을 가정한 사례와 암기 포인트를 읽어 보세요.</p><p class="small-text">대화에서 확인한 05~21번을 반영했습니다. 모호한 질문과 사실관계는 보정하고 해설에 이유를 표시했습니다. 기존 핵심문제와 추가 확인문제도 함께 제공하며, 공식 기출문제로 표시하지 않습니다.</p><div class="overview-intro-actions"><button class="button" data-action="start-overview">공유 대화 17문항 풀기 →</button><a href="${overviewConversation}" target="_blank" rel="noopener noreferrer">바탕이 된 대화 보기 ↗</a></div></div>` : principlesIntro(l.id)+electronicIntro(l.id)+strategicIntro(l.id)+bidIntro(l.id)+followupIntro(l.id)+(l.id==='2-04'?renderEvaluationPracticeIntro():'')}${evaluation.length ? `<h3 class="practice-group-title">입찰제안평가 대화 01~25번 · ${evaluation.length}문항</h3><div class="question-list">${evaluation.map(renderRow).join('')}</div>` : ''}${shared.length ? `<h3 class="practice-group-title">평가 관련 공유 문항 · 원래 수록 CHAPTER 05 · ${shared.length}문항</h3><div class="question-list">${shared.map(renderRow).join('')}</div>` : ''}${provided.length ? `<h3 class="practice-group-title">제공자료 예상문제 · ${provided.length}문항</h3><div class="question-list">${provided.map(renderRow).join('')}</div>` : ''}${expected.length ? `<h3 class="practice-group-title">첨부 예상문제 · ${expected.length}문항</h3><div class="question-list">${expected.map(renderRow).join('')}</div>` : ''}${ox.length ? `<h3 class="practice-group-title">첨부 OX · ${ox.length}문항</h3><div class="question-list">${ox.map(renderRow).join('')}</div>` : ''}${core.length ? `<h3 class="practice-group-title">단원별 핵심문제</h3><div class="question-list">${core.map(renderRow).join('')}</div>` : ''}${extra.length ? `${shared.length || core.length || expected.length || ox.length || provided.length ? '<h3 class="practice-group-title">추가 확인문제</h3>' : ''}<div class="question-list">${extra.map(renderRow).join('')}</div>` : ''}</section>`;
  }).join('');
}

export function renderQuestionContext(q) {
  if(q.collection==='bid-execution') return `<p class="question-origin">${esc(questionLabel(q))}${q.adapted?' · 학습용 보정':''}</p>${q.passage?.length?`<section class="question-passage" aria-label="문제 보기"><h3>보기</h3>${q.passage.map(line=>`<p>${esc(line)}</p>`).join('')}</section>`:''}`;
  if(followupSets.some(set=>set.collection===q.collection)) return `<p class="question-origin">${esc(questionLabel(q))}${q.reconstructedStem?' · 질문 복원':''}${q.adapted?' · 학습용 보정':''}</p>${q.passage?.length?`<section class="question-passage" aria-label="문제 보기"><h3>보기</h3>${q.passage.map(line=>`<p>${esc(line)}</p>`).join('')}</section>`:''}`;
  return `${q.attachmentNumber || q.providedNumber ? `<p class="question-origin">${esc(questionLabel(q))}${q.reconstructed?' · 선택지 재구성':''}${q.adapted?' · 학습용 보정':''}</p>` : q.sourceNumber ? `<p class="question-origin">공유 대화 ${String(q.sourceNumber).padStart(2,'0')}번 · ${esc(q.topic)}${q.adapted ? ' · 학습용 보정' : ''}</p>` : ''}${q.passage?.length ? `<section class="question-passage" aria-label="문제 보기"><h3>보기</h3>${q.passage.map(line => `<p>${esc(line)}</p>`).join('')}</section>` : ''}`;
}

export function renderQuestionExplanation(q) {
  const detail = q.details;
  return `<p>${esc(q.explanation)}</p>${detail ? `<div class="detailed-explanation"><h3>${esc(detail.conceptTitle || '개념 이해')}</h3><p>${esc(detail.concept)}</p>${detail.steps?.length ? `<section class="solution-process"><h3>단계별 풀이 과정</h3><ol>${detail.steps.map(([title,body]) => `<li><strong>${esc(title)}</strong><p>${esc(body)}</p></li>`).join('')}</ol></section>` : ''}<h3>${q.type==='ox'?'OX 판단 근거':'보기별 해설'}</h3><ol class="choice-rationale">${detail.choices.map((choice, i) => `<li class="${i === q.answer ? 'correct-choice' : ''}"><strong>${q.type==='ox'?esc(choice.title):`${i + 1}번 · ${esc(choice.title)}`}</strong><p>${esc(choice.reason)}</p></li>`).join('')}</ol>${detail.example ? `<section class="explanation-example"><span class="subject-label">이해를 돕는 가상 사례</span><h3>${esc(detail.example.title)}</h3><p>${esc(detail.example.situation)}</p><ul>${detail.example.effects.map(effect => `<li>${esc(effect)}</li>`).join('')}</ul></section>` : ''}<p class="explanation-takeaway"><strong>기억할 한 문장</strong><br>${esc(detail.takeaway)}</p>${detail.caution?`<p>${esc(detail.caution)}</p>`:''}${q.reconstructed?'<p class="small-text">객관식 보기는 제공자료의 문항과 풀이를 바탕으로 재구성했습니다.</p>':''}${detail.correction ? `<section class="question-correction"><h3>원문과 달라진 점 · 확인한 근거</h3><p>${esc(detail.correction)}</p></section>` : ''}${detail.sources?.length ? `<div class="explanation-sources"><strong>해설 참고 자료</strong>${detail.sources.map(source => `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ↗</a>`).join('')}</div>` : ''}</div>` : ''}`;
}
