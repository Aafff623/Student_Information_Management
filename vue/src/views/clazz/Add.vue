<template>
  <el-form label-position="left" label-width="100px" ref="formRef" :model="form" style="max-width: 600px" :rules="rules">
    <el-form-item label="班级名" prop="name">
      <el-input maxlength="18" v-model="form.name" />
    </el-form-item>
    <el-form-item label="班主任" prop="bzr">
      <el-input maxlength="255" v-model="form.bzr" />
    </el-form-item>
    <el-form-item label="班主任电话" prop="tele">
      <el-input maxlength="11" v-model="form.tele" />
    </el-form-item>
  </el-form>
</template>
<script setup>
    import {  reactive, ref } from 'vue'
    let user = Cache.getUser()//当前登录用户
    const formRef = ref();
    let form = ref({
        name : '',
        bzr : '',
        tele : '',
    });
    let callBack;//保存成功回调函数
    const rules = reactive({
        name:{required: true, message: "班级名必填", trigger: "blur"},
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
            let {success,message} = await Http.post(`/clazz/save`, form.value);
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

