<template>
  <div class="index">
    <div class="header">
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="drawer_btn" @click="jumpRouter('/setting')">配置页面</div>
      <div class="drawer_btn" @click="jumpRouter('/statistics')">退票统计</div>
      <div class="drawer_btn" @click="jumpRouter('/readme')">接口文档</div>
      <div class="drawer_btn" @click="jumpRouter('/swagger/index.html',true)">Swagger</div>
    </div>
    <div class="search_header">
      <div class="search_box search_name">
        <span>退票渠道：</span>
        <el-select
          :popper-append-to-body="false"
          @input="onChang($event)"
          v-model="searchData.refund_channel"
          clearable
          size="mini"
          placeholder="请选择"
        >
          <el-option
            v-for="item in orderName"
            :key="item.ID"
            :label="item.channel_name"
            :value="item.channel_name"
          ></el-option>
        </el-select>
      </div>

      <div class="search_box">
        <span>YATP订单号：</span>
        <el-input size="mini" clearable v-model="searchData.yatp_order_no"></el-input>
      </div>

      <div class="search_box">
        <span>退票订单号：</span>
        <el-input size="mini" clearable v-model="searchData.platform_orderNo"></el-input>
      </div>

      <div class="search_box">
        <span>退票类型：</span>
        <el-select v-model="searchData.refund_type" clearable size="mini" placeholder="请选择">
          <el-option
            v-for="item in orderType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="search_header">
      <div class="search_box">
        <span>提交状态：</span>
        <el-select v-model="searchData.refund_status" clearable size="mini" placeholder="请选择">
          <el-option
            v-for="item in orderStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
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
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>

      <div class="search_box">
        <el-button size="mini" type="primary" @click="searchBtn()">搜索</el-button>
      </div>
    </div>


    <div class="tools_header">
      <el-button size="mini">导出模板</el-button>

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
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <ex-table-column type="selection" width="40" align="center"></ex-table-column>

        <ex-table-column
        align="center"
         :autoFit="true"
         width="65"
         label="操作">
          <template slot-scope="scope">
            <div class="table_setting" style="display: flex">
              <el-button size="mini" @click="updateBtn(scope.row)" class="table_setting_ico" type="primary">更新</el-button>
<!--            <el-button size="mini" @click="updateAgainBtn(scope.row)" class="table_setting_ico" type="warning">再提</el-button>-->
            </div>
          </template>
        </ex-table-column>

        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="RefundStatus"
          label="退票状态"
          width="100"
        ></ex-table-column>

        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="RefundType"
          label="退票类型"
          width="100"
        ></ex-table-column>

        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="ChannelType"
          width="50"
          label="渠道类型"
        ></ex-table-column>

        <ex-table-column
          :autoFit="true"
          align="center"
          show-overflow-tooltip
          prop="RefundChannel"
          label="退票渠道"
        ></ex-table-column>

        <ex-table-column :autoFit="true" align="center" show-overflow-tooltip label="PNR">
          <template slot-scope="scope">
            <div class="jumpDetalis" @click="jumpDetails(scope.row)">
              <el-link v-if="scope.row.PNR" class="pnrText" type="primary">{{scope.row.PNR}}</el-link>
              <el-link
                v-if="scope.row.PNRChanged"
                :class="scope.row.PNR?'newPnrText':'pnrText'"
                :type="scope.row.PNR?'danger':'primary'"
              >{{scope.row.PNRChanged}}</el-link>
            </div>
          </template>
        </ex-table-column>

        <ex-table-column
          align="center"
          width="150"
          :autoFit="true"
          show-overflow-tooltip
          prop="PlatformOrderNo"
          label="退票订单号"
        ></ex-table-column>

        <ex-table-column
          align="center"
          :autoFit="true"
          width="65"
          show-overflow-tooltip
          prop="YATPOrderNo"
          label="YATP订单号"
        ></ex-table-column>

        <ex-table-column
          align="center"
          :autoFit="true"
          width="65"
          show-overflow-tooltip
          prop="PurchaseID"
          label="采购单号"
        ></ex-table-column>

        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="RefundMsg"
          label="返回消息"
        ></ex-table-column>

        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="RefundPrice"
          width="70"
          label="应退金额"
        ></ex-table-column>
        <ex-table-column
          align="center"
          :autoFit="true"
          width="70"
          show-overflow-tooltip
          prop="RealRefundPrice"
          label="实退金额"
        ></ex-table-column>
        <ex-table-column
          align="center"
          width="100"
          :autoFit="true"
          show-overflow-tooltip
          label="更新时间"
        >
          <template slot-scope="scope">
            <div class="table_hidden_txt">
              <span></span>
              <p>{{$getTime(scope.row.SubmitTime)}}</p>
            </div>
          </template>
        </ex-table-column>

        <!-- <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="OperateDepartment"
          label="运营部门"
        >
          <template slot-scope="scope">
            <div class="table_hidden_txt">
              <span></span>
              <p>{{scope.row.OperateDepartment}}</p>
            </div>
          </template>
        </ex-table-column>-->

        <!-- <ex-table-column align="center" :autoFit="true" show-overflow-tooltip label="票号信息">
          <template slot-scope="scope">
            <div
              style="overflow: hidden;text-overflow: ellipsis;cursor: pointer"
              @click="openTicketMessage(scope.row.TicketNos)"
            >{{scope.row.TicketNos}}</div>
          </template>
        </ex-table-column>-->

        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="RefundReason"
          label="退票原因"
        ></ex-table-column>
        <!-- <ex-table-column
          align="center"
          :autoFit="true"
          width="70"
          show-overflow-tooltip
          prop="RefundAccout"
          label="帐号"
        ></ex-table-column>-->

        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          label="操作员"
          prop="Operator"
        >
          <template slot-scope="scope">
            <div class="table_hidden_txt">
              <span></span>
              <p>{{scope.row.Operator}}</p>
            </div>
          </template>
        </ex-table-column>

        <!-- <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="Attachment"
          width="65"
          label="非自愿附件"
        ></ex-table-column>-->
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

        <div class="table_setting"></div>
      </div>
    </div>

    <el-dialog
      custom-class="channel_dialog"
      :title="channelName"
      :visible.sync="channelDialog"
      width="500"
    >
      <el-table border>
        <ex-table-column align="center" prop="channel_name" label="渠道名称"></ex-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      custom-class="channel_dialog"
      title="票号信息"
      :visible.sync="ticketMessageDialog"
      width="400px"
    >
      <div>
        <div
          v-for="(item,index) in ticketMessageList"
          :key="index"
        >票号：{{item.split(',')[0]}}&nbsp;&nbsp;&nbsp;状态：{{item.split(',')[1] === '0'? '已提交': '未提交'}}</div>
        <div
          v-if="ticketMessage"
        >票号：{{ticketMessage.split(',')[0]}}&nbsp;&nbsp;&nbsp;状态：{{ticketMessage.split(',')[1] === '0'? '已提交': '未提交'}}</div>
      </div>
    </el-dialog>

    <!-- <el-drawer
      title="我是标题"
      append-to-body
      size="170px"
      :visible.sync="drawer"
      direction="ltr"
      :with-header="false"
    >
      <div class="drawer_main">
        <div class="logo">
          <img src="../assets/logo.png" alt />
        </div>
        <div class="drawer_box">
          <div class="drawer_btn" @click="jumpRouter('/setting')">配置页面</div>
          <div class="drawer_btn" @click="jumpRouter('/statistics')">退票统计</div>
          <div class="drawer_btn" @click="jumpRouter('/readme')">接口文档</div>
          <div class="drawer_btn" @click="jumpRouter('/swagger/index.html',true)">Swagger</div>
        </div>
      </div>
    </el-drawer>-->

    <el-dialog
      custom-class="update_setting"
      title="更新退票状态"
      :visible.sync="updateSettingDialog"
      width="600px"
    >
      <div class="update_setting_main">
        <el-form ref="form" label-width="140px">
          <!-- <el-form-item label="">
            <el-input v-model="updateSetting.buyOrders"></el-input>
          </el-form-item> -->

          <el-form-item label="">
            <el-switch
              v-model="updateSetting.intlFlag"
              active-text="国际"
              inactive-text="国内">
            </el-switch>
          </el-form-item>
          

          <el-form-item label="平台退票单号">
            <el-input v-model="updateSetting.platformRefundId"></el-input>
          </el-form-item>

          <el-form-item label="平台退票单号">
            <el-input v-model="updateSetting.platformRefundId"></el-input>
          </el-form-item>

          <el-form-item label="状态">
            <el-input v-model="updateSetting.status"></el-input>
          </el-form-item>


          <el-form-item label="YATP 退票单号">
            <el-input v-model="updateSetting.yatpRefundId"></el-input>
          </el-form-item>


        </el-form>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateSettingDialog = false">关 闭</el-button>
        <el-button type="primary" @click="updateSettingDialog = false">确 定</el-button>
      </div>
    </el-dialog>



    <el-dialog
      custom-class="update_setting"
      title="再次提交"
      :visible.sync="updateAgainSettingDialog"
      width="600px"
    >
      <div class="update_setting_main">
        <el-form ref="form" label-width="140px">
          

        </el-form>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateAgainSettingDialog = false">关 闭</el-button>
        <el-button type="primary" @click="updateAgainSettingDialog = false">确 定</el-button>
      </div>
    </el-dialog>



  </div>
</template>

<script>
import elTableInfiniteScroll from "el-table-infinite-scroll";
export default {
  name: "index",
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll
  },
  data() {
    return {
      drawer: false, // 菜单

      searchData: {
        offset: 0,
        limit: 20
      },
      orderTime: "", // 退票申请时间
      orderType: [
        {
          // 退票类型
          value: "自愿",
          label: "自愿"
        },
        {
          value: "非自愿",
          label: "非自愿"
        }
      ],
      orderStatus: [
        {
          // 提交状态
          value: "已提交",
          label: "已提交"
        },
        {
          value: "未提交",
          label: "未提交"
        },
        {
          value: "退票失败",
          label: "退票失败"
        },
        {
          value: "退票成功",
          label: "退票成功"
        },
        {
          value: "已拒单",
          label: "已拒单"
        }
      ],

      orderName: [], // 渠道名称

      dataList: [], // 自动出票数据

      channelName: "", // 渠道名称
      channelDialog: false, // 渠道名称弹窗

      loadStatus: false,

      ticketMessageDialog: false, // 票号信息弹窗
      ticketMessageList: [], // 票号信息列表
      ticketMessage: "", // 票号信息
      // pageNum: 1,
      // pageSize:10

      updateSettingDialog: false, // 更新退票状态
      updateSetting: {}, // 更新状态数据

      updateAgainSettingDialog: false, // 再次提交弹窗
    };
  },
  methods: {
    onChang(e) {
      this.$forceUpdate();
    },

    load() {
      if (this.loadStatus) {
        this.searchData.offset =
          this.searchData.offset + this.searchData.limit + 1;
        this.getData();
      }
    },
    searchBtn() {
      this.dataList = [];
      this.searchData.offset = 0;
      this.searchData.limit = 20;
      this.loadStatus = false;
      this.getData();
    },

    /**
     * @Description: 打开侧边框
     * @author Wish
     * @date 2020/4/10
     */
    openDrawer() {
      this.drawer = true;
    },

    /**
     * @Description: 退票查询接口
     * @author Wish
     * @date 2020/3/13
     */
    getData() {
      /**
       * @Description: 当前日期判断 - 时间格式转换
       * @author Wish
       * @date 2020/3/13
       */
      if (this.orderTime) {
        // if(thisDate >= new Date(this.orderTime[0]).getTime()){
        //   this.$message.warning('请选择大于当前日期')
        // }else {
        this.searchData["start_time"] = new Date(
          this.orderTime[0]
        ).toISOString();
        this.searchData["end_time"] = this.orderTime[1] + "T23:59:59.000Z";
        // }
      } else {
        delete this.searchData.start_time;
        delete this.searchData.end_time;
      }
      if (this.searchData.refund_type === "") {
        delete this.searchData.refund_type;
      }
      this.$axios
        .post("/refund/query", this.searchData)
        .then(res => {
          if (res.data.code === 0) {
            if (res.data.data && res.data.data.length > 0) {
              this.loadStatus = true;
              this.dataList = this.dataList.concat(res.data.data);
            } else {
              this.loadStatus = false;
              this.$message.warning("暂无更多数据");
            }

            console.log(this.dataList);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
          this.$message.error(err.message);
        });
    },

    /**
     * @Description: 跳转接口文档
     * @author Wish
     * @date 2020/3/27
     */
    jumpRouter(url, type) {
      if (type) {
        window.open(url);
      } else {
        this.$router.push(url);
      }
    },

    /**
     * @Description: 票号信息
     * @author Wish
     * @date 2020/3/30
     */
    openTicketMessage(val) {
      if (val.indexOf(";") !== -1) {
        this.ticketMessageList = val.split(";");
        this.ticketMessage = "";
      } else if (val !== "") {
        this.ticketMessage = val;
        this.ticketMessageList = [];
      } else {
        return this.$message.warning("暂无数据");
      }
      this.ticketMessageDialog = true;
    },

    /**
     * @Description: 打开渠道名称弹窗
     * @author Wish
     * @date 2020/3/16
     */
    openChannelDialog() {
      if (this.channelName) {
        this.channelDialog = true;
        let data = {
          project: this.channelName
        };
        this.$axios.post("/config/get", data).then(res => {
          console.log(res);
        });
      } else {
        this.$message.warning("请选择一条数据");
      }
    },

    getChannelList() {
      let data = {
        project: ""
      };
      this.$axios.post("/config/get", data).then(res => {
        if (res.data.code === 0) {
          this.orderName = res.data.data;
        } else {
          this.$message.warning(res.data.msg);
        }
      });
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
      this.channelName = val.RefundChannel;
    },

    /**
     * @description: 表格勾选
     * @param {type}
     * @return:
     */
    handleSelectionChange(val) {
      console.log(val);
    },

    /**
     * @description: 修改按钮
     * @param {type}
     * @return:
     */

    updateBtn(data) {
      console.log(data);
      this.updateSettingDialog = true
    },

    /**
     * @description: 再次提交数据
     * @param {type} 
     * @return: 
     */    
    updateAgainBtn(data){
      console.log(data);
      this.updateAgainSettingDialog = true
    },

    /**
     * @Description: 跳转详情
     * @author Wish
     * @date 2020/6/8
    */
    jumpDetails(val) {
      console.log(val);
      let routeData = this.$router.resolve({
        path: "/settingDetails",
        query: {
          id: val.ID,
          time: val.SubmitTime
        }
      });
      window.open(routeData.href, '_blank');
    }
  },
  filters: {
    pagination(dataList, pageNum, pageSize) {
      let offset = (pageNum - 1) * pageSize; //当前页第一条的索引
      return offset + pageSize >= dataList.length
        ? dataList.slice(offset, dataList.length)
        : dataList.slice(offset, offset + pageSize);
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    this.getChannelList();
    window.addEventListener('storage', (e) => {
      console.log(e)
      this.getData();
      localStorage.clear()
    })

    this.dataList.push({
      Attachment: "",
      ChannelType: "BOP",
      Headers: '{"Header":{"biz_source":null,"exchangeName":"YS.机票.退票","message_key":"Id","message_num":"1","message_type":"refund_order_buy_notsubmit","message_value":"73539","process_id":"b9c53503-262d-402f-9eca-96e5912651f7","process_stage":null,"replyTo":"ys.buychannel.refund.callBack","reservation_key":null,"reservation_type":null,"trace_id":null},"ReplyTo":"","CorrelationID":"","MessageID":"ef0e9073-b28a-4489-ace7-a9f8d33a4e8d","Extra":null}',
      ID: 17,
      OperateDepartment: "国际机票┝正航组┝去哪儿组",
      Operator: "Api_ImportOrder(Api_ImportOrder)",
      OriginalData: '{"ApiInfo":null,"Attachments":[],"AuditorName":"国际机票┝正航组┝综合组┝出票/退改┠张媚(9682)","AuditorTime":"2020-06-09T17:11:17.6158236","BuyAmount":-969,"BuyOrders":[{"IsVoluntary":false,"RefundBuyOrderNo":"202006091459140025","OuterBuyOderId":"","BuyChannel":{"Account":"CKG177","AccountAbbr":"CKG177|CKG177","ChannelInt":"","ChannelType":"BOP","ChannelTypeName":"BOP","SaleBuyCapacity":"Buy","OrderCapacity":"It","Name":"BOP_CKG177","NameAbbr":"BOP_CKG177|BOP_CKG177","Remark":"","Organization":"","OrganizationId":"","PaymentId":166,"PaymentName":"BOP_CKG177","Id":24},"Pnr":{"BigPnrCode":"PX9HM0","GdsName":"TravelSky","Id":"1539545","OfficeNo":"CKG177","PnrCode":"HQK49C","Source":"BySale","SourceNo":"202004131407590010"},"GdsName":"TravelSky","OfficeNo":"CKG177","Currency":"CNY","ExchangeRate":1,"BuyAmount":-969,"BuyForeignAmount":-969,"ReceivedAmount":0,"RefundType":"","SubmitStatus":"NotSubmit","RefundStatus":"NonePay","Passengers":[{"PassengerId":null,"ChangePassengerId":"","PassengerVoyages":[{"TicketNo":"8263397318383","Id":1509393,"VoyageId":2408952}],"RefundCenterDETR":"{\"blackScreen\":\"{\\\"UsedFare\\\":0.0,\\\"Taxs\\\":{\\\"CN\\\":90.00,\\\"YQ\\\":29.00,\\\"YR\\\":280.00},\\\"Data\\\":{\\\"PassengerName\\\":\\\"QIN/SAI MS\\\",\\\"Endorsement\\\":\\\"Q/NON-END/PENALTY\\\",\\\"OldTicketNo\\\":\\\"\\\",\\\"TripInfos\\\":[{\\\"TripCode\\\":\\\"O\\\",\\\"TripNo\\\":\\\"1\\\",\\\"Airline\\\":\\\"GS\\\",\\\"FlightNo\\\":\\\"\\\",\\\"Cabin\\\":\\\"N\\\",\\\"CabinMark\\\":null,\\\"FromCity\\\":\\\"TSN\\\",\\\"FromAirport\\\":\\\"TSN\\\",\\\"ToCity\\\":\\\"TYO\\\",\\\"ToAirport\\\":\\\"HND\\\",\\\"FormTerminal\\\":\\\"T1\\\",\\\"ToTerminal\\\":\\\"L\\\",\\\"TicketNoStatus\\\":\\\"OPEN FOR USE\\\",\\\"FlightDate\\\":\\\"\\\",\\\"FareBasis\\\":\\\"NLOW1CN\\\",\\\"DepartureTime\\\":\\\"\\\",\\\"ArrivalTime\\\":\\\"\\\",\\\"Luggage\\\":\\\"1PC\\\",\\\"TicketNo\\\":\\\"8263397318383\\\",\\\"Pnr\\\":null}],\\\"itinerary\\\":null},\\\"CostInfo\\\":{\\\"Currency\\\":\\\"CNY\\\",\\\"ROEValue\\\":6.94997,\\\"NUCValue\\\":86.33,\\\"CNFee\\\":90.00,\\\"YQFee\\\":29.00,\\\"YRFee\\\":280.00,\\\"Taxs\\\":{\\\"CN\\\":90.00,\\\"YQ\\\":29.00,\\\"YR\\\":280.00},\\\"Price\\\":600.00,\\\"Tax\\\":399.00,\\\"AgencyFee\\\":5.0,\\\"EXCH\\\":null,\\\"CONJTKT\\\":\\\"\\\",\\\"IssueDate\\\":\\\"2020-04-13T00:00:00\\\",\\\"Pnr\\\":\\\"HQK49C\\\",\\\"TripList\\\":[{\\\"Airline\\\":\\\"GS\\\",\\\"FromAirport\\\":\\\"TSN\\\",\\\"ToAirport\\\":\\\"HND\\\",\\\"Share\\\":false,\\\"FlightNo\\\":\\\"7989\\\",\\\"Cabin\\\":\\\"N\\\",\\\"FlyDate\\\":\\\"2020-06-16 20:05\\\"}],\\\"TripPriceList\\\":[{\\\"Airline\\\":\\\"GS\\\",\\\"FromCity\\\":\\\"TSN\\\",\\\"ToCity\\\":\\\"TYO\\\",\\\"Share\\\":false,\\\"FlightNo\\\":\\\"7989\\\",\\\"Cabin\\\":\\\"N\\\",\\\"FlyDate\\\":\\\"2020-06-16 20:05\\\",\\\"QValue\\\":0.0,\\\"SValue\\\":0.0,\\\"OtherValue\\\":null,\\\"Value\\\":86.33,\\\"Mileage\\\":0}]},\\\"Error\\\":0,\\\"Message\\\":\\\"获取要退的税详情成功\\\",\\\"EtermStr\\\":[\\\"\\u003eDETR TN/8263397318383\\\",\\\"DETR TN/8263397318383\\\\t\\\\rISSUED BY: TIANJIN AIRLINES          ORG/DST: TSN/TYO                 BSP-I\\\\rE/R: Q/NON-END/PENALTY APPLY\\\\rTOUR CODE: INTJN2002A                                        \\\\rPASSENGER: QIN/SAI MS\\\\rEXCH:                               CONJ TKT: \\\\rO FM:1TSN GS    OPEN  N OPEN          NLOW1CN          /16JUN1 1PC OPEN FOR USE\\\\r     T1L  RL:                                                     IRR\\\\r  TO: HND\\\\rFARE:           CNY  600.00|FOP:CASH\\\\rTAX:            CNY 90.00CN|OI: \\\\rTAX:            CNY 29.00YQ|\\\\rTAX:            CNY280.00YR|\\\\rTOTAL:          CNY  999.00|TKTN: 826-3397318383\\\",\\\"\\u003ertkt 8263397318383\\\",\\\"    GRANT AVIATION                                      08316954                   Q/NON-END/PENALTY APPLY                 TSNTYO       YAKE                                                      13APR20  HQK49C/1E    CKG177                     QIN/SAI MS                                           DEV-10                                                                              52666  8UC O             TIANJIN       TSNGS  7989 N 16JUN 2005  OKNLOW1CN             16JUN1PC          TOKYO HANEDA AHND    VOID                                                       VOID                 VOID                                                       VOID                 VOID                                                       VOID                                                                          CNY  600.00A16JUN20TSN GS TYO86.33NUC86.33END ROE6.949970                                                                                                       CN    90.00                                                                     YQ    29.00                                                                     YR   280.00CASH(CNY)                                      INTJN2002A            CNY  999.00                                                                                    3397318383                CNY600.00            500 399.00\\\"],\\\"EtermTraffic\\\":6}\"}","Name":"QIN/SAI","PassengerType":"Adult","CertType":"Passport","CertNo":"E41284194","SaleTicketPrice":-568,"SaleTicketTax":-399,"SaleInsurePrice":0,"SaleChangePrice":0,"SaleAgencyFee":0,"SaleRebate":0,"SaleCashBack":0,"SaleAdjustPrice":0,"SaleServiceFee":0,"SaleAdjustServiceFee":0,"SaleDelayFee":0,"SaleOtherFee":0,"SaleSum":-967,"BuyTicketPrice":-600,"BuyTicketTax":-399,"BuyAgencyFee":30,"SaleRefundFee":0,"BuyRebate":0,"BuyCashBack":0,"BuyInsurePrice":0,"BuyChangePrice":0,"BuyAdjustPrice":0,"BuyServiceFee":0,"BuyAdjustServiceFee":0,"BuyDelayFee":0,"BuyRefundFee":0,"BuyOtherFee":0,"BuySum":-969,"BuyTaxDetail":"","Id":101939}],"Paylogs":"","CreationTime":"2020-06-09T14:59:14.4892252","Id":73548,"ExtensionData":"{\"TicketTime\":\"2020-04-13 15:07\",\"BuyRefundReason\":\"因航班取消延误，申请全退\",\"SubmitMsg\":\"申请提交__2020-06-10 09:47:27┠ 信息中心-坤昌┝研发部┝YATP组┠文康(7921)@_@\",\"SubmitUser\":\"信息中心-坤昌┝研发部┝YATP组┠文康(7921)\",\"SubmitTime\":\"2020-06-10 09:47:27\"}"}],"BuyPnr":"","CancelReason":null,"Contact":{"Email":"qunaer@qq.com","Name":"去哪儿固定联系人","Phone":"15730076283","Tel":"888888"},"CreateDepartment":null,"CreationTime":"2020-06-09T14:59:14.4579398","CreatorName":"Api_ImportOrder(Api_ImportOrder)","DeliveryInfo":"","ExchangeRate":1,"Id":73539,"IntlFlag":true,"IsAbandon":false,"IsVoluntary":false,"KeepSeat":true,"NeedDelivery":false,"OrganizationUnitName":"国际机票┝正航组┝去哪儿组","OuterSaleOderId":"ysi20041314073145259434","Passengers":[{"AirRax":0,"BuyAdjustPrice":0,"BuyAdjustServiceFee":0,"BuyAgencyFee":30,"BuyAirRax":0,"BuyCashBack":0,"BuyChangePrice":0,"BuyDelayFee":0,"BuyInsurePrice":0,"BuyOtherFee":0,"BuyRebate":0,"BuyRefundFee":0,"BuyServiceFee":0,"BuySum":-969,"BuyTaxDetail":"","BuyTicketPrice":-600,"BuyTicketTax":-399,"CertNo":"E41284194","CertType":"Passport","Id":101939,"Name":"QIN/SAI","PassengerType":"Adult","PassengerVoyages":[{"Id":1509393,"TicketNo":"8263397318383","VoyageId":2408952}],"SaleAdjustPrice":0,"SaleAdjustServiceFee":0,"SaleAgencyFee":0,"SaleCashBack":0,"SaleChangePrice":0,"SaleDelayFee":0,"SaleInsurePrice":0,"SaleOtherFee":0,"SaleRebate":0,"SaleRefundFee":0,"SaleServiceFee":0,"SaleSum":-967,"SaleTicketPrice":-568,"SaleTicketTax":-399}],"PassengersName":"QIN/SAI","Paylogs":[],"Pnr":{"BigPnrCode":"PX9HM0","GdsName":"TravelSky","Id":"1539545","OfficeNo":"CKG177","PnrCode":"HQK49C","Source":"BySale","SourceNo":"202004131407590010"},"ProfitCenters":{"Code":"00030002","DepartmentCodeList":"|202|120|","DepartmentNameList":"票务国际机票┝正航组┝去哪儿组,畅游国际机票┝正航组┝去哪儿组","Id":"201811081627290003","Name":"国际正航去哪儿组","Params":{"AsmsAcount":"9690","AsmsPwd":"For123","Dh":"","Sj":"18983760075","UserId":"9639","Xm":"叶旺","Yx":"","id":null},"Remark":"去哪国际、去哪特惠、去哪畅游国际","SubsetList":null,"id":"201811081627290003"},"Reason":"因航班取消延误，申请全退","ReceivedAmount":0,"RefundAmount":0,"RefundOrderNo":"202006091459140025","RefundStatus":"NonePay","Remark":"","SaleAmount":-967,"SaleCurrency":"CNY","SaleForeignAmount":-967,"SalePnr":"HQK49C","Status":"Checked","TicketNo":"8263397318383","Voyages":[{"Airline":"GS","ArrAirport":"HND","ArrTerminal":"T1","ArrTime":"2020-06-17T00:05:00","Cabin":"N","DepAirport":"TSN","DepTerminal":"T1","DepTime":"2020-06-16T20:05:00","FlightNo":"GS7989","Id":2408952,"SegmentRph":1}]}',
      PNR: "HQK49C",
      PNRChanged: "QQQQQ",
      PassengerName: "QIN/SAI",
      PlatformOrderNo: "",
      PurchaseID: "73548",
      RealRefundPrice: "",
      RefundAccount: "",
      RefundChannel: "BOP_CKG177",
      RefundMsg: "20200610T100823:退票成功|退票操作成功",
      RefundPrice: -969,
      RefundReason: "因航班取消延误，申请全退",
      RefundStatus: "退票成功",
      RefundTime: "2020-06-09T22:59:14+08:00",
      RefundType: "非自愿",
      SubmitTime: "2020-06-09T22:59:14+08:00",
      TicketNos: "8263397318383,0",
      UpdateTime: "2020-06-10T10:08:24+08:00",
      VoyageInfos: "TSN-HND",
      YATPOrderNo: "73539",
    })
  }
};
</script>

<style scoped lang="less">
.index {
  position: relative;
  .header {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    font-size: 16px;
    background: #0070e2;
    margin-bottom: 15px;
    color: rgba(255, 255, 255, 0.8);
    .logo {
      height: 40px;
      margin-right: 2%;
      > img {
        height: 100%;
        object-fit: contain;
      }
    }
    &:hover .drawer_btn:not(:hover) {
      opacity: 0.7;
    }
    .drawer_btn {
      font-size: 16px;
      transition: opacity 0.2s;
      cursor: pointer;

      &:not(:last-child) {
        margin-right: 20px;
      }
    }
  }
  .search_header {
    display: flex;
    align-items: center;
    /*flex-wrap: wrap;*/
    .search_box {
      display: inline-flex;
      align-items: center;
      margin-bottom: 5px;

      &.search_name {
        /deep/.el-select-dropdown {
          /*max-height: 80vh;*/
          .el-scrollbar {
            .el-select-dropdown__wrap {
              max-height: 80vh;
              /*height: 80vh;*/
            }
          }
        }
      }
      .channel_input {
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        display: inline-block;
        color: #606266;
        height: 32px;
        line-height: 32px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        width: 215px;
        cursor: pointer;
        align-items: center;
        padding-left: 15px;
        font-size: 14px;
        &:hover {
          border-color: #c0c4cc;
        }
      }
      > span {
        flex-shrink: 0;
        display: block;
        font-size: 14px;
        min-width: 90px;
        text-align: right;
      }
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
  .tools_header{
    display: flex;
    padding: 5px 20px;
  }
  .main_table {
    margin-top: 10px;
    .table_hidden_txt {
      position: relative;
      /*padding-left: 10px;*/
      box-sizing: content-box;
      &::before {
        /*content: '...';*/
        float: right;
        position: relative;
        right: 100%;
        transform: translate(-100%, -100%);
      }
      p {
        overflow: hidden;
        text-align: right;
        display: flex;
        justify-content: flex-end;
        white-space: nowrap;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        word-break: break-all;
      }
    }

    .table_setting {
      display: flex;
      justify-content: center;
      align-items: center;

    }

    .jumpDetalis {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      line-height: 15px;
      .newPnrText {
        font-size: 12px;
        &::before {
          content: "新";
          display: inline-block;
          margin-right: 3px;
        }
      }
    }
  }
  .main_pagination {
  }
}
/* 渠道名称弹窗 */
.channel_dialog {
  /deep/.el-dialog__body {
    max-height: 800px;
    overflow-y: auto;
  }
}
.drawer_main {
  padding: 20px;
  .logo {
    width: 100%;
    height: 40px;
    > img {
      height: 100%;
      object-fit: contain;
    }
    margin-bottom: 15px;
  }
  .drawer_box {
    &:hover {
      .drawer_btn:not(:hover) {
        color: rgba(0, 0, 0, 0.4);
      }
      .drawer_btn:hover {
        color: rgba(0, 123, 255, 1);
      }
    }
    .drawer_btn {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      color: rgba(0, 0, 0, 1);

      &:not(:last-child) {
        margin-bottom: 5px;
        /*border-bottom: 1px solid #c1c1c1;*/
      }
    }
  }
}
</style>
