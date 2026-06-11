import { ROUTE_POINTS, WANTED_LEVELS, PENALTIES } from "./constants";
import type { WantedLevel, RoutePoint } from "@/types";

export const BASE_MULTIPLIER = 5;

export function calculateDistance(
  taskDifficulty: number,
  daysEscaped: number,
  statusCoefficient: number
): number {
  const raw = taskDifficulty * daysEscaped * statusCoefficient * BASE_MULTIPLIER;
  return Math.round(raw);
}

export function getWantedLevel(km: number): WantedLevel {
  const found = WANTED_LEVELS.find((l) => km >= l.min && km < l.max);
  return found ? found.level : "인터폴 적색수배";
}

export function getWantedLevelConfig(km: number) {
  return (
    WANTED_LEVELS.find((l) => km >= l.min && km < l.max) ||
    WANTED_LEVELS[WANTED_LEVELS.length - 1]
  );
}

export function getPenalty(km: number) {
  return (
    PENALTIES.find((p) => km >= p.min && km < p.max) ||
    PENALTIES[PENALTIES.length - 1]
  );
}

export function getCurrentLocation(km: number): RoutePoint {
  let loc = ROUTE_POINTS[0];
  for (let i = ROUTE_POINTS.length - 1; i >= 0; i--) {
    if (km >= ROUTE_POINTS[i].km) {
      loc = ROUTE_POINTS[i];
      break;
    }
  }
  return loc;
}

export function getPassedLocations(km: number): RoutePoint[] {
  return ROUTE_POINTS.filter((r) => km >= r.km);
}

export function getSentence(km: number, days: number): string {
  if (km < 50) return "경고 1회";
  if (km < 150) return `봉사활동 ${Math.max(1, Math.round(days / 2))}시간`;
  if (km < 300) return `징역 ${Math.max(1, days)}일`;
  if (km < 500) return `징역 ${days}일 (집행유예)`;
  if (km < 1000) return `징역 ${days}일 + 사회봉사`;
  return "중형 선고 예정 (자수 감형 적용)";
}

export function generatePrisonId(km: number): string {
  const year = new Date().getFullYear();
  return `#${year}-${String(km).padStart(4, "0")}`;
}