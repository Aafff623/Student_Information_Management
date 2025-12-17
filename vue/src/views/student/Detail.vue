<template>
  <el-form
    label-position="left"
    label-width="100px"
    :model="form"
    style="max-width: 600px"
    >
    <el-form-item label="用户名">
      <el-text>{{form.username}}</el-text>
    </el-form-item>
    <el-form-item label="姓名">
      <el-text>{{form.name}}</el-text>
    </el-form-item>
    <el-form-item label="头像">
      <x-file-view :disabled="true" :list="form.avatar"></x-file-view>
    </el-form-item>
    <el-form-item label="性别">
      <el-text>{{form.gender}}</el-text>
    </el-form-item>
    <el-form-item label="年龄">
      <el-text>{{form.age}}</el-text>
    </el-form-item>
    <el-form-item label="电话">
      <el-text>{{form.tele}}</el-text>
    </el-form-item>
    <el-form-item label="籍贯">
      <el-text>{{form.place}}</el-text>
    </el-form-item>
    <el-form-item label="入学时间">
      <el-text>{{form.ruxsj}}</el-text>
    </el-form-item>
    <el-form-item label="学号">
      <el-text>{{form.numb}}</el-text>
    </el-form-item>
    <el-form-item label="班级">
      <el-button link v-if="form.clazzidFrn" type="primary" text bg @click="clazzidDetail(form.clazzid)">{{ form.clazzidFrn.name }}</el-button>
    </el-form-item>
  </el-form>
  
  
</template>
<script setup>
    let commentRef = ref(null)
    let form = ref({ clazzidFrn:null, });

    const render = async (id) => {
        Msg.loading("loading...")
        let {data} = await Http.get(`/student/detail`, {id});
        console.log(data)
        form.value = data;
        Msg.loading(false)
    }

     //班级详情页
    import clazzidDetailPage from "../clazz/Detail";
    const clazzidDetail = async (id)=> {
        const op = Dialog.open(clazzidDetailPage, '详情').setCancelText('').setConfirmText('')
        op.mounted(c => {
            c.render(id)
        })
    }

    defineExpose({render});

</script>

