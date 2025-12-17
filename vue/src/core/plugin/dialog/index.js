import Options from "../dialog/options";
import Plugin from '../plugin';

let plugin = null;
function getPlugin() {
    if(!plugin) {
        plugin = Plugin();
    }

    return plugin;
}

export default {
    ALIGN_LEFT: 'left',
    ALIGN_CENTER: 'center',
    ALIGN_RIGHT: 'right',

    open(component, title, options = {}) {
        let option = new Options();
        options.title = title;
        options.id = Helper.genRandomStr(32);
        getPlugin().open(options.id, 'dialog', component, options);
        return option;
    },

    close(id) {
        getPlugin().close(id, 'dialog');
    }
}
