import test from 'node:test';
import assert from 'node:assert/strict';
import { subjects, lessons, questions, sources } from '../data.js';
import { renderLessonGuide } from '../lesson-content.js';
import { materialEdition, studyPlan, studyNotes } from '../study-materials.js';
import { renderStudyMaterials, renderStudyNotes, renderMaterialTopics } from '../study-ui.js';

test('Every subject supports four lessons and a balanced four-question mock exam', () => {
  assert.equal(subjects.length, 3);
  for (const subject of subjects) {
    assert.equal(lessons.filter(l => l.subject === subject.id).length, 4);
    assert.ok(questions.filter(q => q.subject === subject.id).length >= 4);
  }
});

test('All twelve lessons provide examples, reasoning, comparison, and self-check explanations', () => {
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
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
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

test('Expanded practice preserves existing IDs and provides ten questions per subject', () => {
  assert.equal(questions.length, 30);
  for (const subject of subjects) {
    assert.equal(questions.filter(q => q.subject === subject.id).length, 10);
  }
  for (let index = 0; index < 24; index++) {
    const lesson = lessons[Math.floor(index / 2)];
    assert.equal(questions[index].id, index + 1);
    assert.equal(questions[index].lesson, lesson.id);
  }
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
    assert.ok(html.includes(`href="#practice/${lesson.subject}"`));
    for (const example of note.calculations || []) {
      assert.ok(example.premise && example.formula && example.steps.length && example.result && example.note);
      assert.ok(html.includes(example.result) && html.includes('<details>'));
    }
  }
});

test('Material hub reports scope honestly, filters topics, and reflects existing progress', () => {
  const html = renderStudyMaterials({completed:['1-1'], answers:{1:1, 25:2}});
  assert.ok(html.includes(materialEdition.provenance));
  assert.ok(html.includes('이론 읽기 완료'));
  assert.ok(html.includes('제1과목 문제 (2/10)'));
  assert.ok(renderMaterialTopics('선금').includes('#theory/3/3-2'));
  assert.ok(renderMaterialTopics('  드론 ').includes('#theory/2/2-3'));
  assert.ok(renderMaterialTopics('없는용어검증').includes('일치하는 단원이 없습니다'));
  assert.ok(!renderMaterialTopics('<img src=x onerror=alert(1)>').includes('<img'));
});
