import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

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
      plugins: [react()],
      define: {
        'process.env.API_URL': JSON.stringify(env.VITE_API_URL),
        'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // FIX: `__dirname` is not available in ES modules. This is the modern way to get the directory name of the current module.
          '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src'),
        }
      }
    };
});