import {defineStore} from 'pinia';

const store = {
    id: "msg",
    state(){
        return {
            count: 0,
            typeList: [],
            msgList: [],
        }
    },

    getters: {

    },

    actions: {
        setCount(count){
            this.count = count;
        },

        setList(list) {
            this.list = list;
        },

        setTypeList(typeList) {
            this.typeList = typeList;
        }
    }
}

export default defineStore(store)
