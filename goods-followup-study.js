import {goodsFollowupQuestions,goodsFollowupTopics} from './goods-followup-questions.js';
export {goodsFollowupTopics};
export const goodsFollowupExamples={delay:{amount:500000000,rate:.00075,totalDays:10,excludedDays:3}};
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>n.toLocaleString('ko-KR')+'원';
export function renderGoodsFollowup(lesson){
  if(lesson.id!=='3-03')return '';
  const d=goodsFollowupExamples.delay;
  return `<section class="goods-followup" aria-label="물품 계약관리 12~23번 보충 학습">
    <div class="learning-goal"><span class="case-label">첨부 자료·후속 대화 12~23번</span><h2>납품 이후의 책임에서 외자·혁신·물품 재활용까지</h2><p>지체·하자·종료 → 계약방법·외자·신용장 → 국방·혁신 → 금액 조정·지급·관리전환으로 연결합니다. 아래 사례와 금액은 모두 학습용 가정입니다.</p></div>
    <section class="case-study"><h3>책임 있는 지체일수로 계산하기</h3><p>일반 물품 5억원, 1일 요율 0.00075, 기납 공제가 없다고 가정합니다. 책임 있는 지연이 10일이면 <strong>${money(d.amount*d.rate*d.totalDays)}</strong>입니다. 총 10일 중 책임 없는 3일을 제외한다면 <strong>${money(d.amount*d.rate*(d.totalDays-d.excludedDays))}</strong>입니다.</p><p>지체상금의 계산과 하자보수 요구, 계약 종료 여부는 서로 다른 판단입니다. 검사에 합격해도 보수 대상 하자가 있다면 책임기간과 계약조건을 확인합니다.</p></section>
    <div class="lesson-table-wrap" tabindex="0" role="region" aria-label="외자거래에서 확인할 세 규칙"><table class="lesson-table"><caption>외자거래에서 확인할 세 규칙</caption><thead><tr><th>구분</th><th>확인할 내용</th><th>혼동하지 않을 것</th></tr></thead><tbody>
      <tr><th>공공계약 법령·계약</th><td>권한·절차·이행·책임</td><td>국제조건 약정이 강행법규를 배제하지 않음</td></tr>
      <tr><th>Incoterms</th><td>인도·비용·위험 등 역할 분담</td><td>결제·소유권·준거법 전부를 정하는 규칙 아님</td></tr>
      <tr><th>L/C·UCP 600</th><td>신용장 조건에 따른 제시서류</td><td>은행 서류심사는 실제 물품의 무하자 보증 아님</td></tr>
    </tbody></table></div>
    ${goodsFollowupQuestions.map(q=>`<section><span class="case-label">대화 ${q.sourceNumber}번</span><h3>${esc(q.topic)}</h3><p>${esc(q.details.concept)}</p><div class="case-study"><h4>${esc(q.details.example.title)}</h4><p>${esc(q.details.example.situation)}</p><ul>${q.details.example.effects.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><p class="explanation-takeaway">${esc(q.details.takeaway)}</p><details><summary>원문에서 보완한 조건</summary><p>${esc(q.details.correction)}</p></details><p class="guide-reference">${q.details.sources.filter(s=>!s.url.includes('chatgpt.com')).map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a>`).join('<br>')}</p></section>`).join('')}
    <section class="self-check"><h3>세 가지 함정 다시 확인하기</h3>
      <details><summary>소급효가 있으면 모두 해제인가?</summary><p>아닙니다. 취소도 소급효가 있으므로 계약의 유효성·권리 행사 원인을 구분합니다. 이번 문항은 유효한 계약의 채무불이행에 따른 해제를 묻습니다.</p></details>
      <details><summary>서류가 일치하면 물품검사를 생략해도 되는가?</summary><p>아닙니다. 은행의 신용장 서류심사와 발주기관의 계약상 물품검사는 목적이 다릅니다.</p></details>
      <details><summary>관리전환과 양여는 같은 제도인가?</summary><p>아닙니다. 관리전환은 물품관리관의 소관 변경이고, 불용품 양여는 별도의 법정 대상·요건을 따릅니다. 관리전환이 언제나 무상인 것도 아닙니다.</p></details>
    </section>
  </section>`;
}
