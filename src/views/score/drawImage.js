import dayjs from 'dayjs'
export default (data, outputPanel) => {
  let ctx = outputPanel.value.getContext('2d');
  let phaseInfo = data.phaseInfo
  let drawData = JSON.parse(JSON.stringify(data.tableData))
  let tableTitle = ['','名字', '第1阶段', '第2阶段', '第3阶段', '第4阶段', '合计']
  let colPosition = [10, 50, 260, 400, 540, 680, 820]
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, 900, 2700)
  // 画头部
  drawTitle()
  // 表格头行
  drawTableTitle()
  // 表格数据
  drawTableData()
  // 表格合计
  drawSummary()

  function drawTitle(){
    ctx.fillStyle = "#b71c1c"
    ctx.fillRect(0, 0, 900, 70)
    ctx.font = "40px '得意黑'";
    ctx.fillStyle = "yellow"
    //ctx.moveTo(300,300)
    ctx.fillText(phaseInfo.title, 30,50)
    ctx.font = "12px 'Arial'";
    let beginDate = dayjs(phaseInfo.beginDate).format('YYYY-MM-DD')
    let endDate = dayjs(phaseInfo.endDate).format('YYYY-MM-DD')
    let time = `本期时间：${beginDate} -- ${endDate}`
    ctx.fillText(time, 700, 50)
  }

  function drawTableTitle() {
    ctx.fillStyle = "pink"
    ctx.fillRect(0, 70, 900,45)
    ctx.font = "16px '微软雅黑'";
    ctx.fillStyle = "#333333"
    tableTitle.forEach((item,index) => {
      ctx.fillText(item, colPosition[index], 100)
    })
  }

  function drawTableData() {
    ctx.font = "14px '微软雅黑'";
    ctx.fillStyle = "#333333"
    let [s1Summary,s2Summary,s3Summary,s4Summary,totalSummary] = [0,0,0,0,0]

    drawData.forEach((item, index) => {
      s1Summary += item.s1
      s2Summary += item.s2
      s3Summary += item.s3
      s4Summary += item.s4
      totalSummary += item.total

      let row = [index+1, item.name, item.s1,item.s2,item.s3,item.s4, item.total]
      ctx.strokeStyle = "#ddd";
      ctx.moveTo(0.5, 155.5 + index * 40)
      ctx.lineTo(900.5, 155.5 + index * 40)
      ctx.lineWidth = 1
      ctx.stroke()
      for(let n=0; n<row.length; n++){
        ctx.fillText(row[n], colPosition[n], 140+ index* 40)
      }
    })
    ctx.fillStyle = "#ddd"
    ctx.fillRect(0, 115 + drawData.length * 40, 900, 50)
    let row = ['', '合计', s1Summary, s2Summary, s3Summary, s4Summary, totalSummary]
    ctx.fillStyle = "#333"
    for (let n = 0; n < row.length; n++) {
      ctx.fillText(row[n], colPosition[n], 145 + drawData.length * 40)
    }
  }

  function drawSummary() {
    
  }
  
}