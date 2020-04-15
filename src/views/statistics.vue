<template>
  <div class="statistics">
    <div class="header">
      <router-link class="back_btn" to="/"><i class="el-icon-arrow-left"></i>返回</router-link>
    </div>

    <div class="statistics_main">
      <div class="search_header">
        <div class="search_box">
          <span class="search_title">渠道查询</span>
          <el-select
            @input="onChang($event)"
            v-model="ChannelNameLst"
            clearable
            multiple
            size="small"
            placeholder="请选择">
            <el-option
              v-for="item in orderName"
              :key="item.ID"
              :label="item.channel_name"
              :value="item.channel_name">
            </el-option>
          </el-select>
        </div>

        <div class="search_box">
          <span class="search_title">查询类型</span>
          <el-select
            @input="onChang($event)"
            v-model="QueryType"
            clearable
            size="small"
            placeholder="请选择">
            <el-option label="退票类型" value="RefundType"></el-option>
            <el-option label="退票返回信息" value="RefundMsg"></el-option>
            <el-option label="退票状态" value="RefundStatus"></el-option>
          </el-select>
        </div>


        <div class="search_box">
          <span class="search_title">查询时间</span>
          <el-date-picker
            size="small"
            clearable
            @input="onChang($event)"
            v-model="orderTime"
            type="daterange"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>

        <el-button size="small" @click="getData">搜索</el-button>
      </div>
      <div class="ticketing_charts">
        <div style="height: 500px;width: 100%" id="myChart"></div>
      </div>
    </div>
  </div>
</template>

<script>
  let echarts = require("echarts/lib/echarts");
  // 引入柱状图组件
  require("echarts/lib/chart/line");
  // 引入提示框和title组件
  require("echarts/lib/component/tooltip");
  require("echarts/lib/component/title");
  require("echarts/lib/component/dataZoom");

  export default {
    name: "statistics",

    data(){
      return {
        orderName: [], // 渠道列表
        ChannelNameLst: [], // 搜索渠道列表
        QueryType: '', // 查询类型
        orderTime: '', // 搜索时间

        StartTime: '',
        EndTime: '',
        dataListName: [],  // 图表数据
        dataList: [],
        dataListNot: [],
        chartsTitle: '', // 图表title
      }
    },
    methods:{
      onChang(e){
        this.$forceUpdate()
      },

      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          title: {
            text: this.chartsTitle
          },
          grid: {  // 图表属性
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          dataZoom: [{  // 缩放
            id: 'dataZoomX',
            type:"inside",
            xAxisIndex: [0],
            filterMode: 'filter'
          }],
          toolbox: {  // 控制条
            show: true,
            feature: {
              saveAsImage: {},
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.dataListName
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: '自愿',
            type: 'line',
            data: this.dataList
          },{
            name: '非自愿',
            type: 'line',
            data: this.dataListNot
          }]
        });
      },

      /**
       * @Description: 搜索结果
       * @author Wish
       * @date 2020/4/14
      */

      getData(){
        let data ={
          ChannelNameLst: this.ChannelNameLst,
          StartTime: new Date(this.orderTime[0]).toISOString(),
          EndTime: new Date(this.orderTime[1]).toISOString(),
          QueryType: this.QueryType,
        }
        this.$axios.post('/query/statisticsData',JSON.stringify(data))
          .then(res =>{
            if(res.data.Code === 0){
              console.log(res.data.Data);
              let dataListArr = []
              let dataList = []
              if(this.ChannelNameLst.length > 1){
                this.ChannelNameLst.forEach((item, index) =>{
                  dataListArr.push(res.data.Data[this.ChannelNameLst[index].toString()][this.QueryType])
                })
              }else {
                dataList = res.data.Data[this.ChannelNameLst.toString()][this.QueryType]
              }
              this.chartsTitle = Object.keys(res.data.Data).toString()
              console.log(this.chartsTitle);
              this.$message.success(res.data.Msg)
              this.dataList = []
              this.dataListName = []
              this.dataListNot = []
              console.log(dataList);
              for(let item in dataList) {
                this.dataListName.push(item)

                for(let oitem in dataList[item]){
                  if(oitem === '非自愿'){
                    this.dataListNot.push(dataList[item][oitem])
                  }else if(oitem === '自愿'){
                    this.dataList.push(dataList[item][oitem])
                  }else {
                    this.dataListNot.push(0)
                    this.dataList.push(0)
                  }
                }
              }

              console.log(this.dataList);
              console.log(this.dataListNot);
              console.log(this.dataListName);

              this.drawLine();

            }else {
              this.$message.warning(res.data.msg)
            }
          })
      },
      /**
       * @Description: 获取渠道名称
       * @author Wish
       * @date 2020/4/14
      */
      getChannelList(){
        let data ={
          project: ''
        }
        this.$axios.post('/config/get',data)
          .then(res =>{
            if(res.data.code === 0){
              this.orderName = res.data.data
            }else {
              this.$message.warning(res.data.msg)
            }
          })
      },
    },
    created() {
      this.getChannelList()
    }
  }
</script>

<style scoped lang="less">
  .statistics{
    .header{
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      font-size: 16px;
      background: rgba(0, 123, 255, 0.8);
      .back_btn{
        color: #fff;
        height: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
        i{
          margin-right: 10px;
        }
      }
    }
    .statistics_main{
      padding: 20px;
      .search_header{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .search_box{
          display: inline-flex;
          align-items: center;
          margin-right: 15px;
          .search_title{
            flex-shrink: 0;
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>