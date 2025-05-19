import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();
    
    // Simula o evento do webhook do Mercado Pago
    const webhookEvent = {
      action: "payment.updated",
      api_version: "v1",
      data: { id: paymentId },
      date_created: new Date().toISOString(),
      id: "123456",
      live_mode: false,
      type: "payment",
      user_id: 1070343250
    };

    console.log('Enviando webhook:', webhookEvent);

    // Chama o webhook real usando URL completa
    const response = await fetch('http://localhost:3000/api/payment/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-meli-signature': '603fad2bfcaf025456238062f0eb19695f69a5d14ffbaa3446a9618b32bb050a'
      },
      body: JSON.stringify(webhookEvent)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na resposta:', errorData);
      throw new Error(`Erro na resposta: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro detalhado ao testar webhook:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao testar webhook',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}