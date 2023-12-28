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
          {
            protocol: 'https',
            hostname: 'apps-prod-dd0a0.web.app',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
}

module.exports = nextConfig