import Storage from './storage';
import Store from './store';
import createProxy from './proxy';

function Cache(name, index, store) {
    let storage = new Storage(name, index);
    let pinia = null;
    return {
        useStore(globalStore) {
            pinia = globalStore();
        },

        /**
         * vuex发起action调用方法，等同于this.$store.dispatch
         * @param module 模块名
         * @param action action名
         * @param data 数据键值对
         */
        dispatch(module, action, ...data){
            if(pinia[module] && pinia[module][action]) {
                pinia[module][action](...data);
                return;
            }
            Log.error(`找不到${module}下的[${action}]action方法`)
        },

        /**
         * 获取vuex中getters方法
         * @param module 模块名称
         * @param getterName getter名
         * @param params 参数
         * @returns {string|*|string}
         */
        getters(module, getterName, ...params) {
            if(pinia[module] && pinia[module][getterName]) {
                return pinia[module][getterName](...params);
            }
            Log.error(`找不到${module}下的[${getterName}]getters方法`)
            return "";
        },

        use(database) {
            storage.use(database);
        },

        /**
         * 本地缓存
         * @param key 缓存key值
         * @param value 缓存value值
         * @param expire 过期时间（单位秒）
         */
        set(key, value, expire) {
            this.setState(key, value, expire);
            storage.set(key, value, expire);
        },

        /**
         * 通过key值获取本地缓存
         * @param key
         * @returns {string|any}
         */
        get(key) {
            let value = this.getState(key);
            if(value) {
                return value;
            }

            value = storage.get(key);
            if(value) {
                this.setState(key, value, storage.getExpire(key));
            }

            return value;
        },

        /**
         * 缓存临时缓存（刷新页面即消失）
         * @param key 缓存key
         * @param value 缓存value
         * @param expire 缓存过期时间（单位秒）
         */
        setState(key, value, expire) {
            if(! key) {
                throw new Error("缓存 key 只不能为空");
            }

            store.set(key, value, expire, storage.getIndex());
        },

        /**
         * 从临时缓存中获取
         * @param key
         * @returns {*}
         */
        getState(key) {
            return store.get(key, storage.getIndex());
        },

        /**
         * 通过key值移除缓存
         * @param key
         */
        remove(key) {
            store.remove(key, storage.getIndex());
            storage.remove(key);
        },

        /**
         * 清除本地缓存
         */
        clear() {
            store.clear(storage.getIndex());
            storage.drop();
        },

        /**
         * 获取本地缓存大小
         * @returns {number}
         */
        size() {
            return storage.sizeof();
        },

        /**
         * 缓存请求令牌
         * @param token
         */
        setToken(token) {
            this.set('token', token);
        },

        /**
         * 获取缓存令牌
         * @returns {string|*}
         */
        getToken() {
            return this.get('token')
        },

        /**
         * 缓存用户信息
         * @param user
         */
        setUser(user) {
            this.set("user", user)
        },

        /**
         * 获取用户信息
         * @returns {string|*}
         */
        getUser() {
            return this.get("user")
        }
    }
}

export default function (config) {
    let {appConfig} = config();
    const store = Store();
    let cache = Cache(appConfig.cache.name ? appConfig.cache.name : appConfig.appId, appConfig.dbIndex, store);
    return createProxy(cache)
}
