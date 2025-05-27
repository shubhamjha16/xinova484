import type {NextConfig} from 'next';
import webpack from 'webpack';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer, nextRuntime, webpack }) => { // or just `webpack` if imported directly
    // Ensure the plugin isn't added multiple times if the script is re-run
    if (!config.plugins.some(plugin => plugin.constructor.name === 'IgnorePlugin' && plugin.options && plugin.options.resourceRegExp && plugin.options.resourceRegExp.source === '^@opentelemetry\\/exporter-jaeger$')) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^@opentelemetry\/exporter-jaeger$/,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
