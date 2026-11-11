// 함께하는 대학. logo 는 public/brand/symbols/<logo> (교표와 심볼마크)
export const partners = [
  { id: 'catholic', en: 'The Catholic University of Korea', ko: '가톨릭대학교', logo: 'catholic.svg', match: '가톨릭' },
  { id: 'konkuk', en: 'Konkuk University', ko: '건국대학교', logo: 'konkuk.svg', match: '건국' },
  { id: 'korea', en: 'Korea University', ko: '고려대학교 서울, 세종', logo: 'korea.svg', match: '고려' },
  { id: 'sogang', en: 'Sogang University', ko: '서강대학교', logo: 'sogang.png', match: '서강' },
  { id: 'swu', en: "Seoul Women's University", ko: '서울여자대학교', logo: 'seoulwu.svg', match: '서울여자' },
  { id: 'handong', en: 'Handong Global University', ko: '한동대학교', logo: 'handong.svg', match: '한동' },
  { id: 'hallym', en: 'Hallym University', ko: '한림대학교', logo: 'hallym.svg', match: '한림' },
  { id: 'hanshin', en: 'Hanshin University', ko: '한신대학교', logo: 'hanshin.svg', match: '한신' },
  { id: 'hanyang', en: 'Hanyang University', ko: '한양대학교 서울, ERICA', logo: 'hanyang.svg', match: '한양' },
]

export const partnerByUniv = (univ = '') => partners.find(p => univ.startsWith(p.match)) || null
