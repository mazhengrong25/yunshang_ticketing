<template>
  <div class="setting_details">
    <div class="header">
      <div class="back_btn" @click="closeTab">
        <i class="el-icon-arrow-left"></i>返回
      </div>
    </div>
    <div class="setting_content">
      <el-table
        v-if="isTableAlive"
        :data="tableData"
        border
        style="width: 100%">
        <ex-table-column
          width="80"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editDetails(scope.$index,tableDetr[scope.$index])">编辑</el-button>
          </template>
        </ex-table-column>
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
      title="详情修改"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="taxsDialog"
      custom-class="taxs_dialog"
      width="30%">

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
            <div class="remove_taxs" @click="removeTaxs(index)"><i class="el-icon-close"></i></div>
          </div>
        </div>
      </div>

<!--      <div class="dialog_title">-->
<!--        <el-divider content-position="left">已使用票价</el-divider>-->
<!--      </div>-->
      <el-divider content-position="left">其他明细</el-divider>
      <div class="taxs_content other_content" style="display: flex;align-items: center;padding-left: 20px" v-if="taxsDialog">
        <el-input placeholder="票价" disabled></el-input>
        <el-input v-model="editDetailsData.CostInfo.Price" placeholder=""></el-input>
        <span style="flex-shrink: 0;width: 45px;text-align: center">{{editDetailsData.CostInfo.Currency}}</span>
      </div>
      <div class="taxs_content other_content" style="display: flex;align-items: center; padding-right: 45px;padding-left: 20px" v-if="taxsDialog">
<!--        <div style="flex-shrink: 0">已使用票价</div>-->
        <el-input placeholder="已使用票价" disabled></el-input>
        <el-input v-model="editDetailsData.UsedFare" placeholder="已使用票价"></el-input>
      </div>

      <div class="taxs_content other_content" style="display: flex;align-items: center; padding-right: 45px;padding-left: 20px" v-if="taxsDialog">
        <el-input disabled placeholder="代理费率"></el-input>
        <el-input v-model="editDetailsData.CostInfo.AgencyFee" placeholder="代理费率"></el-input>
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

        isTableAlive: true, // 表格重载

        detailsData: {}, // 详情数据
        tableData: [], // 乘客数据

        tableDetr: [], // 金额数据
        copyTableDetr: [], // copy金额数据

        taxsDialog: false, // 修改税金弹窗
        taxsType: '', // 当前修改税金数据 下标
        taxsEditData: [], // 当前修改税金弹窗 税金数据

        editDetailsData: {}, // 当前修改详情数据
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
            console.log(this.detailsData);
            this.tableData = this.detailsData.BuyOrders[0].Passengers
            this.tableData.forEach(item => {item.RefundCenterDETR = JSON.parse(item.RefundCenterDETR)})
            console.log(this.tableData);

            this.detailsData.BuyOrders[0].Passengers.forEach(item =>{
              console.log();
              if(item.RefundCenterDETR.webInput){
                this.tableDetr.push(JSON.parse(item.RefundCenterDETR.webInput))
              }else {
                this.tableDetr.push(JSON.parse(item.RefundCenterDETR.blackScreen))
              }

            })

          })
      },

      /**
       * @Description: 重载
       * @author Wish
       * @date 2020/6/11
      */
      reload(){
        this.isTableAlive = false
        this.$nextTick(()=> this.isTableAlive = true)
      },


      /**
       * @Description: 详情修改
       * @author Wish
       * @date 2020/6/11
      */
      editDetails(index,data){
        this.editDetailsData = JSON.parse(JSON.stringify(data))
        this.taxsEditData = []
        this.taxsDialog = true
        this.taxsType = index

        console.log(this.editDetailsData);

        // 税金处理
        Object.keys(data.Taxs).forEach(item =>{
          this.taxsEditData.push({
            key: item,
            value: data.Taxs[item]
          })
        })
      },


      /**
       * @Description: 修改税金
       * @author Wish
       * @date 2020/6/10
      */
      openEditTaxs(index,data){
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
      saveSubmitEaxs(){
        let obj = {}
        this.taxsEditData.forEach((item,index)=>{obj[item.key] = Number(item.value)})
        this.editDetailsData.CostInfo.Price = Number(this.editDetailsData.CostInfo.Price)
        this.editDetailsData.UsedFare = Number(this.editDetailsData.UsedFare)
        this.editDetailsData.CostInfo.AgencyFee = Number(this.editDetailsData.CostInfo.AgencyFee)
        this.tableDetr[this.taxsType] = this.editDetailsData
        this.tableDetr[this.taxsType].Taxs = obj

        this.editDetailsData.Taxs = obj
        this.tableData[this.taxsType].RefundCenterDETR['blackScreen'] = JSON.parse(this.tableData[this.taxsType].RefundCenterDETR['blackScreen'])
        this.tableData[this.taxsType].RefundCenterDETR['webInput'] = this.editDetailsData

        this.reload()
        this.taxsDialog = false
      },


      /**
       * @Description: 删除税金
       * @author Wish
       * @date 2020/6/11
      */
      removeTaxs(index){
        this.taxsEditData.splice(index,1)
        console.log(this.taxsEditData);
      },

      /**
       * @Description: 增加税金
       * @author Wish
       * @date 2020/6/11
      */
      addTaxs(){
        this.taxsEditData.push({
          key: '',
          value: ''
        })
      },





      /**
       * @Description: 再次提交
       * @author Wish
       * @date 2020/6/9
      */
      submitBtn(){

        this.detailsData.BuyOrders[0]['Submitter'] = this.$TimeSetting(new Date(),'yyyyMMddHHmmss') + ':web^再次提交'
        let uploadData = JSON.parse(JSON.stringify(this.detailsData))
        uploadData.BuyOrders[0].Passengers.forEach(item => {
          item.RefundCenterDETR = JSON.stringify(item.RefundCenterDETR)
        })
          console.log(uploadData);
        this.$axios.post('/refund/resubmit',uploadData)
          .then(res =>{
            if(res.data.code === 0){
              console.log(res);
              localStorage.setItem('saveSubmit', 'update')
              this.$message.success(res.data.message)
            }else {
              this.$message.warning(res.data.message)
            }
          })



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
    .setting_bottom{
      display: flex;
      justify-content: center;
      margin-top: auto;
      padding-bottom: 20px;
    }
    /deep/.taxs_dialog{
      .el-dialog__body{
        padding-top: unset;
      }
      .dialog_title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .add_taxs{
          margin-left: 10px;
        }
      }
      .taxs_content{
        &.other_content{
          &:not(:last-child){
            margin-bottom: 10px;
          }
        }
        .taxs_main{
          .taxs_list{
            display: flex;
            align-items: center;
            &:not(:last-child){
              margin-bottom: 10px;
            }
            span{
              margin-right: 10px;
            }
            .remove_taxs{
              font-size: 16px;
              cursor: pointer;
              width: 35px;
              margin-left: 10px;
              flex-shrink: 0;
              display: inline-flex;
              justify-content: center;
              &:hover{
                color: #0070E2;
              }
            }
          }
        }
      }
      .dialog-footer{
        text-align: center;
      }

    }
  }
</style>