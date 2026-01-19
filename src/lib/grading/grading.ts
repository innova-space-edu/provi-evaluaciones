export function pctToGrade(pct: number): number {
  // pct: 0..100
  const p = Math.max(0, Math.min(100, pct));

  // regla: 60% => 4.0
  // 0% => 1.0
  // 100% => 7.0
  if (p <= 60) {
    // 1.0 a 4.0 (hasta 60%)
    const g = 1 + (p / 60) * 3; // 1 + 3 = 4
    return round1(g);
  } else {
    // 4.0 a 7.0 (60% a 100%)
    const g = 4 + ((p - 60) / 40) * 3; // 4 + 3 = 7
    return round1(g);
  }
}

function round1(x: number) {
  return Math.round(x * 10) / 10;
}
