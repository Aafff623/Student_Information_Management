
export default {
    /**
     * 判断空值
     * @param value
     * @returns {boolean}
     */
    empty: function (value) {
        let reg = "^[ ]+$";
        let re = new RegExp(reg);

        if (re.test(value) || value === null || value === undefined || value === 'undefined' || value === '' || value === 'null') {
            return true;
        }
        return false;
    },

    /**
     * 判断空json
     * @param value
     * @returns {boolean}
     */
    emptyJson: function (value) {
        if (this.empty(value)) {
            return true;
        }

        for (let key in value) {
            return false;
        }

        return true;
    },

    /**
     * 判断空数组
     * @param value
     * @returns {boolean}
     */
    emptyArray(value) {
        return !Array.isArray(value) || value.length === 0;
    },

    /**
     * 去除json中null的值
     * @param value
     * @returns {{}}
     */
    clearEmpty(value) {
        if(this.empty(value)) {
            return {};
        }

        let result = {};
        for (let v in value) {
            let data = value[v];
            if(this.empty(data)) {
               continue;
            }

            if(typeof v == 'object') {
                result[v] = this.clearEmpty(data);
                continue;
            }

            result[v] = data;
        }

        return result;
    },

    /**
     * 获取json中的值 getValueByJsn({a: {b: 1}}, 'a', 'b')
     * @param obj
     * @param params
     * @returns {string|*|string}
     */
    getValueByJson(obj, ...params) {
        if (!obj || !params) {
            return '';
        }

        let len = params.length;
        let value = obj;
        for (let i = 0; i < len; i++) {
            let param = params[i];
            if (!param) {
                return '';
            }

            value = value[param];
            if (!value) {
                return '';
            }

            if (i < len - 1) {
                if (typeof value !== 'object') {
                    return '';
                }
            }
        }

        return value ? value : '';
    },

    /**
     * 获取区间范围内的随机值
     * @param min
     * @param max
     * @returns {*}
     */
    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min
    },

    /**
     * 随机生成n位字符串
     * @param len
     * @returns {string}
     */
    genRandomStr(len) {
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
        var maxPos = $chars.length;
        var randomStr = '';

        for (let i = 0; i < len; i++) {
            randomStr += $chars.charAt(Math.floor(Math.random() * maxPos));
        }

        return randomStr;
    },

    /**
     * 数组转map
     * @param items
     * @param key
     * @param value
     * @returns {{}}
     */
    array2Map(items, key , value ) {
        let map = {};
        if (Array.isArray(items)) {
            for (let i = 0; i < items.length; i++) {
                let keyField = items[i][key];
                if (!this.empty(keyField)) {
                    map[keyField] = items[i][value];
                }
            }
        }

        return map;
    },

    /**
     * 获取数组对象中的key值
     * @param arr
     * @param key
     * @returns {*[]}
     */
    getArrayByKey(arr, key = 'id') {
        let res = [];
        if (Helper.emptyArray(arr) || Helper.empty(key)) {
            return res;
        }

        arr.forEach(item => {
            if (!Helper.empty(item[key])) {
                res.push(item[key])
            }
        })

        return res;
    },

    /**
     * 合并json
     * @param source
     * @param target
     */
    mergeJson(source, target) {
        if(this.empty(target)) {
            return;
        }
        if(this.empty(source)) {
            source = target;
            return;
        }
        for (let attr in target) {
            let targetValue = target[attr];
            let sourceValue = source[attr];

            if(this.empty(sourceValue)) {
                source[attr] = targetValue;
                continue;
            }

            if(Array.isArray(targetValue)) {
                if(this.emptyArray(targetValue)) {
                    targetValue = [];
                }
                source[attr] = targetValue;
                continue;
            }

            if(typeof targetValue === 'object') {
                this.mergeJson(sourceValue, targetValue)
                continue;
            }

            source[attr] = targetValue;
        }
    },

    getFirstMessage(message) {
        if(this.emptyJson(message)) {
            return "";
        }

         for(let key in message) {
            let arr = message[key];
            return arr[0].message;
        }

        return "";
    },

    formatFileSize(size, pointLength, units) {
        let unit;
        units = units || [ 'B', 'K', 'M', 'G' ];
        while ( (unit = units.shift()) && size > 1024 ) {
            size = size / 1024;
        }
        return (unit === 'B' ? size : size.toFixed( pointLength === undefined ? 2 : pointLength)) + unit;
    },
}
