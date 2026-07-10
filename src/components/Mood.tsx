"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { lastNDays, shortLabel, todayStr, weekdayMn } from "@/lib/date";
import { MOODS } from "@/lib/moods";
import { Card, SectionTitle } from "./ui";

type DLog = { log_date: string; mood: number | null; sleep_hours: number | null; energy: number | null; note: string | null };

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
            {logs[d]?.mood && (() => {
              const mood = MOODS.find((m) => m.v === logs[d].mood);
              return mood ? <Image src={mood.image} alt="" width={18} height={18} className="mt-1 rounded-full" /> : null;
            })()}
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
              aria-pressed={cur.mood === m.v}
              aria-label={`${m.l} mood сонгох`}
              className={`group flex min-w-0 flex-col items-center gap-2 rounded-2xl border p-1.5 pb-2.5 transition-all duration-200 sm:p-2 sm:pb-3
                ${cur.mood === m.v ? "border-mint bg-mint/10 shadow-[0_0_24px_rgba(83,224,181,0.13)]" : "border-line hover:border-fog hover:bg-white/[0.02]"}`}>
              <Image src={m.image} alt={`${m.l} ONGOD`} width={96} height={96}
                className={`aspect-square w-full rounded-xl object-cover transition-transform duration-200 ${cur.mood === m.v ? "scale-[1.03]" : "group-hover:scale-[1.02]"}`} />
              <span className={`truncate text-[10px] sm:text-[11px] ${cur.mood === m.v ? "font-semibold text-mint" : "text-fog"}`}>{m.l}</span>
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
