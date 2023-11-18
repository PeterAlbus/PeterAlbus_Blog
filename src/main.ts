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

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

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

app.use(createPinia());
app.use(router);
//注册全局移动指令
app.use(dragMove);
app.use(PeterAlbusVue).use(mavonEditor);
app.mount("#app");
