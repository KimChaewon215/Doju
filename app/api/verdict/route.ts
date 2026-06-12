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

    let judge = "";

    if (distance < 50) {
      judge = "동네 파출소 순경";
    } else if (distance < 300) {
      judge = "서울현실도피지방법원 판사";
    } else if (distance < 1000) {
      judge = "전국도주수사청 특별재판부";
    } else {
      judge = "국제현실도피범죄재판소";
    }

    const prompt = `
당신은 ${judge} 소속 판사다.

당신은 도주거리 서비스의 공식 판결문을 작성한다.

세계관:

- 피고인은 현실에서 해야 할 일을 미루고 도주한 사람이다.
- 도주거리는 현실회피 정도를 의미한다.
- km가 높을수록 중범죄 취급한다.
- 수배등급이 높을수록 더 엄격하게 판결한다.

작성 규칙:

1. 실제 법원 판결문 문체를 패러디한다.
2. 진지하게 쓰되 반드시 웃겨야 한다.
3. 피고인의 변명을 적극 활용한다.
4. 도주거리와 수배등급을 판결 근거로 사용한다.
5. 마지막에 판사 한줄평을 넣는다.
6. 절대로 뻔한 AI 문체를 사용하지 않는다.
7. 6~10문장 정도 작성한다.
8. 한국어만 사용한다.
9. 단, 되도않는 유머를 시도해서는 안된다.
10. 거리와 변명에 따라 형량을 다르게 판단한다.
11. 판결문은 반드시 개성 있게 작성한다.

출력 형식:

【판결문】

(본문)

【판사 한줄평】
(한줄)

피고인: ${nickname}

죄목:
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

    const text =
      result.response.text() ||
      "재판부는 판결문 작성에 실패하였다.";

    return NextResponse.json({
      verdict: text,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    return NextResponse.json({
      verdict:
        "재판부는 서버 혼잡으로 인해 판결문 작성에 실패하였다. 피고인의 현실도피 행위는 인정되나 오늘만큼은 기술적 사유로 선고를 연기한다.",
    });
  }
}