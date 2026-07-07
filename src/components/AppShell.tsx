"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";
import Mascot from "./Mascot";

const NAV = [
  { href: "/", label: "Dashboard", icon: "◎" },
  { href: "/habits", label: "Habits", icon: "✓" },
  { href: "/life", label: "Life", icon: "▲" },
  { href: "/daily", label: "Бүртгэл", icon: "◐" },
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
    <div className="min-h-screen pb-24 md:pb-0 md:pl-56">
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-56 flex-col border-r border-line bg-panel/40 backdrop-blur px-4 py-6">
        <BrandMark />
        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition
                ${path === n.href ? "bg-ember/15 text-ember" : "text-fog hover:text-bone hover:bg-panel2"}`}>
              <span className="w-4 text-center">{n.icon}</span>{n.label}
            </Link>
          ))}
        </nav>
        <button onClick={() => supabase.auth.signOut()}
          className="mt-auto text-left text-xs text-fog hover:text-ember px-3 py-2">Гарах →</button>
      </aside>

      <main className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">{children}</main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 border-t border-line bg-ink/90 backdrop-blur flex">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-[11px]
              ${path === n.href ? "text-ember" : "text-fog"}`}>
            <span className="text-base leading-none">{n.icon}</span>{n.label}
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
