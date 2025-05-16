// app/api/payment/route.ts
import { NextResponse } from "next/server";
// SDK do Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";
// Adicione credenciais
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  const origin =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const preference = {
    items: [
      {
        id: "qrgen-produto",
        title: "QR Code Personalizado",
        quantity: 1,
        unit_price: 10,
        currency_id: "BRL",
      },
    ],
    back_urls: {
      success: `${origin}/success`,
      failure: `${origin}/failure`,
      pending: `${origin}/pending`,
    },
    auto_return: "approved",
    notification_url: `${origin}/api/webhooks/mercado-pago`,
  };

  try {
    const service = new Preference(client);
    const response = await service.create({ body: preference });

    return NextResponse.json(
      { id: response.id, init_point: response.init_point },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Erro criando preference:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.status || 500 }
    );
  }
}
