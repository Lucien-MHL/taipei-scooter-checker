import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 只在生產環境使用 static export 和 basePath
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    basePath: '/taipei-scooter-checker',
    assetPrefix: '/taipei-scooter-checker'
  }),
  images: {
    unoptimized: true
  }
}

export default nextConfig
