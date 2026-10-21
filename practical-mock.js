import { practicalUnits } from './practical-data.js';
import { workbookQuestions } from './practical-workbook.js';
import { chapterForUnit, chapterForCapture, practicalChapterUrl } from './practical-course.js';

export const practicalMockFormats = {
  comprehensive8: { label:'8개 영역 종합 연습', count:8, minutes:150, description:'8개 주요항목에서 1문항씩 출제하며 계획·계약유형 영역에 계산 문항을 포함합니다.' },
  capture12: { label:'캡처 12문제 연습', count:12, minutes:150, description:'캡처 기반 계산형 5·서술형 4·괄호형 2·단답형 1문제를 순서를 섞어 출제합니다.' }
};

export const practicalExamBank = [
  ...practicalUnits.map(unit => ({ id:'unit:' + unit.id, source:'unit', sourceId:unit.id, areaId:unit.areaId, title:unit.title, kind:unit.calculation ? '계산·서술형' : '서술형', stem:unit.prompt, given:[], tasks:[], answer:unit.answer, checks:unit.checks, calculation:Boolean(unit.calculation), theoryUrl:practicalChapterUrl(chapterForUnit(unit.id)) })),
  ...workbookQuestions.map(q => ({ id:'capture:' + q.id, source:'capture', sourceId:q.id, areaId:Number(q.units[0][1]), title:q.title, kind:q.kind, stem:q.stem, given:q.given, tasks:q.tasks, answer:q.answer, checks:q.checks, calculation:q.kind === '계산형', theoryUrl:practicalChapterUrl(chapterForCapture(q.id)) }))
];
const byId = new Map(practicalExamBank.map(q => [q.id, q]));
export const practicalExamQuestion = id => byId.get(id);

function shuffled(items, random) {
  const result = [...items];
  for (let i=result.length-1; i>0; i--) { const j=Math.floor(random()*(i+1)); [result[i], result[j]]=[result[j], result[i]]; }
  return result;
}

export function createPracticalAttempt(formatId = 'comprehensive8', random = Math.random, now = Date.now()) {
  const format = practicalMockFormats[formatId];
  if (!format) throw new RangeError('알 수 없는 실기 모의고사 유형입니다.');
  const list = formatId === 'capture12' ? shuffled(practicalExamBank.filter(q => q.source === 'capture'), random) : Array.from({length:8}, (_, i) => {
    const pool = practicalExamBank.filter(q => q.areaId === i+1);
    const preferred = [2,5].includes(i+1) ? pool.filter(q => q.calculation) : pool;
    return shuffled(preferred.length ? preferred : pool, random)[0];
  });
  return { id:crypto.randomUUID(), formatId, questionIds:list.map(q => q.id), startedAt:now, deadline:now+format.minutes*60000, index:0, answers:{} };
}

export const answeredPracticalCount = attempt => attempt.questionIds.filter(id => attempt.answers[id]?.trim()).length;
export function practicalTimeRemaining(attempt, now = Date.now()) {
  return Math.max(0, Math.ceil((attempt.deadline-now)/1000));
}

export function submitPracticalAttempt(attempt, reason = 'manual', now = Date.now()) {
  if (!attempt) return null;
  return { ...attempt, answers:{...attempt.answers}, submittedAt:now, reason:reason === 'timeout' ? 'timeout' : 'manual', checks:{}, reviewed:[] };
}

function normalizeAttempt(input, submitted = false) {
  if (!input || !practicalMockFormats[input.formatId] || typeof input.id !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(input.id)) return null;
  const format = practicalMockFormats[input.formatId];
  if (!Array.isArray(input.questionIds) || input.questionIds.length !== format.count || new Set(input.questionIds).size !== format.count || !input.questionIds.every(id => byId.has(id))) return null;
  if (input.formatId === 'capture12' && !input.questionIds.every(id => byId.get(id).source === 'capture')) return null;
  if (input.formatId === 'comprehensive8' && new Set(input.questionIds.map(id => byId.get(id).areaId)).size !== 8) return null;
  if (!Number.isFinite(input.startedAt) || !Number.isFinite(input.deadline) || input.deadline <= input.startedAt) return null;
  const ids = new Set(input.questionIds);
  const result = { id:input.id, formatId:input.formatId, questionIds:[...input.questionIds], startedAt:input.startedAt, deadline:input.deadline, index:Math.max(0,Math.min(format.count-1,Number.isInteger(input.index) ? input.index : 0)), answers:Object.fromEntries(Object.entries(input.answers || {}).filter(([id, text]) => ids.has(id) && typeof text === 'string')) };
  if (submitted) {
    if (!Number.isFinite(input.submittedAt)) return null;
    result.submittedAt=input.submittedAt;
    result.reason=input.reason === 'timeout' ? 'timeout' : 'manual';
    result.checks=Object.fromEntries(Object.entries(input.checks || {}).filter(([id, items]) => ids.has(id) && Array.isArray(items)).map(([id, items]) => [id,[...new Set(items.filter(index => Number.isInteger(index) && index>=0 && index<byId.get(id).checks.length))]]));
    result.reviewed=Array.isArray(input.reviewed) ? [...new Set(input.reviewed.filter(id => ids.has(id)))] : [];
  }
  return result;
}

export function normalizePracticalExams(value) {
  const input=value && typeof value === 'object' ? value : {};
  return { active:normalizeAttempt(input.active), history:Array.isArray(input.history) ? input.history.map(item=>normalizeAttempt(item,true)).filter(Boolean).filter((item,index,items)=>items.findIndex(other=>other.id===item.id)===index).slice(-20) : [] };
}

export function gradePracticalSelfCheck(result) {
  const rows = result.questionIds.map(id => {
    const q = byId.get(id), written = Boolean(result.answers[id]?.trim());
    const checked = written ? [...new Set((result.checks?.[id] || []).filter(n => Number.isInteger(n) && n>=0 && n<q.checks.length))].length : 0;
    const reviewed = !written || Boolean(result.reviewed?.includes(id));
    const score = reviewed && written ? checked/q.checks.length*100/result.questionIds.length : 0;
    return { id, written, checked, possible:q.checks.length, reviewed, score };
  });
  return { rows, score:Math.round(rows.reduce((sum,row)=>sum+row.score,0)*10)/10, reviewed:rows.filter(row=>row.reviewed).length, total:rows.length, complete:rows.every(row=>row.reviewed), answered:rows.filter(row=>row.written).length };
}
