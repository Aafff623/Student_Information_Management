import {defineStore} from 'pinia';

const store = {
    id: "menu",
    state(){
        return {
            menuList: [],
            history: [],
            cacheList: [],
        }
    },

    getters: {

    },

    actions: {
        async setMenuList(menuList) {
            this.menuList = menuList;
        },

        addHistory(menu) {
            let index = this.history.findIndex(h => menu.path == h.path);
            if(index === -1) {
                let meta = menu.meta ? menu.meta : {};
                if(meta.cache && this.cacheList.indexOf(menu.name) === -1) {
                    this.cacheList.push(menu.name);
                }
                menu.width = meta.title.length * 16 + 30;
                menu.meta = meta;
                this.history.push(menu);
            }
        },

        removeHistory(menu) {
            let index = this.history.findIndex(h => menu.path == h.path);
            if(index > -1) {
                this.history.splice(index, 1);
            }
            return index;
        },

        getHistory() {
            return this.history;
        },

        clearHistory() {
            this.history = [];
        },

        redirect(menu) {

        }
    }
}

export default defineStore(store)
