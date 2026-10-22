import { practicalChapters, chapterForUnit, chapterForCapture, findPracticalChapter } from './practical-course.js';
import { practicalUnits } from './practical-data.js';
import { workbookQuestions } from './practical-workbook.js';
import { coreQuestions } from './practical-core-questions.js';
import { reviewedQuestions } from './practical-capture-review.js';

export const practicalExpectedBank = [
  ...practicalChapters.map(ch => ({source:'course',id:ch.id,part:ch.part,title:ch.title,chapter:ch,kind:'주제별 사례'})),
  ...practicalUnits.map(unit => ({source:'unit',id:unit.id,part:chapterForUnit(unit.id).part,title:unit.title,chapter:chapterForUnit(unit.id),kind:'출제기준 사례'})),
  ...workbookQuestions.map(q => ({source:'capture',id:q.id,part:chapterForCapture(q.id).part,title:q.title,chapter:chapterForCapture(q.id),kind:q.kind})),
  ...reviewedQuestions.map(q => ({source:'review',id:q.id,part:findPracticalChapter(q.chapterId).part,title:q.title,chapter:findPracticalChapter(q.chapterId),kind:q.kind})),
  ...coreQuestions.map(q => ({source:'core',id:q.id,part:findPracticalChapter(q.chapterId).part,title:q.title,chapter:findPracticalChapter(q.chapterId),kind:q.kind}))
].sort((a,b) => a.part-b.part);

export const practicalSourceLabels = {course:'주제별 사례',unit:'출제기준 사례',capture:'캡처 문제',core:'핵심 응용문제',review:'단원 핵심문제 · 검토본'};
export const practicalSourceCounts = Object.fromEntries(Object.keys(practicalSourceLabels).map(source => [source, practicalExpectedBank.filter(q => q.source === source).length]));
export const practicalBankSummary = Object.entries(practicalSourceLabels).map(([source,label]) => `${label} ${practicalSourceCounts[source]}`).join(' + ');
