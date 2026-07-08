"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { lastNDays, shortLabel, todayStr } from "@/lib/date";
import { levelFromXp, rankFor } from "@/lib/xp";
import { dayScore, scoreVibe, DayInputs } from "@/lib/score";
import { Card } from "./ui";
import Mascot from "./Mascot";
import { COPY } from "@/lib/copy";

type Habit = { id: string; kind: string };
type HLog = { habit_id: string; log_date: string; done: boolean };
type DLog = { log_date: string; mood: number | null; sleep_hours: number | null };
type Task = { done: boolean; due_date: string | null };

export default function Dashboard() {
  const { userId } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [hlogs, setHlogs] = useState<HLog[]>([]);
  const [dlogs, setDlogs] = useState<DLog[]>([]);
  const [xp, setXp] = useState(0);
  const [tasksToday, setTasksToday] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [todoList, setTodoList] = useState<{ id: string; kind: "task" | "life"; title: string; tag: string; color: string; done: boolean }[]>([]);
  const [loaded, setLoaded] = useState(false);

  const today = todayStr();

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const from = lastNDays(30)[0];
      const [h, hl, dl, p, tk, li] = await Promise.all([
        supabase.from("habits").select("id,kind").eq("active", true),
        supabase.from("habit_logs").select("habit_id,log_date,done").gte("log_date", from),
        supabase.from("daily_logs").select("log_date,mood,sleep_hours").gte("log_date", lastNDays(14)[0]),
        supabase.from("profiles").select("xp").maybeSingle(),
        supabase.from("tasks").select("id,title,done,due_date,project_id").eq("due_date", today),
        supabase.from("life_items").select("id,title,bucket,status,due_date").eq("due_date", today),
      ]);
      setHabits(h.data ?? []);
      setHlogs(hl.data ?? []);
      setDlogs(dl.data ?? []);
      setXp(p.data?.xp ?? 0);

      const tasks = (tk.data ?? []) as any[];
      const lifes = (li.data ?? []) as any[];
      const total = tasks.length + lifes.length;
      const done = tasks.filter((t) => t.done).length + lifes.filter((l) => l.status === "done").length;
      setTasksToday({ done, total });

      const list = [
        ...tasks.map((t) => ({ id: t.id, kind: "task" as const, title: t.title, tag: COPY.dash.tagWork, color: "#FF7A45", done: t.done })),
        ...lifes.map((l) => ({ id: l.id, kind: "life" as const, title: l.title, tag: bucketLabel(l.bucket), color: bucketColor(l.bucket), done: l.status === "done" })),
      ];
      setTodoList(list);
      setLoaded(true);
    })();
  }, [userId]);

  async function toggleTodo(t: { id: string; kind: "task" | "life"; done: boolean }) {
    const nd = !t.done;
    setTodoList((l) => l.map((x) => (x.id === t.id ? { ...x, done: nd } : x)));
    setTasksToday((s) => ({ ...s, done: s.done + (nd ? 1 : -1) }));
    if (t.kind === "task") await supabase.from("tasks").update({ done: nd }).eq("id", t.id);
    else await supabase.from("life_items").update({ status: nd ? "done" : "todo" }).eq("id", t.id);
  }

  // ---- өнөөдрийн day score ----
  const buildHabits = habits.filter((h) => h.kind === "build");
  const breakHabits = habits.filter((h) => h.kind === "break");
  const todayLogs = hlogs.filter((l) => l.log_date === today);
  const buildDone = todayLogs.filter((l) => buildHabits.some((h) => h.id === l.habit_id) && l.done).length;
  const breakSlipped = todayLogs.filter((l) => breakHabits.some((h) => h.id === l.habit_id)).length;
  const dl = dlogs.find((d) => d.log_date === today);

  const inputs: DayInputs = {
    buildDone, buildTotal: buildHabits.length,
    breakSlipped, breakTotal: breakHabits.length,
    mood: dl?.mood ?? null, sleep: dl?.sleep_hours ?? null,
    tasksDone: tasksToday.done, tasksTotal: tasksToday.total,
  };
  const score = dayScore(inputs);
  const vibe = scoreVibe(score);

  // streak
  const daySet = new Set(hlogs.filter((l) => l.done && buildHabits.some((h) => h.id === l.habit_id)).map((l) => l.log_date));
  let streak = 0;
  for (const d of lastNDays(60).reverse()) {
    if (d === today && !daySet.has(d)) continue;
    if (daySet.has(d)) streak++; else break;
  }

  const lvl = levelFromXp(xp);

  // 14 хоногийн day score тренд
  const trend = lastNDays(14).map((d) => {
    const tl = hlogs.filter((l) => l.log_date === d);
    const bd = tl.filter((l) => buildHabits.some((h) => h.id === l.habit_id) && l.done).length;
    const bs = tl.filter((l) => breakHabits.some((h) => h.id === l.habit_id)).length;
    const dd = dlogs.find((x) => x.log_date === d);
    const s = dayScore({ buildDone: bd, buildTotal: buildHabits.length, breakSlipped: bs, breakTotal: breakHabits.length, mood: dd?.mood ?? null, sleep: dd?.sleep_hours ?? null, tasksDone: 0, tasksTotal: 0 });
    return { day: shortLabel(d), score: s };
  });

  const hour = new Date().getHours();
  const greet = hour < 5 ? COPY.dash.greetNight : hour < 12 ? COPY.dash.greetMorning : hour < 18 ? COPY.dash.greetDay : COPY.dash.greetEvening;

  const pct = (n: number) => `${Math.round(n * 100)}%`;
  const bTotal = buildHabits.length, kTotal = breakHabits.length;

  if (!loaded) return <Skeleton />;

  return (
    <div className="space-y-5 animate-rise">
      <div className="flex items-end justify-between">
        <div>
          <div className="tag text-fog text-[11px] uppercase tracking-widest">{greet}</div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-bone">{COPY.dash.title}</h1>
        </div>
      </div>

      {/* DAY SCORE + mascot */}
      <Card className="p-6 relative overflow-hidden">
        <Mascot name={vibe.mascot} size={110} className="absolute -right-2 -bottom-3 opacity-90 pointer-events-none" />
        <div className="relative">
          <div className="relative grid place-items-center mx-auto" style={{ width: 180, height: 180 }}>
            <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="90" cy="90" r="78" stroke="#262A38" strokeWidth="13" fill="none" />
              <circle cx="90" cy="90" r="78" stroke={vibe.color} strokeWidth="13" fill="none" strokeLinecap="round"
                strokeDasharray={490} strokeDashoffset={490 * (1 - score / 100)}
                style={{ transition: "stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)" }} />
            </svg>
            <div className="absolute text-center">
              <div className="font-display font-extrabold tnum" style={{ fontSize: 52, lineHeight: 1, color: vibe.color }}>{score}</div>
              <div className="text-[10px] text-fog uppercase tracking-widest mt-1">{COPY.dash.dayScoreLabel}</div>
            </div>
          </div>
          <div className="font-display text-xl font-extrabold mt-2" style={{ color: vibe.color }}>{vibe.word}</div>
          <div className="hint text-xs text-fog mt-1">
            {score === 0 ? COPY.dash.emptyHint : streak > 0 ? COPY.dash.streakGoing(streak) : COPY.dash.streakNew}
          </div>
        </div>
      </Card>

      {/* breakdown */}
      <Card className="p-5">
        <div className="text-[11px] uppercase tracking-widest text-fog mb-3">{COPY.dash.breakdownTitle}</div>
        <div className="flex flex-col gap-3">
          <BreakBar label={COPY.dash.buildBar} val={bTotal ? buildDone / bTotal : 0} right={`${buildDone}/${bTotal}`} color="#5AD1A8" />
          <BreakBar label={COPY.dash.breakBar} hint={COPY.dash.breakBarHint} val={kTotal ? breakSlipped / kTotal : 0} right={`${breakSlipped}/${kTotal}`} color="#F2555A" />
          {dl?.mood != null && <BreakBar label={COPY.dash.moodBar} val={dl.mood / 5} right={`${dl.mood}/5`} color="#F2C14E" />}
          {dl?.sleep_hours != null && <BreakBar label={COPY.dash.sleepBar} val={Math.max(0, 1 - Math.abs(7.5 - dl.sleep_hours) / 5)} right={`${dl.sleep_hours}ц`} color="#8A7BF2" />}
          {tasksToday.total > 0 && <BreakBar label={COPY.dash.tasksBar} val={tasksToday.done / tasksToday.total} right={`${tasksToday.done}/${tasksToday.total}`} color="#FF7A45" />}
        </div>
      </Card>

      {/* streak + xp */}
      <Card className="p-5">
        <div className="flex justify-between items-center">
          <div><div className="text-[11px] uppercase tracking-widest text-fog">{COPY.dash.streakLabel}</div><div className="font-display text-2xl font-extrabold text-ember tnum">{streak}🔥</div></div>
          <div className="text-right"><div className="text-[11px] uppercase tracking-widest text-fog">{COPY.dash.levelLabel(lvl.level, rankFor(lvl.level))}</div><div className="text-xs text-fog tnum mono">{xp} / {xp - lvl.into + lvl.span} XP</div></div>
        </div>
        <div className="h-2.5 rounded-full bg-ink overflow-hidden mt-3">
          <div className="h-full bg-gradient-to-r from-gold to-ember transition-all duration-700" style={{ width: `${lvl.pct * 100}%` }} />
        </div>
      </Card>

      {/* trend */}
      <Card className="p-5">
        <div className="text-[11px] uppercase tracking-widest text-fog mb-2">{COPY.dash.trendTitle}</div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
              <CartesianGrid stroke="#262A38" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#7C8296", fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis domain={[0, 100]} tick={{ fill: "#7C8296", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#14161F", border: "1px solid #262A38", borderRadius: 12, color: "#ECEAE3" }} />
              <Line dataKey="score" stroke="#FF7A45" strokeWidth={2.5} dot={{ r: 3, fill: "#FF7A45" }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* today's plan */}
      <Card className="p-5">
        <div className="flex justify-between items-baseline mb-1">
          <div className="text-[11px] uppercase tracking-widest text-fog">{COPY.dash.todayTitle}</div>
          <div className="text-xs text-fog tnum mono">{tasksToday.done}/{tasksToday.total}</div>
        </div>
        {todoList.length === 0 && <p className="text-sm text-fog py-3">{COPY.dash.todayEmpty} <a href="/life" className="text-ember">{COPY.dash.todayEmptyLink}</a>{COPY.dash.todayEmptyTail}</p>}
        {todoList.map((t) => (
          <div key={t.id} className="flex items-center gap-3 py-2 border-b border-line/40 last:border-0">
            <button onClick={() => toggleTodo(t)}
              className={`h-6 w-6 rounded-md border grid place-items-center text-[12px] transition ${t.done ? "bg-mint border-mint text-ink" : "border-line hover:border-mint"}`}>{t.done ? "✓" : ""}</button>
            <span className={`flex-1 text-sm ${t.done ? "text-fog line-through" : "text-bone"}`}>{t.title}</span>
            <span className="text-[11px] px-2 py-1 rounded-full border border-line" style={{ color: t.color }}>{t.tag}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function BreakBar({ label, val, right, color, hint }: { label: string; val: number; right: string; color: string; hint?: string }) {
  return (
    <div>
      <div className="flex justify-between text-[13px] mb-1">
        <span>{label} {hint && <span className="text-[11px] text-fog">({hint})</span>}</span>
        <span className="mono tnum" style={{ color }}>{right}</span>
      </div>
      <div className="h-2 rounded-full bg-ink overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.round(val * 100)}%`, background: color }} /></div>
    </div>
  );
}

function bucketLabel(b: string) {
  return (COPY.life.buckets as Record<string, string>)[b] ?? b;
}
function bucketColor(b: string) {
  return { family: "#8A7BF2", money: "#5AD1A8", skill: "#F2C14E", read: "#5AD1A8", watch: "#FF7A45" }[b] ?? "#7C8296";
}

function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-56 rounded bg-panel animate-pulse" />
      <div className="h-64 rounded-2xl bg-panel animate-pulse" />
      <div className="h-40 rounded-2xl bg-panel animate-pulse" />
    </div>
  );
}
