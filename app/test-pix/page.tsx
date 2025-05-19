'use client'

import { useState } from 'react'

export default function TestPixPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testPixPayment = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/payment/test-approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'seu-email@exemplo.com', // Coloque seu email aqui
          type: 'with_watermark'
        })
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Teste de Pagamento PIX</h1>
      
      <button 
        onClick={testPixPayment}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Gerando PIX...' : 'Gerar PIX de Teste'}
      </button>

      {result?.data && (
        <div className="mt-4">
          <h2 className="text-xl mb-2">QR Code PIX:</h2>
          <div className="bg-white p-4 rounded shadow">
            <img 
              src={result.data.qrCodeBase64} 
              alt="QR Code PIX" 
              className="mx-auto"
            />
            <div className="mt-4">
              <p className="font-bold">Código PIX (copie e cole):</p>
              <p className="bg-gray-100 p-2 rounded break-all">
                {result.data.copyPasteCode}
              </p>
            </div>
            <div className="mt-4">
              <p className="font-bold">Status:</p>
              <p>{result.data.status}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 