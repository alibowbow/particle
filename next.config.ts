import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion', '@react-three/drei'],
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
