<template>
  <div class="statistics">
    <div class="header">
      <router-link class="back_btn" to="/"><i class="el-icon-arrow-left"></i>返回</router-link>
    </div>

    <div class="statistics_main">
      <div class="search_header">
        <div class="search_box" style="flex: 1;max-width: 500px">
          <span class="search_title">渠道查询</span>
          <el-select
            style="flex: 1"
            @input="onChang($event)"
            v-model="ChannelNameLst"
            clearable
            multiple
            size="small"
            placeholder="请选择">
            <el-option-group label="勾选全部">
              <el-option label="全部渠道" value="全部渠道"></el-option>
            </el-option-group>
            <el-option-group label="渠道列表">
              <el-option
                v-for="item in orderName"
                :key="item.ID"
                :label="item.channel_name"
                :value="item.channel_name">
              </el-option>
            </el-option-group>
          </el-select>
        </div>

        <div class="search_box">
          <span class="search_title">查询类型</span>
          <el-select
            style="width: 160px"
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
            style="width: 320px"
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
        <div style="height: 100%;width: 100%" id="myChart"></div>
      </div>
    </div>
  </div>
</template>

<script>
  let echarts = require("echarts/lib/echarts");
  // 引入组件
  require("echarts/lib/chart/line");
  require("echarts/lib/chart/bar");
  // 引入提示框和title组件
  require("echarts/lib/component/tooltip");
  require("echarts/lib/component/title");
  require("echarts/lib/component/dataZoom");
  require("echarts/lib/component/legend");
  require("echarts/lib/component/toolbox");
  require("echarts/lib/component/axisPointer");

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
        dataName: [], // 数据名列表
        dataList: [],
        dataListNot: [],
        dataListError: [],
        dataListVol: [],
        chartsTitle: '', // 图表title

        barSliderType: 100, // 柱状图滚动条

        chartsType: 'line', // 图表类型
      }
    },
    methods:{
      onChang(e){
        this.$forceUpdate()
      },

      /**
       * @Description: 折线图属性
       * @author Wish
       * @date 2020/4/16
      */
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
          legend: {
            data: this.dataName,
            orient: 'horizontal',
            // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）

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
              dataZoom: {
                yAxisIndex:"none"
              },
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
            name: this.dataName[0],
            type: this.chartsType,
            data: this.dataListNot
          },{
            name: this.dataName[1],
            type: this.chartsType,
            data: this.dataList
          },{
            name: this.dataName[2],
            type: this.chartsType,
            data: this.dataListError
          }],
        });
      },


      /**
       * @Description: 柱状图属性
       * @author Wish
       * @date 2020/4/16
       */
      drawBar() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          // title: {
          //   text: this.chartsTitle
          // },
          legend: {
            data: this.dataName,
          },
          grid: {  // 图表属性
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },

          dataZoom : [{
            type: 'slider',
            filterMode: 'filter',
            show: this.barSliderType !== 100,
            yAxisIndex: [0],
            right: '2%',
            top: 0,
            start: 0,
            end: this.barSliderType, //初始化滚动条
            startValue:10,                           //数据窗口范围的起始数值
            endValue:100,
          }],

          toolbox: {  // 控制条
            show: true,
            feature: {
              saveAsImage: {},
            }
          },
          xAxis: {
            // type: 'value'
          },
          yAxis: {
            type: 'category',
            // boundaryGap: false,
            data: this.dataListName
          },
          series: [{
            name: this.dataName[0],
            type: this.chartsType,
            data: this.dataListNot,
            stack: "总量",
            label: {
              show: true,
              position: 'insideRight',
              formatter: function (params) {
                if (params.value > 0) {
                  return params.value;
                } else {
                  return '';
                }
              },
            },
          },{
            name: this.dataName[1],
            type: this.chartsType,
            data: this.dataList,
            stack: "总量",
            label: {
              show: true,
              position: 'insideRight',
              formatter: function (params) {
                if (params.value > 0) {
                  return params.value;
                } else {
                  return '';
                }
              },
            },
          },{
            name: this.dataName[2],
            type: this.chartsType,
            data: this.dataListError,
            stack: "总量",
            label: {
              show: true,
              position: 'insideRight',
              formatter: function (params) {
                if (params.value > 0) {
                  return params.value;
                } else {
                  return '';
                }
              },
            },
          },{
            name: this.dataName[3],
            type: this.chartsType,
            data: this.dataListVol,
            stack: "总量",
            label: {
              show: true,
              position: 'insideRight',
                formatter: function (params) {
                if (params.value > 0) {
                  return params.value;
                } else {
                  return '';
                }
              },
            },
          }],
        });
      },

      /**
       * @Description: 搜索结果
       * @author Wish
       * @date 2020/4/14
      */
      getData(){
        if(this.ChannelNameLst.length < 1){
          return this.$message.warning('请选择查询渠道')
        }
        if(!this.QueryType){
          return this.$message.warning('请选择查询类型')
        }
        console.log(this.orderTime);
        if(this.ChannelNameLst.indexOf('全部渠道') > -1){
          this.ChannelNameLst = []
          this.orderName.map((item, index) =>{
            this.ChannelNameLst.push(item.channel_name)
          })
        }
        echarts.init(document.getElementById('myChart')).dispose();
        let data ={
          ChannelNameLst: this.ChannelNameLst,
          StartTime: this.orderTime? new Date(this.orderTime[0]).toISOString(): null,
          EndTime:  this.orderTime?new Date(this.orderTime[1]).toISOString(): new Date().toISOString(),
          QueryType: this.QueryType,
        }
        this.$axios.post('/query/statisticsData',JSON.stringify(data))
          .then(res =>{
            if(res.data.Code === 0){
              this.$message.success(res.data.Msg)
              let dataListArr = []
              let dataList = []
              let barArr = []
              let messageArr = []
              let newArr = []

              this.dataList = []
              this.dataName = []
              this.dataListName = []
              this.dataListNot = []
              this.dataListError = []
              this.dataListVol = []

              this.chartsTitle = Object.keys(res.data.Data).toString()  // 图表标题

              if(this.ChannelNameLst.length > 1){
                /**
                 * @Description: 多条数据图表
                 * @author Wish
                 * @date 2020/4/16
                 */
                this.chartsType = 'bar'
                for(let item in res.data.Data) {
                  dataListArr.push(res.data.Data[item][this.QueryType])
                  this.dataListName.push(item)
                }

                this.barSliderType = this.dataListName.length > 10? 50: 100
                console.log(dataListArr);

                if(this.QueryType === 'RefundType') {  // 退票类型数据处理
                  dataListArr.map((item ,index) =>{
                    console.log(JSON.stringify(item));
                    item['自愿'] = item['自愿']? item['自愿']: 0
                    item['自愿退票'] = item['自愿退票']? item['自愿退票']: 0
                    item['非自愿'] = item['非自愿']? item['非自愿']: 0
                    item['非自愿退票'] = item['非自愿退票']? item['非自愿退票']: 0
                  })

                  this.dataName = ['非自愿','自愿','非自愿退票','自愿退票']

                  for (let index in this.dataListName){
                    console.log(JSON.stringify(dataListArr[index]));
                    // if(dataListArr[index]){}
                    for(let val in dataListArr[index]) {
                      console.log(val);
                      console.log(dataListArr[index][val]);
                      if(val === '非自愿'){
                        this.dataListNot.push(dataListArr[index][val])
                      }else if(val === '自愿'){
                        this.dataList.push(dataListArr[index][val])
                      }else if(val === '非自愿退票'){
                        this.dataListError.push(dataListArr[index][val])
                      }else if(val === '自愿退票'){
                        this.dataListVol.push(dataListArr[index][val])
                      }else {
                        this.dataListNot.push(0)
                        this.dataList.push(0)
                        this.dataListError.push(0)
                        this.dataListVol.push(0)
                      }
                    }
                  }
                  this.drawBar()

                }else if(this.QueryType === 'RefundMsg'){  // 退票返回信息
                  dataListArr.map(item =>{
                    for (const val in item){
                      if(val){
                        messageArr.push(val)
                      }
                    }
                  })
                  messageArr = [...new Set(messageArr)]

                  dataListArr.map((item, index) =>{
                    barArr[index] = []
                    messageArr.map((oitem, oindex) =>{
                      barArr[index][oitem] = dataListArr[index][oitem]?dataListArr[index][oitem]: 0
                    })
                  })
                  console.log(barArr);
                  console.log(dataListArr);

                  // 基于准备好的dom，初始化echarts实例
                  let myChart = echarts.init(document.getElementById('myChart'))
                  let series = []
                  messageArr.map((item,index) =>{
                    let newArr = []
                    barArr.map((oitem, oindex) =>{
                      newArr.push(oitem[item])
                      // console.log(newArr);
                    },
                    series.push({
                      name: item,
                      type: this.chartsType,
                      data: newArr,
                      stack: "总量",
                      label: {
                        show: true,
                        position: 'insideRight',
                        formatter: function (params) {
                          if (params.value > 0) {
                            return params.value;
                          } else {
                            return '';
                          }
                        },
                      },
                    })
                  )})
                  myChart.setOption({
                    tooltip: {
                      trigger: 'axis',
                      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                      },
                      formatter: function(data) {
                        let res = data[0].data?data[0].marker+ ' '+data[0].seriesName+'：' + data[0].data + '<br />':'';
                        for(let i=1; i< data.length; i++){
                          res += data[i].data?data[i].marker+ ' '+ data[i].seriesName+'：'+data[i].data + '<br />': ''
                        }
                        return res;
                      },
                    },
                    // title: {
                    //   text: this.chartsTitle
                    // },
                    legend: {
                      data: messageArr,
                    },
                    grid: {  // 图表属性
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                    },

                    dataZoom : [{
                      type: 'slider',
                      filterMode: 'filter',
                      show: this.barSliderType !== 100,
                      yAxisIndex: [0],
                      right: '2%',
                      top: 0,
                      start: 0,
                      end: this.barSliderType,  //初始化滚动条
                      startValue:10,  //数据窗口范围的起始数值
                      endValue:100,
                    }],

                    toolbox: {  // 控制条
                      show: true,
                      feature: {
                        saveAsImage: {},
                      }
                    },
                    xAxis: {
                      // type: 'value'
                    },
                    yAxis: {
                      type: 'category',
                      // boundaryGap: false,
                      data: this.dataListName
                    },
                    series: series
                  })



                }else if(this.QueryType === 'RefundStatus'){  // 退票状态
                  console.log(dataListArr);
                  dataListArr.map((item ,index) =>{
                    barArr.push({
                      '未提交' : dataListArr[index]['未提交']? dataListArr[index]['未提交']: 0,
                      '退票失败' : dataListArr[index]['退票失败']? dataListArr[index]['退票失败']: 0,
                      '退票成功' : dataListArr[index]['退票成功']? dataListArr[index]['退票成功']: 0
                    })
                  })
                  console.log(barArr);
                  this.dataName = ['未提交','退票失败','退票成功']

                  for (let index in this.dataListName){
                    console.log(JSON.stringify(barArr[index]));
                    // if(dataListArr[index]){}
                    for(let val in barArr[index]) {
                      console.log(val);
                      console.log(barArr[index][val]);
                      if(val === '未提交'){
                        this.dataListNot.push(barArr[index][val])
                      }else if(val === '退票失败'){
                        this.dataList.push(barArr[index][val])
                      }else if(val === '退票成功'){
                        this.dataListError.push(barArr[index][val])
                      }else {
                        this.dataListNot.push(0)
                        this.dataList.push(0)
                        this.dataListError.push(0)
                      }
                    }
                  }
                  this.drawBar()

                }


                console.log(this.dataName);
                console.log(this.dataListName);
                console.log(this.dataList);
                console.log(this.dataListNot);
                console.log(this.dataListError);
                console.log(this.dataListVol);
              }else {
                /**
                 * @Description: 单条数据图表
                 * @author Wish
                 * @date 2020/4/16
                 */
                dataList = res.data.Data[this.ChannelNameLst.toString()][this.QueryType]

                this.chartsType = 'line'
                console.log(dataList);
                for(let item in dataList) {
                  this.dataListName.push(item)

                  for(let oitem in dataList[item]){
                    if(this.QueryType === 'RefundType'){  // 退票类型数据处理
                      this.dataName = ['非自愿','自愿']
                      if(oitem === '非自愿'){
                        this.dataListNot.push(dataList[item][oitem])
                      }else if(oitem === '自愿'){
                        this.dataList.push(dataList[item][oitem])
                      }else {
                        this.dataListNot.push(0)
                        this.dataList.push(0)
                      }

                      this.drawLine();  // 折线图
                    }else if(this.QueryType === 'RefundStatus'){  // 退票状态
                      console.log(oitem);
                      this.dataName = ['退票失败','退票成功']
                      if(oitem === '退票失败'){
                        this.dataListNot.push(dataList[item][oitem])
                      }else if(oitem === '退票成功'){
                        this.dataList.push(dataList[item][oitem])
                      }else {
                        this.dataListNot.push(0)
                        this.dataList.push(0)
                      }

                      this.drawLine();  // 折线图

                    }

                  }
                }

                if(this.QueryType === 'RefundMsg'){  // 退票返回信息
                  this.dataListName = Object.keys(dataList)  // 数值列表

                  this.dataListName.map((item,index) =>{
                    Object.keys(dataList[item]).map(oitem =>{
                      messageArr.push(oitem)
                    })
                  })
                  newArr = [...new Set(messageArr)]

                  let series = []

                  dataList.map((item, index) =>{
                    series.push({
                      name: this.dataListName[index],
                      type: this.chartsType,
                      data: newArr,
                      label: {
                        show: true,
                        position: 'insideRight',
                        formatter: function (params) {
                          if (params.value > 0) {
                            return params.value;
                          } else {
                            return '';
                          }
                        },
                      },
                    })
                  })


                  // // 基于准备好的dom，初始化echarts实例
                  let myChart = echarts.init(document.getElementById('myChart'))
                  // 绘制图表
                  myChart.setOption({
                    tooltip: {
                      trigger: 'axis'
                    },
                    title: {
                      text: this.chartsTitle
                    },
                    legend: {
                      data: newArr,
                      orient: 'horizontal',
                      // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）

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
                        dataZoom: {
                          yAxisIndex:"none"
                        },
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
                    series: series,
                  });



                  /***this.dataName = ['国际自愿退票暂不支持','退票操作成功','票号不存在']
                   if(oitem === '国际自愿退票暂不支持'){
                        this.dataListNot.push(dataList[item][oitem])
                      }else if(oitem === '退票操作成功'){
                        this.dataList.push(dataList[item][oitem])
                      }else if(oitem === '票号不存在'){
                        this.dataListError.push(dataList[item][oitem])
                      }else {
                        this.dataListNot.push(0)
                        this.dataList.push(0)
                        this.dataListError.push(0)
                      }*/
                }

                console.log(this.dataList);
                console.log(this.dataListNot);
                console.log(this.dataListError);
                console.log(this.dataListName);

              }
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
        align-items: flex-start;
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
      .ticketing_charts{
        width: 100%;
        height: calc(100vh - 155px);
        min-height: 500px;
      }
    }
  }
</style>