/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/card-battle-game',
  assetPrefix: '/card-battle-game/',
  trailingSlash: true,
}

module.exports = nextConfig