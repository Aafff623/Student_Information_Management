<template>
  <el-form
    label-position="left"
    label-width="100px"
    :model="form"
    style="max-width: 600px"
    >
    <el-form-item label="班级名">
      <el-text>{{form.name}}</el-text>
    </el-form-item>
    <el-form-item label="班主任">
      <el-text>{{form.bzr}}</el-text>
    </el-form-item>
    <el-form-item label="班主任电话">
      <el-text>{{form.tele}}</el-text>
    </el-form-item>
  </el-form>
  
  
</template>
<script setup>
    let commentRef = ref(null)
    let form = ref({  });

    const render = async (id) => {
        Msg.loading("loading...")
        let {data} = await Http.get(`/clazz/detail`, {id});
        console.log(data)
        form.value = data;
        Msg.loading(false)
    }


    defineExpose({render});

</script>

