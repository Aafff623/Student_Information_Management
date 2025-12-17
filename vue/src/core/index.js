import config from './config';
import log from './log'
import cache from './cache'
import http from './http'
import helper from './helper';
import dialog from './plugin/dialog/index'
import msg from './plugin/msg/index'

let globalStore = null;
export default function install(app, injectKey) {
    const globalConfig = config();
    globalConfig.setAppConfig(injectKey.config);
    globalStore = injectKey.useStore;
    const appLog = log(config);
    const appCache = cache(config);
    const appHttp = new http(config);

    app.config.globalProperties.$log = appLog;
    app.config.globalProperties.$cache = appCache;
    app.config.globalProperties.$http = appHttp;
    app.config.globalProperties.$dialog = dialog;
    app.config.globalProperties.$msg = msg;

    for (let key in helper) {
        app.config.globalProperties[`$${key}`] = helper[key];
    }

    window.GlobalConfig = globalConfig;
    window.Helper = helper;
    window.Log = appLog;
    window.Msg = msg;
    window.Cache = appCache
    window.Http = appHttp
    window.Dialog = dialog;
    window.useStore = globalStore;
    window.Curl = {
        CREATE: 1,
        MODIFY: 2,
        VIEW: 3
    }

    if(injectKey.config.cache.useStore) {
        Cache.useStore(globalStore);
    }
}

export const GlobalConfig = config;
export const Helper = helper;
export const Log = log(config);
export const Msg = msg;
export const Http = http(config);
export const Dialog = dialog;
export const useStore = () => {return globalStore()}
