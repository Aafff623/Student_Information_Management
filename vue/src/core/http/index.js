import Request from './request';

export default function http(config) {
    let httpConfig = null;
    return {
        create(url, data) {
            if (!httpConfig) {
                let {appConfig} = config();
                httpConfig = appConfig.http;
            }
            return new Request(url, data, httpConfig).setToken(Cache.getToken());
        },

        /**
         * get 请求
         * @param url
         * @param params
         */
        get(url, params) {
            return this.create(url, params).setMethod("get");
        },

        /**
         * post 请求
         * @param url
         * @param data
         */
        post(url, data) {
            return this.create(url, data).setMethod('post');
        },

        /**
         * put 请求
         * @param url
         * @param data
         */
        put(url, data) {
            return this.create(url, data).setMethod("put");
        },

        /**
         * delete请求
         * @param url
         * @param params
         */
        delete(url, params) {
            return this.create(url, params).setMethod("delete");
        },

        /**
         * 文件下载
         * @param url 下载地址支持http及https，非http开头的定义前缀在config/setting/index.js中
         * @param fileName 下载文件名称
         * @param params 下载文件参数
         * @param method
         */
        download(params, fileName, url, method = 'get') {
            Msg.loading('下载中...');

            if (!httpConfig) {
                let {appConfig} = config();
                httpConfig = appConfig.http;
            }

            url = url ? url : httpConfig.downloadUrl;
            let request = this.create(url, params);
            if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) {
                request.setResponseType('blob');
                request.setMethod('get');
            } else {
                request.setResponseType('blob');
                request.setMethod(method);
            }

            request.then((response) => {
                if(! fileName) {
                    let disposition = response.headers['content-disposition'];
                    //兼容下
                    if (Array.isArray(disposition)) {
                        disposition = disposition[0];
                    }

                    if (disposition) {
                        //对应后端：resp.addHeader("Content-Disposition", "attachment; filename=" + encoderName);//filename两端不要引号
                        let name = disposition.substring(disposition.indexOf("filename=") + 9);
                        if (name) {
                            let ext = name.substr(name.lastIndexOf(".") + 1);
                            response.ext = ext;
                            response.name = decodeURIComponent(name);
                            fileName = name;
                        }
                    }
                }

                // 将文件流转成blob形式
                Msg.loading(false);
                const blob = new Blob([response.data]);

                if (window.navigator.msSaveOrOpenBlob) {
                    // 兼容IE10
                    navigator.msSaveBlob(blob, fileName);
                } else {
                    // 创建一个超链接，将文件流赋进去，然后实现这个超链接的单击事件
                    const elink = document.createElement('a');
                    elink.download = fileName;
                    elink.style.display = 'none';
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    URL.revokeObjectURL(elink.href); // 释放URL 对象
                    document.body.removeChild(elink);
                }
            }).catch((error) => {
                    Msg.loading(false);
                    console.log(error);
                });
        },

        /**
         * 上传
         * @param file
         * @param data
         * @param url
         */
        upload(file, data, url) {
            url = url ? url : httpConfig.uploadUrl;
            let formData = new FormData();
            for (let p in data) {
                formData.append(p, data[p]);
            }

            formData.append('file', file);
            return this.create(url, formData).setMethod("post").addHeaders("contentType", "multipart/form-data");
        }
    }
}
