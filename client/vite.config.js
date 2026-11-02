import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        include: '**/*.{jsx,js}',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        src: path.resolve(__dirname, './src'),
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.REACT_APP_SERVER_URL': JSON.stringify(
        env.VITE_SERVER_URL || env.REACT_APP_SERVER_URL || ''
      ),
      global: 'window',
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/socket.io': {
          target: env.VITE_SERVER_URL || 'http://localhost:9700',
          ws: true,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'build',
      emptyOutDir: true,
    },
  };
});
