<template>
  <div class="x-header x-space-between">
    <div class="x-row">
      <div class="title">{{ appConfig.name }}</div>
    </div>
    
    <div style="color: #fff;" class="x-row">
      
      <div class="x-row-start">
        <div class="x-pointer">
          <el-tooltip effect="light" content="用户信息" placement="bottom-start">
          <img v-if="!userInfo.avatar" :src="`${ publicPath}images/user.png`" @click="personal" style="height: 20px">
          <img v-if="userInfo.avatar" :src="`/api/file/downloadById?fileid=${userInfo.avatar}`" @click="personal" style="height: 20px;border-radius: 50%">
          </el-tooltip>
        </div>
        <div style="font-size: 14px;margin-left: 5px;margin-right: 8px">{{ initGreeting() }}！{{ userInfo.name ? userInfo.name : userInfo.username }} 【{{ userInfo.rolech }}】</div>
      </div>
      <div @click="loginOut" v-if="userInfo.username">
        <el-tooltip effect="light" content="登出" placement="bottom-start">
        <img :src="`${ publicPath}images/exit.png`" style="height: 20px">
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup name="x-header">
import {GlobalConfig, useStore} from 'core';
import sysConfig from '@/config/index'
import { useRouter } from 'vue-router'
import {onMounted} from "vue";
const router = useRouter()
const {user, msg} = useStore();
const {appConfig} = storeToRefs(GlobalConfig());
const userInfo = ref({})

onMounted(()=> {
  console.log("Header onMounted 当前路径："+router.currentRoute.value.fullPath)
  //判断用户是否登录
  getUserInfo()
})
/**
 * 获取用户信息 判断用户是否登录
 * @returns {Promise<void>}
 */
const getUserInfo = async () => {
  let info = await user.getUserInfo()
  //用户信息不存在
  if (! info || !info.id) {
    if(router.currentRoute.value.fullPath !== '/'){
      Msg.error('请先登录！')
    }
    router.replace({path: '/login'})
    return
  }
  userInfo.value = info
  Cache.setUser(info)
}

//========================用户个人中心start
import adminPersonal from '../../views/admin/Edit'
import studentPersonal from '../../views/student/Edit'
const personal = async ()=>{
  let id = userInfo.value.id
  if(userInfo.value.role === 'admin'){
    const op = Dialog.open(adminPersonal, `个人中心`)
    op.mounted(c => {
      c.render(id,()=>{Msg.success("个人信息已更新")})
    })
    op.confirm(async (c) => {
      c.submit()
    })
  }
  if(userInfo.value.role === 'student'){
    const op = Dialog.open(studentPersonal, `个人中心`)
    op.mounted(c => {
      c.render(id,()=>{Msg.success("个人信息已更新")})
    })
    op.confirm(async (c) => {
      c.submit()
    })
  }

}
//========================用户个人中心end

const initGreeting = () => {
  var greeting = '';
  var d = new Date();
  var hour = d.getHours();
  if (hour >= 5 && hour <= 7) {
    greeting = '早上好';
  } else if (hour >= 8 && hour <= 11) {
    greeting = '上午好';
  } else if (hour >= 12 && hour <= 13) {
    greeting = '中午好';
  } else if (hour >= 14 && hour <= 18) {
    greeting = '下午好';
  } else {
    greeting = '晚上好';
  }
  return greeting
}

const loginOut = ()=> {
  const op = Msg.confirm('是否退出登录？')
  op.then(async ()=>{
    Cache.setUser(null);//必须设置为空，否则有缓存用户
    let result = await user.loginOut()
    if(!Helper.empty(result)) {
      if(result.indexOf('http://') !== -1 || result.indexOf('https://') !== -1) {
        window.location.href = result
      }
    }else {
      router.replace({path: '/login'})
    }
  })

}
</script>

<style scoped lang="less">

</style>

