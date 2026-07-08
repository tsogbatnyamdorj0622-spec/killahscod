"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { lastNDays, shortLabel, todayStr, weekdayMn } from "@/lib/date";
import { dayScore, scoreVibe } from "@/lib/score";
import { Card } from "./ui";
import Mascot from "./Mascot";
import { COPY } from "@/lib/copy";

type DLog = { log_date: string; mood: number | null; sleep_hours: number | null; energy: number | null; note: string | null };
const MOODS = COPY.daily.moods;

export default function Daily() {
  const { userId } = useAuth();
  const [date, setDate] = useState(todayStr());
  const [logs, setLogs] = useState<Record<string, DLog>>({});
  const [habitScore, setHabitScore] = useState<{ bd: number; bt: number; ks: number; kt: number }>({ bd: 0, bt: 0, ks: 0, kt: 0 });
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  const cur = logs[date] ?? { log_date: date, mood: null, sleep_hours: null, energy: null, note: null };

  async function load() {
    const [dl, h, hl] = await Promise.all([
      supabase.from("daily_logs").select("log_date,mood,sleep_hours,energy,note").gte("log_date", lastNDays(14)[0]),
      supabase.from("habits").select("id,kind").eq("active", true),
      supabase.from("habit_logs").select("habit_id,done").eq("log_date", todayStr()),
    ]);
    const map: Record<string, DLog> = {};
    (dl.data ?? []).forEach((d: any) => (map[d.log_date] = d));
    setLogs(map);
    const habits = h.data ?? [];
    const bh = habits.filter((x: any) => x.kind === "build"), kh = habits.filter((x: any) => x.kind === "break");
    const today = hl.data ?? [];
    setHabitScore({
      bt: bh.length, kt: kh.length,
      bd: today.filter((l: any) => bh.some((x: any) => x.id === l.habit_id) && l.done).length,
      ks: today.filter((l: any) => kh.some((x: any) => x.id === l.habit_id)).length,
    });
    setLoaded(true);
  }
  useEffect(() => { if (userId) load(); }, [userId]);

  async function patch(p: Partial<DLog>) {
    if (!userId) return;
    const merged = { ...cur, ...p, log_date: date };
    setLogs((m) => ({ ...m, [date]: merged }));
    await supabase.from("daily_logs").upsert(
      { user_id: userId, log_date: date, mood: merged.mood, sleep_hours: merged.sleep_hours, energy: merged.energy, note: merged.note },
      { onConflict: "user_id,log_date" });
    flash();
  }
  function flash() { setSaved(true); clearTimeout((window as any)._sv); (window as any)._sv = setTimeout(() => setSaved(false), 1400); }

  const isToday = date === todayStr();
  const score = dayScore({
    buildDone: isToday ? habitScore.bd : 0, buildTotal: isToday ? habitScore.bt : 0,
    breakSlipped: isToday ? habitScore.ks : 0, breakTotal: isToday ? habitScore.kt : 0,
    mood: cur.mood, sleep: cur.sleep_hours, tasksDone: 0, tasksTotal: 0,
  });
  const vibe = scoreVibe(score);

  if (!loaded) return <div className="h-40 rounded-2xl bg-panel animate-pulse" />;

  return (
    <div className="space-y-4 animate-rise">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-bone">{COPY.daily.title}</h1>
        <span className={`text-xs text-mint transition-opacity ${saved ? "opacity-100" : "opacity-0"}`}>{COPY.daily.saved}</span>
      </div>
      <p className="text-fog text-sm -mt-2">{COPY.daily.subtitle}</p>

      {/* date picker */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {lastNDays(10).map((d) => (
          <button key={d} onClick={() => setDate(d)}
            className={`flex flex-col items-center min-w-[52px] rounded-xl px-2 py-2 border transition ${d === date ? "border-ember bg-ember/10 text-bone" : "border-line text-fog"}`}>
            <span className="text-[10px]">{weekdayMn(d)}</span>
            <span className="text-sm font-semibold tnum">{new Date(d + "T00:00:00").getDate()}</span>
            {logs[d]?.mood && <span className="text-xs mt-0.5">{MOODS.find((m) => m.v === logs[d].mood)?.e}</span>}
          </button>
        ))}
      </div>

      {/* live day score + mascot */}
      <Card className="p-5 relative overflow-hidden">
        <Mascot name={vibe.mascot} size={92} className="absolute -right-1 -bottom-2 opacity-90 pointer-events-none" />
        <div className="relative">
          <div className="text-[11px] uppercase tracking-widest text-fog">{isToday ? COPY.daily.scoreToday : COPY.daily.scoreOf(shortLabel(date))}</div>
          <div className="font-display font-extrabold tnum" style={{ fontSize: 46, lineHeight: 1.1, color: vibe.color }}>{score}</div>
          <div className="font-display font-bold" style={{ color: vibe.color }}>{vibe.word}</div>
          <div className="text-[11px] text-fog mt-1">{COPY.daily.scoreHint}{isToday && habitScore.bt > 0 ? COPY.daily.scoreHabits(habitScore.bd, habitScore.bt) : ""}</div>
        </div>
      </Card>

      {/* mood */}
      <Card className="p-4">
        <div className="text-[11px] uppercase tracking-widest text-fog mb-2.5">{COPY.daily.moodTitle}</div>
        <div className="flex gap-2">
          {MOODS.map((m) => (
            <button key={m.v} onClick={() => patch({ mood: m.v })}
              className={`flex-1 flex flex-col items-center gap-1 rounded-xl py-3 border transition ${cur.mood === m.v ? "border-mint bg-mint/10" : "border-line"}`}>
              <span className="text-2xl">{m.e}</span><span className="text-[10px] text-fog">{m.l}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex justify-between mb-2"><span className="text-[11px] uppercase tracking-widest text-fog">{COPY.daily.sleepTitle}</span><span className="mono text-violet">{cur.sleep_hours ?? "—"}ц</span></div>
          <input type="range" min={0} max={12} step={0.5} value={cur.sleep_hours ?? 7} onChange={(e) => patch({ sleep_hours: parseFloat(e.target.value) })} className="w-full accent-violet" />
          <div className="text-[11px] text-fog mt-1">{COPY.daily.sleepHint}</div>
        </Card>
        <Card className="p-4">
          <div className="text-[11px] uppercase tracking-widest text-fog mb-2">{COPY.daily.energyTitle}</div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button key={v} onClick={() => patch({ energy: v })} className={`flex-1 rounded-lg py-2.5 border font-display font-bold tnum ${cur.energy === v ? "border-gold bg-gold/10 text-gold" : "border-line text-fog"}`}>{v}</button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="text-[11px] uppercase tracking-widest text-fog mb-2">{COPY.daily.noteTitle}</div>
        <textarea value={cur.note ?? ""} rows={3}
          onChange={(e) => setLogs((m) => ({ ...m, [date]: { ...cur, note: e.target.value } }))}
          onBlur={(e) => patch({ note: e.target.value })}
          placeholder={COPY.daily.notePlaceholder}
          className="w-full rounded-lg bg-ink border border-line px-3 py-2.5 text-bone outline-none focus:border-ember resize-none text-sm" />
      </Card>
    </div>
  );
}
