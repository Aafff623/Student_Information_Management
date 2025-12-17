import http from './http'
import util from '@/core/helper'
import DictStore from '@/stores/framework/dict';
const setting = {

    appId: import.meta.env.VITE_APP_ID ? import.meta.env.VITE_APP_ID : "codeying",
    /**
     * 系统版本
     */
    version: import.meta.env.VITE_APP_VERSION ? import.meta.env.VITE_APP_VERSION :  "1.0.0",

    /**
     * 系统名称：显示左上角及浏览器
     */
    name: import.meta.env.VITE_APP_TITLE ? import.meta.env.VITE_APP_TITLE : 'XX系统',
    /**
     * copy right
     */
    copyRight: import.meta.env.VITE_APP_COPY_RIGHT ? import.meta.env.VITE_APP_COPY_RIGHT : "",//登陆页面显示的
    /**
     * 默认初始页面
     */
    home: import.meta.env.VITE_APP_HOME ? import.meta.env.VITE_APP_HOME : "/",

    /**
     * 网络配置
     */
    http: http,

    log:{
        name: "framework",
        level: import.meta.env.VITE_LOG_LEVEL ? import.meta.env.VITE_LOG_LEVEL : 'ERROR',
        upload: (name, level, ...msg) => {}
    },

    /**
     * 缓存配置
     */
    cache:{
        useStore: true,
        dbIndex: 0,
        name: '',
    },

    /**
     * 是否开启组件自动引入，若开启/components/下的组件启动时则会全部导入全局组件中（项目比较大不建议开启）
     * 默认只导入 lib layout
     */
    componentImport: false,

    /**
     * 下拉框
     */
    selectStore: DictStore,

    /**
     * 菜单伸缩
     */
    menu:{
        isCollapse: false,
    }
}

/**
 * 合并系统配置
 * @param config
 */
export function config(config) {
    util.mergeJson(setting, config);
    return setting;
}

export default setting;
