// // Simulação de serviço de e-mail
// // Em um ambiente real, você usaria o Resend

// export interface EmailOptions {
//   to: string
//   subject: string
//   text?: string
//   html?: string
//   attachments?: Array<{
//     filename: string
//     content: string | Buffer
//     contentType?: string
//   }>
// }

// export const emailService = {
//   // Enviar e-mail com anexo
//   async sendEmail(options: EmailOptions): Promise<boolean> {
//     // Em um ambiente real, você usaria o Resend para enviar o e-mail

//     console.log(`Enviando e-mail para ${options.to} com o assunto "${options.subject}"`)

//     // Simulação de envio bem-sucedido
//     return true
//   },

//   // Enviar e-mail com QR Code
//   async sendQRCodeEmail(to: string, qrCodeId: string, zipUrl: string): Promise<boolean> {
//     return this.sendEmail({
//       to,
//       subject: "Seus QR Codes estão prontos! - QRGen",
//       html: `
//         <h1>Seus QR Codes estão prontos!</h1>
//         <p>Olá,</p>
//         <p>Seus QR Codes foram gerados com sucesso e estão disponíveis para download.</p>
//         <p>Você pode baixar o arquivo ZIP clicando no link abaixo:</p>
//         <p><a href="${zipUrl}" target="_blank">Baixar QR Codes</a></p>
//         <p>Ou acessando a página de download:</p>
//         <p><a href="https://qrgen.vercel.app/qr/${qrCodeId}/download" target="_blank">Página de Download</a></p>
//         <p>Obrigado por usar o QRGen!</p>
//       `,
//     })
//   },
// }
