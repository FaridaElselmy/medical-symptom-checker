/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
=======
  reactStrictMode: true,  
>>>>>>> upstream/main
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
<<<<<<< HEAD
}

export default nextConfig
=======

  experimental: {
    allowedOrigins: ['local-origin.dev', '*.local-origin.dev']
  }
  
};

export default nextConfig;  // ES modules syntax for .mjs
>>>>>>> upstream/main
