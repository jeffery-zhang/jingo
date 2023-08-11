/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'jingo-obs.zhj13.com' }],
  },
}

module.exports = nextConfig
