/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mantendo suas configurações de headers existentes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },

  // Adicionando configurações para o sharp
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Configuração para o sharp
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig