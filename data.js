import { chapterLessons } from './chapter-content.js';
import { lessonGuides } from './lesson-guides.js';
import { overviewCoreQuestions } from './overview-questions.js';
import { principlesCoreQuestions } from './principles-questions.js';
import { chapter02AttachmentQuestions } from './chapter02-questions.js';
import { chapter03Questions } from './chapter03-questions.js';
import { chapter04Questions } from './chapter04-questions.js';
import { bidExecutionQuestions } from './bid-execution-questions.js';
import { law1FollowupQuestions } from './law1-followup.js';
import { law2FollowupQuestions } from './law2-followup.js';
import { planningFollowupQuestions } from './planning-followup.js';
import { proposalFollowupQuestions } from './proposal-followup.js';
import { bidExecutionFollowupQuestions } from './bid-execution-followup-questions.js';
import { awardContractQuestions } from './award-contract-questions.js';
import { contractManagementQuestions } from './contract-management-questions.js';
import { contractChangeQuestions } from './contract-change-questions.js';
import { goodsContractQuestions } from './goods-contract-questions.js';
import { constructionQuestions } from './construction-questions.js';

export const sources = {
  "subjects": "https://www.law.go.kr/flDownload.do?bylClsCd=110201&flSeq=155928887&gubun=",
  "exam": "https://www.korea.kr/multi/visualNewsView.do?newsId=148971361",
  "law": "https://www.law.go.kr/법령/국가를당사자로하는계약에관한법률",
  "local": "https://www.law.go.kr/법령/지방자치단체를당사자로하는계약에관한법률",
  "pps": "https://www.pps.go.kr/hrd/home/UserBoardActionUpdate.do?BO_CODE=REFERENCE_ROOM&BO_IDX=6581&CHILD_MENU=MENU209&ROOT_MENU=MENU002&method=detail&pageLine=10&pageNo=2&searchText=",
  "qnet": "https://www.q-net.or.kr/",
  "decree": "https://www.law.go.kr/법령/국가를당사자로하는계약에관한법률시행령",
  "civil": "https://www.law.go.kr/법령/민법",
  "sme": "https://www.law.go.kr/법령/중소기업제품구매촉진및판로지원에관한법률",
  "green": "https://www.law.go.kr/법령/녹색제품구매촉진에관한법률",
  "innovation": "https://ppi.g2b.go.kr/",
  "electronic": "https://www.law.go.kr/법령/전자조달의이용및촉진에관한법률",
  "methods": "https://pps.go.kr/kor/content.do?key=00178",
  "advance": "https://www.law.go.kr/행정규칙/(계약예규)정부입찰·계약집행기준",
  "mas": "https://www.pps.go.kr/kor/content.do?key=00183",
  "procurement": "https://www.law.go.kr/법령/조달사업에관한법률",
  "conflict": "https://www.law.go.kr/법령/공직자의이해충돌방지법",
  "services": "https://www.pps.go.kr/kor/content.do?key=00719",
  "serviceProcess": "https://www.pps.go.kr/kor/content.do?key=00726",
  "contractTypes": "https://www.pps.go.kr/kor/content.do?key=00722",
  "construction": "https://www.law.go.kr/행정규칙/(계약예규)공사계약일반조건",
  "constructionTypes": "https://www.pps.go.kr/kor/content.do?key=00010",
  "subcontract": "https://www.law.go.kr/법령/건설산업기본법"
};
export const subjects = [
  {
    "id": 1,
    "title": "공공조달과 법제도 이해",
    "short": "법제도 이해",
    "desc": "조달의 원칙부터 법령 체계까지, 탄탄한 첫걸음",
    "icon": "building",
    "color": "green",
    "tags": [
      "조달의 이해",
      "법령 체계"
    ]
  },
  {
    "id": 2,
    "title": "공공조달 계획 수립 및 분석",
    "short": "계획 수립 및 분석",
    "desc": "수요 분석과 조달계획으로 실무의 흐름 잡기",
    "icon": "chart",
    "color": "blue",
    "tags": [
      "수요 분석",
      "입찰·낙찰"
    ]
  },
  {
    "id": 3,
    "title": "공공계약관리",
    "short": "공공계약관리",
    "desc": "계약 체결부터 이행과 종결까지 한눈에",
    "icon": "file",
    "color": "orange",
    "tags": [
      "계약 체결",
      "이행 관리"
    ]
  }
];
export const lessons = chapterLessons.map(lesson => ({...lesson, guide:lessonGuides[lesson.id]}));

// IDs 1–30 retain their text, answers and explanations; only their theory links change.
export const questions = [
  {
    "id": 1,
    "lesson": "1-02",
    "subject": 1,
    "text": "공공조달의 경제성을 가장 적절하게 설명한 것은?",
    "options": [
      "구매가격이 가장 낮은 물품을 무조건 선택한다",
      "필요한 품질과 총비용을 함께 고려한다",
      "납기가 가장 빠르면 다른 조건은 보지 않는다",
      "기존 거래 업체와만 계약한다"
    ],
    "answer": 1,
    "explanation": "경제성은 필요한 품질과 성능을 충족하면서 자원을 합리적으로 사용하는 것입니다. 구매가격만 낮다고 경제적이라고 단정할 수 없습니다.",
    "difficulty": "기본"
  },
  {
    "id": 2,
    "lesson": "1-02",
    "subject": 1,
    "text": "공공조달의 투명성을 높이는 행동은?",
    "options": [
      "평가 기준을 담당자만 알고 있다",
      "계약 과정을 구두로만 처리한다",
      "절차와 판단 근거를 기록한다",
      "평가 결과에 맞춰 기준을 바꾼다"
    ],
    "answer": 2,
    "explanation": "절차와 의사결정 근거를 기록하면 검증 가능성이 높아집니다. 비공개 기준이나 사후 기준 변경은 투명성과 공정성을 훼손합니다.",
    "difficulty": "기본"
  },
  {
    "id": 3,
    "lesson": "1-05",
    "subject": 1,
    "text": "적용할 계약 법령을 검토할 때 가장 먼저 확인할 사항은?",
    "options": [
      "계약 담당자의 근무 연수",
      "계약 상대자의 사무실 크기",
      "계약서의 페이지 수",
      "계약 당사자인 발주기관의 성격"
    ],
    "answer": 3,
    "explanation": "국가, 지방자치단체, 공공기관 등 계약 주체에 따라 적용 체계가 달라지므로 발주기관의 성격을 먼저 확인합니다.",
    "difficulty": "응용"
  },
  {
    "id": 4,
    "lesson": "1-05",
    "subject": 1,
    "text": "지방자치단체가 당사자인 계약에서 우선 검토할 법률은?",
    "options": [
      "지방자치단체를 당사자로 하는 계약에 관한 법률",
      "모든 경우 국가계약법만 적용",
      "담당자가 임의로 정한 내부 메모",
      "어떠한 법률도 적용되지 않음"
    ],
    "answer": 0,
    "explanation": "지방자치단체의 계약은 지방계약법 체계를 우선 검토합니다. 구체적인 계약에는 관련 특별법과 규정도 함께 확인합니다.",
    "difficulty": "기본"
  },
  {
    "id": 5,
    "lesson": "1-02",
    "subject": 1,
    "text": "수의계약에 대한 설명으로 적절한 것은?",
    "options": [
      "담당자가 편하면 언제나 선택한다",
      "법적 사유와 적용 요건을 확인해야 한다",
      "가격의 적정성을 검토할 필요가 없다",
      "계약 내용을 기록하지 않아도 된다"
    ],
    "answer": 1,
    "explanation": "수의계약은 법령에서 인정하는 사유와 요건에 따라 검토해야 합니다. 편의만으로 선택할 수 없으며 가격과 관련 절차도 확인해야 합니다.",
    "difficulty": "기본"
  },
  {
    "id": 6,
    "lesson": "1-02",
    "subject": 1,
    "text": "일반경쟁의 취지에 가장 부합하는 것은?",
    "options": [
      "임의로 한 업체에만 기회를 준다",
      "모든 참가 자격을 없앤다",
      "적격한 공급자에게 폭넓은 경쟁 기회를 제공한다",
      "공고 없이 계약을 끝낸다"
    ],
    "answer": 2,
    "explanation": "일반경쟁은 법령과 공고상 자격을 갖춘 공급자에게 경쟁 기회를 넓게 제공하는 방식입니다. 자격 요건 자체가 없는 것은 아닙니다.",
    "difficulty": "기본"
  },
  {
    "id": 7,
    "lesson": "1-03",
    "subject": 1,
    "text": "전자조달시스템 이용에 대한 설명으로 옳은 것은?",
    "options": [
      "시스템을 이용하면 모든 계약이 자동으로 적법하다",
      "입찰 마감 시간을 확인할 필요가 없다",
      "참가 자격을 검토할 필요가 없다",
      "절차의 전자화를 지원하되 법적 요건은 별도로 확인해야 한다"
    ],
    "answer": 3,
    "explanation": "전자조달시스템은 업무 처리와 기록 관리를 지원하는 도구입니다. 법적 요건, 공고 내용과 제출 기한 등은 이용자가 확인해야 합니다.",
    "difficulty": "응용"
  },
  {
    "id": 8,
    "lesson": "1-06",
    "subject": 1,
    "text": "공정한 조달 업무 수행에 가장 적절한 행동은?",
    "options": [
      "이해충돌 가능성을 확인하고 관련 절차에 따라 관리한다",
      "친분이 있는 업체에 비공개 평가정보를 제공한다",
      "특정 업체만 유리하도록 기준을 변경한다",
      "중요한 판단 근거를 남기지 않는다"
    ],
    "answer": 0,
    "explanation": "사적 이해관계가 업무 판단에 영향을 미치지 않도록 관리하고 근거를 기록하는 것은 청렴하고 공정한 조달의 기초입니다.",
    "difficulty": "기본"
  },
  {
    "id": 9,
    "lesson": "2-01",
    "subject": 2,
    "text": "조달계획을 수립할 때 함께 검토할 요소의 조합은?",
    "options": [
      "수요·예산·시장·일정",
      "담당자 선호·업체 친분",
      "제품 색상·홍보 문구만",
      "구매가격만"
    ],
    "answer": 0,
    "explanation": "실행 가능한 계획에는 수요와 예산뿐 아니라 시장의 공급 가능성과 조달 일정에 대한 검토가 필요합니다.",
    "difficulty": "기본"
  },
  {
    "id": 10,
    "lesson": "2-01",
    "subject": 2,
    "text": "행사에서 사용할 장비의 발주 일정을 정하는 적절한 방법은?",
    "options": [
      "행사 당일 입찰공고를 낸다",
      "납품 기간만 고려한다",
      "사용일에서 검사·납품·계약·입찰 기간을 역산한다",
      "지난해 날짜를 검토 없이 복사한다"
    ],
    "answer": 2,
    "explanation": "실제 사용일까지 모든 절차가 완료되어야 합니다. 필요한 처리 기간과 지연 위험을 고려해 역산하는 것이 합리적입니다.",
    "difficulty": "기본"
  },
  {
    "id": 11,
    "lesson": "2-01",
    "subject": 2,
    "text": "동일 성능의 제품을 5년 사용한다. A는 취득비 100만 원·연 운영비 20만 원, B는 취득비 130만 원·연 운영비 10만 원이다. 다른 비용과 할인율을 제외한 비교로 옳은 것은?",
    "options": [
      "A가 30만 원 저렴하다",
      "두 제품의 총비용은 같다",
      "A가 20만 원 저렴하다",
      "B가 20만 원 저렴하다"
    ],
    "answer": 3,
    "explanation": "A는 100 + 20×5 = 200만 원, B는 130 + 10×5 = 180만 원입니다. B의 단순 총비용이 20만 원 낮습니다.",
    "difficulty": "응용"
  },
  {
    "id": 12,
    "lesson": "2-01",
    "subject": 2,
    "text": "시장조사의 목적으로 가장 적절한 것은?",
    "options": [
      "특정 업체의 주장만 확인한다",
      "공급 능력·가격·기술 수준을 파악한다",
      "경쟁을 없앤다",
      "이행 확인을 생략한다"
    ],
    "answer": 1,
    "explanation": "시장조사는 합리적인 요구사항, 가격과 일정의 기초를 마련합니다. 다양한 정보를 비교하고 공급 가능성을 검토합니다.",
    "difficulty": "기본"
  },
  {
    "id": 13,
    "lesson": "2-02",
    "subject": 2,
    "text": "규격서 작성 방법으로 가장 적절한 것은?",
    "options": [
      "좋은 제품이라는 표현만 쓴다",
      "불필요한 특정 상표만 허용한다",
      "필요한 성능과 검사 기준을 명확히 쓴다",
      "납기와 수량을 생략한다"
    ],
    "answer": 2,
    "explanation": "명확한 성능·품질·수량·검사 기준은 공정한 경쟁과 객관적인 이행 확인을 돕습니다. 모호하거나 불필요하게 제한적인 조건을 피해야 합니다.",
    "difficulty": "기본"
  },
  {
    "id": 14,
    "lesson": "2-02",
    "subject": 2,
    "text": "제안요청서의 요구사항과 평가 항목의 관계로 옳은 것은?",
    "options": [
      "서로 일관되게 연결되어야 한다",
      "서로 무관해야 한다",
      "평가가 끝난 뒤 요구사항을 만든다",
      "업체마다 비공개로 다르게 적용한다"
    ],
    "answer": 0,
    "explanation": "사업 목적, 요구사항, 평가 항목과 최종 검수 기준이 연결되어야 필요한 결과를 일관되게 선정하고 확인할 수 있습니다.",
    "difficulty": "기본"
  },
  {
    "id": 15,
    "lesson": "2-04",
    "subject": 2,
    "text": "입찰 평가의 공정성을 지키는 방법은?",
    "options": [
      "제출 이후 특정 업체에 맞춰 기준을 바꾼다",
      "사전에 정한 평가 기준을 일관되게 적용한다",
      "가격 외 요소는 어떤 경우에도 보지 않는다",
      "근거 없이 평가 점수를 정한다"
    ],
    "answer": 1,
    "explanation": "평가 기준의 예측 가능성과 일관된 적용이 중요합니다. 계약 특성과 정해진 방식에 따라 가격과 비가격 요소를 평가할 수 있습니다.",
    "difficulty": "응용"
  },
  {
    "id": 16,
    "lesson": "2-05",
    "subject": 2,
    "text": "낙찰자 결정과 계약 체결의 관계로 적절한 것은?",
    "options": [
      "항상 같은 개념이다",
      "낙찰되면 계약조건 확인은 필요 없다",
      "계약 체결이 항상 공고보다 먼저다",
      "상대자 선정과 권리·의무 확정은 구별되는 단계다"
    ],
    "answer": 3,
    "explanation": "낙찰은 상대자 선정 단계이고 계약 체결은 이행 조건과 권리·의무를 확정하는 단계입니다. 필요한 서류와 조건을 확인해야 합니다.",
    "difficulty": "기본"
  },
  {
    "id": 17,
    "lesson": "3-01",
    "subject": 3,
    "text": "계약문서 검토에 관한 설명으로 옳은 것은?",
    "options": [
      "계약금액만 확인하면 된다",
      "특수조건은 언제나 상위 법령보다 우선한다",
      "규격서·과업내용서·계약조건을 함께 확인한다",
      "중요한 변경은 구두로만 처리한다"
    ],
    "answer": 2,
    "explanation": "계약서와 함께 계약 내용을 구성하는 문서들을 종합적으로 검토해야 범위, 품질, 기한과 책임을 정확하게 이해할 수 있습니다.",
    "difficulty": "기본"
  },
  {
    "id": 18,
    "lesson": "3-02",
    "subject": 3,
    "text": "중요한 계약 변경 내용을 문서로 관리하는 주된 이유는?",
    "options": [
      "변경 근거와 합의를 명확히 하여 분쟁을 줄이기 위해",
      "모든 법적 검토를 생략하기 위해",
      "검사 절차를 없애기 위해",
      "계약 상대자의 책임을 무조건 면제하기 위해"
    ],
    "answer": 0,
    "explanation": "문서화는 변경 사유, 승인과 합의 내용을 명확히 하여 이행 과정의 해석 차이와 분쟁을 줄입니다.",
    "difficulty": "기본"
  },
  {
    "id": 19,
    "lesson": "3-03",
    "subject": 3,
    "text": "물품이 납품 장소에 도착했을 때 적절한 조치는?",
    "options": [
      "도착했으므로 모든 품질 요건을 충족했다고 본다",
      "계약 규격과 성능에 부합하는지 확인한다",
      "계약문서를 폐기한다",
      "수량과 상태는 확인하지 않는다"
    ],
    "answer": 1,
    "explanation": "물품의 도착 사실과 계약 적합성은 다릅니다. 정해진 검사·검수 절차에 따라 수량, 규격, 성능 등을 확인합니다.",
    "difficulty": "응용"
  },
  {
    "id": 20,
    "lesson": "3-01",
    "subject": 3,
    "text": "이행 관리의 적절한 방법은?",
    "options": [
      "최종 납기까지 진행 상황을 확인하지 않는다",
      "품질 문제가 있어도 기록하지 않는다",
      "계약상 일정·산출물과 실제 진행을 비교한다",
      "담당자의 기억만으로 관리한다"
    ],
    "answer": 2,
    "explanation": "일정과 산출물을 실제 진행과 비교하면 문제를 조기에 발견하고 대응할 수 있습니다. 조치 내용도 기록해야 합니다.",
    "difficulty": "기본"
  },
  {
    "id": 21,
    "lesson": "3-02",
    "subject": 3,
    "text": "계약금액 변경 요청을 받았을 때 우선할 행동은?",
    "options": [
      "요청액을 무조건 승인한다",
      "모든 변경을 이유 없이 거부한다",
      "계약서를 소급하여 임의 수정한다",
      "변경 사유·규정상 근거·영향을 검토한다"
    ],
    "answer": 3,
    "explanation": "변경의 가능 여부는 법령과 계약상 요건에 따라 판단합니다. 사유와 비용·일정 영향을 검토하고 필요한 승인과 문서화 절차를 거칩니다.",
    "difficulty": "기본"
  },
  {
    "id": 22,
    "lesson": "3-02",
    "subject": 3,
    "text": "납품 지연이 발생했을 때 적절한 접근은?",
    "options": [
      "지연 원인과 귀책 여부, 기간 연장 사유를 검토한다",
      "모든 경우 자동으로 동일한 책임을 부과한다",
      "지연 사실을 기록하지 않는다",
      "구두 합의만으로 계약을 종료한다"
    ],
    "answer": 0,
    "explanation": "지연의 원인과 책임, 정당한 기간 연장 사유를 검토한 후 관련 규정과 계약에 따라 처리해야 합니다.",
    "difficulty": "기본"
  },
  {
    "id": 23,
    "lesson": "3-02",
    "subject": 3,
    "text": "계약 대금 지급 이후 사후 관리에 대한 설명으로 옳은 것은?",
    "options": [
      "모든 계약상 의무가 자동으로 소멸한다",
      "계약에서 정한 하자 보수 등 잔존 의무를 확인한다",
      "계약 기록을 즉시 모두 삭제한다",
      "품질 문제는 더 이상 검토할 수 없다"
    ],
    "answer": 1,
    "explanation": "대금 지급 이후에도 계약에서 정한 하자 보수나 비밀 유지 등 의무가 남을 수 있습니다. 관련 조건과 기간을 확인해야 합니다.",
    "difficulty": "응용"
  },
  {
    "id": 24,
    "lesson": "3-02",
    "subject": 3,
    "text": "계약 종결 후 개선점을 정리하는 목적은?",
    "options": [
      "평가 기준을 소급 변경하기 위해",
      "이미 지급한 금액을 임의 변경하기 위해",
      "모든 기록을 없애기 위해",
      "다음 조달의 계획과 요구사항을 개선하기 위해"
    ],
    "answer": 3,
    "explanation": "이행 과정에서 드러난 문제와 개선점을 축적하면 다음 조달의 규격, 일정과 위험 관리를 개선할 수 있습니다.",
    "difficulty": "기본"
  },
  {
    "id": 25,
    "lesson": "1-04",
    "subject": 1,
    "text": "중소기업·녹색·혁신조달을 검토하는 적절한 순서는?",
    "options": [
      "정책 목적만 보고 계약 절차를 생략한다",
      "기존 거래 업체의 설명만 믿는다",
      "정책 목적과 적용 대상·자격·절차를 함께 확인한다",
      "품질과 이행 가능성을 검토하지 않는다"
    ],
    "answer": 2,
    "explanation": "정책조달도 제도별 적용 대상, 자격·인증과 절차를 확인해야 합니다. 정책 목적이 있다는 이유만으로 경쟁이나 품질 검토가 생략되지 않습니다.",
    "difficulty": "기본"
  },
  {
    "id": 26,
    "lesson": "1-06",
    "subject": 1,
    "text": "계약의 효력과 이행을 구별한 설명으로 적절한 것은?",
    "options": [
      "유효한 계약에서 약속을 이행하지 않는 문제는 채무불이행으로 검토한다",
      "이행이 늦으면 계약은 항상 처음부터 무효다",
      "계약이 유효하면 대리권은 검토할 필요가 없다",
      "취소할 수 있는 계약은 취소 전부터 항상 효력이 없다"
    ],
    "answer": 0,
    "explanation": "계약의 무효·취소 등 효력 문제와 유효한 계약을 이행하지 않는 문제는 구별합니다. 단순한 이행 지연이 언제나 계약의 무효를 뜻하지는 않습니다.",
    "difficulty": "기본"
  },
  {
    "id": 27,
    "lesson": "2-01",
    "subject": 2,
    "text": "최근 3개월 수요가 90개·120개·150개일 때 3기간 단순 이동평균 예측값은?",
    "options": [
      "90개",
      "120개",
      "150개",
      "360개"
    ],
    "answer": 1,
    "explanation": "최근 세 기간의 수요를 더하여 기간 수로 나눕니다. (90 + 120 + 150) ÷ 3 = 120개입니다. 재고 등을 고려한 실제 발주 수량과는 구별합니다.",
    "difficulty": "계산"
  },
  {
    "id": 28,
    "lesson": "2-01",
    "subject": 2,
    "text": "부가가치세 10%가 포함된 과세 물품 금액이 1,100만 원일 때 공급가액은? (다른 조정 없음)",
    "options": [
      "990만 원",
      "1,100만 원",
      "100만 원",
      "1,000만 원"
    ],
    "answer": 3,
    "explanation": "공급가액은 1,100 ÷ 1.1 = 1,000만 원이고 부가가치세는 100만 원입니다. 포함 금액에서 10%를 그대로 빼는 방식은 맞지 않습니다.",
    "difficulty": "계산"
  },
  {
    "id": 29,
    "lesson": "3-01",
    "subject": 3,
    "text": "계약금액 1억 원, 선금 2,000만 원, 이번 기성대가 3,000만 원일 때 비례 정산 후 지급액은? (다른 정산·공제 없음)",
    "options": [
      "3,000만 원",
      "600만 원",
      "2,400만 원",
      "1,000만 원"
    ],
    "answer": 2,
    "explanation": "선금정산액은 2,000 × (3,000 ÷ 10,000) = 600만 원입니다. 이번 기성대가 3,000만 원에서 600만 원을 정산하므로 지급액은 2,400만 원입니다.",
    "difficulty": "계산"
  },
  {
    "id": 30,
    "lesson": "3-02",
    "subject": 3,
    "text": "산정 대상 금액 1,000만 원, 1일 요율 0.1%, 귀책 지체일수 5일일 때 지체상금은? (모두 학습용 가정)",
    "options": [
      "5만 원",
      "50만 원",
      "5,000원",
      "500만 원"
    ],
    "answer": 0,
    "explanation": "1,000만 원 × 0.001 × 5 = 5만 원입니다. 0.1%를 0.01로 대입하지 않도록 주의하세요. 문제의 요율은 실제 계약에 공통 적용되는 법정 요율이 아닙니다.",
    "difficulty": "계산"
  },
  {
    "id": 31,
    "lesson": "1-01",
    "subject": 1,
    "text": "공공조달의 범위에 대한 설명으로 적절한 것은?",
    "options": [
      "입찰서 제출 단계만 포함한다",
      "계약서 작성 단계만 포함한다",
      "필요한 수요의 파악부터 계약 이행과 사후관리까지 연결한다",
      "대금 지급이 끝나면 기록 관리가 필요 없다"
    ],
    "answer": 2,
    "explanation": "공공조달은 수요·계획·상대자 선정·계약·이행·사후관리를 연결하는 활동입니다. 입찰이나 계약서 작성만으로 조달의 전체 범위를 설명할 수 없습니다.",
    "difficulty": "기본"
  },
  {
    "id": 32,
    "lesson": "2-03",
    "subject": 2,
    "text": "공고문과 첨부 문서의 제출 기한이 다를 때 적절한 처리는?",
    "options": [
      "문의한 업체에만 구두로 알려준다",
      "담당자 개인 메모만 고친다",
      "업체마다 원하는 기한을 적용한다",
      "불일치를 확인하고 필요한 공식 정정 절차와 정보 제공을 검토한다"
    ],
    "answer": 3,
    "explanation": "공고 문서의 불일치는 정식 절차에 따라 처리하고 참가자에게 일관된 정보를 제공해야 합니다. 일부 업체에만 구두로 설명하는 것으로 해결되었다고 볼 수 없습니다.",
    "difficulty": "기본"
  },
  {
    "id": 33,
    "lesson": "3-04",
    "subject": 3,
    "text": "용역 완료 검사에서 가장 적절한 판단 기준은?",
    "options": [
      "보고서의 분량만 확인한다",
      "계약한 과업·산출물·품질과 인계 조건의 충족 여부를 확인한다",
      "업체가 완료했다고 말하면 인정한다",
      "계약에 없던 추가 기능을 무조건 무상으로 요구한다"
    ],
    "answer": 1,
    "explanation": "용역은 계약한 범위와 산출물, 품질 및 인계 조건을 기준으로 이행을 확인합니다. 분량만으로 완료를 인정하거나 새 과업을 모두 무상 보완으로 처리하지 않습니다.",
    "difficulty": "기본"
  },
  {
    "id": 34,
    "lesson": "3-05",
    "subject": 3,
    "text": "MAS에 등록된 물품을 구매할 때 적절한 행동은?",
    "options": [
      "등록되어 있으면 구매 규모와 관계없이 바로 주문한다",
      "2단계경쟁을 피하려고 수량을 나눈다",
      "실제 구매 조건과 2단계경쟁 대상 여부 등을 확인한다",
      "납품 검사는 필요 없다"
    ],
    "answer": 2,
    "explanation": "MAS 계약 체결과 수요기관의 구매 절차는 구분됩니다. 구매 조건과 2단계경쟁 적용 여부를 확인하고 납품요구·검사까지 연결해야 합니다.",
    "difficulty": "기본"
  },
  {
    "id": 35,
    "lesson": "3-06",
    "subject": 3,
    "text": "공사 현장이 설계도면과 다를 때 적절한 대응은?",
    "options": [
      "현장 차이와 영향을 기록하고 필요한 변경·승인 절차를 검토한다",
      "구두 요청만으로 모든 변경금액을 지급한다",
      "현장 기록을 남기지 않는다",
      "업체가 임의로 시공한 뒤 도면을 맞춘다"
    ],
    "answer": 0,
    "explanation": "설계도서와 현장의 차이를 기록하고 물량·비용·기간·안전 등에 미치는 영향을 검토해야 합니다. 변경 근거와 승인, 수정 문서를 이행 기록에 연결합니다.",
    "difficulty": "기본"
  },
  {
    "id": 36,
    "lesson": "3-07",
    "subject": 3,
    "text": "공사 하도급에 대한 설명으로 적절한 것은?",
    "options": [
      "하도급을 하면 원계약 상대자의 책임이 모두 사라진다",
      "하도급업체의 자격은 볼 필요 없다",
      "하도급 계약서가 있으면 승인·통보 요건은 무시한다",
      "하도급 요건과 원계약 상대자의 이행 책임을 각각 확인한다"
    ],
    "answer": 3,
    "explanation": "하도급을 하더라도 원계약 상대자의 책임이 자동으로 없어지지 않습니다. 허용 범위·자격·승인 또는 통보·대금 의무와 원계약 책임을 구분하여 확인해야 합니다.",
    "difficulty": "기본"
  },
  {
    "id": 37,
    "lesson": "1-01",
    "subject": 1,
    "core": true,
    "origin": "사용자 제공 문항 · 해설 보강",
    "text": "다음 중 공공조달의 현대적(광의) 정의에 가장 부합하는 사례는?",
    "options": [
      "A 구청은 사무용품을 가장 낮은 가격을 제시한 업체로부터 구매했다.",
      "B 공사는 사회적 기업이 생산한 친환경 재생용지를 우선구매하여 사회적 가치 실현에 기여했다.",
      "C 정부 부처는 작년에 구매했던 동일한 사양의 컴퓨터를 수의계약으로 재구매했다.",
      "D 지자체는 지역 업체 보호를 위해 입찰참가자격을 해당 지역 내 업체로만 제한했다."
    ],
    "answer": 1,
    "explanation": "정답은 ②번입니다. 현대적(광의) 공공조달은 필요한 물품·용역·공사를 확보하는 기능에 더해, 공공의 구매력을 환경 보호·사회적 가치·혁신 등의 정책목표 실현에 활용하는 활동입니다. ②는 재생용지 구매를 통해 환경적 가치와 사회적 가치를 함께 추구하므로 가장 적절합니다.",
    "difficulty": "핵심",
    "details": {
      "conceptTitle": "개념 이해 · 협의와 광의",
      "concept": "이 문제는 조달의 목적이 얼마나 넓은지를 묻습니다. 전통적(협의) 관점은 필요한 물품·용역·공사를 경제적이고 효율적으로 확보하는 기능에 초점을 둡니다. 현대적(광의) 관점은 이 기능을 포함하면서 환경·고용·사회적 가치·혁신 등 공공정책의 성과까지 함께 고려합니다. 단순히 조달 절차가 길다는 뜻은 아닙니다.",
      "steps": [["핵심 표현 찾기", "현대적·광의는 구매를 통한 정책목표 실현까지 포함한다는 뜻입니다."], ["보기의 목적 비교", "가격이나 반복 구매 방식보다 사회·환경적 가치가 명시되어 있는지 확인합니다."], ["가장 적절한 사례 선택", "재생용지와 사회적 기업 구매를 함께 제시한 ②가 가장 직접적으로 부합합니다."]],
      "choices": [
        {"title": "가격 중심의 구매", "reason": "가장 낮은 가격으로 사무용품을 확보하는 경제성에 초점이 있습니다. 구매 자체가 잘못이라는 뜻은 아니지만, 보기에는 사회·환경 등 정책목표가 드러나지 않아 광의의 정의를 가장 잘 보여주지는 못합니다."},
        {"title": "정답 · 구매와 정책목표의 결합", "reason": "재생용지는 자원 절약 등 환경적 가치와 연결되고, 사회적 기업의 제품 구매는 사회적 목적을 가진 기업의 판로를 지원합니다. 물품 확보와 사회·환경적 가치 실현이 함께 제시되어 있습니다."},
        {"title": "반복 구매와 계약 방식", "reason": "같은 사양을 다시 구매했다는 사실과 수의계약을 했다는 사실만으로는 정책목표 실현을 설명할 수 없습니다. 동일 사양의 재구매라는 이유만으로 수의계약이 허용되는 것도 아니므로 적용 가능한 사유와 절차는 별도로 확인합니다."},
        {"title": "지역 제한의 근거는 별도 판단", "reason": "지역제한경쟁입찰은 법령상 요건에 따라 허용될 수 있으므로 이 보기만으로 무조건 위법이라고 단정할 수는 없습니다. 지역경제 지원도 정책목표가 될 수 있지만, 단순한 지역 업체 보호 목적의 제한만으로 적정한 정책조달이라고 판단하기는 어렵습니다. 법적 근거·적용 요건·경쟁의 공정성을 함께 보아야 하며, 사회·환경적 성과를 직접 제시한 ②가 이 문제의 가장 적절한 답입니다."}
      ],
      "example": {
        "title": "시립도서관의 안내문용 종이 구매",
        "situation": "시립도서관이 안내문을 인쇄할 종이를 구매한다고 가정해 보세요. 필요한 품질과 합리적인 가격을 확인하고 적법한 구매 절차에 따라, 취약계층의 일자리를 제공하는 사회적 기업이 만든 친환경 재생용지를 선택합니다.",
        "effects": [
          "물품 확보: 도서관 운영에 필요한 종이를 공급받습니다.",
          "환경적 가치: 재생 원료 사용을 통해 자원 절약에 기여합니다.",
          "사회적 가치: 이 사례의 사회적 기업에 판로를 제공하여 취약계층 일자리 유지에 도움을 줍니다."
        ]
      },
      "takeaway": "광의의 공공조달 = 필요한 것의 효율적 확보 + 공공 구매력을 통한 정책목표 실현",
      "caution": "사회적 가치를 고려해도 품질·가격·공정성·적법한 절차가 중요합니다. ‘사회적 기업이므로 무조건 구매한다’거나 ‘친환경이라는 이유로 어떤 가격이든 허용한다’는 뜻은 아닙니다.",
      "sources": [
        {"title": "조달청 업무계획 · 공공조달을 통한 사회적 가치 구현", "url": "https://pps.go.kr/kor/content.do?key=00647"},
        {"title": "조달청 계약방법 · 제한경쟁과 수의계약", "url": "https://www.pps.go.kr/kor/content.do?key=00723"}
      ]
    }
  },
  ...overviewCoreQuestions,
  ...principlesCoreQuestions,
  ...chapter02AttachmentQuestions,
  ...chapter03Questions,
  ...chapter04Questions,
  ...bidExecutionQuestions,
  ...law1FollowupQuestions,
  ...law2FollowupQuestions,
  ...planningFollowupQuestions,
  ...proposalFollowupQuestions,
  ...bidExecutionFollowupQuestions,
  ...awardContractQuestions,
  ...contractManagementQuestions,
  ...contractChangeQuestions,
  ...goodsContractQuestions,
  ...constructionQuestions
];
