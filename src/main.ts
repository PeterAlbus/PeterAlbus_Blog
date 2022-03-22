import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'font-awesome/css/font-awesome.min.css'
import './assets/iconfont/iconfont.css'
import qs from 'qs'

import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';

import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';

import PeterAlbusVue from 'vue3-social-share';
import 'vue3-social-share/lib/index.css'

import 'element-plus/dist/index.css'

axios.defaults.withCredentials=false;
axios.defaults.baseURL='https://www.peteralbus.com:8089/'


VMdEditor.use(vuepressTheme, {
    Prism
});

VMdPreview.use(vuepressTheme, {
    Prism
});
const app=createApp(App)
app.config.globalProperties.$axios=axios;
app.config.globalProperties.$qs=qs;
app.use(VueAxios,axios).use(router).use(VMdEditor).use(VMdPreview).use(PeterAlbusVue).mount('#app')
// app.config.devtools=true
