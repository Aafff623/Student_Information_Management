<template>
  <el-form
    label-position="left"
    label-width="100px"
    :model="form"
    style="max-width: 600px"
    >
    <el-form-item label="学生">
      <el-button link v-if="form.sidFrn" type="primary" text bg @click="sidDetail(form.sid)">{{ form.sidFrn.name }}</el-button>
    </el-form-item>
    <el-form-item label="课程">
      <el-button link v-if="form.cidFrn" type="primary" text bg @click="cidDetail(form.cid)">{{ form.cidFrn.name }}</el-button>
    </el-form-item>
    <el-form-item label="创建时间">
      <el-text>{{form.createtime}}</el-text>
    </el-form-item>
    <el-form-item label="分数">
      <el-text>{{form.score}}</el-text>
    </el-form-item>
  </el-form>
  
  
</template>
<script setup>
    let commentRef = ref(null)
    let form = ref({ sidFrn:null,cidFrn:null, });

    const render = async (id) => {
        Msg.loading("loading...")
        let {data} = await Http.get(`/score/detail`, {id});
        console.log(data)
        form.value = data;
        Msg.loading(false)
    }

     //学生详情页
    import sidDetailPage from "../student/Detail";
    const sidDetail = async (id)=> {
        const op = Dialog.open(sidDetailPage, '详情').setCancelText('').setConfirmText('')
        op.mounted(c => {
            c.render(id)
        })
    }
     //课程详情页
    import cidDetailPage from "../course/Detail";
    const cidDetail = async (id)=> {
        const op = Dialog.open(cidDetailPage, '详情').setCancelText('').setConfirmText('')
        op.mounted(c => {
            c.render(id)
        })
    }

    defineExpose({render});

</script>

