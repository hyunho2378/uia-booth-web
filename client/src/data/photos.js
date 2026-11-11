// 실제 활동 사진. 파일은 public/photos. r 은 가로 세로 비율(레이아웃이 움직이지 않게 미리 잡는다).
// 출처: 학생기획단 구글 드라이브 공유 폴더(임팩톤@춘천 현장 기록 모음, 사회적가치 페스타, 경주국제포럼)
export const events = [
  { id: 'chuncheon', en: 'Impactthon Chuncheon', ko: '임팩톤@춘천' },
  { id: 'sagape', en: 'Social Value Festa', ko: '사회적가치 페스타' },
  { id: 'gyeongju', en: 'Gyeongju Forum', ko: '경주 포럼' },
]

const P = (event, file, r, en, ko) => ({ event, src: '/photos/' + file + '.jpg', r, en, ko })

export const photos = [
  P('chuncheon', 'cc-group-1', 2400 / 1363, 'Group photo of all participants', '참가자 단체사진'),
  P('chuncheon', 'cc-group-2', 2400 / 1376, 'Group photo with the program banner', '프로그램 현수막 앞 단체사진'),

  P('sagape', 'sg-booth-team', 3 / 2, 'Students running the UIA booth', 'UIA 부스를 운영한 학생들'),
  P('sagape', 'sg-booth-table', 3 / 2, 'Bomnae Run booth table', '봄내런 부스 테이블'),
  P('sagape', 'sg-booth-boards', 3 / 2, 'Before and after boards at the booth', '부스의 비포 앤 애프터 보드'),
  P('sagape', 'sg-booth-crowd', 3 / 2, 'Visitors gathering at the booth', '부스에 모인 방문객'),
  P('sagape', 'sg-booth-visit', 3 / 2, 'Booth activity with visitors', '방문객과 함께한 부스 체험'),
  P('sagape', 'sg-session-talk', 16 / 9, 'Session presentation', '세션 발표'),
  P('sagape', 'sg-session-speaker', 16 / 9, 'Presenter at the podium', '연단에서 발표하는 학생'),
  P('sagape', 'sg-session-stage', 16 / 9, 'Presentation with the festa backdrop', '페스타 배경막 앞 발표'),
  P('sagape', 'sg-session-slide', 16 / 9, 'Presentation slide on the screen', '화면에 띄운 발표 슬라이드'),
  P('sagape', 'sg-session-audience', 16 / 9, 'Audience of the session', '세션 청중'),
  P('sagape', 'sg-panel-1', 16 / 9, 'Panel discussion among university students', '대학생 패널 토론'),
  P('sagape', 'sg-panel-2', 16 / 9, 'Panel discussion on stage', '무대 위 패널 토론'),

  P('gyeongju', 'gj-entrance', 3 / 2, 'Entrance of the World Gyeongju Forum', '세계경주포럼 행사장 입구'),
  P('gyeongju', 'gj-hall', 3 / 2, 'Main hall of the forum', '포럼 행사장 전경'),
  P('gyeongju', 'gj-backdrop', 2 / 3, 'At the forum photo wall', '포럼 포토존에서'),
  P('gyeongju', 'gj-session-1', 3 / 2, 'Impactthon session in the meeting room', '회의실에서 열린 임팩톤 세션'),
  P('gyeongju', 'gj-session-2', 3 / 2, 'Students listening to the session', '세션을 듣는 학생들'),
  P('gyeongju', 'gj-session-3', 3 / 2, 'Session discussion', '세션 토론'),
  P('gyeongju', 'gj-talk-1', 3 / 2, 'Talk to the participants', '참가자에게 전하는 발표'),
  P('gyeongju', 'gj-talk-2', 3 / 2, 'Speaker with the audience', '청중 앞의 발표자'),
  P('gyeongju', 'gj-table', 3 / 2, 'Participants at the table', '테이블에 앉은 참가 학생'),
  P('gyeongju', 'gj-team-1', 3 / 2, 'Team discussion', '팀 토론'),
  P('gyeongju', 'gj-team-2', 3 / 2, 'Team working together', '함께 작업하는 팀'),
  P('gyeongju', 'gj-team-3', 3 / 2, 'Team meeting', '팀 회의'),
  P('gyeongju', 'gj-cafe-1', 3 / 2, 'Team work at the cafe', '카페에서 이어간 팀 작업'),
  P('gyeongju', 'gj-cafe-2', 3 / 2, 'Working on laptops together', '노트북으로 함께한 작업'),
  P('gyeongju', 'gj-cafe-3', 3 / 2, 'Discussion over the laptops', '노트북 앞 토론'),
  P('gyeongju', 'gj-cafe-4', 3 / 2, 'Planning the next step', '다음 단계를 정하는 팀'),
  P('gyeongju', 'gj-outside-1', 3 / 2, 'Participants gathering outside', '숙소 앞에 모인 참가자'),
  P('gyeongju', 'gj-outside-2', 3 / 2, 'Participants before leaving', '이동 전 모인 참가자'),
]

export const heroPhotos = {
  chuncheon: '/photos/cc-group-1.jpg',
  sagape: '/photos/sg-booth-team.jpg',
  gyeongju: '/photos/gj-backdrop.jpg',
}
