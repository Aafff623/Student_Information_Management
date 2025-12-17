<template>
  <div class="history x-space-between">
    <div @click="prev" class="x-pointer op">
      <img :src="`${publicPath}images/before.png`" style="width: 14px">
    </div>

    <div class="body" ref="scroll">
      <div class="scroll" :style="{left: `${left}px`, width: `${totalWidth}px`}">
        <template v-for="(tag, index) in history" >
          <div @click="onClick(tag)" class="tab" :style="{left: `${index == 0 ? 0 : calcWidth(index)}px`, width: `${tag.width>70?tag.width:70}px`}" >
            <div class="tab-item x-space-between" :class="{active: tag.path == $route.path}">
              <div class="text">{{ tag.meta.title }}</div>
              <el-icon @click.stop="onClose(tag)"><Close/></el-icon>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div @click="next" class="x-pointer op">
      <img :src="`${publicPath}images/next.png`" style="width: 14px">
    </div>
  </div>

</template>

<script setup name="x-history">
  import {Close} from '@element-plus/icons-vue';
  import {useStore, GlobalConfig} from 'core';
  let scroll = ref();
  let left = ref(0);
  let count = ref(0);
  const {menu} = useStore();
  const {appConfig} = GlobalConfig();
  const {history} = storeToRefs(menu);
  const router = useRouter()

  let totalWidth = computed(() => {
    if(! Helper.emptyArray(history.value)) {
      let totalWidth = 0;
      history.value.forEach(menu => {
        totalWidth += menu.width;
      })
      return totalWidth;
    }
  })

  let calcWidth = (index) => {
    let left = 0;
    if(! Helper.emptyArray(history.value)) {
      for (let i=0;i<history.value.length; i++) {
        if(i >= index) {
          break;
        }
        left += history.value[i].width;
      }
    }

    return left;
  }

  const prev = () => {
    if(left.value >= 0) {
      return;
    }
    count.value--;
    left.value += history.value[count.value].width;
  }

  const next = () => {
    if((0 - left.value) >= (totalWidth.value - scroll.value.clientWidth)) {
      return;
    }
    left.value -= history.value[count.value].width;
    count.value++;
  }

  const onClick = (menu) => {
    router.replace({path: menu.path, query: menu.query});
  }

  const onClose = (tag) => {
    let index = menu.removeHistory(tag);

    if(history.value.length == 0) {
      router.push(appConfig.home);
      return;
    }

    if(router.currentRoute.value.path == tag.path) {
      if(index > 0) {
        index = index - 1;
      }

      let redirect = history.value[index];
      router.replace({path: redirect.path, query: redirect.query});
    }
  }

</script>

<style scoped lang="less">
  @height: 40px;
  @tabWidth: 100px;

  .history {
    background-color: var(--x-main-bg-color);
    padding: 0 8px;
    height: 40px;
    box-sizing: border-box;
    overflow-x: hidden;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);

    .body {
      width: calc(100% - 60px);
      overflow: hidden;
      transition: width .3s ease-in-out;
      .scroll {
        position: relative;
        height: @height;
        overflow-x: auto;
        overflow-y: hidden;
        transition: left 1s ease 0s;
        z-index: 0;

        .tab {
          position: absolute;
          height: 100%;

          .tab-item {
            width: 100%;
            height: @height;
            padding: 0 10px;
            box-sizing: border-box;
          }

          .tab-item:hover {
            background-color: rgba(64, 158, 255, 0.09);
            border-bottom: 2px solid var(--x-header-bg-color);
            color: #3c3c3c;
          }

          .text {
            overflow: hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
            cursor: pointer;
            font-size: 14px;
            color: #606266;
          }

          i {
            width: 15px;
            height: 32px;
            line-height: 33px;
            color: rgba(0, 0, 0, 0.2);
            font-size: 14px;
            cursor: pointer;
            font-weight: bolder;
          }
          i:hover {
            color: rgba(0, 0, 0, 0.5);
          }
        }

        .active {
          border-bottom: 2px solid var(--x-header-bg-color);
          color: #3c3c3c;
        }

        .op {
          width: 20px;
          background-color: #fff;
          height: @height;
        }
      }
    }
  }
</style>
