<template>
  <el-select
      v-model="filteredValue"
      multiple
      filterable
      :loading="loading"
      v-bind="$attrs"
      @change="handleChange"
  >
    <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
    />
  </el-select>
</template>

<script>
import { ref, watch, onMounted } from 'vue'

export default {
  name: 'x-select-mul',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    api: {
      type: String,
      required: true
    },
    labelField: {
      type: String,
      default: 'name'
    },
    valueField: {
      type: String,
      default: 'id'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const loading = ref(false)
    const options = ref([])
    const filteredValue = ref([])
    const validValues = ref(new Set()) // 用于存储有效值的集合

    // 从API获取数据
    const fetchData = async () => {
      try {
        loading.value = true
        const { data } = await Http.get(props.api)

        // 构建有效值的集合
        validValues.value = new Set(
            data.records.map(item => String(item[props.valueField]))
        )

        // 转换数据格式
        options.value = data.records.map(item => ({
          label: item[props.labelField],
          value: String(item[props.valueField])
        }))

        // 加载数据后，过滤当前值
        filterCurrentValue()
      } catch (error) {
        console.error('加载下拉选项失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 过滤当前值（移除非法的选项）
    const filterCurrentValue = () => {
      if (props.modelValue) {
        const newValue = props.modelValue.split(',')
            .filter(v => v !== '' && validValues.value.has(v))
        filteredValue.value = newValue
        emit('update:modelValue', newValue.join(','))
      }
    }

    // 处理选择变化
    const handleChange = (newValue) => {
      // 确保所有值都是有效的
      const validValue = newValue.filter(v => validValues.value.has(v))
      filteredValue.value = validValue
      emit('update:modelValue', validValue.join(','))
    }

    // 监听外部值变化
    watch(() => props.modelValue, (newVal) => {
      if (newVal) {
        // 过滤非法值并更新
        const filtered = newVal.split(',')
            .filter(v => v !== '' && validValues.value.has(v))
        filteredValue.value = filtered
      } else {
        filteredValue.value = []
      }
    }, { immediate: true })

    // 组件挂载时加载数据
    onMounted(() => {
      fetchData()
    })

    return {
      loading,
      options,
      filteredValue,
      handleChange
    }
  }
}
</script>

<style scoped lang="less">
.el-select {
  width: 100%;
}
</style>