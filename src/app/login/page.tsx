"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { BrandMark } from "@/components/AppShell";
import Mascot from "@/components/Mascot";

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
        setMsg("Бүртгэл үүслээ. Одоо нэвтэрч ор.");
        setMode("in");
      }
    } catch (e: any) {
      setMsg(e.message === "Invalid login credentials" ? "И-мэйл эсвэл нууц үг буруу." : e.message);
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-sm animate-rise">
        <div className="flex flex-col items-center mb-8 gap-4">
          <Mascot name={mode === "in" ? "hype" : "grind"} size={96} className="animate-rise" />
          <BrandMark />
        </div>

        <div className="rounded-2xl border border-line bg-panel/60 backdrop-blur p-6">
          <h1 className="font-display text-2xl font-extrabold text-bone">
            {mode === "in" ? "Буцаж ирлээ." : "Grind эхэлье."}
          </h1>
          <p className="text-fog text-sm mt-1 mb-6">
            {mode === "in" ? "Өдрийн бүртгэлээ нээ." : "Зөвхөн чиний нүд харна. Хэн ч биш."}
          </p>

          <label className="block text-xs text-fog mb-1.5">И-мэйл</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email"
            className="w-full mb-4 rounded-lg bg-ink border border-line px-3 py-2.5 text-bone outline-none focus:border-ember transition" />

          <label className="block text-xs text-fog mb-1.5">Нууц үг</label>
          <input value={pw} onChange={(e) => setPw(e.target.value)} type="password"
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="w-full mb-5 rounded-lg bg-ink border border-line px-3 py-2.5 text-bone outline-none focus:border-ember transition" />

          {msg && <p className="text-xs text-ember mb-4">{msg}</p>}

          <button onClick={submit} disabled={busy || !email || !pw}
            className="w-full rounded-lg bg-ember text-ink font-semibold py-2.5 hover:brightness-110 disabled:opacity-40 transition">
            {busy ? "..." : mode === "in" ? "Нэвтрэх" : "Бүртгүүлэх"}
          </button>

          <button onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }}
            className="w-full text-center text-xs text-fog hover:text-bone mt-4 transition">
            {mode === "in" ? "Шинэ хэрэглэгч үү? Бүртгүүлэх" : "Аль хэдийн бүртгэлтэй? Нэвтрэх"}
          </button>
        </div>
        <p className="text-center text-[11px] text-fog/60 mt-6 tracking-wide">killah.ongod.space</p>
      </div>
    </div>
  );
}
