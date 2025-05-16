import { NextResponse } from "next/server"

// Simular um banco de dados em memória para armazenar os status dos pagamentos
const paymentStatuses = new Map<string, "pending" | "paid" | "expired">()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Se o pagamento não existe no mapa, criar como pendente
    if (!paymentStatuses.has(id)) {
      paymentStatuses.set(id, "pending")
    }

    // Simular pagamento: 50% de chance de ser confirmado quando verificado
    if (paymentStatuses.get(id) === "pending" && Math.random() > 0.5) {
      paymentStatuses.set(id, "paid")
    }

    return NextResponse.json({
      status: paymentStatuses.get(id),
    })
  } catch (error) {
    console.error("Erro ao verificar status:", error)
    return NextResponse.json(
      { error: "Erro ao verificar status do pagamento" },
      { status: 500 }
    )
  }
} 