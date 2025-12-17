import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
let loading = null;
export default {
    /**
     * alert 弹框
     * @param content
     * @param options
     */
    alert(content, options = {}) {
        return ElMessageBox.alert(content, options.title ? options.title : '提示', {
            confirmButtonText: options.confirmText ? options.confirmText : '确认',
        })
    },

    /**
     * confirm 弹框
     * @param content
     * @param options
     */
    confirm(content, options = {}) {
        return ElMessageBox.confirm(content, options.title ? options.title : '提示', {
            confirmButtonText: options.confirmText ? options.confirmText : '确认',
            cancelButtonText: options.cancelText ? options.cancelText : '取消',
        })
    },

    /**
     * loading 样式
     * @param msg
     */
    loading(msg, delay) {
        if(! msg && loading) {
            loading.close();
            return;
        }

        loading = ElLoading.service({
            lock: true,
            text: msg,
            background: 'rgba(0, 0, 0, 0.7)',
        })

        if(delay && delay > 0) {
            setTimeout(() => {
                loading.close()
            }, delay)
        }
    },

    /**
     * 成功
     * @param msg
     * @param options
     */
    success(msg, delay=1000) {
        ElMessage({
            type: 'success',
            duration: delay,
            message: msg,
            onClose: () => {}
        })
    },

    /**
     * 失败
     * @param msg
     * @param options
     */
    error(msg, delay=1000) {
        ElMessage({
            type: 'error',
            duration: delay,
            message: msg,
            onClose: () => {}
        })
    }
}
