<template>
  <x-main>
  <!--搜索查询表单-->
  <el-row class="search-row">
    <div class="search-item">
      <span>用户名</span>
      <div style="width: 150px">
        <el-input clearable placeholder="请输入用户名" v-model="searchForm.username" maxlength="20"/>
      </div>
    </div>
    <div class="search-item">
      <span>姓名</span>
      <div style="width: 150px">
        <el-input clearable placeholder="请输入姓名" v-model="searchForm.name" maxlength="18"/>
      </div>
    </div>
    <div class="search-item">
      <span>性别</span>
      <div style="width: 150px">
        <el-select filterable v-model="searchForm.gender" clearable placeholder="请选择">
        <el-option v-for="item in genderOptionList" :key="item.name" :label="item.name" :value="item.name"/>
        </el-select>
      </div>
    </div>
    <div class="search-item">
      <span>学号</span>
      <div style="width: 150px">
        <el-input clearable placeholder="请输入学号" v-model="searchForm.numb" maxlength="32"/>
      </div>
    </div>
    <div v-if="user.role!=='clazz'" class="search-item">
      <span>班级</span>
      <div style="width: 150px">
        <x-select-table :header="[{label:'班级',field:'name',width:'100%'}]"
          v-model="searchForm.clazzid"
          :queryParams="[{name:'name',label:'班级'}]"
          api="/clazz/list"
          labelField="name"
          valueField="id"
        ></x-select-table>
      </div>
    </div>
    
    <button class="x-btn x-btn-m" type="primary" @click="loadThisPage">查询</button>
    <button class="x-btn x-btn-success x-btn-m" v-if="user && ( user.role.toLowerCase() == 'admin'   )" @click="onAdd">新增</button>
    
  </el-row>
  <!--搜索查询表单 end-->
  
  <div class="statistic-info" v-if="pager.statisticInfo">
    {{pager.statisticInfo}}
  </div>
  
  <!--数据表-->
  <el-table :data="pager.records" style="width: 100%">
    <el-table-column label="用户名">
      <template #default="scope">
        <span >{{scope.row.username}}</span>
      </template>
    </el-table-column>
    <el-table-column label="姓名">
      <template #default="scope">
        <span >{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column label="头像">
      <template #default="scope">
        <el-tooltip class="box-item" effect="dark" :content="scope.row.avatar" placement="top-start">
        <x-file-view :disabled="true" :list="scope.row.avatar"></x-file-view>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="性别">
      <template #default="scope">
        <span >{{scope.row.gender}}</span>
      </template>
    </el-table-column>
    <el-table-column label="年龄">
      <template #default="scope">
        <span >{{scope.row.age}}</span>
      </template>
    </el-table-column>
    <el-table-column label="电话">
      <template #default="scope">
        <span >{{scope.row.tele}}</span>
      </template>
    </el-table-column>
    <el-table-column label="籍贯">
      <template #default="scope">
        <span >{{scope.row.place}}</span>
      </template>
    </el-table-column>
    <el-table-column sortable label="入学时间">
      <template #default="scope">
        <el-icon><timer/></el-icon><span>{{scope.row.ruxsj}}</span>
      </template>
    </el-table-column>
    <el-table-column label="学号">
      <template #default="scope">
        <span >{{scope.row.numb}}</span>
      </template>
    </el-table-column>
    <el-table-column label="班级">
      <template #default="scope">
        <el-button link v-if="scope.row.clazzidFrn" type="primary" text bg @click="clazzidDetail(scope.row.clazzid)">{{ scope.row.clazzidFrn.name }}</el-button>
      </template>
    </el-table-column>
    
    <el-table-column fixed="right" label="操作">
      <template #default="scope">
        <button class="x-btn" @click="onDetail(scope.row.id)">详情</button>
        <button class="x-btn x-btn-warn" v-if=" user.role.toLowerCase() == 'admin'  " @click="onEdit(scope.row.id)">编辑</button>
        <button class="x-btn x-btn-error" v-if="  user.role.toLowerCase() == 'admin'  " @click="onDelete(scope.row.id)">删除</button>
        
        <!-- <button v-if="user.role.toLowerCase() == 'user' && scope.row.state == '待缴纳'" -->
        <!-- class="x-btn" @click="ups(scope.row.id,'确认支付','state','已缴纳')">立即支付</button>-->
      </template>
    </el-table-column>
  </el-table>
  
  <el-pagination
  v-model:current-page="pager.current"
  v-model:page-size="pager.size"
  background
  :page-sizes="[5, 10, 15, 20,50]"
  layout="total,sizes, prev, pager, next, jumper"
  :total="pager.total"
  @size-change="loadThisPage"
  @current-change="loadThisPage"
  />
  </x-main>
</template>

<script setup name="student">
    let conf = codeying
    import {Helper} from "core";
    let user = Cache.getUser()//当前登录用户
    import {Timer,ChatDotSquare,Delete,Edit,InfoFilled} from '@element-plus/icons-vue'
    import {onMounted} from "vue";
    //搜索条件表单
    let searchForm = ref({
            username : "",
            name : "",
            gender : "",
            numb : "",
            clazzid : "",
    })
    //分页信息 默认查询第一页，20条数据
    let pager = ref({current: 1, size: 20})

    let genderOptionList = ref([  { name:'男'}, { name:'女'}, ]) //性别 下拉框数据
    //钩子函数，挂载
    onMounted(() => {
        loadThisPage()
    })

    //加载本页数据
    const loadThisPage = async () => {
        Msg.loading("加载中...")
        //表单查询参数和分页参数
        let params = Object.assign(searchForm.value, {
            current: pager.value.current,
            size: pager.value.size
        });
        let {data,message} = await Http.get(`/student/list`, params);
        console.log("查询条件")
        console.log(params)
        console.log("查询结果")
        console.log(data)
        if (data) {
            pager.value = data
        }else {
            Msg.error(message);
        }
        Msg.loading(false)
    }
    import DetailPage from "./Detail"
    //详情页
    const onDetail = async (id) => {
        const op = Dialog.open(DetailPage, '详情').setCancelText('').setConfirmText('')
        op.mounted(c => {
            c.render(id)
        })
    }
    import EditPage from "./Edit"
    //编辑页
    const onEdit = async (id) => {
        const op = Dialog.open(EditPage, `编辑`).setConfirmText('确认')
        op.mounted(c => {
            c.render(id, loadThisPage)
        })
        op.confirm(async (c) => {
            c.submit()
        })
    }
    //列表页更新数据通用方法
    const ups = async (id, msg, field, value) => {
      const op = Msg.confirm(msg)
      op.then(async () => {
        let upsForm = {id: id, [field]: value}
        let {success, message} = await Http.post(`/student/save`, upsForm);
        if (!success) {
          Msg.error(message);
        }else{
          Msg.success(message);
          await loadThisPage()
        }
      })
    }
    import AddPage from "./Add"
    //新增页
    const onAdd = async () => {
        const op = Dialog.open(AddPage, `新增`).setConfirmText('保存')
        op.mounted(c => {
            c.render(loadThisPage)
        })
        op.confirm(async (c) => {
            c.submit()
        })
    }
    //删除
    const onDelete = async (id) => {
        const op = Msg.confirm('确定删除？')
        op.then(async () => {
            let {success, message} = await Http.post(`/student/delete?id=` + id);
            if (!success) {
                Msg.error(message);
            } else {
                Msg.success(message);
                await loadThisPage()
            }
        })
    }

     //班级详情页
    import clazzidDetailPage from "../clazz/Detail";
    const clazzidDetail = async (id)=> {
        const op = Dialog.open(clazzidDetailPage, '详情').setCancelText('').setConfirmText('')
        op.mounted(c => {
            c.render(id)
        })
    }



</script>


<style>
    /*分页右对齐*/
    .el-pagination {
        float: right;
    }
    .el-form--inline .el-form-item{
        margin-right: 0!important;
    }
    .search-row{
        display: flex;
        margin-bottom: 10px;
    }
    .search-item{
        display: flex;
    }
    .search-item span{
        white-space: nowrap;
        line-height: 32px;
        margin: 0 5px;
    }
</style>

