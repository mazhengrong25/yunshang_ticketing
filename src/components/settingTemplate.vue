<template>
  <div class="setting_table">
    <el-button class="config_add_btn" size="small" type="primary" @click="openSettingDialog('add')">新增</el-button>

    <el-table
      :data="dataList"
      row-key="ID"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      stripe
      border
      @row-dblclick="dbClickOpenData"
      ref="settingTable"
      height="calc(100vh - 190px)"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column width="200" show-overflow-tooltip prop="project" label="渠道类型"></el-table-column>
      <el-table-column label="渠道名称" width="300" show-overflow-tooltip prop="channel_name"></el-table-column>
      <el-table-column label="是否可用" width="80">
        <template v-slot="scope">
          <el-switch
            v-if="scope.row.type !== 'menu'"
            v-model="scope.row.is_using"
            @change="changeSetting(scope.row.is_using,scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="退票渠道" width="80" show-overflow-tooltip prop="refund_channel"></el-table-column>
      <el-table-column
        align="center"
        width="100"
        show-overflow-tooltip
        prop="request_way"
        label="请求方式"
      ></el-table-column>
      <el-table-column align="left" show-overflow-tooltip prop="url" label="请求路径"></el-table-column>
      <el-table-column align="center" show-overflow-tooltip prop="exchange_name" label="交换机名"></el-table-column>
      <el-table-column align="center" show-overflow-tooltip width="200" prop="author" label="作者"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="160">
        <template slot-scope="scope" v-if="scope.row.type !== 'menu'">
          <el-button @click="openSettingDialog('edit',scope.row)" type="primary" size="mini">编辑</el-button>
          <el-button
            class="delete_btn"
            @click="deleteList(scope.row)"
            type="primary"
            plain
            size="mini"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :append-to-body="true"
      custom-class="setting_dialog"
      :title="settingType === 'add'?'新增配置':'编辑配置'"
      :visible.sync="settingDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="500px"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="渠道类型" prop="project">
          <el-input v-model="ruleForm.project"></el-input>
        </el-form-item>
        <el-form-item label="渠道名称" prop="channel_name">
          <el-input v-model="ruleForm.channel_name"></el-input>
        </el-form-item>
        <el-form-item label="退票渠道" prop="channel_name">
          <el-input v-model="ruleForm.refund_channel"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="request_way">
          <el-select
            style="width: 100%"
            v-model="ruleForm.request_way"
            placeholder="请选择请求方式"
            @change="editRequestType(ruleForm.request_way)"
          >
            <el-option label="mq" value="mq"></el-option>
            <el-option label="http" value="http"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求路径" prop="url">
          <el-input v-model="ruleForm.url"></el-input>
        </el-form-item>
        <el-form-item label="交换机名" prop="exchange_name">
          <el-input v-model="ruleForm.exchange_name"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="ruleForm.author"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="closedDialog('ruleForm')">关闭</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--  警告弹窗  -->
    <el-dialog
      width="300px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="warningDialog"
      title="警告"
    >
      <div>正在关闭当前航线，是否确定</div>
      <div class="footer-dialog" slot="footer">
        <el-button size="mini" @click="closeConfig(false)">取 消</el-button>
        <el-button size="mini" type="primary" @click="closeConfig(true)">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import elTableInfiniteScroll from "el-table-infinite-scroll";

export default {
  name: "configFile",
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll
  },
  data: () => ({
    dataList: [], // 配置列表
    settingDialog: false, // 配置弹窗
    settingType: "", // 弹窗属性

    ruleForm: {
      // 弹窗字段
      project: "",
      channel_name: "",
      request_way: "",
      exchange_name: "",
      url: ""
    },
    rules: {
      // 表单验证
      project: [
        // 渠道类型
        { required: true, message: "请填写渠道类型", trigger: "blur" }
      ],
      channel_name: [
        // 渠道名称
        { required: true, message: "请填写渠道名称", trigger: "blur" }
      ],
      refund_channel: [
        // 退票渠道
        { required: true, message: "请填写退票渠道", trigger: "blur" }
      ],
      request_way: [
        // 请求方式
        { required: true, message: "请选择请求方式", trigger: "change" }
      ],
      url: [
        // 请求路径
        { required: true, message: "请填写请求路径", trigger: "blur" }
      ],
      exchange_name: [
        // 交换机名
        { required: true, message: "请填写交换机名", trigger: "blur" }
      ],
      author: [
        // 作者名称
        { required: true, message: "请填写作者名称", trigger: "blur" }
      ]
    },

    limit: 20,
    // offset:0,

    loadStatus: false,

    tableOpenName: "",

    clickTableName: ["占位符"],

    checkedStatus: {},
    warningDialog: false
  }),

  methods: {
    /**
     * @Description: 双击table行
     * @author Wish
     * @date 2020/4/23
     */
    dbClickOpenData(row, column, event) {
      console.log("双击 " + row.ID);
      this.clickTableName.forEach((item, index) => {
        if (item === row.ID) {
          this.$refs.settingTable.toggleRowExpansion(row, false);
          this.clickTableName.splice(index);
        } else {
          this.$refs.settingTable.toggleRowExpansion(row, true);
          this.clickTableName.push(row.ID);
        }
      });
    },

    /**
     * @Description:
     * @author Wish
     * @date 2020/4/22
     */
    editRequestType(val) {
      this.rules.exchange_name.map(item => {
        return (item.required = val === "mq");
      });
    },

    /**
     * @Description: 打开弹窗
     * @author Wish
     * @date 2020/3/17
     */
    openSettingDialog(type, val) {
      console.log(type, val);
      console.log(this.settingDialog);
      this.settingType = type;
      this.settingDialog = true;
      this.ruleForm = val ? JSON.parse(JSON.stringify(val)) : {};
      console.log(this.settingDialog);
    },

    /**
     * @Description: 关闭弹窗
     * @author Wish
     * @date 2020/3/17
     */
    closedDialog(formName) {
      this.settingDialog = false;
      this.ruleForm = {};
      this.$refs[formName].resetFields();
    },

    /**
     * @Description: 提交表单
     * @author Wish
     * @date 2020/3/17
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let url =
            this.settingType === "add"
              ? "/config/set"
              : this.settingType === "edit"
              ? "/config/update"
              : "";
          this.ruleForm['is_using'] = this.ruleForm['is_using']?'yes': 'no'
          this.$axios.post(url, this.ruleForm).then(res => {
            if (res.data.code === 0) {
              this.$message.success("保存成功");
              this.getDataList();
              this.closedDialog();
            } else {
              this.$message.warning(res.data.message);
            }
          });
        }
      });
    },

    /**
     * @Description: 删除确认框
     * @author Wish
     * @date 2020/3/17
     */
    deleteList(val) {
      this.$confirm(" 删除此条配置，该渠道将不能退票， 请慎重删除！", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      })
        .then(() => {
          console.log(val);

          this.$axios.post("/config/del", val).then(res => {
            console.log(res);
            if (res.data.code === 0) {
              this.$message.success(res.data.message);
              this.getDataList();
            }
          });
        })
        .catch(() => {});
    },

    /**
     * @Description: 获取配置信息
     * @author Wish
     * @date 2020/3/17
     */
    getDataList() {
      let data = {
        project: ""
      };
      this.$axios.post("/config/get", data).then(res => {
        if (res.data.code === 0) {
          let settingData = res.data.data;
          if (settingData.length > 0) {
            const listArr = [];
            settingData.forEach((el, index) => {
              console.log(el);
              el.is_using = el.is_using === 'yes'
              for (let i = 0; i < listArr.length; i++) {
                if (listArr[i].project === el.project) {
                  listArr[i].children.push(el);
                  return;
                }
              }
              listArr.push({
                project: el.project,
                ID: el.project + index,
                type: "menu",
                children: [el]
              });
            });
            listArr.map(res => {
              res.project = res.project + " (" + res.children.length + ")";
            });
            console.log(listArr);
            this.dataList = listArr;
          }
        } else {
          console.log(res);
          this.$message.warning(res.data.message);
        }
      });
    },

    /**
     * @Description: 关闭配置
     * @author Wish
     * @date 2020/6/15
    */
    changeSetting(val,list){
      this.checkedStatus  = {
        configName: 'refundInterface',
        isUsing: val? 'yes': 'no',
        itemID: list.ID
      }
      if(!val){
        this.warningDialog = true
      }else {
        this.closeConfig(true)
      }
    },

    /**
     * @Description: 配置文件确认关闭
     * @author Wish
     * @date 2020/6/12
     */
    closeConfig(type){
      if(type){
        this.$axios.post('/config/use',this.checkedStatus)
          .then(res =>{
            console.log(res);
            if(res.data.code === 0){
              this.$message.success(res.data.message)
            }else {
              this.$message.warning(res.data.message)
              this.getDataList()
            }
          })
      }else {
        this.getDataList()
      }
      this.warningDialog = false
    },
  },

  created() {
    this.getDataList();
  }
};
</script>

<style lang="less" scoped>
.setting_table {
  position: relative;
  .config_add_btn{
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