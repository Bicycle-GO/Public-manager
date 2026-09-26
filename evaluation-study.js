import {awardContractQuestions} from './award-contract-questions.js';
import {bidFollowupSources, awardScoreExample} from './bid-followup-study.js';
import {evaluationPrincipleTopics, renderEvaluationPrinciples} from './evaluation-principles.js';

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Keep one record and one answer/bookmark ID even when a question belongs in two study views.
export const evaluationQuestionIds = Object.freeze([277,278,282,286,290,291,295,296,297,298]);
export const evaluationQuestions = awardContractQuestions.filter(q=>evaluationQuestionIds.includes(q.id));
export const isEvaluationQuestion = q => evaluationQuestionIds.includes(q.id);
export const questionInChapter = (q, chapterId) => q.lesson===chapterId || (chapterId==='2-04' && isEvaluationQuestion(q));

export const evaluationTopics = [
 ['평가 기준·정량평가·정성평가','공고·제안요청서에서 항목·배점·산식·증빙을 먼저 확인합니다. 실적·경영상태 등 수치로 확인할 항목과 수행방법 등 전문적 판단이 필요한 항목을 구분하고, 동일 기준과 기록으로 평가합니다.'],
 ['협상계약 기본 배점 70:30과 85% 기준','2026. 1. 2. 국가계약 협상예규 제40호 별표는 기술 70점·가격 30점입니다. 분야별 배점은 제7조 제2항에 따라 20점 범위에서 조정할 수 있습니다. 협상적격 판단은 총점 85점이 아니라 기술 배점한도의 85% 이상과 가격 요건을 함께 봅니다.'],
 ['협상적격자·우선협상대상자·계약상대자','협상적격자는 기술·가격 요건을 충족한 업체입니다. 그중 종합평점과 동점 기준으로 협상순위를 정합니다. 첫 순위가 되었다고 계약이 자동 체결되는 것은 아니며, 선순위 협상 결렬 시 차순위와 협상할 수 있습니다.'],
 ['협상 동점 처리와 종합심사 비교','협상계약은 종합평점 → 기술능력평가점수 → 기술 세부평가항목 중 배점이 큰 항목의 점수 순으로 비교합니다. 기술점수도 같다고 곧바로 낮은 가격을 우선하지 않습니다. 공사 종합심사는 별도 심사기준을 적용합니다.'],
 ['평가자료 보완과 기술·가격협상','평가자료의 경미한 누락·불명확 사항 보완과 제안내용 협상은 다른 절차입니다. 보완으로 제안내용을 바꾸지 않습니다. 협상은 제안한 사업내용·방법·일정을 대상으로 하며, 증감이 있으면 관련 기준에 따라 가격을 검토합니다.'],
 ['평가 결과 공개·이의제기·제안서 개선','평가위원별·항목별 점수 등 공개 대상과 개인정보·영업비밀 등 비공개 요건을 구분합니다. 결과 분석은 기준과 점수·가격·제안서 증빙을 대조하는 일입니다. 평가위원 개인 연락처를 찾아 항의하는 것은 공식 이의제기 절차가 아닙니다.']
];
evaluationTopics.push(...evaluationPrincipleTopics);
export const evaluationThresholds = [70,80,90].map(maximum=>({maximum,threshold:maximum*.85}));
export const evaluationScoreRows = awardScoreExample.rows.map(([name,technical,price])=>({
 name,technical,price,total:technical+price,eligible:technical>=awardScoreExample.technicalMaximum*awardScoreExample.qualifyingRatio
}));
export const evaluationTieExample = [
 {name:'D',technical:65,price:24,majorItem:17},
 {name:'E',technical:65,price:24,majorItem:18}
];

export function renderEvaluationPracticeIntro() {
 return `<div class="card overview-question-intro evaluation-intro"><span class="subject-label">입찰제안평가 재검토 · 2026. 9. 26.</span><h3>입찰제안평가 01~25번 · 전용 예상문제 업데이트</h3><p>새로 확인한 평가 원문 25문항에 단계별 풀이·보기별 해설·가상 사례·공식 근거를 붙였습니다. 기존 확인문제 1개와 CHAPTER 05 공유 10문항을 포함해 총 36문항입니다.</p><p class="small-text">공유 문항의 정답·오답·북마크는 두 단원에서 같은 기록을 사용합니다. PART와 전체 문제 수에는 한 번만 셉니다. 아래 원래 수록 단원과 대화 번호도 유지합니다.</p><p class="small-text">03·10번 질문과 16번 질문 위치를 복원했습니다. 12번 가격산식, 17번 대형 SW 12명, 20번 사전접촉 5점 감점 등 보정 내용은 채점 후 확인할 수 있습니다. 공식 기출문제가 아닌 학습용 문항입니다.</p><div class="overview-intro-actions"><button class="button" data-action="start-followup" data-id="evaluation-source">입찰제안평가 25문항 풀기 →</button><button class="button" data-action="start-evaluation">평가 관련 대화 10문항 풀기 →</button><a href="#theory/2/2-04">평가 절차·계산·정정 내용 읽기 →</a></div></div>`;
}
function table(title,headers,rows) {
 return `<div class="lesson-table-wrap" tabindex="0" role="region" aria-label="${esc(title)}"><table class="lesson-table"><caption>${esc(title)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((c,i)=>i?`<td>${esc(c)}</td>`:`<th scope="row">${esc(c)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
const refs = keys => `<p class="guide-reference">${keys.map(key=>`<a href="${esc(bidFollowupSources[key].url)}" target="_blank" rel="noopener noreferrer">${esc(bidFollowupSources[key].title)} ↗</a>`).join('<br>')}</p>`;
const topic = i => `<h3>${esc(evaluationTopics[i][0])}</h3><p>${esc(evaluationTopics[i][1])}</p>`;

export function renderEvaluationStudy(lesson) {
 if(lesson.id!=='2-04')return '';
 return `<div class="lesson-guide evaluation-study" aria-label="입찰제안평가 심화 정리">
 <section class="learning-goal"><span class="case-label">입찰 핵심정리 대화 재검토 · 2026. 9. 26.</span><h2>입찰제안평가 · 기준부터 결과 검토까지</h2><p>국가계약의 협상에 의한 계약을 중심으로 정리합니다. 평가 기준 확인 → 기술평가 → 가격 개찰·평가 → 협상적격 판단 → 순위·동점 처리 → 결과 기록·통지 → 협상의 흐름을 구분하세요. 다른 낙찰방식의 기준을 그대로 섞지 않습니다.</p><p class="small-text">입찰제안평가 원문 01~25번 전체를 확인하여 전용 문제와 기본이론을 보강했습니다. 기존 낙찰·계약 관련 공유 10문항도 유지합니다. 국가·지방·조달청 기준을 구별하며 기관·점수 사례는 학습용 가정입니다.</p><a class="button" href="#practice/2/2-04">입찰제안평가 36문항 관리·풀이 →</a></section>
 ${renderEvaluationPrinciples()}
 <section>${topic(0)}${table('평가에서 무엇을 근거로 판단할까?',['구분','가상 자료','판단 방법'],[
 ['참가자격 확인','업종 등록·면허 등 공고상 요건','경쟁 참여 요건부터 확인; 기술점수와 구별'],
 ['정량평가','실적증명·경영상태 증빙 등','공고한 산식과 기준일에 따라 객관적으로 확인'],
 ['정성평가','수행방법·품질관리·사업 이해도 등','평가위원이 공고한 항목에 따라 전문적으로 판단'],
 ['가격평가','입찰가격·사업예산·해당 산식','공고와 적용 예규의 산식 사용; 단순 가격순과 구별']
 ])}<div class="case-study"><h4>가상 국립연구원 · 공간정보 분석 용역</h4><p>실적 10점 항목은 제출된 증빙과 정해진 계산법으로 확인하고, 수행방법 20점 항목은 분석 절차와 품질 확보 방안으로 판단합니다. 발표가 인상적이었다고 이미 공개한 실적 배점을 낮추거나 발표에 임의 가점을 주지 않습니다. 기술평가 완료 후 가격을 개찰하는 순서도 확인합니다.</p></div>${refs(['negotiation','negotiationTable'])}</section>
 <section>${topic(1)}<div class="question-correction"><h4>대화의 배점 설명을 바로잡았습니다</h4><p>참조 대화 중간에는 ‘70:30을 80:20으로 수정’하는 설명이 있었지만 마지막 답변에서 70:30으로 다시 정정했습니다. 확인한 2026. 1. 2. 시행 국가 예규 제40호 별표의 기본 배점도 기술 70·가격 30입니다. 따라서 기존 낙찰·계약 20번의 웹 학습 정답 ③을 유지합니다. 국가사업의 80:20·90:10은 조정 또는 특별 기준에 따른 배점일 수 있습니다. 지방계약 일반 기본배점 80:20과 구별합니다.</p></div>${table('기술 배점의 85% 계산',['적용 기술 배점','기술 통과 기준','계산'],evaluationThresholds.map(r=>[r.maximum+'점',r.threshold+'점 이상',r.maximum+' × 0.85']))}<p>기술 70점 사업에서 59.5점은 기술요건의 경계입니다. 총점이 높아도 기술요건을 충족하지 못하면 협상적격자가 아닙니다. 가격도 해당 사업예산 이하(예정가격을 작성한 경우 예정가격 이하)인지 함께 확인합니다.</p><p class="explanation-takeaway">기본 배점과 실제 공고 배점을 구분하고, 85%의 분모는 기술 배점한도로 잡는다.</p>${refs(['negotiation','negotiationTable'])}</section>
 <section>${topic(2)}${table('가상 평가표 · 기술 70 / 가격 30',['업체','기술','가격점수','합계','기술요건'],evaluationScoreRows.map(r=>[r.name,r.technical,r.price,r.total,r.eligible?'59.5점 이상 · 충족':'59.5점 미만 · 미충족']))}<p>세 업체 모두 가격 요건을 충족하고 차등점수제를 적용하지 않는다고 가정합니다. C사는 합계 89점이어도 기술점수 59점으로 제외됩니다. 남은 B사 89점과 A사 88점을 비교하면 B사가 먼저 협상합니다.</p><ol class="case-steps"><li><strong>1단계 · 통과할 자격인가?</strong><p>기술 기준과 가격 요건을 먼저 확인합니다.</p></li><li><strong>2단계 · 적격자 중 누가 앞서는가?</strong><p>기술과 가격을 합산하고 동점 기준을 적용합니다.</p></li><li><strong>3단계 · 협상이 성립했는가?</strong><p>첫 순위가 자동 계약상대자는 아닙니다. 선순위와 협상 결렬 시 동일 기준·절차로 차순위와 협상하고, 모든 적격자와 결렬되면 재공고 등 후속 절차를 검토합니다.</p></li></ol>${refs(['negotiationTable'])}</section>
 <section>${topic(3)}${table('협상계약 동점 비교 · 가상 D·E사',['업체','기술','가격점수','합계','배점이 가장 큰 기술항목'],evaluationTieExample.map(r=>[r.name,r.technical,r.price,r.technical+r.price,r.majorItem+'점']))}<p>배점이 가장 큰 기술항목이 하나이고 다른 특별 기준이 없다고 가정합니다. D·E 모두 종합 89점, 기술 65점이므로 다음 비교 대상은 큰 배점 기술항목입니다. 해당 점수가 18점인 E사가 17점인 D사보다 앞섭니다. 여기서 입찰가격을 다시 낮은 순으로 비교하지 않습니다.</p>${table('서로 다른 낙찰방식',['방식','핵심 비교','주의'],[
 ['협상에 의한 계약','기술·가격 종합평가 후 순위에 따라 협상','동점은 기술점수 → 큰 배점 기술항목'],
 ['공사 종합심사낙찰제','가격·공사수행능력·사회적 책임 등 종합심사','동점 처리의 세부기준은 공사 심사기준 적용'],
 ['적격심사','정해진 가격 순서에 따라 이행능력 등을 심사','제안서 발표 점수로 모든 업체의 순위를 정하는 제도가 아님']
 ])}<p class="explanation-takeaway">협상 동점: 합계 → 기술 → 큰 배점 기술항목. 종심제 동점 규정과 섞지 않는다.</p>${refs(['negotiationTable','comprehensive'])}</section>
 <section>${topic(4)}${table('보완과 협상의 경계',['상황','판단'],[
 ['제출 증빙의 경미한 누락·불명확','제안내용이 바뀌지 않는 범위에서 기한을 정한 보완 가능 여부 확인'],
 ['평가 중 새 기술·인력을 넣어 제안서 교체','단순 설명이나 보완으로 취급하지 않음'],
 ['협상에서 제안한 일정·수행방법 구체화','사업내용·이행방법·일정을 대상으로 협상'],
 ['사업과 관계없는 무상 과업이나 기술이전 요구','사업 목적·공정성과 어긋나는 요구 금지'],
 ['과업 증감에 따른 가격 검토','제안내용 협상 결과와 예산·가격협상 규정을 함께 적용']
 ])}<p>‘기술협상 → 가격협상’은 수행할 내용과 그 대가를 연결하는 학습 흐름입니다. 모든 내용 증감을 금지하는 뜻이 아니고, 발주기관이 관련 없는 일을 마음대로 추가할 수 있다는 뜻도 아닙니다.</p>${refs(['negotiationTable'])}</section>
 <section>${topic(5)}<ol class="case-steps"><li><strong>평가위원과 기준 관리</strong><p>전문성·이해충돌 및 제척·회피 등 해당 평가규정의 요건을 확인하고, 같은 정보와 같은 기준을 제공합니다.</p></li><li><strong>기록·공개 범위 확인</strong><p>국가계약 협상예규는 평가위원 명단과 위원별·항목별 점수 공개를 규정합니다. 공정한 업무수행에 필요한 위원명 비공개나 법령상 개인정보·영업비밀 등의 예외도 있으므로, ‘항상 모든 자료 공개’로 외우지 않습니다.</p></li><li><strong>제안서 개선과 공식 불복 구분</strong><p>기술점수가 낮은 항목의 증빙·수행계획을 보완합니다. 합산 오류나 기준 적용 문제를 제기할 때는 공식 담당창구와 법정 대상·기간·관할을 확인합니다. 계약상 분쟁과 행정처분 불복은 성격이 달라 모든 사안을 행정소송으로 묶지 않습니다.</p></li></ol><div class="case-study"><h4>가상 연구원 · 결과를 보고 다음 제안서 고치기</h4><p>A사는 가격점수가 높았지만 품질관리 항목에서 점수를 잃었습니다. 공개된 항목별 점수와 평가기준을 대조해 다음 제안서에 오류 검출 방법, 검증 담당자, 산출물 승인 절차를 구체화합니다. 위원의 개인 연락처를 찾아 직접 항의하는 방식은 결과 분석이 아닙니다.</p></div>${refs(['negotiationTable'])}</section>
 <section class="self-check"><h3>자기점검과 암기</h3><details><summary>80:20으로 공고했다면 기술 통과 기준은 59.5점인가?</summary><p>아닙니다. 실제 기술 배점 80점의 85%인 68점입니다. 59.5점은 기술 70점인 사례의 값입니다.</p></details><details><summary>기술점수도 동점이면 곧바로 최저가격을 우선하는가?</summary><p>아닙니다. 기술 세부평가항목 중 배점이 큰 항목의 점수 순으로 비교합니다.</p></details><details><summary>한 업체의 제안이 좋아 보이면 평가 배점을 바꿔도 되는가?</summary><p>제출된 제안서를 보고 특정 업체에 유리하게 사전 배점을 바꾸지 않습니다. 동일 기준으로 평가하고 근거를 기록합니다.</p></details><p class="explanation-takeaway">기준 먼저 → 기술 통과 → 합계 순위 → 동점 기준 → 기록·공개 → 협상.</p></section>
 <section><h3>확인한 원문 번호와 학습 연결</h3><p>아래는 모두 CHAPTER 05의 ‘낙찰·계약’ 대화 번호입니다. 새 번호를 붙이거나 문항을 복제하지 않고 CHAPTER 04에서 함께 관리합니다.</p>${table('평가 관련 공유 10문항',['원문 번호','주제'],[
 ['01·20·23','협상적격자·기본 배점·협상 동점 처리'],
 ['02·07·15','차순위 협상·기술/가격 협상·협상 범위'],
 ['16·22','공사 종합심사 항목·동점 기준 비교'],
 ['11·21','공식 이의제기·평가 결과 분석']
 ])}<button class="button" data-action="start-evaluation">평가 관련 대화 10문항 풀기 →</button>${refs(['conversation'])}</section>
 </div>`;
}
