<template>
  <div class="layout">
    <x-header></x-header>
    <x-menu></x-menu>
    <div  class="main" :style="{width: `calc(100% - ${!isCollapse ? 200 : 64}px)`, left: `${!isCollapse ? 200 : 64}px`}">
      <div @click="setExpand(!isCollapse)" style="position: absolute;left: -10px;top: 45%;z-index: 99">
        <img v-if="!isCollapse"   :src="`${publicPath}images/menu-expand-1.png`" style="width: 30px">
        <img v-else :src="`${publicPath}images/menu-expand-0.png`" style="width: 30px">
      </div>
      <x-history></x-history>
      <div v-show="router.currentRoute.value.fullPath==='/'||router.currentRoute.value.fullPath==='/hello'" style="height: 90vh;overflow: scroll">
        <div id="statisticNum" style="display: flex;flex-wrap: wrap;" >
          <div v-for="(item, index) in statisticData" :key="'num-'+index" style="width: 280px; margin: 10px; padding: 10px; background-color: #bc97e3; text-align: center">
            <h2>{{ item.name }}</h2>
            <p style="font-size: 22px; font-weight: 600;">{{ item.value }}</p>
          </div>
        </div>

        <div id="echarts" style="display: flex;flex-wrap: wrap;">
          <div v-for="(item, index) in echartsList" :key="'chart-'+index" style="width: 550px; margin: 20px; box-sizing: border-box">
            <h2 style="margin: 0">{{ item.name }}</h2>
            <div :ref="el => setChartRef(el, index)" style="height: 300px"></div>
          </div>
        </div>
      </div>

      <div style="background: var(--x-main-bg); background-size: cover;padding: 10px;box-sizing: border-box;" :style="{height: `${mainHeight}px`}">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="menu.cacheList">
              <component v-if="!route.meta.link" :is="Component" :key="route.path"/>
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import XHeader from '@/components/layout/Header';
import XMenu from '@/components/layout/Menu';
import XHistory from '@/components/layout/History'
import {useStore, GlobalConfig} from 'core';
import {useRouter} from "vue-router";
import {onMounted,watch} from "vue";
import * as echarts from 'echarts';

const router = useRouter()
const config = GlobalConfig();
const {menu} = useStore();
let {isCollapse, mainHeight} = storeToRefs(config)

onMounted(()=>{
  getEcharts()
  window.addEventListener('resize', handleResize);
})

// 清理
onBeforeUnmount(() => {
  chartInstances.value.forEach(chart => chart?.dispose());
  window.removeEventListener('resize', handleResize);
});
const echartsList = ref([]);
const statisticData = ref([]);
const chartInstances = ref([]);
const chartDoms = ref([]);
// 设置图表容器引用
const setChartRef = (el, index) => {
  if (el) chartDoms.value[index] = el;
};

// 获取数据
const getEcharts = async () => {
  try {
    const data = await Http.post("/hello");
    if (!data.success) {
      console.log(data.message);
      return;
    }

    // 处理统计数据
    statisticData.value = data.data.filter(e => e.type === 'n').map(e => ({
      name: e.name,
      value: e.value
    }));

    // 处理图表数据
    echartsList.value = data.data
        .filter(e => ['line', 'bar', 'pie'].includes(e.type))
        .map(e => {
          const item = { name: e.name };

          if (e.type === 'line' || e.type === 'bar') {
            item.option = {
              xAxis: {
                data: e.names,
                axisLabel: { rotate: 45, interval: 0 }
              },
              yAxis: {},
              series: [{
                type: e.type,
                data: e.values,
                label: { show: true, position: 'top', formatter: '{c}' }
              }]
            };
          }
          else if (e.type === 'pie') {
            item.option = {
              series: [{
                type: 'pie',
                data: e.values.map((value, idx) => ({
                  name: e.names[idx],
                  value: value
                })),
                label: { show: true, formatter: '{b}: {c} ({d}%)' },
                itemStyle: {
                  color: (params) => {
                    const colors = [
                      '#C1232B', '#e3ee0d', '#1ad02a', '#132ee0',
                      '#12d7d0', '#4015c2', '#9c16b9', '#d37408',
                      '#203b12', '#9eece5', '#d397d7', '#561812'
                    ];
                    return colors[params.dataIndex % colors.length];
                  }
                }
              }]
            };
          }

          return item;
        });

    // 确保DOM更新后渲染图表
    await nextTick();
    renderCharts();

  } catch (error) {
    console.error('获取图表数据失败:', error);
  }
};

// 渲染图表
const renderCharts = () => {
  // 清理旧实例
  chartInstances.value.forEach(instance => instance?.dispose());
  chartInstances.value = [];

  echartsList.value.forEach((item, index) => {
    if (chartDoms.value[index]) {
      const chart = echarts.init(chartDoms.value[index]);
      chart.setOption(item.option);
      chartInstances.value[index] = chart;
    }
  });
};

// 窗口缩放处理
const handleResize = () => {
  chartInstances.value.forEach(chart => chart?.resize());
};


const setExpand = (isExpand) => {
  config.setCollapse(isExpand)
}

</script>

<style scoped lang="less">
.main {
  position: absolute;
  top: 60px;
  height: calc(100vh - 60px);
  transition: left .3s ease-in-out;
  .history {
    padding: 0 8px;
    height: 40px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .icon {
      width: 20px;
    }

    .scroll {
      width: calc(100% - 60px);
      margin-top: -2px;
      overflow-x: auto;
      white-space: nowrap;
    }
  }

  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    cursor: pointer;
  }


  /* fade-transform */
  .fade-transform--move,
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all .5s;
  }

  .fade-transform-leave-active {
    position: absolute;
  }

  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}
</style>
