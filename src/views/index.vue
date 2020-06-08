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
         width="130"
         label="操作">
          <template slot-scope="scope">
            <div class="table_setting" style="display: flex">
              <el-button size="mini" @click="updateBtn(scope.row)" class="table_setting_ico" type="primary">更新</el-button>
            <el-button size="mini" @click="updateAgainBtn(scope.row)" class="table_setting_ico" type="warning">再提</el-button>
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

    this.dataList.push({
      Attachment: "",
      ChannelType: "BOP",
      Headers: "",
      ID: 1,
      OperateDepartment: "国际机票┝正航组┝去哪儿组",
      Operator: "国际机票┝正航组┝综合组┝出票/退改┠张媚(9682)",
      OriginalData:
        '{  "ApiInfo": null,  "Attachments": [  ],  "AuditorName": "国际机票┝正航组┝综合组┝出票/退改┠张媚(9682)",  "AuditorTime": "2020-05-12T11:03:02.8407853",  "BuyAmount": -1148,  "BuyOrders": [    {      "BuyAmount": -1148,      "BuyChannel": {        "Account": "CKG177",        "AccountAbbr": "CKG177|CKG177",        "ChannelInt": null,        "ChannelType": "BOP",        "ChannelTypeName": "BOP",        "Id": 24,        "Name": "wiken_test",        "NameAbbr": "BOP_CKG177|BOP_CKG177",        "OrderCapacity": "It",        "Organization": null,        "OrganizationId": null,        "PaymentId": 166,        "PaymentName": "BOP_CKG177",        "Remark": "",        "SaleBuyCapacity": "Buy"      },      "BuyForeignAmount": -1148,      "CreationTime": "2020-05-12T10:46:13.1986257",      "Currency": "CNY",      "ExchangeRate": 1,      "ExtensionData": "{"SubmitMsg":"申请提交__2020-05-13 10:52:04┠ ()@_@提交失败__2020-05-13 10:33:53__7:没有TicketRefund权限!@_@申请提交__2020-05-13 10:33:38┠ ()@_@提交失败__2020-05-13 10:33:03__7:没有TicketRefund权限!@_@申请提交__2020-05-13 10:32:47┠ ()@_@","SubmitUser":"()","SubmitTime":"2020-05-13 10:52:04"}",      "GdsName": "TravelSky",      "Id": 68808,      "IsVoluntary": true,      "OfficeNo": "CKG177",      "OuterBuyOderId": null,      "Passengers": [        {          "AirRax": 0,          "BuyAdjustPrice": 0,          "BuyAdjustServiceFee": 0,          "BuyAgencyFee": 0,          "BuyAirRax": 0,          "BuyCashBack": 0,          "BuyChangePrice": 0,          "BuyDelayFee": 0,          "BuyInsurePrice": 0,          "BuyOtherFee": 0,          "BuyRebate": 0,          "BuyRefundFee": 0,          "BuyServiceFee": 0,          "BuySum": -1148,          "BuyTaxDetail": "",          "BuyTicketPrice": -750,          "BuyTicketTax": -398,          "CertNo": "TZ1276596",          "CertType": "Passport",          "Id": 96193,          "Name": "TAKEDA/AMIME",          "PassengerType": "Adult",          "PassengerVoyages": [            {              "Id": 1491455,              "TicketNo": "7843397179293",              "VoyageId": 2385173            }          ],          "SaleAdjustPrice": 0,          "SaleAdjustServiceFee": 0,          "SaleAgencyFee": 0,          "SaleCashBack": 0,          "SaleChangePrice": 0,          "SaleDelayFee": 0,          "SaleInsurePrice": 0,          "SaleOtherFee": 0,          "SaleRebate": 0,          "SaleRefundFee": 0,          "SaleServiceFee": 0,          "SaleSum": -1118,          "SaleTicketPrice": -720,          "SaleTicketTax": -398        }      ],      "Paylogs": null,      "Pnr": {        "BigPnrCode": "PX3H4Y",        "GdsName": "TravelSky",        "Id": "1523815",        "OfficeNo": "CKG177",        "PnrCode": "KY302Z",        "Source": "BySale",        "SourceNo": "202003131404370512"      },      "ReceivedAmount": 0,      "RefundBuyOrderNo": "202005121046130012",      "RefundStatus": "NonePay",      "RefundType": null,      "SubmitStatus": "NotSubmit"    },    {      "BuyAmount": -1148,      "BuyChannel": {        "Account": "CKG177",        "AccountAbbr": "CKG177|CKG177",        "ChannelInt": null,        "ChannelType": "BOP",        "ChannelTypeName": "BOP",        "Id": 24,        "Name": "wiken_test",        "NameAbbr": "BOP_CKG177|BOP_CKG177",        "OrderCapacity": "It",        "Organization": null,        "OrganizationId": null,        "PaymentId": 166,        "PaymentName": "BOP_CKG177",        "Remark": "",        "SaleBuyCapacity": "Buy"      },      "BuyForeignAmount": -1148,      "CreationTime": "2020-05-12T10:46:13.1986257",      "Currency": "CNY",      "ExchangeRate": 1,      "ExtensionData": "{"SubmitMsg":"申请提交__2020-05-13 10:52:04┠ ()@_@提交失败__2020-05-13 10:33:53__7:没有TicketRefund权限!@_@申请提交__2020-05-13 10:33:38┠ ()@_@提交失败__2020-05-13 10:33:03__7:没有TicketRefund权限!@_@申请提交__2020-05-13 10:32:47┠ ()@_@","SubmitUser":"()","SubmitTime":"2020-05-13 10:52:04"}",      "GdsName": "TravelSky",      "Id": 68807,      "IsVoluntary": true,      "OfficeNo": "CKG177",      "OuterBuyOderId": null,      "Passengers": [        {          "AirRax": 0,          "BuyAdjustPrice": 0,          "BuyAdjustServiceFee": 0,          "BuyAgencyFee": 0,          "BuyAirRax": 0,          "BuyCashBack": 0,          "BuyChangePrice": 0,          "BuyDelayFee": 0,          "BuyInsurePrice": 0,          "BuyOtherFee": 0,          "BuyRebate": 0,          "BuyRefundFee": 0,          "BuyServiceFee": 0,          "BuySum": -1148,          "BuyTaxDetail": "",          "BuyTicketPrice": -750,          "BuyTicketTax": -398,          "CertNo": "TZ1276596",          "CertType": "Passport",          "Id": 96193,          "Name": "TAKEDA/AMIME",          "PassengerType": "Adult",          "PassengerVoyages": [            {              "Id": 1491455,              "TicketNo": "7843397179294",              "VoyageId": 2385173            }          ],          "SaleAdjustPrice": 0,          "SaleAdjustServiceFee": 0,          "SaleAgencyFee": 0,          "SaleCashBack": 0,          "SaleChangePrice": 0,          "SaleDelayFee": 0,          "SaleInsurePrice": 0,          "SaleOtherFee": 0,          "SaleRebate": 0,          "SaleRefundFee": 0,          "SaleServiceFee": 0,          "SaleSum": -1118,          "SaleTicketPrice": -720,          "SaleTicketTax": -398        }      ],      "Paylogs": null,      "Pnr": {        "BigPnrCode": "PX3H4Y",        "GdsName": "TravelSky",        "Id": "1523815",        "OfficeNo": "CKG177",        "PnrCode": "KY302Z",        "Source": "BySale",        "SourceNo": "202003131404370512"      },      "ReceivedAmount": 0,      "RefundBuyOrderNo": "202005121046130012",      "RefundStatus": "NonePay",      "RefundType": null,      "SubmitStatus": "NotSubmit"    }  ],  "BuyPnr": "",  "CancelReason": null,  "Contact": {    "Email": "qunaer@qq.com",    "Name": "去哪儿固定联系人",    "Phone": "15730076283",    "Tel": "888888"  },  "CreateDepartment": null,  "CreationTime": "2020-05-12T10:46:13.1516997",  "CreatorName": "Api_ImportOrder(Api_ImportOrder)",  "DeliveryInfo": "",  "ExchangeRate": 1,  "Id": 68797,  "IntlFlag": true,  "IsAbandon": false,  "IsVoluntary": false,  "KeepSeat": true,  "NeedDelivery": false,  "OrganizationUnitName": "国际机票┝正航组┝去哪儿组",  "OuterSaleOderId": "ysi200313140335837eb5e9",  "Passengers": [    {      "AirRax": 0,      "BuyAdjustPrice": 0,      "BuyAdjustServiceFee": 0,      "BuyAgencyFee": 0,      "BuyAirRax": 0,      "BuyCashBack": 0,      "BuyChangePrice": 0,      "BuyDelayFee": 0,      "BuyInsurePrice": 0,      "BuyOtherFee": 0,      "BuyRebate": 0,      "BuyRefundFee": 0,      "BuyServiceFee": 0,      "BuySum": -1148,      "BuyTaxDetail": "",      "BuyTicketPrice": -750,      "BuyTicketTax": -398,      "CertNo": "TZ1276596",      "CertType": "Passport",      "Id": 96193,      "Name": "TAKEDA/AMIME",      "PassengerType": "Adult",      "PassengerVoyages": [        {          "Id": 1491455,          "TicketNo": "7843397179293",          "VoyageId": 2385173        }      ],      "SaleAdjustPrice": 0,      "SaleAdjustServiceFee": 0,      "SaleAgencyFee": 0,      "SaleCashBack": 0,      "SaleChangePrice": 0,      "SaleDelayFee": 0,      "SaleInsurePrice": 0,      "SaleOtherFee": 0,      "SaleRebate": 0,      "SaleRefundFee": 0,      "SaleServiceFee": 0,      "SaleSum": -1118,      "SaleTicketPrice": -720,      "SaleTicketTax": -398    }  ],  "PassengersName": "TAKEDA/AMIME",  "Paylogs": [  ],  "Pnr": {    "BigPnrCode": "PX3H4Y",    "GdsName": "TravelSky",    "Id": "1523815",    "OfficeNo": "CKG177",    "PnrCode": "KY302Z",    "Source": "BySale",    "SourceNo": "202003131404370512"  },  "ProfitCenters": {    "Code": "00030002",    "DepartmentCodeList": "|202|120|",    "DepartmentNameList": "票务国际机票┝正航组┝去哪儿组,畅游国际机票┝正航组┝去哪儿组",    "Id": "201811081627290003",    "Name": "国际正航去哪儿组",    "Params": {      "AsmsAcount": "9690",      "AsmsPwd": "For123",      "Dh": "",      "Sj": "18983760075",      "UserId": "9639",      "Xm": "叶旺",      "Yx": "",      "id": null    },    "Remark": "去哪国际、去哪特惠、去哪畅游国际",    "SubsetList": null,    "id": "201811081627290003"  },  "Reason": "因航班取消延误，申请全退",  "ReceivedAmount": 0,  "RefundAmount": 0,  "RefundOrderNo": "202005121046130012",  "RefundStatus": "NonePay",  "Remark": "",  "SaleAmount": -1118,  "SaleCurrency": "CNY",  "SaleForeignAmount": -1118,  "SalePnr": "KY302Z",  "Status": "Checked",  "TicketNo": "7843397179293",  "Voyages": [    {      "Airline": "CZ",      "ArrAirport": "NRT",      "ArrTerminal": "T1",      "ArrTime": "2020-06-30T13:25:00+08:00",      "Cabin": "T",      "DepAirport": "PVG",      "DepTerminal": "T1",      "DepTime": "2020-06-30T09:05:00+08:00",      "FlightNo": "CZ6051",      "Id": 2385173,      "SegmentRph": 1    }  ]}',
      PNR: "1223",
      PNRChanged: "KY302Z",
      PassengerName: "TAKEDA/AMIME",
      PlatformOrderNo: "123456",
      PurchaseID: "68808",
      RealRefundPrice: "",
      RefundAccount: "",
      RefundChannel: "wiken_test",
      RefundMsg: "20200521T11:45:37:退票成功|就是成功了",
      RefundPrice: -1148,
      RefundReason: "因航班取消延误，申请全退",
      RefundStatus: "退票成功",
      RefundTime: "2020-05-12T18:46:13+08:00",
      RefundType: "自愿",
      SubmitTime: "2020-05-12T18:46:13+08:00",
      TicketNos: "7843397179293,0",
      UpdateTime: "2020-05-21T11:45:38+08:00",
      VoyageInfos: "PVG-NRT",
      YATPOrderNo: "68797"
    });
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
