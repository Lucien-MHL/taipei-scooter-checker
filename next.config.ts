import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/taipei-scooter-checker',
  assetPrefix: '/taipei-scooter-checker',
  images: {
    unoptimized: true
  }
}

export default nextConfig
