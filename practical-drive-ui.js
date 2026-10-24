import { driveReviewedQuestions, driveReviewDate } from './practical-drive-review.js';
import { driveSources } from './practical-drive-sources.js';
import { driveLearning } from './practical-drive-learning.js';
import { courseEsc as esc } from './practical-course-ui.js';

export function renderDriveUpdate() {
  return `<aside class="pc-scope pq-drive-update"><strong>드라이브 사진 ${driveSources.length}장 검토 · 새 실기 예상문제 ${driveReviewedQuestions.length}개</strong>
    <p>등록·입찰·원가계산·계약·MAS·리스크·법제도 문제를 단원별로 연결했습니다. 개념 → 답안 작성 순서 → 단계별 풀이 → 자가점검으로 공부하세요. 기본이론 ${Object.keys(driveLearning).length}개 단원에도 보충 설명과 예제를 더했습니다.</p>
    <p>아래 <b>자료 묶음 → 드라이브 추가분</b>을 선택하면 이번 문제만 볼 수 있습니다. 문제 제목·사진명·원문 번호로 검색할 수 있습니다.</p>
    <details class="pc-case"><summary>사진별 검토 범위와 반영 문제 확인 · ${driveReviewDate}</summary><div>
      <p>중복 촬영과 문제·해설의 이어지는 페이지를 연결했습니다. 옆 페이지의 잘린 부분은 확인 범위에 포함하지 않았으며, 보완한 설명과 현행 기준은 각 문제의 검토란에 표시합니다.</p>
      <ol class="pq-source-audit">${driveSources.map(source=>`<li><strong><a href="https://drive.google.com/file/d/${esc(source.fileId)}/view" target="_blank" rel="noopener noreferrer">${esc(source.filename)} ↗</a> · ${esc(source.page)}</strong><p>${esc(source.status)} · ${esc((source.topics||[]).join(' · '))}</p><p>${(source.questionIds||[]).map(id=>{const q=driveReviewedQuestions.find(q=>q.id===id);return q?`<a href="#practice/practical/review/${esc(id)}">${esc(q.title)} →</a>`:'';}).join(' / ')}</p></li>`).join('')}</ol>
    </div></details>
  </aside>`;
}
