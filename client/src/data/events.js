// 2026년 UIA 활동 네 가지. 사실은 UIA 공식 사이트와 학생기획단 자료에서 확인한 내용만 적는다.
import { asset } from '../utils/asset'

export const stats = [
  { n: '9', en: 'Universities', ko: '참여 대학' },
  { n: '11', en: 'Campuses', ko: '참여 캠퍼스' },
  { n: '55+', en: 'Impactthon students', ko: '임팩톤 참여 학생' },
  { n: '2026', en: 'Official launch', ko: '정식 출범' },
]

export const events = [
  {
    id: 'chuncheon',
    en: 'Impactthon Chuncheon',
    ko: '임팩톤@춘천',
    dateEn: 'July 16 to 18, 2026',
    dateKo: '2026년 7월 16일부터 18일까지',
    placeEn: 'Chuncheon, Gangwon',
    placeKo: '강원 춘천',
    summaryEn: 'Fifty-five students from nine universities and eleven campuses gathered in Chuncheon for three days and two nights. They studied the city\'s population, space and tourism through field research and design thinking, and ten teams proposed solutions.',
    summaryKo: '9개 대학 11개 캠퍼스에서 선발된 학생 55명이 2박 3일간 춘천에 모여 인구, 공간, 관광 문제를 현장조사와 디자인씽킹으로 탐구하고 10개 조가 해결안을 제안했습니다.',
    cover: asset('/photos/cc-group-1.jpg'),
    coverAlt: 'Group photo at Impactthon Chuncheon',
    ratio: '2400/1363',
    subjectId: 'chuncheon',
  },
  {
    id: 'sagape',
    en: 'Social Value Festa',
    ko: '사회적가치 페스타',
    dateEn: 'September 22, 2026',
    dateKo: '2026년 9월 22일',
    placeEn: 'COEX, Seoul',
    placeKo: '서울 코엑스',
    summaryEn: 'At the 3rd Korea Social Value Festa, UIA ran a booth and held the session "UIA x Hanyang University Next Impact Forum".',
    summaryKo: '제3회 대한민국 사회적가치 페스타에서 UIA는 부스를 운영하고 UIA x 한양대학교 Next Impact Forum 세션을 열었습니다.',
    cover: asset('/photos/sg-booth-team.jpg'),
    coverAlt: 'Students at the UIA booth',
    ratio: '3/2',
    subjectId: 'sagape',
  },
  {
    id: 'gyeongju',
    en: 'World Gyeongju Forum',
    ko: '경주 포럼',
    dateEn: 'October 8 to 9, 2026',
    dateKo: '2026년 10월 8일부터 9일까지',
    placeEn: 'Gyeongju',
    placeKo: '경북 경주',
    summaryEn: 'At the World Gyeongju Forum, four universities ran sessions on culture, climate and local business, and students worked on the Hwangridan-gil local brand project.',
    summaryKo: '세계경주포럼에서 네 개 대학이 문화, 기후, 로컬 비즈니스를 주제로 세션을 열었고 학생들은 황리단길 로컬 브랜드 프로젝트를 진행했습니다.',
    cover: asset('/photos/gyeongju/forum/02.jpg'),
    coverAlt: 'Opening ceremony of the World Gyeongju Forum',
    ratio: '3/2',
    subjectId: 'gyeongju',
  },
  {
    id: 'kintex',
    en: 'UIA Special Hall',
    ko: 'UIA 특별관',
    dateEn: 'November 27 to 29, 2026',
    dateKo: '2026년 11월 27일부터 29일까지',
    placeEn: 'KINTEX, Goyang',
    placeKo: '고양 킨텍스',
    summaryEn: 'At the 8th Social Solidarity Economy Expo, student work, photos and voices from Impactthon Chuncheon, the Social Value Festa and the Gyeongju Forum come together in one hall.',
    summaryKo: '제8회 대한민국 사회연대경제박람회에서 춘천 임팩톤, 사회적가치 페스타, 경주 포럼의 학생 활동 결과와 사진, 목소리를 한자리에 모읍니다.',
    cover: null,
    coverAlt: '',
    ratio: '3/2',
    subjectId: null,
  },
]

export const eventById = (id) => events.find((e) => e.id === id) || null

// UIA 공식 사이트 공지사항
export const notices = [
  { date: '2026.05.02', title: '2026 임팩톤@춘천 참가자 모집 안내', url: 'https://www.uia-impact.org/news/2f9dd8f9-3f7b-4c02-83c1-0b27cd58bd54' },
  { date: '2026.04.10', title: 'UIA 정식 출범식 일정 안내', url: 'https://www.uia-impact.org/news/a7fe41e3-872c-44bc-93ef-5ae1d7548beb' },
  { date: '2025.12.19', title: '제1회 사회혁신 교육 공동 워크숍 결과 공유', url: 'https://www.uia-impact.org/news/51a776c5-6ebe-4e8a-add1-4c18c344390b' },
  { date: '2025.11.17', title: '대학 임팩트 얼라이언스 준비위원회 발족', url: 'https://www.uia-impact.org/news/99c7345b-7ef1-4704-8543-3efe771e1a66' },
]

// UIA 활동 영역. 공식 사이트 활동 소개
export const programs = [
  { en: 'Impactthon', ko: '임팩톤', bodyEn: 'Students from many universities meet in one place and build solutions to local problems through short, intensive collaboration.', bodyKo: '여러 대학의 학생이 한자리에 모여 짧은 기간 집중 협업으로 지역 문제의 해법을 만드는 UIA의 첫 공동 프로그램입니다.' },
  { en: 'Social innovation education', ko: '사회혁신 교육 협력', bodyEn: 'Universities share courses and extracurricular programs, and build education models and materials they can use together.', bodyKo: '각 대학의 교과목과 비교과 프로그램을 공유하고 함께 쓸 수 있는 교육 모델과 자료를 만듭니다.' },
  { en: 'Case sharing and research', ko: '사례 공유와 연구', bodyEn: 'Universities record and compare what they run, and check together what actually changes students.', bodyKo: '대학별 운영 경험을 기록하고 비교해 무엇이 실제로 학생을 변화시키는지 함께 확인합니다.' },
  { en: 'Impact careers', ko: '임팩트 진로 연결', bodyEn: 'Partner organizations connect students to social ventures, nonprofits and the public sector.', bodyKo: '학생들이 소셜벤처, 비영리, 공공 영역으로 이어질 수 있도록 파트너 기관과 연결합니다.' },
]
