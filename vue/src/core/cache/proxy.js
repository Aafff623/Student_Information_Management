function createProxy(target) {
    const proxy = new Proxy(target, {
        set: function(target, key, value, receiver){
            return Reflect.set(target, key, value, receiver);
        },

        get: function(target, key, receiver){
            return function (...arg0) {
                let res = target[key](...arg0);
                if(key == 'use') {
                    return proxy;
                }
                target.use(0);
                return res;
            }
        }
    });

    return proxy;
}

export default createProxy;
