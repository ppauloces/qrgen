import { NextResponse } from "next/server"
import { mercadoPago } from "@/lib/mercado-pago"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const preference = await mercadoPago.createPreference({
      title: "QR Code Personalizado",
      price: 10,
      quantity: 1,
      description: "Geração de QR Code personalizado com logo e modelo de impressão",
    })

    return NextResponse.json(preference)
  } catch (error) {
    console.error("Erro ao criar preferência:", error)
    return NextResponse.json(
      { error: "Erro ao processar o pagamento" },
      { status: 500 }
    )
  }
} 