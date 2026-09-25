const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

import { renderBasicPrinciples } from './basic-principles.js';
import { renderProcurementMethods } from './procurement-methods.js';
import { renderElectronicProcurement } from './electronic-procurement.js';
import { renderStrategicProcurement } from './strategic-procurement.js';
import { renderBidExecution } from './bid-execution.js';
import { renderBidExecutionFollowup, renderAwardContract } from './bid-followup-study.js';
import { renderLaw1Followup } from './law1-followup.js';
import { renderLaw2Followup } from './law2-followup.js';
import { renderPlanningFollowup } from './planning-followup.js';
import { renderProposalFollowup } from './proposal-followup.js';
import { renderContractManagement, renderContractChange } from './contract-management-study.js';
import { renderGoodsContract } from './goods-contract-study.js';

export function renderLessonGuide(lesson) {
  const g = lesson.guide;
  if (!g) return '';
  const text = escape;
  return `${renderBasicPrinciples(lesson)}${renderProcurementMethods(lesson)}${renderElectronicProcurement(lesson)}${renderStrategicProcurement(lesson)}${renderBidExecution(lesson)}${renderBidExecutionFollowup(lesson)}${renderAwardContract(lesson)}${renderLaw1Followup(lesson)}${renderLaw2Followup(lesson)}${renderPlanningFollowup(lesson)}${renderProposalFollowup(lesson)}${renderContractManagement(lesson)}${renderContractChange(lesson)}${renderGoodsContract(lesson)}<div class="lesson-guide">
    <section class="learning-goal"><h3>이 단원을 공부하면</h3><p>${text(g.goal)}</p></section>
    <section><h3>용어부터 쉽게 이해하기</h3><dl class="term-list">${g.terms.map(([term, definition])=>`<div><dt>${text(term)}</dt><dd>${text(definition)}</dd></div>`).join('')}</dl></section>
    <section class="case-study"><span class="case-label">가상 업무 사례</span><h3>${text(g.caseTitle)}</h3><p>${text(g.situation)}</p><h4>이렇게 판단해 보세요</h4><ol class="case-steps">${g.steps.map(([title,body])=>`<li><strong>${text(title)}</strong><p>${text(body)}</p></li>`).join('')}</ol></section>
    <section><h3>${text(g.example.title)}</h3><div class="lesson-table-wrap" tabindex="0" role="region" aria-label="${text(g.example.title)} 비교표"><table class="lesson-table"><caption>${text(g.example.title)}</caption><thead><tr>${g.example.headers.map(h=>`<th scope="col">${text(h)}</th>`).join('')}</tr></thead><tbody>${g.example.rows.map(row=>`<tr>${row.map((cell,i)=>i===0?`<th scope="row">${text(cell)}</th>`:`<td>${text(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>
    <section class="common-mistake"><h3>헷갈리기 쉬운 점</h3><p>${text(g.pitfall)}</p></section>
    <section class="self-check"><h3>잠깐, 스스로 설명해 보세요</h3><p>${text(g.check.question)}</p><details><summary>해설 펼치기</summary><p>${text(g.check.answer)}</p></details></section>
    ${g.reference ? `<p class="guide-reference"><a href="${text(g.reference.url)}" target="_blank" rel="noopener noreferrer">관련 근거: ${text(g.reference.label)} ↗</a></p>`:''}
    <p class="guide-note">사례는 이해를 돕기 위한 가상 상황입니다. 예시의 금액·기간·성능 수치는 법정 기준이 아니며, 실제 업무는 적용 법령과 계약조건을 확인해야 합니다.</p>
  </div>`;
}
