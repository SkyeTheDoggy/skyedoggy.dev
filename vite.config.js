import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    preact(),
    {
      name: 'copy-nojekyll',
      generateBundle() {
        const nojekyllPath = resolve(__dirname, 'public/.nojekyll')

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
