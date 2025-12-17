<template>
  <!--评论-->
  <div id="comments" class="comments">
    <h3 class="comments-title">评论</h3>
    <div id="publishBox" class="comment">
      <div class="comment-head">
        <img :src="`${publicPath}images/users/self.png`">
        <span v-if="userInfo&&userInfo.id">{{ '【'+userInfo.rolech }}:{{ userInfo.username+'】' }}</span>
        <span v-if="!userInfo||!userInfo.id">[登录以后即可发表评论~]</span>
      </div>
      <div class="comment-body">
        <textarea id="commentStr" v-model="content"></textarea>
        <button @click="publish" id="publishBtn" type="button">发表</button>
      </div>

    </div>
    <div class="comment" v-for="d in myMsg">
      <div class="comment-head">
        <img :src="`${publicPath}images/users/self.png`">
        <span> 我 </span>
        <span class="time">刚刚</span>
      </div>
      <div class="comment-body">
        <p>{{ d }}</p>
      </div>
    </div>
    <div class="comment" v-for="d in listData">
      <div class="comment-head">
        <img :src="`${publicPath}images/users/other.png`">
        <span>【{{ d.rolech }}:{{ d.username }}】</span>
        <span class="time">{{ d.createtime }}</span>
      </div>
      <div class="comment-body">
        <p>{{ d.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup name="x-comment">
import {GlobalConfig} from 'core';

const {user, msg} = useStore();
const {appConfig} = GlobalConfig()
let httpConfig = appConfig.http;
import {onMounted, reactive} from "vue";

const userInfo = ref({})
const listData = ref([]);
const myMsg = ref([]);
const content = ref("")
const ctid = ref("")
const type = ref("")

onMounted(async () => {
  console.log("Common onMounted")
  userInfo.value = Cache.getUser()
})
const init = async (id, ctype) => {
  ctid.value = id;
  type.value = ctype
  let data = await Http.get('/userComment2/action?ctid=' + ctid.value)
  console.log(data)
  if (data.data) {
    listData.value = data.data
  }
}
//发表
const publish = async () => {
  if(!content.value){
    Msg.error("评论不可为空哦！")
    return
  }
  let data = await Http.post('/userComment2/action?ctid=' + ctid.value + `&content=${content.value}&type=${type.value}`)
  console.log(data)
  if (data.success) {
    myMsg.value.push(content.value)
    content.value = ''
  }
}
defineExpose({
  init
})
</script>
<style lang="less" scoped>
/*评论区*/
.comments {
  color: black;
  width: 100%;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  background-color: transparent;
}

.comments-title {
  border-bottom: 1px solid #e1e1e1;
  padding: 5px 10px;
  font-weight: normal;
  letter-spacing: 10px;
}
.comment {
  box-sizing: border-box;
  padding: 10px 10px 0 20px;
  border-bottom: #e1e1e1 1px solid;
}

.comment-head {
  height: 40px;
  display: flex;
  align-items: center;
}
.comment-head .time {
  color: #afb6b3;
}
.comment-head img {
  width: 30px;
  height: 30px;
  position: relative;
  margin-right: 5px;
}
.comment-body {
  margin-left: 35px;
  display: flex;
}
.comment-body button {
  background-color: #0FB25F;
  padding: 5px 15px;
  border: none;
  color: white;
  margin: 15px;
  border-radius: 2px;
  cursor: pointer;
}
.comment-body textarea {
  width: 75%;
  height: 50px;
  border: 1px solid #e1e1e1;
  margin-bottom: 10px;
  background-color: #ffffff33;
  outline: none;
}
</style>