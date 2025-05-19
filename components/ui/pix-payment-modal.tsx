// components/ui/pix-payment-modal.tsx
import { useEffect, useState } from 'react'
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface PixPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  pixData: {
    id: string
    status: string
    qrCode: string
    qrCodeBase64: string
    copyPasteCode: string
  }
  onPaymentSuccess: () => void
}

export function PixPaymentModal({ isOpen, onClose, pixData, onPaymentSuccess }: PixPaymentModalProps) {
  const [copied, setCopied] = useState(false)

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixData.copyPasteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (!isOpen) return
    
    console.log('Dados do PIX:', pixData)
    
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/payment/status/${pixData.id}`)
        const data = await response.json()
        
        if (data.status === 'approved') {
          onPaymentSuccess()
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error)
      }
    }

    const interval = setInterval(checkStatus, 5000)
    return () => clearInterval(interval)
  }, [isOpen, pixData.id, onPaymentSuccess])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Pagamento PIX</DialogTitle>
        <DialogDescription>
          Escaneie o QR Code ou copie o código para pagar
        </DialogDescription>

        <div className="flex flex-col items-center gap-4 p-4">
          <div className="relative w-64 h-64 bg-white p-4 rounded-lg">
            <img
              src={`data:image/png;base64,${pixData.qrCodeBase64}`}
              alt="QR Code PIX"
              className="w-full h-full object-contain"
              style={{
                imageRendering: 'pixelated'
              }}
            />
          </div>

          <div className="w-full space-y-2">
            <p className="text-sm text-gray-500">Código PIX (copie e cole):</p>
            <div className="flex gap-2">
              <code className="flex-1 p-2 bg-gray-100 rounded text-sm break-all">
                {pixData.copyPasteCode}
              </code>
              <Button onClick={copyPixCode}>
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
            </div>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <Button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/payment/test-approve', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      paymentId: pixData.id,
                      email: 'seu-email@exemplo.com' // Substitua pelo email que você quer testar
                    })
                  })
                  
                  const data = await response.json()
                  if (data.status === 'approved') {
                    onPaymentSuccess()
                  }
                } catch (error) {
                  console.error('Erro ao testar aprovação:', error)
                }
              }}
              variant="outline"
              className="mt-4"
            >
              Testar Aprovação
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}