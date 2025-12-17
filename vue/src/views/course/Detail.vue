<template>
  <el-form
    label-position="left"
    label-width="100px"
    :model="form"
    style="max-width: 600px"
    >
    <el-form-item label="课程名称">
      <el-text>{{form.name}}</el-text>
    </el-form-item>
    <el-form-item label="指导老师">
      <el-text>{{form.teacherid}}</el-text>
    </el-form-item>
    <el-form-item label="学分">
      <el-text>{{form.score}}</el-text>
    </el-form-item>
    <el-form-item label="课程简介">
      <el-text>{{form.describtion}}</el-text>
    </el-form-item>
  </el-form>
  
  
</template>
<script setup>
    let commentRef = ref(null)
    let form = ref({  });

    const render = async (id) => {
        Msg.loading("loading...")
        let {data} = await Http.get(`/course/detail`, {id});
        console.log(data)
        form.value = data;
        Msg.loading(false)
    }


    defineExpose({render});

</script>

