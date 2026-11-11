import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@pages': path.resolve(__dirname, './pages'),
      '@components': path.resolve(__dirname, './components'),
      '@sections': path.resolve(__dirname, './sections'),
      '@layouts': path.resolve(__dirname, './layouts'),
      '@layout': path.resolve(__dirname, './layout'),
      '@types': path.resolve(__dirname, './types'),
      '@routes': path.resolve(__dirname, './routes'),
      '@utils': path.resolve(__dirname, './utils'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
