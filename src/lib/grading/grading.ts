export function scoreToGradeChile60(
  score: number,
  maxScore: number
): number {
  if (maxScore <= 0) return 1.0;

  const p = score / maxScore; // 0..1
  const exigency = 0.60;

  let grade: number;

  if (p <= exigency) {
    // lineal entre 1.0 (0%) y 4.0 (60%)
    grade = 1.0 + (p / exigency) * (4.0 - 1.0);
  } else {
    // lineal entre 4.0 (60%) y 7.0 (100%)
    grade = 4.0 + ((p - exigency) / (1.0 - exigency)) * (7.0 - 4.0);
  }

  // redondeo a 1 decimal (típico)
  const rounded = Math.round(grade * 10) / 10;

  // acotar
  return Math.min(7.0, Math.max(1.0, rounded));
}
