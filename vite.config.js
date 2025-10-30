import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Proxy API requests in development
        '/api/omdb-proxy': {
          target: 'https://www.omdbapi.com',
          changeOrigin: true,
          rewrite: (path) => {
            // Extract query params from the request
            const url = new URL(path, 'http://localhost')
            const params = url.searchParams
            
            // Add the API key from env
            params.append('apikey', env.VITE_OMDB_API_KEY)
            
            // Return the rewritten path
            return `/?${params.toString()}`
          },
        },
      },
    },
  }
})

