/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static HTMLエクスポートのために必要
  images: {
    unoptimized: true,  // GitHub Pages用の設定
  },
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? '/card-battle-game'  // リポジトリ名を指定
    : '',
  basePath: process.env.NODE_ENV === 'production' 
    ? '/card-battle-game'  // リポジトリ名を指定
    : '',
}

module.exports = nextConfig