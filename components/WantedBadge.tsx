import { getWantedLevelConfig } from "@/lib/distance";
import type { WantedLevel } from "@/types";

interface Props {
  level: WantedLevel;
  km: number;
  size?: "sm" | "md" | "lg";
}

export default function WantedBadge({ level, km, size = "md" }: Props) {
  const config = getWantedLevelConfig(km);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  const isInterpol = level === "인터폴 적색수배";

  return (
    <span
      className={`font-display rounded-sm inline-block tracking-widest ${sizeClasses[size]} ${isInterpol ? "badge-pulse" : ""}`}
      style={{
        background: config.bgColor,
        color: config.color,
        border: `2px solid ${config.color}`,
        letterSpacing: "2px",
      }}
    >
      {config.emoji} {level}
    </span>
  );
}