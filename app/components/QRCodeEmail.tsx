import { QRCodeSVG } from "qrcode.react"

interface QRCodeEmailProps {
  content: string
  size: number
  foreground: string
  background: string
  logo?: string
  logoSize?: number
  customText?: string
  textPosition?: "above" | "below"
}

export function QRCodeEmail({
  content,
  size,
  foreground,
  background,
  logo,
  logoSize = 0.2,
  customText,
  textPosition = "below",
}: QRCodeEmailProps) {
  return (
    <div>
      <QRCodeSVG
        value={content}
        size={size}
        level="H"
        fgColor={foreground}
        bgColor={background}
        imageSettings={
          logo
            ? {
                src: logo,
                height: size * logoSize,
                width: size * logoSize,
                excavate: true,
                x: size * 0.4,
                y: size * 0.4,
              }
            : undefined
        }
      />
      {customText && (
        <div
          style={{
            textAlign: "center",
            marginTop: textPosition === "below" ? "10px" : "0",
            marginBottom: textPosition === "above" ? "10px" : "0",
          }}
        >
          {customText}
        </div>
      )}
    </div>
  )
} 