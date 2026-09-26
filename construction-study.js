
import {constructionSpecialQuestions,constructionGeneralQuestions,constructionSources} from './construction-questions.js';
export {constructionSpecialTopics,constructionGeneralTopics} from './construction-questions.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const constructionExamples={unit:100000,awardRatio:0.8,quantity:100,minAmount:30000000,minDaysExclusive:30};
export const constructionReview=[
 ['01','③','③','300억원 이상만이라는 설명을 수정하고 종합점수 비교로 정리'],
 ['02','④','④ · 보기 교체','계약 이행 성실도 배제 대신 명확한 무관 항목으로 교체'],
 ['06','②','② · 산식 보완','일반 신규비목은 변경 당시 산정단가×낙찰률'],
 ['10','④','④ · 보기 보완','③의 설계변경 비용 전가도 부당특약 소지가 있어 보완'],
 ['12','③','③ · 용어 수정','지급보증 대신 전자적 대금관리·인출제한'],
 ['13','③','③ · 보기 수정','기본 지급 경로와 법정 직접지급을 구분'],
 ['14','④','④ · 조건 보완','지급보증 원칙과 개정 시행일·법정 예외 구분'],
 ['15','③','③ · 보기 수정','원안 설계 절대 불변이라는 단정 삭제'],
 ['17','③','② · 질문 수정','빈도 대신 최저가 순 적격심사 절차를 식별'],
 ['19','①','③ · 정답 신설','원문에 정확한 답 없음: 발주기관 요구 증가물량은 협의단가'],
 ['22','③','③ · 용어 수정','건설산업기본법의 수급인으로 정확히 표기'],
 ['23','③','③ · 범위 보완','세부 항목 분류 차이를 반영해 사회적 책임의 취지로 질문'],
 ['24','②','② · 용어 수정','기술자평가를 기술인평가서(SOQ)로 보완'],
 ['25','②','③ · 정답 신설','원문에 정확한 답 없음: 대상 공공공사 3천만원 이상·30일 초과']
];
function table(caption,headers,rows){return '<div class="lesson-table-wrap" tabindex="0" role="region" aria-label="'+esc(caption)+'"><table class="lesson-table"><caption>'+esc(caption)+'</caption><thead><tr>'+headers.map(h=>'<th scope="col">'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map((v,i)=>'<'+(i?'td':'th scope="row"')+'>'+esc(v)+'</'+(i?'td':'th')+'>').join('')+'</tr>').join('')+'</tbody></table></div>';}
function topicSections(list){return list.map(q=>'<section tabindex="-1" id="construction-topic-'+q.id+'"><h3>'+String(q.sourceNumber).padStart(2,'0')+'. '+esc(q.topic)+'</h3><p>'+esc(q.details.concept)+'</p><div class="case-study"><h4>'+esc(q.details.example.title)+'</h4><p>'+esc(q.details.example.situation)+'</p><ul>'+q.details.example.effects.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div><p class="explanation-takeaway">'+esc(q.details.takeaway)+'</p><details><summary>원문에서 보완한 조건</summary><p>'+esc(q.details.correction)+'</p></details><p class="guide-reference">'+q.details.sources.filter(s=>!s.url.includes('chatgpt.com')).map(s=>'<a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+' ↗</a>').join('<br>')+'</p></section>').join('');}
export function renderConstructionStudy(lesson){
 if(lesson.id==='3-04')return '<section class="lesson-guide"><h3>기술용역 PQ·SOQ·TP와 낙찰방식</h3><p>기술용역의 전문성과 협상계약을 동일시하지 않습니다. 이번 대화의 기술용역 07·08·17·24번은 공사 특화 절차 묶음에 정리했습니다.</p><a href="#theory/3/3-07">기술용역 비교표·보충 이론 읽기 →</a> · <a href="#practice/3/3-07">관련 예상문제 풀기 →</a></section>';
 if(!['3-06','3-07'].includes(lesson.id))return '';
 const special=lesson.id==='3-07',list=special?constructionSpecialQuestions:constructionGeneralQuestions;
 const name=special?'공사 특화·하도급':'공사계약 후속',range=special?'01~25번':'22~25번',collection=special?'construction-special':'construction-general';
 return '<section class="lesson-guide" aria-label="'+name+' 보충 학습"><section class="learning-goal"><span class="subject-label">대화 검토·갱신 · 2026. 9. 26.</span><h2>'+name+' '+range+'</h2><p>'+(special?'공사 발주·심사 → 설계변경 단가 → 기술용역 평가 → 하도급 통보·보증·전자지급을 연결합니다.':'준공검사·대안입찰·재하도급·실비정산 개념을 정리합니다. 대화에서 본문이 확인된 앞선 공사계약 22~25번 4문항만 추가했습니다. 01~21번을 새로 복원하거나 추가하지 않았습니다.')+'</p><p>각 문제의 원문 번호를 유지했으며, 보정한 문제의 정답은 원문 정답표와 다를 수 있습니다. 아래 가상 사례는 학습용입니다.</p><div class="overview-intro-actions"><button class="button" data-action="start-followup" data-id="'+collection+'">'+name+' '+list.length+'문항 풀기 →</button><a href="#practice/3/'+lesson.id+'">CHAPTER별 문제 관리 →</a></div></section>'+
 (special?
 table('원문 정답·문구 검토표',['원문 번호','교재 답','보정 문항 답','수정 이유'],constructionReview)+
 '<section><h3>세 가지 입찰 방식 비교</h3>'+table('설계 책임과 제안의 출발점',['방식','출발점','핵심'],[['일괄입찰(턴키)','발주기관 기본계획·지침','설계·시공 결합'],['대안입찰','발주기관 원안 설계','법정 범위의 대안 설계'],['기술제안입찰','교부된 기본·실시설계서와 안내서','공사비·공기·관리 등의 기술제안']])+'</section>'+
 '<section><h3>PQ·SOQ·TP와 최종 낙찰</h3>'+table('참가자 평가와 낙찰의 구분',['구분','초점','주의'],[['PQ','실적·기술인·신용도 등 수행능력','통과가 낙찰 확정은 아님'],['SOQ','참여 핵심 기술인의 역량','PQ에도 인력 요소가 있음'],['TP','과업 수행 방법·기술적 해결방안','기술제안서를 받았다고 곧 협상계약은 아님'],['적격심사','정해진 순위에 따른 기준점 통과','기술용역에도 적용'],['종합심사','합산점수 비교','대상·난이도·세부기준 확인']])+'</section>'+
 '<section class="case-study"><h3>신규비목과 발주기관 요구 변경: 숫자로 비교</h3><p>변경 당시 산정단가 100,000원, 낙찰률 80%, 물량 100단위라는 가상 조건입니다.</p>'+table('같은 숫자, 다른 적용 사유',['경우','단가 산정','결과'],[['일반 신규비목','100,000×0.8','80,000원'],['발주기관 요구 증가분·신규비목','80,000~100,000원 범위에서 협의','협의단가'],['위 협의 불성립','(100,000+80,000)÷2','90,000원'],['불성립 단가로 100단위 증가','90,000×100','9,000,000원']])+'<p>일괄입찰 등 별도 조정 규정이 적용되는 계약은 따로 판단합니다.</p></section>'+
 '<section><h3>전자지급·직접지급·보증을 구분하기</h3><p>일반적인 흐름: 발주기관 → 원도급사 → 하도급사. 전자지급 시스템의 관리·인출제한과 발주기관의 직접지급, 보증기관의 지급보증은 서로 다른 개념입니다.</p>'+table('공공공사 전자지급의 규모 경계',['계약금액','공사기간','일반 규모요건'],[['29,000,000원','60일','금액 미충족'],['30,000,000원','30일','기간 미충족'],['30,000,000원','31일','두 조건 충족']])+'<p>법정 대상 발주기관이고 다른 제외사유가 없다는 전제입니다. 의무대상이 아니어도 공고·계약에 따른 사용 또는 자발적 사용은 가능합니다. 지급보증과 제도 적용은 해당 계약의 시행일·경과조치도 확인합니다.</p></section>':'')+
 '<section><h3>단원별 학습 지도</h3><ul>'+list.map(q=>'<li><button class="soft-button" data-action="study-section" data-target="construction-topic-'+q.id+'">'+String(q.sourceNumber).padStart(2,'0')+' · '+esc(q.topic)+'</button></li>').join('')+'</ul></section>'+
 topicSections(list)+
 '<section class="self-check"><h3>스스로 확인하기</h3><details><summary>'+(special?'발주기관이 늘린 물량에 당초 계약단가만 적용하면 될까요?':'기성검사는 언제나 매월, 준공검사는 언제나 1회일까요?')+'</summary><p>'+(special?'아닙니다. 제65조제3항제3호 적용 사유라면 협의단가 규정으로 판단합니다. 일반 신규비목 산식과 분리하세요.':'아닙니다. 계약상 검사·대가 조건과 보완·재검사 여부를 확인해야 합니다.')+'</p></details></section>'+
 '<p><a href="#theory/3/'+(special?'3-06':'3-07')+'">'+(special?'공사계약 22~25번 보충 이론':'공사 특화·하도급 01~25번과 정정표')+' →</a> · <a href="#theory/3/3-02">계약변경·종결 이론 →</a></p><p class="guide-note">공식 기출이 아닌 대화 기반 학습용 보정 문항입니다. 원문·정답·근거·기존 데이터 보존 및 메뉴 연결 검토 결과는 프로젝트의 갱신 검토 보고서에 기록했습니다.</p></section>';
}
