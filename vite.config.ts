import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// element plus按需导入
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { configCompressPlugin } from "./build/vite/plugins/compress";
import prismjs from 'vite-plugin-prismjs';
// import * as path from "path";
// const resolve = function (dir: any) {
//   return path.join(__dirname, dir);
// };

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [
    vue(),
    // element plus按需导入
    AutoImport({
      resolvers: [
        //自动导入element plus相关函数
        ElementPlusResolver()
      ]
    }),
    Components({
      resolvers: [
        //自动导入element plus组件
        ElementPlusResolver()
      ]
    }),
    prismjs({
      languages: 'all',
    }),
    configCompressPlugin("gzip"),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    // 规定触发警告的 chunk 大小。（以 kbs 为单位）
    chunkSizeWarningLimit: 500,
    // 指定生成静态资源的存放路径（相对于 build.outDir）。
    assetsDir: "./assets",
    // 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求.单位 KB
    assetsInlineLimit: 4096,
    // 启用/禁用 CSS 代码拆分。当启用时，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在其被加载时插入。

    // 如果禁用，整个项目中的所有 CSS 将被提取到一个 CSS 文件中。
    cssCodeSplit: true
    // 分解块，将大块分解成更小的块
    // rollupOptions: {
    //   output: {
    //     manualChunks(id) {
    //       if (id.includes('node_modules')) {
    //         return id.toString().split('node_modules/')[1].split('/')[0].toString();
    //       }
    //     }
    //   }
    // }

  },
  // lintOnSave: true, // 是否开启eslint保存检测
  // productionSourceMap: false, // 是否在构建生产包时生成sourcdeMap
  // chainWebpack: config => {
  //   config.resolve.alias
  //     .set("@", resolve("src"))
  //     .set("@v", resolve("src/views"))
  //     .set("@c", resolve("src/components"))
  //     .set("@u", resolve("src/utils"))
  //     .set("@s", resolve("src/service")); /* 别名配置 */
  //   config.optimization.runtimeChunk("single");
  // },
  server: {
    // host: "localhost",
    /* 本地ip地址 */
    //host: "192.168.1.107",
    host: "0.0.0.0", //局域网和本地访问
    port: 8080,
    /* 自动打开浏览器 */
    open: false,
    /* 跨域代理 */
    // proxy: {
    //   "/api": {
    //     /* 目标代理服务器地址 */
    //     target: "", //
    //     // target: "", //
    //     /* 允许跨域 */
    //     changeOrigin: true,
    //     ws: true,
    //     pathRewrite: {
    //       "^/api": ""
    //     }
    //   }
    // }
  },
  // 开发或生产环境服务的公共基础路径。合法的值包括以下几种：
  // 绝对 URL 路径名，例如 /foo/
  // 完整的 URL，例如 https://foo.com/
  // 空字符串或 ./（用于嵌入形式的开发）
  base: './'
});
