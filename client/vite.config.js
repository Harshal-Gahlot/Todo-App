import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': 'H:/PROGRAMMING/cohort3/projects/todo app/client/src'
    }
  }
});
