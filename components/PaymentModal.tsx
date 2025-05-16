import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

const paymentFormSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  taxId: z.string().min(11, "CPF/CNPJ inválido"),
})

type PaymentFormData = z.infer<typeof paymentFormSchema>

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentConfirmed: () => void
  defaultEmail: string
}

export function PaymentModal({ isOpen, onClose, onPaymentConfirmed, defaultEmail }: PaymentModalProps) {
  const [step, setStep] = useState<"form" | "payment">("form")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      email: defaultEmail,
      fullName: "",
      phone: "",
      taxId: "",
    },
  })

  const onSubmit = async (data: PaymentFormData) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Erro ao processar pagamento")
      }

      const preference = await response.json()

      // Redireciona para o checkout do Mercado Pago
      window.location.href = preference.init_point

    } catch (error) {
      console.error("Erro:", error)
      toast({
        variant: "destructive",
        title: "Erro ao processar pagamento",
        description: "Ocorreu um erro ao processar seu pagamento. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === "form" ? "Dados para Pagamento" : "Pagamento via Mercado Pago"}
          </DialogTitle>
          <DialogDescription>
            {step === "form" 
              ? "Preencha seus dados para prosseguir com o pagamento" 
              : "Complete o pagamento para gerar seu QR Code personalizado"}
          </DialogDescription>
        </DialogHeader>

        {step === "form" ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF/CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processando..." : "Continuar"}
              </Button>
            </form>
          </Form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
} 