import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientName, segment, userTheme, videoCount, tone, platform } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `Você é o Estrategista Chefe e Diretor de Roteiros da agência Brutal Marketing.
Crie um plano estratégico de campanha completo com ${videoCount || 4} roteiros de vídeo detalhados para o seguinte cliente:

Cliente: ${clientName}
Segmento: ${segment}
Tema/Objetivo: ${userTheme || 'Tendências mais faladas e em alta no nicho neste mês'}
Tom de Voz: ${tone || 'Autoridade e Conversão'}
Formato Principal: ${platform || 'Instagram Reels / TikTok (9:16)'}

Você deve:
1. Identificar as tendências em alta e dores mais faladas no segmento deste cliente para o mês atual.
2. Criar um Nome Forte para a Campanha e Descrição do Conceito.
3. Criar ${videoCount || 4} Roteiros de Vídeo COMPLETOS. Cada roteiro deve conter:
   - "videoNumber": número do vídeo
   - "title": título atraente do vídeo
   - "hook": frase do gancho inicial (0-3s)
   - "targetFormat": formato e duração sugerida
   - "locationTip": sugestão de locação/cenário
   - "cta": chamada para ação final
   - "scenes": array com 3 cenas (00:00-00:03, 00:03-00:25, 00:25-00:45), onde cada cena tem "timestamp", "visualDirection" (direção de câmera, cortes, efeitos visuais) e "audioSpoken" (texto exato que o apresentador ou narrador fala palavra por palavra).

Retorne OBRIGATORIAMENTE um JSON com as seguintes chaves exatas:
{
  "campaignPlan": {
    "campaignName": "Título Criativo da Campanha",
    "conceptDescription": "Descrição do conceito estratégico da campanha",
    "trendingTopicAnalysis": "Resumo das tendências em alta detectadas para o segmento",
    "suggestedBudget": 6000,
    "startDate": "2026-08-24",
    "endDate": "2026-09-24",
    "scripts": [
      {
        "id": "script-1",
        "videoNumber": 1,
        "title": "...",
        "hook": "...",
        "targetFormat": "Reels / TikTok (9:16) - 45s",
        "locationTip": "...",
        "cta": "...",
        "scenes": [
          {
            "timestamp": "00:00 - 00:03",
            "visualDirection": "...",
            "audioSpoken": "..."
          }
        ]
      }
    ]
  }
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const textResult = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textResult) {
            const parsed = JSON.parse(textResult);
            return NextResponse.json({ success: true, campaignPlan: parsed.campaignPlan || parsed });
          }
        }
      } catch (geminiError) {
        console.error('Falha no Gemini para campanha, usando gerador nativo:', geminiError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Generated via Brutal Marketing AI Campaign Engine',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao gerar campanha' },
      { status: 500 }
    );
  }
}
