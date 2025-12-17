import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import stores, {useStore} from './stores'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import config from './config/index'

import XComponent from '@/components'
const app = createApp(App);


//========================自定义全局配置
window.codeying = {}
//登录用户类型
codeying.usertypeList = [
    {label:'管理员',value:'admin'},
    {label:'学生',value:'student'},
]

//========================自定义全局配置
app.config.globalProperties.filePath = import.meta.env.VITE_PROXY_SERVER_URL + '/file/downloadById?fileid=';
app.config.globalProperties.publicPath = import.meta.env.BASE_URL;
app.use(ElementPlus,{locale: zhCn});
app.use(XComponent,{componentImport: config.componentImport});
app.use(router);
app.use(stores)

import Core from '@/core';
app.use(Core, {config, useStore})

window['$app'] = app;
app.mount('#app');

