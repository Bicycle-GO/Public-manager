import test from 'node:test';
import assert from 'node:assert/strict';
import { subjects, lessons, questions, sources } from '../data.js';

test('Every subject supports four lessons and a balanced four-question mock exam', () => {
  assert.equal(subjects.length, 3);
  for (const subject of subjects) {
    assert.equal(lessons.filter(l => l.subject === subject.id).length, 4);
    assert.ok(questions.filter(q => q.subject === subject.id).length >= 4);
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
