<template>
  <el-form label-position="left" label-width="100px" ref="formRef" :model="form" style="max-width: 600px" :rules="rules">
    <el-form-item label="用户名" prop="username">
      <el-input maxlength="20" v-model="form.username" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input maxlength="20" v-model="form.password" />
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input maxlength="18" v-model="form.name" />
    </el-form-item>
    <el-form-item label="头像" prop="avatarFile">
      <x-uploader :count="1" v-model="avatarFile"></x-uploader>
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <el-select filterable v-model="form.gender" clearable placeholder="Select">
      <el-option v-for="item in genderOptionList" :key="item.name" :label="item.name" :value="item.name"/>
      </el-select>
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input v-model.number="form.age" type="number"/>
    </el-form-item>
    <el-form-item label="电话" prop="tele">
      <el-input maxlength="11" v-model="form.tele" />
    </el-form-item>
    <el-form-item label="籍贯" prop="place">
      <el-input maxlength="255" v-model="form.place" />
    </el-form-item>
    <el-form-item label="入学时间" prop="ruxsj">
      <el-date-picker value-format="YYYY-MM-DD HH:mm:ss" v-model="form.ruxsj" type="datetime" placeholder="选择时间" :shortcuts="shortcuts"/>
    </el-form-item>
    <el-form-item label="学号" prop="numb">
      <el-input maxlength="32" v-model="form.numb" />
    </el-form-item>
    <el-form-item label="班级" prop="clazzid">
      <x-select-table
        :header="[{label:'班级',field:'name',width:'100%'}]"
        v-model="form.clazzid"
        :queryParams="[{name:'name',label:'班级'}/*,{name:'state',label:'状态',defaultValue:'上架',type:'hide'}*/]"
        api="/clazz/list"
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
        username : '',
        password : '',
        name : '',
        avatar : '',
        gender : '',
        age : '',
        tele : '',
        place : '',
        ruxsj : '',
        numb : '',
        clazzid : '',
    });
    let callBack;//保存成功回调函数
    const rules = reactive({
        username:{required: true, message: "用户名必填", trigger: "blur"},
        name:{required: true, message: "姓名必填", trigger: "blur"},
        numb:{required: true, message: "学号必填", trigger: "blur"},
    })

     let genderOptionList = ref([  { name:'男'}, { name:'女'}, ]) //性别 下拉框数据
    //初始化
    const render = (loadThisPage,params) => {
      callBack = loadThisPage
      if(params){
        //将params的所有属性拷贝给form.value
        Object.assign(form.value,params)
      }
    }

    const avatarFile = ref([]) //头像

    //提交
    const submit = async () => {
    //文件：头像
    form.value.avatar = avatarFile.value.length>0 ? avatarFile.value[0].fileId : ''

        await formRef.value.validate(async (isValid, invalidFields) => {
            if(! isValid) {
                Msg.error(Helper.getFirstMessage(invalidFields));
                return;
            }
            let {success,message} = await Http.post(`/student/save`, form.value);
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

