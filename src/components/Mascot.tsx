"use client";
import type { CSSProperties } from "react";

// ONGOD 👽 mascot — brand identity.
// Нэрс: boss, grind, hope, shrug, angry, cute, hype
export default function Mascot({ name, size = 80, className = "", style }:
  { name: string; size?: number; className?: string; style?: CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/mascot/${name}.png`} alt="ONGOD" width={size} height={size}
      className={className} style={{ objectFit: "contain", ...style }} draggable={false} />
  );
}

export function MascotStage({ name, size = 96, accent = "#FF7A45", className = "", compact = false }:
  { name: string; size?: number; accent?: string; className?: string; compact?: boolean }) {
  const stageSize = size + (compact ? 30 : 54);
  const stageStyle = {
    width: stageSize,
    height: stageSize,
    "--mascot-accent": accent,
  } as CSSProperties;

  return (
    <div className={`mascot-stage relative grid shrink-0 place-items-center ${className}`} style={stageStyle} aria-hidden="true">
      <span className="mascot-halo pointer-events-none absolute inset-[14%] rounded-full" />
      <span className="mascot-orbit pointer-events-none absolute inset-[6%] rounded-full" />
      <span className="mascot-platform pointer-events-none absolute bottom-[9%] h-[11%] w-[58%] rounded-full" />
      <Mascot name={name} size={size} className="mascot-float relative z-10" />
    </div>
  );
}
