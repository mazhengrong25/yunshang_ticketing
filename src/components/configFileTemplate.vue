<template>
  <div class="config_file">
    <el-button
      class="config_add_btn"
      size="small"
      type="primary"
      @click.native="openConfigDialog('add')"
    >新增</el-button>
    <el-table :data="configList" border style="width: 100%">
      <el-table-column prop="air_company" label="航司名称"></el-table-column>
      <el-table-column prop="air_company_code" label="航司二字码"></el-table-column>
      <el-table-column prop="airline" label="航线"></el-table-column>
      <el-table-column prop="airline_scope" label="航线范围"></el-table-column>
      <el-table-column prop="code_for_free" label="豁免代码"></el-table-column>
      <el-table-column prop="involuntary_channel" label="非自愿退票渠道"></el-table-column>
      <el-table-column label="结算码">
        <template slot-scope="scope">{{scope.row.IsSpecFile? '是': '否'}}</template>
      </el-table-column>
      <el-table-column label="适用全航司">
        <template slot-scope="scope">{{scope.row.is_all_air_company? '适用': '不适用'}}</template>
      </el-table-column>
      <el-table-column label="noShow票">
        <template slot-scope="scope">{{scope.row.is_no_show? '是': '否'}}</template>
      </el-table-column>
      <el-table-column prop="publish_time" label="发布日期"></el-table-column>
      <el-table-column prop="takeoff_time" label="起飞时间段"></el-table-column>
      <el-table-column prop="ticket_time" label="出票起始时间段"></el-table-column>
      <el-table-column prop="validate_time" label="有效期"></el-table-column>
      <el-table-column prop="voluntary_channel" label="自愿退票渠道"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div style="display: flex;">
            <el-button size="mini" @click="openConfigDialog('edit',scope.row)">编辑</el-button>
            <el-button size="mini" @click="editCinfig(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialogTitleType === 'add'? '新增': '编辑'"
      :visible.sync="configDialog"
      :show-close="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      class="config_dialog"
    >
      <div class="dialog_main">
        <el-form :model="configForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="航司名称" prop="air_company">
                <el-input v-model="configForm.air_company"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="航司二字码">
                <el-input v-model="configForm.air_company_code"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="航线" prop="airline">
                <el-input v-model="configForm.airline"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="航线范围">
                <el-input v-model="configForm.airline_scope"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="豁免代码">
                <el-input v-model="configForm.code_for_free"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="扩展参数">
                <el-input v-model="configForm.extra"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="非自愿退票渠道" prop="involuntary_channel">
                <el-input v-model="configForm.involuntary_channel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结算码">
                <el-switch
                  v-model="configForm.isSpecFile"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="是否适用全航司">
                <el-switch
                  v-model="configForm.is_all_air_company"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="是否适用于no show">
                <el-switch
                  v-model="configForm.is_no_show"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="发布日期">
                <el-input v-model="configForm.publish_time"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="起飞时间段">
                <el-input v-model="configForm.takeoff_time"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出票起始时间段">
                <el-input v-model="configForm.ticket_time"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="有效期" prop="validate_time">
                <el-input v-model="configForm.validate_time"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="自愿退票渠道" prop="voluntary_channel">
                <el-input v-model="configForm.voluntary_channel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="configDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "config_file",
  data: () => ({
    configList: [], //  获取
    configDialog: false, // 弹窗
    dialogTitleType: "", // 弹窗标题

    configForm: {}, // 表单数据
    rules: {
      // 表单 验证
      air_company: [
        { required: true, message: "请输入航司名称", trigger: "blur" }
      ],
      airline: [{ required: true, message: "请输入航线", trigger: "blur" }],
      involuntary_channel: [
        { required: true, message: "请输入非自愿退票渠道", trigger: "blur" }
      ],
      validate_time: [
        { required: true, message: "请选择有效期", trigger: "blur" }
      ],
      voluntary_channel: [
        { required: true, message: "请输入自愿退票渠道", trigger: "blur" }
      ]
    }
  }),
  methods: {
    /**
     * @description: 获取航司配置
     * @param {type}
     * @return:
     */

    getDataList() {
      this.$axios.get("/config/configFile").then(res => {
        if (res.data.code === 0) {
          this.configList = res.data.data;
        } else {
          this.$message.warning(res.data.message);
        }
      });
    },

    /**
     * @description: 新增\编辑弹窗
     * @param {type}
     * @return:
     */

    openConfigDialog(type, data) {
      this.dialogTitleType = type;
      
      this.configForm = type === 'edit'?JSON.parse(JSON.stringify(data)):{}
      
      console.log(type, data);
      this.configDialog = true;
    },

    /**
     * @description: 删除配置
     * @param {type}
     * @return:
     */
    editCinfig(val) {
      console.log(val);
    },


    /**
     * @description: 表单提交按钮
     * @param {type} 
     * @return: 
     */    
    submitBtn(){
     console.log( this.configForm);
     
    }
  }
};
</script>

<style lang="less" scoped>
.config_file {
  position: relative;
  .config_add_btn {
    position: absolute;
    right: 0;
    top: -50px;
  }

  .config_dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    /deep/.el-dialog {
      max-width: 1200px;
      width: 100%;
      margin: 0 50px !important;
      

      .el-dialog__body {
        padding-bottom: unset;
        overflow: auto;
      }
    }
  }
}
</style>