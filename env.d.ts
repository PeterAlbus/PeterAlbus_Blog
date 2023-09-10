/// <reference types="vite/client" />
declare module "*.vue" {
    import { defineComponent } from "vue";
    const Component: ReturnType<typeof defineComponent>;
    export default Component;
};

declare module '@kangc/v-md-editor';
declare module '@kangc/v-md-editor/lib/preview';
declare module '@kangc/v-md-editor/lib/theme/vuepress';
declare module 'prismjs';
declare module 'APlayer';
declare module 'element-plus/dist/locale/zh-cn.mjs';
declare module '@element-plus/icons-vue';
