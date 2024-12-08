import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    preact(),
    {
      name: 'copy-nojekyll',
      generateBundle() {
        const nojekyllPath = path.resolve(__dirname, 'public/.nojekyll')

        if (fs.existsSync(nojekyllPath)) {
          const fileContents = fs.readFileSync(nojekyllPath, 'utf-8')

          this.emitFile({
            type: 'asset',
            fileName: '.nojekyll',
            source: fileContents
          })
        }
      }
    }
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
})
