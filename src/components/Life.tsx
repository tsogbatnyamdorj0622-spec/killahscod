"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { todayStr } from "@/lib/date";
import { Card } from "./ui";
import Mascot from "./Mascot";
import { COPY } from "@/lib/copy";

type Bucket = "work" | "family" | "money" | "skill" | "read" | "watch";
const BUCKETS: { id: Bucket; label: string; icon: string; color: string }[] = [
  { id: "work", label: COPY.life.buckets.work, icon: "💼", color: "#FF7A45" },
  { id: "family", label: COPY.life.buckets.family, icon: "👨‍👩‍👧", color: "#8A7BF2" },
  { id: "money", label: COPY.life.buckets.money, icon: "💰", color: "#5AD1A8" },
  { id: "skill", label: COPY.life.buckets.skill, icon: "🧠", color: "#F2C14E" },
  { id: "read", label: COPY.life.buckets.read, icon: "📖", color: "#5AD1A8" },
  { id: "watch", label: COPY.life.buckets.watch, icon: "🎬", color: "#FF7A45" },
];
// status label bucket бүрээр
const STATUS: Record<string, { todo: string; doing: string; done: string }> = {
  default: COPY.life.statusDefault,
  read: COPY.life.statusRead,
  watch: COPY.life.statusWatch,
};
const nextStatus = (s: string) => (s === "todo" ? "doing" : s === "doing" ? "done" : "todo");

export default function Life() {
  const { userId } = useAuth();
  const [bucket, setBucket] = useState<Bucket>("work");
  return (
    <div className="space-y-4 animate-rise">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-bone">{COPY.life.title}</h1>
        <p className="text-fog text-sm">{COPY.life.subtitle}</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {BUCKETS.map((b) => (
          <button key={b.id} onClick={() => setBucket(b.id)}
            className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap transition ${bucket === b.id ? "border-ember bg-ember/10 text-bone" : "border-line text-fog"}`}>
            {b.icon} {b.label}
          </button>
        ))}
      </div>
      {bucket === "work" ? <WorkPane userId={userId} /> : <ListPane key={bucket} userId={userId} bucket={bucket} />}
    </div>
  );
}

/* ---------- WORK: project + task ---------- */
type Project = { id: string; name: string; color: string };
type Task = { id: string; project_id: string | null; title: string; done: boolean; due_date: string | null };
const PCOLORS = ["#FF7A45", "#5AD1A8", "#8A7BF2", "#F2C14E"];

function WorkPane({ userId }: { userId: string | null }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [np, setNp] = useState(""); const [pc, setPc] = useState(PCOLORS[0]);
  const [ti, setTi] = useState<Record<string, string>>({});
  const [tdate, setTdate] = useState<Record<string, string>>({}); // due огноо

  async function load() {
    const [p, t] = await Promise.all([
      supabase.from("projects").select("id,name,color").eq("archived", false).order("created_at"),
      supabase.from("tasks").select("id,project_id,title,done,due_date").order("created_at"),
    ]);
    setProjects(p.data ?? []); setTasks(t.data ?? []); setLoaded(true);
  }
  useEffect(() => { if (userId) load(); }, [userId]);

  async function addProject() { if (!userId || !np.trim()) return; await supabase.from("projects").insert({ user_id: userId, name: np.trim(), color: pc }); setNp(""); load(); }
  async function addTask(pid: string) {
    const title = (ti[pid] ?? "").trim(); if (!userId || !title) return;
    await supabase.from("tasks").insert({ user_id: userId, project_id: pid, title, due_date: tdate[pid] || null });
    setTi((m) => ({ ...m, [pid]: "" })); setTdate((m) => ({ ...m, [pid]: "" })); load();
  }
  async function toggle(t: Task) { setTasks((a) => a.map((x) => x.id === t.id ? { ...x, done: !x.done } : x)); await supabase.from("tasks").update({ done: !t.done }).eq("id", t.id); }
  async function setTaskDue(t: Task, d: string) {
    const v = d || null;
    setTasks((a) => a.map((x) => x.id === t.id ? { ...x, due_date: v } : x));
    await supabase.from("tasks").update({ due_date: v }).eq("id", t.id);
  }
  async function delTask(id: string) { await supabase.from("tasks").delete().eq("id", id); setTasks((a) => a.filter((x) => x.id !== id)); }
  async function archive(id: string) { if (!confirm(COPY.life.confirmArchive)) return; await supabase.from("projects").update({ archived: true }).eq("id", id); load(); }

  if (!loaded) return <div className="h-32 rounded-2xl bg-panel animate-pulse" />;
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1.5">{PCOLORS.map((c) => (<button key={c} onClick={() => setPc(c)} className={`h-6 w-6 rounded-full ${pc === c ? "ring-2 ring-offset-2 ring-offset-panel ring-bone" : ""}`} style={{ background: c }} />))}</div>
          <input value={np} onChange={(e) => setNp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addProject()} placeholder={COPY.life.newProject}
            className="flex-1 min-w-[150px] rounded-lg bg-ink border border-line px-3 py-2 text-bone outline-none focus:border-ember" />
          <button onClick={addProject} className="rounded-lg bg-ember text-ink font-semibold px-4 py-2 hover:brightness-110">{COPY.life.addProjectBtn}</button>
        </div>
      </Card>
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((p) => {
          const pt = tasks.filter((t) => t.project_id === p.id);
          const done = pt.filter((t) => t.done).length;
          const pct = pt.length ? Math.round((done / pt.length) * 100) : 0;
          return (
            <Card key={p.id} className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-3 w-3 rounded-full" style={{ background: p.color }} />
                <h3 className="font-display font-bold text-bone flex-1 truncate">{p.name}</h3>
                <span className="text-[11px] text-fog tnum">{done}/{pt.length}</span>
                <button onClick={() => archive(p.id)} className="text-fog hover:text-ember text-xs">✕</button>
              </div>
              <div className="h-1.5 rounded-full bg-ink overflow-hidden mb-4"><div className="h-full transition-all duration-500" style={{ width: `${pct}%`, background: p.color }} /></div>
              <div className="space-y-1.5 mb-3">
                {pt.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 group">
                    <button onClick={() => toggle(t)} className={`h-5 w-5 rounded border shrink-0 grid place-items-center text-xs ${t.done ? "bg-mint border-mint text-ink" : "border-line hover:border-mint"}`}>{t.done ? "✓" : ""}</button>
                    <span className={`text-sm flex-1 ${t.done ? "text-fog line-through" : "text-bone"}`}>{t.title}</span>
                    <input type="date" value={t.due_date ?? ""} onChange={(e) => setTaskDue(t, e.target.value)} title="Огноо солих"
                      className={`text-[10px] px-1.5 py-0.5 rounded-md bg-ink border outline-none focus:border-ember [color-scheme:dark] ${t.due_date === todayStr() ? "border-ember/60 text-ember" : t.due_date ? "border-line text-fog" : "border-line/40 text-fog/50"}`} />
                    <button onClick={() => delTask(t.id)} className="opacity-0 group-hover:opacity-100 text-fog hover:text-ember text-xs">✕</button>
                  </div>
                ))}
                {pt.length === 0 && <p className="text-xs text-fog">{COPY.life.noTasks}</p>}
              </div>
              <div className="flex items-center gap-2">
                <input value={ti[p.id] ?? ""} onChange={(e) => setTi((m) => ({ ...m, [p.id]: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && addTask(p.id)} placeholder={COPY.life.addTaskPlaceholder}
                  className="flex-1 rounded-lg bg-ink border border-line px-3 py-1.5 text-sm text-bone outline-none focus:border-ember" />
                <input type="date" value={tdate[p.id] ?? ""} onChange={(e) => setTdate((m) => ({ ...m, [p.id]: e.target.value }))} title="Эцсийн огноо"
                  className={`text-xs px-2 py-1.5 rounded-lg bg-ink border outline-none focus:border-ember [color-scheme:dark] ${tdate[p.id] ? "border-ember text-ember" : "border-line text-fog"}`} />
              </div>
            </Card>
          );
        })}
        {projects.length === 0 && <Card className="p-8 text-center md:col-span-2"><Mascot name="hope" size={64} className="mx-auto mb-2 opacity-80" /><p className="text-fog">{COPY.life.noProjects}</p></Card>}
      </div>
    </div>
  );
}

/* ---------- бусад bucket: life_items ---------- */
type Item = { id: string; title: string; status: string; emoji: string; due_date: string | null };
function ListPane({ userId, bucket }: { userId: string | null; bucket: Bucket }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState(""); const [dueDate, setDueDate] = useState("");
  const meta = BUCKETS.find((b) => b.id === bucket)!;
  const sl = STATUS[bucket] ?? STATUS.default;

  async function load() {
    const { data } = await supabase.from("life_items").select("id,title,status,emoji,due_date").eq("bucket", bucket).order("created_at");
    setItems(data ?? []); setLoaded(true);
  }
  useEffect(() => { if (userId) load(); }, [userId]);

  async function add() {
    if (!userId || !title.trim()) return;
    await supabase.from("life_items").insert({ user_id: userId, bucket, title: title.trim(), emoji: meta.icon, status: "todo", due_date: dueDate || null });
    setTitle(""); setDueDate(""); load();
  }
  async function cycleStatus(it: Item) {
    const ns = nextStatus(it.status);
    setItems((a) => a.map((x) => x.id === it.id ? { ...x, status: ns } : x));
    await supabase.from("life_items").update({ status: ns }).eq("id", it.id);
  }
  async function del(id: string) { await supabase.from("life_items").delete().eq("id", id); setItems((a) => a.filter((x) => x.id !== id)); }
  async function setItemDue(it: Item, d: string) {
    const v = d || null;
    setItems((a) => a.map((x) => x.id === it.id ? { ...x, due_date: v } : x));
    await supabase.from("life_items").update({ due_date: v }).eq("id", it.id);
  }

  const badge = (s: string) => s === "done" ? { t: sl.done, c: "#5AD1A8" } : s === "doing" ? { t: sl.doing, c: "#F2C14E" } : { t: sl.todo, c: "#7C8296" };
  if (!loaded) return <div className="h-32 rounded-2xl bg-panel animate-pulse" />;
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex gap-2 items-center">
          <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder={COPY.life.addToBucket(meta.icon, meta.label)}
            className="flex-1 rounded-lg bg-ink border border-line px-3 py-2 text-bone outline-none focus:border-ember" />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} title="Эцсийн огноо"
            className={`text-xs px-2 py-2 rounded-lg bg-ink border outline-none focus:border-ember [color-scheme:dark] ${dueDate ? "border-ember text-ember" : "border-line text-fog"}`} />
          <button onClick={add} className="rounded-lg bg-ember text-ink font-semibold px-4 py-2 hover:brightness-110">+</button>
        </div>
      </Card>
      <Card className="p-2">
        {items.map((it) => {
          const b = badge(it.status);
          return (
            <div key={it.id} className="flex items-center gap-3 px-3 py-3 border-b border-line/40 last:border-0 group">
              <span className="text-lg">{it.emoji}</span>
              <div className="flex-1"><div className={`text-sm ${it.status === "done" ? "text-fog" : "text-bone"}`}>{it.title}</div>
                <input type="date" value={it.due_date ?? ""} onChange={(e) => setItemDue(it, e.target.value)} title="Огноо солих"
                  className={`text-[10px] px-1.5 py-0.5 rounded-md bg-ink border outline-none focus:border-ember [color-scheme:dark] mt-0.5 ${it.due_date === todayStr() ? "border-ember/60 text-ember" : it.due_date ? "border-line text-fog" : "border-line/40 text-fog/50"}`} /></div>
              <button onClick={() => cycleStatus(it)} className="text-[11px] px-2.5 py-1 rounded-full border" style={{ color: b.c, borderColor: b.c + "55" }}>{b.t}</button>
              <button onClick={() => del(it.id)} className="opacity-0 group-hover:opacity-100 text-fog hover:text-ember text-xs">✕</button>
            </div>
          );
        })}
        {items.length === 0 && <div className="text-center py-8"><Mascot name="cute" size={60} className="mx-auto mb-2 opacity-80" /><p className="text-fog text-sm">{COPY.life.emptyList}</p></div>}
      </Card>
      <p className="text-[11px] text-fog/70 px-1">{COPY.life.listHint(sl.todo, sl.doing, sl.done)}</p>
    </div>
  );
}
