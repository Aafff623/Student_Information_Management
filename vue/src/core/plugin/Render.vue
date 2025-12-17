<template>
  <keep-alive>
    <component :is="component" v-on="on" v-bind="data" ref="cRef"></component>
  </keep-alive>
</template>
<script setup>
import {ref, reactive, shallowRef, watch, nextTick} from 'vue';
const emit = defineEmits(['update:modelValue', 'mounted']);
let props = defineProps({
  modelValue: {
    type: [String, Object, Function],
    default: ""
  },
  on: {
    type: Object,
    default: () => {
      return {}
    }
  },
  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
})
const cRef = ref();
const component = ref();

watch(() => props.modelValue, async (value) => {
  component.value = value;
  nextTick(() => {
    emit("mounted", cRef.value);
  })
}, {immediate: true, deep:true})

watch(() => component.value,(data) => {
  emit('update:modelValue', data)

})

function reset() {
  component.value = null;
}

function getValue(){
  return component.value;
}
</script>

<style scoped>

</style>
