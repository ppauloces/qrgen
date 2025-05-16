import { NextResponse } from "next/server"
import { Resend } from "resend"
import QRCode from "qrcode"
import sharp from "sharp"

const resend = new Resend(process.env.RESEND_API_KEY)

export const POST = async (request: Request) => {
  try {
    // Verificar se o request é válido
    if (!request.body) {
      return NextResponse.json(
        { error: "Requisição inválida" },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    
    // Log dos dados recebidos
    console.log("Dados recebidos na API:", {
      email: formData.get("email"),
      contentType: formData.get("contentType"),
      content: formData.get("content"),
      qrSize: formData.get("qrSize"),
      qrForeground: formData.get("qrForeground"),
      qrBackground: formData.get("qrBackground"),
      logoSize: formData.get("logoSize"),
      logoPosition: formData.get("logoPosition"),
      customText: formData.get("customText"),
      textPosition: formData.get("textPosition"),
      hasLogo: formData.has("logo"),
    })

    const email = formData.get("email") as string
    const content = formData.get("content") as string
    const contentType = formData.get("contentType") as string
    const logo = formData.get("logo") as File
    const qrSize = parseInt(formData.get("qrSize") as string)
    const qrForeground = formData.get("qrForeground") as string
    const qrBackground = formData.get("qrBackground") as string
    const logoSize = parseFloat(formData.get("logoSize") as string)
    const logoPosition = formData.get("logoPosition") as string
    const customText = formData.get("customText") as string
    const textPosition = formData.get("textPosition") as string

    // Log da logo
    if (logo) {
      console.log("Logo recebida:", {
        name: logo.name,
        type: logo.type,
        size: logo.size,
      })
    } else {
      console.log("Nenhuma logo recebida")
    }

    // Validar dados recebidos
    if (!email || !content || !qrSize) {
      return NextResponse.json(
        { error: "Dados inválidos: email, content e qrSize são obrigatórios" },
        { status: 400 }
      )
    }

    // Gerar QR Code como PNG
    const qrPng = await QRCode.toBuffer(content, {
      type: "png",
      width: qrSize,
      margin: 1,
      color: {
        dark: qrForeground || "#000000",
        light: qrBackground || "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    })

    let finalQrPng = qrPng
    if (logo) {
      try {
        const logoBuffer = Buffer.from(await logo.arrayBuffer())
        const logoSizePixels = Math.floor(qrSize * logoSize) // Tamanho da logo em pixels
        const circleSize = Math.floor(logoSizePixels * 1.2) // Círculo 20% maior que a logo

        // Cria o círculo branco
        const circleSvg = `
          <svg width="${circleSize}" height="${circleSize}">
            <circle cx="${circleSize/2}" cy="${circleSize/2}" r="${circleSize/2}" fill="white"/>
          </svg>
        `
        const circleBuffer = Buffer.from(circleSvg)

        // Redimensiona a logo
        const resizedLogo = await sharp(logoBuffer)
          .resize(logoSizePixels, logoSizePixels)
          .toBuffer()

        // Composição: QR + círculo + logo
        finalQrPng = await sharp(qrPng)
          .composite([
            {
              input: await sharp(circleBuffer).png().toBuffer(),
              top: Math.floor((qrSize - circleSize) / 2),
              left: Math.floor((qrSize - circleSize) / 2),
            },
            {
              input: resizedLogo,
              top: Math.floor((qrSize - logoSizePixels) / 2),
              left: Math.floor((qrSize - logoSizePixels) / 2),
            },
          ])
          .png()
          .toBuffer()
      } catch (error) {
        console.error("Erro ao processar a logo:", error)
        finalQrPng = qrPng
      }
    }

    // Converter para base64 para exibição no email
    const qrBase64 = `data:image/png;base64,${finalQrPng.toString("base64")}`

    // Enviar email com o arquivo
    await resend.emails.send({
      from: "QRGen <onboarding@resend.dev>",
      to: email,
      subject: "Seu QR Code personalizado está pronto!",
      html: `
        <h1>Seu QR Code personalizado está pronto!</h1>
        <p>Obrigado por usar o QRGen. Aqui está seu QR Code personalizado.</p>
        <div style="text-align: center; margin: 20px 0;">
          <img src="${qrBase64}" alt="QR Code" style="max-width: 100%; height: auto;" />
        </div>
      `,
      attachments: [
        {
          filename: "qrcode.png",
          content: finalQrPng,
        },
      ],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing QR Code:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao processar o QR Code" },
      { status: 500 }
    )
  }
}
