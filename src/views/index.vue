<template>
  <div class="index">

    <div class="drawer_btn" @mouseenter="openDrawer"></div>
    <div class="search_header">
      <div class="search_box search_name">
        <span>退票渠道：</span>
<!--        <div class="channel_input" @click="openChannelDialog">{{channelName}}</div>-->
        <el-select
          :popper-append-to-body="false"
          @input="onChang($event)"
          v-model="searchData.refund_channel"
          clearable
          size="mini"
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
        <span>YATP订单号：</span>
        <el-input size="mini" clearable v-model="searchData.yatp_order_no"></el-input>
      </div>

      <div class="search_box">
        <span>退票订单号：</span>
        <el-input size="mini" clearable v-model="searchData.platform_order_no"></el-input>
      </div>

      <div class="search_box">
        <span>退票类型：</span>
        <el-select
          v-model="searchData.refund_type"
          clearable
          size="mini"
          placeholder="请选择">
          <el-option
            v-for="item in orderType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="search_box">
        <span style="min-width: unset">票号：</span>
        <el-input size="mini" clearable v-model="searchData.refund_account"></el-input>
      </div>


    </div>
    <div class="search_header">

      <div class="search_box">
        <span>乘车人姓名：</span>
        <el-input size="mini" clearable v-model="searchData.passenger_name"></el-input>
      </div>

      <div class="search_box">
        <span>提交状态：</span>
        <el-select
          v-model="searchData.refund_status"
          clearable
          size="mini"
          placeholder="请选择">
          <el-option
            v-for="item in orderStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

<!--      <div class="search_box">-->
<!--        <span>退票信息：</span>-->
<!--        <el-input size="mini" clearable v-model="searchData.channel_type"></el-input>-->
<!--      </div>-->

      <div class="search_box">
        <span>退票账号：</span>
        <el-input size="mini" clearable v-model="searchData.refund_account"></el-input>
      </div>

      <div class="search_box">
        <span>退票申请时间：</span>
        <el-date-picker
          size="mini"
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

      <div class="search_box">
        <el-button size="mini" type="primary" @click="searchBtn()">搜索</el-button>
      </div>
    </div>

    <div class="main_table">
      <el-table
        v-el-table-infinite-scroll="load"
        :data="dataList"
        highlight-current-row
        stripe
        height="calc(100vh - 116px)"
        border
        size="small"
        @current-change="handleSelect"
        style="width: 100%;">
        <ex-table-column
          :autoFit="true"
          align="center"
          fixed
          show-overflow-tooltip
          prop="RefundChannel"
          label="退票渠道">
        </ex-table-column>
        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="OperateDepartment"
          label="运营部门">
          <template slot-scope="scope">
            <div class="table_hidden_txt">
              <p>{{scope.row.OperateDepartment}}</p>
            </div>
          </template>
        </ex-table-column>
        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="ChannelType"
          width="50"
          label="渠道类型">
        </ex-table-column>
<!--        <ex-table-column-->
<!--          align="center"-->
<!--          prop="ShopName"-->
<!--          label="店铺名称">-->
<!--        </ex-table-column>-->

        <ex-table-column
          align="center"
          :autoFit="true"
          width="65"
          show-overflow-tooltip
          prop="YATPOrderNo"
          label="YATP订单号">
        </ex-table-column>
        <ex-table-column
          align="center"
          width="150"
          :autoFit="true"
          show-overflow-tooltip
          prop="PlatformOrderNo"
          label="退票订单号">
        </ex-table-column>

        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="RefundType"
          label="退票类型">
        </ex-table-column>
        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="RefundStatus"
          label="退票状态">
        </ex-table-column>
        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          label="票号信息">
          <template slot-scope="scope">
            <div style="overflow: hidden;text-overflow: ellipsis;cursor: pointer" @click="openTicketMessage(scope.row.TicketNos)">{{scope.row.TicketNos}}</div>
          </template>
        </ex-table-column>
        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="RefundPrice"
          width="70"
          label="应退金额">
        </ex-table-column>
        <ex-table-column
          align="center"
          :autoFit="true"
          width="70"
          show-overflow-tooltip
          prop="RealRefundPrice"
          label="实退金额">
        </ex-table-column>
        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="RefundReason"
          label="退票原因">
        </ex-table-column>
        <ex-table-column
          align="center"
          :autoFit="true"
          width="70"
          show-overflow-tooltip
          prop="RefundAccout"
          label="帐号">
        </ex-table-column>
        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="RefundMsg"
          label="返回消息">
        </ex-table-column>
        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          label="操作员"
          prop="Operator">
          <template slot-scope="scope">
            <div class="table_hidden_txt">
              <p>{{scope.row.Operator}}</p>
            </div>
          </template>
        </ex-table-column>
        <ex-table-column
          align="center"
          width="100"
          :autoFit="true"
          show-overflow-tooltip
          label="提交时间">
          <template slot-scope="scope">
            <div class="table_hidden_txt">
              <p>{{$getTime(scope.row.SubmitTime)}}</p>
            </div>
          </template>
        </ex-table-column>
        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="Attachment"
          width="65"
          label="非自愿附件">
        </ex-table-column>
      </el-table>
      <div class="table_bottom">
<!--        <el-pagination-->
<!--          class="main_pagination"-->
<!--          @size-change="handleSizeChange"-->
<!--          @current-change="handleCurrentChange"-->
<!--          :current-page="pageNum"-->
<!--          :page-size="pageSize"-->
<!--          layout=" prev, pager, next, sizes, jumper"-->
<!--          :page-sizes="[10, 20, 50, 100]"-->
<!--          :total="dataList.length">-->
<!--        </el-pagination>-->

        <div class="table_setting">

        </div>

      </div>
    </div>

    <el-dialog
      custom-class="channel_dialog"
      :title="channelName"
      :visible.sync="channelDialog"
      width="500">
      <el-table
        border>
        <ex-table-column
          align="center"
          prop="channel_name"
          label="渠道名称">
        </ex-table-column>
      </el-table>

    </el-dialog>


    <el-dialog
      custom-class="channel_dialog"
      title="票号信息"
      :visible.sync="ticketMessageDialog"
      width="400px">
      <div>
        <div v-for="(item,index) in ticketMessageList" :key="index">
          票号：{{item.split(',')[0]}}&nbsp;&nbsp;&nbsp;状态：{{item.split(',')[1] === '0'? '已提交': '未提交'}}
        </div>
        <div v-if="ticketMessage">
          票号：{{ticketMessage.split(',')[0]}}&nbsp;&nbsp;&nbsp;状态：{{ticketMessage.split(',')[1] === '0'? '已提交': '未提交'}}
        </div>
      </div>

    </el-dialog>


    <el-drawer
      title="我是标题"
      append-to-body
      size="170px"
      :visible.sync="drawer"
      direction="ltr"
      :with-header="false">
      <div class="drawer_main">
        <div class="logo"><img src="../assets/logo.png" alt=""></div>
        <div class="drawer_box">
          <div class="drawer_btn" @click="jumpRouter('/setting')">配置页面</div>
          <div class="drawer_btn" @click="jumpRouter('/statistics')">退票统计</div>
          <div class="drawer_btn" @click="jumpRouter('/readme')">接口文档</div>
          <div class="drawer_btn" @click="jumpRouter('/swagger/index.html',true)">Swagger</div>
        </div>
      </div>
    </el-drawer>

  </div>
</template>

<script>
  import elTableInfiniteScroll from 'el-table-infinite-scroll';
export default {
  name: 'index',
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  data(){
    return {
      drawer: false,  // 菜单

      searchData: {
        offset: 0,
        limit: 20
      },
      orderTime: '',  // 退票申请时间
      orderType: [{  // 退票类型
        value: 1,
        label: '自愿'
      },{
        value: 2,
        label: '非自愿'
      }],
      orderStatus: [{  // 提交状态
        value: '已提交',
        label: '已提交'
      },{
        value: '未提交',
        label: '未提交'
      },{
        value: '退票失败',
        label: '退票失败'
      },{
        value: '退票成功',
        label: '退票成功'
      },{
        value: '已拒单',
        label: '已拒单'
      }],

      orderName: [], // 渠道名称

      dataList: [], // 自动出票数据

      channelName: '',  // 渠道名称
      channelDialog: false, // 渠道名称弹窗

      loadStatus: false,

      ticketMessageDialog: false, // 票号信息弹窗
      ticketMessageList: [], // 票号信息列表
      ticketMessage: '', // 票号信息
      // pageNum: 1,
      // pageSize:10
    }
  },
  methods:{
    onChang(e){
      this.$forceUpdate()
    },

    load(){
      if(this.loadStatus){
        this.searchData.offset = this.searchData.offset + this.searchData.limit + 1
        this.getData()
      }
    },
    searchBtn(){
      this.dataList = []
      this.searchData.offset = 0
      this.searchData.limit = 20
      this.loadStatus = false
      this.getData()
    },

    /**
     * @Description: 打开侧边框
     * @author Wish
     * @date 2020/4/10
    */
    openDrawer(){
      this.drawer = true
    },


    /**
     * @Description: 退票查询接口
     * @author Wish
     * @date 2020/3/13
    */
    getData(){
      /**
       * @Description: 当前日期判断 - 时间格式转换
       * @author Wish
       * @date 2020/3/13
       */
      if(this.orderTime){
        let thisDate = new Date().getTime();  // 现在时间
        console.log(thisDate,new Date(this.orderTime[0]).getTime());
        if(thisDate >= new Date(this.orderTime[0]).getTime()){
          this.$message.warning('请选择大于当前日期')
        }else {
          this.searchData['start_time'] = new Date(this.orderTime[0]).toISOString()
          this.searchData['end_time'] = new Date(this.orderTime[1]).toISOString()
        }
      }else {
        delete this.searchData.start_time
        delete this.searchData.end_time
      }
      if(this.searchData.refund_type === ''){
        delete this.searchData.refund_type
      }
      this.$axios.post('/refund/query',this.searchData)
        .then(res =>{
          if(res.data.code === 0){
              if(res.data.data.length> 0){
                this.loadStatus = true
                this.dataList = this.dataList.concat(res.data.data)
              }else {
                this.loadStatus = false
                this.$message.warning('暂无更多数据')
              }

            console.log(this.dataList);
          }else {
            this.$message.error(res.data.message)
          }
        })
        .catch(err =>{
          console.log(err);
          this.$message.error(err.message)
        })
    },

    /**
     * @Description: 跳转接口文档
     * @author Wish
     * @date 2020/3/27
    */
    jumpRouter(url,type){
      if(type){
        window.open(url)
      }else {
        this.$router.push(url)
      }
    },


    /**
     * @Description: 票号信息
     * @author Wish
     * @date 2020/3/30
    */
    openTicketMessage(val){
      if(val.indexOf(';') !== -1){
        this.ticketMessageList = val.split(';')
        this.ticketMessage = ''
      }else if(val !== ''){
        this.ticketMessage = val
        this.ticketMessageList = []
      }else {
        return this.$message.warning('暂无数据')
      }
      this.ticketMessageDialog = true

    },


    /**
     * @Description: 打开渠道名称弹窗
     * @author Wish
     * @date 2020/3/16
    */
    openChannelDialog(){
      if(this.channelName){
        this.channelDialog = true
        let data ={
          project: this.channelName
        }
        this.$axios.post('/config/get',data)
          .then(res =>{
            console.log(res);
          })
      }else {
        this.$message.warning('请选择一条数据')
      }
    },

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

    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    //   this.pageSize=val;
    // },
    // handleCurrentChange(val) {
    //   console.log(`当前页: ${val}`);
    //   this.pageNum = val;
    // },
    /**
     * @Description: 获取渠道名称
     * @author Wish
     * @date 2020/3/16
    */
    handleSelect(val) {
      this.channelName = val.RefundChannel
    },


  },
  filters:{
    pagination(dataList,pageNum,pageSize){
      let offset = (pageNum - 1) * pageSize;//当前页第一条的索引
      return (offset + pageSize >= dataList.length) ? dataList.slice(offset, dataList.length) : dataList.slice(offset, offset + pageSize)
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.getChannelList()
  }
}
</script>

<style scoped lang="less">
  .index{
    padding: 20px;
    position: relative;
    .drawer_btn{
      position: absolute;
      left: 0;
      top: 0;
      height: 100vh;
      width: 20px;
      animation: showDrawer 4s infinite ease-in-out alternate 1s;
      background: linear-gradient(to right, rgba(0, 123, 255, 0.3), #fff);
      opacity: 0;
    }
    @keyframes showDrawer{
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    .search_header{
      display: flex;
      align-items: center;
      /*flex-wrap: wrap;*/
      .search_box{
        display: inline-flex;
        align-items: center;
        margin-bottom: 5px;

        &.search_name{
          /deep/.el-select-dropdown{
            /*max-height: 80vh;*/
            .el-scrollbar{
              .el-select-dropdown__wrap{
                max-height: 80vh;
                /*height: 80vh;*/
              }
            }
          }
        }
        .channel_input{
          border-radius: 4px;
          border: 1px solid #DCDFE6;
          box-sizing: border-box;
          display: inline-block;
          color: #606266;
          height: 32px;
          line-height: 32px;
          transition: border-color .2s cubic-bezier(.645,.045,.355,1);
          width: 215px;
          cursor: pointer;
          align-items: center;
          padding-left: 15px;
          font-size: 14px;
          &:hover{
            border-color: #C0C4CC;
          }
        }
        >span{
          flex-shrink: 0;
          display: block;
          font-size: 14px;
          min-width: 90px;
          text-align: right;
        }
        &:not(:last-child){
          margin-right: 10px;
        }
      }
    }
    .main_table{
      margin-top: 10px;
      .table_hidden_txt{
        position: relative;
        padding-left: 10px;
        box-sizing: content-box;
        &:before{
          content: '...';
          position: absolute;
          left: 0;
          height: 100%;
          /*background: #fff;*/
        }
        p{
          overflow: hidden;
          text-align: right;
          display: flex;
          justify-content: flex-end;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .main_pagination{
    }
  }
/* 渠道名称弹窗 */
  .channel_dialog{
    /deep/.el-dialog__body{
      max-height: 800px;
      overflow-y: auto;
    }
  }
  .drawer_main{
    padding: 20px;
    .logo{
      width: 100%;
      height: 40px;
      >img{

        height: 100%;
        object-fit: contain;
      }
      margin-bottom: 15px;
    }
    .drawer_box{
      &:hover{
        .drawer_btn:not(:hover){
          color: rgba(0,0,0,.4);
        }
        .drawer_btn:hover{
          color: rgba(0, 123, 255, 1);
        }
      }
      .drawer_btn{
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
        color: rgba(0,0,0,1);

        &:not(:last-child){
          margin-bottom: 5px;
          /*border-bottom: 1px solid #c1c1c1;*/
        }
      }
    }

  }
</style>
