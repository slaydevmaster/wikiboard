// 레벨/XP 계산 로직

// 레벨별 필요 누적 XP
const LEVEL_THRESHOLDS = [
  0, // Lv.1
  100, // Lv.2
  300, // Lv.3
  600, // Lv.4
  1000, // Lv.5
  1500, // Lv.6
  2200, // Lv.7
  3000, // Lv.8
  4000, // Lv.9
  5000, // Lv.10
] as const;

/** XP로 레벨 계산 */
export function calculateLevel(xp: number): number {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  return level;
}

/** XP 추가 후 레벨 재계산 */
export function addXpAndRecalculate(
  currentXp: number,
  xpAmount: number
): { newXp: number; newLevel: number } {
  const newXp = Math.max(0, currentXp + xpAmount);
  return { newXp, newLevel: calculateLevel(newXp) };
}

/** 다음 레벨까지 필요한 XP */
export function xpToNextLevel(xp: number): number | null {
  const level = calculateLevel(xp);
  if (level >= LEVEL_THRESHOLDS.length) return null;
  return LEVEL_THRESHOLDS[level] - xp;
}
