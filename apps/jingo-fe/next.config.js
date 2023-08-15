/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'jingo-obs.zhj13.com' }],
  },
  // 将packages中的自定义包加入nextjs的构建步骤
  transpilePackages: ['@jingo/icons'],
}

module.exports = nextConfig
