import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
const target = 'http://localhost:5122';

export default defineConfig({
    plugins: [plugin()],
    css: {
        postcss: './postcss.config.js',
      },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '/api/': {
                target: target,
                changeOrigin: true, 
                secure: false
            }
        },
        port: 5130, 
    }
});
