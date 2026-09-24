const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const electronicSources = {
  system: {title:'조달청 개요 · 나라장터와 Single Window',url:'https://pps.go.kr/kor/content.do?key=00125'},
  electronic: {title:'전자조달의 이용 및 촉진에 관한 법률',url:'https://www.law.go.kr/법령/전자조달의이용및촉진에관한법률'},
  bid: {title:'국가계약법 시행령 제39조 · 입찰서 제출과 예외',url:'https://www.law.go.kr/법령/국가를당사자로하는계약에관한법률시행령/제39조'},
  authentication: {title:'조달청 · 지문보안토큰 사용의무 폐지 안내(2024. 1. 1.)',url:'https://www.pps.go.kr/kor/bbs/view.do?bbsSn=2401100020&key=00641'},
  plan: {title:'조달청 업무계획 · 디지털 신기술과 나라장터',url:'https://www.pps.go.kr/kor/content.do?key=00647'},
  mas: {title:'조달청 · MAS 2단계경쟁제도 안내',url:'https://www.pps.go.kr/kor/content.do?key=00183'},
  masRules: {title:'물품 다수공급자계약 업무처리규정(2026년 개정)',url:'https://www.law.go.kr/LSW/admRulLsInfoP.do?admRulSeq=2100000280094'},
  masTerms: {title:'물품 다수공급자계약 특수조건(2026. 6. 1. 시행)',url:'https://www.law.go.kr/LSW/admRulInfoP.do?admRulSeq=2100000280096'},
  venture: {title:'조달청 · 벤처나라 개요',url:'https://www.pps.go.kr/kor/content.do?key=00711'},
  innovation: {title:'조달청 · 혁신제품 지정과 구매 지원',url:'https://www.pps.go.kr/kor/content.do?key=00648'},
  digital: {title:'디지털서비스 이용지원시스템 · 전문계약제도',url:'https://www.digitalmarket.kr/kor/introduction/ompIntro/professionalContract.jsp?section=law'},
  eum: {title:'조달청 · 서비스 공공조달 플랫폼 이음장터 개통',url:'https://www.pps.go.kr/kor/bbs/view.do?bbsSn=2204010004&key=00318'},
  catalog: {title:'물품목록법 시행령 제9조 · 물품목록번호 체계',url:'https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1031993399'},
  catalogRules: {title:'물품목록정보의 관리 및 이용에 관한 규정',url:'https://www.law.go.kr/LSW/admRulLsInfoP.do?admRulSeq=2100000270306'},
  catalogGuide: {title:'한국환경산업기술원 · 목록화와 UNSPSC 기반 식별번호 안내',url:'https://keiti.re.kr/html/keiti/sub2_2_1.jsp?tabNo=3'}
};

export const electronicTopics = [
  ['전자조달(E-Procurement)과 Single Window', '전자조달은 ICT로 공고·입찰·계약·대금지급 등 조달 전 과정을 전자적으로 처리하는 방식입니다. 나라장터는 공공조달 단일창구(Single Window)로 정보와 업무를 연계합니다. 한 번의 등록으로 반복 등록 부담을 줄여도 개별 입찰의 자격·서류·마감 확인은 필요합니다.'],
  ['전자조달의 효과와 보안', '방문·서류 처리 부담 감소는 효율성, 참여기회 확대는 접근성·경쟁성, 적절한 과정·결과 공개는 투명성입니다. 인증은 신원 확인, 암호화는 정보 보호, 전자서명은 서명자 확인과 변경 탐지 등에 쓰입니다. 지문보안토큰 사용의무는 2024년 1월 1일 폐지되었으므로 과거의 필수 인증 방식과 현재 안내를 구별합니다.'],
  ['종합쇼핑몰과 다수공급자계약(MAS)', 'MAS는 Multiple Award Schedule, 즉 다수공급자계약입니다. 조달청이 품질·성능 등이 같거나 비슷한 제품의 여러 공급자와 계약하고 수요기관이 선택합니다. 종합쇼핑몰에는 MAS 외의 계약상품도 있어 쇼핑몰과 MAS가 같은 개념은 아닙니다. 모든 공공구매를 쇼핑몰로만 해야 하는 것도 아닙니다.'],
  ['MAS 2단계 경쟁과 가격조정', 'MAS 계약 이후 구매 단계에서 기존 계약상대자들의 제안을 비교해 납품업체를 정하는 절차입니다. 적용 기준에 맞춰 가격·품질·납기·사후관리 등을 평가해 VFM을 높입니다. 적용 금액·대상·예외는 현행 규정과 품목별 조건을 확인합니다. 계약가격도 절대 고정이 아니라 계약조건에 따른 조정·할인이 가능합니다.'],
  ['특화 플랫폼: 벤처나라·혁신장터·디지털서비스몰·이음장터', '벤처나라는 창업·벤처기업의 공공판로, 혁신장터는 지정 혁신제품과 수요기관의 연결, 디지털서비스몰은 클라우드 등 디지털서비스 구매, 이음장터는 공공기관과 서비스 공급자의 견적·협상·거래 연결로 구별합니다. 원문의 “이용장터”는 공식 명칭인 “이음장터”로 보정합니다.'],
  ['혁신제품 구매 지원과 디지털 전환', '혁신제품은 법정 요건에 따른 수의계약·구매면책 등의 지원과 연결됩니다. 구매목표 실적 인정도 해당 기준에 따르며 모든 구매에 정부가 50%를 보조하는 제도로 외우지 않습니다. 조달청 시범구매사업은 별도 선정·예산 절차입니다. 지능화·데이터 활용·전자기록 중심 업무는 기록 보존 의무의 폐지를 뜻하지 않습니다.'],
  ['물품목록번호: 분류 8 + 식별 8 = 16자리', '물품분류번호 8자리는 종류, 물품식별번호 8자리는 제조자·모델·규격 등으로 구별되는 품목을 나타냅니다. 두 번호를 순서대로 붙인 물품목록번호는 16자리입니다. 세부품명번호는 분류번호 8자리에 2자리를 더한 10자리이므로 식별번호와 혼동하지 마세요.'],
  ['UNSPSC·목록화 요청·1품목 1번호', 'UNSPSC(United Nations Standard Products and Services Code)는 상품·서비스 분류체계이며 개별 제품 식별번호 자체가 아닙니다. 목록화는 이름·분류·속성정보를 표준화해 효율적으로 관리·활용하도록 합니다. 목록화 요청은 곧 계약 체결이나 납품 보장이 아닙니다. 같은 품목의 가격이 바뀐다고 새로운 품목이 되지는 않습니다.'],
  ['품명 신설과 품목 등록', '품명은 물품 종류를 분류하는 이름, 품목은 제조자·모델·규격 등으로 구체화한 제품입니다. 적합한 기존 품명이 없으면 품명 신설을 검토하고, 기존 분류에 속하는 새 모델은 품목 등록을 검토합니다. 같은 노트북이라도 주요 식별 속성이 다르면 서로 다른 품목이 될 수 있습니다.']
];

export const electronicQuestionGroups = [
  ['전자조달·나라장터','01~04 · 15~16 · 20 · 22','전 과정 전자화 / 단일창구 / 보안 / 투명성'],
  ['종합쇼핑몰·MAS','06 · 13 · 17 · 21','계약상품 선택 / 구매 단계의 추가 경쟁'],
  ['특화 조달 플랫폼','07~09 · 14 · 18~19','벤처 / 혁신 / 디지털 / 서비스 거래'],
  ['물품목록번호','05 · 10~12 · 23~25','분류와 식별 / UNSPSC / 품명과 품목']
];

export const electronicMemory = [
  ['전자조달 = 조달 전 과정의 ICT 활용','01'],
  ['나라장터 = Single Window 통합창구','02·16'],
  ['과정·결과의 적절한 공개 = 투명성','03·22'],
  ['물품목록번호 = 분류 8 + 식별 8 = 16자리','05'],
  ['종합쇼핑몰에서 MAS 등 계약상품 선택','06'],
  ['벤처나라 = 창업·벤처기업의 초기 판로','07·18'],
  ['혁신장터 = 혁신제품 / 디지털서비스몰 = 클라우드 등','08·09·19'],
  ['이음장터 = 공공기관과 서비스 공급자의 거래 연결','14'],
  ['MAS 2단계 경쟁 = 기존 계약 후 추가 가격·품질 경쟁','13·17·21'],
  ['UNSPSC = 분류 / 품명 = 종류 / 품목 = 구체적인 제품','10~12·23~25']
];

function table(title, headers, rows) {
  return `<div class="lesson-table-wrap" tabindex="0" role="region" aria-label="${esc(title)}"><table class="lesson-table"><caption>${esc(title)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,i)=>i?`<td>${esc(cell)}</td>`:`<th scope="row">${esc(cell)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
const references = keys => `<p class="guide-reference">${keys.map(key=>`<a href="${esc(electronicSources[key].url)}" target="_blank" rel="noopener noreferrer">${esc(electronicSources[key].title)} ↗</a>`).join('<br>')}</p>`;

export function renderElectronicProcurement(lesson) {
  if (lesson.id !== '1-03') return '';
  const topic = i => `<h3>${esc(electronicTopics[i][0])}</h3><p>${esc(electronicTopics[i][1])}</p>`;
  return `<div class="lesson-guide electronic-procurement" aria-label="CHAPTER 03 전자조달 핵심정리">
    <section class="learning-goal"><span class="case-label">제공자료 25문항 반영 · 2026. 9. 24.</span><h2>전자조달을 네 묶음으로 이해하기</h2><p>나라장터로 절차를 연결하고, 계약상품과 특화 플랫폼을 선택하며, 목록번호로 물품을 구별합니다. 문항 번호를 개념에 연결해 공부하세요.</p>${table('25문항 학습 지도',['주제','제공자료 문항','핵심 질문'],electronicQuestionGroups)}</section>
    <section>${topic(0)}<p><strong>공고 확인 → 입찰·개찰 → 계약 → 이행 확인 → 대금지급.</strong> 온라인 결제만 하거나 홈페이지에 공고만 올리는 것보다 넓은 개념입니다. 전자입찰은 적용 법령의 원칙과 예외를 함께 살피며, 실제 이용에서는 작성·저장·제출 완료를 구별합니다.</p>${topic(1)}${table('전자조달 효과 구별',['단서','직접 연결되는 개념'],[['시간·방문·서류 처리비 감소','효율성'],['여러 지역 업체의 참여기회','접근성·경쟁성'],['공고·개찰 결과 등 적절한 공개','투명성'],['판단 근거와 전자기록 보존','책임성']])}${references(['system','bid','authentication'])}</section>
    <section>${topic(2)}${topic(3)}${table('이름이 비슷한 두 가지 2단계',['구분','어느 시점인가?','비교하는 것'],[['MAS 2단계 경쟁','여러 공급자와 MAS 계약을 맺은 뒤 실제 구매 단계','기존 계약상대자의 제안가격·품질 등'],['규격·기술 / 가격의 2단계 경쟁입찰','계약상대자 선정을 위한 입찰 단계','규격·기술 적격 확인 후 가격입찰']])}<p>가상 교육청이 노트북을 대량 구매한다면 MAS 계약상품 중 희망 규격에 맞는 제품을 찾고, 적용 요건에 해당할 때 제안요청·공고와 평가를 진행합니다. 수량이 많다는 사실만으로 의무 여부가 정해지지는 않습니다.</p>${references(['mas','masRules','masTerms'])}<p><a href="#theory/3/3-05">PART 03 다수공급자계약(MAS) 관리로 연결 →</a></p></section>
    <section>${topic(4)}${table('플랫폼을 서로 바꾸지 않기',['플랫폼','주된 역할','가상 구매 상황'],[['종합쇼핑몰','MAS·제3자단가계약 등 계약상품 선택·구매','계약된 사무용 의자 비교'],['벤처나라','창업·벤처기업의 공공판로 지원','창업기업의 도로결빙센서'],['혁신장터','지정 혁신제품의 정보·수요·구매 연결','혁신제품으로 지정된 탐지장비 검토'],['디지털서비스몰','클라우드 등 디지털서비스 구매 지원','등록된 클라우드 기반 분석서비스'],['이음장터','공공기관·서비스 공급자의 견적·협상·거래','콘텐츠 제작 등 소액 서비스 견적 비교']])}<p>기업이 창업기업이거나 제품에 AI가 포함되어 있다는 사실만으로 모든 등록·구매 요건이 충족되는 것은 아닙니다. 각 장터의 대상, 지정·등록 여부와 계약 절차를 확인합니다.</p>${topic(5)}${references(['venture','innovation','digital','eum','plan'])}</section>
    <section>${topic(6)}${table('번호체계 비교',['번호','자리 수','무엇을 나타내나?'],[['물품분류번호','8자리','종류: 2자리씩 4단계 계층분류'],['물품식별번호','8자리','제조자·모델·규격 등으로 식별하는 품목'],['물품목록번호','16자리','물품분류번호 + 물품식별번호'],['세부품명번호','10자리','물품분류번호 8자리 + 세부 분류 2자리']])}${topic(7)}<p>제공자료의 ‘1품목 1번호·제조자 규격·속성 표준화·국제분류’는 학습용 체크포인트로 활용합니다. ‘법정 4대 원칙’이라는 고정 명칭으로 단정하지 않습니다. 최저가격은 품목을 식별하는 기준이 아닙니다.</p>${topic(8)}${table('품명과 품목의 차이',['상황','검토할 절차'],[['전기자전거 분류가 있고 새 제조사의 모델이 나왔다','기존 분류 아래 품목 등록'],['적합한 기존 분류가 없는 새로운 종류의 물품이다','품명 신설 검토'],['같은 모델의 판매가격만 바뀌었다','가격 변경만으로 새 식별번호를 부여하지 않음']])}${references(['catalog','catalogRules','catalogGuide'])}</section>
    <section class="case-study"><span class="case-label">가상 업무 사례</span><h3>B군의 농지조사용 드론 30대 구매</h3><ol class="case-steps"><li><strong>어떤 제품인가?</strong><p>목록체계에서 분류와 식별번호를 확인하고 필요한 해상도·위치정확도를 정합니다.</p></li><li><strong>어느 경로로 구매하는가?</strong><p>MAS 계약상품이라면 종합쇼핑몰에서 비교하고, 구매예산·품목별 요건에 따라 2단계 경쟁을 검토합니다. 혁신제품 지정 드론은 혁신장터, 등록된 클라우드 영상분석서비스는 디지털서비스몰과 연결합니다.</p></li><li><strong>무엇을 비교하고 기록하는가?</strong><p>공개된 기준에 따라 가격·성능·납기·사후관리를 비교하고 선택 이유를 남깁니다. 투명성·경쟁성·VFM·책임성이 하나의 절차에서 이어집니다.</p></li></ol></section>
    <section class="common-mistake"><h3>원문을 보완해 기억할 부분</h3><ul><li>02번: ‘UN 5단계’라는 분류의 출처는 제공자료만으로 확인되지 않아, 통합 플랫폼의 기능을 묻도록 보정했습니다. UN의 공식 인증 등급으로 외우지 않습니다.</li><li>04번: 과거 지문인증·‘공인’전자서명 표현을 현행 필수요건으로 쓰지 않습니다. 블록체인 적용 유무를 단정하는 대신 인증·암호화·전자서명의 역할을 구별합니다.</li><li>14번: ‘이용장터·민간 온라인몰 이용’ 대신 공식 이음장터의 서비스 거래 기능을 반영했습니다.</li><li>22번: 투명성은 정해진 범위와 시점의 공개입니다. 개찰 전 비밀 입찰내용이나 영업비밀까지 실시간 공개한다는 뜻은 아닙니다.</li></ul></section>
    <section><h3>시험 직전 10문장</h3>${table('핵심 암기와 문항 연결',['기억할 문장','관련 문항'],electronicMemory)}<p><strong>전 과정 전자화 → 단일창구 → 계약상품·플랫폼 선택 → 분류와 식별.</strong></p><a class="button" href="#practice/1/1-03">제공자료 예상문제 25개 풀기 →</a></section>
  </div>`;
}
