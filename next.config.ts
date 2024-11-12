/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',  // 追加: 静的エクスポートを有効化
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/card-battle-game' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/card-battle-game' : '',
}

module.exports = nextConfig