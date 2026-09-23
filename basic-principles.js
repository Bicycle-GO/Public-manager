const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const basicPrinciples = [
  {key:'투',name:'투명성',english:'Transparency',question:'과정과 정보를 확인할 수 있는가?',
    summary:'조달정보와 절차를 명확히 공개',action:'보여줘라',
    meaning:'무엇을 왜 사고, 어떤 절차와 기준으로 업체를 선정하는지 확인할 수 있게 합니다. 공고 한 번으로 끝나는 것이 아니라 입찰 전의 명확한 규격, 입찰 중의 질의·답변과 평가기준, 계약 이후의 변경 절차까지 이어집니다.',
    keywords:'정보공개 · 접근성 · 명확한 기준 · 공개된 절차',
    example:'가상 B군은 드론촬영 용역의 사업목적, 예산, 참가자격, 평가기준, 제출기한을 공고합니다. 특정 업체에만 전화로 사업을 알려 다른 업체가 존재조차 모르게 한다면 투명성이 부족합니다.',
    trap:'모든 정보를 무조건 공개한다는 뜻은 아닙니다. 개인정보·영업비밀 등 보호 대상 정보는 적용 규정에 따라 다룹니다.',
    memory:'투명성 = 필요한 정보를 보여준다.'},
  {key:'가',name:'비용 대비 가치(VFM)',english:'Value for Money',question:'지출한 비용으로 필요한 성과를 얻는가?',
    summary:'가격뿐 아니라 품질·성과까지 고려',action:'잘 사라',
    meaning:'지출한 돈에 비해 필요한 가치를 얼마나 얻는지 판단합니다. 구매가격, 품질, 성능, 유지관리비, 사용수명, 서비스 수준과 위험을 함께 고려해 목적에 맞는 최적의 가치를 찾습니다.',
    keywords:'최적의 가치 · 품질 · 성능 · 생애주기비용 · 위험',
    example:'B군은 드론촬영 가격과 함께 촬영해상도, 위치정확도, 기술인력, 데이터 품질, 사후지원을 비교합니다. 가장 저렴해도 필요한 품질을 확보하지 못하면 좋은 구매가 아닙니다.',
    trap:'“최저가격이 항상 VFM을 의미한다”는 틀린 설명입니다. 비싸거나 수명이 길다고 자동으로 유리한 것도 아닙니다. 같은 사용 목적·기간·조건에서 공고된 평가방식으로 비교합니다.',
    memory:'VFM = 가격과 성과를 함께 보고 잘 산다.'},
  {key:'경',name:'경쟁성',english:'Competition / Competitiveness',question:'적격한 공급자가 경쟁할 기회가 있는가?',
    summary:'충분한 공급자에게 경쟁할 기회 보장',action:'경쟁시켜라',
    meaning:'필요한 자격을 갖춘 여러 공급자가 가격·기술·서비스로 경쟁할 기회를 넓힙니다. 불필요한 참가 제한이나 특정 업체에 유리한 규격을 줄여 가격 인하, 품질 향상, 기술혁신과 다양한 선택을 기대할 수 있습니다.',
    keywords:'참여기회 확대 · 경쟁촉진 · 과도한 참가제한 방지 · 편향된 규격 방지',
    example:'B군이 드론 기종을 특정 회사 제품으로만 한정하면 경쟁이 좁아질 수 있습니다. 필요한 해상도·위치정확도 중심으로 규격을 정하면 여러 업체의 제안을 비교할 수 있습니다.',
    trap:'모든 계약을 무조건 공개경쟁으로 해야 한다는 뜻은 아닙니다. 긴급성·독점기술 등은 관련 법령이 정한 요건에 해당하는지 확인해야 하며, 단순한 편의를 이유로 경쟁을 제한할 수는 없습니다.',
    memory:'경쟁성 = 적격한 업체가 제안으로 겨룬다.'},
  {key:'차',name:'차별금지 및 동등대우',english:'Non-discrimination & Equal Treatment',question:'비슷한 조건의 업체를 같은 기준으로 대하는가?',
    summary:'같은 조건의 참가자에게 같은 기회·기준 적용',action:'똑같이 대하라',
    meaning:'합리적 이유 없이 특정 지역·기업형태·업체를 유리하게 대하지 않고, 같은 조건의 참가자에게 동일한 정보·기한·평가기준을 적용합니다. 참가자격 설정부터 평가·계약까지 지켜야 할 원칙입니다.',
    keywords:'동일 기준 · 동등한 기회 · 자의적 차별 금지',
    example:'B군이 A업체에만 평가기준의 세부내용을 미리 알려주거나, 같은 상황인데 A업체에만 보완자료 제출 기회를 준다면 동등대우에 어긋날 수 있습니다.',
    trap:'모든 참가조건을 없애라는 뜻은 아닙니다. 기술인력·실적·장비 등은 사업에 필요한 객관적이고 합리적인 요건인지 봅니다. 법령상 지역제한·정책지원도 자의적 차별과 구별합니다.',
    memory:'차별금지·동등대우 = 같은 조건에는 같은 기회와 기준.'},
  {key:'책',name:'책임성',english:'Accountability',question:'결정 이유와 결과를 설명하고 책임지는가?',
    summary:'의사결정 근거를 남기고 결과를 설명·책임',action:'설명하라',
    meaning:'왜 특정 업체를 선정하고, 참가자격을 제한하거나 계약금액을 변경했는지 근거와 기록을 남깁니다. 감사·이의제기 때 결정 이유를 설명할 수 있어야 하며, 계약 결과와 성과도 책임 있게 관리합니다.',
    keywords:'기록관리 · 의사결정 근거 · 감사 가능성 · 결과에 대한 설명',
    example:'B군은 “담당자가 판단했다”는 말 대신 공고된 기준에 따른 기술·가격 점수와 종합점수로 선정 이유를 설명합니다. 평가표를 보관하고 납품된 영상의 정확도와 문제 처리 결과도 확인합니다.',
    trap:'문서를 보관하거나 잘못한 사람을 처벌하는 것만으로 충분하지 않습니다. 계약 결과를 확인하고 문제를 개선하는 역할까지 포함합니다.',
    memory:'책임성 = 왜 결정했는지 설명하고 결과를 챙긴다.'}
];

export const principleComparisons = [
  ['투명성 ↔ 책임성','정보가 공개·접근 가능한가? ↔ 결정 근거와 결과를 설명할 수 있는가?','평가기준을 공고: 투명성 / 선정 이유를 설명: 책임성'],
  ['경쟁성 ↔ 동등대우','경쟁할 기회가 있는가? ↔ 참여자를 같은 기준으로 대하는가?','여러 업체에 개방: 경쟁성 / 같은 기한·기준 적용: 동등대우'],
  ['경쟁성 ↔ VFM','좋은 제안을 받을 과정과 환경인가? ↔ 지출에 비해 적절한 가치를 얻는가?','참여기회 확대: 경쟁성 / 가격·품질·유지비 종합 판단: VFM'],
  ['효율성 ↔ VFM','자원 낭비를 줄였는가? ↔ 비용에 비해 필요한 가치를 얻는가?','중복 서류를 줄임: 효율성 / 성능·유지비까지 비교: VFM'],
  ['공정성 ↔ 동등대우','공평한 운영이라는 넓은 가치 ↔ 업체 사이의 부당한 차별을 막는 구체적 원칙','특정 업체 편들기는 두 원칙과 모두 관련될 수 있음'],
  ['투명성 ↔ 청렴성 ↔ 책임성','정보 공개 ↔ 부패·이해충돌 방지 ↔ 결정·결과에 대한 설명과 책임','공고한다 / 금품 제안을 거절한다 / 선정 근거를 제시한다']
];

export const principleChecks = [
  ['평가기준과 제출 기한을 사전에 공개했다. 가장 직접적인 원칙은?','투명성','핵심 행동은 정보의 공개입니다. 같은 정보를 제공한다는 점에서는 동등대우도 관련되지만, 질문이 강조하는 행동부터 판단합니다.'],
  ['구입비뿐 아니라 유지관리비·성능·사용기간을 함께 비교했다. 가장 직접적인 원칙은?','비용 대비 가치(VFM)','최초 가격을 넘어 비용과 성과를 함께 평가합니다. 필요한 품질을 만족하는지까지 확인해야 합니다.'],
  ['불필요한 자격 제한을 없애 적격한 여러 업체가 입찰하도록 했다. 가장 직접적인 원칙은?','경쟁성','참여 기회를 넓혀 더 나은 제안을 비교하려는 행동입니다. 필요한 최소 자격요건까지 없애는 것은 아닙니다.'],
  ['A·B업체에 같은 제출 기한과 평가기준을 적용했다. 가장 직접적인 원칙은?','차별금지 및 동등대우','같은 조건의 참가자를 일관된 기준으로 다룬 것이 핵심입니다. 공정성과도 연결됩니다.'],
  ['선정 이유를 평가기록으로 설명하고 납품 문제를 개선했다. 가장 직접적인 원칙은?','책임성','결정의 근거를 설명하고 결과까지 관리합니다. 정보 공개만을 강조하는 투명성과 구별합니다.']
];

function table(title,headers,rows) {
  return `<div class="lesson-table-wrap" tabindex="0" role="region" aria-label="${esc(title)}"><table class="lesson-table"><caption>${esc(title)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,i)=>i?`<td>${esc(cell)}</td>`:`<th scope="row">${esc(cell)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

export function renderBasicPrinciples(lesson) {
  if(lesson.id!=='1-02') return '';
  return `<div class="basic-principles" aria-label="공공조달 5대 기본원칙 학습자료">
    <section class="principles-intro"><span class="case-label">제1절 · 공공조달 기본원칙</span><h2>다섯 가지 질문으로 이해하는 공공조달</h2><p>공공조달의 기본원칙은 단순히 싸게 사는 방법을 정한 것이 아닙니다. <strong>국민의 세금으로 물품·용역·공사를 구매할 때 공정한 시장을 만들고, 필요한 품질을 확보하며, 그 결정을 국민에게 설명하기 위한 기준</strong>입니다.</p><p class="principles-memory"><strong>투 · 가 · 경 · 차 · 책</strong><br>투명하게, 가치 있게, 경쟁시키고, 차별하지 말고, 책임진다.</p><p class="small-text">이 단원은 투명성 → 비용 대비 가치 → 경쟁성 → 차별금지 및 동등대우 → 책임성의 다섯 원칙으로 정리합니다.</p></section>
    <section><h3>5대 기본원칙 한눈에 보기</h3>${table('공공조달 5대 기본원칙 핵심 요약',['기본원칙','핵심 의미','시험용 한마디'],basicPrinciples.map(p=>[p.name,p.summary,p.action]))}</section>
    <div class="principle-cards">${basicPrinciples.map((p,i)=>`<section class="principle-card"><span class="principle-number">${String(i+1).padStart(2,'0')} · ${p.key}</span><h3>${esc(p.name)}</h3><span class="principle-english">${esc(p.english)}</span><p class="principle-question"><strong>${esc(p.question)}</strong></p><p>${esc(p.meaning)}</p><p class="principle-keywords"><strong>문제 속 단서</strong> ${esc(p.keywords)}</p><details><summary>${esc(p.name)} · 사례와 주의점 보기</summary><p><strong>가상 B군 사례</strong><br>${esc(p.example)}</p><p><strong>헷갈리지 마세요</strong><br>${esc(p.trap)}</p></details><p class="principle-memory">${esc(p.memory)}</p></section>`).join('')}</div>
    <section><h3>VFM은 최저가격과 어떻게 다를까?</h3><p class="principles-memory"><strong>VFM ≠ 최저가격</strong><br>구매가격·품질·성능·생애주기비용·위험을 종합해 최적의 가치를 판단합니다.</p><p>가상 공공기관이 서버 시스템 두 개를 비교합니다. 아래 금액과 사용수명은 학습용 가정입니다.</p>${table('서버 시스템의 가격과 사용 조건 비교',['비교 항목','A제품','B제품'],[['구매가격','8천만원','6천만원'],['사용 조건','10년간 안정적 사용, 유지보수비가 적음','고장이 잦고 5년 후 교체 필요'],['함께 볼 비용·위험','유지보수비와 서비스 수준','교체비·유지보수비·업무 중단 위험']])}<p>처음에는 B제품이 싸지만 같은 10년 동안 필요한 성능을 확보하는 비용과 위험을 비교하면 A제품이 더 경제적일 수 있습니다. <strong>정확한 결론에는 교체비·유지비 등 추가 정보가 필요합니다.</strong></p><details><summary>계산으로 확인하기 · 같은 5년의 총비용</summary><p>같은 필수 성능을 충족한 별도의 장비 A안·B안을 비교합니다. 할인율·잔존가치·교체비는 모두 0으로 단순화합니다.</p>${table('5년 사용을 가정한 비용 비교',['비교 항목','A안','B안'],[['구입비','100만원','130만원'],['연간 유지비 × 5년','15만원 × 5 = 75만원','5만원 × 5 = 25만원'],['5년 총비용','175만원','155만원']])}<p><strong>B안은 구입비가 30만원 높지만 가정한 총비용은 20만원 낮습니다.</strong> 품질·서비스·고장 위험도 함께 판단하며, 이 계산만으로 실제 낙찰자를 결정하는 것은 아닙니다.</p></details></section>
    <section><h3>하나의 사업에 다섯 원칙 적용하기</h3><p>가상의 B군이 <strong>1억원 규모의 드론 촬영 용역</strong>을 발주합니다. 금액은 원칙을 이해하기 위한 가정입니다.</p><ol class="principle-scenario"><li><strong>투명성 · 공고</strong> — 사업내용과 평가기준을 나라장터 등에 명확히 공개합니다.</li><li><strong>경쟁성 · 참여기회</strong> — 특정 업체에 유리한 불필요한 제한을 없애 여러 적격 업체가 참여하게 합니다.</li><li><strong>동등대우 · 공정한 평가</strong> — 모든 참가업체에 동일한 제출기한과 평가기준을 적용합니다.</li><li><strong>VFM · 최적의 가치 선택</strong> — 가격과 정확도·촬영품질·기술능력·사후관리를 종합해 판단합니다.</li><li><strong>책임성 · 결과 설명</strong> — 선정 근거와 평가기록을 남겨 설명하고 납품 품질도 확인합니다.</li></ol><p class="principles-memory"><strong>공고 → 경쟁 → 공정한 평가 → 최적의 가치 선택 → 결과 설명</strong></p><p>이 흐름은 사례를 이해하는 순서입니다. 암기 순서는 ‘투·가·경·차·책’이며, 실제 업무에서는 다섯 원칙이 여러 단계에서 함께 작동합니다.</p></section>
    <section><h3>특히 헷갈리는 세 가지 구별하기</h3>${table('투명성·동등대우·책임성 구별',['원칙','판단 질문','핵심 행동'],[['투명성','모두에게 보여줬는가?','정보와 절차 공개'],['동등대우','모두에게 똑같이 적용했는가?','같은 조건에 같은 기준 적용'],['책임성','왜 그렇게 결정했는지 설명할 수 있는가?','근거·기록으로 설명하고 결과에 책임']])}<h3>경쟁성·VFM과 다른 원칙 비교</h3>${table('공공조달 원칙 비교',['비교','판단 질문','사례의 단서'],principleComparisons)}<p>경쟁성은 좋은 계약자를 찾기 위한 과정과 환경, VFM은 지출에 비해 적절한 결과와 가치를 얻는 데 초점을 둡니다. 동등대우는 평가뿐 아니라 참가조건을 정하는 단계부터 적용합니다.</p><p>효율성은 조달 절차의 시간·비용뿐 아니라 투입 자원과 성과의 관계에도 적용됩니다. ‘효율=과정, VFM=결과’는 초보 학습용 구별법이며 두 개념을 완전히 나누는 정의는 아닙니다.</p></section>
    <section class="principles-scope"><h3>5대 기본원칙과 8가지 학습 분류의 차이</h3><p><strong>이 단원의 기준:</strong> 투명성·VFM·경쟁성·차별금지 및 동등대우·책임성입니다. 공정성·효율성·청렴성이 중요하지 않다는 뜻이 아니라, 이 다섯 항목을 묻는 분류에서 별도 이름으로 나열되지 않는다는 뜻입니다.</p><dl><div><dt>이번 참조 대화의 8가지</dt><dd>투명성·공정성·경쟁성·효율성·책임성·청렴성·VFM·동등대우/차별금지</dd></div><div><dt>기존 CHAPTER 01의 대화 21번 분류</dt><dd>경쟁·투명·공정·효율·책임·윤리·VFM·지속가능성</dd></div></dl><p>두 목록을 하나의 고정된 ‘공식 8대 원칙’으로 합치지 않고, 문제에 제시된 분류와 기준 자료를 먼저 확인하세요. OECD의 12대 실행원칙도 별도의 분류입니다.</p></section>
    <section class="principles-checks"><h3>사례로 스스로 확인하기</h3><p>답을 펼치기 전에 문장의 핵심 행동을 찾아 원칙을 말해 보세요.</p>${principleChecks.map(([question,answer,reason],i)=>`<details><summary>${i+1}. ${esc(question)}</summary><p><strong>정답: ${esc(answer)}</strong><br>${esc(reason)}</p></details>`).join('')}</section>
    <section class="principles-recap"><h3>시험 직전 핵심 정리</h3><p><strong>투·가·경·차·책 — 투명하게, 가치 있게, 경쟁시키고, 차별하지 말고, 책임진다.</strong></p><ul class="principle-scenario"><li>정보공개 → <strong>투명성</strong></li><li>최저가가 아닌 최적 가치 → <strong>VFM</strong></li><li>참여기회 확대 → <strong>경쟁성</strong></li><li>동일한 기준 적용 → <strong>차별금지 및 동등대우</strong></li><li>의사결정 근거와 설명 → <strong>책임성</strong></li></ul><ol><li><strong>분류 확인:</strong> 5대 기본원칙인지, 제시된 8가지 분류인지 읽습니다.</li><li><strong>핵심 행동 확인:</strong> 공개·종합가치·참여기회·동일기준·설명책임 중 무엇을 강조하는지 봅니다.</li><li><strong>절대 표현 점검:</strong> “최저가격이 항상 VFM이다”, “모든 계약은 공개경쟁이다”, “참가조건은 모두 없애야 한다”는 틀린 설명입니다.</li></ol><a class="button" href="#practice/1/1-02">CHAPTER 02 예상문제 관리로 →</a></section>
    <div class="principles-sources"><strong>학습자료 정리 · 2026. 9. 24. 업데이트</strong><p>사용자가 제공한 5대 기본원칙 설명을 바탕으로 요약표·서버 비교·드론 용역 사례·시험 포인트를 정리했습니다.</p><strong>기존 참고 자료 · 2026. 9. 23. 확인 기록</strong><a href="https://www.pps.go.kr/hrd/home/UserBoardActionUpdate.do?BO_CODE=REFERENCE_ROOM&amp;BO_IDX=6579&amp;CHILD_MENU=MENU209&amp;ROOT_MENU=MENU002&amp;method=detail&amp;pageLine=10&amp;pageNo=3" target="_blank" rel="noopener noreferrer">조달청 표준교재 1권 · 공공조달의 이해, 69~71·122쪽 ↗</a><a href="chatgpt-conversation://6aaddb3f-dce4-83e9-b473-1649c24c7859">참조 대화 · 공공조달 필기과목 정리 ↗</a><p>표준교재는 학습 참고자료이며 시험 출제기준 자체는 아닙니다. 위 사례·비교·자기점검은 이해를 돕기 위해 작성한 웹 학습자료입니다.</p></div>
  </div>`;
}
