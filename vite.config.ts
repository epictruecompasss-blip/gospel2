import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    cssCodeSplit: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          admin: [
            './src/pages/Admin.tsx',
            './src/pages/AdminLogin.tsx',
            './src/pages/admin/BlogAdmin.tsx',
            './src/components/AdminInbox.tsx',
            './src/components/AdminComments.tsx',
          ],
          books: [
            './src/pages/Books.tsx',
            './src/pages/books/Hero.tsx',
            './src/pages/books/CollectionCards.tsx',
            './src/pages/books/AgeCards.tsx',
          ],
        },
      },
    },
  },
});
