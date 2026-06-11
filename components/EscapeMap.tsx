"use client";

import { useEffect, useRef, useState } from "react";
import { getCurrentLocation, getPassedLocations } from "@/lib/distance";
import { ROUTE_POINTS } from "@/lib/constants";

interface Props {
  distanceKm: number;
  character: string;
}

declare global {
  interface Window {
    kakao: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

export default function EscapeMap({ distanceKm, character }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    function initMap() {
      if (!window.kakao || !mapRef.current) return;

      try {
        window.kakao.maps.load(() => {
          if (!mapRef.current) return;

          const currentLoc = getCurrentLocation(distanceKm);
          const center = new window.kakao.maps.LatLng(
            currentLoc.lat,
            currentLoc.lng
          );

          const map = new window.kakao.maps.Map(mapRef.current, {
            center,
            level: distanceKm < 100 ? 9 : distanceKm < 500 ? 11 : 13,
          });

          // Draw route polyline for passed locations
          const passed = getPassedLocations(distanceKm);
          if (passed.length >= 2) {
            const linePath = passed.map(
              (r) => new window.kakao.maps.LatLng(r.lat, r.lng)
            );
            const polyline = new window.kakao.maps.Polyline({
              path: linePath,
              strokeWeight: 4,
              strokeColor: "#E8162E",
              strokeOpacity: 0.8,
              strokeStyle: "solid",
            });
            polyline.setMap(map);
          }

          // Add markers for passed route points
          passed.slice(0, -1).forEach((point) => {
            const markerPos = new window.kakao.maps.LatLng(point.lat, point.lng);
            const marker = new window.kakao.maps.Marker({
              position: markerPos,
              map,
            });

            const infoContent = `
              <div style="padding:4px 8px; font-size:11px; font-family:'Noto Sans KR',sans-serif; white-space:nowrap; background:#fff; border:1.5px solid #ccc; border-radius:2px; color:#333;">
                ${point.name}
              </div>`;

            const infowindow = new window.kakao.maps.InfoWindow({
              content: infoContent,
              removable: false,
            });

            window.kakao.maps.event.addListener(marker, "click", () => {
              infowindow.open(map, marker);
            });
          });

          // Current location marker (character emoji)
          const currentPos = new window.kakao.maps.LatLng(
            currentLoc.lat,
            currentLoc.lng
          );

          const runnerContent = `
            <div style="
              width:44px; height:44px;
              background:#E8162E;
              border:3px solid #0A0A0A;
              border-radius:50%;
              display:flex; align-items:center; justify-content:center;
              font-size:22px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              cursor:pointer;
            ">${character}</div>`;

          const customOverlay = new window.kakao.maps.CustomOverlay({
            position: currentPos,
            content: runnerContent,
            yAnchor: 1,
          });
          customOverlay.setMap(map);

          // Info window for current location
          const currentInfo = `
            <div style="padding:6px 10px; font-size:12px; font-family:'Black Han Sans',sans-serif; background:#E8162E; color:#fff; border-radius:2px; white-space:nowrap;">
              📍 현재 위치: ${currentLoc.name}
            </div>`;

          const currentInfoWindow = new window.kakao.maps.InfoWindow({
            content: currentInfo,
            removable: true,
          });
          currentInfoWindow.open(map, new window.kakao.maps.Marker({ position: currentPos }));

          // Starting point marker (Seoul Hongdae)
          const startPos = new window.kakao.maps.LatLng(
            ROUTE_POINTS[0].lat,
            ROUTE_POINTS[0].lng
          );
          const startContent = `
            <div style="
              padding:4px 8px;
              background:#FFD600;
              border:2px solid #0A0A0A;
              border-radius:2px;
              font-size:11px;
              font-family:'Noto Sans KR',sans-serif;
              font-weight:700;
              color:#0A0A0A;
              white-space:nowrap;
            ">🏠 출발: 서울 홍대</div>`;

          new window.kakao.maps.CustomOverlay({
            position: startPos,
            content: startContent,
            yAnchor: 1,
          }).setMap(map);

          setMapLoaded(true);
        });
      } catch (e) {
        console.error("Kakao map init error:", e);
        setError(true);
      }
    }

    // Check if SDK already loaded
    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      // Wait for script to load
      const interval = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(interval);
          initMap();
        }
      }, 200);

      // Timeout after 5s
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setError(true);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [distanceKm, character]);

  if (error) {
    return <FallbackMap distanceKm={distanceKm} character={character} />;
  }

  return (
    <div className="relative rounded-sm overflow-hidden" style={{ border: "2px solid #333" }}>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "320px" }}
      />
      {!mapLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "#111" }}
        >
          <div className="text-center">
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🗺️</div>
            <div style={{ color: "#FFD600", fontFamily: "'Black Han Sans',sans-serif", fontSize: "14px" }}>
              도주 경로 추적 중...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Fallback when Kakao Maps API key not set
function FallbackMap({ distanceKm, character }: Props) {
  const passed = getPassedLocations(distanceKm);
  const current = getCurrentLocation(distanceKm);

  return (
    <div
      style={{
        background: "#111",
        border: "2px solid #333",
        borderRadius: "2px",
        padding: "16px",
        minHeight: "240px",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          color: "#666",
          letterSpacing: "2px",
          marginBottom: "12px",
          fontWeight: 700,
        }}
      >
        도주 경로 (지도 API 키 미설정)
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {passed.map((point, i) => {
          const isCurrent = point.name === current.name;
          return (
            <div key={point.name}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "6px 0",
                }}
              >
                <div
                  style={{
                    width: isCurrent ? "12px" : "8px",
                    height: isCurrent ? "12px" : "8px",
                    borderRadius: "50%",
                    background: isCurrent ? "#E8162E" : "#666",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: isCurrent ? "15px" : "13px",
                    fontWeight: 700,
                    color: isCurrent ? "#E8162E" : "#888",
                  }}
                >
                  {isCurrent ? `${character} ` : ""}{point.name}
                  {isCurrent && (
                    <span style={{ fontSize: "11px", color: "#ff6b6b", marginLeft: "8px" }}>
                      ◀ 현재위치
                    </span>
                  )}
                </span>
              </div>
              {i < passed.length - 1 && (
                <div
                  style={{
                    width: "1.5px",
                    height: "14px",
                    background: "#444",
                    marginLeft: "5.5px",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}