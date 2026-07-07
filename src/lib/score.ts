// Day Score — өдрийн нэгдсэн үнэлгээ (0-100).
// build хийсэн + хортоос зайлсхийсэн + mood + нойр + өдрийн ажил.

export type DayInputs = {
  buildDone: number; buildTotal: number;      // сайн зуршил
  breakSlipped: number; breakTotal: number;   // хорт зуршилд автсан
  mood: number | null;                         // 1-5
  sleep: number | null;                        // цаг
  tasksDone: number; tasksTotal: number;       // өдрийн ажил
};

export function dayScore(i: DayInputs): number {
  const parts: [number, number][] = []; // [утга 0-1, жин]

  if (i.buildTotal > 0) parts.push([i.buildDone / i.buildTotal, 35]);
  if (i.breakTotal > 0) parts.push([1 - i.breakSlipped / i.breakTotal, 30]); // автаагүй нь дээр
  if (i.mood != null) parts.push([i.mood / 5, 20]);
  if (i.sleep != null) parts.push([Math.max(0, 1 - Math.abs(7.5 - i.sleep) / 5), 15]);
  if (i.tasksTotal > 0) parts.push([i.tasksDone / i.tasksTotal, 15]);

  if (parts.length === 0) return 0;
  const wsum = parts.reduce((s, [, w]) => s + w, 0);
  const val = parts.reduce((s, [v, w]) => s + v * w, 0) / wsum;
  return Math.round(val * 100);
}

// Оноо → үг + өнгө + mascot
export function scoreVibe(s: number): { word: string; color: string; mascot: string } {
  if (s < 30) return { word: "Өмхий өдөр 💀", color: "#F2555A", mascot: "angry" };
  if (s < 50) return { word: "Сул өдөр", color: "#F2C14E", mascot: "shrug" };
  if (s < 70) return { word: "Дунд зэрэг", color: "#F2C14E", mascot: "cute" };
  if (s < 85) return { word: "Дажгүй өдөр 🔥", color: "#FF7A45", mascot: "grind" };
  return { word: "Дэлбэ өдөр 👑", color: "#5AD1A8", mascot: "boss" };
}
