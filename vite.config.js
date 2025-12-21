import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173, 
  },
  resolve: {
    alias: {
    },
  },
  optimizeDeps: {
    include: [
      "@mui/x-date-pickers-pro", 
      "@mui/x-date-pickers", 
      "@mui/material",  
      "dayjs", 
                    
    ],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true,
    sourcemap: false,
  },
});






