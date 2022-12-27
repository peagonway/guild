<template>
  <MainTop>
    <template #title>{{ pageTitle }}</template>
    <template #button>
      <el-button type="primary" @click="goList" text>返回列表</el-button>
    </template>
  </MainTop>
  <div>
    <el-form :model="user" label-width="120px" ref="formRef" :rules="rules">
      <el-form-item label="游戏名" prop="name">
        <el-input v-model="user.name" style="width:300px;" />
      </el-form-item>
      <el-form-item label="职务">
        <el-select placeholder="当前阶段" v-model="user.title">
          <el-option label="普通会员" value="普通会员" />
          <el-option label="会长" value="会长" />
          <el-option label="副会长" value="副会长" />
        </el-select>

      </el-form-item>
      
      <el-form-item label="排序">
        <el-input v-model="user.sort" style="width:100px;" />
      </el-form-item>
      <el-form-item label="加入时间">
        <el-date-picker v-model="user.joinTime" type="date" placeholder="加入时间" style="width: 240px" />
      
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="user.status">
          <el-radio :label="0" checked>正常</el-radio>
          <el-radio :label="1">已删除</el-radio>
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
  name: 'AddUser'
}
</script>
<script setup>
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MainTop from '@/components/MainTop.vue'

const router = useRouter()
const route = useRoute()
const formRef = ref()

const pageTitle = route.name === 'adduser' ? '添加会员' : '编辑会员信息'
const buttonTitle = route.name === 'adduser' ? '创建' : '提交'

const rules = reactive({
  name: [
    { required: true, message: '请输入会员名', trigger: 'blur' },
    { min: 2, max: 50, message: '长度 2 to 50', trigger: 'blur' },
  ],
})

const data = reactive({
  user: {
    name: '',
    joinTime: Date.now(),
    title: '普通会员',  // 职位
    sort: 0,
    status: 0,
    sort: 0,
  }
})
const user = data.user


const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (route.name === 'adduser') {
        adduser(user)
      } else {
        editUser(user)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const adduser = (user) => { 
  axios.post('/api/addUser', user)
    .then(function ({ data }) {
      
      if (data.status === 0) {
        ElNotification({
          title: '提示',
          message: '添加成功',
          type: 'success',
          duration: 2000,
        })
        router.push('/userlist')
      }
    }).catch(err => {
      console.log(err);
    })
}
const editUser = (user) => { 
  axios.post('/api/editUser', user)
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

const goList = () => {
  router.push("/userlist")
}

onMounted(() => { 
  if (route.name === 'edituser') {
    //console.log(route.query.id);
    axios({ url: '/api/getUserInfoById', params: { id: route.query.id } })
      .then(function ({ data:req }) {
        if (req.status === 0) {
          Object.keys(req.data).forEach(key => {
            user[key] = req.data[key]
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