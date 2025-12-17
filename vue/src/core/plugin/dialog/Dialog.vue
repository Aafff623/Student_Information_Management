<template>
  <el-dialog :class="{'plugin-dialog': !fullscreen && !topBottom}" :draggable="drag" :align-center="topBottom"
             :modal="modal" :before-close="onBeforeClose" @close="onClose" @open="$emit('open')"
             @opened="$emit('opened')" :append-to-body="appendToBody" :title="title" :close-on-click-modal="false"
             :fullscreen="fullscreen" :width="checkWidth() ? (typeof width == 'number' ? width + 'px' : width) : screenWidth + 'px'" :show-close="showClose"
             :visible.sync="show" style="border-radius: 6px;box-shadow: 0 4px 8px rgba(202,216,240,0.6);">


    <div v-if="!fullscreen">
      <!--需计算　未计算-->
      <div style="overflow-x: hidden;overflow-y: auto" v-if="topBottom" :style="{height: !(confirmText || cancelText) ? 'calc(100vh - 39px)' : 'calc(100vh - 86px)'}" class="x-p-15">
        <slot></slot>
      </div>

      <div style="overflow-x: hidden;overflow-y: auto" v-else :style="{maxHeight: (mainHeight - 48) + 'px'}" class="x-p-15">
        <slot></slot>
      </div>
    </div>

    <div class="x-p-15" style="overflow-x: hidden;overflow-y: auto" :style="{height: !(confirmText || cancelText) ? 'calc(100vh - 39px)' : 'calc(100vh - 86px)'}" v-else>
      <slot></slot>
    </div>


    <div slot="footer" :class="bottomClass">
      <div v-if="confirmText || cancelText" class="dialog-footer" >
        <button class="x-btn x-btn-m x-btn-success" v-if="cancelText"  @click="onCancel">{{ cancelText }}</button>
        <button class="x-btn x-btn-m " v-if="confirmText" :plain="plain" :loading="loading" @click="onSubmit">{{ confirmText }}</button>
      </div>
    </div>

  </el-dialog>
</template>

<script setup>
import {GlobalConfig} from 'core';
const config = GlobalConfig()
const {screenWidth, mainHeight} = storeToRefs(config);

let props = defineProps({
  id: String,
  title: String,
  modal: {
    type: Boolean,
    default: true
  },
  drag: {
    type: Boolean,
    default: true
  },

  fullscreen: {
    type: Boolean,
    default: false
  },

  appendToBody: {
    type: Boolean,
    default: true
  },

  width: {
    type: [String, Number],
    default: '1080px'
  },

  cancelText: {
    type: [String, Boolean],
    default: "取 消"
  },

  confirmText: {
    type: [String, Boolean],
    default: "确 定"
  },

  plain: {
    type: Boolean,
    default: false
  },

  margin: {
    type: [String, Number],
    default: 'auto'
  },

  autoClose: {
    type: Boolean,
    default: false,
  },

  beforeClose: {
    type: Function,
  },

  bottomAlign: {
    type: String,
    default: 'right'
  },
  showClose: {
    type: Boolean,
    default: true,
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close']);
let show = ref(false);
let loading = ref(false);

function onSubmit() {
  emit("confirm", props.id);
  if (props.autoClose) {
    emit("close", props.id);
    show.value = false;
  }
}

function onCancel() {
  emit("cancel", props.id);
}

function onClose() {
  emit("close", props.id);
}

function onBeforeClose(done) {
  if (props.beforeClose) {
    props.beforeClose(props.id, done);
  } else {
    done();
  }
}

function checkWidth() {
  if (!Helper.empty(props.width)) {
    try {
      let widthStr = props.width.replace("px", "");
      let width = parseInt(widthStr);
      return width < screenWidth.value;
    } catch (e) {
    }
  }

  return true;
}

const bottomClass = computed(() => {
  let classList = [];
  if (props.bottomAlign == 'right') {
    classList.push("x-row-reverse");
  } else if (props.bottomAlign == 'center') {
    classList.push("x-center");
  } else if (props.bottomAlign == 'left') {
    classList.push("x-row");
  }

  return classList;
})

const topBottom = computed(() => {
  return props.margin == '0';
})

</script>

<style scoped lang="less" type="text/less">

.dialog-footer {
  padding-bottom: 15px;
  padding-right: 15px;
  box-sizing: border-box;
  button:last-child {
    margin-left: 10px;
  }
}

:global(.el-dialog__body) {
  padding: 0 !important;
}

:global(.el-dialog__wrapper) {
  overflow-y: hidden;
}

:global(.el-dialog__header) {
  padding: 15px 15px 0 15px !important;
}

:global(.plugin-dialog) {
  .el-dialog {
    display: flex;
    flex-direction: column;
    margin:0 !important;
    position:absolute;
    top:calc(50% - 10px);
    left:50%;
    transform:translate(-50%,-50%);
    /*height:600px;*/
    max-height:calc(100% - 30px);
    max-width:calc(100% - 30px);
  }
}
</style>
