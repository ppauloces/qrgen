// Simulação de um banco de dados para o projeto
// Em um ambiente real, você usaria Vercel Postgres (Neon)

export interface QRCodeRecord {
  id: string
  email: string
  contentType: "url" | "text" | "vcard" | "wifi"
  content: string
  logoUrl: string | null
  status: "pending" | "paid" | "failed"
  pixCode: string | null
  createdAt: Date
  paidAt: Date | null
  filesUrl: string | null
}

// Simulação de registros em memória
const records: QRCodeRecord[] = []

export const db = {
  // Criar novo registro de QR Code
  async createQRCode(data: Omit<QRCodeRecord, "createdAt" | "paidAt" | "filesUrl">): Promise<QRCodeRecord> {
    const record: QRCodeRecord = {
      ...data,
      createdAt: new Date(),
      paidAt: null,
      filesUrl: null,
    }

    records.push(record)
    return record
  },

  // Buscar QR Code por ID
  async getQRCodeById(id: string): Promise<QRCodeRecord | null> {
    return records.find((record) => record.id === id) || null
  },

  // Atualizar status do QR Code
  async updateQRCodeStatus(
    id: string,
    status: "pending" | "paid" | "failed",
    paidAt?: Date,
  ): Promise<QRCodeRecord | null> {
    const recordIndex = records.findIndex((record) => record.id === id)

    if (recordIndex === -1) {
      return null
    }

    records[recordIndex] = {
      ...records[recordIndex],
      status,
      paidAt: status === "paid" ? paidAt || new Date() : null,
    }

    return records[recordIndex]
  },

  // Atualizar URL dos arquivos
  async updateQRCodeFilesUrl(id: string, filesUrl: string): Promise<QRCodeRecord | null> {
    const recordIndex = records.findIndex((record) => record.id === id)

    if (recordIndex === -1) {
      return null
    }

    records[recordIndex] = {
      ...records[recordIndex],
      filesUrl,
    }

    return records[recordIndex]
  },
}
