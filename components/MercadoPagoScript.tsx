"use client"

import Script from "next/script"

declare global {
  interface Window {
    MercadoPago: any
  }
}

export function MercadoPagoScript() {
  return (
    <Script
      src="https://sdk.mercadopago.com/js/v2"
      strategy="afterInteractive"
    />
  )
} 