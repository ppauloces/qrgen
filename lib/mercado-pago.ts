import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const mercadoPago = {
  client,
  createPreference: async (data: {
    title: string
    price: number
    quantity: number
    description?: string
  }) => {
    const preference = new Preference(client)
    
    const response = await preference.create({
      body: {
        items: [
          {
            title: data.title,
            unit_price: data.price,
            quantity: data.quantity,
            description: data.description,
            currency_id: 'BRL',
          },
        ],
        back_urls: {
          success: `${APP_URL}/success`,
          failure: `${APP_URL}/failure`,
          pending: `${APP_URL}/pending`,
        },
        auto_return: 'approved',
        notification_url: `${APP_URL}/api/webhooks/mercado-pago`,
      }
    })

    return response
  },
} 