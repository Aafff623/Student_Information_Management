<template>
  <el-form label-position="left" label-width="100px" ref="formRef" :model="form" style="max-width: 600px" :rules="rules">
    <el-form-item label="学生" prop="sid">
      <x-select-table
        :disabled="user.role==='student'" :header="[{label:'学生',field:'name',width:'100%'}]"
        v-model="form.sid"
        :queryParams="[{name:'name',label:'学生'}/*,{name:'state',label:'状态',defaultValue:'上架',type:'hide'}*/]"
        api="/student/list"
        labelField="name"
        valueField="id"
      ></x-select-table>
    </el-form-item>
    <el-form-item label="课程" prop="cid">
      <x-select-table
        :header="[{label:'课程',field:'name',width:'100%'}]"
        v-model="form.cid"
        :queryParams="[{name:'name',label:'课程'}/*,{name:'state',label:'状态',defaultValue:'上架',type:'hide'}*/]"
        api="/course/list"
        labelField="name"
        valueField="id"
      ></x-select-table>
    </el-form-item>
  </el-form>
</template>
<script setup>
    import {  reactive, ref } from 'vue'
    let user = Cache.getUser()//当前登录用户
    const formRef = ref();
    let form = ref({
         sid : user.role == 'student'? user.id:'',
        cid : '',
    });
    let callBack;//保存成功回调函数
    const rules = reactive({
        sid:{required: true, message: "学生必填", trigger: "blur"},
        cid:{required: true, message: "课程必填", trigger: "blur"},
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
            let {success,message} = await Http.post(`/score/save`, form.value);
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

