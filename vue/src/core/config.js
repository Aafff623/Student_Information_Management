import {defineStore} from 'pinia';

const store = {
    id: "config",
    state(){
        return {
            appConfig: {},
            mainWidth: 1000,
            mainHeight: 500,
            screenWidth: 1200,
            screenHeight: 768,
            isMobile: false,
        }
    },

    getters: {
        getConfig(state) {
            return () => {
                return state.appConfig;
            }
        },
        getMainWidth(state) {
            return () => {
                return state.mainWidth;
            }
        },
        getMainHeight(state) {
            return () => {
                return state.mainHeight;
            }
        },
        getScreenWidth(state) {
            return () => {
                return state.screenWidth;
            }
        },
        isCollapse(state) {
            return state.appConfig.menu.isCollapse;
        },
        getScreenHeight(state) {
            return () => {
                return state.screenHeight;
            }
        },
        getMobile(state) {
            return () => {
                return state.isMobile;
            }
        }
    },

    actions: {
        setAppConfig(data) {
            this.appConfig = data;
        },

        setMainWidth(mainWidth) {
            this.mainWidth = mainWidth;
        },

        setMainHeight(mainHeight) {
            this.mainHeight = mainHeight;
        },

        setScreenWidth(width) {
            this.screenWidth = width;
        },

        setScreenHeight(height) {
            this.screenHeight = height;
        },

        setCollapse(isCollapse) {
            this.appConfig.menu.isCollapse = isCollapse;
        },

        setMobile(isMobile) {
            this.isMobile = isMobile;
        }
    }
}
export default defineStore(store)
