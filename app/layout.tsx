import type { Metadata } from "next"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { MercadoPagoScript } from "@/components/MercadoPagoScript"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QRGen - Gerador de QR Code Personalizado",
  description: "Gere QR Codes personalizados com logo e modelo de impressão",
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="qrgen-theme"
        >
          {children}
          <Toaster />
          <MercadoPagoScript />
        </ThemeProvider>
      </body>
    </html>
  )
}
