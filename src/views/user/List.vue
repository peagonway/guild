<template>
  <MainTop>
    <template #title>会员管理</template>
    <template #button>
      <span>
        <span class="f14 mr10">共有{{ page.total }}名会员</span>
        <el-divider direction="vertical"></el-divider>
        <el-button type="success" @click="goCreateUser">添加会员</el-button>
      </span>
    </template>
  </MainTop>
  <div class="content">
    <el-table :data="user.tableData" style="width: 100%; margin-bottom:12px;">
      <el-table-column type="index" width="50" />
      <el-table-column prop="name" label="游戏名" width="240" />
      <el-table-column prop="joinTime" label="加入时间" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作" width="280">
        <template #default="{row:{_id}}">
          <el-button size="small" type="primary" plain @click="goEditUser(_id)">编辑</el-button>
          <el-popconfirm title="确认删除吗?" @confirm="deleteUser(_id)">
            <template #reference>
              <el-button size="small" type="warning" plain>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    
  </div>

</template>


<script setup>
import axios from 'axios'
import dayjs from 'dayjs'
import { ElNotification } from 'element-plus'
import {reactive, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import MainTop from '@/components/MainTop.vue'

const page = reactive({
  current: 0,
  size: 50,
  number: 10,
  total: 0
})

const router = useRouter()
const user = reactive({ tableData: []})

const goCreateUser = () => {
  router.push("/adduser")
}

const goEditUser = (id) => {
  router.push("/edituser?id="+id)
}

const getUserList = () => {
  axios.get('/api/getUserList').then(({ data: req }) => {
    if (req.status === 0) {
      //data.data.beginDate = dayjs(data.data.beginDate).format("YYYY-MM-DD")
      req.data.forEach((item) => {
        console.log(req);
        item.joinTime = dayjs(item.joinTime).format("YYYY-MM-DD")
        item.status = item.status === 0 ? '正常' : '已删除'
      })
      page.total = req.data.length
      user.tableData = [...req.data]
    }
  })
}

const deleteUser = (id) => {
  axios.post('/api/deleteUser', { id: id })
    .then(function ({ data }) {
      if (data.status === 0) {
        ElNotification({
          title: '提示',
          message: '删除成功',
          type: 'success',
          duration: 2000,
        })
        getUserList()
      }

    }).catch(err => {
      console.log(err);
    })
}
onMounted(() => {
  getUserList()
}) 

</script>
<script>
export default {
  name: 'UserList'
}
</script>
<style scoped>
.content {
  padding: 10px;
}
</style>