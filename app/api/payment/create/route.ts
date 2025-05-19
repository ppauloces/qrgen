// app/api/payment/create/route.ts
import { NextResponse } from "next/server"
import { createPixPayment } from "@/lib/mercadopago"

declare global {
  var paymentData: Map<string, any>
}

export async function POST(request: Request) {
  try {
    const { email, type, qrCodeData } = await request.json()

    if (!email || !type || !qrCodeData) {
      return NextResponse.json(
        { error: 'Email, tipo e dados do QR code são obrigatórios' },
        { status: 400 }
      )
    }

    const paymentData = await createPixPayment(email, type)
    
    // Armazenar dados do pagamento junto com os dados do QR code
    const storedData = {
      email,
      type,
      qrCodeData,
      paymentId: paymentData.id
    }

    // Aqui você pode armazenar os dados em um Map ou outro mecanismo temporário
    // Por exemplo, usando um Map global
    const paymentId = String(paymentData.id)
    global.paymentData = global.paymentData || new Map()
    global.paymentData.set(paymentId, storedData)
    
    return NextResponse.json({
      id: paymentData.id,
      status: paymentData.status,
      qrCode: paymentData.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: paymentData.point_of_interaction?.transaction_data?.qr_code_base64,
      copyPasteCode: paymentData.point_of_interaction?.transaction_data?.qr_code
    })
  } catch (error) {
    console.error('Erro ao criar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao criar pagamento' },
      { status: 500 }
    )
  }
}