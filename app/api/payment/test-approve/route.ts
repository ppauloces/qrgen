import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN_TEST || '' 
})
const payment = new Payment(client)

export async function POST(request: Request) {
  try {
    const { email, type } = await request.json()
    
    // Define o valor baseado no tipo
    const amount = type === 'with_watermark' ? 7.0 : 10.0
    const description = type === 'with_watermark' ? 'QR Code com marca d\'água' : 'QR Code sem marca d\'água'

    // Cria o pagamento PIX
    const paymentData = await payment.create({
      body: {
        transaction_amount: amount,
        description,
        payment_method_id: 'pix',
        payer: { email },
        date_of_expiration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }
    })

    // Extrai os dados do QR code
    const qrCodeData = paymentData.point_of_interaction?.transaction_data

    return NextResponse.json({
      success: true,
      data: {
        id: paymentData.id,
        status: paymentData.status,
        qrCode: qrCodeData?.qr_code,
        qrCodeBase64: qrCodeData?.qr_code_base64,
        copyPasteCode: qrCodeData?.qr_code
      }
    })
  } catch (error) {
    console.error('Erro ao criar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao criar pagamento' },
      { status: 500 }
    )
  }
}