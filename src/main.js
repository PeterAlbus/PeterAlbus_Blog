import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'font-awesome/css/font-awesome.min.css'
import './assets/iconfont/iconfont.css'
import qs from 'qs'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';

import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';

import PeterAlbusVue from 'vue3-social-share';
import 'vue3-social-share/lib/index.css'

axios.defaults.withCredentials=false;
axios.defaults.baseURL='https://www.peteralbus.com:8089/'
VMdEditor.use(vuepressTheme, {
    Prism
});
const app=createApp(App)
app.config.globalProperties.$axios=axios;
app.config.globalProperties.$qs=qs;
app.use(VueAxios,axios).use(store).use(router).use(ElementPlus).use(VMdEditor).use(PeterAlbusVue).mount('#app')
app.config.devtools=true
