import { defineConfig } from 'vite'

export default defineConfig({
  // 개발 서버 설정
  server: {
    port: 3000,
    open: true
  },
  
  // 빌드 설정
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  
  // 환경변수 설정
  define: {
    // 환경변수를 전역 변수로 정의
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
  }
}) 