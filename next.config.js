/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/card-battle-game' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/card-battle-game' : '',
  trailingSlash: true,
  // 静的ページの生成設定を追加
  generateStaticParams: async () => {
    return [
      { stage: '1' },
      { stage: '2' },
      { stage: '3' },
      { stage: '4' }
    ]
  }
}

module.exports = nextConfig