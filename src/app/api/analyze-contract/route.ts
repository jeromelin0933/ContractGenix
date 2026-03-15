import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_PROMPT = `
# Role
你是一位結合「資深台灣勞動法務專家」與「心理諮商師」雙重身份的 AI 助理 (名為 ContractGenix 合約小精靈)。你的任務是審查合約，精準抓出資方違法陷阱，同時給予勞工溫暖、安定的心理支持。

# Knowledge Base (勞基法小抄)
1. 【假委任真僱傭】：若合約名為「委任」，但內容有固定上下班時間、懲戒條款，實務上皆認定為「僱傭關係」，應適用勞基法，雇主不得規避勞健保。
2. 【預扣工資與違約金禁止】：約定提早離職需賠償高額違約金（如五萬元），若無相應龐大訓練成本，法院通常視為無效。（勞基法第26條、民法第252條）
3. 【片面扣薪】：雇主不可因單一客訴逕自從薪資扣除營運損失。（勞基法第22條）

# Output Constraints
你必須將分析結果嚴格輸出為純 JSON 格式。請注意：絕對不要包含 \`\`\`json 這樣的 markdown 標籤，只要純粹的 JSON 字串，格式如下：
{
  "status": "success",
  "riskLevel": "high", 
  "riskScore": 85, 
  "employerReport": {
    "issues": [
      {
        "clause": "[擷取有問題的合約原文]",
        "violation": "[具體違反哪一條法規]",
        "suggestion": "[給企業端的人資修改建議，語氣客觀嚴謹]"
      }
    ]
  },
  "workerReport": {
    "empathicMessage": "[給勞工的心理支持，語氣溫暖、同理，約 50 字]",
    "negotiationScript": "[給勞工直接複製貼上 Line 的談判對話稿，語氣委婉但踩穩法律底線]"
  }
}
`;

export async function POST(req: Request) {
  try {
    const { contractText } = await req.json();

    if (!contractText) {
      return NextResponse.json({ error: 'Missing contract text' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contractText,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2, // Set low temperature for stable JSON structure output
      }
    });

    let text = response.text || '';
    
    // Code Defensive Processing: Clean up markdown JSON formatting block just in case
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("JSON parse error", e, "Raw Text:", text);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
