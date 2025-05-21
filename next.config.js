/** @type {import('next').NextConfig} */
const nextConfig = {
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

  // Configuração para o sharp
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Configurações para o sharp
  experimental: {
    serverActions: true,
  },

  // Configuração específica para o sharp na Vercel
  webpack: (config) => {
    config.externals = [...(config.externals || []), { sharp: 'commonjs sharp' }]
    return config
  },
}

module.exports = nextConfig 