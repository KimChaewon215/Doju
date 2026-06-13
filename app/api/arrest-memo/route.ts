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

    const prompt = `
당신은 현실도피 추적국 소속 수사관이다.

사용자의 현실도피 기록을 분석하여
수배지에 들어갈 체포 메모를 작성하라.

규칙:

1. 반드시 한 줄만 작성
2. 15자 이내
3. 따옴표 사용 금지
4. 줄바꿈 금지
5. 현실도피 컨셉 유지
6. 짧고 재치있게
7. 욕설 금지
8. 이모지 사용 금지
9. 설명 금지
10. 메모 문장만 출력

예시:

현실과 연락 두절
과제 폴더 개봉 필요
시작만 하면 끝남
유튜브 은신처 발견
자수 권고 대상
현실 복귀 시급
미루기 상습범 검거

피의자:
${nickname}

회피 대상:
${task}

도주거리:
${distance}km

수배등급:
${wantedLevel}

변명:
${reason}
`;

    let result: any = null;

    for (let i = 0; i < 3; i++) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (err) {
        console.error(`Gemini Retry ${i + 1}`, err);

        if (i === 2) {
          throw err;
        }

        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    if (!result) {
      throw new Error("Gemini 응답 없음");
    }

    // ⭐ 수정 핵심: .text() 메서드 앞에 await를 추가합니다.
    const responseText = await result.response.text();
    const memo = responseText?.trim() || "현실 복귀 시급";

    return NextResponse.json({
      memo,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    return NextResponse.json({
      memo: "현실 복귀 시급",
    });
  }
}