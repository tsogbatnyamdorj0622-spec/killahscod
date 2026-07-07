"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { lastNDays, shortLabel, todayStr, weekdayMn } from "@/lib/date";
import { Card, SectionTitle } from "./ui";

type DLog = { log_date: string; mood: number | null; sleep_hours: number | null; energy: number | null; note: string | null };
const MOODS = [
  { v: 1, e: "😩", l: "Хог" },
  { v: 2, e: "😕", l: "Дунд" },
  { v: 3, e: "😐", l: "Зүгээр" },
  { v: 4, e: "🙂", l: "Сайн" },
  { v: 5, e: "🔥", l: "Дэлбэ" },
];

export default function Mood() {
  const { userId } = useAuth();
  const [date, setDate] = useState(todayStr());
  const [logs, setLogs] = useState<Record<string, DLog>>({});
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  const cur = logs[date] ?? { log_date: date, mood: null, sleep_hours: null, energy: null, note: null };

  async function load() {
    const { data } = await supabase.from("daily_logs")
      .select("log_date,mood,sleep_hours,energy,note").gte("log_date", lastNDays(14)[0]);
    const map: Record<string, DLog> = {};
    (data ?? []).forEach((d: any) => (map[d.log_date] = d));
    setLogs(map); setLoaded(true);
  }
  useEffect(() => { if (userId) load(); }, [userId]);

  async function patch(p: Partial<DLog>) {
    if (!userId) return;
    const merged = { ...cur, ...p, log_date: date };
    setLogs((m) => ({ ...m, [date]: merged }));
    setSaved(false);
    await supabase.from("daily_logs").upsert(
      { user_id: userId, log_date: date, mood: merged.mood, sleep_hours: merged.sleep_hours, energy: merged.energy, note: merged.note },
      { onConflict: "user_id,log_date" }
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  if (!loaded) return <div className="h-40 rounded-2xl bg-panel animate-pulse" />;

  return (
    <div className="space-y-5 animate-rise">
      <header>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-bone">Mood & нойр</h1>
        <p className="text-fog text-sm">Юу мэдэрснээ бич. Дараа нь pattern гарч ирнэ.</p>
      </header>

      {/* огноо сонгогч */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {lastNDays(10).map((d) => (
          <button key={d} onClick={() => setDate(d)}
            className={`flex flex-col items-center min-w-[52px] rounded-xl px-2 py-2 border transition
              ${d === date ? "border-ember bg-ember/10 text-bone" : "border-line text-fog hover:border-fog"}`}>
            <span className="text-[10px]">{weekdayMn(d)}</span>
            <span className="text-sm font-semibold tnum">{new Date(d + "T00:00:00").getDate()}</span>
            {logs[d]?.mood && <span className="text-xs mt-0.5">{MOODS.find((m) => m.v === logs[d].mood)?.e}</span>}
          </button>
        ))}
      </div>

      <Card className="p-5">
        <SectionTitle right={saved ? <span className="text-[11px] text-mint">хадгалагдлаа ✓</span> : undefined}>
          Mood — {date === todayStr() ? "өнөөдөр" : shortLabel(date)}
        </SectionTitle>
        <div className="grid grid-cols-5 gap-2">
          {MOODS.map((m) => (
            <button key={m.v} onClick={() => patch({ mood: m.v })}
              className={`flex flex-col items-center gap-1 rounded-xl py-3 border transition
                ${cur.mood === m.v ? "border-mint bg-mint/10" : "border-line hover:border-fog"}`}>
              <span className="text-2xl">{m.e}</span>
              <span className="text-[10px] text-fog">{m.l}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <SectionTitle>Нойр (цаг)</SectionTitle>
          <div className="flex items-center gap-4">
            <input type="range" min={0} max={12} step={0.5} value={cur.sleep_hours ?? 7}
              onChange={(e) => patch({ sleep_hours: parseFloat(e.target.value) })}
              className="flex-1 accent-violet" />
            <span className="font-display text-2xl font-extrabold text-violet tnum w-16 text-right">{cur.sleep_hours ?? "—"}ц</span>
          </div>
          <div className="text-[11px] text-fog mt-2">Оптимум ~7.5 цаг.</div>
        </Card>

        <Card className="p-5">
          <SectionTitle>Энерги</SectionTitle>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button key={v} onClick={() => patch({ energy: v })}
                className={`flex-1 rounded-lg py-3 border font-display font-bold tnum transition
                  ${cur.energy === v ? "border-gold bg-gold/10 text-gold" : "border-line text-fog hover:border-fog"}`}>{v}</button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <SectionTitle>Тэмдэглэл</SectionTitle>
        <textarea value={cur.note ?? ""} onChange={(e) => setLogs((m) => ({ ...m, [date]: { ...cur, note: e.target.value } }))}
          onBlur={(e) => patch({ note: e.target.value })}
          placeholder="Юу болов? Юунд талархав? Юуг сайжруулах вэ?"
          rows={4}
          className="w-full rounded-lg bg-ink border border-line px-3 py-2.5 text-bone outline-none focus:border-ember resize-none text-sm" />
      </Card>
    </div>
  );
}
