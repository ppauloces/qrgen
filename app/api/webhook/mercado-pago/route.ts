import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { emailService } from "@/lib/email";
import { qrGenerator } from "@/lib/qr-generator";
// Importe sua função de envio de QR Code por e-mail
// import { resendQrCodeEmail } from "@/lib/send-qr-email";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  // 1. Validação do token do webhook
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env.MERCADO_PAGO_WEBHOOK) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // 2. Verifica se é notificação de pagamento
  if (body.type !== "payment" || !body.data?.id) {
    return NextResponse.json({ ok: true });
  }

  const paymentId = body.data.id;

  // 3. Busca o pagamento no Mercado Pago
  const payment = await new Payment(client).get({ id: paymentId });

  if (payment.status === "approved" && payment.payer?.email) {
    // 4. Gera o QR Code (simulação)
    const qrFiles = await qrGenerator.generateQRCode({
      content: `Pagamento aprovado para ${payment.payer.email}`,
    });
    const zipUrl = await qrGenerator.createZipFile(qrFiles);
    // 5. Envia o QR Code por e-mail
    await emailService.sendQRCodeEmail(payment.payer.email, paymentId, zipUrl);
    console.log(`Pagamento aprovado para ${payment.payer.email}. QR Code enviado!`);
  }

  return NextResponse.json({ ok: true });
} 