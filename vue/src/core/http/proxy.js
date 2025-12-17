export function createRequestProxy(target, config) {
    const proxy = new Proxy(target, {
        set: function(target, key, value, receiver){
            return Reflect.set(target, key, value, receiver);
        },

        get: function(target, key, receiver){
            let fun = target[key];
            if(! fun || key == 'send') {
                return target[key] = function (...arg0) {
                    let response = target.send();
                    return response[key](...arg0)
                }
            }

            if(fun instanceof Function) {
                return function (...arg0) {
                    target[key](...arg0);
                    return proxy;
                }
            }

            return fun;
        }
    });

    return proxy;
}

export function createResponseProxy(target, promise) {
    const proxy = new Proxy(target, {
        set: function(target, key, value, receiver){
            return Reflect.set(target, key, value, receiver);
        },

        get: function(target, key, receiver){
            let fun = target[key];
            if(! fun) {
                return target[key] = function (...arg0) {
                    if(! promise[key] && key != 'complete') {
                        target['meta'][key] = arg0[0];
                        return proxy;
                    }

                    if(target.getStatus() == -1) {
                        target.queue.push({method: key, arg0: arg0});
                        return  proxy;
                    }

                    let response = target.getData();
                    //简单判断当参数长度等于2时，默认是await进来的then
                    let argLen = arg0.length;

                    if(! (response instanceof Promise)) {

                        if(key == 'catch') {
                            return proxy;
                        }

                        arg0[0](response);
                        return proxy;
                    }


                    doPromise(response, (state, result) => {
                        if(key == 'complete') {
                            arg0[0](result, state);
                            return;
                        }

                        if(state) {
                            arg0[0](result);
                        } else {
                            if(key == 'then' && argLen == 1) {
                                return;
                            }
                            arg0[0](result);
                        }
                    })

                    return proxy;
                }
            }

            if(fun instanceof Function) {
                return function (...arg0) {
                    target[key](...arg0);
                    return proxy;
                }
            }

            return fun;
        }
    });

    return proxy;
}

export function doPromise(promise, callback) {
    promise.then(data => {
        if(data.status != 200) {
            callback(false, data);
            return;
        }
        callback(true, data);
    }).catch(error => {
        callback(false, error);
    })
}
