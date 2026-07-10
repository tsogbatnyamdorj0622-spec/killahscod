"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";
import { COPY } from "@/lib/copy";
import Mascot from "./Mascot";

const NAV = [
  { href: "/", label: COPY.nav.dashboard, icon: "◎" },
  { href: "/habits", label: COPY.nav.habits, icon: "✓" },
  { href: "/life", label: COPY.nav.life, icon: "▲" },
  { href: "/daily", label: COPY.nav.daily, icon: "◐" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!loading && !session) router.replace("/login");
  }, [loading, session, router]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="flex flex-col items-center gap-3">
          <Mascot name="grind" size={64} className="animate-glow" />
          <div className="h-1 w-24 rounded-full bg-line overflow-hidden">
            <div className="h-full w-1/3 bg-ember animate-pulse" />
          </div>
        </div>
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-[272px]">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[272px] flex-col border-r border-white/[0.06] bg-panel/35 px-5 py-6 backdrop-blur-xl md:flex">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"><BrandMark /></div>
        <div className="mt-7 px-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-fog/60">Цэс</div>
        <nav className="mt-3 flex flex-col gap-1.5">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className={`group flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm transition
                ${path === n.href ? "border-ember/20 bg-ember/[0.09] text-bone shadow-[inset_3px_0_0_#FF7A45]" : "border-transparent text-fog hover:border-white/[0.05] hover:bg-white/[0.025] hover:text-bone"}`}>
              <span className={`grid h-7 w-7 place-items-center rounded-lg text-xs transition ${path === n.href ? "bg-ember text-ink" : "bg-panel2 text-fog group-hover:text-bone"}`}>{n.icon}</span>
              <span className="font-medium">{n.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/[0.06] bg-gradient-to-br from-ember/[0.09] to-transparent p-4">
          <div className="text-[9px] uppercase tracking-[0.2em] text-ember">Өнөөдрийн бүртгэл</div>
          <div className="mt-2 font-display text-sm font-bold leading-5 text-bone">Хэдхэн минут<br />хангалттай.</div>
        </div>
        <button onClick={() => supabase.auth.signOut()}
          className="mt-3 rounded-xl px-3 py-2 text-left text-xs text-fog transition hover:bg-white/[0.025] hover:text-ember">{COPY.nav.logout}</button>
      </aside>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10 lg:px-10">{children}</main>

      <nav className="fixed bottom-3 left-3 right-3 z-20 flex overflow-hidden rounded-2xl border border-white/[0.08] bg-ink/90 shadow-2xl shadow-black/40 backdrop-blur-xl md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href}
            className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px]
              ${path === n.href ? "text-ember" : "text-fog"}`}>
            <span className={`grid h-6 w-6 place-items-center rounded-md text-sm leading-none ${path === n.href ? "bg-ember/10" : ""}`}>{n.icon}</span>{n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <Mascot name="boss" size={34} />
      <div className="leading-none">
        <div className="font-display font-extrabold tracking-tight text-bone">KILLAH</div>
        <div className="text-[10px] text-fog tracking-[0.2em] uppercase">by ongod 👽</div>
      </div>
    </div>
  );
}
