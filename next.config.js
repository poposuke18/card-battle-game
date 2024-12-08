/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 静的エクスポートを有効化
  images: {
    unoptimized: true,  // 静的エクスポート用の設定
  },
  basePath: process.env.NODE_ENV === 'production' ? '/card-battle-game' : '',
  // リポジトリ名と一致させる必要があります
  assetPrefix: process.env.NODE_ENV === 'production' ? '/card-battle-game' : '',
  // 動的ルートの生成を設定
  trailingSlash: true,
}

module.exports = nextConfig