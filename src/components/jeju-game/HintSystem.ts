export const HINTS = [
  "바닷가 쪽을 먼저 둘러보세요. 바람이 강한 곳 근처일 수도 있어요.",
  "오늘의 번호는 감귤밭 근처에 숨어 있어요.",
  "카페 거리의 돌담 또는 메뉴판 주변을 유심히 보세요.",
];

export function getHintByCount(count: number) {
  return HINTS[Math.min(count, HINTS.length - 1)];
}
