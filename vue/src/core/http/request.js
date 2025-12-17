import axios from 'axios';
import Response from './response';
import {createRequestProxy} from "./proxy";
class Request{
    url = null;
    params = null;
    headers = {};
    token = null;
    interceptor = {};
    timeout = 30000;
    config = {};
    method = 'post';
    responseType = 'json';
    constructor(url, params, config) {
        this.url = url;
        this.params = params;
        this.config = config;
        if(config.headers) {
            this.headers = config.headers;
        }
        if(this.config.timeout) {
            this.timeout = config.timeout;
        }
        return createRequestProxy(this, config);
    }

    setTimeout(timeout) {
        if(timeout) {
            this.timeout = timeout;
        }
    }

    setToken(token) {
        this.token = token;
    }

    setHeaders(headers = {}) {
        this.headers = headers;
    }

    addHeaders(key, value) {
        if(value) {
            this.headers[key] = value;
        }
    }

    setInterceptor(request, response) {
        if(request) {
            this.interceptor.request = request;
        }

        if(response) {
            this.interceptor.response = response;
        }
    }

    setResponseType(responseType) {
        this.responseType = responseType;
    }

    setMethod(method) {
        this.method = method;
    }

    send() {

        // 封装axios请求
        let config = {
            timeout: this.timeout,
            headers: this.headers,
            baseURL: "",
            responseType: this.responseType,
            method: this.method,
        };

        if(this.method == 'post' || this.method == 'put') {
            config.data = this.params;
        } else {
            config.params = this.params;
        }

        if (this.url.indexOf('http://') === -1 && this.url.indexOf('https://') === -1) {
            if (this.config.baseUrl) {
                config.baseURL = this.config.baseUrl;
            }

            if (this.config.prefix) {
                config.baseURL += this.config.prefix;
            }
        }

        // 处理令牌
        if(this.token) {
            let authorizationPrefix = this.config.authorization.prefix;
            config.headers[this.config.authorization.key] = authorizationPrefix ? authorizationPrefix + this.token : this.token;
        }


        // 每次都重新创建示例，可根据实际情况优化单例模式
        let instance = axios.create(config);

        if(this.config.interceptorRequest) {
            instance.interceptors.request.use(this.config.interceptorRequest);
        }

        // 处理响应拦截
        instance.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            if(error.response) {
                return {
                    code: error.code,
                    status: error.response.status,
                    message: error.message,
                    config: error.config,
                    request: error.request,
                    data: error.response.data
                }
            } else {
                let status = 600;
                let message = error.message;
                if(error.message.indexOf("timeout of") > -1) {
                    status = 601;
                }

                return {
                    code: error.code,
                    status: status,
                    message: message,
                    config: error.config,
                    request: error.request,
                    data: {}
                }
            }
        })

        // 独立拦截器处理
        if(this.interceptor){
            config.transformRequest = this.interceptor.request;
            config.transformResponse = this.interceptor.response;
        }

        // 发送请求
        let promise = instance(this.url, config);
        return new Response(promise, this.config);
    }
}

export default Request;
