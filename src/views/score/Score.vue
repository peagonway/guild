<template>

  <div class="content">

    <div class="flex-between-center score-top p10">
      <h2>{{ data.phaseInfo.title }}</h2>
      <div class="f12">
        <span class="mr10">
          本期时间：{{ filterDate(data.phaseInfo.beginDate) }} -- {{ filterDate(data.phaseInfo.endDate) }}
        </span>
        <el-divider direction="vertical"></el-divider>
        <span class="mr10">当前阶段：{{ data.phaseInfo.stage === 0 ? '准备中' : '第' + data.phaseInfo.stage + '阶段' }}</span>
        <el-divider direction="vertical"></el-divider>
        <button size="small" style="width:20px; margin-right:6px" @click="sortBy('s1')">1</button> 
        <button size="small" style="width:20px; margin-right:6px" @click="sortBy('s2')">2</button> 
        <button size="small" style="width:20px; margin-right:6px" @click="sortBy('s3')">3</button> 
        <button size="small" style="width:20px; margin-right:6px" @click="sortBy('s4')">4</button>
        <button size="small" style="width:20px; margin-right:6px" @click="sortBy('total')">T</button>
      </div>
    </div>
    <div class="loading p10" v-if="loading">
      loading...
    </div>
    <el-table :data="data.tableData" show-summary sum-text="合计" style="width:960px; margin-bottom:12px;" v-else>
      <el-table-column fixed type="index" width="60" />
      <el-table-column prop="name" label="名字" />

      <el-table-column label="第1阶段" v-if="viewType === 'edit' && data.phaseInfo.stage === 1" width="140">
        <template #default="{ row }">
          <el-input-number v-model="row.s1" @input="setStageScore(row)" :controls="false" style="width:80px" />
        </template>
      </el-table-column>
      <el-table-column label="第1阶段" prop="s1" v-else width="140" />


      <el-table-column label="第2阶段" v-if="viewType === 'edit' && data.phaseInfo.stage === 2" width="140">
        <template #default="{ row }">
          <el-input-number v-model="row.s2" @input="setStageScore(row)" :controls="false" style="width:80px" />
        </template>
      </el-table-column>
      <el-table-column label="第2阶段" prop="s2" v-else width="140" />


      <el-table-column label="第3阶段" v-if="viewType === 'edit' && data.phaseInfo.stage === 3" width="140">
        <template #default="{ row }">
          <el-input-number v-model="row.s3" @input="setStageScore(row)" :controls="false" style="width:80px" />
        </template>
      </el-table-column>
      <el-table-column label="第3阶段" prop="s3" v-else width="140" />

      <el-table-column label="第4阶段" v-if="viewType === 'edit' && data.phaseInfo.stage === 4" width="140">
        <template #default="{ row }">
          <el-input-number v-model="row.s4" @input="setStageScore(row)" :controls="false" style="width:80px" />
        </template>
      </el-table-column>
      <el-table-column label="第4阶段" prop="s4" v-else width="140" />

      <el-table-column label="合计" v-if="viewType === 'edit'">
        <template #default="{ row }">
          <el-input-number v-model="row.total" @input="setRowTotal(row)" :controls="false" style="width:80px" />
        </template>
      </el-table-column>
      <el-table-column label="合计" prop="total" v-else width="140" />

    </el-table>
    <div>
      <el-button type="primary" @click="updateScore">提交分数</el-button>
      <el-button type="danger" @click="changeViewType">
        <span v-if="viewType === 'show'">编辑分数</span>
        <span v-else>返回</span>
      </el-button>

    </div>
  </div>

  <div class="float-button-wrap">
    <div class="mb10">
      <el-button type="danger" style="width:80px;height:60px;" @click="changeViewType">
        <span v-if="viewType === 'show'">编辑分数</span>
        <span v-else>返回</span>
      </el-button>
    </div>
    <div class="mb10">
      <el-button type="primary" style="width:80px;height:60px;" @click="updateScore">提交分数</el-button>
    </div>
    <div>
      <el-button type="success" style="width:80px;height:60px;" @click="saveToImage">导出图片</el-button>
    </div>
  </div>


  <el-dialog v-model="dialogVisible" title="Tips" width="30%" :before-close="handleClose">
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

  <div class="canvas-wrap" v-if="showOutput">
    <canvas class="output" ref="outputPanel" width="900" height="2200"></canvas>
    <div class="close flex-center-center" @click="showOutput = false">
      <el-icon :size="50">
        <Close />
      </el-icon>
    </div>
  </div>

</template>

<script>
export default {
  name: ''
}
</script>
<script setup>
import axios from 'axios'
import dayjs from 'dayjs'
import { ElNotification } from 'element-plus'
import { reactive, ref,  watch, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import drawImage from './drawImage'
const router = useRouter()
const route = useRoute()

// 提交数据对话框
const dialogVisible = ref(false)

// 浏览模式
const viewType = ref('show')
const changeViewType = () => {
  if (viewType.value === 'show') viewType.value = 'edit'
  else viewType.value = 'show'
}

// 数据加载loading
const loading = ref(true)

// 状态池
const data = reactive({
  phaseInfo: {},
  tableData: []
})

// 获取当前用户列表
const getUserList = () => {
  return new Promise((resolve, reject) => {
    axios.get('/api/getUserList?status=0').then(({ data: req }) => {
      if (req.status === 0) {
        resolve(req.data)
      } else {
        reject({ msg: 'fail' })
      }
    })
  })
}

// 获取分数列表
const getScoreList = () => {
  return new Promise((resolve, reject) => {
    axios.get('/api/getScoreList?id=' + route.query.id).then(({ data: req }) => {
      if (req.status === 0) {
        resolve(req.data)
        //page.total = req.data.length
        //user.tableData = [...req.data]
      } else {
        reject({ msg: 'fail' })
      }
    })
  })
}

// 提交分数
const updateScore = () => {
  let submitData = JSON.parse(JSON.stringify(data.tableData))
  submitData.forEach((item) => { delete item.total })
  axios.post('/api/updateScore', { id: route.query.id, score: submitData }).then(({ data: req }) => {
    if (req.status === 0) {
      ElNotification({
        title: '提示',
        message: '数据提交成功',
        type: 'success',
        duration: 2000,
      })
    } else {
      ElNotification({
        title: '提示',
        message: '修改失败！',
        type: 'danger',
        duration: 2000,
      })
    }
  })
}

const sortBy = (type) => {
  data.tableData = data.tableData.sort((a, b) => b[type] - a[type])
}

const goScore = () => {
  router.push("/score")
}

const setRowTotal = (row) => {
  nextTick(() => {
    switch (data.phaseInfo.stage) {
      case 0:
        break;
      case 1:
        row.s1 = row.total - row.s2 - row.s3 - row.s4
        break;
      case 2:
        row.s2 = row.total - row.s1 - row.s3 - row.s4
        break;
      case 3:
        row.s3 = row.total - row.s1 - row.s2 - row.s4
        break;
      case 4:
        row.s4 = row.total - row.s1 - row.s2 - row.s3
        break;
      default:
        break;
    }
  })
}
const setStageScore = (row) => {
  nextTick(() => {
    row.total = row.s1 + row.s2 + row.s3 + row.s4
  })
}

// 获取期号信息
const getPhaseInfo = () => {
  axios({ url: '/api/getPhaseInfoById', params: { id: route.query.id } })
    .then(function ({ data: req }) {
      if (req.status === 0) {
        data.phaseInfo = req.data
      }
    }).catch(err => {
      console.log(err);
    })
}

const filterDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

//将当前数据导出为图片
const showOutput = ref(false)
const outputPanel = ref(null)
watch(showOutput, (nv,ov) => {
  if(nv === true) {
    document.body.style.overflowY = 'hidden'
  }else{
    document.body.style.overflowY = 'auto'
  }
})
const saveToImage = () => { 
  showOutput.value = true
  nextTick(() => {
    drawImage(data, outputPanel)
  })
}


onMounted(async () => {
  getPhaseInfo()
  let userList = await getUserList()
  let scoreList = await getScoreList()

  userList.forEach(item => {
    let scoreItem = scoreList.find(score => score.uid === item._id)
    data.tableData.push({
      uid: item._id,
      name: item.name,
      s1: scoreItem?.s1 || 0,
      s2: scoreItem?.s2 || 0,
      s3: scoreItem?.S3 || 0,
      s4: scoreItem?.S4 || 0,
    })
  })

  data.tableData.forEach(item => {
    item.total = item.s1 + item.s2 + item.s3 + item.s4
  })
  loading.value = false

})

</script>

<style scoped lang="less">
.score-top {
  border-bottom: 1px solid #ddd;
}

.content {
  padding: 10px;
}

.float-button-wrap {
  position: fixed;
  right: 0;
  bottom: 200px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  width: 80px;
  height: 200px;
}

.canvas-wrap{
  z-index: 9999;
  position: fixed; left: 0; top: 0; right: 0; bottom: 0;
  display: flex; justify-content: center;
  background: rgba(0,0,0,.8);
  overflow-y: auto;
  .output{
    width:900px; height: 2200px;
  }
  .close{position: fixed; right:0; top:0; width: 80px; height:80px; background: pink;}
}
</style>