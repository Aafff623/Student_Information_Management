import {defineStore} from 'pinia';

const store = {
    id: "storage",
    state(){
        return {
            dataList: []
        }
    },

    getters: {
        get(state) {
            return (key, index = 0) => {
                if (!key) {
                    return null;
                }

                let data = state.dataList[index];
                if (!data) {
                    return null;
                }
                let cacheData = data[key];
                if (!cacheData) {
                    return null;
                }

                let value = cacheData.value;
                if (!value) {
                    return null;
                }

                let expire = cacheData.expire;
                let d = new Date();
                if (expire > 0) {
                    let time = (d.getTime() / 1000).toFixed(0);
                    //检查过期时间
                    if (time - cacheData.time > cacheData.expire) {
                        delete data[key];
                        return null;
                    }
                }

                return cacheData.value;
            }
        }
    },

    actions: {
        set(key, value, expire, index = 0) {
            if (!key) {
                return;
            }

            let data = this.dataList[index];
            if (!data) {
                data = {}
            }

            if (!value) {
                delete data[key];
            }

            let cacheData = {};
            if (expire > 0) {
                cacheData.time = (new Date().getTime() / 1000).toFixed(0);
            }

            cacheData.value = value;
            cacheData.expire = expire;
            data[key] = cacheData;
            this.dataList[index] = data;
        },

        clear(index) {
            if(index) {
                this.dataList[index] = {};
            } else {
                this.dataList = [];
            }
        },

        remove(key, index = 0) {
            let data = this.dataList[index];
            if(data && key) {
                delete data[key]
            }
        }
    }
}
export default defineStore(store)
