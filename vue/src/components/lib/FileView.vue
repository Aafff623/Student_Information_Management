<template>
  <template v-if="type == 'grid'">
    <ul class="el-upload-list el-upload-list--picture-card">
      <li :style="{width: `${size}px`, height: `${size}px`}" v-for="(file, index) in fileList" :key="index"
          class="el-upload-list__item is-success" tabindex="0">
        <el-image fit="contain" v-if="isImage(file.ext)" class="el-upload-list__item-thumbnail" :src="file.src" alt="">
          <template #placeholder>
            <el-image :src="`${publicPath}images/placeholder.png`"></el-image>
          </template>

        </el-image>
        <el-image v-else-if="isPdf(file.ext)" class="el-upload-list__item-thumbnail"
                  :src="`${publicPath}images/pdf.png`"
                  alt="">
          <template #placeholder>
            <el-image :src="`${publicPath}images/placeholder.png`"></el-image>
          </template>
        </el-image>
        <el-image v-else-if="isDoc(file.ext)" class="el-upload-list__item-thumbnail"
                  :src="`${publicPath}images/word.png`"
                  alt="">
          <template #placeholder>
            <el-image :src="`${publicPath}images/placeholder.png`"></el-image>
          </template>
        </el-image>
        <el-image v-else-if="isExcel(file.ext)" class="el-upload-list__item-thumbnail"
                  :src="`${publicPath}images/excel.png`" alt="">
          <template #placeholder>
            <el-image :src="`${publicPath}images/placeholder.png`"></el-image>
          </template>
        </el-image>
        <el-image v-else class="el-upload-list__item-thumbnail" :src="`${publicPath}images/file.png`" alt="">
          <template #placeholder>
            <el-image :src="`${publicPath}images/placeholder.png`"></el-image>
          </template>
        </el-image>
        <!--文件右上角的小√-->
<!--        <label class="el-upload-list__item-status-label">-->
<!--          <i class="el-icon el-icon&#45;&#45;upload-success el-icon&#45;&#45;check">-->
<!--            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">-->
<!--              <path fill="currentColor"-->
<!--                    d="M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"></path>-->
<!--            </svg>-->
<!--          </i>-->
<!--        </label>-->

        <span class="el-upload-list__item-actions">
            <span v-if="isImage(file.ext)|| isPdf(file.ext)" class="el-upload-list__item-preview" @click="onPreview(file)">
            <el-icon><zoom-in/></el-icon>
            </span>
            <span v-if="!isImage(file.ext)" class="el-upload-list__item-delete" @click="onDownload(file)">
              <el-icon><Download/></el-icon>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="onRemove(file, index)">
              <el-icon><Delete/></el-icon>
            </span>
          </span>
      </li>
    </ul>
  </template>
  <template v-else>
    <ul class="el-upload-list el-upload-list--text">
      <li v-for="(file, index) in fileList" :key="index" class="el-upload-list__item is-success" tabindex="0">
        <div class="el-upload-list__item-info"><a class="el-upload-list__item-name">
          <el-image v-if="isPdf(file.ext)" style="width: 16px" :src="`${publicPath}images/pdf.png`" alt=""/>
          <el-image v-else-if="isDoc(file.ext)" style="width: 16px" :src="`${publicPath}images/word.png`" alt=""/>
          <el-image v-else-if="isExcel(file.ext)" style="width: 16px" :src="`${publicPath}images/excel.png`" alt=""/>
          <i v-else class="el-icon el-icon--document">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor"
                    d="M832 384H576V128H192v768h640V384zm-26.496-64L640 154.496V320h165.504zM160 64h480l256 256v608a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32zm160 448h384v64H320v-64zm0-192h160v64H320v-64zm0 384h384v64H320v-64z"></path>
            </svg>
          </i>

          <span @click="onPreview(file)" class="el-upload-list__item-file-name">{{ file.name }}</span></a>
        </div>

        <label class="el-upload-list__item-status-label">
          <i v-if="!disabled" class="el-icon el-icon--upload-success el-icon--circle-check">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor"
                    d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"></path>
              <path fill="currentColor"
                    d="M745.344 361.344a32 32 0 0 1 45.312 45.312l-288 288a32 32 0 0 1-45.312 0l-160-160a32 32 0 1 1 45.312-45.312L480 626.752l265.344-265.408z"></path>
            </svg>
          </i>
        </label>
        <i v-if="!disabled" @click="onRemove(file, index)" class="el-icon el-icon--close">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor"
                  d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path>
          </svg>
        </i>
      </li>
    </ul>
  </template>
</template>

<script setup name="x-file-view">
import {Download, Delete, ZoomIn} from '@element-plus/icons-vue';
import {GlobalConfig} from 'core';

/**
 *  显示图片列表，由本组件渲染，格式：
 * {
    "fileId": "hello.jpg", //主键、id，根据此下载
    "name": "hello.jpg", //name，用于获取ext
    "ext": "jpg",
    "src": "blob:http://localhost:8006/44f8c5c2-fd74-46a2-99b8-07d79c60a15d" //下载时赋值
  }
 */
let fileList = ref([]);
const {appConfig} = GlobalConfig()
let httpConfig = appConfig.http;
const emit = defineEmits(['remove'])

const props = defineProps({
  /**
   *  包含list或者一个对象，需要包含nameField（fileName）和keyField（fileId）为key的值
   * 也可nameField和keyField都一样
   * <x-file-view :disabled="true" keyField="fileId" nameField="fileId" :list="faqirenFiles"></x-file-view>
   * 示例： [{fileId : 'hello.jpg'}] 、{fileId : 'hello.jpg'} 、 'hello.jpg'
   */
  list: {
    type: [Array, Object,String],
    default: () => {
      return []
    }
  },
  size: {
    type: Number,
    default: 90,
  },
  //显示类型
  type: {
    type: String,
    default: "grid"
  },
  //不可编辑
  disabled: {
    type: Boolean,
    default: true,
  },

  //图片名字段名，用来获取ext后缀名
  nameField: {
    type: String,
    default: 'fileId',
  },

  //图片对应的主键字段名
  keyField: {
    type: String,
    default: 'fileId',
  },

})

//hover 预览
const onPreview = async (file) => {
  if(isImage(file.ext)) {
    Dialog.open("img", "预览", {
      width: '880px',
      props: {
        style: {width: '850px', textAlign: 'center'},
        src: file.src
      }
    })
  } else if (isPdf(file.ext)) {
    await getFileBlobSrc(file, 'pdf')
    Dialog.open("iframe", "PDF预览", {
      width: '1000px',
      cancelText: "",
      confirmText: "",
      props: {
        style: {width: '935px', height: '600px', border: 'none'},
        src: file.src
      }
    })
  } else {
    onDownload(file);
  }
}

const getFileBlobSrc = async (file, type) => {
  if (Helper.empty(file.src)) {
    console.log(file)
    file.src = `${$app.config.globalProperties.publicPath}images/placeholder.png`
    console.log(file)
    let request = Http.create(httpConfig.downloadUrl, {fileid: file.fileId});// 根据id或者fileId下载文件id（fileId：fastdfs路径，group/...）
    request.setResponseType('blob');
    request.setMethod('get');
    let response = await request;

    if (!response || response.status !== 200) {
      file.src = "/images/img-error.png";
      return;
    }
    let blobType = "";
    if (isPdf(type)) {
      blobType = "application/pdf";
    }
    const blob = new Blob([response.data], {type: blobType});
    file.src = URL.createObjectURL(blob);
  }
}
//hover 下载
const onDownload = (file) => {
  let fileid = file[props.keyField]
  Http.download({fileid},fileid)
}
//hover 删除
const onRemove = (file, index) => {
  fileList.value.splice(index, 1);
  emit("remove", file, fileList.value);
}

//1 听见外部图片列表值list的变化，来更新图片列表
const handlerValue = async (list) => {
  if (Helper.empty(list)) {
    return;
  }
  fileList.value = []//先清除图片显示
  let fileListTemp = [];
  //如果传进组件的是数组类型
  if (Array.isArray(list)) {
    for (let i = 0; i < list.length; i++) {
      let file = list[i];
      await handlerFile(file)
      fileListTemp.push(file);
    }
    fileList.value = fileListTemp;

  } else if ("object" === typeof list) {
    //如果list是单个文件对象{}
    list = Object.assign({}, list);
    await handlerFile(list)
    fileList.value.push(list)

  } else if ('string' === typeof list) {

    let obj = {}
    obj[props.keyField] = list
    obj[props.nameField] = list
    await handlerFile(obj)
    fileList.value.push(obj)
  }

}
//2 处理每个文件
const handlerFile = async (file) => {
  //处理文件扩展名
  let ext = file.ext;
  if (Helper.empty(file.name)) {
    file.name = file[props.nameField];
  }

  if (Helper.empty(ext) && !Helper.empty(file.name)) {
    ext = file.name.substring(file.name.lastIndexOf(".") + 1);
    file.ext = ext;
  }

  if (Helper.empty(file.ext) || (isImage(ext) && props.type == 'grid')) {
    download(file);
  }
}

/**
 * 根据文件id，下载附件
 * @param file
 * @returns {Promise<void>}
 */
const download = async (file) => {
  if (Helper.empty(file.src)) {
    console.log("download file blob")
    console.log(file)
    file.src = `${$app.config.globalProperties.publicPath}images/placeholder.png`
    //获取图片，展示图片
    let request = Http.create(httpConfig.downloadUrl, {fileid: file[props.keyField]});
    request.setResponseType('blob');
    request.setMethod('get');
    let response = await request;

    if (!response || response.status != 200) {
      file.src = "/images/img-error.png";
      return;
    }
    const blob = new Blob([response.data]);
    file.src = URL.createObjectURL(blob);

    // 若文件名称不存在，则从下载头部中获取
    if (Helper.empty(file.name)) {
      let disposition = response.headers['content-disposition'];
      //兼容下
      if (Array.isArray(disposition)) {
        disposition = disposition[0];
      }

      if (disposition) {
        let name = disposition.substring(disposition.indexOf("filename=") + 10, disposition.length - 1);
        if (name) {
          let ext = name.substr(name.lastIndexOf(".") + 1);
          file.ext = ext;
          file.name = decodeURIComponent(name);
        }
      }
    }

    triggerRef(fileList);
  }
}

//================================================判断文件类型
const isImage = (ext) => {
  if (Helper.empty(ext)) {
    return false;
  }

  return ['jpeg', 'png', 'git', 'jpg'].indexOf(ext) > -1;
}

const isPdf = (ext) => {
  if (Helper.empty(ext)) {
    return false;
  }
  return ['pdf', 'PDF'].indexOf(ext) > -1;
}

const isDoc = (ext) => {
  if (Helper.empty(ext)) {
    return false;
  }

  return ['doc', 'docx', 'wps'].indexOf(ext) > -1;
}

const isExcel = (ext) => {
  if (Helper.empty(ext)) {
    return false;
  }

  return ['xls', 'xlsx', 'xlsm'].indexOf(ext) > -1;
}

//0 ====================================监听props.list
watch(() => props.list, (value) => {
  handlerValue(value);
}, {immediate: true, deep: true})

</script>

<style scoped lang="less">

:global(.el-upload-list--picture-card) {
  display: block;
  flex-wrap: wrap;
  padding: 0;
  box-sizing: border-box;
  margin-top: 6px;
  background: transparent;


  .el-image__wrapper {
    position: static;
    display: flex;
    //justify-content: center;
    //align-items: center;
  }

  .el-image__error {
    font-size: 14px;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-placeholder);
    vertical-align: middle;
  }

}

:global(.el-upload-list) {
  padding: 0;
  list-style: none;
  position: relative;
  background-color: transparent;
}
</style>
