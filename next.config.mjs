/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 120,
      static: 180,
    },
  },
}
 
export default nextConfig

