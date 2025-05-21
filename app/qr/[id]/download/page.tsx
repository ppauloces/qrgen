"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Download, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PageProps {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function DownloadPage({ params }: PageProps) {
  const [status, setStatus] = useState<"loading" | "paid" | "not_paid" | "error">("loading")

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Simulação de chamada à API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simulação de status (para demonstração, consideramos como pago)
        setStatus("paid")
      } catch (err) {
        console.error("Error checking payment status:", err)
        setStatus("error")
      }
    }

    checkPaymentStatus()
  }, [params.id])

  // Função para simular download do ZIP
  const downloadZip = () => {
    alert("Em um ambiente real, isso iniciaria o download do arquivo ZIP com os QR Codes.")
  }

  if (status === "loading") {
    return (
      <div className="container max-w-md py-10 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-center text-gray-500">Verificando status do pagamento...</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="container max-w-md py-10">
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>Ocorreu um erro ao verificar o status do pagamento. Tente novamente.</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Link href={`/qr/${params.id}`}>
            <Button>Voltar para a página de pagamento</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (status === "not_paid") {
    return (
      <div className="container max-w-md py-10">
        <Alert variant="default">
          <AlertTitle>Pagamento pendente</AlertTitle>
          <AlertDescription>
            Não identificamos o pagamento para este QR Code. Realize o pagamento para baixar os arquivos.
          </AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Link href={`/qr/${params.id}`}>
            <Button>Voltar para a página de pagamento</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-md py-10">
      <div className="mb-6">
        <Link
          href={`/qr/${params.id}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para a página anterior
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Download dos arquivos</CardTitle>
          <CardDescription>Baixe os arquivos do seu QR Code personalizado</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-full max-w-xs bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex flex-col items-center">
              <FileDown className="h-16 w-16 text-primary mb-4" />
              <h3 className="text-lg font-medium mb-1">qrcode-files.zip</h3>
              <p className="text-sm text-gray-500 mb-4">PNG, SVG e PDF</p>
              <Button onClick={downloadZip} className="w-full" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Baixar arquivos
              </Button>
            </div>
          </div>

          <Alert className="mb-4">
            <AlertTitle>Arquivos enviados por e-mail</AlertTitle>
            <AlertDescription>Os arquivos também foram enviados para o e-mail informado no cadastro.</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-xs text-gray-500 text-center">ID da transação: {params.id}</p>
        </CardFooter>
      </Card>
    </div>
  )
}
