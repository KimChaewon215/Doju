"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import WantedBadge from "@/components/WantedBadge";
import EscapeMap from "@/components/EscapeMap";
import { generatePrisonId, getSentence, getPenalty } from "@/lib/distance";

export default function StatusPage() {
  const router = useRouter();
  const { nickname, character, currentEscape } = useApp();
  const [activeTab, setActiveTab] = useState<"status" | "wanted" | "prison">("status");

  useEffect(() => {
    if (!nickname || !currentEscape) router.push("/");
  }, [nickname, currentEscape, router]);

  if (!currentEscape) return null;

  const tabStyle = (active: boolean) => ({
    flex: 1,
    padding: "18px",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Noto Sans KR', sans-serif",
    fontWeight: 600,
    fontSize: "15px",
    background: active ? "#FFD600" : "#000",
    color: active ? "#000" : "#fff",
  });

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{ background: "#FFD600", borderBottom: "3px solid #0A0A0A", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => router.push("/")} style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "20px", color: "#0A0A0A", background: "none", border: "none", cursor: "pointer" }}>
          🚔 도주거리
        </button>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            padding: "3px 10px",
            background: "#E8162E",
            color: "#fff",
            letterSpacing: "1px",
            borderRadius: "2px",
          }}
        >
          {currentEscape.wanted_level}
        </span>
      </nav>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "16px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", border: "1px solid #333", borderRadius: "2px", overflow: "hidden", marginBottom: "16px", fontFamily: "'Noto Sans KR', sans-serif"}}>
          <button style={tabStyle(activeTab === "status")} onClick={() => setActiveTab("status")}>현황</button>
          <button style={tabStyle(activeTab === "wanted")} onClick={() => setActiveTab("wanted")}>수배지</button>
          <button style={{ ...tabStyle(activeTab === "prison"), borderRight: "none" }} onClick={() => setActiveTab("prison")}>수감증</button>
        </div>

        {/* STATUS TAB */}
        {activeTab === "status" && (
          <div className="fade-up">
            {/* Distance hero */}
            <div style={{ textAlign: "center", padding: "16px 0 12px" }}>
              <div style={{ fontSize: "56px", marginBottom: "10px" }}>{character}</div>
              <div
                style={{
                  fontFamily: "'Black Han Sans', sans-serif",
                  fontSize: "72px",
                  color: "#FFD600",
                  lineHeight: 1,
                  textShadow: "4px 4px 0 rgba(255,214,0,0.15)",
                }}
              >
                {currentEscape.distance_km}
                <span style={{ fontSize: "24px", color: "#aaa", marginLeft: "4px" }}>km</span>
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", margin: "8px 0 4px" }}>
                {currentEscape.location}
              </div>
              <div style={{ fontSize: "12px", color: "#888" }}>현재 도주 중 🏃</div>
            </div>

            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", margin: "12px 0"}}>
              <WantedBadge level={currentEscape.wanted_level} km={currentEscape.distance_km} size="md" />
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", margin: "12px 0" }}>
              {[
                { val: `${currentEscape.days_escaped}일`, label: "도주 일수" },
                { val: `${currentEscape.distance_km}km`, label: "이동 거리" },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  style={{
                    background: "#111",
                    border: "1px solid #222",
                    borderRadius: "2px",
                    padding: "10px 6px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "18px", color: "#FFD600", lineHeight: 1, marginBottom: "4px" }}>
                    {val}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666", letterSpacing: "1px" }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div style={{ margin: "12px 0" }}>
              <EscapeMap distanceKm={currentEscape.distance_km} character={character} />
            </div>

            {/* Escape info */}
            <div
              style={{
                background: "#111",
                border: "1px solid #222",
                borderRadius: "2px",
                padding: "12px",
                marginBottom: "12px",
                fontSize: "13px",
                lineHeight: 2,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>죄목</span>
                <span style={{ fontWeight: 700, color: "#E8162E" }}>{currentEscape.task_name} 회피</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>도주 중 상태</span>
                <span style={{ fontWeight: 700 }}>{currentEscape.current_status}</span>
              </div>
            </div>

            {/* CTA buttons */}
            <button
              onClick={() => router.push("/surrender")}
              style={{
                width: "100%",
                background: "transparent",
                border: "2px solid #E8162E",
                color: "#E8162E",
                padding: "12px",
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: "16px",
                letterSpacing: "2px",
                cursor: "pointer",
                borderRadius: "2px",
                marginBottom: "8px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#E8162E"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#E8162E"; }}
            >
              🚨 자수하기
            </button>
            <button
              onClick={() => router.push("/escape")}
              style={{
                width: "100%",
                background: "#FFD600",
                border: "2px solid #0A0A0A",
                color: "#0A0A0A",
                padding: "12px",
                fontFamily: "'Noto Sans KR', sans-serif",
                fontSize: "14px",
                letterSpacing: "2px",
                cursor: "pointer",
                borderRadius: "2px",
              }}
            >
              + 새 도주 등록
            </button>
          </div>
        )}

        {/* WANTED TAB */}
        {activeTab === "wanted" && (
          <div className="fade-up">
            <WantedPosterTab />
          </div>
        )}

        {/* PRISON TAB */}
        {activeTab === "prison" && (
          <div className="fade-up">
            <PrisonCardTab />
          </div>
        )}
      </div>
    </div>
  );
}

function WantedPosterTab() {
  const { currentEscape, character, nickname } = useApp();
  const router = useRouter(); 
  const arrestMemo = (currentEscape as any)?.arrestMemo || "현실 복귀 시급";

  if (!currentEscape) return null;

  const shareText = `🚨 지명수배 🚨\n\n${nickname}이(가) "${currentEscape.task_name}"을(를) ${currentEscape.days_escaped}일째 회피 중!\n\n총 도주거리: ${currentEscape.distance_km}km\n현재위치: ${currentEscape.location}\n수배등급: ${currentEscape.wanted_level}\nAI 체포메모: ${arrestMemo}\n\n#도주거리 #${currentEscape.wanted_level}`;

  return (
    <div>
      <div
        id="poster-card"
        style={{
          background: "#F5F0E8",
          border: "3px solid #0A0A0A",
          borderRadius: "2px",
          overflow: "hidden",
          maxWidth: "360px",
          margin: "0 auto",
          fontFamily: "'Noto Sans KR', sans-serif",
          color: "#1A1208",
        }}
      >
        {/* Header */}
        <div style={{ background: "#E8162E", borderBottom: "3px solid #0A0A0A", padding: "12px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "26px", color: "#fff", letterSpacing: "5px" }}>🚨 지명수배 🚨</div>
        </div>
        <div style={{ padding: "14px" }}>
          {/* Mugshot */}
          <div style={{ width: "80px", height: "80px", background: "rgb(153,153,153)" , border: "3px solid #0A0A0A", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "44px", margin: "0 auto 10px", position: "relative", paddingBottom: "15px" }}>
            {character}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#0A0A0A", color: "#FFD600", fontSize: "9px", fontWeight: 700, textAlign: "center", padding: "2px", letterSpacing: "1px" }}>용의자</div>
          </div>
          {/* Name */}
          <div style={{ textAlign: "center", fontFamily: "'Black Han Sans',sans-serif", fontSize: "24px", marginBottom: "10px", letterSpacing: "2px" }}>{nickname}</div>
          {/* Distance */}
          <div style={{ textAlign: "center", margin: "0 0 12px", padding: "10px", border: "2px solid #0A0A0A", background: "#fff" }}>
            <div style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "40px", color: "#E8162E", lineHeight: 1 }}>{currentEscape.distance_km}km</div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#888", letterSpacing: "3px", marginTop: "2px" }}>총 도주거리</div>
          </div>
          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", borderTop: "1.5px solid #999", paddingTop: "10px" }}>
            {[
              { label: "죄목", val: `${currentEscape.task_name} 회피`, red: true },
              { label: "도주기간", val: `${currentEscape.days_escaped}일` },
              { label: "수배등급", val: currentEscape.wanted_level, red: true },
              { label: "최종목격지", val: currentEscape.location },
            ].map(({ label, val, red }) => (
              <div key={label}>
                <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: "#888", marginBottom: "2px" }}>{label}</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: red ? "#E8162E" : "#1A1208" }}>{val}</div>
              </div>
            ))}
          </div>
          {/* Reward */}
          <div style={{ background: "#FFD600", border: "2px solid #0A0A0A", padding: "8px", textAlign: "center", marginTop: "10px" }}>
            <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: "#666", marginBottom: "2px" }}> 체포 세부내용 </div>
            <div style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "16px", color: "#0A0A0A" }}>🚨 {arrestMemo}</div>
          </div>
          <div style={{ marginTop: "8px", fontSize: "9px", color: "#aaa", display: "flex", justifyContent: "space-between" }}>
            <span>도주거리.kr</span>
            <span>{new Date().toLocaleDateString("ko-KR")}</span>
          </div>
        </div>
      </div>

      {/* Share actions */}
      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <button
          onClick={async () => {
            const el = document.getElementById("poster-card");
            if (!el) return;
            try {
              const { default: h2c } = await import("html2canvas");
              const canvas = await h2c(el, { scale: 2, backgroundColor: null, logging: false });
              const a = document.createElement("a");
              a.download = `수배지_${nickname}.png`;
              a.href = canvas.toDataURL("image/png");
              a.click();
            } catch { alert("스크린샷으로 저장해주세요."); }
          }}
          style={{ flex: 1, background: "transparent", border: "1.5px solid #444", color: "#aaa", padding: "10px", fontSize: "12px", fontWeight: 700, cursor: "pointer", borderRadius: "2px" }}
        >
          ⬇️ PNG 저장
        </button>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(shareText);
            alert("클립보드에 복사되었습니다!");
          }}
          style={{ flex: 1, background: "transparent", border: "1.5px solid #444", color: "#aaa", padding: "10px", fontSize: "12px", fontWeight: 700, cursor: "pointer", borderRadius: "2px" }}
        >
          🔗 공유 텍스트
        </button>
      </div>

      <button
        onClick={() => router.push("/surrender")}
        style={{ width: "100%", background: "transparent", border: "2px solid #E8162E", color: "#E8162E", padding: "12px", fontFamily: "'Black Han Sans',sans-serif", fontSize: "15px", letterSpacing: "2px", cursor: "pointer", borderRadius: "2px", marginTop: "10px" }}
      >
        🚨 자수하기
      </button>
    </div>
  );
}

function PrisonCardTab() {
  const { currentEscape, character, nickname, currentVerdict } = useApp();
  const router = useRouter();

  const [aiMission, setAiMission] = useState("");
  const [loading, setLoading] = useState(true);

  const currentTask = currentEscape?.task_name || "";
  const dynamicFallback = currentTask 
    ? `오늘 안에 [${currentTask}] 목적을 위해\n최소 10분 이상 착수할 것`
    : "오늘 안에 현실을 마주하고\n10분 이상 착수할 것";

  useEffect(() => {
    if (!nickname || !currentEscape) return;

    const fetchLiveMission = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/reality-mission", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nickname,
            task: currentEscape.task_name,
            distance: currentEscape.distance_km,
            reason: currentEscape.current_status || "현실 도주",
            wantedLevel: currentEscape.wanted_level,
          }),
        });

        if (!res.ok) throw new Error("미션 패치 실패");
        const data = await res.json();
        
        if (data && data.mission) {
          if (typeof data.mission === "object") {
            // 🌟 중괄호 탈출을 위한 딥 파싱(Deep Parsing) 전술
            // Case 1: data.mission.text (일반적인 텍스트 필드)
            // Case 2: data.mission.content (API 응답 필드)
            // Case 3: data.mission.mission (내부에 동일한 이름의 키가 또 있을 경우)
            // Case 4: Gemini의 candidates[0].content.parts[0].text 구조 대응
            const rawText = 
              data.mission.text || 
              data.mission.content || 
              data.mission.mission || 
              data.mission.message ||
              data.mission.candidates?.[0]?.content?.parts?.[0]?.text;

            if (rawText) {
              setAiMission(rawText);
            } else {
              // 위 키값에 안 걸릴 경우, 백엔드가 내려준 Object의 첫 번째 Value를 강제로 추출
              const firstValue = Object.values(data.mission)[0];
              if (typeof firstValue === "string") {
                setAiMission(firstValue);
              } else {
                setAiMission(JSON.stringify(data.mission));
              }
            }
          } else {
            // 백엔드가 순수 string으로 내려줬을 때
            setAiMission(data.mission);
          }
        } else {
          setAiMission((currentVerdict as any)?.realityMission || dynamicFallback);
        }
      } catch (err) {
        console.error("실시간 미션 연동 오류:", err);
        setAiMission((currentVerdict as any)?.realityMission || dynamicFallback);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMission();
  }, [nickname, currentEscape, currentVerdict, dynamicFallback]);

  if (!currentEscape) return null;

  const prisonId = generatePrisonId(currentEscape.distance_km);
  const seed = currentEscape.distance_km;
  const barWidths = [1,2,1,3,1,2,2,1,3,1,1,2,1,2,3,1,1,2];

  return (
    <div>
      <div
        style={{
          background: "#1a1a2e",
          border: "1.5px solid #444",
          borderRadius: "4px",
          padding: "8px 12px",
          fontSize: "12px",
          color: "#aaa",
          marginBottom: "12px",
          lineHeight: 1.6,
        }}
      >
        ℹ️ 자수 후 판결이 완료되면 최종 수감증이 발급됩니다. 아래는 예상 수감증입니다.
      </div>
      <div id="prison-card-el" style={{ background: "#0A1628", border: "3px solid #FFD600", borderRadius: "6px", overflow: "hidden", maxWidth: "360px", margin: "0 auto", fontFamily: "'Noto Sans KR',sans-serif" }}>
        <div style={{ background: "#FFD600", padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "20px", color: "#0A0A0A", letterSpacing: "4px" }}>교도소</div>
          <div style={{ fontSize: "10px", color: "#555", letterSpacing: "3px" }}> CORRECTIONAL FACILITY</div>
        </div>
        <div style={{ padding: "16px", color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ width: "58px", height: "58px", background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.3)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "34px" }}>{character}</div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "18px", color: "#FFD600" }}>{prisonId}</div>
              <div style={{ fontSize: "20px", fontWeight: 900, marginTop: "2px" }}>{nickname}</div>
            </div>
          </div>
          {[
            { l: "죄목", v: `${currentEscape.task_name} 회피`, red: true },
            { l: "도주거리", v: `${currentEscape.distance_km}km`, yellow: true },
            { l: "도주기간", v: `${currentEscape.days_escaped}일` },
            { l: "최종목격지", v: currentEscape.location },
            { l: "수배등급", v: currentEscape.wanted_level, red: true },
          ].map(({ l, v, red, yellow }) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "0.5px solid rgba(255,255,255,0.1)", fontSize: "13px" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>{l}</span>
              <span style={{ fontWeight: 700, color: red ? "#ff6b6b" : yellow ? "#FFD600" : "#fff" }}>{v}</span>
            </div>
          ))}
          
          {/* 현실 복귀 명령 */}
          <div style={{ textAlign: "center", marginTop: "14px", padding: "12px", background: "rgba(255,214,0,0.08)", border: "1px solid rgba(255,214,0,0.3)", borderRadius: "4px" }}>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", letterSpacing: "3px", marginBottom: "6px" }}>현실 복귀 명령</div>
            <div 
              style={{ 
                fontFamily: "'Black Han Sans',sans-serif", 
                fontSize: "16px", 
                color: "#FFD600",
                lineHeight: 1.4,
                whiteSpace: "pre-line"
              }}
            >
              {loading ? "수사관 분석 중..." : aiMission}
            </div>
          </div>
          
          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <div style={{ display: "flex", gap: "2px", height: "24px", alignItems: "flex-end" }}>
              {barWidths.map((w, i) => (
                <div key={i} style={{ width: `${w*2}px`, height: `${12 + ((seed*(i+1))%12)}px`, background: "rgba(255,255,255,0.4)", borderRadius: "1px" }} />
              ))}
            </div>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "3px" }}>DOJU-2026-{String(seed).padStart(6,"0")}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <button
          onClick={async () => {
            const el = document.getElementById("prison-card-el");
            if (!el) return;
            try {
              const { default: h2c } = await import("html2canvas");
              const canvas = await h2c(el, { scale: 2, backgroundColor: null, logging: false });
              const a = document.createElement("a");
              a.download = `수감증_${nickname}.png`;
              a.href = canvas.toDataURL("image/png");
              a.click();
            } catch { alert("스크린샷으로 저장해주세요."); }
          }}
          style={{ flex: 1, background: "transparent", border: "1.5px solid #444", color: "#aaa", padding: "10px", fontSize: "12px", fontWeight: 700, cursor: "pointer", borderRadius: "2px" }}
        >
          ⬇️ PNG 저장
        </button>
      </div>
      <button
        onClick={() => router.push("/surrender")}
        style={{ width: "100%", background: "transparent", border: "2px solid #E8162E", color: "#E8162E", padding: "12px", fontFamily: "'Black Han Sans',sans-serif", fontSize: "15px", letterSpacing: "2px", cursor: "pointer", borderRadius: "2px", marginTop: "10px" }}
      >
        🚨 자수하기
      </button>
    </div>
  );
}