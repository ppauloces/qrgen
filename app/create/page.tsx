"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { QRCodeSVG } from "qrcode.react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  contentType: z.enum(["url", "text", "vcard", "wifi"], {
    required_error: "Selecione um tipo de conteúdo",
  }),
  content: z.string().min(1, { message: "O conteúdo é obrigatório" }).max(1000, {
    message: "O conteúdo deve ter no máximo 1000 caracteres",
  }),
  logo: typeof FileList !== 'undefined' ? z
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
    .optional() : z.any().optional(),
})

export default function CreatePage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [qrSize, setQrSize] = useState(256)
  const [qrForeground, setQrForeground] = useState("#000000")
  const [qrBackground, setQrBackground] = useState("#FFFFFF")
  const [qrMargin, setQrMargin] = useState(4)
  const [qrLevel, setQrLevel] = useState<"L" | "M" | "Q" | "H">("H")
  const [logoPosition, setLogoPosition] = useState<"center" | "below">("center")
  const [customText, setCustomText] = useState("")
  const [textPosition, setTextPosition] = useState<"above" | "below">("below")
  const [logoSize, setLogoSize] = useState(0.2)

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
      // Criar FormData para enviar o arquivo
      const formData = new FormData()
      formData.append("email", values.email)
      formData.append("contentType", values.contentType)
      formData.append("content", values.content)
      formData.append("qrSize", qrSize.toString())
      formData.append("qrForeground", qrForeground)
      formData.append("qrBackground", qrBackground)
      formData.append("logoSize", logoSize.toString())
      formData.append("logoPosition", logoPosition)
      formData.append("customText", customText)
      formData.append("textPosition", textPosition)

      // Verificar se a logo existe e adicionar ao FormData
      if (values.logo && values.logo.length > 0) {
        console.log("Logo encontrada:", {
          name: values.logo[0].name,
          type: values.logo[0].type,
          size: values.logo[0].size,
        })
        formData.append("logo", values.logo[0])
      } else {
        console.log("Nenhuma logo selecionada")
      }

      // Log dos dados do FormData
      console.log("Dados do formulário:", {
        email: values.email,
        contentType: values.contentType,
        content: values.content,
        qrSize,
        qrForeground,
        qrBackground,
        logoSize,
        logoPosition,
        customText,
        textPosition,
        hasLogo: values.logo && values.logo.length > 0,
      })

      // URL da API
      const apiUrl = "/api/qr"
      console.log("Enviando requisição para:", apiUrl)

      // Enviar para a API
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      })

      // Log da resposta
      console.log("Status da resposta:", response.status)
      console.log("Headers da resposta:", Object.fromEntries(response.headers.entries()))

      // Tentar ler o corpo da resposta como texto primeiro
      const responseText = await response.text()
      console.log("Resposta bruta:", responseText)

      // Verificar se a resposta é HTML
      if (responseText.trim().startsWith("<!DOCTYPE")) {
        console.error("Recebido HTML em vez de JSON")
        throw new Error("Erro na rota da API")
      }

      // Tentar fazer o parse do JSON
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Erro ao fazer parse do JSON:", e)
        throw new Error("Resposta inválida do servidor")
      }

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar o QR Code")
      }

      toast({
        title: "QR Code enviado!",
        description: "Verifique seu email para receber os arquivos.",
      })

    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        variant: "destructive",
        title: "Erro ao processar o QR Code",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
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

  const handleDownload = (format: "png" | "svg") => {
    const canvas = document.createElement("canvas")
    const svg = document.querySelector("svg")
    if (!svg) return

    if (format === "png") {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const img = new Image()
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const url = URL.createObjectURL(svgBlob)

      img.onload = () => {
        canvas.width = qrSize
        canvas.height = qrSize
        ctx.fillStyle = qrBackground
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, qrSize, qrSize)

        // Adicionar logo se existir
        if (logoPreview) {
          const logo = new Image()
          logo.src = logoPreview
          logo.onload = () => {
            const logoSize = qrSize * 0.2 // 20% do tamanho do QR Code
            const logoX = (qrSize - logoSize) / 2
            const logoY = (qrSize - logoSize) / 2
            ctx.fillStyle = "#FFFFFF"
            ctx.beginPath()
            ctx.arc(qrSize / 2, qrSize / 2, logoSize / 2, 0, Math.PI * 2)
            ctx.fill()
            ctx.drawImage(logo, logoX, logoY, logoSize, logoSize)
            
            // Download
            const link = document.createElement("a")
            link.download = "qrcode.png"
            link.href = canvas.toDataURL("image/png")
            link.click()
          }
        } else {
          // Download sem logo
          const link = document.createElement("a")
          link.download = "qrcode.png"
          link.href = canvas.toDataURL("image/png")
          link.click()
        }
      }
      img.src = url
    } else {
      // Download SVG
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const url = URL.createObjectURL(svgBlob)
      const link = document.createElement("a")
      link.download = "qrcode.svg"
      link.href = url
      link.click()
    }
  }

  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para a página inicial
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Preview</CardTitle>
            <CardDescription>Visualização do seu QR Code</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6">
              <div className="flex flex-col items-center gap-4">
                {textPosition === "above" && customText && (
                  <p className="text-center text-lg font-medium">{customText}</p>
                )}

                <div className="relative bg-white p-4 rounded-lg shadow-lg" style={{ width: qrSize, height: qrSize }}>
                  <QRCodeSVG
                    value={form.watch("content") || "https://exemplo.com"}
                    size={qrSize}
                    level={qrLevel}
                    includeMargin={false}
                    className="w-full h-full"
                    fgColor={qrForeground}
                    bgColor={qrBackground}
                  />
                  {logoPosition === "center" && logoPreview && (
                    <div 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        width: qrSize * logoSize,
                        height: qrSize * logoSize,
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="w-full h-full object-contain"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  )}
                </div>

                {logoPosition === "below" && logoPreview && (
                  <div 
                    className="flex justify-center"
                    style={{
                      width: qrSize * logoSize,
                      height: qrSize * logoSize,
                    }}
                  >
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {textPosition === "below" && customText && (
                  <p className="text-center text-lg font-medium">{customText}</p>
                )}
              </div>

              <div className="w-full mt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Tamanho</Label>
                  <Slider
                    value={[qrSize]}
                    onValueChange={([value]) => setQrSize(value)}
                    min={128}
                    max={512}
                    step={8}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cor do QR Code</Label>
                    <Input
                      type="color"
                      value={qrForeground}
                      onChange={(e) => setQrForeground(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cor de Fundo</Label>
                    <Input
                      type="color"
                      value={qrBackground}
                      onChange={(e) => setQrBackground(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nível de Correção</Label>
                  <Select value={qrLevel} onValueChange={(value: "L" | "M" | "Q" | "H") => setQrLevel(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível de correção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Baixo (7%)</SelectItem>
                      <SelectItem value="M">Médio (15%)</SelectItem>
                      <SelectItem value="Q">Quartil (25%)</SelectItem>
                      <SelectItem value="H">Alto (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Posição da Logo</Label>
                  <Select value={logoPosition} onValueChange={(value: "center" | "below") => setLogoPosition(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a posição da logo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="center">Centro do QR Code</SelectItem>
                      <SelectItem value="below">Abaixo do QR Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Texto Personalizado</Label>
                  <Textarea
                    placeholder="Digite um texto para aparecer junto ao QR Code"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Select value={textPosition} onValueChange={(value: "above" | "below") => setTextPosition(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a posição do texto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Acima do QR Code</SelectItem>
                      <SelectItem value="below">Abaixo do QR Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {logoPreview && (
                  <div className="space-y-2">
                    <Label>Tamanho da Logo</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[logoSize * 100]}
                        onValueChange={([value]) => setLogoSize(value / 100)}
                        min={5}
                        max={40}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {Math.round(logoSize * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ajuste o tamanho da logo em relação ao QR Code
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
