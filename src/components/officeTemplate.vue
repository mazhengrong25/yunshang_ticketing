<template>
  <div class="office_no">
    <el-button
      class="config_add_btn"
      size="small"
      type="primary"
      @click="openOfficeDialog('add')"
    >新增
    </el-button>
    <div class="offcie_header"></div>

    <div class="office_table">
      <el-table
        :data="office_list"
        border
        stripe
        highlight-current-row
        ref="officeTable"
        @row-dblclick="dbClickOpenData"
        row-key="id"
        :tree-props="{children: 'children'}"
        style="width: 100%"
      >
        <el-table-column prop="channel_name" label="渠道名称"></el-table-column>
        <el-table-column prop="TicketDesk" label="票台"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.type"
              class="delete_btn"
              @click.native.prevent="deleteOffice(scope.row,scope.$index)"
              type="primary"
              plain
              size="mini"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="新增渠道OFFCIE号"
      :visible.sync="officeDialog"
      width="500px">
      <el-form
        ref="ruleForm"
        label-width="120px"
        class="office_dialog"
      >
        <el-form-item label="渠道名称:">
          <el-input v-model="addOffice.name"></el-input>
        </el-form-item>
        <el-form-item label="渠道office号：">
          <el-input v-model="addOffice.office"></el-input>
        </el-form-item>
        <el-form-item label="票台：">
          <div class="" style="display: inline-flex; align-items: center;width: 100%">
            <el-input style="flex: 1" v-model="addOffice.TicketDesk"></el-input>
            <el-button type="primary" circle size="mini" class="add_btn el-icon-plus" @click="addDeskBtn"></el-button>
          </div>
          <div class="desk_box" style="display: inline-flex; align-items: center;width: 100%" v-for="(item, index) in deskList" :key="index">
            <el-input style="flex: 1" v-model="deskList[index]"></el-input>
            <el-button type="danger" circle size="mini" class="add_btn el-icon-minus" @click="removeDeskBtn(index)"></el-button>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="officeDialog = false">关 闭</el-button>
        <el-button type="primary" @click="addOfficeBtn">确 定</el-button>
      </div>
    </el-dialog>

    <!--    <el-dialog-->
    <!--      title="是否删除此渠道OFFICE号"-->
    <!--      :visible.sync="deleteDialog"-->
    <!--      width="300px">-->
    <!--      <div>此操作将删除您选中的OFFICE号，请选择您的操作</div>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="deleteDialog = false">关 闭</el-button>-->
    <!--        <el-button type="primary" @click="deleteBtn">确 定</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script>
  export default {
    name: "officeTemplate",
    data: () => ({
      office_list: [],
      clickTableName: ["占位"],

      officeDialog: false, // 新增弹窗
      addOffice: {},
      deleteDialog: false,
      officeInfo: {},

      deskList: []
    }),
    methods: {
      getDataList() {
        this.office_list = [];
        this.clickTableName = ["占位"];
        this.$axios.get("/config/officeNo").then(res => {
          if (res.data.code === 0) {
            console.log(res.data.data);

            let channelList = Object.keys(res.data.data);
            console.log(channelList);
            channelList.forEach((item, index) => {
              let officeList = [];
              res.data.data[item].forEach((oitem, oIndex) => {
                officeList.push({
                  id: oitem.OfficeNo + oIndex,
                  channel_name: oitem.OfficeNo,
                  TicketDesk: oitem.TicketDesk,
                  menuName: item
                });
              });
              this.office_list.push({
                id: 'menu' + index,
                channel_name: item,
                type: "menu",
                children: officeList
              });
            });
            console.log(this.office_list);
          }
        });
      },

      /**
       * @Description: 双击table行
       * @author Wish
       * @date 2020/4/23
       */
      dbClickOpenData(row, column, event) {
        console.log("双击 " + row.channel_name);
        this.clickTableName.forEach((item, index) => {
          if (item === row.channel_name) {
            this.$refs.officeTable.toggleRowExpansion(row, false);
            this.clickTableName.splice(index);
          } else {
            this.$refs.officeTable.toggleRowExpansion(row, true);
            this.clickTableName.push(row.channel_name);
          }
        });
      },

      /**
       * @description: 打开弹窗
       * @param {type}
       * @return:
       */
      openOfficeDialog(type, data) {
        this.officeDialog = true
        this.addOffice = {}
        this.deskList = []
      },

      /**
       * @description: 删除office号
       * @param {type}
       * @return:
       */
      deleteOffice(val) {
        console.log(val);
        // this.officeInfo = val
        // this.deleteDialog = true
        this.$confirm(" 该操作将删除此渠道OFFICE号， 请慎重删除！", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error"
        })
          .then(() => {
            this.$axios.delete('/config/officeNo/' + val.menuName + '/' + val.channel_name).then(res => {
              console.log(res);
              if (res.data.code === 0) {
                this.$message.success(res.data.message);
                this.getDataList();
              } else {
                this.$message.warning(res.data.message)
              }
            });
          })
          .catch(() => {
          });
      },

      /**
       * @Description: 增加票台
       * @author Wish
       * @date 2020/6/16
      */
      addDeskBtn(){
        this.deskList.push('')
      },
      /**
       * @Description: 删除票台
       * @author Wish
       * @date 2020/6/16
      */
      removeDeskBtn(index){
        this.deskList.splice(index,1)
      },



      /**
       * @Description: 删除office号
       * @author Wish
       * @date 2020/6/15
       */
      deleteBtn(url, config) {
        // let officeList = []
        // this.officeInfo.children.forEach(item =>{
        //   officeList.push(item.channel_name)
        // })
        this.$axios.delete('/config/officeNo/' + this.officeInfo.channel_name + '/' + this.officeInfo)
          .then(res => {
            if (res.data.code === 0) {
              this.$message.success(res.data.message)
              this.deleteDialog = false
              this.getDataList()
            } else {
              this.$message.warning(res.data.message)
            }
          })
      },


      /**
       * @Description: 新增office号
       * @author Wish
       * @date 2020/6/15
       */
      addOfficeBtn() {
        let deskName = this.addOffice.TicketDesk
        if(this.deskList.length > 0){
          deskName += ','+String(this.deskList)
        }
        let data = {
          channel_name: this.addOffice.name,
          is_using: 'yes',
          office_no_list: [{
            officeNo: String(this.addOffice.office),
            ticketDesk: deskName,
          }],

        }
        console.log(data);
        this.$axios.post('/config/officeNo', data)
          .then(res => {
            if (res.data.code === 0) {
              this.$message.success(res.data.message)
              this.officeDialog = false
              this.getDataList()
            } else {
              this.$message.warning(res.data.message)
            }
          })
      },
    }
  };
</script>

<style lang="less" scoped>
  .office_no {
    position: relative;

    .config_add_btn {
      position: absolute;
      right: 0;
      top: -50px;
    }

    .delete_btn {
      background: #fff;
      border: 2px solid #0070e2;
      transition: all 0.3s;
      color: #0070e2;

      &:hover {
        color: #fff;
        background: #0070e2;
      }
    }
  }
  .office_dialog{
    .desk_box{
      margin-top: 5px;
    }
    .add_btn{
      margin-left: 10px;
      flex-shrink: 0;
    }
  }
</style>