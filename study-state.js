// Preserve valid records while rejecting malformed storage fields independently.
export function sanitizeStudyState(value, lessons, questions) {
 const record = item => item && typeof item==='object' && !Array.isArray(item) ? item : {};
 const saved = record(value), lessonIds = new Set(lessons.map(l=>l.id));
 const bank = new Map(questions.map(q=>[String(q.id),q]));
 const unique = (items, accepts) => [...new Set(Array.isArray(items)?items.filter(accepts):[])];
 return {
  ...saved,
  completed: unique(saved.completed, id=>lessonIds.has(id)),
  bookmarks: unique(saved.bookmarks, id=>typeof id==='string' && (id[0]==='l'?lessonIds.has(id.slice(1)):id[0]==='q' && bank.has(id.slice(1)))),
  answers: Object.fromEntries(Object.entries(record(saved.answers)).filter(([id,answer])=>bank.has(id) && Number.isInteger(answer) && answer>=-1 && answer<bank.get(id).options.length)),
  activity: Object.fromEntries(Object.entries(record(saved.activity)).filter(([date,count])=>/^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isSafeInteger(count) && count>0)),
  goal: [3,5,10,15,20].includes(saved.goal)?saved.goal:5,
  lastLesson: lessonIds.has(saved.lastLesson)?saved.lastLesson:null,
  exams: (Array.isArray(saved.exams)?saved.exams:[]).filter(e=>e && Number.isFinite(Date.parse(e.date)) && Number.isInteger(e.total) && e.total>0 && Number.isInteger(e.correct) && e.correct>=0 && e.correct<=e.total && (e.average===undefined || (Number.isFinite(e.average) && e.average>=0 && e.average<=100))).slice(-50)
 };
}

export function questionSequence(question, visibleQuestions, chapterQuestions) {
 const list = visibleQuestions.some(q=>q.id===question.id)?visibleQuestions:chapterQuestions;
 return {list, index:list.findIndex(q=>q.id===question.id)};
}
