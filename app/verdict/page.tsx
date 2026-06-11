"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/lib/store";
import { getSentence } from "@/lib/distance";
import { createVerdict } from "@/lib/supabase";
import type { Verdict } from "@/types";

function VerdictContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "말하기 싫음";

  const { nickname, character, currentEscape, currentVerdict, setCurrentVerdict } = useApp();
  const [loading, setLoading] = useState(true);
  const [verdictText, setVerdictText] = useState("");
  const [sentence, setSentence] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!nickname || !currentEscape) { router.push("/"); return; }
    generateVerdict();
  }, []);

  async function generateVerdict() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          taskName: currentEscape!.task_name,
          daysEscaped: currentEscape!.days_escaped,
          distanceKm: currentEscape!.distance_km,
          location: currentEscape!.location,
          currentStatus: currentEscape!.current_status,
          wantedLevel: currentEscape!.wanted_level,
          reason,
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setVerdictText(data.verdictText);
      setSentence(data.sentence);

      // Save to Supabase
      let verdict: Verdict;
      try {
        verdict = await createVerdict({
          escape_id: currentEscape!.id,
          interrogation_answer: reason,
          verdict_text: data.verdictText,
          sentence: data.sentence,
        }) as Verdict;
      } catch {
        verdict = {
          id: crypto.randomUUID(),
          escape_id: currentEscape!.id,
          interrogation_answer: reason,
          verdict_text: data.verdictText,
          sentence: data.sentence,
          created_at: new Date().toISOString(),
        };
      }
      setCurrentVerdict(verdict);
    } catch {
      // Fallback to local verdict generation
      const fallback = generateFallbackVerdict(
        nickname,
        currentEscape!.task_name,
        currentEscape!.days_escaped,
        currentEscape!.distance_km,
        currentEscape!.location,
        currentEscape!.current_status,
        reason
      );
      setVerdictText(fallback.text);
      setSentence(fallback.sentence);
      setError(true);
    }
    setLoading(false);
  }

  function generateFallbackVerdict(
    nick: string,
    task: string,
    days: number,
    km: number,
    loc: string,
    status: string,
    r: string
  ) {
    const sent = getSentence(km, days);
    const isHeavy = status.includes("넷플릭스") || status.includes("게임");
    const isSympatheticReason = r.includes("어려") || r.includes("무서");

    const text = `피고인 ${nick}은(는) "${task}"을(를) ${days}일간 회피하여 총 ${km}km를 도주하였다.

최종 검거 위치는 ${loc}이며, 도주 당시 "${status}" 상태였음이 확인되었다.

피고인은 심문에서 "${r}"고 진술하였다.${isSympatheticReason ? `

이에 법원은 "${r}"이라는 사유가 인간적으로 충분히 납득 가능하다고 판단, 이를 감경 사유로 인정한다.` : ""}${isHeavy ? `

그러나 도주 중 고강도 여가 활동("${status}")이 확인되어 이는 가중 처벌 사유에 해당한다.` : ""}

피고인이 자진 자수한 점을 고려하여 형을 감경한다.`;

    return { text, sentence: sent };
  }

  if (loading) {
    return (
      <div style={{ background: "#0A0A0A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚖️</div>
          <div style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "18px", color: "#FFD600", letterSpacing: "2px", marginBottom: "8px" }}>
            판결문 작성 중...
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>판사가 심각하게 고민하고 있습니다</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <nav style={{ background: "#FFD600", borderBottom: "3px solid #0A0A0A", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "20px", color: "#0A0A0A" }}>⚖️ 판결문</span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#0A0A0A", opacity: 0.7 }}>{character} {nickname}</span>
      </nav>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div style={{ fontSize: "11px", color: "#FFD600", letterSpacing: "4px", fontWeight: 700, marginBottom: "4px" }}>
            대한민국 현실법원
          </div>
          <div style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "28px", color: "#fff", letterSpacing: "3px" }}>
            판결문
          </div>
        </div>

        {error && (
          <div style={{ background: "#1a1500", borderLeft: "3px solid #FFD600", padding: "8px 12px", fontSize: "11px", color: "#aaa", marginBottom: "12px" }}>
            ※ OpenAI API 미연결 — 로컬 판결문이 적용되었습니다
          </div>
        )}

        {/* Verdict card */}
        <div
          id="verdict-card"
          style={{
            background: "#F5F0E8",
            border: "2px solid #0A0A0A",
            borderRadius: "2px",
            padding: "20px",
            color: "#1A1208",
            fontFamily: "'Noto Sans KR', sans-serif",
            lineHeight: 2,
          }}
          className="fade-up"
        >
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#888", marginBottom: "4px" }}>
              판결일: {new Date().toLocaleDateString("ko-KR")}
            </div>
            <div style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "22px", color: "#0A0A0A", letterSpacing: "2px" }}>
              주 문
            </div>
          </div>

          <div
            style={{ whiteSpace: "pre-wrap", fontSize: "14px", lineHeight: 2 }}
            dangerouslySetInnerHTML={{ __html: verdictText.replace(/\n/g, "<br/>") }}
          />

          <div
            style={{
              textAlign: "center",
              background: "#fff8e0",
              border: "2px solid #ccc",
              padding: "14px",
              borderRadius: "2px",
              marginTop: "16px",
            }}
          >
            <div style={{ fontSize: "11px", color: "#888", letterSpacing: "2px", marginBottom: "6px" }}>
              선고
            </div>
            <div style={{ fontFamily: "'Black Han Sans',sans-serif", fontSize: "26px", color: "#E8162E" }}>
              {sentence}
            </div>
            <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
              단, 착한 행동 시 즉시 감형 가능
            </div>
          </div>

          <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px dashed #ccc", display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#aaa" }}>
            <span>대한민국 현실법원</span>
            <span>판사: 김현실</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <button
            onClick={async () => {
              const el = document.getElementById("verdict-card");
              if (!el) return;
              try {
                const { default: h2c } = await import("html2canvas");
                const canvas = await h2c(el, { scale: 2, backgroundColor: null, logging: false });
                const a = document.createElement("a");
                a.download = `판결문_${nickname}.png`;
                a.href = canvas.toDataURL("image/png");
                a.click();
              } catch { alert("스크린샷으로 저장해주세요."); }
            }}
            style={{ flex: 1, background: "transparent", border: "1.5px solid #444", color: "#aaa", padding: "10px", fontSize: "12px", fontWeight: 700, cursor: "pointer", borderRadius: "2px" }}
          >
            ⬇️ PNG 저장
          </button>
          <button
            onClick={generateVerdict}
            style={{ flex: 1, background: "transparent", border: "1.5px solid #444", color: "#aaa", padding: "10px", fontSize: "12px", fontWeight: 700, cursor: "pointer", borderRadius: "2px" }}
          >
            🔄 재판결
          </button>
        </div>

        <button
          onClick={() => router.push("/prison-card")}
          style={{
            width: "100%",
            background: "#E8162E",
            color: "#fff",
            border: "none",
            padding: "14px",
            fontFamily: "'Black Han Sans', sans-serif",
            fontSize: "18px",
            letterSpacing: "2px",
            cursor: "pointer",
            borderRadius: "2px",
            marginTop: "10px",
          }}
        >
          🏛️ 수감증 받기
        </button>
        <button
          onClick={() => router.push("/status")}
          style={{ width: "100%", background: "transparent", border: "1.5px solid #333", color: "#666", padding: "10px", fontSize: "13px", fontWeight: 700, cursor: "pointer", borderRadius: "2px", marginTop: "8px", fontFamily: "'Noto Sans KR',sans-serif" }}
        >
          ← 현황으로
        </button>
      </div>
    </div>
  );
}

export default function VerdictPage() {
  return (
    <Suspense fallback={
      <div style={{ background: "#0A0A0A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#FFD600", fontFamily: "'Black Han Sans',sans-serif" }}>로딩 중...</div>
      </div>
    }>
      <VerdictContent />
    </Suspense>
  );
}