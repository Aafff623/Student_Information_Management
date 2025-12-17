import { createPinia } from 'pinia'
const files = import.meta.globEager('./framework/*.js')
let modules = {}

Object.keys(files).forEach(async (fileName) => {
    const name = fileName.replace(/\.\/|\.js/g, '');
    if(name != 'framework/curl') {
        modules[name] = files[fileName].default;
    }
});


export const useStore = () => {
    let stores = {};
    Object.keys(modules).forEach((key) => {
        let module = modules[key].apply();
        stores[module.$id] = module;
    })
    return stores;
}

export default function install(app, injectKey) {
    app.use(createPinia());
    // window.useStore = useStore;
}

