"use client";
// ONGOD 👽 mascot — brand identity.
// Нэрс: boss, grind, hope, shrug, angry, cute, hype
export default function Mascot({ name, size = 80, className = "", style }:
  { name: string; size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/mascot/${name}.png`} alt="ONGOD" width={size} height={size}
      className={className} style={{ objectFit: "contain", ...style }} draggable={false} />
  );
}
