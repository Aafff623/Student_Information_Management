import {defineStore} from 'pinia';

const store = {
    id: "user",
    state(){
        return {

        }
    },

    getters: {

    },

    actions: {
        async getUserInfo() {
            let {data} = await Http.get('/userinfo')
            if (! Helper.emptyJson(data)) {
                return data
            }
            return false
        },
        async loginOut() {
            let {data} = await Http.post('/logout')
            if (! Helper.empty(data)) {
                return data
            }
            return ''
        }
    }
}

export default defineStore(store)
