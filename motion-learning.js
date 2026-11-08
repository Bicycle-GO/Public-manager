// Worked examples for the existing lessons. These models never change question data.
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = n => Number.isInteger(n) ? String(n) : String(Number(n.toFixed(4)));
export function computeEvaluation({technicalMaximum, rows}) {
  const threshold = technicalMaximum * .85;
  const ranked = rows.filter(r => r.technical >= threshold).map(r => ({...r, total:r.technical+r.price})).sort((a,b)=>b.total-a.total || b.technical-a.technical);
  return {threshold, rows:rows.map(r=>({...r,total:r.technical+r.price,eligible:r.technical>=threshold,rank:ranked.findIndex(x=>x.name===r.name)+1 || null}))};
}
export function computeTrimmedAverage(scores, exclude) {
  if(!Number.isInteger(exclude) || exclude<0 || scores.length<=2*exclude || scores.some(x=>!Number.isFinite(x))) throw new RangeError('평균을 계산할 점수와 제외 개수를 확인하세요.');
  const sorted=[...scores].sort((a,b)=>a-b), kept=sorted.slice(exclude,exclude ? -exclude : undefined);
  const sum=kept.reduce((a,b)=>a+b,0);
  return {sorted,kept,excluded:[...sorted.slice(0,exclude),...(exclude ? sorted.slice(-exclude) : [])],sum,average:sum/kept.length};
}
export const computeOwnershipCost = ({purchase,annual,years,disposal}) => purchase+annual*years+disposal;
const step=(title,formula,caption)=>({title,formula,caption});
function evaluation(id, technicalMaximum, rows, next=false) {
  const result=computeEvaluation({technicalMaximum,rows});
  const ranked=result.rows.filter(r=>r.eligible).sort((a,b)=>a.rank-b.rank);
  const order=ranked.map(r=>r.name).join(' → ');
  return {id,kind:'evaluation',title:next?'협상 결렬 후, 누구에게 넘어갈까?':'통과선을 먼저, 협상순위는 그다음',description:'막대가 채워지고 통과 여부가 정해진 뒤, 적격 업체의 합계를 비교합니다.',assumptions:`가상 사례 · 기술 ${technicalMaximum}점 / 가격 ${100-technicalMaximum}점. 모든 업체가 가격 요건을 충족하며 기술배점의 85% 기준을 적용합니다. 별도 점수 변환·동점은 없습니다.`,technicalMaximum,rows:result.rows,threshold:result.threshold,steps:[
    step('조건 읽기',`기술 ${technicalMaximum}점 · 가격 ${100-technicalMaximum}점`,'기술점수와 가격평가점수는 각각 받은 점수입니다. 가격점수는 실제 입찰금액과 다릅니다.'),
    step('기술 통과선 계산',`${technicalMaximum} × 0.85 = ${fmt(result.threshold)}점`,'85%를 곱할 분모는 총점 100점이 아니라 기술 배점한도입니다.'),
    step('기술 미달 업체 제외',result.rows.map(r=>`${r.name} ${r.technical}점: ${r.eligible?'충족':'미달'}`).join(' / '),'통과선과 같은 점수도 충족합니다. 합계가 높아도 기술 미달을 채울 수 없습니다.'),
    step('적격 업체의 합계 계산',ranked.map(r=>`${r.name}: ${r.technical} + ${r.price} = ${r.total}점`).join(' / '),'협상할 자격을 확인한 뒤 기술과 가격평가점수를 더합니다.'),
    step('협상순위 확정',order,'합산점수가 높은 적격 업체부터 협상합니다. 순위가 정해졌다고 계약이 자동으로 체결되지는 않습니다.'),
    ...(next?[step('1순위 협상 결렬',`${ranked[0].name} 결렬 → ${ranked[1].name}와 협상`,'미달 업체로 돌아가지 않습니다. 남아 있는 차순위 적격자와 동일한 기준·절차로 협상합니다.')]:[])
  ]};
}
function average(id,scores,exclude){
  const result=computeTrimmedAverage(scores,exclude);
  return {id,kind:'average',title:'같은 최고점이 두 개여도, 정해진 개수만 제외',description:'점수 카드를 정렬하고 양끝에서 정해진 개수만 뺀 다음, 남은 점수로 평균을 냅니다.',assumptions:`기존 해설의 조달청 가상 집계 사례 · ${scores.length}명 구성, 상위·하위 각 ${exclude}개 제외 조건. 다른 기관·평가 방식은 해당 기준을 확인합니다.`,scores,exclude,result,steps:[
    step('점수 확인',`${scores.length}개 점수`,'같은 점수라도 서로 다른 위원이 준 별개의 점수입니다.'),
    step('작은 점수부터 정렬',result.sorted.join(' · '),'점수의 크기와 제외할 위치를 확인합니다.'),
    step('양끝에서 정해진 개수만 제외',`최저 ${exclude}개 + 최고 ${exclude}개 제외`,'같은 극단값을 모두 지우지 않습니다. 흐리게 표시한 카드만 제외됩니다.'),
    step('남은 점수의 합계',`${result.kept.join(' + ')} = ${result.sum}`,'제외되지 않은 점수만 합합니다. 같은 값이 남아 있어도 그대로 포함합니다.'),
    step('남은 개수로 나누기',`${result.sum} ÷ ${result.kept.length} = ${fmt(result.average)}점`,`${scores.length}명 전체가 아닌 남은 ${result.kept.length}개 점수가 분모입니다. 이 예시는 소수점 다섯째 자리에서 반올림했습니다.`)
  ]};
}
const tcoRows=[{name:'A 장비',purchase:1000,annual:200,years:5,disposal:50},{name:'B 장비',purchase:1300,annual:100,years:5,disposal:50}];
const models={
  evaluation:evaluation('evaluation',80,[{name:'A',technical:74,price:15},{name:'B',technical:70,price:18},{name:'C',technical:66,price:20}]),
  evaluation70:evaluation('evaluation70',70,[{name:'A',technical:63,price:25},{name:'B',technical:60,price:27},{name:'C',technical:58,price:30}]),
  'evaluation-next':evaluation('evaluation-next',80,[{name:'A',technical:67,price:20},{name:'B',technical:70,price:18},{name:'C',technical:73,price:14}],true),
  average:average('average',[60,60,80,85,90,90,95,95],1),
  average12:average('average12',[50,60,70,75,80,85,90,90,95,95,100,100],2),
  tco:{id:'tco',kind:'tco',title:'살 때 가격에서, 쓰고 버릴 때 비용까지',description:'구매·사용·폐기 비용이 쌓이는 모습을 보며 총소유비용(TCO)을 비교합니다.',assumptions:'공공병원 장비 가상 사례 · 단위 만원, 사용기간 5년. 할인율·잔존가치·그 밖의 비용은 생략합니다. 개념 문항에서는 별도 계산 예시입니다.',rows:tcoRows,steps:[
    step('구매비만 비교', 'A 1,000만원 / B 1,300만원','처음 살 때는 A가 300만원 저렴합니다. 아직 전체 사용비용을 비교한 것은 아닙니다.'),
    step('5년 사용비용 누적','A: 200 × 5 = 1,000 / B: 100 × 5 = 500만원','연간 유지비에 사용연수를 곱합니다. 구매비에 포함된 항목을 다시 더하지 않습니다.'),
    step('폐기비까지 포함','A: 1,000 + 1,000 + 50 = 2,050만원 / B: 1,300 + 500 + 50 = 1,850만원','소유·사용하는 구매기관이 실제 부담하는 관련 비용을 같은 기간으로 비교합니다.'),
    step('총비용으로 비교','2,050 − 1,850 = 200만원','이 가정에서는 B의 5년 총소유비용이 200만원 적습니다. 초기 가격만으로 판단하면 결론이 달라집니다.')
  ]},
  lifecycle:{id:'lifecycle',kind:'lifecycle',title:'계약부터 이행·검사·지급까지, 지금 어느 단계일까?',description:'강조 표시를 따라가며 각 단계에서 무엇을 확인하는지 연결합니다.',assumptions:'일반적인 완료대가 흐름의 학습 모형입니다. 계약별 선금·기성대가·분할납품·검사 조건은 별도로 확인합니다. 하자책임은 해당 계약에 적용되는 경우를 뜻합니다.',nodes:[
    ['계약','과업·금액·기간·책임 확인'],['착수','일정·투입인력·수행계획 확인'],['이행 점검','일정·산출물·품질·보안 확인'],['완료·검사','계약·규격과 결과물을 대조'],['청구·지급','검사 후 적법한 대가청구 확인'],['하자·종결','적용되는 하자책임·기록 정리']
  ],steps:[
    step('계약조건 확인','계약 → 착수','해야 할 일, 기한과 책임을 확인합니다. 입찰 참가자격 심사와 계약 후의 이행 점검은 단계가 다릅니다.'),
    step('수행 준비 확인','착수 → 이행','언제, 누가, 어떤 방법으로 수행할지 계획을 확인합니다.'),
    step('약속한 일의 이행 점검','일정 + 산출물 + 품질 + 보안','계약을 체결했다고 관리가 끝나지 않습니다. 수행 중 변경사항도 정해진 절차로 관리합니다.'),
    step('완료 통지와 검사','결과물 ↔ 계약서·규격서','물건이 도착하거나 결과물을 제출했다는 사실과 계약대로 이행됐다는 확인을 구분합니다.'),
    step('청구를 확인하고 대가 지급','검사 → 적법한 청구 → 완료대가 지급','단순 납품만으로 자동 지급되는 것이 아닙니다. 선금·기성대가 흐름과는 구별합니다.'),
    step('하자책임과 종결 관리','적용되는 하자 관리 + 기록 보관','검사·지급 이후에도 계약조건에 따른 하자책임과 기록 관리가 남을 수 있습니다.')
  ]}
};
const lessonModels={'1-02':['tco'],'1-04':['tco'],'2-01':['tco'],'2-04':['evaluation','average'],'2-05':['evaluation70','lifecycle'],'3-01':['lifecycle'],'3-02':['lifecycle'],'3-03':['lifecycle'],'3-04':['lifecycle'],'3-06':['lifecycle']};
const questionModels={61:'tco',92:'tco',219:'tco',277:'evaluation70',420:'evaluation',427:'evaluation-next',442:'average',452:'average',301:'lifecycle',315:'lifecycle',320:'lifecycle',361:'lifecycle'};
export const getLessonMotionIds = id => [...(lessonModels[id] || [])];
export const getQuestionMotionId = q => questionModels[q?.id] || null;
export const getMotionLesson = id => models[id] || null;
function scoreDiagram(m,s){
  return `<div class="motion-score-grid">${m.rows.map(r=>{const status=s<2?'pending':!r.eligible?'excluded':s<4?'eligible':s===5&&r.rank===1?'failed':s===5&&r.rank===2?'next':'ranked';return `<article class="motion-candidate" data-status="${status}"><div class="motion-candidate-head"><strong>${r.name}사</strong><span class="motion-badge">${s<2?'확인 전':!r.eligible?'기술 미달':s===5&&r.rank===1?'협상 결렬':s===5&&r.rank===2?'다음 협상':'기술 충족'}</span></div><div class="motion-bars"><span>기술 ${r.technical} / ${m.technicalMaximum}점</span><div class="motion-bar-track"><div class="motion-bar-fill" data-motion-key="tech-${r.name}" style="--motion-width:${s ? r.technical/m.technicalMaximum*100 : 0}%"></div>${s>=1?'<span class="motion-cutoff" aria-hidden="true"></span>':''}</div><small>${s>=1?`통과선 ${fmt(m.threshold)}점 (85%)`:'다음 단계에서 기술 통과선 계산'}</small><span>가격평가 ${r.price}점</span></div><div class="motion-total">합계 <strong>${s>=3?r.total+'점':'계산 전'}</strong></div><p class="motion-rank">${s>=4?(r.eligible?`${r.rank}순위`:'순위 제외'):'적격 확인 → 합계 → 순위'}</p></article>`;}).join('')}</div>`;
}
export function renderMotionDiagram(id,s=0){
  const m=models[id];if(!m)return '';
  if(m.kind==='evaluation')return scoreDiagram(m,s);
  if(m.kind==='average'){
    const values=s ? m.result.sorted : m.scores;
    return `<div class="motion-score-tokens">${values.map((n,i)=>{const excluded=s>=2&&(i<m.exclude||i>=values.length-m.exclude);return `<div class="motion-token ${excluded?'is-excluded':s>=2?'is-kept':''}" data-motion-key="score-${i}"><strong>${n}</strong><small>${excluded?'제외':s>=2?'포함':`${i+1}번째`}</small></div>`;}).join('')}</div><p class="motion-count-note">${s>=2?`${values.length}개 − ${2*m.exclude}개 = ${m.result.kept.length}개로 계산`:'점수 카드는 하나당 위원 한 명의 점수입니다.'}</p>`;
  }
  if(m.kind==='tco')return `<div class="motion-cost-grid">${m.rows.map(r=>{const total=r.purchase+(s>=1?r.annual*r.years:0)+(s>=2?r.disposal:0);return `<article class="motion-cost-card"><h4>${r.name}</h4><div class="motion-cost-stack" aria-hidden="true">${[r.purchase,s>=1?r.annual*r.years:0,s>=2?r.disposal:0].map((v,i)=>`<span class="motion-cost-part part-${i}" data-motion-key="cost-${r.name}-${i}" style="--motion-width:${v/2200*100}%"></span>`).join('')}</div><dl class="motion-cost-legend"><div><dt>구매</dt><dd>${r.purchase}</dd></div><div><dt>5년 유지</dt><dd>${s>=1?r.annual*r.years:'아직 미포함'}</dd></div><div><dt>폐기</dt><dd>${s>=2?r.disposal:'아직 미포함'}</dd></div></dl><p class="motion-total">${s>=2?'총소유비용':'현재 포함된 비용'} <strong>${total.toLocaleString('ko-KR')}만원</strong></p>${s===3?`<span class="motion-badge">${r.name==='B 장비'?'총비용 200만원 절감':'초기 구매비는 저렴'}</span>`:''}</article>`;}).join('')}</div>`;
  return `<div class="motion-flow">${m.nodes.map(([title,body],i)=>`<article class="motion-flow-node ${i===s?'is-active':i<s?'is-done':''}" ${i===s?'aria-current="step"':''}><span class="motion-flow-index">${i+1}</span><h4>${title}</h4><p>${body}</p></article>`).join('')}</div>`;
}
export function renderMotionLearning(id,{context='theory'}={}){
  const m=models[id];if(!m)return '';
  const first=m.steps[0];
  return `<section class="motion-learning" data-motion="${id}" data-motion-step="0" data-motion-context="${esc(context)}" data-motion-reduced="false" role="region" aria-label="${esc(m.title)}"><header class="motion-heading"><span class="motion-eyebrow">움직임으로 이해하기 · ${context==='question'?'이 문제의 해설과 함께':'직접 조작하는 학습'}</span><h3>${esc(m.title)}</h3></header><p class="motion-description">${esc(m.description)}</p><p class="motion-assumptions">${esc(m.assumptions)}</p>${id==='average'||id==='average12'?context==='theory'?`<label class="motion-scenario">예제 선택 <select data-motion-scenario aria-label="점수 집계 예제 선택"><option value="average" ${id==='average'?'selected':''}>8명 · 양끝 1개씩</option><option value="average12" ${id==='average12'?'selected':''}>12명 · 양끝 2개씩</option></select></label>`:'':''}<div class="motion-stage">${renderMotionDiagram(id,0)}</div><div class="motion-reading" aria-live="polite" aria-atomic="true"><strong class="motion-step-title">1. ${esc(first.title)}</strong><p class="motion-formula">${esc(first.formula)}</p><p class="motion-caption">${esc(first.caption)}</p></div><nav class="motion-timeline" aria-label="인포그래픽 단계 선택">${m.steps.map((x,i)=>`<button type="button" class="motion-dot" data-motion-control="step" data-motion-index="${i}" ${i===0?'aria-current="step"':''} aria-label="${i+1}단계: ${esc(x.title)}">${i+1}</button>`).join('')}</nav><div class="motion-controls"><button type="button" data-motion-control="previous" disabled>← 이전</button><button type="button" data-motion-control="play" aria-pressed="false">▶ 재생</button><button type="button" data-motion-control="next">다음 →</button><button type="button" data-motion-control="reset">처음으로</button><label class="motion-speed">속도 <select data-motion-speed aria-label="재생 속도"><option value="5000">천천히 · 5초</option><option value="3000">보통 · 3초</option><option value="8000">꼼꼼히 · 8초</option></select></label><span class="motion-counter">1 / ${m.steps.length}단계</span></div><button type="button" class="motion-reduce" data-motion-control="reduce" aria-pressed="false">움직임 줄이기</button><p class="motion-motion-note">자동으로 시작하지 않습니다. 재생하거나 단계 번호를 눌러 내 속도로 살펴보세요.</p><details class="motion-transcript"><summary>전체 과정을 글로 읽기</summary><ol>${m.steps.map(x=>`<li><strong>${esc(x.title)}</strong><p>${esc(x.formula)}</p><p>${esc(x.caption)}</p></li>`).join('')}</ol></details></section>`;
}
export const renderLessonMotion = lesson => getLessonMotionIds(lesson.id).map(id=>renderMotionLearning(id)).join('');
export const renderQuestionMotion = q => {const id=getQuestionMotionId(q);return id?renderMotionLearning(id,{context:'question'}):'';};
