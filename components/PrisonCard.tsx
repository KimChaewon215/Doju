"use client";

import { forwardRef } from "react";
import type { Escape } from "@/types";
import { getSentence, generatePrisonId, getWantedLevelConfig } from "@/lib/distance";

interface Props {
  escape: Escape;
  character: string;
  sentence?: string;
}

const PrisonCard = forwardRef<HTMLDivElement, Props>(
  ({ escape, character, sentence }, ref) => {
    const displaySentence = sentence || getSentence(escape.distance_km, escape.days_escaped);
    const prisonId = generatePrisonId(escape.distance_km);
    const levelConfig = getWantedLevelConfig(escape.distance_km);

    // Generate barcode bars from distance
    const barWidths = [1,2,1,3,1,2,2,1,3,1,1,2,1,2,3,1,1,2,2,1];
    const seed = escape.distance_km;

    return (
      <div
        ref={ref}
        style={{
          background: "#0A1628",
          border: "3px solid #FFD600",
          borderRadius: "6px",
          maxWidth: "360px",
          margin: "0 auto",
          overflow: "hidden",
          color: "#fff",
          fontFamily: "'Noto Sans KR', sans-serif",
        }}
      >
        {/* Yellow header */}
        <div
          style={{
            background: "#FFD600",
            padding: "14px 16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: "20px",
              color: "#0A0A0A",
              letterSpacing: "4px",
              marginBottom: "2px",
            }}
          >
            교도소
          </div>
          <div style={{ fontSize: "10px", color: "#555", letterSpacing: "3px" }}>
            HONGIK CORRECTIONAL FACILITY
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "16px" }}>
          {/* ID row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "14px",
              paddingBottom: "12px",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "rgba(255,255,255,0.1)",
                border: "2px solid rgba(255,255,255,0.3)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
              }}
            >
              {character}
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontFamily: "'Black Han Sans', sans-serif",
                  fontSize: "20px",
                  color: "#FFD600",
                  letterSpacing: "1px",
                }}
              >
                {prisonId}
              </div>
              <div style={{ fontSize: "22px", fontWeight: 900, color: "#fff", marginTop: "2px" }}>
                {escape.task_name} 회피범
              </div>
            </div>
          </div>

          {/* Info rows */}
          {[
            { label: "죄목", value: `${escape.task_name} 회피`, red: true },
            { label: "도주거리", value: `${escape.distance_km}km`, yellow: true },
            { label: "도주기간", value: `${escape.days_escaped}일` },
            { label: "최종목격지", value: escape.location },
            {
              label: "수배등급",
              value: escape.wanted_level,
              style: { color: levelConfig.color },
            },
            { label: "도주 당시 상태", value: escape.current_status },
          ].map(({ label, value, red, yellow, style }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "7px 0",
                borderBottom: "0.5px solid rgba(255,255,255,0.1)",
                fontSize: "13px",
              }}
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontWeight: 700,
                  textAlign: "right",
                  maxWidth: "60%",
                  color: red ? "#ff6b6b" : yellow ? "#FFD600" : "#fff",
                  ...style,
                }}
              >
                {value}
              </span>
            </div>
          ))}

          {/* Sentence */}
          <div
            style={{
              textAlign: "center",
              marginTop: "16px",
              padding: "12px",
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
                marginBottom: "6px",
              }}
            >
              선고 형량
            </div>
            <div
              style={{
                fontFamily: "'Black Han Sans', sans-serif",
                fontSize: "24px",
                color: "#FFD600",
              }}
            >
              {displaySentence}
            </div>
          </div>

          {/* Barcode */}
          <div
            style={{
              marginTop: "14px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <div style={{ display: "flex", gap: "2px", height: "28px", alignItems: "flex-end" }}>
              {barWidths.map((w, i) => {
                const h = 12 + ((seed * (i + 1)) % 12);
                return (
                  <div
                    key={i}
                    style={{
                      width: `${w * 2}px`,
                      height: `${h}px`,
                      background: "rgba(255,255,255,0.4)",
                      borderRadius: "1px",
                    }}
                  />
                );
              })}
            </div>
            <div
              style={{
                fontSize: "9px",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "3px",
              }}
            >
              HJI-2026-{String(seed).padStart(6, "0")}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "12px",
              textAlign: "center",
              fontSize: "9px",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "2px",
            }}
          >
            도주거리.kr — {new Date().toLocaleDateString("ko-KR")}
          </div>
        </div>
      </div>
    );
  }
);

PrisonCard.displayName = "PrisonCard";
export default PrisonCard;