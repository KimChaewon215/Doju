"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { CHARACTERS } from "@/lib/constants";
import { upsertUser } from "@/lib/supabase";

export default function HomePage() {
  const router = useRouter();
  const { userId, setNickname, setCharacter, character } = useApp();
  const [nickValue, setNickValue] = useState("");
  const [selectedChar, setSelectedChar] = useState(CHARACTERS[0]);
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleStart() {
    if (!nickValue.trim()) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      inputRef.current?.focus();
      return;
    }
    setLoading(true);
    setNickname(nickValue.trim());
    setCharacter(selectedChar);

    try {
      await upsertUser(userId, nickValue.trim(), selectedChar);
    } catch {
      // Supabase not configured — continue anyway
    }
    router.push("/escape");
  }

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", color: "#fff" }}>
      {/* Nav */}
      <nav
        style={{
          background: "#FFD600",
          borderBottom: "3px solid #0A0A0A",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "'Black Han Sans', sans-serif",
            fontSize: "22px",
            color: "#0A0A0A",
          }}
        >
          🚔 도주거리
        </span>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#0A0A0A",
            opacity: 0.6,
            letterSpacing: "1px",
          }}
        >
          전국 도주 추적 시스템
        </span>
      </nav>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "28px" }} className="fade-up">
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: "13px",
              color: "#FFD600",
              letterSpacing: "4px",
              marginBottom: "10px",
            }}
          >
            ⚠ 전국 수배 시스템 가동 중 ⚠
          </div>
          <h1
            style={{
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: "52px",
              lineHeight: 1.05,
              color: "#fff",
              marginBottom: "12px",
              letterSpacing: "-1px",
            }}
          >
            도주거리
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#aaa",
              lineHeight: 1.7,
            }}
          >
            당신은 현재 인생으로부터
            <br />
            <strong style={{ color: "#FFD600" }}>몇 km</strong> 도망친 상태인가요?
          </p>
        </div>

        {/* Form card */}
        <div
          style={{
            background: "#F5F0E8",
            border: "2px solid #0A0A0A",
            borderRadius: "2px",
            padding: "20px",
            color: "#1A1208",
            position: "relative",
          }}
          className="fade-up"
        >
          {/* Badge */}
          <div
            style={{
              position: "absolute",
              top: "-12px",
              left: "14px",
              background: "#FFD600",
              padding: "2px 10px",
              fontSize: "10px",
              fontWeight: 700,
              color: "#0A0A0A",
              border: "1.5px solid #0A0A0A",
              letterSpacing: "1px",
            }}
          >
            사건번호 2026-ESCAPE
          </div>

          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "2px",
              color: "#666",
              marginBottom: "6px",
            }}
          >
            피의자 성명
          </label>
          <input
            ref={inputRef}
            value={nickValue}
            onChange={(e) => setNickValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            placeholder="닉네임을 입력하세요"
            maxLength={10}
            className={shaking ? "shake" : ""}
            style={{
              width: "100%",
              border: "2px solid #0A0A0A",
              borderRadius: "2px",
              padding: "10px 12px",
              fontSize: "18px",
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: 700,
              background: "#fff",
              color: "#1A1208",
              marginBottom: "16px",
              outline: "none",
            }}
          />

          <label
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "2px",
              color: "#666",
              marginBottom: "8px",
            }}
          >
            용의자 캐릭터 선택
          </label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            {CHARACTERS.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedChar(c)}
                style={{
                  width: "46px",
                  height: "46px",
                  border: `2px solid ${selectedChar === c ? "#E8162E" : "#ccc"}`,
                  borderRadius: "4px",
                  background: selectedChar === c ? "#fff0f0" : "#fff",
                  fontSize: "24px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#aaa" : "#E8162E",
              color: "#fff",
              border: "none",
              padding: "14px",
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: "20px",
              letterSpacing: "3px",
              cursor: loading ? "default" : "pointer",
              borderRadius: "2px",
            }}
          >
             {loading ? "잠시만요..." : `${selectedChar} 도주 시작`}
          </button>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            background: "#1a1500",
            borderLeft: "3px solid #FFD600",
            padding: "10px 14px",
            fontSize: "12px",
            color: "#aaa",
            marginTop: "14px",
            lineHeight: 1.7,
          }}
        >
          ※ 이 서비스는 도주를 권장하지 않습니다.<br />
          ※ 그러나 이미 도망치고 있는 당신을 위해 존재합니다.<br />
        </div>

        {/* Stats flavor text */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "8px",
          }}
        >
          {[
            { n: "12,847", label: "현재 도주 중" },
            { n: "4,291km", label: "최장 도주거리" },
            { n: "인터폴 적색수배", label: "최고 수배등급" },
          ].map(({ n, label }) => (
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
              <div
                style={{
                  fontFamily: "'Black Han Sans', sans-serif",
                  fontSize: "16px",
                  color: "#FFD600",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                {n}
              </div>
              <div style={{ fontSize: "10px", color: "#666", letterSpacing: "1px" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}