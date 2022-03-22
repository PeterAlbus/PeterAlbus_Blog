import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import prismjs from 'vite-plugin-prismjs';
import * as Path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
    return {
        plugins: [
            vue(),
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
            prismjs({
                languages: ['json','typescript'],
            }),
        ],
        resolve:{
          alias:{
              '@':Path.resolve('src'),
          }
        },
        server: {
            port: 80
        }
    }
})
