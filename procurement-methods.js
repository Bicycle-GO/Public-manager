const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const methodSources = {
  oecd: {title:'OECD · 공공조달 권고의 12개 실행원칙',url:'https://legalinstruments.oecd.org/public/doc/320/body-text.en.html'},
  law: {title:'국가계약법 제7조 · 계약의 방법',url:'https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1033530643'},
  limited: {title:'국가계약법 시행령 제21조 · 제한경쟁',url:'https://www.law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1031494231'},
  nominated: {title:'법제처 생활법령 · 지명경쟁과 제24조 인원 요건',url:'https://www.easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=2&cciNo=1&cnpClsNo=3&csmSeq=519'},
  stages: {title:'국가계약법 시행령 제18조 · 2단계 경쟁등의 입찰',url:'https://law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1020961811'},
  qualification: {title:'국가계약법 시행령 제42조 · 계약이행능력 심사',url:'https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1033531595'},
  negotiation: {title:'(계약예규) 협상에 의한 계약체결기준 · 제7·8조',url:'https://www.law.go.kr/행정규칙/(계약예규)협상에의한계약체결기준'},
  direct: {title:'국가계약법 시행령 제26조 · 수의계약 사유',url:'https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0026&lsiSeq=285893&urlMode=lsScJoRltInfoR'},
  quotation: {title:'국가계약법 시행령 제30조 · 견적에 의한 가격결정',url:'https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0030&lsiSeq=285893&urlMode=lsScJoRltInfoR'},
  split: {title:'국가계약법 시행령 제68조 · 공사의 분할계약금지와 예외',url:'https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0068&lsiSeq=285893&urlMode=lsScJoRltInfoR'},
  conflict: {title:'이해충돌방지법 제7조 · 신고 등에 대한 조치',url:'https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1030971587'}
};

export const oecdPrinciples = [
  ['투명성','Transparency','조달정보와 절차를 적절히 공개한다.'],
  ['청렴성','Integrity','부패·사기·이해충돌을 예방한다.'],
  ['접근성','Access','중소기업·신규 기업의 불필요한 진입장벽을 줄인다.'],
  ['균형성','Balance','조달 본래 목적과 환경·사회 등 정책목표의 균형을 살핀다.'],
  ['참여','Participation','이해관계자의 의견을 듣고 소통한다.'],
  ['효율성','Efficiency','절차의 시간·비용과 자원 낭비를 줄인다.'],
  ['전자조달','E-procurement','디지털 기술로 조달 절차를 개선한다.'],
  ['역량개발','Capacity','담당자의 지식과 전문성을 키운다.'],
  ['평가','Evaluation','조달 성과를 측정하고 개선에 활용한다.'],
  ['위험관리','Risk management','위험을 파악하고 대응한다.'],
  ['책임성','Accountability','결정과 결과에 대한 설명·감독 체계를 갖춘다.'],
  ['통합성','Integration','조달계획을 예산·재정·공공서비스와 연결한다.']
];

// These same summaries also feed the materials search.
export const procurementMethodTopics = [
  ['VFM과 총소유비용(TCO)', 'TCO는 구매·설치·운영·유지보수·폐기까지 해당 자산에 드는 총비용입니다. 경쟁자의 판매가격은 비교자료일 뿐 해당 자산의 TCO 항목이 아닙니다. VFM은 TCO뿐 아니라 품질·성능·서비스·위험까지 고려한 가치 판단입니다. 낮은 TCO만으로 VFM이 자동으로 확보되지는 않습니다.'],
  ['OECD 공공조달 실행원칙 12가지', '투명성·청렴성·접근성·균형성·참여·효율성·전자조달·역량개발·평가·위험관리·책임성·통합성으로 정리합니다. 중소기업 진입은 접근성, 예산계획 연계는 통합성, 환경목표와 조달목표의 조화는 균형성, 부패·이해충돌 예방은 청렴성과 연결합니다. 5대 기본원칙과 별개의 분류입니다.'],
  ['국가계약의 원칙과 예외', '국가계약법 제7조의 원칙은 일반경쟁이며, 법정 요건에 따라 제한경쟁·지명경쟁·수의계약이 가능합니다. 제한·지명경쟁도 경쟁 방식입니다. 일반·제한·지명은 참여 범위, 2단계 입찰은 입찰 절차, 적격심사·협상은 낙찰자 결정 관점으로 구별합니다.'],
  ['제한경쟁·지명경쟁의 조건', '제한경쟁은 기술·실적·지역 등 허용된 요건으로 참가자격을 제한하며 담당자의 선호는 근거가 아닙니다. 지명경쟁은 적격업체를 지명하여 경쟁시킵니다. 국가계약법 시행령 제24조는 원칙적으로 5인 이상 지명·2인 이상 참가신청을 정하고, 지명대상자가 5인 미만이면 모두 지명하도록 합니다.'],
  ['적격심사·2단계 경쟁입찰·협상에 의한 계약', '적격심사는 가격뿐 아니라 계약이행능력 등을 심사합니다. 2단계 경쟁입찰은 규격·기술입찰 후 적격자에게 가격입찰 자격을 줍니다. 협상계약은 협상적격자 중 기술·가격 합산점수 순으로 협상합니다. 2단계 입찰의 기술 적격 판단과 협상계약의 종합점수 순위를 혼동하지 마세요.'],
  ['수의계약·RFQ·분할계약', '수의계약은 경쟁입찰 외의 방식이며 법적 사유·가격 적정성·필요한 견적 및 승인 절차를 확인합니다. 긴급하다는 말만으로 허용되지 않습니다. RFQ는 견적요청을 뜻하며 정식 입찰과 같지는 않지만 전자견적·공개 절차가 필요할 수 있습니다. 소액 수의계약 요건을 맞추려는 인위적 분할은 정당한 분리발주와 구별합니다.'],
  ['단독공급원(Sole Source)과 단일공급원(Single Source)', 'Sole Source는 필요한 대상을 공급할 수 있는 곳이 하나뿐인 경우, Single Source는 여러 공급자 중 정당한 사정으로 한 곳을 선택하는 경우입니다. 특허 보유만으로 단독공급이 성립하지 않으며 대체품·대체 공급 가능성을 확인합니다. 이 용어 자체가 국내 수의계약 허용 근거를 대신하지는 않습니다.'],
  ['전자역경매(ERA)·정부구매카드', '전자역경매는 공급자가 전자적으로 가격 등을 개선하며 경쟁하는 방식입니다. 표준화되어 비교하기 쉬운 물품에 활용하기 좋고, 가격 경쟁이 과도하면 품질 저하 위험이 있습니다. 정부구매카드는 소액·반복 구매의 결제와 행정 처리를 간소화하는 수단이며 계약절차·증빙 의무를 없애지는 않습니다.'],
  ['청렴성과 이해충돌 처리', '직무관련 사적 이해관계가 있으면 적용 법령에 따라 신고·회피 절차를 밟습니다. 기관장은 직무 중지·재배정 등 필요한 조치를 하며, 법정 예외로 계속 수행하게 하는 경우에는 공정성 확인·점검이 필요합니다. 모든 이해충돌 상황에서 무조건 영구 배제된다는 설명은 피합니다.']
];

function table(title, headers, rows) {
  return `<div class="lesson-table-wrap" tabindex="0" role="region" aria-label="${esc(title)}"><table class="lesson-table"><caption>${esc(title)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,i)=>i?`<td>${esc(cell)}</td>`:`<th scope="row">${esc(cell)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
const reference = keys => `<p class="guide-reference">${keys.map(key=>`<a href="${esc(methodSources[key].url)}" target="_blank" rel="noopener noreferrer">${esc(methodSources[key].title)} ↗</a>`).join('<br>')}</p>`;

export function renderProcurementMethods(lesson) {
  if (lesson.id !== '1-02') return '';
  const topic = index => `<h3>${esc(procurementMethodTopics[index][0])}</h3><p>${esc(procurementMethodTopics[index][1])}</p>`;
  return `<div class="lesson-guide procurement-methods" aria-label="CHAPTER 02 계약방법 핵심정리">
    <section class="learning-goal"><span class="case-label">첨부 학습자료 반영 · 2026. 9. 24.</span><h2>원칙에서 계약방법까지 연결하기</h2><p>5대 기본원칙에 이어 TCO·OECD 실행원칙·입찰·낙찰자 결정·수의계약을 정리합니다. 아래 법령 설명은 국가계약 기준이며 지방자치단체와 공공기관은 해당 적용 규정을 확인합니다.</p></section>
    <section>${topic(0)}${table('VFM과 TCO 비교',['구분','핵심 질문','복사기 구매 예시'],[['TCO','사서 쓰고 폐기할 때까지 얼마가 드는가?','구입비 + 설치비 + 전기·소모품비 + 유지보수비 + 폐기비'],['VFM','필요한 성과에 비해 가장 가치 있는 선택인가?','총비용과 함께 인쇄품질·속도·고장 위험·서비스를 비교']])}<p>100만원 복사기보다 130만원 복사기의 유지비가 낮아도, 같은 사용기간·인쇄량에서 총비용과 필요한 품질을 함께 비교해야 합니다.</p></section>
    <section>${topic(1)}${table('OECD 12개 실행원칙',['원칙','영문','실무에서 하는 일'],oecdPrinciples)}${reference(['oecd'])}</section>
    <section>${topic(2)}${table('계약방법의 분류 기준',['분류 질문','방법','핵심 구별'],[['누가 경쟁에 참여하는가?','일반·제한·지명경쟁','제한·지명도 경쟁을 실시한다.'],['어떤 순서로 입찰하는가?','2단계 경쟁입찰','규격·기술 적격 판단 → 가격입찰'],['누구와 계약하는가?','적격심사·협상에 의한 계약','이행능력 심사 / 종합평가 후 협상'],['경쟁입찰 외의 방식인가?','수의계약','법적 사유와 견적·가격 절차 확인']])}<p><strong>원칙 = 일반경쟁 / 법정 예외 = 제한·지명·수의.</strong> 일반경쟁도 담합이나 편향된 규격을 막는 관리가 필요하므로 공개했다는 이유만으로 공정성이 자동 보장되지는 않습니다.</p>${reference(['law'])}</section>
    <section>${topic(3)}<p>지명은 선정 과정의 설명이 특히 중요합니다. 지명대상자 수와 실제 참가신청 수를 구별하고, ‘항상 10인 이상 지명’으로 외우지 마세요.</p>${reference(['limited','nominated'])}</section>
    <section>${topic(4)}${table('낙찰자 결정과 입찰 절차 비교',['방법','판단 흐름','시험 함정'],[['적격심사','가격 순위에 따라 이행실적·기술·재무상태 등 해당 심사기준 확인','가격만으로 결정한다 → X'],['2단계 경쟁입찰','규격 또는 기술입찰 → 적격자 확정 → 가격입찰','가격입찰이 먼저다 → X'],['협상에 의한 계약','제안서 기술·가격 평가 → 협상적격자·순위 결정 → 협상','최고점이면 협상 없이 계약 확정 → X']])}<p>2단계 경쟁입찰은 적절한 규격을 미리 작성하기 어렵거나 계약 특성상 필요한 물품·용역 등에 검토합니다. 복잡한 사업이라는 이유만으로 자동 적용하지 않으며, 규격·가격을 동시에 제출받는 유형과도 구별합니다.</p>${reference(['qualification','stages','negotiation'])}</section>
    <section>${topic(5)}<ol class="case-steps"><li><strong>허용 사유 확인</strong><p>재난복구에 경쟁을 진행할 여유가 없는지 등 적용 사유와 실제 조건을 확인합니다.</p></li><li><strong>가격·상대자 확인</strong><p>견적, 시장가격, 수행능력 등으로 적정성을 검토합니다. 수의계약도 복수 견적이나 전자견적 절차가 필요할 수 있습니다.</p></li><li><strong>근거와 기록 보관</strong><p>사유·가격 검토·승인 과정과 계약 결과를 남깁니다. 문서의 명칭과 생략 가능한 서류는 적용 규정에 따라 다릅니다.</p></li></ol><p>설계가 확정된 하나의 공사를 소액 수의계약 기준에 맞추려고 쪼개는 사례는 분할계약금지와 연결합니다. 법령이 허용하는 효율적 분리시공 등까지 모두 금지된다는 뜻은 아닙니다.</p>${reference(['direct','quotation','split'])}</section>
    <section>${topic(6)}${table('Sole Source와 Single Source',['구분','공급시장','가상 사례'],[['Sole Source · 단독공급원','요구를 충족할 공급자가 하나','적절한 대체품도 없고 유일한 공급자만 제공하는 부품'],['Single Source · 단일공급원','공급자는 여러 곳이나 정당한 사정으로 한 곳 선택','경쟁에 부칠 시간 여유가 없는 재해복구에서 한 업체 선택']])}${reference(['direct'])}</section>
    <section>${topic(7)}<p>ERA는 최소 품질·납기·공급능력을 먼저 확보해야 합니다. 정부구매카드는 계약 상대자를 선정하는 방식과 구별되는 결제·행정 수단입니다. 사용 가능 범위와 승인·증빙은 기관 규정에 따릅니다.</p></section>
    <section>${topic(8)}${reference(['conflict'])}</section>
    <section class="common-mistake"><h3>일반경쟁 흐름과 시험 직전 암기</h3><p>입찰공고 → 참가등록·자격 확인 → 입찰서 제출 → 개찰 → 심사·낙찰자 결정 → 계약 체결. 학습용으로 단순화한 흐름이며 실제 등록·심사 시점은 공고와 방식에 따라 달라질 수 있습니다.</p><p><strong>TCO = 구매부터 폐기까지 / 2단계 = 규격·기술 먼저 / 협상 = 기술+가격 평가 후 협상 / 수의 = 사유·가격·기록.</strong></p><a class="button" href="#practice/1/1-02">예상문제 23개·OX 20개로 확인하기 →</a></section>
  </div>`;
}
