/** @type {import('next').NextConfig} */
const serverSideUrl = process.env.SERVER_URL

const nextConfig = {
  distDir: 'build',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'jingo-obs.zhj13.com' },
      { protocol: 'http', hostname: 'dummyimage.com' },
    ],
  },
  // 将packages中的自定义包加入nextjs的构建步骤
  transpilePackages: ['@jingo/icons'],
  // 使用api路由可以替代rewrites配置
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: `${serverSideUrl}/:path*`,
  //     },
  //   ]
  // },
}

module.exports = nextConfig
