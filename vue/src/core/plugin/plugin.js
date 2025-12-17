import {defineStore} from 'pinia';

const store = {
    id: "plugin",
    state(){
        return {
            plugins:[],
        }
    },

    getters: {
        dialogs(state) {
            return () => {
                return findList(state.plugins, plugin => plugin.type == 'dialog');
            }
        }
    },

    actions: {
        open(id, type, component, pluginOption = {}) {
            let plugin = {};
            plugin.id = id ? id : Helper.genRandomStr(32);
            plugin.type = type;
            plugin.component = component;
            plugin.show = true;
            plugin.options = pluginOption;
            this.plugins.push(plugin)
            return plugin.id;
        },

        close(id, type) {
            let plugin = getPlugin(this.plugins, type, id);
            if(plugin) {
                plugin.show = false;
            }
        },

        setOptions(id, type, options) {
            let plugin = getPlugin(this.plugins, type, id);
            if(plugin) {
                plugin.options = options;
            }
        },

        addOptions(id, type, key, value) {
            let plugin = getPlugin(this.plugins, type, id);
            if(plugin) {
                plugin.options[key] = value;
            }
        },
    }
}
export default defineStore(store)

/**
 * 获取插件，默认取出第一个
 * @param id
 * @param type
 * @returns {null}
 */
function getPlugin(statePlugins, type, id) {
    let plugins = findList(statePlugins, plugin => plugin.type == type);
    if(! Helper.emptyArray(plugins)) {
        let index = plugins.length - 1;
        if(id) {
            index = plugins.findIndex(plugin => plugin.id == id);
        }

        let plugin = plugins[index];
        return plugin;
    }
    return null;
}

function findList(arr, find) {
    let result = [];
    if(Helper.emptyArray(arr)) {
        return result;
    }

    arr.forEach(a => {
        if(find(a)) {
            result.push(a);
        }
    })

    return result;
}

