"use client";

import { forwardRef } from "react";
import type { Escape } from "@/types";
import { getPenalty, getWantedLevelConfig } from "@/lib/distance";

interface Props {
  escape: Escape;
  character: string;
  showStamp?: boolean;
}

const WantedPoster = forwardRef<HTMLDivElement, Props>(
  ({ escape, character, showStamp = false }, ref) => {
    const penalty = getPenalty(escape.distance_km);
    const levelConfig = getWantedLevelConfig(escape.distance_km);

    return (
      <div
        ref={ref}
        className="paper-texture relative overflow-hidden"
        style={{
          border: "3px solid #0A0A0A",
          borderRadius: "2px",
          maxWidth: "360px",
          margin: "0 auto",
          fontFamily: "'Noto Sans KR', sans-serif",
          color: "#1A1208",
        }}
      >
        {/* Red header */}
        <div
          style={{
            background: "#E8162E",
            borderBottom: "3px solid #0A0A0A",
            padding: "12px 16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: "11px",
              color: "rgba(255,255,255,0.8)",
              letterSpacing: "4px",
              marginBottom: "4px",
            }}
          >
            대한민국 경찰청 NATIONAL POLICE
          </div>
          <div
            style={{
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: "28px",
              color: "#fff",
              letterSpacing: "6px",
              textShadow: "2px 2px 0 rgba(0,0,0,0.3)",
            }}
          >
            🚨 지명수배 🚨
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "16px" }}>
          {/* Mugshot */}
          <div
            style={{
              width: "88px",
              height: "88px",
              background: "#ddd",
              border: "3px solid #0A0A0A",
              borderRadius: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "50px",
              margin: "0 auto 12px",
              position: "relative",
            }}
          >
            {character}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "#0A0A0A",
                color: "#FFD600",
                fontSize: "9px",
                fontWeight: 700,
                textAlign: "center",
                padding: "2px",
                letterSpacing: "1px",
              }}
            >
              용의자
            </div>
          </div>

          {/* Name */}
          <div
            style={{
              textAlign: "center",
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: "26px",
              color: "#0A0A0A",
              marginBottom: "12px",
              letterSpacing: "3px",
            }}
          >
            {escape.task_name.includes(
              escape.task_name.slice(-1)
            )
              ? escape.task_name
              : escape.task_name}
          </div>

          {/* Distance big */}
          <div
            style={{
              textAlign: "center",
              margin: "0 0 12px",
              padding: "10px",
              border: "2px solid #0A0A0A",
              background: "#fff",
            }}
          >
            <div
              style={{
                fontFamily: "'Black Han Sans', sans-serif",
                fontSize: "42px",
                color: "#E8162E",
                lineHeight: 1,
              }}
            >
              {escape.distance_km}km
            </div>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#888",
                letterSpacing: "3px",
                marginTop: "4px",
              }}
            >
              총 도주거리
            </div>
          </div>

          {/* Info grid */}
          <div
            style={{
              borderTop: "1.5px solid #999",
              paddingTop: "10px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <div
                style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: "#888", marginBottom: "2px" }}
              >
                죄목
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#E8162E" }}>
                {escape.task_name} 회피
              </div>
            </div>
            <div>
              <div
                style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: "#888", marginBottom: "2px" }}
              >
                도주기간
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700 }}>
                {escape.days_escaped}일째 도주 중
              </div>
            </div>
            <div>
              <div
                style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: "#888", marginBottom: "2px" }}
              >
                수배등급
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: levelConfig.color,
                }}
              >
                {escape.wanted_level}
              </div>
            </div>
            <div>
              <div
                style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: "#888", marginBottom: "2px" }}
              >
                최종목격지
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700 }}>
                {escape.location}
              </div>
            </div>
          </div>

          {/* Reward / Penalty */}
          <div
            style={{
              background: "#FFD600",
              border: "2px solid #0A0A0A",
              padding: "10px",
              textAlign: "center",
              marginTop: "12px",
            }}
          >
            <div
              style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: "#666", marginBottom: "2px" }}
            >
              검거 시 제공해야 할 벌칙
            </div>
            <div
              style={{
                fontFamily: "'Black Han Sans', sans-serif",
                fontSize: "17px",
                color: "#0A0A0A",
              }}
            >
              {penalty.emoji} {penalty.penalty}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "10px",
              paddingTop: "8px",
              borderTop: "1px dashed #ccc",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "9px",
              color: "#aaa",
              letterSpacing: "1px",
            }}
          >
            <span>도주거리.kr</span>
            <span>{new Date().toLocaleDateString("ko-KR")}</span>
          </div>
        </div>

        {/* Captured stamp (optional) */}
        {showStamp && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-18deg)",
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: "32px",
              color: "#C0392B",
              border: "5px solid #C0392B",
              padding: "4px 14px",
              borderRadius: "4px",
              opacity: 0.6,
              whiteSpace: "nowrap",
              letterSpacing: "4px",
              pointerEvents: "none",
            }}
          >
            검거완료
          </div>
        )}
      </div>
    );
  }
);

WantedPoster.displayName = "WantedPoster";
export default WantedPoster;