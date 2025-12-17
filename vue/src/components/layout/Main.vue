<template>
  <div class="main-content">
    <slot></slot>
  </div>
</template>

<script setup name="x-main">
let props = defineProps({
  background:{
    type: Boolean,
    default: false
  }
})
</script>
<style lang="less" scoped>
  .main-content {
    width: 100%;
    overflow-y: auto;
    height: 100%;
    border-radius: 6px;
  }
</style>
