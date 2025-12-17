<template>
  <div :class="{'x-row': listType == 'grid', 'x-column-reverse': listType != 'grid'}" style="flex-wrap: wrap">
    <x-file-view :disabled="disabled" :keyField="keyField" @remove="onRemove" :size="size + 2" :type="listType" :list="fileList"></x-file-view>
    <el-upload
        ref="uploadRef"
        :action="action"
        :accept="typeList"
        :drag="drag"
        :multiple="true"
        :show-file-list="false"
        :limit="count"
        :disabled="disabled"
        :auto-upload="auto"
        :headers="headers"
        :on-success="onSuccess"
        :on-error="onError"
        :http-request="upload"
        :before-upload="onBeforeUpload">

      <slot v-if="fileList.length < count">
        <template v-if="drag">
          <div class="uploader x-center" :style="{width: `${size}px`, height: `${size}px`}">
            <div>
              <el-icon style="font-size: 28px"><upload-filled/></el-icon>
              <div class="el-upload__text">
                拖拽文件或 <em>点击上传</em>
                <span v-if="typeList != 'all'">允许上传{{ typeList }}格式</span><span v-if="limitSize">文件最大运行上传{{ $formatFileSize(limitSize) }}</span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <el-button v-if="listType != 'grid'" type="primary">选择文件</el-button>
          <div v-else class="uploader plus x-center"  :style="{width: `${size}px`, height: `${size}px`}">
            <el-icon style="font-size: 28px"><Plus /></el-icon>
          </div>
        </template>
      </slot>
    </el-upload>
  </div>
</template>
<script setup name="x-uploader">
import XFileView from './FileView';
import {UploadFilled, Plus} from '@element-plus/icons-vue'
import {GlobalConfig} from 'core';
import {shallowRef} from "vue";
const {appConfig} = GlobalConfig()
let httpConfig = appConfig.http;
let typeList = ref("");
let fileList = ref([]);
const uploadRef = shallowRef();
const emit = defineEmits(["update:modelValue", 'change', 'success', 'remove', 'error']);
const props = defineProps({
  modelValue: {
    type: [String, Array]
  },

  action: {
    type: String,
  },

  headers: {
    type: Object,
  },

  accept: {
    type: [String, Boolean, Array],
    default: "all"
  },

  auto: {
    type: Boolean,
    default: true,
  },

  drag: {
    type: Boolean,
    default: false,
  },

  size: {
    type: Number,
    default: 90,
  },

  disabled: {
    type: Boolean,
    default: false
  },

  count: {
    type: Number,
    default: 1
  },

  limitSize: {
    type: [Number, Boolean],
    default: 20485760
  },

  listType:{
    type: String,
    default: "grid",
  },

  //图片对应的主键字段名
  keyField: {
    type: String,
    default: 'fileId',
  },

  nameField:{
    type: String,
    default: "realName"
  },
})

//上传之前校验
const onBeforeUpload = (file) => {

  if(props.count > 0 && fileList.value > props.count) {
    Msg.error(`文件已超出最大上传限制，最多允许上传${props.count}张`)
    return false;
  }

  if (props.limitSize !== false) {
    let fileSize = file.size;
    if (fileSize > props.limitSize) {
      Msg.error("文件大小不得超过" + Helper.formatFileSize(props.limitSize));
      return false;
    }
  }

  if (typeList.value != 'all') {
    let acceptList = Helper.empty(typeList.value) ? [] : typeList.value.split(",");
    if (!Helper.emptyArray(acceptList)) {
      const fileSuffix = file[props.nameField].substring(file[props.nameField].lastIndexOf("."));
      if (acceptList.indexOf(fileSuffix) === -1) {
        Msg.error("上传文件只能是" + typeList.value + "格式");
        return false;
      }
    }
  }
  return true;
}

const upload = async (options) => {
  Msg.loading("上传中...")
  let action = options.action;
  if (action == '#') {
    action = httpConfig.uploadUrl;
  }

  let request = Http.upload(options.file, options.data, action);

  for (let key in options.headers) {
    request.addHeaders(key, options.headers[key]);
  }

  let resp = await request;
  Msg.loading(false);

  return httpConfig.uploadInterceptor(resp);
}
/**
 *  res对应ApiResult的data
 */
const onSuccess = (res, file) => {
  //处理正确返回结果
  if (!res) {
    emit("error", file);
    return;
  }
  let obj = {}
  obj[props.keyField] = res
  obj[props.nameField] = res
  obj.src = URL.createObjectURL(file.raw);

  //加入新上传的对象
  fileList.value.push(obj);
  change(res, fileList.value);
}

const onError = (err) => {
  let msg = "";
  if (typeof err === 'object') {
    msg = window.JSON.stringify(err);
  } else {
    msg = err;
  }
  Msg.loading(false);
  Msg.error("上传文件错误，原因：" + msg);
  emit("error", err);
}

const onRemove = (file, uploadFileList) => {
  uploadRef.value.handleRemove(file);
  let index = fileList.value.findIndex(item => item[props.keyField] === file[props.keyField]);
  if(index > -1) {
    fileList.value.splice(index, 1);
    emit("remove", file, fileList.value);
    change(file, fileList.value);
  }

}

const change = (file, uploadFileList) => {
  emit("change", file, uploadFileList);
  emit('update:modelValue', uploadFileList);
}

/**
 * watch  监听
 */
watch(() => props.modelValue, (value) => {
  fileList.value = JSON.parse(JSON.stringify(value));

}, {immediate: true, deep: true})
//接受的文件类型
watch(() => props.accept, (value) => {
  if (Array.isArray(value)) {
    typeList.value = value.join(",");
    return;
  }
  typeList.value = value;
}, {immediate: true})

</script>

<style scoped lang="less">
:global(.el-upload-dragger) {
  padding: 0;
  border: none;
  background-color: transparent;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
}

.plus {
  background-color: var(--el-fill-color-lighter);
  color: var(--el-text-color-secondary);
}
</style>
