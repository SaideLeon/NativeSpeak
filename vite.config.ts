import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import ViteSitemapPlugin from 'vite-plugin-sitemap';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'https://nativespeak.cognick.qzz.io',
          changeOrigin: true,
        },
      },
    },
    preview: {
      allowedHosts: ['nativespeak.live', '*.nativespeak.live','nativespeak.app','*.nativespeak.app']
, // 👈 ADICIONE ESTA LINHA
      port: 3001, // opcional, pode deixar padrão
    },
    plugins: [
      react(),
      ViteSitemapPlugin({
        hostname: 'https://nativespeak.live',
        dynamicRoutes: ['/', '/sobre', '/contato'],
      }),
    ],
    define: {
      'process.env.API_URL': JSON.stringify(env.VITE_API_URL),
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src'),
      },
    },
  };
});
