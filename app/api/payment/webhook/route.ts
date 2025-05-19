// app/api/payment/webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getPaymentStatus } from "@/lib/mercadopago";
import { emailService } from "@/lib/email";

const SECRET = process.env.MERCADO_PAGO_WEBHOOK!;

function verifySignature(body: string, signature: string) {
  const hash = crypto
    .createHmac("sha256", SECRET)
    .update(body)
    .digest("base64");
  return hash === signature;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-meli-signature") || "";

    // Em ambiente de desenvolvimento, aceita a assinatura de teste
    if (process.env.NODE_ENV === 'development' && signature === 'test-signature') {
      console.log('Ambiente de desenvolvimento: aceitando assinatura de teste');
    } else if (signature && SECRET) {
      if (!verifySignature(rawBody, signature)) {
        return NextResponse.json(
          { error: "Assinatura inválida" },
          { status: 401 }
        );
      }
    }

    const event = JSON.parse(rawBody);
    console.log('Evento recebido:', event);
    
    if (event.type === "payment" && event.action === "payment.updated") {
      const paymentId = event.data.id;
      
      // Recuperar os dados armazenados
      const storedData = global.paymentData?.get(paymentId);
      
      if (storedData) {
        // Enviar o email com os dados do QR code
        await emailService.sendQRCodeEmail(
          storedData.email,
          String(paymentId),
          `${process.env.NEXT_PUBLIC_APP_URL}/api/qr/download/${paymentId}`
        );

        // Limpar os dados após o envio
        global.paymentData.delete(paymentId);
        
        console.log("Email com QR code enviado com sucesso!");
      }

      return NextResponse.json({ 
        success: true,
        paymentId 
      });
    }

    return NextResponse.json({ 
      success: true,
      message: "Evento não processado" 
    });

  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
