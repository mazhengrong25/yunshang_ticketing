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

    <div class="main_header">
      <el-radio-group v-model="statusCheck" @change="changeStatus" size="mini">
        <el-radio-button label="全部">
          <el-link :underline="false" type="primary">
            全部 (
            <span style="color: red">{{dataList.length}}</span>)
          </el-link>
        </el-radio-button>
        <el-radio-button v-for="(value, key, index) in statusListData" :label="key" :key="index">
          <el-link :underline="false" type="primary">
            {{key}} (
            <span style="color: red">{{value}}</span>)
          </el-link>
        </el-radio-button>
      </el-radio-group>
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
        <span>票号：</span>
        <el-input size="mini" clearable v-model="searchData.ticketNo"></el-input>
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

      <div class="search_box">
        <span>国内国际：</span>
        <el-select v-model="searchData.is_domestic" size="mini" placeholder="请选择">
          <el-option label="国内" :value="true"></el-option>
          <el-option label="国际" :value="false"></el-option>
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
        <span>PNR：</span>
        <el-input size="mini" clearable v-model="searchData.pnr"></el-input>
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
        v-if="isTableAlive"
        v-el-table-infinite-scroll="load"
        :data="dataList.filter(data => data.showStatus)"
        highlight-current-row
        stripe
        height="calc(100vh - 250px)"
        border
        size="small"
        @row-click="handleSelect"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <ex-table-column type="selection" width="40" align="center"></ex-table-column>

        <ex-table-column align="center" :autoFit="true" width="65" label="操作">
          <template slot-scope="scope">
            <div class="table_setting" style="display: flex">
              <el-button
                :disabled="scope.row.RefundStatus === '退票成功'"
                size="mini"
                @click="updateBtn(scope.row)"
                :class="['table_setting_ico',{'disabled': scope.row.RefundStatus === '退票成功'}]"
                type="primary"
              >更新</el-button>
            </div>
          </template>
        </ex-table-column>

        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="RefundStatus"
          label="退票状态"
          width="70"
        ></ex-table-column>

        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="RefundType"
          label="退票类型"
          width="70"
        ></ex-table-column>

        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="ChannelType"
          width="70"
          label="渠道类型"
        ></ex-table-column>

        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          prop="RefundReason"
          label="退票原因"
        ></ex-table-column>

        <ex-table-column
          align="center"
          width="120"
          show-overflow-tooltip
          prop="RefundChannel"
          label="退票渠道"
        ></ex-table-column>

        <ex-table-column width="120" align="center" show-overflow-tooltip label="PNR">
          <template slot-scope="scope">
            <div class="jumpDetalis" @click="jumpDetails(scope.row)">
              <el-link
                v-if="scope.row.PNRChanged"
                class="pnrText"
                type="primary"
              >{{scope.row.PNRChanged}}</el-link>
              <el-link
                v-if="scope.row.PNR"
                :class="scope.row.PNRChanged?'newPnrText':'pnrText'"
                :type="scope.row.PNRChanged?'danger':'primary'"
              >{{scope.row.PNR}}</el-link>
            </div>
          </template>
        </ex-table-column>

        <ex-table-column
          :autoFit="true"
          align="center"
          show-overflow-tooltip
          prop="PlatformOrderNo"
          label="退票单号"
        >
          <template v-slot="scope">
            <p v-for="(item, index) in scope.row.PlatformOrderNo" :key="index">{{item}}</p>
          </template>
        </ex-table-column>

        <ex-table-column
          align="center"
          width="200"
          :autoFit="true"
          show-overflow-tooltip
          prop="RefundMsg"
          label="退票信息"
        >
          <!--          <template slot-scope="scope">-->
          <!--            <div class="table_hidden_txt">-->
          <!--              <span></span>-->
          <!--              <p>{{scope.row.RefundMsg}}</p>-->
          <!--            </div>-->
          <!--          </template>-->
        </ex-table-column>

        <ex-table-column
          align="center"
          width="150"
          :autoFit="true"
          show-overflow-tooltip
          prop="TicketNos"
          label="票号"
        >
          <template v-slot="scope">
            <div v-for="(item ,index) in scope.row.TicketNos" :key="index">{{item}}</div>
          </template>
        </ex-table-column>

        <!--        <ex-table-column-->
        <!--          align="center"-->
        <!--          :autoFit="true"-->
        <!--          width="100"-->
        <!--          show-overflow-tooltip-->
        <!--          prop="YATPOrderNo"-->
        <!--          label="YATP订单号"-->
        <!--        ></ex-table-column>-->

        <!--        <ex-table-column-->
        <!--          align="center"-->
        <!--          :autoFit="true"-->
        <!--          width="100"-->
        <!--          show-overflow-tooltip-->
        <!--          prop="PurchaseID"-->
        <!--          label="采购单号"-->
        <!--        ></ex-table-column>-->

        <!--        <ex-table-column-->
        <!--          align="center"-->
        <!--          :autoFit="true"-->
        <!--          show-overflow-tooltip-->
        <!--          prop="RefundMsg"-->
        <!--          label="返回消息"-->
        <!--        ></ex-table-column>-->

        <ex-table-column
          align="center"
          :autoFit="true"
          show-overflow-tooltip
          width="70"
          label="应退金额"
        >
          <template slot-scope="scope">
            <div :class="Number(scope.row.RealRefundPrice) !== Number(scope.row.RefundPrice) && Number(scope.row.RealRefundPrice) !== 0?'red':''">{{scope.row.RefundPrice}}</div>
          </template>
        </ex-table-column>
        <ex-table-column
          align="center"
          :autoFit="true"
          width="70"
          show-overflow-tooltip
          prop="RealRefundPrice"
          label="实退金额"
        >
          <template slot-scope="scope">
            <div :class="Number(scope.row.RealRefundPrice) !== Number(scope.row.RefundPrice) && Number(scope.row.RealRefundPrice) !== 0?'red':''">{{scope.row.RealRefundPrice}}</div>
          </template>
        </ex-table-column>
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
              <p>{{$moment(new Date(scope.row.UpdateTime)).format('YYYY-MM-DD HH:mm:ss')}}</p>
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
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="updateSettingDialog"
      width="800px"
    >
      <div class="update_setting_main">
        <el-form
          ref="form"
          label-width="80px"
          v-for="(item, index) in updateSettingData.TicketNos"
          :key="index"
        >
          <el-form-item label="退票票号">{{item}}</el-form-item>
          <el-form-item label="退票单号">
            <el-input clearable v-model="updateSetting[index].platformRefundId"></el-input>
          </el-form-item>
          <el-form-item label="退票状态">
            <el-select
              style="width: 100%"
              clearable
              v-model="updateSetting[index].status"
              placeholder="请选择退票状态"
            >
              <el-option label="退票成功" value="0"></el-option>
              <el-option label="退票失败" value="1"></el-option>
              <el-option label="渠道不支持" value="2"></el-option>
              <el-option label="已拒单" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="退票信息">
            <el-input clearable v-model="updateSetting[index].message"></el-input>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input clearable v-model="updateSetting[index].remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-form label-width="80px" class>
          <el-form-item label="提交者">
            <el-input
              placeholder="请输入提交者"
              v-model="updateSettingUser"
              clearable
              class="update_setting_user"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="footer_btn_box">
          <el-button @click="updateSettingDialog = false">关 闭</el-button>
          <el-button type="primary" @click="submitUpdate()">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <!--    <el-dialog-->
    <!--      custom-class="update_setting"-->
    <!--      title="再次提交"-->
    <!--      :visible.sync="updateAgainSettingDialog"-->
    <!--      width="600px"-->
    <!--    >-->
    <!--      <div class="update_setting_main">-->
    <!--        <el-form ref="form" label-width="140px">-->
    <!--          -->

    <!--        </el-form>-->

    <!--      </div>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="updateAgainSettingDialog = false">关 闭</el-button>-->
    <!--        <el-button type="primary" @click="updateAgainSettingDialog = false">确 定</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
import elTableInfiniteScroll from "el-table-infinite-scroll";

export default {
  name: "index",
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll,
  },
  data() {
    return {
      isTableAlive: true, // 表格重载

      drawer: false, // 菜单

      searchData: {
        is_domestic: false,
        offset: 0,
        limit: 20,
      },
      orderTime: "", // 退票申请时间
      orderType: [
        {
          // 退票类型
          value: "自愿",
          label: "自愿",
        },
        {
          value: "非自愿",
          label: "非自愿",
        },
      ],
      orderStatus: [
        {
          // 提交状态
          value: "已提交",
          label: "已提交",
        },
        {
          value: "未提交",
          label: "未提交",
        },
        {
          value: "退票失败",
          label: "退票失败",
        },
        {
          value: "退票成功",
          label: "退票成功",
        },
        {
          value: "已拒单",
          label: "已拒单",
        },
        {
          value: "线下退",
          label: "线下退",
        },
        {
          value: "待确认",
          label: "待确认",
        },
        {
          value: "取消复核",
          label: "取消复核",
        },
        {
          value: "销账",
          label: "销账",
        },
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
      updateSetting: [], // 更新状态数据
      updateSettingUser: "", // 执行者
      updateSettingData: {},
      newSettingData: {},

      updateAgainSettingDialog: false, // 再次提交弹窗

      statusListData: {}, // 退票状态列表

      statusCheck: "全部", // 选中的退票状态
    };
  },
  methods: {
    /**
     * @Description: 重载
     * @author Wish
     * @date 2020/6/11
     */
    reload() {
      this.isTableAlive = false;
      this.$nextTick(() => (this.isTableAlive = true));
    },
    onChang(e) {
      this.$forceUpdate();
    },

    load() {
      if (this.loadStatus && this.statusCheck === "全部") {
        this.searchData.offset = this.searchData.offset + this.searchData.limit;
        this.getData();
      }
    },
    searchBtn() {
      this.dataList = [];
      this.searchData.offset = 0;
      this.searchData.limit = 20;
      this.loadStatus = false;
      this.getData();
      localStorage.setItem('search', this.searchData.is_domestic)
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
        this.searchData["start_time"] = new Date(
          this.orderTime[0]
        ).toISOString();
        this.searchData["end_time"] = this.orderTime[1] + "T23:59:59.000Z";
      } else {
        delete this.searchData.start_time;
        delete this.searchData.end_time;
      }
      if (this.searchData.refund_type === "") {
        delete this.searchData.refund_type;
      }
      this.$axios
        .post("/refund/query", this.searchData)
        .then((res) => {
          if (res.data.code === 0) {
            if (res.data.data && res.data.data.length > 0) {
              this.loadStatus = true;
              this.dataList = this.dataList.concat(res.data.data);

              let statusList = [];
              this.dataList.forEach((item, index) => {
                let numberID = [];
                let ticketNo = [];
                try {
                  item.TicketNos.split(";").forEach((titem) => {
                    ticketNo.push(titem.split(",").shift());
                  });
                  item.TicketNos = ticketNo;
                } catch (e) {
                  try {
                    item.TicketNos = item.TicketNos.split(",").shift();
                  } catch (e) {}
                }
                try {
                  item.PlatformOrderNo.split(";").forEach((no) => {
                    numberID.push(no.split(":")[1]);
                  });
                  item.PlatformOrderNo = numberID;
                  try {
                    item.RefundMsg = item.RefundMsg.split("@@")
                      .pop()
                      .split("^")
                      .pop();
                  } catch (e) {
                    try {
                      item.RefundMsg = item.RefundMsg.split("@@").pop();
                    } catch (e) {}
                  }
                } catch (e) {}
                item.PlatformOrderNo = [...new Set(item.PlatformOrderNo)];
                statusList.push(item.RefundStatus);
              });

              //'未提交':0,'已提交':0,'退票失败':0,'退票成功':0,'已拒单':0,'线下退':0,'待确认':0,'取消复核':0,'销账':0
              let statusObj = statusList.reduce((allNames, name) => {
                if (name in allNames) {
                  allNames[name]++;
                } else {
                  allNames[name] = 1;
                }
                return allNames;
              }, {});
              this.statusListData = {
                未提交: statusObj["未提交"] || 0,
                已提交: statusObj["已提交"] || 0,
                退票失败: statusObj["退票失败"] || 0,
                退票成功: statusObj["退票成功"] || 0,
                已拒单: statusObj["已拒单"] || 0,
                线下退: statusObj["线下退"] || 0,
                待确认: statusObj["待确认"] || 0,
                取消复核: statusObj["取消复核"] || 0,
                销账: statusObj["销账"] || 0,
              };
              this.changeStatus();
            } else {
              this.loadStatus = false;
              this.$message.warning("暂无更多数据");
            }
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch((err) => {
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
          project: this.channelName,
        };
        this.$axios.post("/config/get", data).then((res) => {
          console.log(res);
        });
      } else {
        this.$message.warning("请选择一条数据");
      }
    },

    getChannelList() {
      let data = {
        project: "",
      };
      this.$axios.post("/config/get", data).then((res) => {
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
      console.log(val);
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
      this.updateSetting = [];
      this.updateSettingUser = "";
      this.updateSettingData = {};
      this.$axios.post("/refund/query", { id: data.ID }).then((res) => {
        if (res.data.code === 0) {
          let newData = JSON.parse(JSON.stringify(res.data.data[0]));
          newData.TicketNos = [];

          try {
            res.data.data[0].TicketNos.split(";").forEach((item) => {
              newData.TicketNos.push(item.split(",").shift());
            });
          } catch (e) {
            try {
              newData.TicketNos = res.data.data[0].TicketNos.split(",").shift();
            } catch (e) {}
          }
          newData.TicketNos.forEach((item, index) => {
            this.updateSetting.push({
              ticketNo: "",
              remark: "",
              status: "",
              message: "",
            });
          });
          this.updateSettingData = newData;
          this.updateSettingDialog = true;
        }
      });
    },

    /**
     * @description: 再次提交数据
     * @param {type}
     * @return:
     */
    updateAgainBtn(data) {
      console.log(data);
      this.updateAgainSettingDialog = true;
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
          time: val.SubmitTime,
          IsDomestic: val.IsDomestic,
        },
      });
      routeData.href = routeData.href.replace("/dist", "");
      window.open(routeData.href, "_blank");
    },

    /**
     * @Description: 退票状态筛选
     * @author Wish
     * @date 2020/6/12
     */
    changeStatus() {
      let newDataList = JSON.parse(JSON.stringify(this.dataList));
      newDataList.forEach((item, index) => {
        if (this.statusCheck === "全部") {
          item.showStatus = true;
        } else {
          item.showStatus = item.RefundStatus === this.statusCheck;
        }
      });
      this.dataList = newDataList;
    },

    /**
     * @Description: 更新退票
     * @author Wish
     * @date 2020/6/13
     */
    submitUpdate() {
      console.log(this.updateSettingData);
      let beyOrder = JSON.parse(this.updateSettingData.OriginalData).BuyOrders;
      let statusType = this.updateSetting.findIndex((item) => {
        return item.status !== "0";
      });
      let newUpdateSetting = JSON.parse(JSON.stringify(this.updateSetting));
      newUpdateSetting.forEach((item, index) => {
        item.ticketNo = this.updateSettingData.TicketNos[index];
        item.status = Number(item.status);
      });
      console.log(newUpdateSetting);
      let data = {
        executorName: "前端提交-" + this.updateSettingUser,
        refundBuyPassenger: [
          {
            buyOrderId: beyOrder[0].Id,
            passengerId: beyOrder[0].Passengers[0].Id,
            tickNoAction: newUpdateSetting,
          },
        ],
        status: statusType === -1 ? 0 : 1,
        yatpRefundId: String(
          JSON.parse(this.updateSettingData.OriginalData).Id
        ),
      };
      console.log(data);
      this.$axios.post("/refund/update", data).then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          this.updateSettingDialog = false;
          this.$message.success(res.data.message);
          this.dataList = [];

          this.getData();
        } else {
          this.$message.warning(res.data.message);
        }
      });
    },
  },
  filters: {
    pagination(dataList, pageNum, pageSize) {
      let offset = (pageNum - 1) * pageSize; //当前页第一条的索引
      return offset + pageSize >= dataList.length
        ? dataList.slice(offset, dataList.length)
        : dataList.slice(offset, offset + pageSize);
    },
  },
  created() {
    this.getData();
  },
  mounted() {
    this.getChannelList();
    window.addEventListener("storage", (e) => {
      console.log(e);
      this.getData();
      localStorage.clear();
    });
    this.searchData.is_domestic = localStorage.getItem('search') === 'true'? true:localStorage.getItem('search') === 'false'? false: false
  },
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

  .main_header {
    display: flex;
    align-items: center;
    padding: 10px 20px 20px;

    .status_list {
      &:not(:last-child) {
        margin-right: 20px;
      }
    }

    /deep/ .el-radio-button {
      &.is-active {
        .el-link {
          color: #fff !important;

          .el-link--inner {
            color: #fff !important;
          }
        }
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
        /deep/ .el-select-dropdown {
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

  .tools_header {
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

    /deep/ .el-table {
      min-height: 400px;

      .el-table__body-wrapper {
        /*height: 100% !important;*/
      }
    }

    .table_setting {
      display: flex;
      justify-content: center;
      align-items: center;
      .table_setting_ico{
        &.disabled{
          opacity: 0.3;
        }
      }
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
  /deep/ .el-dialog__body {
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

/deep/.update_setting {
  .el-dialog__body {
    padding-bottom: unset;
  }
  .update_setting_main {
    display: flex;
    align-items: flex-start;
    overflow-x: auto;
    .el-form {
      flex: 1;
      min-width: 350px;
      &:not(:last-child) {
        border-right: 1px dashed #dedede;
        padding-right: 10px;
      }
    }
  }
  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .update_setting_user {
      width: 200px;
    }
    .footer_btn_box {
      display: flex;
    }
  }
}
/deep/.red{
  color: red;
}
</style>
