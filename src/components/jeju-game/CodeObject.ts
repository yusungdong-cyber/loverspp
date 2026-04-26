export type CodeArea = "beach" | "farm" | "village";

export type CodeSpot = {
  area: CodeArea;
  position: { x: number; y: number; z: number };
  label: string;
  hintLabel: string;
};

// map objects can be tweaked here.
export const CODE_SPOTS: CodeSpot[] = [
  {
    area: "beach",
    position: { x: -12, y: 1.6, z: -7 },
    label: "해변 안내판",
    hintLabel: "해변 안내판",
  },
  {
    area: "farm",
    position: { x: 2, y: 1.4, z: 10 },
    label: "감귤 상자",
    hintLabel: "감귤밭 상자",
  },
  {
    area: "village",
    position: { x: 14, y: 1.5, z: -1 },
    label: "카페 메뉴판",
    hintLabel: "카페 메뉴판",
  },
  {
    area: "village",
    position: { x: 8, y: 1.2, z: 6 },
    label: "돌하르방 받침대",
    hintLabel: "돌하르방 근처",
  },
];

export function selectCodeSpot(seed: number): CodeSpot {
  return CODE_SPOTS[seed % CODE_SPOTS.length];
}
