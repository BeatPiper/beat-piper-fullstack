/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.scdn.co',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.spotifycdn.com',
        port: '',
        pathname: '**',
      },
    ],
  },

  rewrites: async () => {
    return [
      {
        source: '/healthz',
        destination: '/api/health',
      },
    ];
  },
};

export default nextConfig;
