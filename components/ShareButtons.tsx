"use client";

import { useState, RefObject } from "react";

interface Props {
  cardRef: RefObject<HTMLDivElement>;
  filename: string;
  shareText: string;
}

export default function ShareButtons({ cardRef, filename, shareText }: Props) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const a = document.createElement("a");
      a.download = filename;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) {
      console.error(e);
      alert("저장 중 오류가 발생했습니다. 스크린샷을 이용해주세요.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("클립보드 접근이 허용되지 않았습니다.");
    }
  }

  const btnStyle: React.CSSProperties = {
    flex: 1,
    background: "transparent",
    border: "1.5px solid #444",
    color: "#aaa",
    padding: "10px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1px",
    cursor: "pointer",
    borderRadius: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.15s",
    fontFamily: "'Noto Sans KR', sans-serif",
  };

  return (
    <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
      <button
        onClick={handleDownload}
        disabled={downloading}
        style={btnStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#FFD600";
          e.currentTarget.style.color = "#FFD600";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#444";
          e.currentTarget.style.color = "#aaa";
        }}
      >
        ⬇️ {downloading ? "저장 중..." : "PNG 저장"}
      </button>
      <button
        onClick={handleCopy}
        style={btnStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#FFD600";
          e.currentTarget.style.color = "#FFD600";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#444";
          e.currentTarget.style.color = "#aaa";
        }}
      >
        {copied ? "✓ 복사됨" : "🔗 텍스트 복사"}
      </button>
    </div>
  );
}