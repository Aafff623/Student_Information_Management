<template>
  <div class="x-menu" :style="{width: `${!isCollapse ? 200 : 64}px`}" style="height: calc(100vh - 60px);transition: width .3s ease-in-out">
    <div style="height: 100%;overflow-y: auto;overflow-x: hidden;">
      <el-menu
      :collapse="isCollapse"
      background-color="transparent"
      class="menu-default"
      @open="handleOpen"
      @close="handleClose"
      default-active="0"
      :default-openeds="openeds"
      >
      
      <template v-for="(menu, index) in menuList">
        <!--无子菜单-->
        <el-menu-item v-if="!menu.children && menu.id!=='chat'" :key="menu.id" :index="menu.id + ''" @click="onRedirect(menu)">
        <el-icon><icon-menu /></el-icon>
        <span>{{menu.name}}</span>
        </el-menu-item>
        <!--无子菜单 chat-->
        <el-menu-item v-if="menu.id==='chat'" :key="menu.id" :index="menu.id + ''" @click="onRedirect(menu)">
        <el-icon><ChatLineRound /></el-icon>
        <span>{{menu.name}}</span>
        <div style="color: red;padding: 0 3px;margin-left: 6px;text-shadow: 0px 2px 2px #fff;">{{unreadCount}}</div>
        </el-menu-item>
        <!--有子菜单-->
        <el-sub-menu v-if="menu.children" :key="menu.id" :index="menu.id">
        <template #title>
          <el-icon><location /></el-icon>
          <span>{{menu.name}}</span>
        </template>
        <!--子菜单-->
        <template v-for="(child) in menu.children" :key="child.id">
          <el-menu-item v-if="user.id && child.roles.indexOf(user.role.toLowerCase())!==-1"
          @click="onRedirect(menu,child)"
          :index="child.id">
          {{ child.name }}
          </el-menu-item>
        </template>
        </el-sub-menu>
      </template>
      
      </el-menu>
    </div>
  </div>
</template>


<script setup name="x-menu">
  import {
    Menu as IconMenu,
    Location, Menu,ChatLineRound} from '@element-plus/icons-vue'
  import {onMounted} from "vue";
  import {GlobalConfig, useStore} from 'core';
  const {menu} = useStore();
  const config = GlobalConfig();
  let conf = codeying
  const {isCollapse} = storeToRefs(config)
  const {menuList} = storeToRefs(menu);
  const router = useRouter();
  const unreadCount = ref('')
  const openeds = ref(['1','xxx']) //默认展开菜单

  //获取当前用户
  let user = ref({})
  onMounted(()=> {
    console.log("menu onMounted")
    user.value = Cache.getUser()
    if(!user.value || !user.value.id){
      if(router.currentRoute.value.fullPath !== '/'){
        Msg.error('请先登录！')
      }
      router.replace({path: '/login'})
    }
  })

  const handleOpen = () => {
    console.log("handleOpen")
  }

  const handleClose = () => {
    console.log("handleClose")
  }

  const onRedirect = (parent,child = false) => {
    let path = parent.path;
    if(child){
      path = path + child.path
    }
    //如果是http
    if(child && child.path && child.path.indexOf("http")>=0){
      window.open(child.path)
      return
    }
    router.push(path);
  }
</script>

<style lang="less">
  .x-menu {
    position: absolute;
    top: 60px;
    left: 0;
    width: 200px;
    //background-color: #4D5466;
    height: calc(100vh - 60px);

    .el-menu {
      border-right: none;
    }

    .el-sub-menu__title {
      font-size: 16px;
      color: #fff !important;
      padding-left: 20px !important;
    }

    .el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-menu-item, .el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-menu-item-group__title, .el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-sub-menu__title {
      white-space: nowrap;
      /*padding-left: 48px;*/
    }

    .el-menu-item{
      font-size: 14px;
      color: #fff;
    }

    .el-menu-item:hover {
      background-color: #5081bc;
    }
    .el-sub-menu{
      border: none;
      .el-sub-menu__title {
        color: #000;
      }
    }

    .el-menu-item.is-active{
      background-color: #1d4171;
      color: #FFF;
      font-weight: bold;
    }
  }
</style>


