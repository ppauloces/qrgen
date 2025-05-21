import { NextResponse } from "next/server"
import { Resend } from "resend"
import QRCode from "qrcode"
import sharp from "sharp"

const resend = new Resend(process.env.RESEND_API_KEY)

// Função utilitária para converter hex em RGB
function hexToRgb(hex: string) {
  const match = hex.replace('#', '').match(/.{1,2}/g)
  if (!match) return { r: 255, g: 255, b: 255, alpha: 1 }
  const [r, g, b] = match.map(x => parseInt(x, 16))
  return { r, g, b, alpha: 1 }
}

// Exportar o método POST como uma função nomeada
export async function POST(request: Request) {
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
      textFont: formData.get("textFont"),
      textSize: formData.get("textSize"),
      useMainLogo: formData.get("useMainLogo"),
      secondLogoPosition: formData.get("secondLogoPosition"),
      hasLogo: formData.has("logo"),
    })

    const email = formData.get("email") as string
    const content = formData.get("content") as string
    const contentType = formData.get("contentType") as string
    const logo = formData.get("logo") as File
    const qrSize = parseInt(formData.get("qrSize") as string, 10) || 256
    const qrForeground = formData.get("qrForeground") as string
    const qrBackground = formData.get("qrBackground") as string
    const logoSize = parseFloat(formData.get("logoSize") as string)
    const logoPosition = formData.get("logoPosition") as string
    const customText = formData.get("customText") as string
    const textPosition = formData.get("textPosition") as string
    const textFont = formData.get("textFont") as string
    const textSize = parseInt(formData.get("textSize") as string, 10) || 24
    const useMainLogo = formData.get("useMainLogo") === "true"
    const secondLogoPosition = formData.get("secondLogoPosition") as string
    const secondLogo = formData.get("secondLogo") as File | null
    const textColor = (formData.get("textColor") as string) || "#000000"

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

    // Gerar QR Code com nível de correção alto
    const qrPng = await QRCode.toBuffer(content, {
      type: "png",
      width: qrSize,
      margin: 2, // Aumentar margem para melhor leitura
      color: {
        dark: qrForeground || "#000000",
        light: qrBackground || "#FFFFFF",
      },
      errorCorrectionLevel: "H", // Nível máximo de correção
    })

    let finalQrPng = qrPng
    let printModelPng: Buffer | null = null

    // Processar logo com melhorias
    if (logo) {
      try {
        const logoBuffer = Buffer.from(await logo.arrayBuffer())
        const logoSize = parseFloat(formData.get("logoSize") as string) || 0.2
        // Limitar tamanho da logo para 30% do QR code
        const maxLogoSize = Math.min(logoSize, 0.3)
        const logoSizePixels = Math.floor(qrSize * maxLogoSize)

        // Criar círculo branco para a logo
        const circleSize = Math.floor(logoSizePixels * 1.2) // 20% maior que a logo
        const circleSvg = `
          <svg width="${circleSize}" height="${circleSize}">
            <circle cx="${circleSize/2}" cy="${circleSize/2}" r="${circleSize/2}" fill="white"/>
          </svg>
        `
        const circleBuffer = Buffer.from(circleSvg)

        // Redimensionar logo mantendo proporção
        const resizedLogo = await sharp(logoBuffer)
          .resize(logoSizePixels, logoSizePixels, { 
            fit: "contain", 
            background: { r: 255, g: 255, b: 255, alpha: 0 } 
          })
          .toBuffer()

        // Composição final com círculo branco e logo
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
        console.error("Erro ao processar logo:", error)
        finalQrPng = qrPng
      }
    }

    // Verificações corretas de logo
    const hasMainLogo = useMainLogo && logo && logo.size > 0
    const hasSecondLogo = secondLogo && secondLogo.size > 0
    const shouldGeneratePrintModel = Boolean(customText) || hasMainLogo || hasSecondLogo

    // Log para debug
    console.log("Verificando modelo de impressão:", {
      customText,
      useMainLogo,
      hasMainLogo,
      hasSecondLogo,
      logoSize: logo?.size,
      secondLogoSize: secondLogo?.size
    })

    // Gerar modelo de impressão se houver texto ou logo válido
    if (shouldGeneratePrintModel) {
      try {
        console.log("Iniciando geração do modelo de impressão:", {
          customText,
          useMainLogo,
          hasMainLogo,
          hasSecondLogo,
          secondLogoPosition
        })

        // Novo layout: plaquinha
        const printWidth = Math.max(1, Math.round(qrSize * 2))
        const printHeight = Math.max(1, Math.round(qrSize * 2.2))
        const margin = Math.max(1, Math.round(qrSize * 0.2))
        const logoArea = hasMainLogo || hasSecondLogo ? Math.round(qrSize * 0.5) : 0
        const textArea = customText ? textSize * 2 + margin : 0

        console.log("Valores do modelo de impressão:", {
          qrSize,
          textSize,
          printWidth,
          printHeight,
          margin,
          logoArea,
          textArea
        })

        let printModel = sharp({
          create: {
            width: printWidth,
            height: printHeight,
            channels: 4,
            background: hexToRgb(qrBackground)
          }
        })

        let printLogoBuffer: Buffer | null = null
        if (hasMainLogo) {
          console.log("Usando logo principal para o modelo de impressão")
          const logoBuffer = Buffer.from(await logo.arrayBuffer())
          const logoSizePixels = Math.floor(qrSize * 0.3) // 30% do tamanho do QR code
          printLogoBuffer = await sharp(logoBuffer)
            .resize(logoSizePixels, logoSizePixels)
            .toBuffer()
        } else if (hasSecondLogo) {
          console.log("Usando segunda logo para o modelo de impressão")
          const logoBuffer = Buffer.from(await secondLogo.arrayBuffer())
          const logoSizePixels = Math.floor(qrSize * 0.3)
          printLogoBuffer = await sharp(logoBuffer)
            .resize(logoSizePixels, logoSizePixels)
            .toBuffer()
        }

        const composites = []

        // Centralizar QR Code na vertical e horizontal
        const qrTop = Math.floor((printHeight - qrSize - textArea) / 2)
        composites.push({
          input: finalQrPng,
          top: qrTop,
          left: Math.floor((printWidth - qrSize) / 2)
        })

        // 2. Segunda logo posicionada conforme escolha do usuário (navbar/selo ou mesma do QR)
        if (hasSecondLogo || (useMainLogo && logo && logo.size > 0)) {
          let logoFile = hasSecondLogo ? secondLogo : logo
          const maxLogoWidth = Math.floor(printWidth * 0.3)
          const maxLogoHeight = Math.floor(printHeight * 0.15)
          const logoBuffer = Buffer.from(await logoFile.arrayBuffer())
          const resizedSecondLogo = await sharp(logoBuffer)
            .resize({ width: maxLogoWidth, height: maxLogoHeight, fit: 'inside' })
            .toBuffer()
          const logoMeta = await sharp(resizedSecondLogo).metadata()
          const logoWidth = logoMeta.width || maxLogoWidth
          const logoHeight = logoMeta.height || maxLogoHeight

          const logoMargin = 12;
          let top = 0;
          let left = 0;
          switch (secondLogoPosition) {
            case "top-left":
              top = logoMargin;
              left = logoMargin;
              break;
            case "top-right":
              top = logoMargin;
              left = printWidth - logoWidth - logoMargin;
              break;
            case "bottom-left":
              top = printHeight - logoHeight - logoMargin;
              left = logoMargin;
              break;
            case "bottom-right":
              top = printHeight - logoHeight - logoMargin;
              left = printWidth - logoWidth - logoMargin;
              break;
          }

          composites.push({
            input: resizedSecondLogo,
            top,
            left
          })
        }

        // 3. Texto personalizado centralizado acima ou abaixo do QR
        if (customText) {
          const textSvg = `
            <svg width="${printWidth}" height="${textSize * 2}">
              <text
                x="50%"
                y="50%"
                text-anchor="middle"
                dominant-baseline="middle"
                font-family="${textFont}, Arial, sans-serif"
                font-size="${textSize}px"
                font-weight="600"
                fill="${textColor}"
              >${customText}</text>
            </svg>
          `
          const textBuffer = Buffer.from(textSvg)
          if (textPosition === "above") {
            // Texto acima do QR
            composites.push({
              input: await sharp(textBuffer).png().toBuffer(),
              top: Math.max(0, qrTop - textSize * 2 - Math.floor(margin / 2)),
              left: 0
            })
          } else {
            // Texto abaixo do QR
            composites.push({
              input: await sharp(textBuffer).png().toBuffer(),
              top: qrTop + qrSize + Math.floor(margin / 3),
              left: 0
            })
          }
        }

        printModel = printModel.composite(composites)
        printModelPng = await printModel.png().toBuffer()
        console.log("Modelo de impressão gerado com sucesso (plaquinha)")
      } catch (error) {
        console.error("Erro ao gerar modelo de impressão:", error)
      }
    } else {
      console.log("Modelo de impressão não gerado - nenhuma condição atendida")
    }

    // Converter para base64
    const qrBase64 = `data:image/png;base64,${finalQrPng.toString("base64")}`
    const printModelBase64 = printModelPng ? `data:image/png;base64,${printModelPng.toString("base64")}` : null

    // Retornar os dados do QR code sem enviar o email
    return NextResponse.json({ 
      success: true,
      qrCode: {
        base64: qrBase64,
        printModelBase64,
        png: finalQrPng.toString("base64"),
        printModelPng: printModelPng ? printModelPng.toString("base64") : null
      }
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    )
  }
}
