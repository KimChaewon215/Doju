import type { TaskOption, StatusOption, RoutePoint, WantedLevel } from "@/types";

export const TASK_OPTIONS: TaskOption[] = [
  { name: "DB 과제", difficulty: 7 },
  { name: "졸업 프로젝트", difficulty: 10 },
  { name: "시험 공부", difficulty: 8 },
  { name: "고백하기", difficulty: 9 },
  { name: "운동하기", difficulty: 4 },
  { name: "과제", difficulty: 6 },
  { name: "취업 준비", difficulty: 9 },
  { name: "청소하기", difficulty: 3 },
  { name: "다이어트", difficulty: 5 },
  { name: "부모님께 전화", difficulty: 6 },
];

export const STATUS_OPTIONS: StatusOption[] = [
  { name: "멍때리는 중", coefficient: 1.1 },
  { name: "유튜브 보는 중", coefficient: 1.2 },
  { name: "야구 보는 중", coefficient: 1.3 },
  { name: "게임 하는 중", coefficient: 1.4 },
  { name: "넷플릭스 보는 중", coefficient: 1.5 },
];

export const ROUTE_POINTS: RoutePoint[] = [
  { name: "서울 홍대", km: 0, lat: 37.5563, lng: 126.9238 },
  { name: "서울 강남", km: 15, lat: 37.4979, lng: 127.0276 },
  { name: "수원", km: 40, lat: 37.2636, lng: 127.0286 },
  { name: "평택", km: 80, lat: 37.0017, lng: 127.1128 },
  { name: "천안", km: 100, lat: 36.8151, lng: 127.1139 },
  { name: "대전", km: 150, lat: 36.3504, lng: 127.3845 },
  { name: "대구", km: 300, lat: 35.8714, lng: 128.6014 },
  { name: "부산", km: 450, lat: 35.1796, lng: 129.0756 },
  { name: "후쿠오카", km: 550, lat: 33.5904, lng: 130.4017 },
  { name: "오사카", km: 700, lat: 34.6937, lng: 135.5023 },
  { name: "도쿄", km: 900, lat: 35.6762, lng: 139.6503 },
  { name: "태평양 횡단 중", km: 1200, lat: 35.0, lng: 160.0 },
  { name: "하와이", km: 1500, lat: 21.3069, lng: -157.8583 },
  { name: "LA", km: 1800, lat: 34.0522, lng: -118.2437 },
  { name: "멕시코", km: 2200, lat: 23.6345, lng: -102.5528 },
];

export interface WantedLevelConfig {
  min: number;
  max: number;
  level: WantedLevel;
  color: string;
  bgColor: string;
  emoji: string;
}

export const WANTED_LEVELS: WantedLevelConfig[] = [
  { min: 0, max: 50, level: "관심", color: "#4CAF50", bgColor: "#1a3a1a", emoji: "👀" },
  { min: 50, max: 150, level: "요주의", color: "#2196F3", bgColor: "#1a2a3a", emoji: "🔍" },
  { min: 150, max: 300, level: "수배", color: "#FF9800", bgColor: "#3a1a00", emoji: "⚠️" },
  { min: 300, max: 500, level: "전국지명수배", color: "#E8162E", bgColor: "#3a0000", emoji: "🚨" },
  { min: 500, max: Infinity, level: "인터폴 적색수배", color: "#fff", bgColor: "#E8162E", emoji: "🌍" },
];

export interface PenaltyConfig {
  min: number;
  max: number;
  penalty: string;
  emoji: string;
}

export const PENALTIES: PenaltyConfig[] = [
  { min: 0, max: 50, penalty: "편의점 음료 한 잔", emoji: "🧃" },
  { min: 50, max: 150, penalty: "아이스 아메리카노 쏘기", emoji: "☕" },
  { min: 150, max: 300, penalty: "점심 한 끼 사기", emoji: "🍱" },
  { min: 300, max: 500, penalty: "치킨 한 마리 책임지기", emoji: "🍗" },
  { min: 500, max: 1000, penalty: "1차 술자리 책임지기", emoji: "🍻" },
  { min: 1000, max: Infinity, penalty: "주말 풀코스 카페 투어", emoji: "🗺️" },
];

export const INTERROGATION_REASONS = [
  "하기 싫었어요",
  "너무 어려웠어요",
  "귀찮았어요",
  "무서웠어요",
  "내일 하려고 했어요",
  "컨디션이 안 좋았어요",
];

export const CHARACTERS = [
  "🏃", "👩‍💻", "🧑‍🎓", "🕵️", "🤠",
  "👨‍🔬", "👩‍🚀", "🧟", "🦸", "🐢",
];