<template>
	<el-select clearable v-model="curValue" placeholder="请选择" :multiple="multiple" :multiple-limit="limitCount" :filterable="!multiple" :filter-method="loadThisPage">
		<!--	已选中	-->
		<el-option v-if="! $emptyArray(selected)" v-for="item in selected"
				   :key="item[valueField]"
				   :label="item[labelField]"
				   :value="item[valueField]">
			<div style="width: 100%;">
				<div class="select-tb" v-for="head in props.header" :style="'width:'+head.width ">
					<el-text class="w100p" truncated :title="item[head.field]">
						{{ item[head.field] }}
					</el-text>
				</div>
			</div>
		</el-option>
		<!--	未选中	-->
		<template v-if="! $emptyArray(list)" v-for="item in list">
			<el-option v-if="props.multiple ? curValue.indexOf(item[valueField]) === -1 : item[valueField] !== curValue"
					   :key="item[valueField]"
					   :label="item[labelField]"
					   :value="item[valueField]">
				<div style="width: 100%;">
					<div class="select-tb" v-for="head in props.header" :style="'width:'+head.width ">
						<el-text class="w100p" truncated :title="item[head.field]">
							{{ item[head.field] }}
						</el-text>
					</div>
				</div>
			</el-option>
		</template>

		<template #header>
			<!--搜索查询表单-->
			<el-form :model="searchForm" class="demo-form-inline x-row">
				<el-row>
					<el-col :span="24">
						<el-row>
							<template v-for="parm in props.queryParams">
								<el-col v-if="!parm.type || parm.type!=='hide'" :span="props.queryParams.length>4?6:12" >
									<el-form-item :label="parm.label">
										<el-input v-if="!parm.type || parm.type==='text'" size="small" v-model="searchForm[parm.name]" @keyup.enter="loadThisPage"/>
										<el-date-picker v-if="parm.type==='datetime'" size="small" v-model="searchForm[parm.name]" value-format="YYYY-MM-DD HH:mm:ss" type="date" @keyup.enter="loadThisPage"></el-date-picker>
										<el-date-picker v-if="parm.type==='date'" size="small" v-model="searchForm[parm.name]" value-format="YYYY-MM-DD" type="date" @keyup.enter="loadThisPage"></el-date-picker>
									</el-form-item>
								</el-col>
							</template>
							<el-col v-if="props.queryParams.length>0" :span="3">
								<el-button style="margin-left: 15px" class="x-mt-4" size="small" type="primary" @click="loadThisPage">查询</el-button>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</el-form>

			<!--            表头-->
			<div>
				<div class="select-tb select-th" v-for="head in header" :style="'width:'+head.width "> {{ head.label }}</div>
			</div>
		</template>

		<template v-if="props.isPage" #footer>
			<div class="x-row-reverse">
				<el-pagination
						small
						v-model:current-page="pager.current"
						v-model:page-size="pager.size"
						background
						:pager-count="5"
						:page-sizes="[10, 15, 20]"
						layout="total, prev, pager, next"
						:total="pager.total"
						@size-change="loadThisPage"
						@current-change="loadThisPage"/>
			</div>
		</template>
	</el-select>
</template>

<script setup name="x-select-table">
	import {onMounted} from "vue";
	import {Search} from '@element-plus/icons-vue'

	const emit = defineEmits(['update:modelValue', 'change'])
	let props = defineProps({
		modelValue: {
			type: [String, Number, Array]
		},
		header: {
			type: Array,
			default: [],
		},
		queryParams: { //查询条件． [{name:'name',label:'姓名'},]  目前只有输入框
			type: Array,
			default: [],
		},
		api: {  //请求地址
			type: String,
			default: '',
		},
		labelField: {  //选中标签Field
			type: String,
			default: 'label',
		},
		valueField: {  //值对应Field
			type: String,
			default: 'value',
		},
		multiple: {
			type: Boolean,
			default: false,
		},
		isPage: {
			type: Boolean,
			default: true
		},
		isLoadSelected: {
			type: Boolean,
			default: true
		},
		changeFunction: {
			type: Function,
			default: (e) => {
			},
		},
		alwaysUpperCase:{
			type: Boolean,
			default: false
		},
		limitCount: {
			type: Number,
			default: 0 //限制多选个数
		},
	})
	let source = ref([]);
	let list = ref([]);
	let selected = ref([]);
	let curValue = ref({})
	let isInit = false;

	//搜索条件表单
	let searchForm = ref({})

	onMounted(async () => {

		//默认查询条件
		for (let i = 0; i < props.queryParams.length; i++) {
			let param = props.queryParams[i];
			if(param.defaultValue){
				searchForm.value[param.name] = param.defaultValue
			}
		}

		if (!props.isPage) {
			pager.value.size = 99999; //一个基本达不到的数量
		}
		await loadThisPage()
		//分页情况要先查出已选中项目的信息否则无法显示
		if (props.isPage && props.isLoadSelected) {
			if (props.multiple && !Helper.emptyArray(curValue.value)) {
				await loadSelected();
			}
			if (!props.multiple && curValue.value) {
				await loadSelected();
			}
		}
		isInit = true;
	})

	//分页信息
	let pager = ref({current: 1, size: 10, records: [], total: 0})

	//加载选中数据
	const loadSelected = async () => {
		// console.log("loadSelected")
		//查询选中数据是否已经在source中存在
		if (isArrContainsAllValues(source.value, curValue.value)) {
			return;
		}
		//表单查询参数和分页参数
		let query = {};
		// 改造，去查询已经选中的值(这里props.valueField 可能是id，而且只有一个)
		query[props.valueField] = curValue.value;
		let params = Object.assign(query, {
			current: 1,
			size: 99999 //一个基本达不到的数量
		});

		//请求服务器数据
		let {success, message, data} = await Http.get(props.api, params);

		if (data) {
			source.value = mergeAndRemoveDuplicates(source.value, data.records)
			handlerValue(curValue.value)
		}
		// console.log("source", source.value)
	}

	//加载本页数据
	let timeHandler = -1;
	const loadThisPage = async (query) => {
		clearTimeout(timeHandler);
		// ？以第一个查询条件为默认查询条件
		if (typeof query === "string" && props.queryParams.length > 0){
			let queryCode = props.queryParams[0].name;
			if (props.alwaysUpperCase){
				searchForm.value[queryCode] = query.toUpperCase();
			}else{
				searchForm.value[queryCode] = query;
			}
		}
		timeHandler = setTimeout(async () => {
			//表单查询参数和分页参数
			let params = Object.assign(searchForm.value, {
				current: pager.value.current,
				size: pager.value.size
			});

			//请求服务器数据
			let {success, message, data} = await Http.get(props.api, params);

			if (data) {
				pager.value = data
				source.value = mergeAndRemoveDuplicates(source.value, data.records)
				list.value = data.records;
				handlerValue(curValue.value)
			} else {
				Msg.error("下拉框数据获取失败");
			}
		}, 100);
	}

	/**
	 * 处理数据
	 */
	const handlerValue = (value) => {
		// console.log("handlerValue", value)
		selected.value = []; //初始化selected
		if (props.multiple) {
			//从list中选取跟value值对应的项
			//这种方法不会记录改变的顺序
			//selected.value = source.value.filter((x) => value.includes(x[props.valueField]))
			//这种方法会根据选择顺序显示
			for (let i = 0; i < value.length; i++) {
				let rows = source.value.filter((x) => x[props.valueField] === value[i])
				if (rows.length > 0) {
					selected.value.push(rows[0])
				}
			}
		} else {
			selected.value = source.value.filter((x) => x[props.valueField] === value)
		}
		//去除跟selected重复的选项
		//list.value = list.value.filter((x) => !selected.value.includes(x));
		// console.log("selected", selected.value)
	}

	/* ---------- 监听 ---------- */

	watch(() => props.modelValue, async (value) => {
		// console.log("modelValue change", value, isInit)
		curValue.value = value;
		if (props.isPage && props.isLoadSelected) {
			if (props.multiple && !Helper.emptyArray(curValue.value)) {
				await loadSelected();
			}
			if (!props.multiple && curValue.value) {
				await loadSelected();
			}
		}
	}, {immediate: true, deep: true})

	watch(() => curValue.value, (data, oldData) => {
		// console.log("curValue change", data)
		emit('update:modelValue', data);
		handlerValue(data);
		if (isInit) {
			emit("change", data, oldData, selected.value);
		}
	})

	/* ---------- 工具 ---------- */

	function mergeAndRemoveDuplicates(array1, array2) {
		let tempArray = [];
		for (let i = 0; i < array2.length; i++) {
			let isExist = false;
			for (let j = 0; j < array1.length; j++) {
				if (array1[j][props.valueField] === array2[i][props.valueField]) {
					isExist = true;
				}
			}
			if (!isExist) {
				tempArray.push(array2[i]);
			}
		}
		return array1.concat(tempArray);
	}

	function isArrContainsAllValues(array, values) {
		let containsAll = true;

		if (props.multiple) {
			for (let i = 0; i < values.length; i++) {
				let isExist = false;
				for (let j = 0; j < array.length; j++) {
					if (array[j][props.valueField] === values[i]) {
						isExist = true;
					}
				}
				if (!isExist) {
					containsAll = false;
				}
			}
		} else {
			containsAll = false;
			for (let i = 0; i < array.length; i++) {
				if (array[i][props.valueField] === values) {
					containsAll = true;
				}
			}
		}

		return containsAll;
	}

	/**
	 * 新增选项
	 */
	const addOption = (row) => {
		let flag = false;
		for (let i = 0; i < pager.value.records.length; i++) {
			if (pager.value.records[i][props.valueField] === row[props.valueField]) {
				flag = true;//已经有了选中项目
				break;
			}
		}
		if (!flag) {
			pager.value.records.splice(0, 0, row)
		}
	}

  //设置查询的默认值
  const setQueryValue = (name,value)=>{
    searchForm.value[name] = value;
  }

  defineExpose({
    addOption,loadThisPage,setQueryValue
  })
  /**
   * 使用场景：
   *  roomTable.value.setQueryValue('stuId',form.value.hid)
   *   roomTable.value.loadThisPage
   */

</script>

<style scoped lang="less">

	.select-tb {
		display: inline-block;
		text-align: center;
		padding: 0 5px;
		box-sizing: border-box;
	}

	.select-tb .el-text {
		font-size: 14px;
	}

	.select-th {
		font-size: 0.8rem;
		font-weight: 600;
	}

	:global(.el-select-dropdown__wrap) {
		padding: 0 10px;
		max-height: 390px;
	}

	:global(.el-select-dropdown__item) {
		padding: 0;
	}

	:global(.el-select-dropdown__item.is-selected .el-text) {
		color: #409eff;
	}

	:global(.el-form-item__label) {
		width: 100px;
	}
	.el-form-item{
		margin-bottom: 0!important;
	}
</style>
