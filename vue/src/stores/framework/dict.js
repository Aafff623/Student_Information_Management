import {defineStore} from 'pinia';

const emptData = ()=>{
    let data = {}
    data['current'] = 1
    data['pages'] = 1
    data['records'] = []
    data['size'] = 100
    data['total'] = 1

    return data
}

const store = {
    id: "dict",
    state(){
        return {

        }
    },

    getters: {
        BASIC_PORT() {
            return async (pageNo, query)=> {
                let {data} = await Http.get("/test/dict", {typeCode: 'BASIC_CODE'});

                let newList = []

                if(!Helper.emptyArray(data)) {
                    newList = data.map(info=>{
                        info['label'] = info.name
                        info['value'] = info.code
                        return info
                    })
                }
                return newList
            }
        },
    },

    actions: {
        get(options, query, cache) {
            return [
                {label: "xx", value: 1},
                {label: "xx", value: 2},
                {label: "xx", value: 3},
                {label: "xx", value: 4},
                {label: "xx", value: 5},
                {label: "xx", value: 6},
                {label: "xx", value: 7},
                {label: "xx", value: 8},
                {label: "xx", value: 9},
                {label: "xx", value: 10},
                {label: "xx", value: 11},
            ]
        },
    }
}

export default defineStore(store)


