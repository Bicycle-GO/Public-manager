import test from 'node:test';
import assert from 'node:assert/strict';
import { workbookQuestions, workbookGroups, costInputs, costResults, trendResults, applyBasisPoints, calculateCost, normalizeWorkbookState, workbookProgress } from '../practical-workbook.js';
import { renderWorkbook, renderWorkbookLinks, renderWorkbookPrint } from '../practical-workbook-ui.js';
import { practicalUnits, normalizePracticalState } from '../practical-data.js';
import { renderPractical } from '../practical-ui.js';

test('All eight captures are represented by twelve distinct questions with separate curriculum mappings', () => {
  assert.equal(workbookQuestions.length, 12);
  assert.equal(new Set(workbookQuestions.map(q => q.id)).size, 12);
  assert.deepEqual([...new Set(workbookQuestions.flatMap(q => q.captures))].sort(), [1,2,3,4,5,6,7,8]);
  assert.deepEqual(workbookGroups.map(g => workbookQuestions.filter(q => q.group === g.id).length), [3,5,4]);
  assert.deepEqual(workbookQuestions.reduce((r,q) => ({ ...r, [q.kind]: (r[q.kind] || 0) + 1 }), {}), { '서술형':4, '계산형':5, '괄호형':2, '단답형':1 });
  for (const q of workbookQuestions) {
    assert.ok(q.concepts.length >= 3 && q.steps.length >= 3 && q.answer.length >= 2 && q.checks.length >= 3);
    assert.ok(q.explanation.every(text => text.length >= 40));
    assert.ok(q.blueprint.length >= 2);
    for (const id of q.units) assert.ok(practicalUnits.some(u => u.id === id), id);
    const html = renderWorkbook(q.id);
    for (const expected of ['문제', '용어를 쉬운 말로', '단계별로 보기', '답안의 뼈대', '실제 답안', '자가점검']) assert.ok(html.includes(expected), `${q.id}: ${expected}`);
    assert.ok(!html.includes('undefined'));
  }
});

test('Original four cost examples are independently verified through each subtotal and tax amount', () => {
  assert.deepEqual(costResults.basic, { materials:2000000, labor:500000, expenses:300000, base:2800000, admin:140000, subtotal:2940000, profitBase:940000, profit:94000, supply:3034000, vat:303400, total:3337400 });
  assert.deepEqual(costResults.construction, { materials:128000000, labor:57000000, expenses:46707500, base:231707500, admin:16219525, subtotal:247927025, profitBase:119927025, profit:21586865, supply:269513890, vat:26951389, total:296465279 });
  assert.deepEqual(costResults.service, { materials:5000000, labor:294000000, expenses:60000000, base:359000000, admin:43080000, subtotal:402080000, profitBase:397080000, profit:87357600, supply:489437600, vat:48943760, total:538381360 });
  assert.deepEqual(costResults.composite, { materials:56500000, labor:10000000, expenses:3500000, base:70000000, admin:4200000, subtotal:74200000, profitBase:17700000, profit:2124000, supply:76324000, vat:7632400, total:83956400 });
  assert.equal(applyBasisPoints(119927025, 1800), 21586865);
  assert.equal(applyBasisPoints(5, 1000), 1);
  assert.equal(applyBasisPoints(4, 1000), 0);
  for (const [key, input] of Object.entries(costInputs)) {
    const doubled = calculateCost({ ...input, materials: input.materials * 2 });
    assert.ok(doubled.base > costResults[key].base);
    // Material is excluded from the profit base except for its effect on administration costs.
    assert.equal(doubled.profitBase - costResults[key].profitBase, doubled.admin - costResults[key].admin);
    const q = workbookQuestions.find(q => q.costKey === key);
    assert.ok(q.answer.join(' ').includes(costResults[key].total.toLocaleString('ko-KR')));
  }
});

test('Trend calculations retain unrounded data and distinguish official statistics, growth and percentage points', () => {
  assert.equal(trendResults.nara2024, 145189500000000);
  assert.equal(trendResults.nara2023, 130583600000000);
  assert.equal(trendResults.sme2024, 142038100000000);
  assert.ok(Math.abs(trendResults.growth - 11.18509521869515) < 1e-10);
  const trend = workbookQuestions.find(q => q.id === 'cap-data-03');
  assert.ok(trend.answer.join(' ').includes('142조 381억원'));
  assert.ok(trend.table.rows.some(row => row.includes('11.1%')));
  assert.ok(trend.corrections.some(c => c.original.includes('388') && c.corrected.includes('381')));
  const demand = workbookQuestions.find(q => q.id === 'cap-plan-04');
  assert.ok(demand.given.some(([,text]) => text.includes('1억원')));
  assert.equal(((9100 - 7500) / 9100 * 100).toFixed(1), '17.6');
  assert.equal(((9100 - 7500) / 7500 * 100).toFixed(1), '21.3');
  assert.ok(demand.answer.join(' ').includes('17.6%') && demand.answer.join(' ').includes('21.3%'));
});

test('Workbook drafts, checks and completion reject invalid records and stay independent of existing unit progress', () => {
  const oldUnits = { completed:['p1-1'], drafts:{'p1-1':'기존 답안'}, checks:{'p1-1':[0]} };
  const before = JSON.stringify(oldUnits);
  const input = { completed:['cap-cost-01','cap-cost-01','p1-1'], drafts:{'cap-cost-01':'수식','bad':'삭제','cap-plan-01':false}, checks:{'cap-cost-01':[0,4,4,5,-1,'2'],'cap-plan-01':[0,2,3]} };
  const output = normalizeWorkbookState(input);
  assert.deepEqual(output, { completed:['cap-cost-01'], drafts:{'cap-cost-01':'수식'}, checks:{'cap-cost-01':[0,4],'cap-plan-01':[0,2]} });
  assert.equal(JSON.stringify(oldUnits), before);
  assert.deepEqual(normalizePracticalState(oldUnits), oldUnits);
  assert.deepEqual(workbookProgress(output), { total:12, written:1, completed:1, checked:4, possible:51 });
  for (const value of [null, 1, 'bad', { completed:{}, drafts:null, checks:null }]) assert.deepEqual(normalizeWorkbookState(value), { drafts:{}, completed:[], checks:{} });
});

test('Hidden solutions, escaped drafts, related unit links and both print routes preserve the full workbook', () => {
  const attack = '</textarea><script>alert(1)</script>';
  const state = { drafts:{'cap-cost-01':attack}, checks:{'cap-cost-01':[1]}, completed:[] };
  const page = renderWorkbook('cap-cost-01', state);
  assert.ok(page.includes('<details class="wb-solution">'));
  assert.ok(page.includes('&lt;/textarea&gt;&lt;script&gt;'));
  assert.ok(!page.includes(attack));
  assert.ok(renderWorkbookLinks('p5-2').includes('cap-cost-04'));
  const print = renderWorkbookPrint(state);
  assert.equal((print.match(/class="wb-print-question"/g) || []).length, 12);
  for (const q of workbookQuestions) assert.ok(print.includes(q.title));
  assert.ok(!print.includes('data-workbook-draft='));
  for (const args of [{segment:'questions', unitId:'print'}, {segment:'print'}]) {
    const html = renderPractical({ ...args, workbook:state });
    assert.equal((html.match(/class="wb-print-question"/g) || []).length, 12);
    assert.ok(html.includes('pr-print-view'));
    assert.ok(html.includes('&lt;script&gt;'));
  }
});
