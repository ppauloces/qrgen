"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Tipos de status do pagamento
type PaymentStatus = "pending" | "paid" | "failed"

// Simulação de dados do QR Code
interface QRCodeData {
  id: string
  status: PaymentStatus
  pixQrCode: string
  createdAt: string
}

export default function QRPage({ params }: { params: { id: string } }) {
  const [qrData, setQrData] = useState<QRCodeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simular carregamento dos dados do QR Code
  useEffect(() => {
    const fetchQRData = async () => {
      try {
        // Simulação de chamada à API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Dados simulados
        setQrData({
          id: params.id,
          status: "pending", // Inicialmente pendente
          pixQrCode:
            "00020126580014BR.GOV.BCB.PIX0136a629532e-7693-4846-b028-f142082d7b0752040000530398654041.005802BR5925QRGEN TECNOLOGIA LTDA ME6009SAO PAULO62070503***63041D57",
          createdAt: new Date().toISOString(),
        })

        // Simular mudança de status após alguns segundos (apenas para demonstração)
        setTimeout(() => {
          setQrData((prev) => (prev ? { ...prev, status: Math.random() > 0.3 ? "paid" : "pending" } : null))
        }, 15000)
      } catch (err) {
        console.error("Error fetching QR data:", err)
        setError("Não foi possível carregar os dados do QR Code. Tente novamente.")
      } finally {
        setLoading(false)
      }
    }

    fetchQRData()
  }, [params.id])

  // Função para simular verificação de status
  const checkStatus = async () => {
    setLoading(true)

    try {
      // Simulação de chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Atualizar status aleatoriamente (apenas para demonstração)
      setQrData((prev) => (prev ? { ...prev, status: Math.random() > 0.3 ? "paid" : "pending" } : null))
    } catch (err) {
      setError("Erro ao verificar o status do pagamento. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  // Função para simular download do ZIP
  const downloadZip = () => {
    alert("Em um ambiente real, isso iniciaria o download do arquivo ZIP com os QR Codes.")
  }

  if (loading && !qrData) {
    return (
      <div className="container max-w-md py-10 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-center text-gray-500">Carregando informações do QR Code...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-md py-10">
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Link href="/create">
            <Button>Voltar para o formulário</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!qrData) {
    return (
      <div className="container max-w-md py-10">
        <Alert variant="destructive">
          <AlertTitle>QR Code não encontrado</AlertTitle>
          <AlertDescription>O QR Code solicitado não foi encontrado ou expirou.</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Link href="/create">
            <Button>Criar novo QR Code</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-md py-10">
      <div className="mb-6">
        <Link href="/create" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para o formulário
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Pagamento via Pix</CardTitle>
          <CardDescription>Escaneie o QR Code abaixo para realizar o pagamento</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {qrData.status === "pending" && (
            <>
              <div className="w-64 h-64 bg-white p-2 border rounded-lg flex items-center justify-center mb-4">
                {/* Simulação de QR Code Pix */}
                <svg
                  viewBox="0 0 200 200"
                  width="200"
                  height="200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <rect x="0" y="0" width="200" height="200" fill="white" />
                  <path
                    d="M40,40 L40,60 L60,60 L60,40 Z M70,40 L70,60 L90,60 L90,40 Z M100,40 L100,60 L120,60 L120,40 Z M130,40 L130,60 L150,60 L150,40 Z M40,70 L40,90 L60,90 L60,70 Z M100,70 L100,90 L120,90 L120,70 Z M130,70 L130,90 L150,90 L150,70 Z M40,100 L40,120 L60,120 L60,100 Z M70,100 L70,120 L90,120 L90,100 Z M130,100 L130,120 L150,120 L150,100 Z M40,130 L40,150 L60,150 L60,130 Z M100,130 L100,150 L120,150 L120,130 Z M130,130 L130,150 L150,150 L150,130 Z"
                    fill="black"
                  />
                </svg>
              </div>

              <div className="text-center mb-4">
                <p className="text-sm text-gray-500 mb-2">Valor a pagar</p>
                <p className="text-2xl font-bold">R$ 10,00</p>
              </div>

              <div className="w-full p-3 bg-gray-50 rounded-md mb-4">
                <p className="text-xs text-gray-500 mb-1">Código Pix (clique para copiar)</p>
                <div
                  className="p-2 bg-white border rounded text-xs font-mono overflow-hidden cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(qrData.pixQrCode)
                    alert("Código Pix copiado!")
                  }}
                >
                  {qrData.pixQrCode.substring(0, 30)}...
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-md w-full">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Aguardando confirmação do pagamento...</span>
              </div>
            </>
          )}

          {qrData.status === "paid" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-600 mb-2">Pagamento confirmado!</h3>
              <p className="text-gray-500 mb-6">Seu QR Code foi gerado com sucesso.</p>

              <Button onClick={downloadZip} className="w-full" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Baixar arquivos
              </Button>

              <p className="mt-4 text-sm text-gray-500">Os arquivos também foram enviados para o seu e-mail.</p>
            </div>
          )}

          {qrData.status === "failed" && (
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-red-600"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-2">Pagamento falhou</h3>
              <p className="text-gray-500 mb-6">Não foi possível confirmar seu pagamento.</p>

              <Link href="/create">
                <Button variant="outline" className="w-full" size="lg">
                  Tentar novamente
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          {qrData.status === "pending" && (
            <Button variant="outline" onClick={checkStatus} disabled={loading} className="w-full">
              {loading ? "Verificando..." : "Verifiquei o pagamento"}
            </Button>
          )}
          <p className="text-xs text-gray-500 text-center mt-4">ID da transação: {qrData.id}</p>
        </CardFooter>
      </Card>
    </div>
  )
}
