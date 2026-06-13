import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nickname,
      task,
      distance,
      reason,
      wantedLevel,
    } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // ⭐ 핵심 수정: 이스케이프 등록 오류(\$)를 전부 제거하여 변수가 정상 바인딩되도록 수정
    const prompt = `
당신은 현실도피 추적국 소속 수사관이다.
피의자가 해야 할 일을 미루고 도주한 기록을 바탕으로, 현실로 복귀하여 즉시 수행해야 할 최우선 미션(한 줄 명령문)을 작성하라.

[핵심 명령 규칙]
1. 반드시 아래 제공된 피의자의 '회피 대상'과 관련된 구체적이고 실제적인 행동이어야 한다.
2. 시스템 문구나 플레이스홀더 단어(예: \${task}, 죄목, 피의자 등)는 절대로 출력에 포함하지 마라.
3. 피의자가 가장 빠르고 가볍게, 인지적 부담 없이 당장 시작할 수 있는 첫 단계를 명령형으로 제안하라.
4. 20자 이내로 짧고 강렬하게 작성하라.
5. 문장 끝은 반드시 '~할 것' 또는 '~하기'로 끝맺어라.
6. 오직 미션 내용 문장 한 줄만 출력하고, 따옴표, 대괄호, 줄바꿈, 이모지, 제목, 부연 설명은 절대 금지한다.

[피의자 도주 기록]
- 피의자 이름: ${nickname}
- 회피 대상 (죄목): ${task}
- 현실 도주거리: ${distance}km
- 현재 수배 등급: ${wantedLevel}
- 피의자의 변명: ${reason}

[출력 예시]
치과 전화번호 검색 후 예약할 것
지금 즉시 닭가슴살을 해동할 것
운동화 끈을 매고 밖으로 나갈 것
`;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    
    // 지시 사항을 무시하고 제목 태그 등을 같이 출력했을 때를 대비한 클린 파싱 가드
    let mission = responseText?.trim() || "10분 이상 착수할 것";
    
    // 불필요하게 묻어나온 헤더 텍스트 강제 청소
    mission = mission.replace(/【현실 복귀 명령】|현실 복귀 명령|최우선 미션|죄목/g, "").replace(/[:\[\]]/g, "").trim();

    return NextResponse.json({
      mission,
    });

  } catch (error) {
    console.error("Reality Mission API Error:", error);
    return NextResponse.json({
      mission: "오늘 안에 10분 이상 착수할 것",
    });
  }
}