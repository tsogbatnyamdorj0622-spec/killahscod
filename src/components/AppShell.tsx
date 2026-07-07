"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";

const NAV = [
  { href: "/", label: "Dashboard", icon: "◎" },
  { href: "/habits", label: "Habits", icon: "✓" },
  { href: "/mood", label: "Mood", icon: "◐" },
  { href: "/projects", label: "Projects", icon: "▲" },
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
        <div className="h-10 w-10 rounded-full border-2 border-line border-t-ember animate-spin" />
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-56">
      {/* desktop sidebar */}
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
          className="mt-auto text-left text-xs text-fog hover:text-ember px-3 py-2">
          Гарах →
        </button>
      </aside>

      <main className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">{children}</main>

      {/* mobile bottom nav */}
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
      <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-ember to-emberdim grid place-items-center">
        <span className="font-display font-extrabold text-ink text-sm">K</span>
        <div className="absolute inset-0 rounded-lg animate-glow shadow-[0_0_20px_rgba(255,122,69,0.5)]" />
      </div>
      <div className="leading-none">
        <div className="font-display font-extrabold tracking-tight text-bone">KILLAH</div>
        <div className="text-[10px] text-fog tracking-[0.2em] uppercase">grind ledger</div>
      </div>
    </div>
  );
}
