/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[{hostname:"res.cloudinary.com"},{hostname:"images.pexels.com"}],
    },

    typescript:{
        ignoreBuildErrors:true,
    },
    eslint:{
        ignoreDuringBuilds:true,
    },
};

export default nextConfig;
