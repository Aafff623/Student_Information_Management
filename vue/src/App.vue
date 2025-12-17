<template>
  <x-plugin></x-plugin>
  <router-view/>
</template>
<script setup>
import XPlugin from '@/core/plugin/Index';
import MenuList from './config/menu';
import {GlobalConfig, useStore} from 'core';
const config = GlobalConfig()
const {menu} = useStore();
menu.setMenuList(MenuList);
onMounted(() => {
  listenerWindowResize();
})

let width = 0;
let height = 0;
const listenerWindowResize = () => {
  width = document.documentElement.clientWidth;
  height = document.documentElement.clientHeight;
  setMenuModel()

  window.onresize = () => {
    return (() => {
      width = document.documentElement.clientWidth;
      height = document.documentElement.clientHeight;
      setMenuModel()
    })();
  };
}

const offset = 100;
let resizeList = [0,0];
const setMenuModel = () => {
  config.setMainHeight(height - offset);
  config.setMainWidth(width - 200);
  config.setScreenWidth(width);
  config.setScreenHeight(height);

  if (config.width > 800) {
    if (resizeList[0] === 0) {
      config.setMobile(false);
      config.setCollapse(false);
    }

    resizeList[0] = 1;
  } else {
    config.setMobile(true);
    config.setCollapse(false);
    resizeList[0] = 0;
  }
}

</script>
<style>
html body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  overflow-x: hidden;
  overflow-y: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
