import router from '@/router';
export default {
    /**
     * api前缀
     */
    prefix: import.meta.env.VITE_API_PREFIX ? import.meta.env.VITE_API_PREFIX : "/api",
    /**
     * 接口服务地址
     */
    baseUrl: import.meta.env.VITE_SERVER_URL ? import.meta.env.VITE_SERVER_URL : "",
    /**
     * 超时时间
     */
    timeout: 30000,

    /**
     * 文件上传服务配置
     */
    uploadUrl: "/file/upload",

    /**
     * 上传组件回调配置
     * 返回promise对象 如果失败返回false，成功则返回response对象，该返回数据会通过事件回传页面
     * 需处理model对象，将响应结果中的值赋值给model对象，其中id必填
     */
    uploadInterceptor: async (response) => {
        return response.data;
    },

    /**
     * 文件下载服务配置
     */
    downloadUrl: "/file/downloadById",

    /**
     * 请求头内容类型
     */
    contentType: "application/json",

    /**
     * 验证前缀
     */
    authorization: {
        key: "token",//{authorization: prefix + xxx}
        prefix: "",
    },

    /**
     * 统一请求拦截器
     * 注意：先经过统一拦截器，再经过独立拦截器
     */
    interceptorRequest: (request) => {
        return request;
    },

    /**
     * 统一响应拦截器（结果适配转换）
     * 注意：先经过独立拦截器，再经过统一拦截器，该模块需要根据接口实际返回进行适配改造，保持无论错误还是失败统一输出格式即可，便于调用接口时业务处理
     * 1、该拦截器可做结果适配，转化出统一的结果，例如统一格式：status,message,data，其中status表示响应码，data为实际所需业务数据，比如列表数据、表单数据等
     */
    interceptorResponse: (response) => {
        let meta = response.getMeta();
        //axios实际返回结果，该status为实际http响应码
        if (response.status != 200) {
            if(meta.validate) {
                Msg.error(response.message);
            }
            return Promise.reject({code: response.status, message: response.message, data: null});
        }

        // 该data为实际接口返回数据，进行格式化处理，例如将接口中code字段转化为status字段等等
        //  登录跳转
        let data = response.data;
        if(data.code != 200) {
            if(meta.auth && data.code == 302) {
                if(Helper.empty(data.data)){
                    router.replace('/login');
                } else if(data.data.indexOf('http://') != -1 || data.data.indexOf('https://') != -1){
                    window.location.href = data.data
                }else {
                    router.replace(data.data);
                }
            }
            if(meta.validate && data.code != 302) {
                Msg.error(data.message ? data.message : '系统错误');
            }

            return Promise.reject({code: data.code, message: data.message, data: null});
            // return {status: data.code, msg: data.message, data: {}};
        }

        return data;
    },
}
