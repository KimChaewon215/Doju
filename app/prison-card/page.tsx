"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { generatePrisonId } from "@/lib/distance";
import { getPenalty } from "@/lib/distance";

export default function PrisonCardPage() {
  const router = useRouter();
  const { nickname, character, currentEscape, currentVerdict } = useApp();

  // 복잡한 다중 상태를 없애고, 최종 출력할 한 줄 명령 변수만 상태로 관리합니다.
  const [displayMission, setDisplayMission] = useState("");

  useEffect(() => {
    // 1. 세션 예외 처리 및 방어 코드
    if (!nickname || !currentEscape) {
      router.push("/");
      return;
    }

    // 2. 죄목 기반의 즉시 사용 가능한 동적 폴백 문장 생성
    const currentTask = currentEscape.task_name || "";
    const dynamicFallback = currentTask 
      ? `오늘 안에 [${currentTask}] 목적을 위해\n최소 10분 이상 착수할 것`
      : "오늘 안에 현실을 마주하고\n10분 이상 착수할 것";

    // 3. 백엔드 분리 라우터 직접 통신 및 미션 수령 함수 정의
    const syncRealityMission = async () => {
      try {
        const response = await fetch("/api/reality-mission", {
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

        if (!response.ok) throw new Error("네트워크 응답 불량");
        
        const data = await response.json();
        
        // 백엔드가 준 mission 텍스트가 확인되면 최우선 반영, 없으면 동적 폴백 적용
        if (data && data.mission) {
          setDisplayMission(data.mission);
        } else {
          setDisplayMission((currentVerdict as any)?.realityMission || dynamicFallback);
        }
      } catch (err) {
        console.error("현실 복귀 명령 동기화 실패:", err);
        // 통신 장실패 시에도 '과제 파일' 대신 '운동 회피' 등 맥락에 맞는 폴백 자동 세팅
        setDisplayMission((currentVerdict as any)?.realityMission || dynamicFallback);
      }
    };

    syncRealityMission();
  }, [nickname, currentEscape, currentVerdict, router]);

  // 스토어 상태가 준비되기 전 비정상 접근 방어
  if (!currentEscape) return null;

  const prisonId = generatePrisonId(currentEscape.distance_km);
  const penalty = getPenalty(currentEscape.distance_km);
  const seed = currentEscape.distance_km;
  const barWidths = [1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 2, 3, 1, 1, 2, 2, 1];

  const shareText = `🏛️ 교도소 수감증\n\n수감번호: ${prisonId}\n죄목: ${currentEscape.task_name} 회피\n도주거리: ${currentEscape.distance_km}km\n수배등급: ${currentEscape.wanted_level}\n형량: ${displayMission || "현실 복귀 시급"}\n\n#도주거리 #교도소`;

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <nav style={{ background: "#FFD600", borderBottom: "3px solid #0A0A0A", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => router.push("/")} style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "20px", color: "#0A0A0A", background: "none", border: "none", cursor: "pointer" }}>
          🚨 수감증
        </button>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#0A0A0A", opacity: 0.7 }}>{character} {nickname}</span>
      </nav>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: "14px" }}>
          <div style={{ fontSize: "11px", color: "#FFD600", letterSpacing: "4px", fontWeight: 700 }}>
            판결 완료 — 수감증 발급
          </div>
        </div>

        {/* Prison card */}
        <div
          id="final-prison-card"
          style={{
            background: "#0A1628",
            border: "3px solid #FFD600",
            borderRadius: "6px",
            overflow: "hidden",
            maxWidth: "360px",
            margin: "0 auto",
            fontFamily: "'Noto Sans KR', sans-serif",
          }}
          className="fade-up"
        >
          <div style={{ background: "#FFD600", padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "20px", color: "#0A0A0A", letterSpacing: "4px" }}>교도소</div>
            <div style={{ fontSize: "10px", color: "#555", letterSpacing: "3px" }}>HONGIK CORRECTIONAL FACILITY</div>
          </div>

          <div style={{ padding: "16px", color: "#fff" }}>
            {/* ID Row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ width: "60px", height: "60px", background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.3)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>
                {character}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "18px", color: "#FFD600" }}>{prisonId}</div>
                <div style={{ fontSize: "22px", fontWeight: 900, marginTop: "2px" }}>{nickname}</div>
              </div>
            </div>

            {/* Info rows */}
            {[
              { l: "죄목", v: `${currentEscape.task_name} 회피`, red: true },
              { l: "도주거리", v: `${currentEscape.distance_km}km`, yellow: true },
              { l: "도주기간", v: `${currentEscape.days_escaped}일` },
              { l: "최종목격지", v: currentEscape.location },
              { l: "수배등급", v: currentEscape.wanted_level, red: true },
              { l: "도주 당시 상태", v: currentEscape.current_status },
              { l: "AI 체포메모",  v: (currentEscape as any).arrestMemo || "현실 복귀 시급",   yellow: true },
            ].map(({ l, v, red, yellow }) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "0.5px solid rgba(255,255,255,0.1)", fontSize: "13px" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>{l}</span>
                <span style={{ fontWeight: 700, color: red ? "#ff6b6b" : yellow ? "#FFD600" : "#fff", textAlign: "right", maxWidth: "55%" }}>{v}</span>
              </div>
            ))}

            {/* Sentence */}
            <div
              style={{
                textAlign: "center",
                marginTop: "14px",
                padding: "14px",
                background: "rgba(255,214,0,0.08)",
                border: "1px solid rgba(255,214,0,0.3)",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "3px",
                  marginBottom: "8px",
                }}
              >
                AI 현실 복귀 명령
              </div>

              {/* 스위칭 비용이 전혀 없는 유일 지점 상태 변수를 즉시 매핑 */}
              <div
                style={{
                  fontFamily: "'Black Han Sans',sans-serif",
                  fontSize: "18px",
                  color: "#FFD600",
                  lineHeight: 1.6,
                  whiteSpace: "pre-line"
                }}
              >
                {displayMission || "추적국 분석 중..."}
              </div>
            </div>

            {/* Barcode */}
            <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{ display: "flex", gap: "2px", height: "28px", alignItems: "flex-end" }}>
                {barWidths.map((w, i) => (
                  <div key={i} style={{ width: `${w*2}px`, height: `${12 + ((seed*(i+1))%12)}px`, background: "rgba(255,255,255,0.4)", borderRadius: "1px" }} />
                ))}
              </div>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "3px" }}>
                HJI-2026-{String(seed).padStart(6, "0")}
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: "10px", textAlign: "center", fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "2px" }}>
              도주거리.kr — {new Date().toLocaleDateString("ko-KR")}
            </div>
          </div>
        </div>

        {/* Share actions */}
        <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
          <button
            onClick={async () => {
              const el = document.getElementById("final-prison-card");
              if (!el) return;
              try {
                const { default: h2c } = await import("html2canvas");
                const canvas = await h2c(el, { scale: 2, backgroundColor: null, logging: false });
                const a = document.createElement("a");
                a.download = `수감증_${nickname}_${currentEscape.distance_km}km.png`;
                a.href = canvas.toDataURL("image/png");
                a.click();
              } catch { alert("스크린샷으로 저장해주세요."); }
            }}
            style={{ flex: 1, background: "transparent", border: "1.5px solid #444", color: "#aaa", padding: "12px", fontSize: "13px", fontWeight: 700, cursor: "pointer", borderRadius: "2px" }}
          >
            ⬇️ PNG 저장
          </button>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(shareText);
              alert("공유 텍스트가 클립보드에 복사되었습니다!");
            }}
            style={{ flex: 1, background: "transparent", border: "1.5px solid #444", color: "#aaa", padding: "12px", fontSize: "13px", fontWeight: 700, cursor: "pointer", borderRadius: "2px" }}
          >
            🔗 공유
          </button>
        </div>

        {/* Restart */}
        <div style={{ marginTop: "12px", padding: "14px", background: "#111", border: "1px solid #222", borderRadius: "2px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
            이미 다음 도주를 계획 중이신가요?
          </div>
          <button
            onClick={() => router.push("/escape")}
            style={{ background: "#FFD600", border: "2px solid #0A0A0A", color: "#0A0A0A", padding: "10px 20px", fontFamily: "'Black Han Sans',sans-serif", fontSize: "14px", letterSpacing: "2px", cursor: "pointer", borderRadius: "2px" }}
          >
            🏃 새 도주 시작
          </button>
        </div>
      </div>
    </div>
  );
}