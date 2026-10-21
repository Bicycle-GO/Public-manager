// Q-Net 공공조달관리사 종목정보 확인: 2026-09-26.
export const examSource = 'https://www.q-net.or.kr/crf005.do?gId=07&gSite=Q&id=crf00503s02&jmCd=9777&jmInfoDivCcd=B0';
export const mockFormats = {
  practice60: { label: '60문항 연습형', counts: [20, 20, 20], minutes: 90 },
  official80: { label: '80문항 실전형', counts: [30, 20, 30], minutes: 120 }
};

export function createMockExam(bank, formatId = 'practice60', random = Math.random) {
  const format = mockFormats[formatId];
  if (!format) throw new RangeError('알 수 없는 모의고사 유형입니다.');
  const unique = [...new Map(bank.map(q => [q.id, q])).values()];
  return format.counts.flatMap((count, index) => {
    const pool = unique.filter(q => q.subject === index + 1 && q.type !== 'ox' && q.options.length === 4);
    if (pool.length < count) throw new RangeError(`${index + 1}과목의 객관식 문항이 부족합니다.`);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, count);
  });
}

export function gradeMockExam(list, answers) {
  const scores = [1, 2, 3].map(subject => {
    const items = list.filter(q => q.subject === subject);
    const correct = items.filter(q => answers[q.id] === q.answer).length;
    return { subject, correct, total: items.length, score: items.length ? correct / items.length * 100 : 0 };
  });
  const average = scores.reduce((sum, item) => sum + item.score, 0) / scores.length;
  return { scores, average, passed: scores.every(item => item.score >= 40) && average >= 60 - 1e-9 };
}
