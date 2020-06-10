<template>
  <div class="setting_details">
    <div class="header">
      <div class="back_btn" @click="closeTab">
        <i class="el-icon-arrow-left"></i>返回
      </div>
    </div>
    <div class="setting_content">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <ex-table-column
          prop="date"
          label="采购渠道"
          width="180">
          <template slot-scope="scope">
            {{detailsData.BuyOrders[0].BuyChannel.Name}}
          </template>
        </ex-table-column>
        <ex-table-column
          prop="Name"
          label="乘机人"
          width="180">
        </ex-table-column>
        <ex-table-column
          label="票号">
          <template slot-scope="scope">
            {{$getTicketNumber(scope.row.PassengerVoyages)}}
          </template>
        </ex-table-column>
        <ex-table-column
          width="220"
          label="航程信息">
          <template slot-scope="scope">
            <div class="" v-for="(item, index) in tableDetr[scope.$index].Data.TripInfos" :key="index">
              {{item.TripNo + '. ' + item.ToAirport + '-'+ item.FromAirport + ' ' + item.TicketNoStatus}}
            </div>
          </template>
        </ex-table-column>
        <ex-table-column
          label="票价">
          <template slot-scope="scope">
            票面价：{{tableDetr[scope.$index].CostInfo.Price + '（'+tableDetr[scope.$index].CostInfo.Currency+'）'}}
          </template>
        </ex-table-column>
        <ex-table-column
          label="税金">
          <template slot-scope="scope">
            <div class="taxs_main" @click="openEditTaxs(scope.$index,tableDetr[scope.$index].Taxs)">
              <div>应退税金：{{$Tax(tableDetr[scope.$index].Taxs) + '（'+tableDetr[scope.$index].CostInfo.Currency+'）'}}</div>
              <p>税金明细：</p>
              <div class="taxs_box" v-for="(item, index) in Object.keys(tableDetr[scope.$index].Taxs)" :key="index">
                {{item}}：{{tableDetr[scope.$index].Taxs[item]}}
              </div>
            </div>
          </template>
        </ex-table-column>
        <ex-table-column
          label="其他费用">
          <template slot-scope="scope">
            <div>已使用票价：{{tableDetr[scope.$index].UsedFare}}</div>
          </template>
        </ex-table-column>
        <ex-table-column
          label="代理费">
          <template slot-scope="scope">
            {{tableDetr[scope.$index].CostInfo.Price +
            '（票面价）* '+ tableDetr[scope.$index].CostInfo.AgencyFee +
            '（代理费率）= ' + (Number(tableDetr[scope.$index].CostInfo.Price) * Number(tableDetr[scope.$index].CostInfo.AgencyFee)) +
            '（'+tableDetr[scope.$index].CostInfo.Currency+'）'}}
          </template>
        </ex-table-column>
        <ex-table-column
          label="应退金额">
          <template slot-scope="scope">
            {{(Number(tableDetr[scope.$index].CostInfo.Price) +
            Number($Tax(tableDetr[scope.$index].Taxs)) -
            Number(tableDetr[scope.$index].UsedFare)) +
            '（'+tableDetr[scope.$index].CostInfo.Currency+'）'}}
          </template>
        </ex-table-column>
        <ex-table-column
          label="实退金额">
        </ex-table-column>
      </el-table>
    </div>

    <div class="setting_bottom">
      <el-button @click="submitBtn" type="primary">再次提交</el-button>
    </div>

    <el-dialog
      title="税金明细修改"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="taxsDialog"
      width="30%">
      <div class="taxs_dialog">
<!--        <p>应退税金：{{$Tax(taxsEditData) +'（'+ taxsType+'）'}}</p>-->
        <div class="taxs_main">
          <div class="taxs_list" v-for="(item, index) in taxsEditData" :key="index">
            <el-input v-model="item.key" :placeholder="item.key"></el-input>
            <el-input v-model="item.value" :placeholder="item.value"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="taxsDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveSubmitEaxs">保 存</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: 'settingDetails',
    data(){
      return {
        detailsStatus: {},  // 初始值

        detailsData: {}, // 详情数据
        tableData: [], // 乘客数据

        tableDetr: [], // 金额数据
        copyTableDetr: [], // copy金额数据

        taxsDialog: false, // 修改税金弹窗
        taxsType: '', // 当前修改税金弹窗 货币单位
        taxsEditData: [], // 当前修改税金弹窗 税金数据
      }
    },
    methods: {
      getDetailsData(){
        let data = {
          id: Number(this.detailsStatus.id),
          start_time: this.detailsStatus.time
        }
        this.$axios.post('/refund/query',data)
          .then(res =>{
            let details = res.data.data[0]
            this.detailsData = JSON.parse(details.OriginalData)
            this.tableData = this.detailsData.BuyOrders[0].Passengers

            this.detailsData.BuyOrders[0].Passengers.forEach(item =>{
              this.tableDetr.push(JSON.parse(JSON.parse(item.RefundCenterDETR).blackScreen))
            })

            console.log(this.tableDetr);
          })
      },

      /**
       * @Description: 修改税金
       * @author Wish
       * @date 2020/6/10
      */
      openEditTaxs(index,data){
        this.taxsEditData = []
        this.taxsDialog = true
        this.taxsType = index
        Object.keys(data).forEach(item =>{
          this.taxsEditData.push({
            key: item,
            value: data[item]
          })
        })
      },

      /**
       * @Description: 保存修改税金
       * @author Wish
       * @date 2020/6/10
      */
      saveSubmitEaxs(){
        console.log(this.taxsType);
        console.log(this.taxsEditData);
      },



      /**
       * @Description: 再次提交
       * @author Wish
       * @date 2020/6/9
      */
      submitBtn(){
        localStorage.setItem('saveSubmit', 'update')
        this.closeTab()
      },

      /**
       * @Description: 关闭当前页面
       * @author Wish
       * @date 2020/6/9
      */
      closeTab(){
        window.opener = null;
        window.open("about:blank", "_top").close()
      },

    },
    created(){
      this.detailsStatus = this.$route.query
      this.getDetailsData()
    },
  }
</script>

<style lang="less" scoped>
  .setting_details{
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
    .setting_content{
      padding: 20px;
      .details_header{
        display: flex;
        flex-wrap: wrap;
        .header_list{
          min-width: 15%;
          margin-bottom: 15px;
          &:not(:last-child){
            margin-right: 15px;
          }
        }
      }
    }
    .setting_bottom{
      display: flex;
      justify-content: center;
      margin-top: auto;
      padding-bottom: 20px;
    }
    .taxs_dialog{
      .taxs_main{
        .taxs_list{
          display: flex;
          &:not(:last-child){
            margin-bottom: 10px;
          }
        }
      }
    }
  }
</style>