"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  contentType: z.enum(["url", "text", "vcard", "wifi"], {
    required_error: "Selecione um tipo de conteúdo",
  }),
  content: z.string().min(1, { message: "O conteúdo é obrigatório" }).max(1000, {
    message: "O conteúdo deve ter no máximo 1000 caracteres",
  }),
  logo: z
    .instanceof(FileList)
    .refine(
      (files) => {
        if (files.length === 0) return true
        return (
          files.length === 1 &&
          (files[0].type === "image/png" || files[0].type === "image/jpeg") &&
          files[0].size <= 2 * 1024 * 1024
        )
      },
      {
        message: "A logo deve ser um arquivo PNG ou JPG com no máximo 2 MB",
      },
    )
    .optional(),
})

export default function CreatePage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      contentType: "url",
      content: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Simulando o envio para a API
      console.log("Form values:", values)

      // Criar FormData para enviar o arquivo
      const formData = new FormData()
      formData.append("email", values.email)
      formData.append("contentType", values.contentType)
      formData.append("content", values.content)

      if (values.logo && values.logo.length > 0) {
        formData.append("logo", values.logo[0])
      }

      // Simulando uma resposta da API com um ID
      const qrId = "qr_" + Math.random().toString(36).substring(2, 15)

      // Redirecionar para a página de acompanhamento
      window.location.href = `/qr/${qrId}`
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        variant: "destructive",
        title: "Erro ao processar o QR Code",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setLogoPreview(null)
    }
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para a página inicial
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Criar QR Code</CardTitle>
          <CardDescription>Preencha o formulário abaixo para gerar seu QR Code personalizado</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormDescription>Você receberá os arquivos do QR Code neste e-mail</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de conteúdo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de conteúdo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="url">URL</SelectItem>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="vcard">vCard (Contato)</SelectItem>
                        <SelectItem value="wifi">Wi-Fi</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Selecione o tipo de conteúdo que será codificado no QR Code</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conteúdo</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          form.watch("contentType") === "url"
                            ? "https://exemplo.com"
                            : form.watch("contentType") === "wifi"
                              ? "SSID:MinhaRede;T:WPA;P:MinhasenhaWifi;;"
                              : form.watch("contentType") === "vcard"
                                ? "BEGIN:VCARD\nVERSION:3.0\nN:Sobrenome;Nome\nTEL:+5511999999999\nEMAIL:email@exemplo.com\nEND:VCARD"
                                : "Digite seu texto aqui"
                        }
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {form.watch("contentType") === "url" && "Digite a URL completa, incluindo http:// ou https://"}
                      {form.watch("contentType") === "wifi" && "Formato: SSID:NomeDaRede;T:WPA;P:Senha;;"}
                      {form.watch("contentType") === "vcard" && "Formato vCard para contatos"}
                      {form.watch("contentType") === "text" &&
                        "Digite o texto que deseja codificar (máx. 1000 caracteres)"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Logo (opcional)</FormLabel>
                    <FormControl>
                      <div className="grid gap-4">
                        <Input
                          type="file"
                          accept="image/png,image/jpeg"
                          onChange={(e) => {
                            onChange(e.target.files)
                            handleLogoChange(e)
                          }}
                          {...fieldProps}
                        />
                        {logoPreview && (
                          <div className="flex justify-center">
                            <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                              <img
                                src={logoPreview || "/placeholder.svg"}
                                alt="Logo preview"
                                className="object-contain w-full h-full"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Faça upload de uma logo PNG ou JPG (máx. 2 MB) para adicionar ao centro do QR Code
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Valor</h3>
                    <p className="text-sm text-gray-500">Pagamento único via Pix</p>
                  </div>
                  <div className="text-xl font-bold">R$ 10,00</div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processando..." : "Gerar QR Code"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
