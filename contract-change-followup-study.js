const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const contractChangeFollowupTopics = [
  ['해제·해지와 원상회복','해제는 원상회복, 해지는 장래의 효력 소멸을 중심으로 구별합니다. 손해배상은 별도 요건을 판단하며, 공공공사의 검사·인수한 기성부분 정산도 따로 확인합니다. 해제됐다는 말만으로 이미 만든 시설을 무조건 철거하지 않습니다.'],
  ['발주기관 사정의 종료와 인정 비용','업체에게 책임이 없는 발주기관 사정의 종료만으로 부정당업자 제재를 하지 않습니다. 계약보증금 반환, 검사·인수한 부분의 미지급 대가, 계약조건에서 인정하는 철수비용 등을 구분하여 정산합니다. 모든 주장 손실이나 미래 이익을 자동으로 지급하는 것은 아닙니다.'],
  ['품목조정률·지수조정률 비교','품목조정률은 개별 품목·비목의 가격 변동을 법정 산정기준에 따라 조사합니다. 지수조정률은 비목군별 지수와 구성비 등을 활용합니다. 국가계약은 계약 체결 때 지수조정률을 원하는 경우 외에는 품목조정률을 명시하며, 이행 중 유리한 방식으로 임의 변경하지 않습니다.'],
  ['중간검사·부분검사·최종검사','중간은 검사 시점, 부분은 검사 범위를 설명하는 학습 분류입니다. 최종검사는 검사 대상 수행을 완료한 뒤의 확인이며 하자보수까지 모두 끝났다는 뜻은 아닙니다. 검사 주체와 전문기관 활용은 적용 법령과 계약조건에 따릅니다.'],
  ['선금 정산액·실지급액·미정산 잔액','선금은 계약대금의 선지급입니다. 기성·기납대가 지급 시 선금액×기성·기납 대가상당액÷계약금액으로 산출한 금액 이상을 정산합니다. 지급한도·추가 지급 요건·보증 확보와 정산 시점을 구별합니다.'],
  ['입찰보증금의 기준금액과 귀속','국가계약 일반기준은 입찰금액의 5% 이상이며 계약금액의 10%가 아닙니다. 낙찰 후 정당한 이유 없는 계약 미체결 시 귀속 문제를 판단합니다. 보증서 등도 가능하고 납부 면제는 귀속 사유 발생 시 지급의무 면제와 다릅니다.']
];

export const changeFollowupExamples = {
  termination:{accepted:30000000,withdrawal:2000000},
  itemAdjustment:[{name:'A자재',base:60000000,rate:.1},{name:'B자재',base:40000000,rate:.05}],
  advance:{contract:100000000,paid:30000000,progress:40000000},
  bidBond:{bid:200000000,rate:.05}
};

const money=n=>n.toLocaleString('ko-KR')+'원';
const table=(title,headers,rows)=>`<div class="lesson-table-wrap" tabindex="0" role="region" aria-label="${esc(title)}"><table class="lesson-table"><caption>${esc(title)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((s,i)=>i?`<td>${esc(s)}</td>`:`<th scope="row">${esc(s)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const check=(q,a)=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`;
const refs=(title,url)=>`<p class="guide-reference"><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)} ↗</a></p>`;

export function renderContractChangeFollowup(lesson){
  if(lesson.id!=='3-02')return '';
  const t=i=>`<h3>${esc(contractChangeFollowupTopics[i][0])}</h3><p>${esc(contractChangeFollowupTopics[i][1])}</p>`;
  const {termination,itemAdjustment,advance,bidBond}=changeFollowupExamples;
  const base=itemAdjustment.reduce((sum,item)=>sum+item.base,0);
  const difference=itemAdjustment.reduce((sum,item)=>sum+item.base*item.rate,0);
  const settled=advance.paid*advance.progress/advance.contract;
  return `<section class="contract-change-followup" aria-label="계약변경·종결 13~18번 보충 학습">
    <div class="learning-goal"><span class="case-label">후속 대화 13~18번 · 2026. 9. 26.</span><h2>계약을 끝내는 방식과 돈을 정산하는 방식</h2><p>13·14번은 종료의 효과와 책임, 15·16번은 가격 조정과 검사, 17·18번은 선금과 입찰보증금을 다룹니다. 아래 기관·금액·상황은 모두 학습용 가정입니다.</p></div>
    <section>${t(0)}${table('해제와 해지의 기본 효과',['구분','해제','해지'],[['효력의 방향','소급적 소멸을 기본으로 이해','장래의 효력 소멸'],['핵심 처리','받은 급부의 원상회복','종료 시점까지의 관계 정산'],['가상 사례','적법한 전체 해제로 장비와 대금을 서로 반환','1년 유지관리 중 6개월 후 종료·수행분 정산']])}<p>민법 제548·550·551조를 연결하면 ‘해제는 되돌리기, 해지는 앞으로 끝내기, 손해배상은 별도’입니다. 반환 범위·이자·제3자 보호와 공공계약의 기성 정산은 실제 적용 규정을 확인합니다.</p>${refs('민법 · 해제·해지와 손해배상','https://www.law.go.kr/법령/민법')}</section>
    <section>${t(1)}<div class="case-study"><h4>가상 국가기관 · 장비 제조사업의 불가피한 취소</h4><p>업체 책임은 없고, 검사·인수한 미지급 대가 3,000만원과 철수비용 200만원이 계약조건상 인정되었습니다. 다른 선금 정산·공제가 없다고 가정합니다.</p><p>인정 대가 ${money(termination.accepted)} + 인정 비용 ${money(termination.withdrawal)} = <strong>${money(termination.accepted+termination.withdrawal)}(3,200만원)</strong>. 계약보증금 반환은 별도로 처리합니다.</p></div><p class="common-mistake">‘손실 보상’을 업체가 요구하는 모든 비용과 장래 이익의 자동 지급으로 외우지 않습니다. 일반조건의 지급 항목과 별도의 손해배상 청구 요건을 구별합니다.</p>${refs('물품구매(제조)계약일반조건 · 제27조','https://www.law.go.kr/LSW/admRulLsInfoP.do?admRulSeq=2100000284264')}</section>
    <section>${t(2)}${table('가격 변동을 보는 두 방식',['방식','확인 자료','주의할 점'],[['품목조정률','품목·비목별 가격과 법정 등락 산식','실제 매입 영수증 차액을 전액 보전하는 방식 아님'],['지수조정률','비목군별 지수·구성비','생산자물가지수 하나를 전체 금액에 곱하는 방식 아님']])}<h4>가상 계산 · 비중이 다르면 단순 평균하지 않기</h4><p>조정 대상은 아래 두 자재뿐이고 계약단가와 기준가격이 같으며, 간접비·선금 공제 등은 없다고 단순화했습니다. 실제 조정은 법정 가격 비교·대상 이행분·산정 규칙에 따릅니다.</p>${table('품목별 변동 금액의 합산',['품목','당초 금액','변동률','변동 금액'],itemAdjustment.map(item=>[item.name,money(item.base),`+${item.rate*100}%`,money(item.base*item.rate)]))}<p>변동액 합계 ${money(difference)} ÷ 당초 합계 ${money(base)} = <strong>${difference/base*100}%</strong>. (10%+5%)÷2인 7.5%가 아닙니다. 비중을 반영하면 60%×10%+40%×5%=8%입니다.</p>${refs('국가계약법 시행령 제64조 · 조정방식 결정','https://www.law.go.kr/법령/국가를당사자로하는계약에관한법률시행령/제64조')}${refs('국가계약법 시행규칙 제74조 · 조정률 산정','https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1012657699')}</section>
    <section>${t(3)}${table('가상 도로대장 데이터 구축 검사의 관점',['분류','상황','확인할 내용'],[['중간검사','사업 진행 도중 점검','현재 수행분의 계약기준 충족 여부'],['부분검사','먼저 완료한 A구역 검사','해당 구역 성과품의 누락·품질'],['최종검사','검사 대상 전체 작업 완료','전체 성과품과 제출 의무 충족']])}<p>국가계약법 제14조는 계약서·설계서 등 관계 서류에 따른 검사를 규정합니다. 모든 검사를 전문기관에 맡기는 것이 필수는 아닙니다. 중간·부분은 겹칠 수 있는 관점이고, 최종검사 합격도 하자보수 의무의 자동 면제는 아닙니다.</p>${refs('국가계약법 제14조 · 검사','https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1017714987')}</section>
    <section>${t(4)}<h4>가상 용역 · 1억원 계약, 선금 3,000만원, 기성대가 4,000만원</h4><p>산식으로 산출한 금액만 정산하며, 별도 공제·반환·보증 조정이 없다고 가정합니다.</p>${table('선금 정산의 세 금액',['구분','계산','결과'],[['이번 정산액','3,000만원×4,000만원÷1억원',`${money(settled)}(1,200만원)`],['이번 실지급액','기성대가−이번 정산액',`${money(advance.progress-settled)}(2,800만원)`],['남은 미정산 선금','이미 지급한 선금−이번 정산액',`${money(advance.paid-settled)}(1,800만원)`]])}<p>기지급 선금 중 이번에 정산하는 1,200만원과 이번 지급 2,800만원을 합쳐 4,000만원어치 수행분의 대가를 충당합니다. 선금은 계약금액에 더해 주는 지원금이 아닙니다.</p><p class="common-mistake">집행기준은 산식의 금액 <strong>이상</strong>을 정산하도록 합니다. 선금 지급범위·최초 및 추가 지급 요건·적용 특례를 함께 확인하며, 별도 조건 없이 언제나 100% 지급할 수 있다고 보지 않습니다. 보증서·증권에 의한 채권 확보와 법정 면제도 구별합니다.</p>${refs('정부 입찰·계약 집행기준 · 선금 지급·채권 확보·정산','https://law.go.kr/LSW/admRulLsInfoP.do?admRulId=34470&efYd=0')}</section>
    <section>${t(5)}<div class="case-study"><h4>가상 입찰 · 입찰금액 2억원</h4><p>납부 면제·특례가 없고 일반 최저비율 5%를 적용한다면 ${money(bidBond.bid)}×5%=<strong>${money(bidBond.bid*bidBond.rate)}(1,000만원)</strong>입니다. 낙찰 후 정당한 이유 없이 계약 체결을 거부하면 국고귀속 요건을 확인합니다.</p></div><p>입찰보증은 ‘낙찰되면 계약’, 계약보증은 ‘계약대로 이행’, 하자보수보증은 ‘책임 있는 하자 보수’입니다. 입찰보증금 납부가 면제되어도 귀속 사유가 생기면 지급확약한 금액의 납부의무가 발생할 수 있습니다. 고시 적용기간의 2.5% 등 별도 기준은 일반 5%와 구별합니다.</p>${refs('국가계약법 제9조 · 입찰보증금','https://www.law.go.kr/법령/국가를당사자로하는계약에관한법률/제9조')}${refs('국가계약법 시행령 제37·38조 · 납부와 국고귀속','https://www.law.go.kr/법령/국가를당사자로하는계약에관한법률시행령/제37조')}</section>
    <section class="self-check"><h3>13~18번 스스로 설명하기</h3>${check('해지되면 정상적으로 수행한 부분도 모두 무효인가?','아닙니다. 해지는 장래효 소멸을 기본으로 하며 종료까지의 수행분은 관련 계약조건에 따라 정산합니다.')}${check('발주기관 사업취소만으로 업체를 제재할 수 있는가?','업체 책임 없는 종료 사실만으로는 안 됩니다. 부정당업자 제재에는 별도의 법정 사유와 절차가 필요합니다.')}${check('6천만원이 10%, 4천만원이 5% 오르면 단순 변동률은?','가정한 두 항목의 변동액 합계는 800만원이고, 1억원 대비 8%입니다. 단순 평균 7.5%와 구별합니다.')}${check('위 선금 예제에서 이번 지급액과 잔여 선금은 같은가?','다릅니다. 이번 실지급액은 2,800만원, 남은 미정산 선금은 1,800만원입니다.')}${check('입찰보증금은 계약금액의 10%인가?','국가계약 일반기준은 입찰금액의 5% 이상입니다. 기준금액·비율·면제·특례를 각각 확인합니다.')}</section>
  </section>`;
}
