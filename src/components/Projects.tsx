"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { todayStr } from "@/lib/date";
import { Card, SectionTitle } from "./ui";

type Project = { id: string; name: string; color: string };
type Task = { id: string; project_id: string | null; title: string; done: boolean };
const COLORS = ["#FF7A45", "#5AD1A8", "#8A7BF2", "#F2C14E", "#4ADED0"];

export default function Projects() {
  const { userId } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [newProj, setNewProj] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [taskInput, setTaskInput] = useState<Record<string, string>>({});

  async function load() {
    const [p, t] = await Promise.all([
      supabase.from("projects").select("id,name,color").eq("archived", false).order("created_at"),
      supabase.from("tasks").select("id,project_id,title,done").order("created_at"),
    ]);
    setProjects(p.data ?? []); setTasks(t.data ?? []); setLoaded(true);
  }
  useEffect(() => { if (userId) load(); }, [userId]);

  async function addProject() {
    if (!userId || !newProj.trim()) return;
    await supabase.from("projects").insert({ user_id: userId, name: newProj.trim(), color });
    setNewProj(""); load();
  }
  async function addTask(pid: string) {
    const title = (taskInput[pid] ?? "").trim();
    if (!userId || !title) return;
    await supabase.from("tasks").insert({ user_id: userId, project_id: pid, title });
    setTaskInput((m) => ({ ...m, [pid]: "" })); load();
  }
  async function toggleTask(t: Task) {
    setTasks((arr) => arr.map((x) => x.id === t.id ? { ...x, done: !x.done } : x));
    await supabase.from("tasks").update({ done: !t.done }).eq("id", t.id);
  }
  async function delTask(id: string) {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks((arr) => arr.filter((x) => x.id !== id));
  }
  async function archiveProject(id: string) {
    if (!confirm("Project-ийг архивлах уу?")) return;
    await supabase.from("projects").update({ archived: true }).eq("id", id);
    load();
  }

  if (!loaded) return <div className="h-40 rounded-2xl bg-panel animate-pulse" />;

  return (
    <div className="space-y-5 animate-rise">
      <header>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-bone">Projects</h1>
        <p className="text-fog text-sm">Бодит ажил. Талбайд гарга.</p>
      </header>

      <Card className="p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1.5">
            {COLORS.map((c) => (
              <button key={c} onClick={() => setColor(c)}
                className={`h-6 w-6 rounded-full transition ${color === c ? "ring-2 ring-offset-2 ring-offset-panel ring-bone" : ""}`}
                style={{ background: c }} />
            ))}
          </div>
          <input value={newProj} onChange={(e) => setNewProj(e.target.value)} placeholder="Шинэ project нэр"
            onKeyDown={(e) => e.key === "Enter" && addProject()}
            className="flex-1 min-w-[160px] rounded-lg bg-ink border border-line px-3 py-2 text-bone outline-none focus:border-ember" />
          <button onClick={addProject} className="rounded-lg bg-ember text-ink font-semibold px-4 py-2 hover:brightness-110">+ Project</button>
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
                <button onClick={() => archiveProject(p.id)} className="text-fog hover:text-ember text-xs">✕</button>
              </div>
              <div className="h-1.5 rounded-full bg-ink overflow-hidden mb-4">
                <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, background: p.color }} />
              </div>

              <div className="space-y-1.5 mb-3">
                {pt.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 group">
                    <button onClick={() => toggleTask(t)}
                      className={`h-5 w-5 rounded border shrink-0 transition
                        ${t.done ? "bg-mint border-mint" : "border-line hover:border-mint"}`}>
                      {t.done && <span className="text-ink text-xs">✓</span>}
                    </button>
                    <span className={`text-sm flex-1 ${t.done ? "text-fog line-through" : "text-bone"}`}>{t.title}</span>
                    <button onClick={() => delTask(t.id)} className="opacity-0 group-hover:opacity-100 text-fog hover:text-ember text-xs">✕</button>
                  </div>
                ))}
                {pt.length === 0 && <p className="text-xs text-fog">Task алга.</p>}
              </div>

              <div className="flex gap-2">
                <input value={taskInput[p.id] ?? ""} onChange={(e) => setTaskInput((m) => ({ ...m, [p.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && addTask(p.id)} placeholder="+ task нэмэх"
                  className="flex-1 rounded-lg bg-ink border border-line px-3 py-1.5 text-sm text-bone outline-none focus:border-ember" />
              </div>
            </Card>
          );
        })}
        {projects.length === 0 && (
          <Card className="p-8 text-center md:col-span-2">
            <p className="text-fog">Project алга. Дээрээс нэг үүсгэ.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
