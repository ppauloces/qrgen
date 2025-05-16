import { NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const paymentId = searchParams.get("payment_id")

  if (!paymentId) {
    return NextResponse.redirect(new URL("/?status=erro", request.url))
  }

  try {
    const payment = await new Payment(client).get({ id: paymentId })
    const paymentData = payment

    if (paymentData.status === "approved" || paymentData.date_approved !== null) {
      return NextResponse.redirect(new URL(`/?status=sucesso`, request.url))
    }

    return NextResponse.redirect(new URL(`/?status=${paymentData.status}`, request.url))
  } catch (error) {
    return NextResponse.redirect(new URL("/?status=erro", request.url))
  }
} 