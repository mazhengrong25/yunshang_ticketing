<template>
  <div class="setting_details">
    <div class="header">
      <div class="back_btn" @click="closeTab">
        <i class="el-icon-arrow-left"></i>返回
      </div>
    </div>

    <!--    订单信息 - 记录 -  黑屏信息  -->
    <!--  基本信息  -->
    <div class="basic_info">
      <div class="info_content">
        <div class="info_content_list">
          <p class="title notAfter">基本信息</p>
        </div>
        <div class="info_content_list">
          <p class="title">PNR</p>
          <p class="content">{{detailsData.Pnr.PnrCode || ''}}</p>
        </div>

        <div class="info_content_list">
          <p class="title">YATPID</p>
          <p class="content">{{detailsData.Id || ''}}</p>
        </div>

        <div class="info_content_list">
          <p class="title">BuyOrderID</p>
          <p class="content">{{detailsData.BuyOrders[0].Id || ''}}</p>
        </div>

        <div class="info_content_list">
          <p class="title">所属部门</p>
          <p class="content">{{detailsData.CreateDepartment || ''}}</p>
        </div>

        <div class="info_content_list">
          <p class="title">复核者</p>
          <p class="content">{{detailsData.AuditorName}}</p>
        </div>

        <div class="info_content_list">
          <p class="title">申请人</p>
          <p class="content">{{detailsData.CreatorName}}</p>
        </div>
      </div>
      <div class="arr_content">
        <div class="info_content_list">
          <p class="title notAfter">航程信息</p>
        </div>
        <div class="info_air_box">
          <div class="info_air" v-for="(item ,index) in detailsStatus.IsDomestic === 'false'?voyageList:tableDetr" :key="index">
            <div class="info_content_list">
              <p class="title">航空公司</p>
              <p class="content">{{item.Airline || ''}}</p>
            </div>
            <div class="info_content_list">
              <p class="title">起飞机场</p>
              <p class="content">{{item.DepAirport || ''}}</p>
            </div>
            <div class="info_content_list">
              <p class="title">起飞时间</p>
              <p class="content">{{$moment(new Date(item.DepTime)).format('YYYY-MM-DD HH:mm:ss') || ''}}</p>
            </div>
            <div class="info_content_list">
              <p class="title">航班号</p>
              <p class="content">{{$moment(new Date(item.FlightNo)).format('YYYY-MM-DD HH:mm:ss') || ''}}</p>
            </div>
            <div class="info_content_list">
              <p class="title">舱位</p>
              <p class="content">{{item.Cabin || ''}}</p>
            </div>
            <div class="info_content_list">
              <p class="title">到达机场</p>
              <p class="content">{{item.ArrAirport || ''}}</p>
            </div>
            <div class="info_content_list">
              <p class="title">到达时间</p>
              <p class="content">{{$moment(new Date(item.ArrTime)).format('YYYY-MM-DD HH:mm:ss') || ''}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="setting_content">
      <el-table v-if="isTableAlive" :data="tableData" border style="width: 100%">
        <ex-table-column width="80" label="操作">
          <template slot-scope="scope">
            <el-button
            :disabled="orderStatus !== '待确认' && orderStatus !== '退票失败'"
              size="mini"
              type="primary"
              @click="editDetails(scope.$index,tableDetr[scope.$index])"
            >编辑</el-button>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" prop="date" label="采购渠道" width="180">
          <template slot-scope="scope">{{detailsData.BuyOrders[0].BuyChannel.Name}}</template>
        </ex-table-column>
        <ex-table-column :autoFit="true" prop="Name" label="乘机人" width="180"></ex-table-column>
        <ex-table-column :autoFit="true" label="票号">
          <template slot-scope="scope">{{$getTicketNumber(scope.row.PassengerVoyages)}}</template>
        </ex-table-column>
        <ex-table-column :autoFit="true" width="220" label="航程信息">
          <template slot-scope="scope">
            <div v-if="detailsStatus.IsDomestic === 'false'">
              <div
              class
              v-for="(item, index) in tableDetr[scope.$index].Data.TripInfos"
              :key="index"
            >{{item.TripNo + '. ' + item.ToAirport + '-'+ item.FromAirport + ' ' + item.TicketNoStatus}}</div>
            </div>
            <div v-else>
              
              <div v-for="(item, index) in tableDetr"
              :key="index"
            >{{(index + 1) + '. ' + item.ArrAirport + '-'+ item.DepAirport + ' ' + item.FlightNo}}</div>
            </div>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" label="票价">
          <template
            slot-scope="scope"
          >票面价：
          <span v-if="detailsStatus.IsDomestic === 'false'">{{(tableDetr[scope.$index].CostInfo.Price || 0) + '（'+tableDetr[scope.$index].CostInfo.Currency+'）'}}</span>
          <span v-else>{{scope.row.BuyTicketPrice}}</span>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" width="200" label="税金">
          <template slot-scope="scope">
            <div v-if="detailsStatus.IsDomestic === 'false'" class="taxs_main" @click="openEditTaxs(scope.$index,tableDetr[scope.$index].Taxs)">
              <div>应退总税金：{{$Tax(tableDetr[scope.$index].Taxs) + '（'+tableDetr[scope.$index].CostInfo.Currency+'）'}}</div>
              <p>税金明细：</p>
              <div
                class="taxs_box"
                v-for="(item, index) in Object.keys(tableDetr[scope.$index].Taxs)"
                :key="index"
              >{{item}}：{{tableDetr[scope.$index].Taxs[item]}}</div>
            </div>
            <div v-else class="taxs_main">
              <div>机建：{{scope.row.BuyAirRax || 0}}</div>
              <div>燃油：{{scope.row.BuyTicketTax}}</div>
            </div>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" label="其他费用">
          <template slot-scope="scope">
            <div v-if="detailsStatus.IsDomestic === 'false'">已使用票价：{{tableDetr[scope.$index].UsedFare}}</div>
            <div v-else class="edit_buy_refundFee" @click="editBuyRefundFee(scope.$index,scope.row)">退票费：{{scope.row.BuyRefundFee}}</div>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" label="代理费">
          <template slot-scope="scope">
            <div v-if="detailsStatus.IsDomestic === 'false'">
              {{(tableDetr[scope.$index].CostInfo.Price || 0) +
            '（票面价）* '+ $Agency(tableDetr[scope.$index].CostInfo.AgencyFee) +
            '（代理费率）= ' + (Number(tableDetr[scope.$index].CostInfo.Price || 0) * $Agency(tableDetr[scope.$index].CostInfo.AgencyFee)).toFixed(1) +
            '（'+tableDetr[scope.$index].CostInfo.Currency+'）'}}
            </div>
          </template>
        </ex-table-column>
        <!--        num.toFixed(2);-->
        <ex-table-column :autoFit="true" label="应退金额">
          <template slot-scope="scope">
            <div v-if="detailsStatus.IsDomestic === 'false'">
              {{((Number(tableDetr[scope.$index].CostInfo.Price) || 0) +
            Number($Tax(tableDetr[scope.$index].Taxs)) -
            Number(tableDetr[scope.$index].UsedFare) -
            (Number(tableDetr[scope.$index].CostInfo.Price || 0) * $Agency(tableDetr[scope.$index].CostInfo.AgencyFee))).toFixed(1) +
            '（'+tableDetr[scope.$index].CostInfo.Currency+'）'}}
            </div>
            <div v-else>
              {{Number(scope.row.BuyTicketPrice) + Number(scope.row.BuyAirRax || 0) + Number(scope.row.BuyTicketTax) + Number(scope.row.BuyRefundFee)}}
            </div>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" label="实退金额"></ex-table-column>
      </el-table>
    </div>

    <div class="setting_bottom">
      <el-button :disabled="orderStatus !== '待确认' && orderStatus !== '退票失败'" @click="submitBtn" type="primary">再次提交</el-button>
      <el-button
          :disabled="orderStatus === '退票成功'"
          type="primary"
          @click="updateBtn()"
          class="table_setting_ico"
      >更新</el-button>
    </div>

    <el-dialog
      title="详情修改"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="taxsDialog"
      custom-class="taxs_dialog"
      width="30%"
    >
      <div class="dialog_title">
        <el-divider content-position="left">税金明细修改</el-divider>
        <el-button size="mini" type="primary" class="add_taxs" @click="addTaxs">增加</el-button>
      </div>
      <div class="taxs_content">
        <!--        <p>应退税金：{{$Tax(taxsEditData) +'（'+ taxsType+'）'}}</p>-->
        <div class="taxs_main">
          <div class="taxs_list" v-for="(item, index) in taxsEditData" :key="index">
            <span style="width: 20px;">{{index+1}}.</span>
            <el-input v-model="item.key"></el-input>
            <el-input v-model="item.value"></el-input>
            <div class="remove_taxs" @click="removeTaxs(index)">
              <i class="el-icon-close"></i>
            </div>
          </div>
        </div>
      </div>

      <!--      <div class="dialog_title">-->
      <!--        <el-divider content-position="left">已使用票价</el-divider>-->
      <!--      </div>-->
      <el-divider content-position="left">其他明细</el-divider>
      <div
        class="taxs_content other_content"
        style="display: flex;align-items: center;padding-left: 20px"
        v-if="taxsDialog"
      >
        <el-input placeholder="票价" disabled></el-input>
        <el-input v-model="editDetailsData.CostInfo.Price" placeholder></el-input>
        <span
          style="flex-shrink: 0;width: 45px;text-align: center"
        >{{editDetailsData.CostInfo.Currency}}</span>
      </div>
      <div
        class="taxs_content other_content"
        style="display: flex;align-items: center; padding-right: 45px;padding-left: 20px"
        v-if="taxsDialog"
      >
        <!--        <div style="flex-shrink: 0">已使用票价</div>-->
        <el-input placeholder="已使用票价" disabled></el-input>
        <el-input v-model="editDetailsData.UsedFare" placeholder="已使用票价"></el-input>
      </div>

      <div
        class="taxs_content other_content"
        style="display: flex;align-items: center; padding-right: 45px;padding-left: 20px"
        v-if="taxsDialog"
      >
        <el-input disabled placeholder="代理费率"></el-input>
        <el-input v-model="editDetailsData.CostInfo.AgencyFee" placeholder="代理费率"></el-input>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="taxsDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveSubmitEaxs">保 存</el-button>
      </div>
    </el-dialog>


    <el-dialog
        title="退票费修改"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        :visible.sync="buyFeeDialog"
        custom-class="buy_fee_dialog"
        width="30%">
      <div class="buy_fee_dialog_main">
        <div>退票费</div>
        <el-input v-model="newBuyFeeData" placeholder="退票费"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="buyFeeDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveSubmitBuyFee">保 存</el-button>
      </div>
    </el-dialog>


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
  </div>
</template>

<script>
export default {
  name: "settingDetails",
  data() {
    return {
      orderStatus: '',  // 订单状态
      detailsStatus: {}, // 初始值

      isTableAlive: true, // 表格重载

      detailsData: {}, // 详情数据
      tableData: [], // 乘客数据

      tableDetr: [], // 金额数据
      copyTableDetr: [], // copy金额数据

      taxsDialog: false, // 修改税金弹窗
      taxsType: "", // 当前修改税金数据 下标
      taxsEditData: [], // 当前修改税金弹窗 税金数据

      editDetailsData: {}, // 当前修改详情数据

      voyageList: [], // 航班信息列表

      editBuyFeeData: {}, // 修改退票费数据
      buyFeeDialog: false,  // 修改退票费弹窗
      newBuyFeeData: '', // 新退票费

      oldUploadData: {},  // 原始数据
      updateSettingDialog: false, // 更新退票状态
      updateSetting: [], // 更新状态数据
      updateSettingUser: "", // 执行者
      updateSettingData: {},
      newSettingData: {},
    };
  },
  methods: {
    getDetailsData() {
      let data = {
        id: Number(this.detailsStatus.id),
        // start_time: this.detailsStatus.time
      };
      let VoyageIdList = []; // 航班信息Id
      this.$axios.post("/refund/query", data).then((res) => {
        this.oldUploadData = res.data.data[0]
        let details = res.data.data[0];
        this.orderStatus = details.RefundStatus
        this.detailsData = JSON.parse(details.OriginalData);
        console.log(this.detailsData);
        this.tableData = this.detailsData.BuyOrders[0].Passengers;
        this.tableData.forEach((item) => {
          item.RefundCenterDETR = item.RefundCenterDETR
            ? JSON.parse(item.RefundCenterDETR)
            : "";
        });
        this.tableData.forEach((item) => {
          item.PassengerVoyages.forEach((oitem) => {
            VoyageIdList.push(oitem.VoyageId);
          });
        });
        console.log(this.tableData);

        if (this.detailsStatus.IsDomestic === "false") {
          this.detailsData.Voyages.forEach((item) => {
            VoyageIdList.forEach((vitem) => {
              if (item.Id === vitem) {
                this.voyageList.push(item);
              }
            });
            this.voyageList = [...new Set(this.voyageList)];
          });
          this.detailsData.BuyOrders[0].Passengers.forEach((item) => {
            if (item.RefundCenterDETR.webInput) {
              this.tableDetr.push(JSON.parse(item.RefundCenterDETR.webInput));
            } else if (item.RefundCenterDETR.blackScreen) {
              this.tableDetr.push(
                JSON.parse(item.RefundCenterDETR.blackScreen)
              );
            } else {
              this.tableDetr.push(item.RefundCenterDETR);
            }
          });
          this.tableDetr.forEach((item) => {
            console.log(item.CostInfo);
            if (item.CostInfo === null) {
              item.CostInfo = {
                Price: 0,
                Currency: "",
                AgencyFee: 0,
              };
            }
          });
        }else{
          this.tableDetr = this.detailsData.Voyages
        }
        console.log(this.tableDetr)
      });
    },

    /**
     * @Description: 重载
     * @author Wish
     * @date 2020/6/11
     */
    reload() {
      this.isTableAlive = false;
      this.$nextTick(() => (this.isTableAlive = true));
    },


    /**
     * @Description: 修改退票费 （国内）
     * @author Wish
     * @date 2020/8/7
    */
    editBuyRefundFee(index,val){
      console.log(this.orderStatus);
      if(this.orderStatus === '待确认' || this.orderStatus === '退票失败'){
        this.editBuyFeeData = {
          index: index,
          data: val
        }
        this.buyFeeDialog = true
        this.newBuyFeeData = JSON.parse(JSON.stringify(val.BuyRefundFee))
      }
    },

    /**
     * @Description: 保存修改退票费
     * @author Wish
     * @date 2020/8/7
    */
    saveSubmitBuyFee(){
      this.detailsData.BuyOrders[0].Passengers[this.editBuyFeeData.index].BuyRefundFee = this.newBuyFeeData
      this.buyFeeDialog = false
      this.reload();
    },


    /**
     * @Description: 详情修改
     * @author Wish
     * @date 2020/6/11
     */
    editDetails(index, data) {
      this.editDetailsData = JSON.parse(JSON.stringify(data));
      this.taxsEditData = [];
      this.taxsDialog = true;
      this.taxsType = index;

      console.log(this.editDetailsData);


      Object.keys(data.Taxs).forEach((item) => {
        this.taxsEditData.push({
          key: item,
          value: data.Taxs[item],
        });
      });
    },

    /**
     * @Description: 修改税金
     * @author Wish
     * @date 2020/6/10
     */
    openEditTaxs(index, data) {
      // this.taxsEditData = []
      // this.taxsDialog = true
      // this.taxsType = index
      // Object.keys(data).forEach(item =>{
      //   this.taxsEditData.push({
      //     key: item,
      //     value: data[item]
      //   })
      // })
    },

    /**
     * @Description: 保存修改税金
     * @author Wish
     * @date 2020/6/10
     */
    saveSubmitEaxs() {
      let obj = {};
      this.taxsEditData.forEach((item, index) => {
        obj[item.key] = Number(item.value);
      });
      this.editDetailsData.CostInfo.Price = Number(
        this.editDetailsData.CostInfo.Price
      );
      this.editDetailsData.UsedFare = Number(this.editDetailsData.UsedFare);
      this.editDetailsData.CostInfo.AgencyFee = Number(
        this.editDetailsData.CostInfo.AgencyFee
      );
      this.tableDetr[this.taxsType] = this.editDetailsData;
      this.tableDetr[this.taxsType].Taxs = obj;

      this.editDetailsData.Taxs = obj;
      this.tableData[this.taxsType].RefundCenterDETR[
        "blackScreen"
      ] = JSON.parse(
        this.tableData[this.taxsType].RefundCenterDETR["blackScreen"]
      );
      this.tableData[this.taxsType].RefundCenterDETR[
        "webInput"
      ] = this.editDetailsData;

      this.reload();
      this.taxsDialog = false;
    },

    /**
     * @Description: 删除税金
     * @author Wish
     * @date 2020/6/11
     */
    removeTaxs(index) {
      this.taxsEditData.splice(index, 1);
      console.log(this.taxsEditData);
    },

    /**
     * @Description: 增加税金
     * @author Wish
     * @date 2020/6/11
     */
    addTaxs() {
      this.taxsEditData.push({
        key: "",
        value: "",
      });
    },

    /**
     * @Description: 再次提交
     * @author Wish
     * @date 2020/6/9
     */
    submitBtn() {
      this.detailsData.BuyOrders[0]["Submitter"] =
        this.$TimeSetting(new Date(), "yyyyMMddHHmmss") + ":web^再次提交";
      let uploadData = JSON.parse(JSON.stringify(this.detailsData));
      uploadData.BuyOrders[0].Passengers.forEach((item) => {
        item.RefundCenterDETR = JSON.stringify(item.RefundCenterDETR);
      });
      console.log(uploadData);
      this.$axios.post("/refund/resubmit", uploadData).then((res) => {
        if (res.data.code === 0) {
          console.log(res);
          localStorage.setItem("saveSubmit", "update");
          this.$message.success(res.data.message);
        } else {
          this.$message.warning(res.data.message);
        }
      });
    },

    /**
     * @description: 修改按钮
     * @author Wish
     * @date 2020/6/13
     */
    updateBtn() {
      this.updateSetting = [];
      this.updateSettingUser = "";
      this.updateSettingData = {};
      console.log(this.oldUploadData);
      let newData = JSON.parse(JSON.stringify(this.oldUploadData));
          newData.TicketNos = [];

          try {
            this.oldUploadData.TicketNos.split(";").forEach((item) => {
              newData.TicketNos.push(item.split(",").shift());
            });
          } catch (e) {
            try {
              newData.TicketNos = this.oldUploadData.TicketNos.split(",").shift();
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
      console.log(this.updateSettingData);
    },

    /**
     * @Description: 更新退票
     * @author Wish
     * @date 2020/6/13
     */
    submitUpdate() {
      console.log(this.updateSettingData);
      let beyOrder = this.detailsData.BuyOrders;
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
      this.$axios.post("/refund/update", data).then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          this.updateSettingDialog = false;
          this.$message.success(res.data.message);
          this.dataList = [];

          this.getDetailsData();
        } else {
          this.$message.warning(res.data.message);
        }
      });
    },

    /**
     * @Description: 关闭当前页面
     * @author Wish
     * @date 2020/6/9
     */
    closeTab() {
      window.opener = null;
      window.open("about:blank", "_top").close();
    },
  },
  mounted() {
    this.detailsStatus = this.$route.query;
    console.log(this.detailsStatus);
    this.getDetailsData();
  },
};
</script>

<style lang="less" scoped>
.el-button.is-disabled{
  opacity: .3;
}
.setting_details {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .header {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    font-size: 16px;
    background: #0070e2;
    .back_btn {
      cursor: pointer;
      color: #fff;
      height: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      i {
        margin-right: 10px;
      }
    }
  }

  .basic_info {
    padding: 0 20px;
    margin-top: 10px;
    .info_content {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      height: 50px;
      .info_content_list {
        border: 1px solid #dedede;
        margin-left: -1px;
      }
    }

    .arr_content {
      display: flex;
      align-items: center;
      border: 1px solid #dedede;
      margin-top: 15px;

      .info_air_box {
        border-left: 1px solid #dedede;
        width: 100%;
        .info_air {
          height: 50px;
          display: flex;
          align-items: center;
          margin-bottom: -1px;
          border-bottom: 1px solid #dedede;
        }
      }
    }
    .info_content_list {
      display: inline-flex;
      align-items: center;
      height: 100%;
      padding: 0 15px;
      flex-shrink: 0;

      .title {
        font-weight: 400;
        &:not(.notAfter) {
          &::after {
            content: "：";
          }
        }
      }
      .content {
        font-size: 14px;
      }
    }
  }

  .setting_content {
    padding: 20px;
    .details_header {
      display: flex;
      flex-wrap: wrap;
      .header_list {
        min-width: 15%;
        margin-bottom: 15px;
        &:not(:last-child) {
          margin-right: 15px;
        }
      }
    }

    .edit_buy_refundFee{
      &:hover{
        cursor: pointer;
        text-decoration: underline;
      }
    }

    /*.taxs_main{*/
    /*  cursor: pointer;*/
    /*  position: relative;*/
    /*  &:hover{*/
    /*    &::after{*/
    /*      content: '编辑';*/
    /*      position: absolute;*/
    /*      right: 0;*/
    /*      bottom: 0;*/
    /*      display: block;*/
    /*      font-size: 12px;*/
    /*      color: #0070E2;*/
    /*    }*/
    /*  }*/

    /*}*/
  }
  .setting_bottom {
    display: flex;
    justify-content: center;
    margin-top: auto;
    padding-bottom: 20px;
  }
  /deep/.taxs_dialog {
    .el-dialog__body {
      padding-top: unset;
    }
    .dialog_title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .add_taxs {
        margin-left: 10px;
      }
    }
    .taxs_content {
      &.other_content {
        &:not(:last-child) {
          margin-bottom: 10px;
        }
      }
      .taxs_main {
        .taxs_list {
          display: flex;
          align-items: center;
          &:not(:last-child) {
            margin-bottom: 10px;
          }
          span {
            margin-right: 10px;
          }
          .remove_taxs {
            font-size: 16px;
            cursor: pointer;
            width: 35px;
            margin-left: 10px;
            flex-shrink: 0;
            display: inline-flex;
            justify-content: center;
            &:hover {
              color: #0070e2;
            }
          }
        }
      }
    }
    .dialog-footer {
      text-align: center;
    }
  }
}
.buy_fee_dialog_main{
  display: flex;
  align-items: center;
  div{
    flex-shrink: 0;
    margin-right: 30px;
  }
  .el-input{
    flex: 1;
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
</style>