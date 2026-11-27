// 깃허브 Pages처럼 저장소 이름 아래 경로에서 열려도 사진과 로고 주소가 맞도록 기본 경로를 붙인다.
// 행사장 와이파이가 느려서 사진은 미리 만들어 둔 가벼운 webp를 쓴다(public 폴더의 jpg와 png 옆에 같은 이름으로 있음).
export const asset = (p) => (import.meta.env.BASE_URL || '/') + String(p).replace(/^\//, '').replace(/\.(jpe?g|png)$/i, '.webp')
