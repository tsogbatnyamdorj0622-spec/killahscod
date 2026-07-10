"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { BrandMark } from "@/components/AppShell";
import { MascotStage } from "@/components/Mascot";
import { COPY } from "@/lib/copy";

export default function LoginPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) router.replace("/");
  }, [loading, session, router]);

  async function submit() {
    setBusy(true); setMsg(null);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password: pw });
        if (error) throw error;
        setMsg(COPY.login.created);
        setMode("in");
      }
    } catch (e: any) {
      setMsg(e.message === "Invalid login credentials" ? COPY.login.wrongCreds : e.message);
    } finally { setBusy(false); }
  }

  return (
    <main className="login-shell min-h-screen px-5 py-6 md:px-8 md:py-8">
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-panel/45 shadow-2xl shadow-black/40 backdrop-blur-xl md:min-h-[calc(100vh-4rem)]">
        <div className="pointer-events-none absolute inset-0 login-grid opacity-40" />
        <header className="relative z-10 flex items-center justify-between border-b border-white/[0.06] px-5 py-4 md:px-8">
          <BrandMark />
          <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-fog sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-mint shadow-[0_0_12px_#5AD1A8]" />
            {COPY.login.privateLabel}
          </div>
        </header>

        <div className="relative z-10 grid flex-1 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="flex flex-col justify-between border-b border-white/[0.06] p-6 md:p-10 lg:border-b-0 lg:border-r lg:p-14">
            <div className="max-w-xl animate-rise">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-ember/20 bg-ember/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ember">
                <span>{COPY.login.badgeLeft}</span><span className="text-fog">/</span><span>{COPY.login.badgeRight}</span>
              </div>
              <h1 className="font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.04em] text-bone sm:text-5xl md:text-6xl">
                {COPY.login.heroLine1}<br />
                <span className="text-gradient">{COPY.login.heroLine2}</span>
              </h1>
              <p className="mt-6 max-w-md text-sm leading-7 text-fog md:text-base">
                {COPY.login.heroBody}
              </p>

              <div className="mt-8 grid max-w-lg grid-cols-3 gap-2.5">
                <MiniStat value="01" label={COPY.login.statToday} />
                <MiniStat value="14D" label={COPY.login.statTrend} />
                <MiniStat value="XP" label={COPY.login.statXp} />
              </div>
            </div>

            <div className="mt-10 flex items-end justify-between">
              <p className="max-w-xs text-xs leading-5 text-fog/70">{COPY.login.heroNote}</p>
              <MascotStage name={mode === "in" ? "boss" : "grind"} size={138} className="hidden sm:grid" />
            </div>
          </section>

          <section className="grid place-items-center p-6 md:p-10 lg:p-14">
            <div className="w-full max-w-sm animate-rise">
              <div className="mb-7">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-ember">{COPY.login.accessLabel}</div>
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-bone">
                  {mode === "in" ? COPY.login.titleIn : COPY.login.titleUp}
                </h2>
                <p className="mt-2 text-sm text-fog">{mode === "in" ? COPY.login.subIn : COPY.login.subUp}</p>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-fog">{COPY.login.email}</span>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email"
                    placeholder="you@email.com"
                    className="auth-input w-full rounded-xl border border-line bg-ink/70 px-4 py-3.5 text-sm text-bone outline-none transition" />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-fog">{COPY.login.password}</span>
                  <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" autoComplete={mode === "in" ? "current-password" : "new-password"}
                    placeholder="••••••••"
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    className="auth-input w-full rounded-xl border border-line bg-ink/70 px-4 py-3.5 text-sm text-bone outline-none transition" />
                </label>
              </div>

              {msg && <p className="mt-4 rounded-xl border border-ember/20 bg-ember/[0.08] px-3 py-2.5 text-xs text-ember">{msg}</p>}

              <button onClick={submit} disabled={busy || !email || !pw}
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-ember px-4 py-3.5 text-sm font-bold text-ink shadow-[0_14px_30px_rgba(255,122,69,0.18)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:translate-y-0 disabled:opacity-40">
                {busy ? "..." : mode === "in" ? COPY.login.btnIn : COPY.login.btnUp}
                {!busy && <span className="transition-transform group-hover:translate-x-1">→</span>}
              </button>

              <button onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }}
                className="mt-5 w-full text-center text-xs text-fog transition hover:text-bone">
                {mode === "in" ? COPY.login.swapToUp : COPY.login.swapToIn}
              </button>

              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-fog/55">
                <span className="h-px w-8 bg-line" /> {COPY.login.dataNote} <span className="h-px w-8 bg-line" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-3">
      <div className="font-display text-lg font-extrabold text-bone">{value}</div>
      <div className="mt-0.5 text-[9px] uppercase tracking-wider text-fog">{label}</div>
    </div>
  );
}
