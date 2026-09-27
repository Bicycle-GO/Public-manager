import {evaluationAttachment,evaluationCoreQuestions,evaluationExpectedQuestions} from './evaluation-questions.js';
import {bidFollowupSources} from './bid-followup-study.js';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const table=(title,headers,rows)=>`<div class="lesson-table-wrap" tabindex="0" role="region" aria-label="${esc(title)}"><table class="lesson-table"><caption>${esc(title)}</caption><thead><tr>${headers.map(x=>`<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((x,i)=>i?`<td>${esc(x)}</td>`:`<th scope="row">${esc(x)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
export const attachmentEvaluationExample={technicalMaximum:80,priceMaximum:20,rows:[['A',74,15],['B',70,18],['C',66,20]]};
export const evaluationFoundationTopics=[
 ['입찰제안평가 기초 용어와 문제 풀이','제안요청서 RFP·제안서·배점한도·정량평가·정성평가·입찰가격·가격평가점수를 먼저 구별합니다. 핵심문제 10개로 용어를 확인하고 예상문제 15개로 계산과 상황 판단을 연습합니다.'],
 ['첨부 80:20 점수표와 68점 계산','첨부 예시는 공고에서 기술 80점·가격 20점으로 정했다고 가정합니다. 80×0.85=68점이 통과선입니다. A 74+15=89, B 70+18=88, C 66+20=86에서 C는 기술 미달이고 A·B 순으로 협상합니다.'],
 ['계약서·보증금·지체상금 기초','계약서의 목적·금액·기간·보증·위험·지체를 확인합니다. 입찰보증금은 낙찰 후 계약체결, 계약보증금은 성실한 이행을 담보하고 선금은 초기 이행 자금, 지체상금은 책임 있는 지연에 따른 금액입니다.']
];
export function renderEvaluationFoundations(){
 const limit=attachmentEvaluationExample.technicalMaximum*.85;
 return `<div class="lesson-guide evaluation-foundations" aria-label="입찰제안평가 기초 학습">
 <section class="learning-goal"><span class="case-label">처음 배우는 입찰제안평가 · 첨부 해설 반영</span><h2>개념을 익히고, 직접 계산하고, 문제로 확인하세요</h2><p>평가는 ‘누가 이 일을 잘 수행할 수 있는지’를 정해진 기준으로 비교하는 과정입니다. 협상계약에서는 기술과 가격을 평가하고, 협상할 자격이 있는 업체들 사이에서 순위를 정합니다. 계약체결·이행은 그 뒤의 단계입니다.</p><ol class="case-steps"><li><strong>1. 기초 용어와 점수표 읽기</strong><p>아래 용어표와 첨부 사례를 읽고 ‘금액’과 ‘점수’, ‘자격’과 ‘순위’를 구분합니다.</p></li><li><strong>2. 핵심 10문항으로 개념 확인</strong><p>RFP, 평가기준, 85%의 분모, 동점 처리, 자료 보완과 공개를 확인합니다.</p></li><li><strong>3. 예상 15문항으로 적용 연습</strong><p>계산·업체 비교·협상 결렬·계약 연결을 풀고, 오답은 보기별 해설로 다시 확인합니다.</p></li></ol><div class="overview-intro-actions"><button class="button" data-action="start-evaluation-core">핵심 ${evaluationCoreQuestions.length}문항 풀기 →</button><button class="soft-button" data-action="start-evaluation-expected">예상 ${evaluationExpectedQuestions.length}문항 풀기 →</button></div><p class="small-text">${esc(evaluationAttachment.scope)}</p></section>
 <section><h3>처음 읽는 사람을 위한 용어표</h3>${table('입찰제안평가 기초 용어',['용어','쉽게 이해하기','구별할 점'],[
 ['제안요청서(RFP)','발주기관의 요구와 평가 방법을 알리는 문서','업체가 내는 제안서와 작성 주체가 다름'],
 ['제안서','업체가 어떻게 일을 수행할지 설명하는 답안','RFP 요구에 대응해야 함'],
 ['배점한도','해당 평가분야에서 받을 수 있는 최대점수','실제 받은 점수와 다름'],
 ['정량평가','증빙과 산식으로 확인하는 평가','수행실적·경영상태 등의 해당 항목'],
 ['정성평가','방법의 타당성 등을 전문적으로 판단','개인 취향이 아니라 공고한 기준으로 판단'],
 ['입찰가격','업체가 제안한 금액, 단위는 원','가격 상한을 확인할 때 사용'],
 ['가격평가점수','가격을 해당 산식으로 평가한 결과, 단위는 점','기술점수와 더하는 값'],
 ['협상적격자','기술·가격 요건을 충족해 협상할 자격이 있는 업체','적격자 전원과 계약하는 것은 아님'],
 ['우선협상대상자','정해진 순위에 따라 먼저 협상하는 업체','계약체결이 자동 완료된 상태가 아님'],
 ['계약상대자','정해진 절차로 계약을 체결한 상대방','평가·협상과 실제 이행의 단계 구별']
 ])}<p class="explanation-takeaway">요청(RFP) → 제안 → 평가 → 적격·순위 → 협상 → 계약 → 이행.</p></section>
 <section class="case-study"><span class="case-label">첨부 사례 · 가상 국립자료원</span><h3>80:20 점수표를 한 줄씩 풀어보기</h3><p>공고가 기술 80점·가격 20점이라고 가정합니다. 모든 업체는 가격 요건을 충족하고 차등점수제 등 별도 기준은 적용하지 않습니다. 80:20은 이 사례의 조건입니다. 아래 심화 정리에서는 기본 배점과 사업별 조정 배점을 따로 설명합니다.</p>${table('첨부 점수표',['업체','기술(80)','가격점수(20)','합계','기술 68점 이상?'],attachmentEvaluationExample.rows.map(([name,tech,price])=>[name,tech,price,tech+price,tech>=limit?'충족':'미달']))}<ol class="case-steps"><li><strong>1단계 · 분모를 찾는다</strong><p>85%를 곱할 값은 총점 100점이 아니라 기술 배점 80점입니다.</p></li><li><strong>2단계 · 통과선을 계산한다</strong><p>80 × 85 ÷ 100 = 80 × 0.85 = 68점. ‘이상’이므로 정확히 68점도 통과합니다.</p></li><li><strong>3단계 · 미달 업체를 제외한다</strong><p>C의 기술은 66점으로 68점에 못 미칩니다. 가격점수가 20점이고 합계가 86점이어도 기술 미달은 그대로입니다.</p></li><li><strong>4단계 · 적격자끼리 합계를 비교한다</strong><p>A는 74+15=89점, B는 70+18=88점입니다. 따라서 A → B 순서로 협상합니다.</p></li></ol><details><summary>합계가 85점을 넘으면 무조건 적격자인가?</summary><p>아닙니다. 85%는 기술 배점의 비율입니다. C의 합계 86점은 기술 통과선과 비교할 값이 아닙니다.</p></details><details><summary>A와 협상이 결렬되면 바로 재공고할까?</summary><p>남은 적격자 B와 동일한 기준·절차로 협상합니다. 모든 적격자와 결렬된 경우 재공고입찰에 부칠 수 있습니다.</p></details><button class="soft-button" data-action="single-question" data-id="420">같은 점수표로 예상 08번 풀기 →</button></section>
 <section><h3>헷갈릴 때 쓰는 문제풀이 5단계</h3><ol class="case-steps"><li><strong>문제의 단계부터 표시</strong><p>평가 중인지, 협상 결렬인지, 계약체결인지, 이행 지연인지 읽습니다. 적용하는 제도가 달라집니다.</p></li><li><strong>적용 조건에 밑줄</strong><p>실제 공고 배점, 가격 요건, 별도 점수 변환 여부, ‘이상’·‘모든’·‘남아 있다’ 같은 조건을 확인합니다.</p></li><li><strong>기준을 한 줄로 쓴다</strong><p>예: 기술 최대점수×0.85 / 적격자끼리 기술+가격 / 합계 동점이면 기술.</p></li><li><strong>보기마다 틀린 이유를 말한다</strong><p>‘무조건 최저가’, ‘합계 85점’, ‘바로 재공고’, ‘자동 계약’처럼 다른 단계의 말을 끼워 넣었는지 확인합니다.</p></li><li><strong>정답 확인 후 오답을 다시 푼다</strong><p>문제의 상세 해설에서 계산 과정과 네 보기의 이유를 읽고, 오답·북마크 목록으로 다시 연습합니다.</p></li></ol></section>
 <section><h3>첨부 후반부 · 평가 다음의 계약과 이행</h3>${table('네 가지 돈의 역할',['구분','언제·왜','헷갈리지 않기'],[
 ['입찰보증금','낙찰자가 계약을 체결할 의무를 담보','이행 지연 일수로 계산하는 돈이 아님'],
 ['계약보증금','체결한 계약의 성실한 이행을 담보','입찰 단계의 보증과 구별'],
 ['선금','계약이행에 필요한 자금 일부를 미리 지급','업체가 내는 지연 책임액이 아님'],
 ['지체상금','계약상대자의 책임 있는 이행 지연에 따라 산정','책임 없는 지연기간 등 산정 조건 확인']
 ])}<p>계약서에서는 <strong>목적·금액·기간·보증·위험·지체</strong>를 확인합니다. 담당자 전화번호가 유용한 정보라는 사실과 국가계약법 제11조에 항목으로 열거됐다는 사실은 다릅니다.</p><p>공사 종합심사낙찰제는 가격·공사수행능력·사회적 책임 등 공사 심사기준을 적용합니다. 추정가격 300억원 이상 일반공사는 대표적인 적용대상이지만, 300억원 미만 간이형 등도 있어 ‘300억원 이상에서만’으로 외우지 않습니다. 협상용역과 별도 시설공사는 적용 방식을 각각 확인합니다.</p><p class="guide-reference"><a href="${bidFollowupSources.law.url}" target="_blank" rel="noopener noreferrer">국가계약법 제11조 ↗</a><br><a href="${bidFollowupSources.decree.url}" target="_blank" rel="noopener noreferrer">국가계약법 시행령 · 보증금·지체상금 ↗</a><br><a href="${bidFollowupSources.comprehensive.url}" target="_blank" rel="noopener noreferrer">공사계약 종합심사낙찰제 심사기준 ↗</a></p></section>
 <section class="self-check"><h3>문제 묶음 선택</h3>${table('새 학습용 문제 25개',['묶음','학습 내용','자료 구분'],[
 ['핵심 01~10','용어·평가기준·적격·85%·동점·보완·공개·계약 연결','자체 제작한 기초 확인문제'],
 ['예상 01~07','68점 계산·합산·차순위·재공고·계약서·지체상금·종심제','첨부 예상 7문항을 보완·재구성'],
 ['예상 08','첨부 A·B·C 점수표로 적격자와 순위 판단','첨부 01번 사례를 바탕으로 제작'],
 ['예상 09~15','경계값·가격 상한·동점·결과 분석·보완·순서·종합 사례','자체 제작한 적용 문제']
 ])}<div class="overview-intro-actions"><button class="button" data-action="start-evaluation-core">핵심 10문항 풀기 →</button><button class="soft-button" data-action="start-evaluation-expected">예상 15문항 풀기 →</button><button class="soft-button" data-action="start-evaluation-all">새 문제 25문항 모두 풀기 →</button></div><p class="small-text">각 문항을 채점하면 개념 정의·단계별 풀이·보기별 해설·가상 공공기관 사례·암기 문장과 근거를 볼 수 있습니다. 첨부의 06번 원문은 본문이 없으므로 복원하지 않았습니다.</p><details><summary>첨부 해설 01~05번의 기존 문항도 보기</summary><div class="overview-intro-actions">${[[277,'01 협상적격자'],[278,'02 차순위 협상'],[279,'03 계약서'],[280,'04 지체상금'],[281,'05 종합심사']].map(([id,title])=>`<button class="text-button" data-action="single-question" data-id="${id}">${title} →</button>`).join('')}</div><p>이 버튼들은 CHAPTER 05의 기존 문항으로 연결됩니다. 새 예상문제 번호와 원문 해설 번호를 구분하세요.</p></details></section>
 <p class="guide-reference"><a href="${bidFollowupSources.negotiationTable.url}" target="_blank" rel="noopener noreferrer">협상계약 공식 예규 · 평가·적격·협상 절차 확인 ↗</a></p></div>`;
}
