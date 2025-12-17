/**
 * 注册全局组件
 */
export default function install(app, injectKey) {
    //配置*表示全部加载，其余路径忽略
    if(injectKey.componentImport) {
        const files = import.meta.globEager('./**/*.vue')
        load(app, files);
        return;
    }
    const layouts = import.meta.globEager('./layout/*.vue');
    const libs = import.meta.globEager('./lib/**/*.vue');
    load(app, layouts);
    load(app, libs);
}

function load(app, files) {
    Object.keys(files).forEach((fileName) => {
        let component = files[fileName].default;
        app.component(component.name, component)
    });
}
