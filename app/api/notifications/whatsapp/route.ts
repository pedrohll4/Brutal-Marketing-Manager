import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, message } = body;

    if (!phone || !message) {
      return NextResponse.json(
        { success: false, error: 'Telefone e mensagem são obrigatórios' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.WHATSAPP_API_URL;
    const apiKey = process.env.WHATSAPP_API_KEY;

    // If an Evolution API / Z-API endpoint is configured
    if (apiUrl && apiKey) {
      try {
        const response = await fetch(`${apiUrl}/message/sendText`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: apiKey,
          },
          body: JSON.stringify({
            number: phone,
            text: message,
          }),
        });

        if (response.ok) {
          const resData = await response.json();
          return NextResponse.json({
            success: true,
            gateway: 'Evolution API',
            data: resData,
          });
        }
      } catch (gatewayError: any) {
        console.error('Falha no gateway de WhatsApp:', gatewayError);
      }
    }

    // Default Success Simulation (when testing before purchasing external API)
    return NextResponse.json({
      success: true,
      message: 'Disparo simulado com sucesso (configure WHATSAPP_API_URL para envio em nuvem).',
      simulated: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro no envio' },
      { status: 500 }
    );
  }
}
