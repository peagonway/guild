import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      //端口号
      //port: 5173,
      '/api': {// api 表示拦截以 /api开头的请求路径
        target: 'http://127.0.0.1:5000',//跨域的域名（不需要写路径）process.env.VUE_APP_URL
        changeOrigin: true,             //是否开启跨域
        //ws: true,                     //是否代理websocked
        // pathRewrite: {                  //重写路径
        //   '^/api': ''//把 /api 变为空字符
        // }
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  }
})