import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center font-bold text-xl">
          <span className="text-primary">QR</span>Gen
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/create" className="text-sm font-medium hover:underline underline-offset-4">
            Criar QR Code
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Como Funciona
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Contato
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    QR Codes personalizados em segundos
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Crie QR Codes profissionais com sua logo, pague via Pix e receba os arquivos em PNG, SVG e PDF.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/create">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Criar QR Code
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#">
                    <Button size="lg" variant="outline">
                      Saiba mais
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-sm p-6 lg:p-8">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="180"
                        height="180"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <rect width="6" height="6" x="4" y="4" rx="1" />
                        <rect width="6" height="6" x="14" y="4" rx="1" />
                        <rect width="6" height="6" x="4" y="14" rx="1" />
                        <path d="M14 14h.01" />
                        <path d="M14 20h.01" />
                        <path d="M20 14h.01" />
                        <path d="M20 20h.01" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">QR Code com sua logo</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, SVG e PDF</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Como funciona</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Gere QR Codes personalizados em apenas 3 passos simples
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold">Crie seu QR Code</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Preencha o formulário com seu conteúdo e faça upload da sua logo
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold">Pague via Pix</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Escaneie o QR Code Pix e faça o pagamento de R$ 10,00
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold">Receba os arquivos</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Baixe um ZIP com os arquivos PNG, SVG e PDF do seu QR Code
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 QRGen. Todos os direitos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Termos de Serviço
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Política de Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  )
}
