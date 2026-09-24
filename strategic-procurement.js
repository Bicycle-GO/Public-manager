const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const strategicSources = {
  sme: {title:'판로지원법 · 중소기업자간 경쟁과 공공구매',url:'https://www.law.go.kr/법령/중소기업제품구매촉진및판로지원에관한법률'},
  women: {title:'여성기업지원법 시행령 제7조 · 물품·용역 5%, 공사 3%',url:'https://www.law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1017253371'},
  disability: {title:'장애인기업활동 촉진법 시행령 · 제7조의2 구매목표비율',url:'https://www.law.go.kr/lsInfoP.do?lsiSeq=279877&viewCls=lsRvsDocInfoR'},
  severe: {title:'중증장애인생산품 우선구매 특별법 제7조 · 구매 범위',url:'https://www.law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1032693999'},
  severeRate: {title:'중증장애인생산품 우선구매 비율 고시 · 1.1%',url:'https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000284622&chrClsCd=010201'},
  social: {title:'사회적기업 육성법 제12조 · 공공기관 우선구매',url:'https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1031406705'},
  direct: {title:'판로지원법 제9조 · 직접생산의 확인',url:'https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1033819889'},
  materials: {title:'판로지원법 제12조 · 공사용 자재의 직접구매',url:'https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1021239377'},
  designation: {title:'판로지원법 시행령 제6조 · 정기 지정 유효기간 3년',url:'https://www.law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1033077033'},
  technology: {title:'판로지원법 시행령 제12조 · 기술개발제품 15%',url:'https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsId=011101&lsJoLnkSeq=1000715867&print=print'},
  technologyGuide: {title:'공공구매종합정보망 · 기술개발제품 우선구매제도',url:'https://www.smpp.go.kr/cst/smppInf/SelectMpeD.do'},
  excellent: {title:'조달사업법 제26조 · 우수조달물품과 대상 기업',url:'https://law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1024136289'},
  innovation: {title:'조달사업법 제27조 · 혁신제품 구매와 면책',url:'https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1033470255'},
  green: {title:'녹색제품 구매촉진에 관한 법률 · 인정 범위와 구매',url:'https://www.law.go.kr/법령/녹색제품구매촉진에관한법률'},
  greenGuide: {title:'기후에너지환경부 · 2026년도 녹색제품 구매지침',url:'https://mcee.go.kr/home/web/policy_data/read.do?condition.deleteYn=N&maxIndexPages=10&maxPageItems=10&menuId=10237&pagerOffset=0&seq=8634'},
  strategy: {title:'OECD 공공조달 권고 · 조달 목적과 정책 목표의 균형',url:'https://legalinstruments.oecd.org/public/doc/320/body-text.en.html'}
};

export const strategicTopics = [
  ['전략적 공공조달과 ESG', '전략적 공공조달은 정부의 구매력을 활용하여 필요한 품질과 경제성을 확보하면서 중소기업 성장, 사회적 포용, 환경 보호, 기술혁신을 함께 추구합니다. ESG의 E는 Environment, S는 Social, G는 Governance입니다. 녹색구매는 E, 사회적 포용은 S, 투명한 의사결정·청렴·책임성은 G와 연결해 이해하되 혁신 전체를 G로 단정하지 않습니다.'],
  ['중소기업자간 경쟁·직접생산·지정기간', '판로지원법에 따라 지정된 경쟁제품은 적용 요건을 갖춘 중소기업자 사이의 경쟁을 통해 판로를 지원합니다. 직접생산 여부는 해당 품목의 시설·인력·공정 등 기준으로 확인하며 단순히 다른 회사의 완제품을 사서 이름표만 바꾸는 것과 다릅니다. 정기 경쟁제품 지정의 유효기간은 효력 발생일부터 3년입니다. 중간 추가 지정은 정기 지정 기간의 종료일까지이므로 언제나 새로 3년이 되는 것은 아닙니다.'],
  ['여성기업·장애인기업·중증장애인생산품 구매비율', '여성기업 제품 구매목표는 물품·용역 각각의 구매총액 대비 5% 이상, 공사 구매총액 대비 3% 이상입니다. 장애인기업 제품은 해당 연도 제품 구매총액의 1% 이상입니다. 중증장애인생산품은 공사를 제외한 제품·노무용역 등 서비스 구매총액의 1.1% 이상으로 구별합니다. 비율, 분모, 대상 자격과 법정 예외를 함께 확인합니다.'],
  ['사회적기업 우선구매와 공사용자재 직접구매', '사회적기업 육성법은 사회적기업이 생산하는 재화·서비스의 공공기관 우선구매를 규정합니다. 공사용자재 직접구매는 대상 공사에서 지정 자재를 발주기관이 직접 구매하여 시공자에게 공급하는 방식입니다. 모든 공사·모든 자재가 자동 대상인 것은 아니며 규모·품목·예외를 확인합니다. 우선구매라는 말만으로 수의계약이 자동 허용되지는 않습니다.'],
  ['녹색제품·환경표지·GR·저탄소제품', '녹색제품은 법정 인정 범위와 인증 요건으로 판단합니다. 환경표지 인증제품, 우수재활용(GR)제품, 관련 요건을 충족한 저탄소제품 등을 구별해 기억합니다. 환경성적표지를 받은 모든 제품이 곧 저탄소제품은 아닙니다. 신제품인증(NEP)만으로 녹색제품이 되는 것은 아니지만, 같은 제품이 별도의 녹색 인증도 갖출 수 있습니다. 현행 담당 부처 명칭은 기후에너지환경부입니다.'],
  ['생애주기비용(LCC)과 비용대비가치(VFM)', 'LCC는 취득·설치, 운용, 유지보수, 폐기 등 전 생애의 관련 비용을 비교하는 관점입니다. 경쟁업체의 판매가격은 대안을 비교할 자료이지 구입한 자산에 별도로 더하는 비용 항목은 아닙니다. 같은 성능·사용기간 등 비교 조건을 맞추고 필요한 경우 교체비·잔존가치·할인율을 반영합니다. VFM은 비용뿐 아니라 품질·성과·위험까지 함께 고려합니다.'],
  ['기술개발제품 15%와 우수조달물품', '기술개발제품 구매목표비율 15% 이상의 분모는 중소기업 물품 구매액입니다. NEP 인증제품, 요건을 갖춘 NET 적용제품, 성능인증제품 등 해당 제도의 인정 범위를 확인합니다. 환경표지 하나만으로 기술개발제품 요건이 충족되지는 않습니다. 조달청장이 지정하는 우수조달물품의 대상은 중소기업 및 법령상 요건을 충족하는 중견기업의 제품이므로 중소기업만 가능하다고 외우지 않습니다.'],
  ['혁신제품 구매 지원과 조건부 면책', '조달사업법 제27조에 따른 혁신제품은 공공성·혁신성 등을 바탕으로 지정되며 시범구매·플랫폼 등으로 구매를 지원합니다. 구매 담당자는 고의나 중대한 과실이 입증되지 않으면 해당 구매로 생긴 손실에 대해 책임을 지지 않는다는 법정 보호를 받습니다. 모든 책임을 조건 없이 면제하거나 모든 R&D 제품을 자동 혁신제품으로 지정하는 제도는 아닙니다.'],
  ['정책 요건의 중복과 성과 관리', '여성기업이 만든 제품이 녹색제품과 기술개발제품 요건을 함께 갖추는 등 여러 자격이 공존할 수 있습니다. 이는 구매금액을 임의로 여러 번 더해 총실적을 부풀려도 된다는 뜻이 아닙니다. 제도별 증빙과 실적 산정 규칙을 확인하고 사용률, 운영비, 환경 성능과 공공서비스 개선 효과로 구매 성과를 설명합니다.']
];

export const strategicRates = [
  ['여성기업 물품·용역','각각 5% 이상','해당 연도 물품 / 용역 구매총액 각각','02·23'],
  ['여성기업 공사','3% 이상','해당 연도 공사 구매총액','02·23'],
  ['장애인기업 제품','1% 이상','해당 연도 제품 구매총액','04·23'],
  ['중증장애인생산품','1.1% 이상','공사를 제외한 제품·노무용역 등 서비스 구매총액','11·23'],
  ['기술개발제품','15% 이상','중소기업 물품 구매액','08']
];

export const strategicQuestionGroups = [
  ['중소기업·사회적 가치','01·02·04·06·11~14·17·23·24','대상·직접생산·구매비율·법적 근거'],
  ['녹색구매·생애주기비용','03·10·15·21','녹색 인증 / 전 생애 비용'],
  ['기술·혁신조달','07~09·18·19','기술개발제품 / 혁신제품 / 조건부 면책'],
  ['전략적 조달·ESG','05·16·20·22·25','경제·사회·환경 가치와 절차·성과']
];

export const strategicMemory = [
  ['여성기업: 물품·용역 각각 5%, 공사 3%','02'],
  ['장애인기업 1% / 중증장애인생산품 1.1%','04·11'],
  ['기술개발제품 15%의 분모는 중소기업 물품 구매액','08'],
  ['경쟁제품 정기 지정 3년 / 추가 지정은 남은 기간','17'],
  ['환경 인증과 기술 인증은 구별하고 중복 보유는 가능','03·07·20'],
  ['우수조달물품 = 중소기업 + 요건을 갖춘 중견기업','14'],
  ['혁신구매 면책 = 고의·중과실이 입증되지 않은 경우의 구매 손실','09·18·24'],
  ['LCC는 전 생애 비용 / 전략적 조달은 경제·사회·환경·혁신의 가치','10·16·21·25']
];

// Same service life and performance; simplified teaching example, amounts in KRW 10,000.
export const strategicLccExample = {
  years:5,unit:'만원',assumption:'성능·사용량·비교기간 5년 동일, 교체 없음. 할인율·물가변동·잔존가치는 생략한 가상 예시입니다.',
  alternatives:[
    {name:'A 장비',purchase:100,annualEnergy:40,annualMaintenance:10,disposal:5},
    {name:'B 장비',purchase:140,annualEnergy:20,annualMaintenance:8,disposal:5}
  ]
};
export const lccTotal = item => item.purchase + (item.annualEnergy + item.annualMaintenance) * strategicLccExample.years + item.disposal;

function table(title,headers,rows) {
  return `<div class="lesson-table-wrap" tabindex="0" role="region" aria-label="${esc(title)}"><table class="lesson-table"><caption>${esc(title)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,i)=>i?`<td>${esc(cell)}</td>`:`<th scope="row">${esc(cell)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
const references = keys => `<p class="guide-reference">${keys.map(key=>`<a href="${esc(strategicSources[key].url)}" target="_blank" rel="noopener noreferrer">${esc(strategicSources[key].title)} ↗</a>`).join('<br>')}</p>`;

export function renderStrategicProcurement(lesson) {
  if(lesson.id!=='1-04') return '';
  const topic=i=>`<h3>${esc(strategicTopics[i][0])}</h3><p>${esc(strategicTopics[i][1])}</p>`;
  const example=strategicLccExample;
  return `<div class="lesson-guide strategic-procurement" aria-label="CHAPTER 04 전략적 공공조달 핵심정리">
    <section class="learning-goal"><span class="case-label">제공자료 25문항 반영 · 법령 확인 2026. 9. 24.</span><h2>정부의 구매력으로 어떤 가치를 만드는가?</h2><p>중소기업·사회적 포용 → 녹색구매 → 기술·혁신 → 경제·사회·환경 성과를 연결하세요. 품질·경제성과 정책 목표를 함께 판단하는 단원입니다.</p>${table('25문항 학습 지도',['주제','제공자료 문항','핵심 질문'],strategicQuestionGroups)}<p class="small-text">법령의 시행 시점을 확인하여 정리했습니다. 시험에서 별도의 법령 기준일을 지정하면 그 기준일을 적용하세요.</p></section>
    <section>${topic(0)}${table('ESG 학습 연결',['구분','의미','조달에서 연결할 예'],[['E','Environment · 환경','환경 성능·에너지 사용·자원 순환'],['S','Social · 사회','포용·여성기업·장애인기업·사회적기업'],['G','Governance · 지배구조','투명성·청렴·의사결정 기록·책임성']])}<p>이 표는 이해를 위한 연결입니다. OECD가 모든 조달정책을 E·S·G에 하나씩 배정한 공식 분류표라는 뜻은 아닙니다. 혁신은 환경·사회 문제 해결과 업무 개선 등 여러 영역에 기여할 수 있습니다.</p>${references(['strategy'])}</section>
    <section>${topic(1)}${topic(2)}${table('구매비율은 분모와 함께 암기',['대상','기준 비율','어떤 금액을 기준으로 하나?','문항'],strategicRates)}<p>여성기업·장애인기업·기술개발제품의 목표비율은 관계 법령상 협의·예외 규정도 함께 확인합니다. 서로 분모가 달라 비율 숫자만으로 실제 구매금액이나 정책 우선순위를 비교할 수 없습니다. 사회적기업 우선구매에 이 표의 다른 제도 비율을 임의로 붙이지 마세요.</p><p><strong>가상 계산:</strong> 물품 구매총액이 100억 원이면 여성기업 물품 목표는 원칙적으로 5억 원 이상입니다. 그중 중소기업 물품 구매액이 60억 원이면 기술개발제품 목표는 60억 × 15% = 9억 원 이상입니다. 두 비율은 같은 100억 원을 분모로 쓰지 않습니다.</p>${references(['women','disability','severe','severeRate','technology','designation','direct'])}${topic(3)}${references(['social','materials'])}</section>
    <section>${topic(4)}${table('환경·기술 인증 구별',['범주','학습할 예','주의할 점'],[['녹색제품','환경표지·GR·요건을 갖춘 저탄소제품','NEP 인증만으로 녹색제품이 되지는 않음'],['기술개발제품','NEP·요건을 갖춘 NET 적용제품·성능인증제품 등','환경표지만으로 기술개발제품이 되지는 않음'],['복수 요건','여성기업 + 녹색 + 기술개발제품','각 요건과 실적 집계 기준을 별도로 확인']])}${references(['green','greenGuide','technologyGuide'])}${topic(5)}${table('같은 5년 동안의 LCC 비교 · 단위 만원',['대안','취득비','연간 에너지비','연간 유지보수비','폐기비','5년 총비용'],example.alternatives.map(item=>[item.name,item.purchase,item.annualEnergy,item.annualMaintenance,item.disposal,lccTotal(item)]))}<p>${esc(example.assumption)}</p><p><strong>A = 100 + (40 + 10) × 5 + 5 = 355만원<br>B = 140 + (20 + 8) × 5 + 5 = 285만원</strong></p><p>B는 취득비가 40만원 높아도 이 가정에서는 전 생애 비용이 70만원 낮습니다. 수명만 알려진 제품은 에너지비·수리비·교체비 등이 없으면 같은 결론을 계산할 수 없습니다.</p><a href="#theory/2/2-01">조달 계획에서 비용과 수요 연결하기 →</a></section>
    <section>${topic(6)}${topic(7)}${table('기술·혁신 제도 구별',['구분','판단할 내용','근거'],[['기술개발제품 우선구매','대상 인증·제품 요건과 중소기업 물품 구매액 대비 15%','판로지원법 및 시행령'],['우수조달물품 지정','중소기업 및 요건을 갖춘 중견기업 제품 · 조달청장 지정','조달사업법 제26조'],['혁신제품 구매 지원','공공성·혁신성·지정·구매 손실에 대한 조건부 면책','조달사업법 제27조']])}${references(['technology','technologyGuide','excellent','innovation'])}<p><strong>면책의 핵심:</strong> 고의·중대한 과실이 입증되지 않은 경우의 해당 구매 손실에 관한 책임입니다. 구매 실패라는 결과만으로 곧바로 책임을 묻는 것도, 혁신제품이라는 이름만으로 모든 행위를 면책하는 것도 적절하지 않습니다.</p></section>
    <section>${topic(8)}${table('정책과 법률 짝짓기',['정책','핵심 법적 근거'],[['중소기업자간 경쟁·직접생산·공사용자재 직접구매','중소기업제품 구매촉진 및 판로지원에 관한 법률'],['여성기업 / 장애인기업','여성기업지원법 / 장애인기업활동 촉진법'],['중증장애인생산품','중증장애인생산품 우선구매 특별법'],['사회적기업 우선구매','사회적기업 육성법'],['녹색제품 구매','녹색제품 구매촉진에 관한 법률'],['우수조달물품 / 혁신제품','조달사업법 제26조 / 제27조']])}${references(['sme','green','innovation'])}</section>
    <section class="case-study"><span class="case-label">가상 업무 사례</span><h3>공공기관의 고효율 영상분석 장비 구매</h3><ol class="case-steps"><li><strong>수요와 정책 대상 확인</strong><p>필요한 분석 정확도와 호환성을 정한 뒤 경쟁제품 지정, 공급기업 자격, 직접생산 및 환경·기술 인증을 확인합니다.</p></li><li><strong>가격·품질·전 생애 비용 비교</strong><p>같은 사용기간을 기준으로 전기료·유지보수·교체비를 비교하고, 적용 가능한 구매 절차와 평가기준으로 선정합니다.</p></li><li><strong>실적과 실제 성과 구별</strong><p>여성기업 제품이면서 녹색제품일 수 있지만 집계는 각 제도 기준에 따릅니다. 구매 후 사용률·운영비·환경 성능·업무 개선 효과도 기록합니다.</p></li></ol></section>
    <section class="common-mistake"><h3>원문과 달라진 점</h3><ul><li>11번: 과거 1% 대신 현행 중증장애인생산품 1.1%를 적용했습니다. 장애인기업 1%와 분모까지 구별합니다.</li><li>14번: 우수조달물품은 중소기업만이 아니라 요건을 갖춘 중견기업도 대상입니다.</li><li>15번: 과거 ‘환경부’ 표기를 현행 ‘기후에너지환경부’로 바꿨습니다.</li><li>17번: 경쟁제품 정기 지정은 2년이 아닌 3년입니다. 재구성 문항의 정답도 원문 ②에서 ③으로 바뀝니다.</li><li>23번: ‘여성기업 비율이 가장 높다’는 말은 제시된 네 보기 안에서만 성립합니다. 기술개발제품 15%까지 포함한 전체 제도의 순위가 아닙니다.</li></ul></section>
    <section><h3>시험 직전 8문장</h3>${table('핵심 암기와 문항 연결',['기억할 문장','관련 문항'],strategicMemory)}<p><strong>정책 목적 → 대상·인증·분모 확인 → 적법한 구매 → 성과 설명.</strong></p><a class="button" href="#practice/1/1-04">전략적 공공조달 예상문제 25개 풀기 →</a></section>
  </div>`;
}
