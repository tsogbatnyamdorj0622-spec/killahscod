// Local огноог YYYY-MM-DD болгож авах (UTC биш — local шөнө дундаас)
export function todayStr(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return todayStr(d);
}

// Сүүлийн n өдрийн огнооны массив (хуучнаас шинэ рүү)
export function lastNDays(n: number, end = todayStr()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(addDays(end, -i));
  return out;
}

const WD = ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"];
export function weekdayMn(dateStr: string): string {
  return WD[new Date(dateStr + "T00:00:00").getDay()];
}

export function shortLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
