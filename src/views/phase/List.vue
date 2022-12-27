<template>
  <MainTop>
    <template #title>期号列表</template>
    <template #button>
      <el-button type="success" @click="goCreatePhase">添加新期</el-button>
    </template>
  </MainTop>
  <div class="content">
    <el-table :data="phase.tableData" style="width: 100%; margin-bottom:12px;">
      <el-table-column prop="title" label="期名" width="240" />
      <el-table-column prop="stage" label="当前阶段"  width="80" />
      <el-table-column prop="beginDate" label="开始日期"  />
      <el-table-column prop="endDate" label="结束日期"  />
      <el-table-column prop="level" label="级别" width="80" />
      <el-table-column prop="status" label="状态" width="80" />
      <el-table-column label="操作"  width="280">
        <template #default="{row:{_id}}">
          <el-button size="small" type="primary" plain @click="goScore(_id)">积分管理</el-button>
          <el-button size="small" @click="goEditPhase(_id)">编辑</el-button>
          <el-popconfirm title="确认删除吗?" @confirm="deletePhase(_id)">
            <template #reference>
              <el-button size="small" type="warning" plain >删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- <el-pagination background layout="prev, pager, next" :total="1000" /> -->
  </div>
  
</template>


<script setup>
import axios from 'axios'
import dayjs from 'dayjs'
import { ElNotification } from 'element-plus'
import {reactive, onMounted} from 'vue'
import { useRouter } from 'vue-router'

import MainTop from '@/components/MainTop.vue'
const router = useRouter()

const phase = reactive({
  tableData:   []
})


const getPhaseData = () => {
  axios.get('/api/getPhaselist').then(({data:req})=> {
    if (req.status === 0) {
      //data.data.beginDate = dayjs(data.data.beginDate).format("YYYY-MM-DD")
      req.data.forEach((item) => {
        item.beginDate = dayjs(item.beginDate).format("YYYY-MM-DD")
        item.endDate = dayjs(item.endDate).format("YYYY-MM-DD")
        item.stage = item.stage === 0 ? '准备中' : `第${item.stage}阶段`
        item.status = item.status === 0 ? '未开始' : item.status === 1 ? '进行中' : '已结束'
      } )
      phase.tableData = [...req.data]
    }
  })
}

const goCreatePhase = () => {
  router.push("/createphase")
}

const goEditPhase = (id) => {
  //console.log(id);
  router.push("/editphase?id="+id)
}

const deletePhase = (id) => {
  axios.post('/api/deletePhase', {id: id})
    .then(function ({ data }) {
      if (data.status === 0) {
        ElNotification({
          title: '提示',
          message: '删除成功',
          type: 'success',
          duration: 2000,
        })
        getPhaseData()
      }
      
    }).catch(err => {
      console.log(err);
    })
}

const goScore = (id) => {
  router.push("/score?id="+id)
}

onMounted(() => {
  getPhaseData()
})


</script>
<script>
export default {
  name: 'PhaseList'
}
</script>
<style scoped>


.content{
  padding:10px;
}
</style>