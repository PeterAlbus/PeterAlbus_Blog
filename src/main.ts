import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "nprogress/nprogress.css";
import "element-plus/dist/index.css"; // element plus样式
import 'font-awesome/css/font-awesome.min.css'
import './assets/iconfont/iconfont.css'
import "./assets/main.css";

//全局移动指令
import dragMove from "./directives/dragMove";

const app = createApp(App);

app.use(createPinia());
app.use(router);
//注册全局移动指令
app.use(dragMove);
app.mount("#app");
