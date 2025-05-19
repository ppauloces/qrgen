// lib/mercadopago.ts (servidor)
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '' 
});
const payment = new Payment(client);

export async function createPixPayment(email: string, type: string) {
  const amount = type === 'with_watermark' ? 1.0 : 2.0;
  const description = type === 'with_watermark' ? 'QR Code com marca d\'água' : 'QR Code sem marca d\'água';
  
  return await payment.create({
    body: {
      transaction_amount: amount,
      description,
      payment_method_id: 'pix',
      payer: { email },
      date_of_expiration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
  });
}

export interface PixPaymentData {
  id: string
  status: string
  qrCode: string
  qrCodeBase64: string
  copyPasteCode: string
}

// Armazenamento temporário em memória
const paymentStore = new Map<string, {
  email: string
  qrCodeData: any
  status: string
}>()

export async function getPaymentStatus(paymentId: string) {
  try {
    const paymentData = await payment.get({ id: paymentId })
    const storedData = paymentStore.get(paymentId)

    // Extrair dados do QR Code
    const qrCodeData = paymentData.point_of_interaction?.transaction_data
    
    console.log('Dados do QR Code:', qrCodeData)

    return {
      id: paymentData.id,
      status: paymentData.status,
      qrCode: qrCodeData?.qr_code,
      qrCodeBase64: qrCodeData?.qr_code_base64,
      copyPasteCode: qrCodeData?.qr_code,
      storedData
    }
  } catch (error) {
    console.error('Erro ao verificar status:', error)
    throw new Error('Erro ao verificar status do pagamento')
  }
}

export function getStoredPaymentData(paymentId: string) {
  return paymentStore.get(paymentId)
}