"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { INTERROGATION_REASONS } from "@/lib/constants";
import { captureEscape } from "@/lib/supabase";

export default function SurrenderPage() {
  const router = useRouter();
  const { nickname, character, currentEscape, setCurrentEscape } = useApp();
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!nickname || !currentEscape) router.push("/");
  }, []);

  if (!currentEscape) return null;

  const finalReason = customReason.trim() || selectedReason;

  async function handleSurrender() {
    if (!finalReason) { alert("심문에 답변해주세요."); return; }
    setLoading(true);
    try {
      const updated = await captureEscape(currentEscape!.id);
      setCurrentEscape({ ...currentEscape!, ...updated });
    } catch {
      setCurrentEscape({ ...currentEscape!, is_captured: true, captured_at: new Date().toISOString() });
    }
    // Navigate to interrogation/verdict
    router.push(`/verdict?reason=${encodeURIComponent(finalReason)}`);
  }

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <nav style={{ background: "#E8162E", borderBottom: "3px solid #0A0A0A", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "20px", color: "#fff", letterSpacing: "2px" }}>🚨 검거 완료</span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{character} {nickname}</span>
      </nav>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "20px 16px" }}>
        {/* Capture banner */}
        <div style={{ textAlign: "center", padding: "24px 0 16px" }} className="fade-up">
          <div style={{ fontSize: "60px", marginBottom: "12px" }}>🚨</div>
          <div style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "30px", color: "#E8162E", marginBottom: "8px", letterSpacing: "3px" }}>
            검거 완료
          </div>
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
            도주가 종료됩니다. 심문을 시작합니다.
          </div>

          {/* Final record */}
          <div
            style={{
              background: "#111",
              border: "1px solid #333",
              borderRadius: "2px",
              padding: "14px",
              textAlign: "left",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "0.5px solid #222", fontSize: "13px" }}>
              <span style={{ color: "#666" }}>죄목</span>
              <span style={{ fontWeight: 700, color: "#E8162E" }}>{currentEscape.task_name} 회피</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "0.5px solid #222", fontSize: "13px" }}>
              <span style={{ color: "#666" }}>총 도주거리</span>
              <span style={{ fontWeight: 700, color: "#FFD600", fontSize: "18px", fontFamily: "'Black Han Sans',sans-serif" }}>
                {currentEscape.distance_km}km
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "13px" }}>
              <span style={{ color: "#666" }}>최종 검거 위치</span>
              <span style={{ fontWeight: 700 }}>{currentEscape.location}</span>
            </div>
          </div>
        </div>

        {/* Interrogation */}
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
          <div
            style={{
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: "16px",
              letterSpacing: "2px",
              marginBottom: "14px",
              paddingBottom: "10px",
              borderBottom: "1.5px solid #ccc",
            }}
          >
            ⚖️ 심문
          </div>
          <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "14px" }}>
            "{nickname}" — 왜 도망쳤습니까?
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
            {INTERROGATION_REASONS.map((r) => (
              <button
                key={r}
                onClick={() => { setSelectedReason(r); setCustomReason(""); }}
                style={{
                  background: selectedReason === r && !customReason ? "#FFD600" : "#fff",
                  border: `1.5px solid ${selectedReason === r && !customReason ? "#0A0A0A" : "#ccc"}`,
                  color: "#1A1208",
                  padding: "6px 12px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  borderRadius: "2px",
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <textarea
            value={customReason}
            onChange={(e) => { setCustomReason(e.target.value); setSelectedReason(""); }}
            placeholder="직접 진술하기..."
            style={{
              width: "100%",
              border: "2px solid #ccc",
              borderRadius: "2px",
              padding: "10px",
              fontSize: "14px",
              fontFamily: "'Noto Sans KR', sans-serif",
              resize: "vertical",
              height: "72px",
              marginBottom: "14px",
              outline: "none",
              background: "#f9f9f0",
              color: "#1A1208",
            }}
          />

          <button
            onClick={handleSurrender}
            disabled={loading || !finalReason}
            style={{
              width: "100%",
              background: loading || !finalReason ? "#aaa" : "#E8162E",
              color: "#fff",
              border: "none",
              padding: "14px",
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: "18px",
              letterSpacing: "2px",
              cursor: loading || !finalReason ? "default" : "pointer",
              borderRadius: "2px",
            }}
          >
            {loading ? "판결 준비 중..." : "⚖️ 판결문 받기"}
          </button>
          <button
            onClick={() => router.push("/status")}
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
            ← 아직 도망가겠습니다
          </button>
        </div>
      </div>
    </div>
  );
}