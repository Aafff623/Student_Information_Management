import Plugin from '../plugin';
class Options {
    id = null;
    title = '信息';
    modal = true;
    drag = true;
    fullscreen = false;
    appendToBody = true;
    width = '1080px'
    cancelText = "取 消";
    confirmText = "确 定";
    plain = false;
    autoClose = true;
    beforeClose = null;
    margin = 'auto';
    bottomAlign = 'right'
    showClose = true;
    component = null;
    on = null;
    props = null;

    constructor() {
        return createProxy(this, Plugin());
    }

    setWidth(width) {
        this.width = width;
    }

    setTitle(title) {
        this.title = title;
    }

    setModal(modal) {
        this.modal = modal;
    }

    setDrag(isDrag) {
        this.isDrag = isDrag;
    }

    setFullscreen(fullscreen) {
        this.fullscreen = fullscreen;
    }

    setConfirmText(text) {
        this.confirmText = text;
    }

    setAutoClose(autoClose) {
        this.autoClose = autoClose;
    }

    setPlain(isPlan) {
        this.isPlain = isPlan;
    }

    setAppendToBody(appendToBody) {
        this.appendToBody = appendToBody;
    }

    setCancelText(text) {
        this.cancelText =  text;
    }

    /**
     * 关闭前行数
     * @param beforeClose
     */
    setBeforeClose(beforeClose) {
        this.beforeClose = beforeClose;
    }

    setMargin(margin) {
        this.margin = margin;
    }

    setBottomAlign(align) {
        this.bottomAlign = align;
    }

    setShowClose(show){
        this.showClose = show;
    }

    setComponent(component) {
        this.component = component;
    };

    setOn(on) {
        this.on = on;
    }
    setProps(props) {
        this.props = props;
    }
}

export default Options;


function createProxy(target, plugin) {
    let proxy = new Proxy(target, {
        set: function(target, key, value, receiver){
            return Reflect.set(target, key, value, receiver);
        },

        get: function(target, key, receiver){
            let fun = target[key];
            if(fun instanceof Function) {
                return function (...arg0) {
                    target[key](...arg0);

                    if(key.indexOf("set") === 0) {
                        key = key.substring(3).substring(0,1).toLowerCase() + key.substring(4)
                    }
                    plugin.addOptions(target.id, 'dialog', key, ...arg0);
                    return proxy;
                }
            }

            return target[key] = function (...arg0) {
                plugin.addOptions(target.id, 'dialog', key, ...arg0);
                return proxy;
            }
        }
    });

    return proxy;
}
