// app/api/payment/webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getPaymentStatus } from "@/lib/mercadopago";
import { emailService } from "@/lib/email";
import { Resend } from "resend"

const SECRET = process.env.MERCADO_PAGO_WEBHOOK!;
const resend = new Resend(process.env.RESEND_API_KEY);

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
      const storedData = global.paymentData?.get(String(paymentId));
      
      if (storedData) {
        // Enviar o email com os dados do QR code
        await resend.emails.send({
          from: "QRGen <onboarding@resend.dev>",
          to: storedData.email,
          subject: "Seu QR Code personalizado está pronto!",
          html: `
            <h1>Seu QR Code personalizado está pronto!</h1>
            <p>Obrigado por usar o QRGen. Aqui está seu QR Code personalizado.</p>
            <div style="text-align: center; margin: 20px 0;">
              <img src="${storedData.qrCodeData.qrCode.base64}" alt="QR Code" style="max-width: 100%; height: auto;" />
              ${storedData.qrCodeData.qrCode.printModelBase64 ? `
                <h2>Modelo de Impressão</h2>
                <img src="${storedData.qrCodeData.qrCode.printModelBase64}" alt="Modelo de Impressão" style="max-width: 100%; height: auto;" />
              ` : ''}
            </div>
          `,
          attachments: [
            {
              filename: "qrcode.png",
              content: Buffer.from(storedData.qrCodeData.qrCode.png, 'base64'),
            },
            ...(storedData.qrCodeData.qrCode.printModelPng ? [{
              filename: "modelo-impressao.png",
              content: Buffer.from(storedData.qrCodeData.qrCode.printModelPng, 'base64'),
            }] : []),
          ],
        });

        // Limpar os dados após o envio
        global.paymentData.delete(String(paymentId));
        
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
