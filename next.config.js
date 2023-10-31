/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'flavr-fb.web.app',
            port: '',
            pathname: '/**',
          },
        ],
      },
}

module.exports = nextConfig