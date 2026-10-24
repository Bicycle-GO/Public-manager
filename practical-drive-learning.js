import { driveLearningA } from './practical-drive-a-learning.js';
import { driveLearningB } from './practical-drive-b-learning.js';
import { driveLearningC } from './practical-drive-c-learning.js';

// A chapter may have several reviewed source groups. Retain them all.
export const driveLearning = {};
for (const group of [driveLearningA, driveLearningB, driveLearningC]) {
  for (const [chapterId, supplement] of Object.entries(group)) {
    (driveLearning[chapterId] ||= []).push({
      ...supplement,
      reviewedDate:'2026-10-24',
      questionSource:'review'
    });
  }
}
