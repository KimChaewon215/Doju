import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "도주거리 — 당신은 인생으로부터 몇 km 도망친 상태인가요?",
  description:
    "하기 싫은 일을 등록하면 AI가 도주 거리를 계산해 실제 지도 위에 표시해줍니다.",
  openGraph: {
    title: "도주거리",
    description: "당신은 인생으로부터 몇 km 도망친 상태인가요?",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* Kakao Maps SDK */}
        <script
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}&autoload=false`}
          async
        />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}