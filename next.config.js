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
  assetPrefix: process.env.GITHUB_ACTIONS ? '/card-battle-game' : '',

  // 静的ページの生成設定（GitHub Pages用）
  ...(process.env.GITHUB_ACTIONS && {
    generateStaticParams: async () => {
      return [
        { stage: '1' },
        { stage: '2' },
        { stage: '3' },
        { stage: '4' }
      ]
    }
  })
}

module.exports = nextConfig