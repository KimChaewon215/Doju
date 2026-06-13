"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { TASK_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";
import {
  calculateDistance,
  getWantedLevel,
  getPenalty,
  getCurrentLocation,
} from "@/lib/distance";
import { createEscape } from "@/lib/supabase";
import type { Escape } from "@/types";

export default function EscapePage() {
  const router = useRouter();
  const { userId, nickname, character, setCurrentEscape } = useApp();

  const [taskName, setTaskName] = useState("");
  const [taskDiff, setTaskDiff] = useState(6);
  const [days, setDays] = useState(3);
  const [statusName, setStatusName] = useState("");
  const [statusCoef, setStatusCoef] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [customTask, setCustomTask] = useState("");
  const [customTasks, setCustomTasks] = useState<string[]>([]);


  // Redirect if no nickname
  if (!nickname) {
    if (typeof window !== "undefined") router.push("/");
    return null;
  }

  const finalTask = taskName;
  const finalDiff = taskDiff;

  const previewDistance =
    finalTask && statusCoef
      ? calculateDistance(finalDiff, days, statusCoef)
      : null;

  const canAddTask = customTask.trim().length > 0;

     function handleAddTask() {
      const value = customTask.trim();

      if (!value) return;

      if (
        TASK_OPTIONS.includes(value) ||
        customTasks.includes(value)
      ) {
        return;
      }

      setCustomTasks((prev) => [...prev, value]);

      setTaskName(value);
      setCustomTask("");
    }

  async function handleSubmit() {
    if (!finalTask) { setError("도망치는 일을 선택하거나 입력해주세요."); return; }
    if (!statusCoef) { setError("현재 상태를 선택해주세요."); return; }
    setError("");
    setLoading(true);

    const distance = calculateDistance(finalDiff, days, statusCoef);
    const wantedLevel = getWantedLevel(distance);
    const penalty = getPenalty(distance);
    const location = getCurrentLocation(distance);

    const escapePayload = {
      user_id: userId,
      task_name: finalTask,
      task_difficulty: finalDiff,
      days_escaped: days,
      current_status: statusName,
      status_coefficient: statusCoef,
      distance_km: distance,
      wanted_level: wantedLevel,
      penalty: penalty.penalty,
      location: location.name,
    };

    let escape: Escape;
    try {
      escape = await createEscape(escapePayload) as Escape;
    } catch {
      // Supabase not set up — create local object
      escape = {
        id: crypto.randomUUID(),
        is_captured: false,
        captured_at: null,
        created_at: new Date().toISOString(),
        start_date: new Date().toISOString(),
        ...escapePayload,
      } as Escape;
    }

    setCurrentEscape(escape);
    router.push("/status");
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "2px",
    color: "#666",
    marginBottom: "8px",
  };

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{ background: "#FFD600", borderBottom: "3px solid #0A0A0A", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => router.push("/")} style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "20px", color: "#0A0A0A", background: "none", border: "none", cursor: "pointer" }}>
          🚔 도주거리
        </button>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#0A0A0A", opacity: 0.7 }}>{character} {nickname}</span>
      </nav>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "20px 16px" }}>
        <div
          style={{
            fontFamily: "'Black Han Sans', sans-serif",
            fontSize: "16px",
            color: "#FFD600",
            letterSpacing: "3px",
            marginBottom: "16px",
            paddingBottom: "10px",
            borderBottom: "1px solid #222",
          }}
        >
          📋 도주 등록서
        </div>

        <div
          style={{
            background: "#F5F0E8",
            border: "2px solid #0A0A0A",
            borderRadius: "2px",
            padding: "20px",
            color: "#1A1208",
          }}
          className="fade-up"
        >
          {/* Task selection */}
          <label style={labelStyle}>도망치는 일</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "10px" }}>
            {[...TASK_OPTIONS, ...customTasks].map((t) => (              <button
                key={t}
                onClick={() => {
                  setTaskName(t);
                  setCustomTask("");
                }}
                style={{
                  background: taskName === t && !customTask ? "#FFD600" : "#fff",
                  border: `1.5px solid ${
                    taskName === t && !customTask ? "#0A0A0A" : "#ccc"
                  }`,
                  color: "#1A1208",
                  padding: "6px 12px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  borderRadius: "2px",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <input
              value={customTask}
              onChange={(e) => setCustomTask(e.target.value)}
              placeholder="직접 입력..."
              style={{
                flex: 1,
                border: "2px solid #ccc",
                borderRadius: "2px",
                padding: "8px 10px",
                fontSize: "14px",
                fontFamily: "'Noto Sans KR', sans-serif",
                background: "#f9f9f0",
                color: "#1A1208",
                outline: "none",
              }}
            />

           <button
              onClick={handleAddTask}
              disabled={!canAddTask}
              style={{
                background: canAddTask ? "#FFD600" : "#ddd",
                border: "2px solid #0A0A0A",
                borderRadius: "2px",
                padding: "0 14px",
                fontWeight: 900,
                cursor: canAddTask ? "pointer" : "not-allowed",
                color: canAddTask ? "#0A0A0A" : "#888",
                whiteSpace: "nowrap",
                opacity: canAddTask ? 1 : 0.6,
                transition: "all 0.15s",
              }}
            >
              등록
            </button>
          </div>


          <label style={labelStyle}>체감 난이도</label>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #ddd",
                  padding: "14px",
                  borderRadius: "2px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    fontSize: "13px",
                    color: "#666",
                  }}
                >
                  <span>
                    {
                      ["😌 쉬움", "🙂 보통", "😨 어려움", "💀 악몽"][
                        Math.min(3, Math.floor((taskDiff - 1) / 3))
                      ]
                    }
                  </span>

                  <strong
                    style={{
                      color: "#E8162E",
                      fontSize: "20px",
                    }}
                  >
                    {taskDiff}
                  </strong>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={taskDiff}
                  onChange={(e) => setTaskDiff(Number(e.target.value))}
                  style={{
                    width: "100%",
                    accentColor: "#E8162E",
                    cursor: "pointer",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "#999",
                    marginTop: "4px",
                  }}
                >
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>
          
          
          {/* Days */}
          <label style={labelStyle}>도주 경과일</label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <button
              onClick={() => setDays(Math.max(1, days - 1))}
              style={{ background: "#ddd", border: "none", width: "36px", height: "44px", fontSize: "20px", cursor: "pointer", borderRadius: "2px", color: "#333" }}
            >
              −
            </button>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              max={365}
              style={{
                flex: 1,
                background: "#fff",
                border: "2px solid #0A0A0A",
                color: "#1A1208",
                padding: "8px",
                fontSize: "24px",
                fontWeight: 700,
                textAlign: "center",
                borderRadius: "2px",
                outline: "none",
                fontFamily: "'Black Han Sans', sans-serif",
              }}
            />
            <button
              onClick={() => setDays(days + 1)}
              style={{ background: "#ddd", border: "none", width: "36px", height: "44px", fontSize: "20px", cursor: "pointer", borderRadius: "2px", color: "#333" }}
            >
              +
            </button>
            <span style={{ color: "#666", fontWeight: 700, fontSize: "14px" }}>일</span>
          </div>

          {/* Status */}
          <label style={labelStyle}>현재 상태</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.name}
                onClick={() => { setStatusName(s.name); setStatusCoef(s.coefficient); }}
                style={{
                  background: statusName === s.name ? "#FFD600" : "#fff",
                  border: `1.5px solid ${statusName === s.name ? "#0A0A0A" : "#ccc"}`,
                  color: "#1A1208",
                  padding: "6px 12px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  borderRadius: "2px",
                  transition: "all 0.15s",
                }}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Preview distance */}
          {previewDistance !== null && (
            <div
              style={{
                background: "#fff",
                border: "2px solid #E8162E",
                borderRadius: "2px",
                padding: "12px",
                textAlign: "center",
                marginBottom: "14px",
              }}
            >
              <div style={{ fontSize: "11px", color: "#aaa", letterSpacing: "2px", marginBottom: "4px" }}>
                예상 도주거리
              </div>
              <div style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "36px", color: "#E8162E", lineHeight: 1 }}>
                {previewDistance}km
              </div>
              <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
                = {finalDiff} × {days}일 × {statusCoef} × 5
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: "#fff0f0", border: "1px solid #ffaaaa", padding: "8px 12px", borderRadius: "2px", fontSize: "13px", color: "#E8162E", marginBottom: "12px" }}>
              ⚠ {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#aaa" : "#E8162E",
              color: "#fff",
              border: "none",
              padding: "14px",
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: "18px",
              letterSpacing: "2px",
              cursor: loading ? "default" : "pointer",
              borderRadius: "2px",
            }}
          >
            {loading ? "계산 중..." : "📍 도주 거리 계산"}
          </button>
          <button
            onClick={() => router.push("/")}
            style={{
              width: "100%",
              background: "transparent",
              border: "1.5px solid #ccc",
              color: "#666",
              padding: "10px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              borderRadius: "2px",
              marginTop: "8px",
              fontFamily: "'Noto Sans KR', sans-serif",
            }}
          >
            ← 뒤로
          </button>
        </div>
      </div>
    </div>
  );
}