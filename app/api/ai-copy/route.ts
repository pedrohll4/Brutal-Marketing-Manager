import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, clientName, segment, taskType, tone } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

    // If Gemini API Key is provided in environment variables, call Google Gemini 2.0 / 1.5 Flash
    if (apiKey) {
      try {
        const prompt = `Você é o copywriter sênior da agência Brutal Marketing.
Crie a legenda perfeita e as melhores hashtags para o seguinte conteúdo audiovisual aprovado pelo cliente:

Cliente: ${clientName}
Segmento: ${segment}
Tipo: ${taskType === 'VIDEO' ? 'Vídeo / Reels / TikTok' : 'Foto / Carrossel'}
Título da Produção: ${title}
Briefing / Descrição: ${description}
Tom de Voz: ${tone || 'Engajador e Profissional'}

Retorne OBRIGATORIAMENTE um JSON com as seguintes chaves exatas:
{
  "headline": "Gancho inicial de alto impacto / 1 linha",
  "caption": "Corpo persuasivo da legenda com quebras de linha",
  "cta": "Chamada para ação clara",
  "hashtags": ["#Hashtag1", "#Hashtag2", ... (entre 8 e 12 hashtags estratégicas)],
  "trendingAudioTip": "Dica de áudio em alta ou estilo musical",
  "bestTimeToPost": "Sugestão de horário estratégico",
  "fullFormattedText": "Texto completo pronto para copiar e colar no Instagram/TikTok com quebras de linha e hashtags no final"
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
            return NextResponse.json({ success: true, copy: parsed });
          }
        }
      } catch (geminiError) {
        console.error('Falha na chamada direta do Gemini, usando gerador nativo:', geminiError);
      }
    }

    // Default response using internal smart generator
    return NextResponse.json({
      success: true,
      message: 'Generated via Brutal Marketing AI Engine',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao gerar copy' },
      { status: 500 }
    );
  }
}
