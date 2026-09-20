export const curriculum = { version: 2, title: '제1편 공공조달관리사 필기' };
export const chapterTitles = [
  ['공공조달의 개요', '공공조달 원칙 및 방법', '전자조달시스템', '전략적 공공조달', '공공조달 핵심 법령1', '공공조달 핵심 법령2 및 공정조달'],
  ['공공조달 계획', '조달요구 응대 및 제안', '입찰 실행', '입찰제안평가', '낙찰자 결정 및 계약'],
  ['계약관리 일반 절차', '계약변경 및 종결 관리', '물품 계약관리', '용역계약 절차 및 이행', '다수공급자계약(MAS)관리', '공사계약관리', '공사계약 특화 절차 및 하도급 관리']
];
export const partLabel = id => `PART ${String(id).padStart(2, '0')}`;
export const chapterLabel = chapter => `CHAPTER ${String(chapter).padStart(2, '0')}`;

// New IDs are zero-padded so old URLs and saved records cannot silently change meaning.
export const legacyLessonTargets = {
  '1-1': ['1-01', '1-02', '1-04'], '1-2': ['1-05', '1-06'],
  '1-3': ['1-02'], '1-4': ['1-03', '1-06'],
  '2-1': ['2-01'], '2-2': ['2-01'], '2-3': ['2-02', '2-03'],
  '2-4': ['2-03', '2-04', '2-05'],
  '3-1': ['3-01', '2-05'], '3-2': ['3-03', '3-01'],
  '3-3': ['3-02'], '3-4': ['3-02', '3-04', '3-05', '3-07']
};
export const resolveLessonId = id => legacyLessonTargets[id]?.[0] || id;
const completionRequirements = {
  '1-01': ['1-1'], '1-02': ['1-1', '1-3'], '1-03': ['1-4'], '1-05': ['1-2'],
  '2-01': ['2-1', '2-2'], '2-02': ['2-3'], '2-04': ['2-4'], '2-05': ['2-4', '3-1'],
  '3-01': ['3-1', '3-2'], '3-02': ['3-3', '3-4'], '3-03': ['3-2']
};
const currentIds = new Set(chapterTitles.flatMap((titles, part) => titles.map((_, chapter) => `${part + 1}-${String(chapter + 1).padStart(2, '0')}`)));

export function migrateStudyState(saved) {
  if (saved.curriculumVersion === curriculum.version) return saved;
  const oldCompleted = saved.completed || [];
  const completed = new Set(oldCompleted.filter(id => currentIds.has(id)));
  for (const [id, required] of Object.entries(completionRequirements)) {
    if (required.every(oldId => oldCompleted.includes(oldId))) completed.add(id);
  }
  const bookmarks = [...new Set((saved.bookmarks || []).flatMap(key => {
    if (!key.startsWith('l')) return [key];
    return (legacyLessonTargets[key.slice(1)] || [key.slice(1)]).filter(id => currentIds.has(id)).map(id => 'l' + id);
  }))];
  return {
    ...saved, curriculumVersion: curriculum.version, completed: [...completed], bookmarks,
    lastLesson: currentIds.has(resolveLessonId(saved.lastLesson)) ? resolveLessonId(saved.lastLesson) : null,
    previousCurriculum: saved.previousCurriculum || { completed: [...oldCompleted], bookmarks: [...(saved.bookmarks || [])], lastLesson: saved.lastLesson || null }
  };
}
