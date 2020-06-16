<template>
  <div class="config_file">
    <el-button
      class="config_add_btn"
      size="small"
      type="primary"
      @click.native="openConfigDialog('add')"
    >新增
    </el-button>
    <el-table
      :data="configList"
      border
      row-key="nuc_type"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      style="width: 100%">
      <!--      <el-table-column label="NUC状态" width="140">-->
      <!--        -->
      <!--      </el-table-column>-->
      <el-table-column prop="air_company" label="航司名称">
        <template scope="scope">
          <span v-if="scope.row.type">
            {{scope.row.nuc_type}}
          </span>
          <span v-if="!scope.row.type">
            {{scope.row.air_company}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="air_company_code" label="航司二字码"></el-table-column>
      <el-table-column label="是否可用" width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            v-if="!scope.row.type"
            v-model="scope.row.is_using"
            @change="checkedUsing(scope.row.is_using,scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="airline" label="航线"></el-table-column>
      <el-table-column prop="airline_scope" label="航线范围"></el-table-column>
      <el-table-column prop="code_for_free" label="豁免代码"></el-table-column>
      <el-table-column prop="ForFreeReason" label="豁免原因"></el-table-column>

      <el-table-column prop="voluntary_channel" width="80" align="center" label="自愿退票渠道"></el-table-column>
      <el-table-column prop="involuntary_channel" label="非自愿退票渠道" width="80" align="center"></el-table-column>
      <el-table-column label="结算码" width="65" align="center">
        <template slot-scope="scope"><span v-if="!scope.row.type">{{scope.row.IsSpecFile? '是': '否'}}</span></template>
      </el-table-column>
      <el-table-column label="适用全航司">
        <template slot-scope="scope"><span v-if="!scope.row.type">{{scope.row.is_all_air_company? '适用': '不适用'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="noShow票">
        <template slot-scope="scope"><span v-if="!scope.row.type">{{scope.row.is_no_show? '是': '否'}}</span></template>
      </el-table-column>
      <el-table-column prop="publish_time" label="发布日期">
        <template slot-scope="scope">
          <span v-if="!scope.row.type">{{$TimeSetting(scope.row.publish_time)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="takeoff_time" label="起飞时间段">
        <template slot-scope="scope">
          <span v-if="!scope.row.type">{{$TimeSetting(scope.row.publish_time)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ticket_time" label="出票起始时间段">
        <template slot-scope="scope">
          <span v-if="!scope.row.type">{{$TimeSetting(scope.row.ticket_time)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="validate_time" label="有效期">
        <template slot-scope="scope">
          <span v-if="!scope.row.type">{{$TimeSetting(scope.row.validate_time)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="80" fixed="right">
        <template slot-scope="scope">
          <div style="display: flex;" v-if="!scope.row.type">
            <!--            <el-button size="mini" @click="openConfigDialog('edit',scope.row)">编辑</el-button>-->
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
        <el-form
          :model="configForm"
          :rules="rules"
          ref="ruleForm"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="航司名称" prop="air_company">
                <el-input clearable v-model="configForm.air_company"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="航司二字码" prop="air_company_code">
                <el-input clearable v-model="configForm.air_company_code"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="航线">
                <el-input clearable v-model="configForm.airline"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="航线范围">
                <el-input clearable v-model="configForm.airline_scope"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">

            <!--            <el-col :span="12">-->
            <!--              <el-form-item label="扩展参数">-->
            <!--                <el-input clearable v-model="configForm.extra"></el-input>-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
            <el-col :span="12">
              <el-form-item label="非自愿退票渠道" prop="involuntary_channel">
                <el-input clearable v-model="configForm.involuntary_channel"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="自愿退票渠道" prop="voluntary_channel">
                <el-input clearable v-model="configForm.voluntary_channel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!--          <el-row :gutter="20">-->

          <!--          </el-row>-->

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="豁免代码">
                <div style="display: inline-flex">
                  <el-input style="width: 200px" clearable v-model="configForm.code_for_free_en"
                            placeholder="前两位"></el-input>
                  <el-input clearable v-model="configForm.code_for_free_number" placeholder="其他部分"></el-input>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发布日期">
                <el-date-picker
                  v-model="configForm.publish_time"
                  type="datetime"
                  placeholder="发布日期"
                  value-format="yyyy-MM-ddTHH:mm:ss+08:00"
                ></el-date-picker>
              </el-form-item>
            </el-col>


          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="起飞时间段">
                <!-- <el-date-picker
                  v-model="configForm.takeoff_time"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00']"
                  value-format="yyyy-MM-ddTHH:mm:ss+08:00"
                ></el-date-picker>-->
                <el-date-picker
                  v-model="configForm.takeoff_time"
                  type="datetime"
                  placeholder="选择起飞时间段"
                  value-format="yyyy-MM-ddTHH:mm:ss+08:00"
                ></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="出票起始时间段">
                <!-- <el-date-picker
                  v-model="configForm.ticket_time"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00']"
                  value-format="yyyy-MM-ddTHH:mm:ss+08:00"
                ></el-date-picker>-->
                <el-date-picker
                  v-model="configForm.ticket_time"
                  type="datetime"
                  placeholder="选择出票起始时间段"
                  value-format="yyyy-MM-ddTHH:mm:ss+08:00"
                ></el-date-picker>
              </el-form-item>
            </el-col>


          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="有效期" prop="validate_time">
                <!-- <el-date-picker
                  v-model="configForm.validate_time"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00']"
                  value-format="yyyy-MM-ddTHH:mm:ss+08:00"
                ></el-date-picker>-->
                <el-date-picker
                  v-model="configForm.validate_time"
                  type="datetime"
                  placeholder="选择有效期"
                  value-format="yyyy-MM-ddTHH:mm:ss+08:00"
                ></el-date-picker>
              </el-form-item>
            </el-col>


            <el-col :span="4">
              <el-form-item label="是否为NUC文件">
                <el-switch
                  v-model="configForm.is_nuc"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="是否适用全航司">
                <el-switch
                  v-model="configForm.is_all_air_company"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="是否适用于no show">
                <el-switch
                  v-model="configForm.is_no_show"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
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
          {required: true, message: "请输入航司名称", trigger: "blur"}
        ],
        air_company_code: [{required: true, message: "请输入航司二字码", trigger: "blur"}],
        involuntary_channel: [
          {required: true, message: "请输入非自愿退票渠道", trigger: "blur"}
        ],
        validate_time: [
          {required: true, message: "请选择有效期", trigger: "blur"}
        ],
        voluntary_channel: [
          {required: true, message: "请输入自愿退票渠道", trigger: "blur"}
        ],
      },
      warningDialog: false, // 警告弹窗

      checkedStatus: {}, //  是否启用配置文件数据

    }),
    methods: {
      /**
       * @description: 获取航司配置
       * @param {type}
       * @return:
       */

      getDataList() {
        this.configList = []
        this.$axios.get("/config/configFile").then(res => {
          if (res.data.code === 0) {
            let configData = res.data.data
            let trueNuc = []
            let falseNuc = []
            configData.forEach((item, index) => {
              item.is_using = item.is_using === 'yes'
              if (item.is_nuc) {
                item['nuc_type'] = 'nuc-' + index
                trueNuc.push(item)
              } else {
                item['nuc_type'] = 'notNuc-' + index
                falseNuc.push(item)
              }
            })
            this.configList.push({
              nuc_type: 'NUC文件',
              type: 'menu',
              children: trueNuc
            }, {
              nuc_type: '非NUC文件',
              type: 'menu',
              children: falseNuc
            })

            console.log(this.configList);


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

        if (type === "edit") {
          this.configForm = JSON.parse(JSON.stringify(data));
          console.log(this.configForm);
          // if (this.configForm.takeoff_time) {
          //   this.configForm.takeoff_time = this.configForm.takeoff_time.split(
          //     "|"
          //   );
          // }
          // if (this.configForm.ticket_time) {
          //   this.configForm.ticket_time = this.configForm.ticket_time.split("|");
          // }
          // if (this.configForm.validate_time) {
          //   this.configForm.validate_time = this.configForm.validate_time.split(
          //     "|"
          //   );
          // }
        } else {
          this.configForm = {};
        }

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
        this.$confirm(" 该操作将删除此配置文件， 请慎重删除！", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error"
        })
          .then(() => {
            this.$axios.delete('/config/configFile/' + val.air_company)
              .then(res => {
                this.$message(res.data.message)
                if (res.data.code === 0) {
                  this.getDataList()
                }
              })
          })
          .catch(() => {});

      },

      /**
       * @description: 表单提交按钮
       * @param {type}
       * @return:
       */

      submitBtn() {
        let formData = JSON.parse(JSON.stringify(this.configForm));
        console.log(formData);
        formData['code_for_free'] = (formData['code_for_free_en'] ? formData['code_for_free_en'] : '') + '-' + (formData['code_for_free_number'] ? formData['code_for_free_number'] : '')
        delete formData['code_for_free_en']
        delete formData['code_for_free_number']
        // if(formData.takeoff_time || formData.takeoff_time.length > 0){
        //   formData.takeoff_time = String(formData.takeoff_time).replace(",", "|")
        // }
        // if(formData.takeoff_time || formData.ticket_time.length > 0){
        //   formData.ticket_time = String(formData.ticket_time).replace(",", "|")
        // }
        // if(formData.takeoff_time || formData.validate_time.length > 0){
        //   formData.validate_time = String(formData.validate_time).replace(",", "|")
        // }

        formData.is_using = formData.is_using ? 'yes' : 'no' // 是否可用

        console.log(formData);

        this.$axios.post("/config/configFile", formData).then(res => {

          if (res.data.code === 0) {
            this.configDialog = false;
            this.$message.success(res.data.message)
            this.getDataList()
          }else {
            this.$message.warning(res.data.message)
          }
        });
      },

      /**
       * @Description: 是否可用
       * @author Wish
       * @date 2020/6/11
       */
      checkedUsing(val, list) {
        this.checkedStatus = {
          configName: 'configFile',
          isUsing: val ? 'yes' : 'no',
          itemID: list.ID
        }
        if (!val) {
          this.warningDialog = true
        } else {
          this.closeConfig(true)
        }
      },

      /**
       * @Description: 配置文件确认关闭
       * @author Wish
       * @date 2020/6/12
       */
      closeConfig(type) {
        if (type) {
          this.$axios.post('/config/use', this.checkedStatus)
            .then(res => {
              console.log(res);
              if (res.data.code === 0) {
                this.$message.success(res.data.message)
              } else {
                this.$message.warning(res.data.message)
                this.getDataList()
              }
            })
        } else {
          this.getDataList()
        }
        this.warningDialog = false
      },
    },
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

      /deep/ .el-dialog {
        max-width: 1200px;
        width: 100%;
        margin: 0 50px !important;

        .el-dialog__body {
          padding-bottom: unset;
          overflow: auto;
        }
      }

      /deep/ .el-date-editor {
        width: 100%;
      }
    }
  }
</style>