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
        <v-chart :data="dataList"/>
      </div>
    </div>
  </div>
</template>

<script>
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/line'

  export default {
    name: "statistics",
    components:{
      'v-chart': ECharts
    },
    data(){
      return {
        orderName: [], // 渠道列表
        ChannelNameLst: [], // 搜索渠道列表
        QueryType: '', // 查询类型
        orderTime: '', // 搜索时间

        StartTime: '',
        EndTime: '',
        dataList: {},  // 图表数据

        // option: {
        //   series: [
        //     {
        //       name: 'line',
        //       type: 'line',
        //       data: this.dataList
        //     }
        //   ],
        // }
      }
    },
    methods:{
      onChang(e){
        this.$forceUpdate()
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
              let dataListArr = []
              let dataList
              if(this.ChannelNameLst.length > 1){
                this.ChannelNameLst.forEach((item, index) =>{
                  dataListArr.push(res.data.Data[this.ChannelNameLst[index].toString()][this.QueryType])
                })
              }else {
                console.log(res.data.Data[this.ChannelNameLst.toString()][this.QueryType]);
                dataList = res.data.Data[this.ChannelNameLst.toString()][this.QueryType]
              }
              console.log(dataListArr);
              this.$message.success(res.data.Msg)
              console.log(dataList);
              this.dataList['row'] = []
              // this.dataList['columns'] = ['日期']

              for(let item in dataList) {
                this.dataList.row.push({
                  'name': item,
                  'value': dataList[item],
                })
              }

              console.log(this.dataList);
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