import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "nprogress/nprogress.css";
import "./assets/main.css";
import "element-plus/dist/index.css"; // element plus样式
import * as ElIcons from "@element-plus/icons-vue"; //element plus图标
import 'font-awesome/css/font-awesome.min.css'
import './assets/iconfont/iconfont.css'

import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';

import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';

import PeterAlbusVue from 'vue3-social-share';
import 'vue3-social-share/lib/index.css'

//全局移动指令
import dragMove from "./directives/dragMove";

const app = createApp(App);
//全局引用element-plus
// import ElementPlus from 'element-plus';
// app.use(ElementPlus);

// 全局注册element-plus图标
for (const name in ElIcons) {
  if(name==='Share') continue;
  app.component(name, (ElIcons as any)[name]);
}

VMdEditor.use(vuepressTheme, {
  Prism
});

VMdPreview.use(vuepressTheme, {
  Prism
});

app.use(createPinia());
app.use(router);
//注册全局移动指令
app.use(dragMove);
app.use(VMdEditor).use(VMdPreview).use(PeterAlbusVue);
app.mount("#app");
