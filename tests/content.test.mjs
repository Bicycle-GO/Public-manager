import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { subjects, lessons, questions, sources } from '../data.js';
import { renderLessonGuide } from '../lesson-content.js';
import { materialEdition, studyPlan, studyNotes } from '../study-materials.js';
import { renderStudyMaterials, renderStudyNotes, renderMaterialTopics } from '../study-ui.js';
import { curriculum, legacyLessonTargets, migrateStudyState, resolveLessonId } from '../curriculum.js';
import { renderCurriculumOutline, renderChapterNavigation } from '../curriculum-ui.js';

test('Requested volume contains the ordered 6 / 5 / 7 chapters and supports the mock exam', () => {
  assert.equal(subjects.length, 3);
  assert.equal(curriculum.title, '제1편 공공조달관리사 필기');
  const expected = [
    ['공공조달의 개요','공공조달 원칙 및 방법','전자조달시스템','전략적 공공조달','공공조달 핵심 법령1','공공조달 핵심 법령2 및 공정조달'],
    ['공공조달 계획','조달요구 응대 및 제안','입찰 실행','입찰제안평가','낙찰자 결정 및 계약'],
    ['계약관리 일반 절차','계약변경 및 종결 관리','물품 계약관리','용역계약 절차 및 이행','다수공급자계약(MAS)관리','공사계약관리','공사계약 특화 절차 및 하도급 관리']
  ];
  for (const subject of subjects) {
    const list = lessons.filter(l => l.subject === subject.id);
    assert.deepEqual(list.map(l=>l.title), expected[subject.id-1]);
    assert.deepEqual(list.map(l=>l.chapter), Array.from({length:list.length},(_,i)=>i+1));
    assert.ok(questions.filter(q => q.subject === subject.id).length >= 4);
  }
});

test('All eighteen chapters provide examples, reasoning, comparison, and self-check explanations', () => {
  for (const lesson of lessons) {
    const guide = lesson.guide;
    assert.ok(guide, `${lesson.id} needs a learning guide`);
    assert.equal(guide.terms.length, 3);
    assert.equal(guide.steps.length, 3);
    assert.ok(guide.situation.length > 60);
    assert.ok(guide.pitfall.length > 40);
    assert.ok(guide.check.question && guide.check.answer.length > 40);
    assert.ok(guide.example.rows.every(row => row.length === guide.example.headers.length));
    const html = renderLessonGuide(lesson);
    assert.ok(html.includes('<details>') && html.includes(guide.check.answer));
    assert.ok(html.includes('가상 업무 사례'));
    assert.ok(html.includes('<table'));
  }
});

test('Every question has a valid answer, explanation, and matching theory link', () => {
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  for (const q of questions) {
    assert.equal(q.options.length, q.type === 'ox' ? 2 : 4);
    assert.equal(new Set(q.options).size, q.options.length);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length);
    assert.ok(q.explanation.length > 30);
    assert.ok(lessons.some(l => l.id === q.lesson && l.subject === q.subject));
  }
});

test('Lessons have content, a valid official source, and practice questions', () => {
  assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
  for (const lesson of lessons) {
    assert.equal(lesson.sections.length, 3);
    assert.ok(lesson.sections.every(([heading, body]) => heading && body.length > 30));
    assert.ok(questions.some(q => q.lesson === lesson.id));
    assert.ok(new URL(sources[lesson.source]).hostname.endsWith('.go.kr'));
  }
});

test('All thirty existing question identities survive theory remapping and six questions cover new chapters', () => {
  assert.equal(questions.length, 373);
  const legacy = JSON.parse(readFileSync(new URL('./legacy-questions.json', import.meta.url), 'utf8'));
  assert.deepEqual(questions.slice(0,30).map(({lesson,...q})=>q), legacy);
  assert.deepEqual(subjects.map(s=>questions.filter(q=>q.subject===s.id).length),[176,110,87]);
  for (const lesson of lessons) assert.ok(questions.some(q=>q.lesson===lesson.id));
});

test('Study supplements and plan link to available lessons and official sources', () => {
  assert.equal(studyPlan.length, 14);
  assert.deepEqual(studyPlan.map(p => p.day), Array.from({length: 14}, (_, i) => i + 1));
  assert.deepEqual(studyPlan.flatMap(p => p.lessons).sort(), lessons.map(l => l.id).sort());
  assert.equal(Object.values(studyNotes).flatMap(n => n.calculations || []).length, 8);
  for (const lesson of lessons) {
    const note = studyNotes[lesson.id];
    assert.ok(note.topics.length >= 2 && note.checkpoint);
    for (const key of note.sources) assert.ok(new URL(sources[key]).hostname.endsWith('.go.kr'));
    if (note.table) assert.ok(note.table.rows.every(row => row.length === note.table.headers.length));
    const html = renderStudyNotes(lesson);
    assert.ok(html.includes(`href="#practice/${lesson.subject}/${lesson.id}"`));
    for (const example of note.calculations || []) {
      assert.ok(example.premise && example.formula && example.steps.length && example.result && example.note);
      assert.ok(html.includes(example.result) && html.includes('<details>'));
    }
  }
});

test('Material hub reports scope honestly, filters topics, and reflects existing progress', () => {
  const html = renderStudyMaterials({completed:['1-01','1-02'], answers:{1:1, 25:2}});
  assert.ok(html.includes(materialEdition.provenance));
  assert.ok(html.includes('이론 읽기 완료'));
  assert.ok(html.includes('PART 01 문제 (2/176)'));
  assert.ok(renderMaterialTopics('선금').includes('#theory/3/3-01'));
  assert.ok(renderMaterialTopics('  드론 ').includes('#theory/2/2-02'));
  assert.ok(renderMaterialTopics('MAS').includes('#theory/3/3-05'));
  assert.ok(renderMaterialTopics('없는용어검증').includes('일치하는 단원이 없습니다'));
  assert.ok(!renderMaterialTopics('<img src=x onerror=alert(1)>').includes('<img'));
});

test('Legacy records migrate once without changing answers or marking new chapters complete', () => {
  const old = {completed:['1-1','1-3','2-1'], bookmarks:['l1-1','l2-2','q25'], lastLesson:'1-2',answers:{1:1,25:2},activity:{'2026-09-19':3},exams:[{correct:8,total:12}],goal:5};
  const snapshot = structuredClone(old);
  const migrated = migrateStudyState(old);
  assert.deepEqual(old,snapshot);
  assert.deepEqual(migrated.completed,['1-01','1-02']);
  assert.equal(migrated.lastLesson,'1-05');
  assert.deepEqual(migrated.bookmarks,['l1-01','l1-02','l1-04','l2-01','q25']);
  for (const key of ['answers','activity','exams','goal']) assert.deepEqual(migrated[key],old[key]);
  assert.deepEqual(migrated.previousCurriculum.completed,old.completed);
  assert.deepEqual(migrateStudyState(migrated),migrated);
  const all = migrateStudyState({...old,completed:Object.keys(legacyLessonTargets)});
  assert.ok(!all.completed.includes('3-05') && !all.completed.includes('3-07'));
  assert.equal(resolveLessonId('1-2'),'1-05');
  assert.equal(resolveLessonId('1-02'),'1-02');
  for (const targets of Object.values(legacyLessonTargets)) {
    for(const id of targets) assert.ok(lessons.some(l=>l.id===id));
  }
});

test('Both contents views expose all ordered chapters and identify the active chapter', () => {
  for (const html of [renderCurriculumOutline(), renderStudyMaterials({completed:[],answers:{}})]) {
    let position = -1;
    for (const lesson of lessons) {
      const next = html.indexOf(`href="#theory/${lesson.subject}/${lesson.id}"`,position+1);
      assert.ok(next>position,`Missing or out-of-order chapter ${lesson.id}`);
      position=next;
    }
  }
  const html = renderChapterNavigation(lessons.at(-1));
  assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
  assert.ok(html.includes('CHAPTER 07') && html.includes('PART 03'));
});
