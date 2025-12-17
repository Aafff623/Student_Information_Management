<template>
  <el-form label-position="left" label-width="100px" ref="formRef" :model="form" style="max-width: 600px" :rules="rules">
    <el-form-item label="用户名" prop="username">
      <el-input maxlength="20" v-model="form.username" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input maxlength="20" v-model="form.password" />
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input maxlength="12" v-model="form.name" />
    </el-form-item>
    <el-form-item label="电话" prop="tele">
      <el-input maxlength="11" v-model="form.tele" />
    </el-form-item>
  </el-form>
</template>
<script setup>
    import {  reactive, ref } from 'vue'
    let user = Cache.getUser()//当前登录用户
    const formRef = ref();
    let form = ref({
        username : '',
        password : '',
        name : '',
        tele : '',
    });
    let callBack;//保存成功回调函数
    const rules = reactive({
        username:{required: true, message: "用户名必填", trigger: "blur"},
        name:{required: true, message: "姓名必填", trigger: "blur"},
    })

    //初始化
    const render = (loadThisPage,params) => {
      callBack = loadThisPage
      if(params){
        //将params的所有属性拷贝给form.value
        Object.assign(form.value,params)
      }
    }


    //提交
    const submit = async () => {

        await formRef.value.validate(async (isValid, invalidFields) => {
            if(! isValid) {
                Msg.error(Helper.getFirstMessage(invalidFields));
                return;
            }
            let {success,message} = await Http.post(`/admin/save`, form.value);
            if(! success) {
                Msg.error(message);
                return;
            }
            Msg.success(message);
            Dialog.close();
            if(callBack) {
                callBack()
            }
        });
    }

    defineExpose({render,submit});

</script>

