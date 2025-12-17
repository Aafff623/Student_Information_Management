<template>
  <el-form label-position="left" label-width="100px" ref="formRef" :model="form" style="max-width: 600px" :rules="rules">
    <el-form-item label="课程名称" prop="name">
      <el-input maxlength="18" v-model="form.name" />
    </el-form-item>
    <el-form-item label="指导老师" prop="teacherid">
      <el-input maxlength="255" v-model="form.teacherid" />
    </el-form-item>
    <el-form-item label="学分" prop="score">
      <el-input maxlength="255" v-model.number="form.score" type="number"/>
    </el-form-item>
    <el-form-item label="课程简介" prop="describtion">
      <el-input maxlength="255" v-model="form.describtion" />
    </el-form-item>
  </el-form>
</template>
<script setup>
    import {  reactive, ref } from 'vue'
    let user = Cache.getUser()//当前登录用户
    const formRef = ref();
    let form = ref({
        name : '',
        teacherid : '',
        score : '',
        describtion : '',
    });
    let callBack;//保存成功回调函数
    const rules = reactive({
        name:{required: true, message: "课程名称必填", trigger: "blur"},
        teacherid:{required: true, message: "指导老师必填", trigger: "blur"},
        score:{required: true, message: "学分必填", trigger: "blur"},
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
            let {success,message} = await Http.post(`/course/save`, form.value);
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

