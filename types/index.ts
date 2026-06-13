export type WantedLevel =
  | "관심"
  | "요주의 인물"
  | "일반 수배"
  | "전국지명수배"
  | "인터폴 적색수배";

export interface User {
  id: string;
  nickname: string;
  character: string;
  created_at: string;
}

export interface Escape {
  id: string;
  user_id: string;
  task_name: string;
  task_difficulty: number;
  start_date: string;
  days_escaped: number;
  current_status: string;
  status_coefficient: number;
  distance_km: number;
  wanted_level: WantedLevel;
  penalty: string;
  location: string;
  is_captured: boolean;
  captured_at: string | null;
  created_at: string;
}

export interface Verdict {
  id: string;
  escape_id: string;
  interrogation_answer: string;
  verdict_text: string;
  sentence: string;
  created_at: string;
}

export interface TaskOption {
  name: string;
  difficulty: number;
}

export interface StatusOption {
  name: string;
  coefficient: number;
}

export interface RoutePoint {
  name: string;
  km: number;
  lat: number;
  lng: number;
}

export interface EscapeFormData {
  taskName: string;
  taskDifficulty: number;
  daysEscaped: number;
  currentStatus: string;
  statusCoefficient: number;
}

// @/types 파일 내의 Verdict 정의 부분
export interface Verdict {
  id: string; // 혹은 number
  escape_id: string;
  interrogation_answer: string;
  verdict_text: string;
  sentence: string;
  
  // ⭐ 이 줄을 인터페이스 내부에 추가해 줍니다.
  realityMission?: string; 
}