<template>
  <div class="office_no">
    <el-button
      class="config_add_btn"
      size="small"
      type="primary"
      @click="openOfficeDialog('add')"
    >新增</el-button>
    <div class="offcie_header"></div>

    <div class="office_table">
      <el-table
        :data="office_list"
        border
        stripe
        highlight-current-row
        ref="officeTable"
        @row-dblclick="dbClickOpenData"
        row-key="channel_name"
        :tree-props="{children: 'children'}"
        style="width: 100%"
      >
        <el-table-column prop="channel_name" label="渠道名称"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.type"
              class="delete_btn"
              @click.native.prevent="deleteOffice(scope.row)"
              type="primary"
              plain
              size="mini"
            >删除</el-button>
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
          class="offic_dialog"
        >
        <el-form-item label="渠道名称:">
          <el-input v-model="addOffce.name"></el-input>
        </el-form-item>
         <el-form-item label="渠道office号：">
          <el-input v-model="addOffce.office"></el-input>
        </el-form-item>
        </el-form>
    
      <div slot="footer" class="dialog-footer">
        <el-button @click="officeDialog = false">关 闭</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "officeTemplate",
  data: () => ({
    office_list: [],
    clickTableName: ["占位"],

    officeDialog: false, // 新增弹窗
    addOffce: {},
  }),
  methods: {
    getDataList() {
      this.office_list = [];
      this.clickTableName = ["占位"];
      this.$axios.get("/config/officeNo").then(res => {
        if (res.data.code === 0) {
          console.log(res.data.data);

          let channelList = Object.keys(res.data.data);
          channelList.forEach((item, index) => {
            let officeList = [];
            res.data.data[item].forEach(oitem => {
              officeList.push({
                channel_name: oitem
              });
            });
            this.office_list.push({
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
      this.officeDialog =  true
    },

    /**
     * @description: 删除office号
     * @param {type}
     * @return:
     */
    deleteOffice(val) {
      console.log(val);
    }
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
</style>