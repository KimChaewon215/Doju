"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import { getWantedLevelConfig } from "@/lib/distance";

export default function Navbar() {
  const { nickname, currentEscape } = useApp();

  const levelConfig = currentEscape
    ? getWantedLevelConfig(currentEscape.distance_km)
    : null;

  return (
    <nav
      style={{ background: "#FFD600", borderBottom: "3px solid #0A0A0A" }}
      className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
    >
      <Link href="/" className="font-display text-xl text-black tracking-tight">
        🚔 도주거리
      </Link>

      <div className="flex items-center gap-2">
        {nickname && (
          <span className="text-xs font-bold text-black opacity-70">
            {nickname}
          </span>
        )}
        {levelConfig && currentEscape && !currentEscape.is_captured && (
          <span
            className="text-xs font-bold px-2 py-1 rounded-sm text-white"
            style={{ background: "#E8162E", letterSpacing: "1px" }}
          >
            {levelConfig.level}
          </span>
        )}
      </div>
    </nav>
  );
}