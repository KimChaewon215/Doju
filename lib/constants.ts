import type { TaskOption, StatusOption, RoutePoint, WantedLevel } from "@/types";

export const TASK_OPTIONS = [
  "졸업 프로젝트",
  "시험 공부",
  "과제",
  "취업 준비",
  "운동",
  "다이어트",
  "부모님께 전화",
  "방 청소",
  "메일 답장",
  "병원 예약",
  "치과 가기",
  "자격증 공부",
  "토익 공부",
  "면접 준비",
  "독서",
  "고백",
  "이별 통보",
];

export const STATUS_OPTIONS: StatusOption[] = [
  
  { name: "곧 할 예정", coefficient: 1.0 },
  { name: "조금만 쉬고 할 예정", coefficient: 1.2 },
  { name: "아직 여유 있음", coefficient: 1.4 },
  { name: "생각하기 싫음", coefficient: 1.7 },
  { name: "현실 부정 중", coefficient: 2.0 },
  { name: "기억에서 삭제함", coefficient: 2.3 },
  { name: "도망 성공", coefficient: 2.5 },
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
  { min: 50, max: 150, level: "요주의 인물", color: "#2196F3", bgColor: "#1a2a3a", emoji: "🔍" },
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
  { min: 50, max: 150, penalty: "아메리카노 쏘기", emoji: "☕" },
  { min: 150, max: 300, penalty: "점심 한 끼 사기", emoji: "🍱" },
  { min: 300, max: 500, penalty: "치킨 한 마리 쏘기", emoji: "🍗" },
  { min: 500, max: 1000, penalty: "1차 술자리 쏘기", emoji: "🍻" },
  { min: 1000, max: Infinity, penalty: "주말 풀코스 대접", emoji: "🗺️" },
];

export const INTERROGATION_REASONS = [
  "생각보다 침대가 너무 편했어요",
  "유튜브 한 편만 보려고 했어요",
  "시작하는 게 제일 어려웠어요",
  "준비가 덜 됐다고 느꼈어요",
  "완벽하게 하고 싶었어요",
  "마감이 아직 멀었다고 생각했어요",
  "망할까 봐 걱정됐어요",
  "할 일이 너무 적어서 긴장이 안 됐어요",
  "일단 도망치고 싶었어요",
  "현실을 외면하고 싶었어요",
  "왜 해야 하는지 모르겠어요",
  "나 말고 누군가 해줄 줄 알았어요",
  "갑자기 다른 일이 더 중요해졌어요",
  "기분이 안 내켰어요",
  "미루다 보니 여기까지 왔어요",
  "저도 제가 왜 이러는지 모르겠어요",
];

export const CHARACTERS = [
  "🏃", "👩‍💻", "🎓", "☠️",
  "👨‍🔬", "🧟", "🦸", "🐢", "🐌",
  "🦕", "🐕", "👽", "🐈","🦝"
];