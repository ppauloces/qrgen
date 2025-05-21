'use client'

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function AnimatedContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center font-bold text-xl">
            <span className="text-primary">QR</span>Gen
          </Link>
        </motion.div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link 
              href="/create" 
              className="text-sm font-medium relative group cursor-pointer"
            >
              Criar QR Code
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              href="#como-funciona" 
              className="text-sm font-medium relative group cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('como-funciona')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }}
            >
              Como Funciona
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link 
              href="https://wa.me/5573982093868" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-medium relative group cursor-pointer"
            >
              Contato
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </motion.div>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <motion.div 
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-2">
                  <motion.h1 
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    QR Codes personalizados em segundos
                  </motion.h1>
                  <motion.p 
                    className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Crie QR Codes profissionais com sua logo, pague via Pix e receba os arquivos diretamente no seu e-mail.
                  </motion.p>
                </div>
                <motion.div 
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Link href="/create">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 group">
                      Criar QR Code
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="#como-funciona"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('como-funciona')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}>
                    <Button size="lg" variant="outline">
                      Saiba mais
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div 
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="relative w-full max-w-sm p-6 lg:p-8">
                  <motion.div 
                    className="bg-background rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center mb-4 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10"
                        animate={{ 
                          x: ["0%", "100%"],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
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
                        className="text-primary relative z-10"
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
                      <p className="text-xs text-muted-foreground mt-1">PNG, SVG e PDF</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        <section id="como-funciona" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Como funciona</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Gere QR Codes personalizados em apenas 3 passos simples
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  number: "1",
                  title: "Crie seu QR Code",
                  description: "Preencha o formulário com seu conteúdo e faça upload da sua logo"
                },
                {
                  number: "2",
                  title: "Pague via Pix",
                  description: "Escaneie o QR Code Pix e faça o pagamento de R$ 5,00"
                },
                {
                  number: "3",
                  title: "Receba os arquivos",
                  description: "Receba diretamente no seu e-mail os arquivos do seu QR Code"
                }
              ].map((step, index) => (
                <motion.div
                  key={step.number}
                  className="flex flex-col justify-center space-y-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <motion.div 
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="text-xl font-bold text-primary">{step.number}</span>
                  </motion.div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 QRGen. Todos os direitos reservados.</p>
        {/* <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Termos de Serviço
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Política de Privacidade
          </Link>
        </nav> */}
      </footer>
    </div>
  )
} 