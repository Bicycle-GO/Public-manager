import { driveQuestionsA } from './practical-drive-a.js';
import { driveQuestionsB } from './practical-drive-b.js';
import { driveQuestionsC } from './practical-drive-c.js';

// Keep stable question IDs so saved drafts remain valid after content updates.
export const driveReviewedQuestions = [...driveQuestionsA, ...driveQuestionsB, ...driveQuestionsC]
  .map(question => ({...question, batch:'drive-20261024'}));
export const driveReviewDate = '2026-10-24';
export const driveFolderUrl = 'https://drive.google.com/drive/u/1/folders/1hGpFRr0rhEvYx6Dl6l8tvOx25YjRRXAT';
