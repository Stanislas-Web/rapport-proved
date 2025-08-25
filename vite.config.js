import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // ← écoute sur toutes les interfaces
    port: 5173,        // ← port de ton choix
    strictPort: true,  // ← échoue si 5173 déjà utilisé
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
  }
})
