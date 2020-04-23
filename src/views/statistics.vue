<template>
  <div class="statistics">
    <div class="header">
      <router-link class="back_btn" to="/"><i class="el-icon-arrow-left"></i>返回</router-link>
    </div>

    <div class="statistics_main">
      <div class="statistics_title">
        <p>退票统计</p>
      </div>
      <div class="search_header">
        <div class="search_box search_name" style="flex: 1;max-width: 500px">
          <span class="search_title">渠道查询</span>
          <el-select
            style="flex: 1"
            @input="onChang($event)"
            v-model="ChannelNameLst"
            :popper-append-to-body="false"
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

        <el-button size="small" type="primary" @click="getData">搜索</el-button>
      </div>
      <div class="ticketing_charts">
        <div style="height: 100%;width: 100%" id="myChart"></div>
        <div class="line_table" v-show="chartsType === 'line'">
          <div class="line_table_title">
            <p>名称</p>
            <p>数值</p>
          </div>
          <div class="line_table_data">
            <p v-for="(value, key) in lineTableNumber" v-if="key !== 'lineTotal' && key !== 'null'">
              <span>{{key}}</span>
              <span>{{(Math.round(value / lineTableNumber.lineTotal * 10000) / 100.00).toFixed(1)}}%</span>
            </p>
          </div>

        </div>
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
        showLineTable: false,  // 折线图表格
        lineTableNumber: {}
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
          color: ['#F25645','#72C272','#F2AB45'],
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
          color: ['#F2AB45','#F25645','#72C272','#2082E5','#F182B9','#ffaaa5'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function(data) {
              let number = 0
              data.map(item =>{
                number += item.data
              })
              let res = data[0].data?data[0].marker+ ' '+data[0].seriesName+'：' + data[0].data +' <span style="font-size: 12px;margin-left: 10px">(占比：'+ (Math.round(data[0].data / number * 10000) / 100.00).toFixed(1)+ '%)</span>' + '<br />':'';
              for(let i=1; i< data.length; i++){
                res += data[i].data?data[i].marker+ ' '+ data[i].seriesName+'：'+data[i].data +' <span style="font-size: 12px;margin-left: 10px">(占比：'+ (Math.round(data[i].data / number * 10000) / 100.00).toFixed(1)+ '%)</span>' +'<br />': ''
              }
              return res;
            },
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
              position: 'inside',
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
              position: 'inside',
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
              position: 'inside',
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
              position: 'inside',
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
                    // if(dataListArr[index]){}
                    let numData = 0

                    for(let val in dataListArr[index]) {
                      numData += dataListArr[index][val]
                      console.log(numData);
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
                        position: 'inside',
                        // itemStyle:{
                        //   normal:{
                        //     color: colorStyle[index],
                        //   }
                        // },
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
                    color: ['#F25645','#2082E5','#F2AB45','#F182B9','#72C272','#ffaaa5','#481380','#75daad'],
                    tooltip: {
                      trigger: 'axis',
                      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                      },
                      formatter: function(data) {
                        let number = 0
                        data.map(item =>{
                          number += item.data
                        })
                        // console.log(number);
                        let res = data[0].data?data[0].marker+ ' '+data[0].seriesName+'：' + data[0].data + ' <span style="font-size: 12px;margin-left: 10px">(占比：'+ (Math.round(data[0].data / number * 10000) / 100.00).toFixed(1)+ '%)</span>' + '<br />':'';
                        for(let i=1; i< data.length; i++){
                          res += data[i].data?data[i].marker+ ' '+ data[i].seriesName+'：'+data[i].data + ' <span style="font-size: 12px;margin-left: 10px">(占比：'+ (Math.round(data[i].data / number * 10000) / 100.00).toFixed(1)+ '%)</span>' + '<br />': ''
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
                      // type: 'value',
                    },
                    yAxis: {
                      type: 'category',
                      // boundaryGap: false,
                      data: this.dataListName,
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
                this.lineTableNumber = {}
                this.chartsType = 'line'
                console.log(dataList);
                for(let item in dataList) {
                  this.dataListName.push(item)

                  for(let oitem in dataList[item]){
                    this.lineTableNumber['lineTotal'] = (this.lineTableNumber['lineTotal']?this.lineTableNumber['lineTotal']: 0) + Number(dataList[item][oitem])
                    this.lineTableNumber[oitem] = (this.lineTableNumber[oitem]?this.lineTableNumber[oitem]: 0) + Number(dataList[item][oitem])

                    if(this.QueryType === 'RefundType'){  // 退票类型数据处理
                      this.dataName = ['非自愿','自愿']
                      if(oitem === '非自愿'){
                        this.dataListNot.push(dataList[item][oitem] || 0)
                      }else if(oitem === '自愿'){
                        this.dataList.push(dataList[item][oitem] || 0)
                      }else {
                        this.dataListNot.push(0)
                        this.dataList.push(0)
                      }
                      this.drawLine();  // 折线图
                    }else if(this.QueryType === 'RefundStatus'){  // 退票状态
                      this.dataName = ['退票失败','退票成功']
                      if(oitem === '退票失败'){
                        this.dataListNot.push(dataList[item][oitem] || 0)
                      }else if(oitem === '退票成功'){
                        this.dataList.push(dataList[item][oitem] || 0)
                      }else {
                        this.dataListNot.push(0)
                        this.dataList.push(0)
                      }
                      this.drawLine();  // 折线图
                    }

                  }
                }
                if(this.QueryType === 'RefundMsg'){  // 退票返回信息
                  let newMsgData= []

                  this.dataListName = Object.keys(dataList)  // 数值列表
                  this.dataListName.map((item,index) =>{
                    Object.keys(dataList[item]).map(oitem =>{
                      if(oitem !== 'null'){
                        messageArr.push(oitem)
                      }
                      // messageArr.push(oitem)
                    })
                  })
                  this.dataName = [...new Set(messageArr)]

                  this.dataName.map((item, index) =>{
                    newMsgData[index] = []
                    this.dataListName.map(oitem => {
                      newMsgData[index].push(dataList[oitem][item] || 0)
                    })
                  })
                  let series = []
                  this.dataListName.map((item, index) =>{
                    series.push({
                      name: this.dataName[index],
                      type: this.chartsType,
                      data: newMsgData[index],
                    })
                  })

                  console.log(series);
                  // // 基于准备好的dom，初始化echarts实例
                  let myChart = echarts.init(document.getElementById('myChart'))
                  // 绘制图表
                  myChart.setOption({
                    color: ['#F25645','#2082E5','#F2AB45','#F182B9','#72C272','#ffaaa5','#481380','#75daad'],
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
        console.log(this.lineTableNumber);
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
      background: #0070E2;
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
      .statistics_title{
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        >p{
          font-size: 24px;
        }
      }
      .search_header{
        display: flex;
        align-items: flex-start;
        margin-bottom: 20px;
        .search_box{
          display: inline-flex;
          align-items: center;
          margin-right: 15px;
          &.search_name{
            /deep/.el-select-dropdown{
              .el-select-dropdown__wrap{
                min-height: 80vh;
              }
            }
          }
          .search_title{
            flex-shrink: 0;
            margin-right: 10px;
          }
        }
      }
      .ticketing_charts{
        width: 100%;
        height: calc(100vh - 200px);
        min-height: 500px;
        display: flex;
        align-items: flex-start;
        position: relative;
        .line_table{
          border: 1px solid #f2f2f2;
          max-width: 40%;
          /*width: 100%;*/
          flex-shrink: 0;
          position: absolute;
          right: 58px;
          top: 60px;
          pointer-events: none;
          background: rgba(255,255,255,.8);
          .line_table_title{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            p{
              width: 100%;
              text-align: center;
              height: 40px;
              line-height: 40px;
              padding: 0 10px;
              box-sizing: border-box;
              &:nth-child(2){
                width: 120px;
              }
              &:not(:last-child){
                border-right: 1px solid #f2f2f2;
              }
            }
          }
          .line_table_data{
            display: flex;
            flex-direction: column;
            p{
              width: 100%;
              display: flex;
              align-items: center;
              >span{
                width: 100%;
                text-align: center;
                border-top: 1px solid #f2f2f2;
                height: 30px;
                line-height: 30px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding: 0 10px;
                box-sizing: border-box;
                &:nth-child(2){
                  width: 120px;
                }
                &:not(:last-child){
                  border-right: 1px solid #f2f2f2;
                }
              }
            }
          }
        }
      }
    }
  }
</style>