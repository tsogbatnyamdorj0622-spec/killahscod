"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { lastNDays, shortLabel, todayStr, weekdayMn } from "@/lib/date";
import { levelFromXp, rankFor, xpForLevel } from "@/lib/xp";
import { Card, SectionTitle, StatTile, SunriseRing } from "./ui";

type Habit = { id: string; name: string; emoji: string };
type HLog = { habit_id: string; log_date: string; done: boolean };
type DLog = { log_date: string; mood: number | null; sleep_hours: number | null; energy: number | null };

export default function Dashboard() {
  const { userId } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [hlogs, setHlogs] = useState<HLog[]>([]);
  const [dlogs, setDlogs] = useState<DLog[]>([]);
  const [xp, setXp] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const from = lastNDays(30)[0];
      const [h, hl, dl, p] = await Promise.all([
        supabase.from("habits").select("id,name,emoji").eq("active", true).order("sort_order"),
        supabase.from("habit_logs").select("habit_id,log_date,done").gte("log_date", from),
        supabase.from("daily_logs").select("log_date,mood,sleep_hours,energy").gte("log_date", lastNDays(14)[0]),
        supabase.from("profiles").select("xp").maybeSingle(),
      ]);
      setHabits(h.data ?? []);
      setHlogs(hl.data ?? []);
      setDlogs(dl.data ?? []);
      setXp(p.data?.xp ?? 0);
      setLoaded(true);
    })();
  }, [userId]);

  const today = todayStr();
  const doneToday = hlogs.filter((l) => l.log_date === today && l.done).length;
  const todayPct = habits.length ? doneToday / habits.length : 0;

  // streak: өнөөдрөөс ухарч, тухайн өдөр дор хаяж нэг habit хийсэн бол үргэлжилнэ.
  // Өнөөдөр хараахан хийгээгүй бол streak-ийг тасалдаггүй (өдөр дуусаагүй).
  const daySet = new Set(hlogs.filter((l) => l.done).map((l) => l.log_date));
  let streak = 0;
  const daysDesc = lastNDays(60).reverse(); // шинэ → хуучин
  for (const d of daysDesc) {
    if (d === today && !daySet.has(d)) continue;
    if (daySet.has(d)) streak++;
    else break;
  }

  const lvl = levelFromXp(xp);
  const rank = rankFor(lvl.level);

  // 14 хоногийн mood + sleep
  const dlMap = new Map(dlogs.map((d) => [d.log_date, d]));
  const moodData = lastNDays(14).map((d) => {
    const r = dlMap.get(d);
    return { day: shortLabel(d), wd: weekdayMn(d), mood: r?.mood ?? null, sleep: r?.sleep_hours ?? null };
  });

  // 30 хоногийн habit completion %
  const compData = lastNDays(30).map((d) => {
    const done = hlogs.filter((l) => l.log_date === d && l.done).length;
    return { day: shortLabel(d), pct: habits.length ? Math.round((done / habits.length) * 100) : 0 };
  });

  // wellness score: habit 30d дундаж %, mood avg, sleep avg-ийг нэгтгэсэн 0-100
  const avgComp = compData.reduce((s, x) => s + x.pct, 0) / (compData.length || 1);
  const moods = moodData.filter((m) => m.mood != null).map((m) => m.mood as number);
  const sleeps = moodData.filter((m) => m.sleep != null).map((m) => m.sleep as number);
  const avgMood = moods.length ? moods.reduce((a, b) => a + b, 0) / moods.length : 0;
  const avgSleep = sleeps.length ? sleeps.reduce((a, b) => a + b, 0) / sleeps.length : 0;
  const sleepScore = avgSleep ? Math.max(0, 100 - Math.abs(7.5 - avgSleep) * 18) : 0;
  const wellness = Math.round(avgComp * 0.5 + (avgMood / 5) * 100 * 0.3 + sleepScore * 0.2);

  const hour = new Date().getHours();
  const greet = hour < 5 ? "Шөнө дунд ажиллаж байна уу" : hour < 12 ? "Өглөөний grind" : hour < 18 ? "Өдрийн track" : "Өдрийн дүн";

  if (!loaded) return <Skeleton />;

  return (
    <div className="space-y-6 animate-rise">
      <header className="flex items-end justify-between">
        <div>
          <div className="text-fog text-sm">{greet}</div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-bone">Өнөөдрийн ledger</h1>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-fog">Rank</div>
          <div className="font-display font-extrabold text-gold">{rank}</div>
        </div>
      </header>

      {/* top: ring + level */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 flex flex-col items-center justify-center">
          <SunriseRing pct={todayPct} label="өнөөдөр" />
          <div className="text-sm text-fog mt-3">
            <span className="text-bone font-semibold tnum">{doneToday}</span> / {habits.length} habit
          </div>
        </Card>

        <Card className="p-6 md:col-span-2 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-fog">Level</div>
              <div className="font-display text-4xl font-extrabold text-gold tnum">{lvl.level}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wider text-fog">Streak</div>
              <div className="font-display text-4xl font-extrabold text-ember tnum">{streak}🔥</div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-[11px] uppercase tracking-wider text-fog">Wellness</div>
              <div className="font-display text-4xl font-extrabold text-mint tnum">{wellness}</div>
            </div>
          </div>
          <div className="h-2.5 rounded-full bg-ink overflow-hidden">
            <div className="h-full bg-gradient-to-r from-gold to-ember transition-all duration-700"
              style={{ width: `${lvl.pct * 100}%` }} />
          </div>
          <div className="flex justify-between text-[11px] text-fog mt-1.5 tnum">
            <span>{xp} XP</span>
            <span>{lvl.into}/{lvl.span} → Lvl {lvl.level + 1}</span>
          </div>
        </Card>
      </div>

      {/* mood + sleep */}
      <Card className="p-5">
        <SectionTitle right={<div className="flex gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-mint">● Mood</span>
          <span className="flex items-center gap-1 text-violet">● Нойр</span>
        </div>}>Сүүлийн 14 хоног</SectionTitle>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#262A38" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#7C8296", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="l" domain={[0, 5]} tick={{ fill: "#7C8296", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="r" orientation="right" domain={[0, 12]} hide />
              <Tooltip contentStyle={{ background: "#14161F", border: "1px solid #262A38", borderRadius: 12, color: "#ECEAE3" }} />
              <Line yAxisId="l" dataKey="mood" stroke="#5AD1A8" strokeWidth={2.5} dot={{ r: 3, fill: "#5AD1A8" }} connectNulls name="Mood" />
              <Line yAxisId="r" dataKey="sleep" stroke="#8A7BF2" strokeWidth={2.5} dot={{ r: 3, fill: "#8A7BF2" }} connectNulls name="Нойр" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 30-day completion */}
      <Card className="p-5">
        <SectionTitle>Өдөр тутмын гүйцэтгэл · 30 хоног</SectionTitle>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compData} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
              <CartesianGrid stroke="#262A38" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#7C8296", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis domain={[0, 100]} tick={{ fill: "#7C8296", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "rgba(255,122,69,0.08)" }}
                contentStyle={{ background: "#14161F", border: "1px solid #262A38", borderRadius: 12, color: "#ECEAE3" }} />
              <Bar dataKey="pct" fill="#FF7A45" radius={[3, 3, 0, 0]} name="%" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {habits.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-fog">Habit алга байна. <a href="/habits" className="text-ember">Habits</a> хэсгээс нэм.</p>
        </Card>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 rounded bg-panel animate-pulse" />
      <div className="grid md:grid-cols-3 gap-4">
        <div className="h-48 rounded-2xl bg-panel animate-pulse" />
        <div className="h-48 rounded-2xl bg-panel animate-pulse md:col-span-2" />
      </div>
      <div className="h-56 rounded-2xl bg-panel animate-pulse" />
    </div>
  );
}
