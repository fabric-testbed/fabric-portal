// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  
    // Enable experimental App Router
    // experimental: {
    //   appDir: true,
    // },
  
    // Sass/SCSS support is built-in, so you can import .scss files directly
    // You can also add global SCSS via _app.js or _app.tsx
    sassOptions: {
      includePaths: ['./styles'],
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
  };
  
  module.exports = nextConfig;
  