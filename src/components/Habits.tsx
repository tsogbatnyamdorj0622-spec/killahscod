"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { lastNDays, shortLabel, todayStr, weekdayMn } from "@/lib/date";
import { XP_PER_HABIT } from "@/lib/xp";
import { Card, SectionTitle } from "./ui";

type Habit = { id: string; name: string; emoji: string; sort_order: number };
const DAYS = 14;
const EMOJIS = ["🔥", "💪", "📖", "🧊", "🎯", "🧘", "🌅", "🚫", "✍️", "🏃", "🧠", "💧"];

export default function Habits() {
  const { userId } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Set<string>>(new Set()); // "habitId|date"
  const [loaded, setLoaded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🔥");

  const days = lastNDays(DAYS);
  const today = todayStr();

  async function load() {
    const [h, l] = await Promise.all([
      supabase.from("habits").select("id,name,emoji,sort_order").eq("active", true).order("sort_order"),
      supabase.from("habit_logs").select("habit_id,log_date").eq("done", true).gte("log_date", days[0]),
    ]);
    setHabits(h.data ?? []);
    setLogs(new Set((l.data ?? []).map((r: any) => `${r.habit_id}|${r.log_date}`)));
    setLoaded(true);
  }
  useEffect(() => { if (userId) load(); }, [userId]);

  async function toggle(habitId: string, date: string) {
    if (!userId) return;
    const key = `${habitId}|${date}`;
    const on = logs.has(key);
    // optimistic
    const next = new Set(logs);
    on ? next.delete(key) : next.add(key);
    setLogs(next);
    await addXp(on ? -XP_PER_HABIT : XP_PER_HABIT);

    if (on) {
      await supabase.from("habit_logs").delete().eq("habit_id", habitId).eq("log_date", date);
    } else {
      await supabase.from("habit_logs").upsert(
        { user_id: userId, habit_id: habitId, log_date: date, done: true },
        { onConflict: "habit_id,log_date" }
      );
    }
  }

  async function addXp(delta: number) {
    const { data } = await supabase.from("profiles").select("xp").maybeSingle();
    const cur = data?.xp ?? 0;
    await supabase.from("profiles").update({ xp: Math.max(0, cur + delta) }).eq("id", userId);
  }

  async function addHabit() {
    if (!userId || !newName.trim()) return;
    await supabase.from("habits").insert({
      user_id: userId, name: newName.trim(), emoji: newEmoji, sort_order: habits.length,
    });
    setNewName(""); setNewEmoji("🔥"); setAdding(false); load();
  }

  async function removeHabit(id: string) {
    if (!confirm("Энэ habit-ийг устгах уу? Түүхэн бүртгэл нь бас устна.")) return;
    await supabase.from("habits").delete().eq("id", id);
    load();
  }

  if (!loaded) return <div className="h-40 rounded-2xl bg-panel animate-pulse" />;

  return (
    <div className="space-y-5 animate-rise">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-bone">Habits</h1>
          <p className="text-fog text-sm">Өдөр бүр цохи. Гинжийг бүү таслаа.</p>
        </div>
        <button onClick={() => setAdding((v) => !v)}
          className="rounded-lg bg-ember text-ink font-semibold px-4 py-2 text-sm hover:brightness-110 transition">
          {adding ? "Хаах" : "+ Habit"}
        </button>
      </header>

      {adding && (
        <Card className="p-4 animate-rise">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {EMOJIS.map((e) => (
              <button key={e} onClick={() => setNewEmoji(e)}
                className={`h-9 w-9 rounded-lg text-lg transition ${newEmoji === e ? "bg-ember/20 ring-1 ring-ember" : "bg-ink hover:bg-panel2"}`}>{e}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Habit нэр (ж: Wake up at 05:00)"
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
              className="flex-1 rounded-lg bg-ink border border-line px-3 py-2 text-bone outline-none focus:border-ember" />
            <button onClick={addHabit} className="rounded-lg bg-mint text-ink font-semibold px-4 hover:brightness-110">Нэмэх</button>
          </div>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="sticky left-0 bg-panel z-10 text-left px-4 py-3 text-[11px] uppercase tracking-wider text-fog font-medium min-w-[160px]">Habit</th>
                {days.map((d) => (
                  <th key={d} className={`px-1.5 py-2 text-center min-w-[34px] ${d === today ? "text-ember" : "text-fog"}`}>
                    <div className="text-[10px]">{weekdayMn(d)}</div>
                    <div className="text-[11px] font-semibold tnum">{new Date(d + "T00:00:00").getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((h) => {
                const doneCount = days.filter((d) => logs.has(`${h.id}|${d}`)).length;
                return (
                  <tr key={h.id} className="border-b border-line/50 group">
                    <td className="sticky left-0 bg-panel z-10 px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{h.emoji}</span>
                        <span className="text-sm text-bone truncate">{h.name}</span>
                        <span className="text-[10px] text-fog tnum ml-auto mr-1">{doneCount}/{DAYS}</span>
                        <button onClick={() => removeHabit(h.id)}
                          className="opacity-0 group-hover:opacity-100 text-fog hover:text-ember text-xs transition">✕</button>
                      </div>
                    </td>
                    {days.map((d) => {
                      const on = logs.has(`${h.id}|${d}`);
                      const future = d > today;
                      return (
                        <td key={d} className="px-1.5 py-2 text-center">
                          <button disabled={future} onClick={() => toggle(h.id, d)}
                            className={`h-6 w-6 rounded-md border transition
                              ${future ? "border-line/30 cursor-not-allowed" :
                                on ? "bg-ember border-ember shadow-[0_0_10px_rgba(255,122,69,0.4)]" :
                                "border-line hover:border-ember/60"}`}>
                            {on && <span className="text-ink text-xs font-bold">✓</span>}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {habits.length === 0 && (
                <tr><td colSpan={DAYS + 1} className="text-center text-fog py-10">
                  Habit алга. Дээрээс <span className="text-ember">+ Habit</span> дарж эхэл.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="text-[11px] text-fog/70 px-1">Cell дарах бүрт +{XP_PER_HABIT} XP. Буцаавал хасагдана.</p>
    </div>
  );
}
