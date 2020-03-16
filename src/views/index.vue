<template>
  <div class="index">
    <div class="search_header">
      <div class="search_box">
        <span>渠道名称：</span>
        <div class="channel_input" @click="openChannelDialog">{{channelName}}</div>
      </div>

      <div class="search_box">
        <span>平台订单号：</span>
        <el-input size="small" clearable v-model="searchData.platform_order_no"></el-input>
      </div>

      <div class="search_box">
        <span>YATP订单号：</span>
        <el-input size="small" clearable v-model="searchData.yatp_order_no"></el-input>
      </div>

      <div class="search_box">
        <span>票号：</span>
        <el-input size="small" clearable v-model="searchData.refund_account"></el-input>
      </div>

      <div class="search_box">
        <span>退票类型：</span>
        <el-select
          @input="onChang($event)"
          v-model="searchData.refund_type"
          clearable
          size="small"
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
        <span>乘车人姓名：</span>
        <el-input size="small" clearable v-model="searchData.refund_channel"></el-input>
      </div>

      <div class="search_box">
        <span>提交状态：</span>
        <el-select
          v-model="searchData.refund_status"
          clearable
          size="small"
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
<!--        <el-input size="small" clearable v-model="searchData.channel_type"></el-input>-->
<!--      </div>-->

      <div class="search_box">
        <span>退票申请时间：</span>
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

      <div class="search_box">
        <span>退票账号：</span>
        <el-input size="small" clearable v-model="searchData.refund_account"></el-input>
      </div>

      <div class="search_box">
        <el-button size="small" @click="getData()">搜索</el-button>
      </div>


    </div>

    <div class="main_table">
      <el-table
        :data="dataList | pagination(pageNum,pageSize)"
        highlight-current-row
        stripe
        border
        @current-change="handleSelect"
        style="width: 100%">
        <el-table-column
          align="center"
          fixed
          show-overflow-tooltip
          width="110"
          prop="RefundChannel"
          label="退票渠道">
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          width="130"
          prop="ChannelType"
          label="渠道类型">
        </el-table-column>
<!--        <el-table-column-->
<!--          align="center"-->
<!--          prop="ShopName"-->
<!--          label="店铺名称">-->
<!--        </el-table-column>-->
        <el-table-column
          align="center"
          show-overflow-tooltip
          width="220"
          prop="OperateDepartment"
          label="运营部门">
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          width="180"
          prop="PlatformOrderNo"
          label="平台订单号">
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          width="180"
          prop="YATPOrderNo"
          label="YATP订单号">
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          width="90"
          prop="RefundType"
          label="退票类型">
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          width="90"
          prop="RefundStatus"
          label="退票状态">
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          prop="RefundReason"
          label="退票原因">
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          width="180"
          prop="RefundReason"
          label="退票返回消息">
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          width="200"
          prop="PassengerInfos"
          label="乘客及航程信息">
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          width="180"
          prop="RefundAccout"
          label="退票帐号">
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          width="150"
          label="退票申请时间">
          <template slot-scope="scope">
            {{$getTime(scope.row.RefundTime)}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          show-overflow-tooltip
          width="120"
          prop="Attachment"
          label="非自愿附件">
        </el-table-column>
      </el-table>
      <el-pagination
        class="main_pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout=" prev, pager, next, sizes, jumper"
        :total="dataList.length">
      </el-pagination>
    </div>

    <el-dialog
      custom-class="channel_dialog"
      :title="channelName"
      :visible.sync="channelDialog"
      width="30%">
      <el-table
        border>
        <el-table-column
          align="center"
          prop="channel_name"
          label="渠道名称">
        </el-table-column>
      </el-table>

    </el-dialog>

  </div>
</template>

<script>

export default {
  name: 'index',
  data(){
    return {
      searchData: {
        offset: null
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
      }],

      dataList: [], // 自动出票数据

      channelName: '',  // 渠道名称
      channelDialog: false, // 渠道名称弹窗

      pageNum: 1,
      pageSize:10
    }
  },
  methods:{
    onChang(e){
      this.$forceUpdate()
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
      console.log(this.orderTime);
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
      this.$axios.post('/refund/query',this.searchData)
        .then(res =>{
          console.log(res);
          if(res.data.code === 0){
            this.dataList = res.data.data
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

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize=val;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;
    },
    /**
     * @Description: 获取渠道名称
     * @author Wish
     * @date 2020/3/16
    */

    handleSelect(val) {
      this.channelName = val.RefundChannel
    }

  },
  filters:{
    pagination(dataList,pageNum,pageSize){
      let offset = (pageNum - 1) * pageSize;//当前页第一条的索引
      return (offset + pageSize >= dataList.length) ? dataList.slice(offset, dataList.length) : dataList.slice(offset, offset + pageSize)
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped lang="less">
  .index{
    .search_header{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .search_box{
        display: inline-flex;
        align-items: center;
        margin-bottom: 15px;
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
          font-size: 14px;
        }
        &:not(:last-child){
          margin-right: 15px;
        }
      }
    }
    .main_table{

    }
    .main_pagination{
      margin-top: 25px;
    }
  }
/* 渠道名称弹窗 */
  .channel_dialog{
    /deep/.el-dialog__body{
      max-height: 800px;
      overflow-y: auto;
    }
  }
</style>
