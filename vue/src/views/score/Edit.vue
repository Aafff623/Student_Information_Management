<template>
  <el-form label-position="left" label-width="100px" ref="formRef" :model="form" style="max-width: 600px" :rules="rules">
    <el-form-item label="学生" prop="sid">
      <x-select-table
        disabled :header="[{label:'学生',field:'name',width:'100%'}]"
        v-model="form.sid"
        :queryParams="[{name:'name',label:'学生'}]"
        api="/student/list"
        labelField="name"
        valueField="id"
      ></x-select-table>
    </el-form-item>
    <el-form-item label="课程" prop="cid">
      <x-select-table
        disabled :header="[{label:'课程',field:'name',width:'100%'}]"
        v-model="form.cid"
        :queryParams="[{name:'name',label:'课程'}]"
        api="/course/list"
        labelField="name"
        valueField="id"
      ></x-select-table>
    </el-form-item>
    <el-form-item label="创建时间" prop="createtime">
      <el-date-picker disabled value-format="YYYY-MM-DD HH:mm:ss" v-model="form.createtime" type="datetime" placeholder="选择时间" :shortcuts="shortcuts"/>
    </el-form-item>
    <el-form-item label="分数" prop="score">
      <el-input maxlength="255" v-model.number="form.score" type="number"/>
    </el-form-item>
  </el-form>
</template>
<script setup>
    import {  reactive, ref } from 'vue'
    const formRef = ref();
    let user = Cache.getUser()//当前登录用户
    let form = ref({});
    let callBack;//保存成功回调函数
    const rules = reactive({
        sid:{required: true, message: "学生必填", trigger: "blur"},
        cid:{required: true, message: "课程必填", trigger: "blur"},
        createtime:{required: true, message: "创建时间必填", trigger: "blur"},
    })


    const render = async (id,loadThisPage) => {
        Msg.loading("加载中..")
        let {data} = await Http.get(`/score/detail`, {id: id});
        form.value = data
        callBack = loadThisPage
        Msg.loading(false)
    }
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
            callBack(form.value)

            if(user.id === form.value.id){//用户修改自己的信息后刷新
              window.location.reload();
            }
        });
    }

    defineExpose({render,submit});

</script>

