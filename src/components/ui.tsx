"use client";
import React from "react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`surface-glass rounded-[20px] border border-white/[0.07] backdrop-blur-xl ${className}`}>{children}</div>;
}

export function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <h2 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-fog">{children}</h2>
      {right}
    </div>
  );
}

export function StatTile({ label, value, sub, accent = "bone" }:
  { label: string; value: React.ReactNode; sub?: string; accent?: string }) {
  const color: Record<string, string> = {
    bone: "text-bone", ember: "text-ember", mint: "text-mint", gold: "text-gold", violet: "text-violet",
  };
  return (
    <Card className="p-4">
      <div className="text-[11px] uppercase tracking-wider text-fog">{label}</div>
      <div className={`font-display text-3xl font-extrabold tnum mt-1 ${color[accent] ?? "text-bone"}`}>{value}</div>
      {sub && <div className="text-xs text-fog mt-0.5">{sub}</div>}
    </Card>
  );
}

// Signature: нар мандах progress ring
export function SunriseRing({ pct, size = 140, label, value }:
  { pct: number; size?: number; label?: string; value?: string }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(1, pct)));
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="sun" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F2C14E" />
            <stop offset="55%" stopColor="#FF7A45" />
            <stop offset="100%" stopColor="#B84E28" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#262A38" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke="url(#sun)" strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.2,.8,.2,1)" }} />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-3xl font-extrabold text-bone tnum">{value ?? `${Math.round(pct * 100)}%`}</div>
        {label && <div className="text-[11px] text-fog uppercase tracking-wider">{label}</div>}
      </div>
    </div>
  );
}
