"use client";
import { useEffect, useState, type DragEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { lastNDays, todayStr, weekdayMn } from "@/lib/date";
import { XP_PER_HABIT } from "@/lib/xp";
import { Card } from "./ui";
import { MascotStage } from "./Mascot";
import { COPY } from "@/lib/copy";

type Habit = { id: string; name: string; emoji: string; kind: string; sort_order: number };
type Log = { habit_id: string; log_date: string; done: boolean };
const DAYS = 14;
const EMO_BUILD = ["🌅", "💪", "📖", "🎯", "🧘", "🏃", "💧", "🧠", "✍️", "🎹"];
const EMO_BREAK = ["🚫", "🍬", "🍺", "📵", "🚬", "☕", "🎰", "🍔"];

export default function Habits() {
  const { userId } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Map<string, boolean>>(new Map()); // "hid|date" -> done
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<"all" | "build" | "break">("all");
  const [adding, setAdding] = useState(false);
  const [nk, setNk] = useState<"build" | "break">("build");
  const [nm, setNm] = useState("");
  const [ne, setNe] = useState("🌅");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const days = lastNDays(DAYS);
  const today = todayStr();

  async function load() {
    const [h, l] = await Promise.all([
      supabase.from("habits").select("id,name,emoji,kind,sort_order").eq("active", true).order("sort_order"),
      supabase.from("habit_logs").select("habit_id,log_date,done").gte("log_date", days[0]),
    ]);
    setHabits(h.data ?? []);
    const m = new Map<string, boolean>();
    (l.data ?? []).forEach((r: Log) => m.set(`${r.habit_id}|${r.log_date}`, r.done));
    setLogs(m);
    setLoaded(true);
  }
  useEffect(() => { if (userId) load(); }, [userId]);

  async function addXp(d: number) {
    const { data } = await supabase.from("profiles").select("xp").maybeSingle();
    await supabase.from("profiles").update({ xp: Math.max(0, (data?.xp ?? 0) + d) }).eq("id", userId);
  }

  // build: undefined→done→undefined
  // break: undefined→resisted(true)→slipped(false)→undefined
  async function cycle(h: Habit, date: string) {
    if (!userId || date > today) return;
    const key = `${h.id}|${date}`;
    const cur = logs.get(key); // undefined | true | false
    const next = new Map(logs);

    if (h.kind === "build") {
      if (cur === undefined) { next.set(key, true); await upsert(h.id, date, true); addXp(XP_PER_HABIT); }
      else { next.delete(key); await del(h.id, date); addXp(-XP_PER_HABIT); }
    } else {
      // хорт: дарвал автсан (record нэмнэ), дахин дарвал автаагүй (устгана)
      if (cur === undefined) { next.set(key, true); await upsert(h.id, date, true); }
      else { next.delete(key); await del(h.id, date); }
    }
    setLogs(next);
  }
  async function upsert(hid: string, date: string, done: boolean) {
    await supabase.from("habit_logs").upsert({ user_id: userId, habit_id: hid, log_date: date, done }, { onConflict: "habit_id,log_date" });
  }
  async function del(hid: string, date: string) {
    await supabase.from("habit_logs").delete().eq("habit_id", hid).eq("log_date", date);
  }

  async function addHabit() {
    if (!userId || !nm.trim()) return;
    await supabase.from("habits").insert({ user_id: userId, name: nm.trim(), emoji: ne, kind: nk, sort_order: habits.length });
    setNm(""); setAdding(false); load();
  }
  async function removeHabit(id: string) {
    if (!confirm(COPY.habits.confirmDelete)) return;
    await supabase.from("habits").delete().eq("id", id);
    load();
  }

  function startDrag(e: DragEvent<HTMLButtonElement>, id: string) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    setDraggedId(id);
  }

  async function dropHabit(targetId: string) {
    if (!draggedId || draggedId === targetId || tab !== "all") {
      setDraggedId(null); setDragOverId(null); return;
    }
    const from = habits.findIndex((h) => h.id === draggedId);
    const to = habits.findIndex((h) => h.id === targetId);
    if (from < 0 || to < 0) return;

    const next = [...habits];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const ordered = next.map((h, i) => ({ ...h, sort_order: i }));
    setHabits(ordered);
    setDraggedId(null); setDragOverId(null);

    const results = await Promise.all(ordered.map((h) =>
      supabase.from("habits").update({ sort_order: h.sort_order }).eq("id", h.id)
    ));
    if (results.some((r) => r.error)) load();
  }

  const shown = habits.filter((h) => tab === "all" || h.kind === tab);
  if (!loaded) return <div className="h-40 rounded-2xl bg-panel animate-pulse" />;

  return (
    <div className="space-y-5 animate-rise">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-bone">{COPY.habits.title}</h1>
          <p className="text-fog text-sm">{COPY.habits.subtitle}</p>
        </div>
        <button onClick={() => setAdding((v) => !v)} className="rounded-lg bg-ember text-ink font-semibold px-4 py-2 text-sm hover:brightness-110">{adding ? COPY.habits.closeBtn : COPY.habits.addBtn}</button>
      </header>

      {adding && (
        <Card className="p-4 animate-rise">
          <div className="seg inline-flex bg-ink border border-line rounded-lg p-1 mb-3">
            <button onClick={() => { setNk("build"); setNe("🌅"); }} className={`px-4 py-1.5 rounded-md text-sm ${nk === "build" ? "bg-panel2 text-mint" : "text-fog"}`}>{COPY.habits.kindBuild}</button>
            <button onClick={() => { setNk("break"); setNe("🚫"); }} className={`px-4 py-1.5 rounded-md text-sm ${nk === "break" ? "bg-panel2 text-red" : "text-fog"}`}>{COPY.habits.kindBreak}</button>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(nk === "build" ? EMO_BUILD : EMO_BREAK).map((e) => (
              <button key={e} onClick={() => setNe(e)} className={`h-9 w-9 rounded-lg text-lg ${ne === e ? "bg-ember/20 ring-1 ring-ember" : "bg-ink hover:bg-panel2"}`}>{e}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={nm} onChange={(e) => setNm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addHabit()}
              placeholder={nk === "build" ? COPY.habits.placeholderBuild : COPY.habits.placeholderBreak}
              className="flex-1 rounded-lg bg-ink border border-line px-3 py-2 text-bone outline-none focus:border-ember" />
            <button onClick={addHabit} className="rounded-lg bg-mint text-ink font-semibold px-4 hover:brightness-110">{COPY.habits.okBtn}</button>
          </div>
        </Card>
      )}

      <div className="seg inline-flex bg-ink border border-line rounded-lg p-1">
        {(["all", "build", "break"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-md text-sm ${tab === t ? "bg-panel2 text-bone" : "text-fog"}`}>
            {t === "all" ? COPY.habits.tabAll : t === "build" ? COPY.habits.kindBuild : COPY.habits.kindBreak}
          </button>
        ))}
      </div>

      {/* MOBILE: зөвхөн өнөөдрийн чек */}
      <div className="md:hidden space-y-2">
        {shown.map((h) => {
          const isBreak = h.kind === "break";
          const v = logsGet(logs, h.id, today);
          const on = isBreak ? v !== undefined : v === true;
          const all30 = lastNDays(30);
          let num = 0;
          all30.forEach((d) => {
            const x = logsGet(logs, h.id, d);
            if (isBreak) { if (x !== undefined) num++; } else { if (x === true) num++; }
          });
          const pctVal = Math.round((num / 30) * 100);
          return (
            <Card key={h.id} className="p-3 flex items-center gap-3">
              <span className="text-xl">{h.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-bone truncate">{h.name}</div>
                <div className="text-[10px] mono" style={{ color: isBreak ? "#F2555A" : "#5AD1A8" }}>
                  {pctVal}%{isBreak ? " " + COPY.habits.pctSlipped : ""} · 30х
                </div>
              </div>
              <button onClick={() => cycle(h, today)}
                className={`h-10 w-10 rounded-xl border-2 grid place-items-center text-lg font-bold transition shrink-0
                  ${on ? (isBreak ? "bg-red border-red text-ink" : "bg-mint border-mint text-ink shadow-[0_0_12px_rgba(90,209,168,.4)]") : "border-line active:scale-95"}`}>
                {on ? (isBreak ? "✕" : "✓") : ""}
              </button>
            </Card>
          );
        })}
        {shown.length === 0 && (
          <Card className="p-8 text-center">
            <MascotStage name="hope" size={58} accent="#5AD1A8" compact className="mx-auto mb-1" />
            <p className="text-fog text-sm">{COPY.habits.emptyText} <span className="text-ember">{COPY.habits.emptyLink}</span>.</p>
          </Card>
        )}
      </div>

      {/* DESKTOP: 14 хоногийн grid */}
      <Card className="p-0 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead><tr className="border-b border-line">
              <th className="sticky left-0 bg-panel z-10 text-left px-4 py-3 text-[11px] uppercase tracking-wider text-fog font-medium min-w-[170px]">{COPY.habits.colHabit}</th>
              {days.map((d) => (
                <th key={d} className={`px-1.5 py-2 min-w-[34px] ${d === today ? "text-ember" : "text-fog"}`}>
                  <div className="text-[10px]">{weekdayMn(d)}</div>
                  <div className="text-[11px] font-semibold tnum">{new Date(d + "T00:00:00").getDate()}</div>
                </th>
              ))}
              <th className="px-2 py-2 text-[11px] uppercase text-fog">{COPY.habits.col30d}</th>
            </tr></thead>
            <tbody>
              {shown.map((h) => {
                const isBreak = h.kind === "break";
                // build → хийсэн/30, break → автсан/30 (record байгаа=автсан)
                const all = lastNDays(30);
                let num = 0;
                all.forEach((d) => {
                  const v = logsGet(logs, h.id, d);
                  if (isBreak) { if (v !== undefined) num++; }
                  else { if (v === true) num++; }
                });
                const pctVal = Math.round((num / 30) * 100);
                return (
                  <tr key={h.id}
                    onDragOver={(e) => { if (tab === "all") { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOverId(h.id); } }}
                    onDragLeave={() => dragOverId === h.id && setDragOverId(null)}
                    onDrop={(e) => { e.preventDefault(); dropHabit(h.id); }}
                    className={`border-b border-line/50 group transition-colors ${dragOverId === h.id ? "bg-ember/[0.07]" : ""} ${draggedId === h.id ? "opacity-45" : ""}`}>
                    <td className="sticky left-0 bg-panel z-10 px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        {tab === "all" && <button type="button" draggable onDragStart={(e) => startDrag(e, h.id)} onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                          className="cursor-grab select-none text-fog/45 hover:text-ember active:cursor-grabbing" title="Чирж байрлалыг солих" aria-label={`${h.name} зуршлын байрлалыг солих`}>⠿</button>}
                        <span>{h.emoji}</span><span className="text-sm text-bone truncate">{h.name}</span>
                        {isBreak && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red/10 text-red border border-red/30 ml-auto">{COPY.habits.badgeBreak}</span>}
                        <button onClick={() => removeHabit(h.id)} className="opacity-0 group-hover:opacity-100 text-fog hover:text-ember text-xs">✕</button>
                      </div>
                    </td>
                    {days.map((d) => {
                      const v = logsGet(logs, h.id, d);
                      const future = d > today;
                      let cls = "border-line hover:border-ember/60", txt = "";
                      if (isBreak) {
                        if (v !== undefined) { cls = "bg-red border-red text-ink"; txt = "✕"; }  // автсан
                      } else {
                        if (v === true) { cls = "bg-mint border-mint text-ink shadow-[0_0_10px_rgba(90,209,168,.35)]"; txt = "✓"; }
                      }
                      return (
                        <td key={d} className="px-1.5 py-2 text-center">
                          <button disabled={future} onClick={() => cycle(h, d)}
                            className={`h-6 w-6 rounded-md border grid place-items-center text-xs font-bold transition ${future ? "border-line/30 cursor-not-allowed" : cls}`}
                            style={d === today ? { outline: "1px solid rgba(255,122,69,.4)" } : {}}>{txt}</button>
                        </td>
                      );
                    })}
                    <td className="px-2 text-center mono text-[11px]" style={{ color: isBreak ? "#F2555A" : "#5AD1A8" }}>
                      {pctVal}%{isBreak ? " " + COPY.habits.pctSlipped : ""}
                    </td>
                  </tr>
                );
              })}
              {shown.length === 0 && (
                <tr><td colSpan={DAYS + 2} className="text-center py-10">
                  <MascotStage name="hope" size={62} accent="#5AD1A8" compact className="mx-auto mb-1" />
                  <p className="text-fog text-sm">{COPY.habits.emptyText} <span className="text-ember">{COPY.habits.emptyLink}</span>.</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="text-[11px] text-fog/70 px-1">
        <b className="text-mint">{COPY.habits.hintBuild}</b> {COPY.habits.hintBuildText(XP_PER_HABIT)} &nbsp;
        <b className="text-red">{COPY.habits.hintBreak}</b> {COPY.habits.hintBreakText}
      </p>
    </div>
  );
}

function logsGet(m: Map<string, boolean>, hid: string, date: string): boolean | undefined {
  return m.get(`${hid}|${date}`);
}
