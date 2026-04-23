// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    eslint: {
      // ESLint is run separately in CI; suppress circular-ref errors from
      // eslint-config-next during `next build` to avoid blocking deploys.
      ignoreDuringBuilds: true,
    },

    async redirects() {
      return [
        {
          source: '/projects/:id',
          destination: '/experiments/projects/:id',
          permanent: true,
        },
      ];
    },
  
    // Enable experimental App Router
    // experimental: {
    //   appDir: true,
    // },
  
    // Sass/SCSS support is built-in, so you can import .scss files directly
    // You can also add global SCSS via _app.js or _app.tsx
    sassOptions: {
      includePaths: ['./styles'],
      quietDeps: true,
    },
  
    // Webpack customizations
    webpack: (config, { isServer }) => {
      // Support importing static images from custom folders (like /imgs)
      config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/images/[name][hash][ext]',
        },
      });
  
      // Support importing JSON from any folder
      config.module.rules.push({
        test: /\.json$/,
        type: 'json',
      });
  
      return config;
    },
  
    // Optional: configure basePath if your app is not hosted at root
    // basePath: '/fabric-portal',
  
    // Optional: configure public runtime environment variables
    env: {
      PORTAL_NAME: 'Fabric Portal',
    },

    compiler: {
      styledComponents: true,
    },

    turbopack: {
      root: process.cwd(),
    },
  };
  
  module.exports = nextConfig;
  