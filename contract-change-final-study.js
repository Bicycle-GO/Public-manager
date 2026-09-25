const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const contractChangeFinalTopics = [
  ['지체상금 상한 30%와 계약보증금','국가계약 지체상금은 계산 대상 금액×적용 요율×책임 있는 지체일수로 계산합니다. 시행령 제74조의 상한은 계산 대상 계약금액의 30%입니다. 계약보증금 상당액에 도달한 때의 계약 유지·해제 판단과 다릅니다.'],
  ['물품 지체상금률과 예외','일반 물품 제조·구매는 하루 0.75/1,000=0.075%입니다. 계약 후 설계와 제조가 일괄되고 발주기관의 설계승인이 필요한 물품은 0.5/1,000, 군용 음식료품은 1.5/1,000 등 별도 요율을 확인합니다.'],
  ['하자보수보증금의 반환','기간 만료 등으로 보증목적이 달성되면 계약상대자의 요청에 따라 즉시 반환합니다. 기간이 다른 공종은 목적을 달성한 부분의 반환을 구분합니다. 보증금 납부는 하자보수의무 면제가 아닙니다.'],
  ['계약보증금 면제와 5천만원 기준','시행령 제50조 제6항의 소액 면제 기준은 추정가격이 아닌 계약금액 5천만원 이하입니다. 국가기관 등 법정 상대방과 특정 외자시설 부분품 구입 등 요건을 확인하며 대기업이라는 이유만으로 면제하지 않습니다.'],
  ['대형공공성 건축물의 하자책임기간','국가계약 시행규칙 별표 1의 대형공공성 건축물 기둥·내력벽은 10년, 그 외 주요구조부 등은 해당 5년 기준을 구분합니다. 모든 건축물의 보·기둥·내력벽을 일률적으로 10년으로 묶지 않습니다.'],
  ['검사 소요 기간과 지체일수 제외','기한 내 물품과 검사서류를 제출해 시정조치 없이 합격한 정상 검사 기간은 지체일수에서 제외합니다. 기한 후 납품·불합격 보완 기간까지 모두 제외하는 것은 아닙니다. 자체 자금난도 자동 면책 사유가 아닙니다.'],
  ['보증금 귀속의 납부형태별 처리','법정 귀속 사유·금액을 확인한 뒤 현금·보증서·납부면제 여부에 맞춰 관계기관 통지와 징수·보증채무 이행청구 등을 처리합니다. 모든 사안을 보험금 청구로 끝내는 동일한 절차로 외우지 않습니다.']
];

export const changeFinalExamples = {
  delay:{contract:1000000000,accepted:0,rate:.00075,days:20,capRate:.3},
  partial:{contract:1000000000,accepted:400000000,capRate:.3},
  goods:{contract:200000000,rate:.00075,days:10},
  warranty:{contract:500000000,agreedRate:.03},
  exemption:{contract:48000000,limit:50000000}
};

const money=n=>n.toLocaleString('ko-KR')+'원';
const table=(title,headers,rows)=>`<div class="lesson-table-wrap" tabindex="0" role="region" aria-label="${esc(title)}"><table class="lesson-table"><caption>${esc(title)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((s,i)=>i?`<td>${esc(s)}</td>`:`<th scope="row">${esc(s)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const check=(q,a)=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`;
const ref=(title,url)=>`<p class="guide-reference"><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)} ↗</a></p>`;

export function renderContractChangeFinal(lesson){
  if(lesson.id!=='3-02')return '';
  const t=i=>`<h3>${esc(contractChangeFinalTopics[i][0])}</h3><p>${esc(contractChangeFinalTopics[i][1])}</p>`;
  const {delay,partial,goods,warranty,exemption}=changeFinalExamples;
  const basis=delay.contract-delay.accepted;
  const assessed=Math.min(basis*delay.rate*delay.days,basis*delay.capRate);
  return `<section class="contract-change-final" aria-label="계약변경·종결 19~25번 보충 학습">
    <div class="learning-goal"><span class="case-label">후속 대화 19~25번 · 2026. 9. 26.</span><h2>지체상금과 보증금, 숫자보다 적용 조건부터</h2><p>19·20·24번은 지연 책임과 계산, 21~23번은 보증·하자책임, 25번은 귀속 처리로 연결합니다. 원문의 복수정답·과도한 일반화는 수정 이유를 해설에 표시했습니다. 아래 기관·상황·금액은 모두 학습용 가정입니다.</p></div>
    <section>${t(0)}<div class="case-study"><h4>가상 국가기관 · 물품 10억원, 책임 있는 지체 20일</h4><p>일반 물품 요율을 적용하고 기납 공제는 없습니다. ${money(basis)}×0.00075×${delay.days}일=<strong>${money(assessed)}(1,500만원)</strong>입니다. 상한은 ${money(basis)}×30%=<strong>${money(basis*delay.capRate)}(3억원)</strong>입니다.</p><p>별도 사례에서 성질상 분할 가능한 완성부분 4억원을 검사·인수하여 법정 공제가 적용된다면 계산 대상은 10억원−4억원=6억원, 그 금액의 30% 상한은 <strong>${money((partial.contract-partial.accepted)*partial.capRate)}(1억8천만원)</strong>입니다.</p></div><p class="common-mistake">상한과 실제 청구액은 다릅니다. 실제 청구액은 요율·지체일수로 산정하며 상한은 그 계산액이 넘지 못하는 한도입니다. 계약보증금 상당액에 도달했을 때 계약을 유지할지 종료할지 판단하는 규정은 별도로 확인합니다.</p>${ref('국가계약법 시행령 제74·75조 · 지체상금과 계약 종료','https://www.law.go.kr/법령/국가를당사자로하는계약에관한법률시행령/제74조')}</section>
    <section>${t(1)}${table('계약 종류와 1일 지체상금률',['구분','천분율','백분율'],[['공사','0.5/1,000','0.05%'],['일반 물품 제조·구매','0.75/1,000','0.075%'],['물품 수리·가공·대여, 일반 용역 등','1.25/1,000','0.125%'],['군용 음식료품 제조·구매','1.5/1,000','0.15%'],['운송·보관·양곡가공','2.5/1,000','0.25%']])}<p>특정 설계·제조 일괄 물품의 0.5/1,000 예외, 소프트웨어사업에서 물품·용역을 일괄 입찰하는 경우 등은 제75조 각 호의 적용 범위를 확인합니다. 일반 물품 2억원이 10일 지체된 가정에서는 ${money(goods.contract)}×0.00075×${goods.days}=<strong>${money(goods.contract*goods.rate*goods.days)}(150만원)</strong>입니다.</p>${ref('국가계약법 시행규칙 제75조 · 종류별 요율과 예외','https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lspttninfSeq=68698')}</section>
    <section>${t(2)}${table('하자보수보증금 관리의 세 질문',['구분','확인할 내용'],[['얼마를 확보할까?','국가 공사는 시행규칙 제72조 공종별 2~5% 기준. 물품·용역은 해당 계약의 별도 기준 확인'],['언제 반환할까?','보증목적 달성 여부와 계약상대자의 요청 확인'],['기간만 지나면 끝일까?','미보수 하자와 보증목적 달성 여부를 확인하고 반환 판단']])}<p>가상 공사 5억원에 적법하게 정한 해당 공종의 비율이 3%라고 가정하면 ${money(warranty.contract)}×3%=<strong>${money(warranty.contract*warranty.agreedRate)}(1,500만원)</strong>입니다. 이 비율을 모든 계약에 그대로 쓰지 않습니다.</p>${ref('국가계약법 시행규칙 제63조 · 보증금 반환','https://www.law.go.kr/법령/국가를당사자로하는계약에관한법률시행규칙/제63조')}${ref('국가계약법 시행규칙 제72조 · 공종별 하자보수보증금률','https://www.law.go.kr/법령/국가를당사자로하는계약에관한법률시행규칙/제72조')}</section>
    <section>${t(3)}<p>가상 계약금액 ${money(exemption.contract)}은 ${money(exemption.limit)} 이하이므로 소액 면제 사유를 검토할 수 있습니다. 반면 계약금액 1억원에 다른 면제 사유가 없다면 업체가 대기업이라는 사실만으로 면제할 수 없습니다.</p><p class="common-mistake">“면제할 수 있다”는 항상 면제한다는 뜻이 아닙니다. 비축물자라는 사실만으로 제50조의 면제 사유가 되는 것도 아닙니다. 납부면제 뒤 귀속 사유가 발생했을 때 지급확약에 따른 납부 책임 역시 별도로 남을 수 있습니다.</p>${ref('국가계약법 시행령 제50조 제6항 · 납부면제 사유','https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0050&lsiSeq=285893&urlMode=lsScJoRltInfoR')}</section>
    <section>${t(4)}${table('국가계약 시행규칙 별표 1의 건축공사 비교',['건축물·구조 부위','기준 기간'],[['대형공공성 건축물의 기둥·내력벽','10년'],['대형공공성 건축물의 기둥·내력벽 외 주요구조부','5년'],['대형공공성 건축물 외 건축물의 주요구조부','5년']])}<p>대형공공성 건축물의 범위에는 공동주택·종합병원·관광숙박시설·관람집회시설·대규모소매점과 16층 이상 기타 용도의 건축물 등이 별표에 규정되어 있습니다. 원문처럼 보·기둥·내력벽을 모두 같은 10년으로 묶지 말고 적용 법령, 건축물 구분, 세부 부위를 순서대로 확인합니다.</p>${ref('국가계약법 시행규칙 제70조·별표 1 · 하자담보책임기간','https://www.law.go.kr/법령별표서식/(국가를당사자로하는계약에관한법률시행규칙,20260102,별표1)')}</section>
    <section>${t(5)}${table('검사기간을 판단하는 두 상황',['상황','지체일수 판단'],[['기한 내 물품·서류 제출, 시정조치 없이 정상 합격','정상적인 검사 소요 기간은 제외'],['기한 후 물품·서류 제출 또는 시정조치 발생','납품기한 다음날·시정조치 시점·최종 합격일 등 일반조건의 구체적 산입 규정 적용']])}<p>불가항력도 실제 이행에 영향을 미쳤고 계약당사자의 책임 밖에 있다는 점을 확인합니다. 단순히 비가 왔다는 이유나 업체의 자체 자금난만으로 면책되는 것은 아닙니다. 지연 원인·통지 기록·납품 및 검사 일자를 함께 관리하면 계산 근거를 설명할 수 있습니다.</p>${ref('물품구매(제조)계약일반조건 제24·24조의2 · 검사와 불가항력','https://www.law.go.kr/LSW/admRulLsInfoP.do?admRulSeq=2100000284264')}</section>
    <section>${t(6)}${table('법정 귀속 사유가 확인된 뒤의 처리 구분',['확보 형태','후속 처리의 핵심'],[['현금','관계 출납·수입징수 담당자에게 통지하고 수입금 징수 처리'],['보증서·보증보험증권','관계 보증기관 등에 통지하고 해당 보증채무 이행청구 등 처리'],['유가증권','유가증권의 종류에 맞는 법정 처리'],['납부면제·지급확약','확약 문서 등을 갖추어 관계 수입징수 담당자에게 통지하고 법정 징수']])}<p>사유 확인 → 형태별 처리라는 순서로 이해합니다. 원문의 ‘의견 진술 → 귀속 결정 → 보험금 청구’를 모든 사안의 고정 법정 절차로 단정하지 않습니다. 의견 확인이 필요한 상황이나 별도의 부정당업자 제재 절차를 생략하라는 뜻도 아닙니다.</p>${ref('국가계약법 시행령 제38조 · 보증서·납부면제 귀속','https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1033531339')}${ref('국가계약법 시행규칙 제64조 · 납부형태별 처리','https://www.law.go.kr/법령/국가를당사자로하는계약에관한법률시행규칙/제64조')}</section>
    <section class="self-check"><h3>19~25번 스스로 설명하기</h3>${check('지체상금의 상한은 계약보증금 상당액인가?','아닙니다. 시행령 제74조의 계산 대상 계약금액의 30%입니다. 보증금 상당액 도달은 계약 유지·종료 판단과 구별합니다.')}${check('일반 물품 2억원이 10일 지체되면?','기납 공제와 예외가 없으면 2억원×0.00075×10일=150만원입니다.')}${check('계약보증금 소액 면제의 5천만원은 추정가격인가?','계약금액입니다. 면제 가능 사유와 실제 면제 처리를 구별합니다.')}${check('건축물의 주요구조부는 언제나 10년인가?','아닙니다. 해당 국가계약 별표에서 대형공공성 건축물의 기둥·내력벽은 10년, 그 외 주요구조부 등은 5년 기준을 구분합니다.')}${check('검사에 쓴 시간은 모두 지체일수에서 빼는가?','아닙니다. 기한 내 납품·서류 제출과 정상 합격인지, 지연 제출·시정조치가 있는지를 확인합니다.')}${check('현금 보증금도 보험회사에 청구해야 하는가?','아닙니다. 현금·보증서·유가증권·납부면제별 처리 방법을 따릅니다.')}</section>
  </section>`;
}
