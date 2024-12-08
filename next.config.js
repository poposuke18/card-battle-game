/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pagesの場合のみ静的エクスポートを有効化
  ...(process.env.GITHUB_ACTIONS && {
    output: 'export',
    images: {
      unoptimized: true,
    },
    trailingSlash: true,
  }),
  
  // パスの設定
  basePath: process.env.GITHUB_ACTIONS ? '/card-battle-game' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/card-battle-game' : ''
}

module.exports = nextConfig