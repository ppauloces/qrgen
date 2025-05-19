// app/api/payment/status/[id]/route.ts
import { NextResponse } from "next/server"
import { getPaymentStatus, getStoredPaymentData } from "@/lib/mercadopago"
import { qrGenerator } from "@/lib/qr-generator"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Aguardar os parâmetros dinâmicos
    const { id: paymentId } = await params
    
    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID do pagamento é obrigatório' }, 
        { status: 400 }
      )
    }
    
    const { status, storedData } = await getPaymentStatus(paymentId)
    return NextResponse.json({ status, storedData })
  } catch (error) {
    console.error('Erro ao verificar status:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar status do pagamento' }, 
      { status: 500 }
    )
  }
}