<template>
  <MainTop>
    <template #title>{{ pageTitle }}</template>
    <template #button>
      <el-button type="primary" @click="goPhase" text>返回列表</el-button>
    </template>
  </MainTop>
  <div>
    <el-form :model="form" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item label="期号名" prop="title">
        <el-input v-model="form.title" style="width:300px;" />
      </el-form-item>
      <el-form-item label="段位">
        <el-select v-model="form.level" placeholder="选择段位">
          <el-option label="登峰" value="登峰" />
          <el-option label="噬峰" value="噬峰" />
          <el-option label="狂影" value="狂影" />
          <el-option label="青狼" value="青狼" />
          <el-option label="枭羽" value="枭羽" />
        </el-select>
      </el-form-item>
      <el-form-item label="本期时间">
        <el-date-picker v-model="form.beginDate" type="date" placeholder="开始时间" style="width: 240px" />
        <span> - </span>
        <el-date-picker v-model="form.endDate" placeholder="结束时间" style="width: 240px" />
      </el-form-item>
      <el-form-item label="当前阶段">
        <el-select placeholder="当前阶段" v-model="form.stage">
          <el-option label="准备" :value="0" />
          <el-option label="第一阶段" :value="1" />
          <el-option label="第二阶段" :value="2" />
          <el-option label="第三阶段" :value="3" />
          <el-option label="第四阶段" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio :label="0" checked >未开始</el-radio>
          <el-radio :label="1" >进行中</el-radio>
          <el-radio :label="2" >已结束</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-divider />
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)" style="width:168px">{{ buttonTitle }}</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  name: 'EditPhase'
}
</script>
<script setup>
import axios from 'axios'
import { reactive,ref,onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import MainTop from '@/components/MainTop.vue'
const router = useRouter()
const route = useRoute()

const level = ref(0)
let pageTitle = route.name === 'createphase' ? '添加期号' : '编辑期号'
let buttonTitle = route.name === 'createphase' ? '创建' : '提交'

const formRef = ref()

const rules = reactive ({
  title: [
    { required: true, message: '请输入期号名', trigger: 'blur' },
    { min: 3, max: 50, message: '长度 3 to 50', trigger: 'blur' },
  ], 
  // beginDate: [
  //   {
  //     type: 'date',
  //     required: true,
  //     message: '请选择开始时间',
  //     trigger: 'change',
  //   },
  // ],
  // endDate: [
  //   {
  //     type: 'date',
  //     required: true,
  //     message: '请选择结束时间',
  //     trigger: 'change',
  //   },
  // ],
})

const goPhase = () => {
  router.push("/")
}
const initForm = {
  title: '',
  level: '登峰',
  beginDate: '',
  endDate: '',
  stage: 0,   //阶段 0-4
  status: 0,  // 0:准备 1：
}
let data = reactive({form: {...initForm}})
const form = data.form

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (route.name === 'createphase'){
        createPhase(form)
      }else{
        editPhase(form)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const createPhase = (phase) =>{
  axios.post('/api/createPhase', phase)
    .then(function ({data}) {
      //console.log(data);
      if (data.status === 0){
        ElNotification({
          title: '提示',
          message: '添加成功',
          type: 'success',
          duration: 2000,
        })
        router.push('/phase')
      }
    }).catch(err => {
      console.log(err);
    })
}
const editPhase = (phase) => {
  axios.post('/api/editPhase', phase)
    .then(function ({ data }) {
      //console.log(data);
      if (data.status === 0) {
        ElNotification({
          title: '提示',
          message: '修改成功',
          type: 'success',
          duration: 2000,
        })
      }
    }).catch(err => {
      console.log(err);
    })
}

const resetForm = () => {
  formRef.value.resetFields()
}

onMounted(() => {
  console.log(route.name);
  if (route.name === 'editphase'){
    //console.log(route.query.id);
    axios({ url: '/api/getPhaseInfoById', params: {id: route.query.id}})
      .then(function ({ data }) {
        console.log(data);
        if (data.status === 0) {
          Object.keys(data.data).forEach((item) => {
            form[item] = data.data[item]
          })
        }
      }).catch(err => {
        console.log(err);
      })
  }
})



</script>

<style scoped>

</style>