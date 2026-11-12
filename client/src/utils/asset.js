// 깃허브 Pages처럼 저장소 이름 아래 경로에서 열려도 사진과 로고 주소가 맞도록 기본 경로를 붙인다.
export const asset = (p) => (import.meta.env.BASE_URL || '/') + String(p).replace(/^\//, '')
