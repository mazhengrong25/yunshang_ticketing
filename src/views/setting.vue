<template>
  <div class="setting">
    <div class="header_title">
      <div class="back_btn" @click="backUrl">< 返回上一页</div>
    </div>
    <div class="setting_main">
      <div class="setting_title">
        <p>配置页面</p>
        <el-button size="small" type="primary" @click="openSettingDialog('add')">新增</el-button>
      </div>

      <div class="setting_table">
        <el-table
          :data="dataList"
          stripe
          border
          highlight-current-row
          style="width: 100%">
          <el-table-column
            align="center"
            width="300"
            show-overflow-tooltip
            prop="project"
            label="项目名称">
          </el-table-column>
          <el-table-column
            align="center"
            width="100"
            show-overflow-tooltip
            prop="request_way"
            label="请求方式">
          </el-table-column>
          <el-table-column
            align="left"
            show-overflow-tooltip
            prop="url"
            label="请求路径">
          </el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="exchange_name"
            label="交换机名">
          </el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            width="200"
            prop="author"
            label="作者">
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button @click="openSettingDialog('edit',scope.row)" type="warning" size="mini">编辑</el-button>
              <el-button @click="deleteList(scope.row)" type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>

    </div>

    <el-dialog
      :append-to-body="true"
      custom-class="setting_dialog"
      :title="settingType === 'add'?'新增配置':'编辑配置'"
      :visible.sync="settingDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="500px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="项目名称" prop="project">
          <el-input v-model="ruleForm.project"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="request_way">
          <el-select style="width: 100%" v-model="ruleForm.request_way" placeholder="请选择请求方式">
            <el-option label="mq" value="mq"></el-option>
            <el-option label="http" value="http"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求路径" prop="url">
          <el-input v-model="ruleForm.url"></el-input>
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

  </div>
</template>

<script>
  export default {
    name: "setting",
    data(){
      return {
        dataList: [], // 配置列表

        settingDialog: false, // 配置弹窗
        settingType: '', // 弹窗属性

        ruleForm: {  // 弹窗字段
          project: '',
          request_way: '',
          url: ''
        },
        rules: {  // 表单验证
          project: [  // 项目名称
            {required: true, message: '请填写项目名称', trigger: 'blur'}
          ],
          request_way: [  // 请求方式
            {required: true, message: '请选择请求方式', trigger: 'change'}
          ],
          url: [  // 请求路径
            {required: true, message: '请填写请求路径', trigger: 'blur'}
          ],
          author: [  // 渠道名称
            {required: true, message: '请填写作者名称', trigger: 'blur'}
          ],
        },


        pageNum: 1,
        pageSize:20,
      }
    },
    methods:{
      /**
       * @Description: 返回上一页
       * @author Wish
       * @date 2020/3/17
      */
      backUrl(){
        this.$router.push('/')
      },

      /**
       * @Description: 获取配置信息
       * @author Wish
       * @date 2020/3/17
      */
      getDataList(){
        let data = {
          project: ''
        }
        this.$axios.post('/config/get',data)
          .then(res =>{
            if(res.data.code === 0){
              this.dataList = res.data.data
            }else {
              this.$message.warning(res.data.message)
            }
          })
      },


      /**
       * @Description: 打开弹窗
       * @author Wish
       * @date 2020/3/17
      */
      openSettingDialog(type,val){
        console.log(type,val);
        console.log(this.settingDialog);
        this.settingType = type
        this.settingDialog = true
        this.ruleForm =  val?JSON.parse(JSON.stringify(val)):{}
        console.log(this.settingDialog);
      },

      /**
       * @Description: 关闭弹窗
       * @author Wish
       * @date 2020/3/17
      */
      closedDialog(formName){
        this.settingDialog = false
        this.ruleForm = {}
        this.$refs[formName].resetFields();
      },

      /**
       * @Description: 提交表单
       * @author Wish
       * @date 2020/3/17
      */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = this.settingType === 'add'? '/config/set' :
                      this.settingType === 'edit'? '/config/update' : ''
            this.$axios.post(url,this.ruleForm)
              .then(res =>{
                console.log(res);
                if(res.data.code === 0){
                  this.$message.success('保存成功')
                  this.getDataList()
                  this.closedDialog()
                }else {
                  this.$message.warning(res.data.message)

                }
              })
          }
        });
      },


      /**
       * @Description: 删除确认框
       * @author Wish
       * @date 2020/3/17
      */
      deleteList(val){
        this.$confirm(' 删除此条配置，该渠道将不能退票， 请慎重删除！', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          console.log(val);
          let data = {
            project: val.project
          }
          this.$axios.post('/config/del',data)
            .then(res =>{
              console.log(res);
              if(res.data.code === 0){
                this.$message.success(res.data.message)
                this.getDataList()
              }
            })
        }).catch(() => {

        });
      },


      // /**
      //  * @Description: 分页器
      //  * @author Wish
      //  * @date 2020/3/17
      // */
      // handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      //   this.pageSize=val;
      // },
      // handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      //   this.pageNum = val;
      // },

    },
    created() {
      this.getDataList()
    },

    // filters:{
    //   pagination(dataList,pageNum,pageSize){
    //     let offset = (pageNum - 1) * pageSize;//当前页第一条的索引
    //     return (offset + pageSize >= dataList.length) ? dataList.slice(offset, dataList.length) : dataList.slice(offset, offset + pageSize)
    //   }
    // },
  }
</script>

<style scoped lang="less">
  .setting{
    height: 100vh;
    background: #f2f2f2;
    padding: 20px;
    overflow-y: auto;
    .header_title{
      margin-bottom: 20px;
      .back_btn{
        font-size: 14px;
        color: gray;
        cursor: pointer;
        display: inline-flex;
      }
    }
    .setting_main{
      padding: 20px;
      background: #fff;
      .setting_title{
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        >p{
          font-size: 24px;
        }
      }

      .main_pagination{
        margin-top: 25px;
      }
    }
  }
</style>