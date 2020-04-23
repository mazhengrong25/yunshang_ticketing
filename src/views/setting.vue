<template>
  <div class="setting">
    <div class="header">
      <router-link class="back_btn" to="/"><i class="el-icon-arrow-left"></i>返回</router-link>
    </div>

    <div class="setting_main">
      <div class="setting_title">
        <p>配置页面</p>
        <el-button size="small" type="primary" @click="openSettingDialog('add')">新增</el-button>
      </div>

      <div class="setting_table">
        <el-table
          :data="dataList"
          row-key="ID"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          stripe
          border
          @row-dblclick="dbClickOpenData"
          ref="settingTable"
          height="calc(100vh - 170px)"
          highlight-current-row
          style="width: 100%">
          <el-table-column
            width="200"
            show-overflow-tooltip
            prop="project"
            label="渠道类型">
          </el-table-column>
          <el-table-column
            label="渠道名称"
            width="300"
            show-overflow-tooltip
            prop="channel_name">
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
            <template slot-scope="scope" v-if="scope.row.type !== 'menu'">
              <el-button @click="openSettingDialog('edit',scope.row)" type="primary" size="mini">编辑</el-button>
              <el-button class="delete_btn" @click="deleteList(scope.row)" type="primary" plain size="mini">删除</el-button>
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
        <el-form-item label="渠道类型" prop="project">
          <el-input v-model="ruleForm.project"></el-input>
        </el-form-item>
        <el-form-item label="渠道名称" prop="channel_name">
          <el-input v-model="ruleForm.channel_name"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="request_way">
          <el-select style="width: 100%" v-model="ruleForm.request_way" placeholder="请选择请求方式" @change="editRequestType(ruleForm.request_way)">
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

  </div>
</template>

<script>
  import elTableInfiniteScroll from 'el-table-infinite-scroll';
  export default {
    name: "setting",
    directives: {
      'el-table-infinite-scroll': elTableInfiniteScroll
    },
    data(){
      return {
        dataList: [], // 配置列表

        settingDialog: false, // 配置弹窗
        settingType: '', // 弹窗属性

        ruleForm: {  // 弹窗字段
          project: '',
          channel_name: '',
          request_way: '',
          exchange_name: '',
          url: ''
        },
        rules: {  // 表单验证
          project: [  // 渠道类型
            {required: true, message: '请填写渠道类型', trigger: 'blur'}
          ],
          channel_name: [  // 渠道名称
            {required: true, message: '请填写渠道名称', trigger: 'blur'}
          ],
          request_way: [  // 请求方式
            {required: true, message: '请选择请求方式', trigger: 'change'}
          ],
          url: [  // 请求路径
            {required: true, message: '请填写请求路径', trigger: 'blur'}
          ],
          exchange_name: [  // 交换机名
            {required: true, message: '请填写交换机名', trigger: 'blur'}
          ],
          author: [  // 作者名称
            {required: true, message: '请填写作者名称', trigger: 'blur'}
          ],
        },


        limit: 20,
        // offset:0,

        loadStatus: false,

        tableOpenName: '',

        clickTableName: [],
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
       * @Description:
       * @author Wish
       * @date 2020/4/22
      */
      editRequestType(val){
        this.rules.exchange_name.map(item =>{
          return item.required = val === 'mq'
        })
      },

      // load(){
      //   if(this.loadStatus){
      //     this.limit = this.limit + this.limit + 1
      //     this.getDataList()
      //   }
      // },

      /**
       * @Description: 双击table行
       * @author Wish
       * @date 2020/4/23
      */
      dbClickOpenData(row, column, event){
        console.log(row.ID);
        console.log(this.clickTableName);
        // for (let i = 0; )
        this.clickTableName.forEach(item =>{
          console.log(item === row.ID);
          if(item === row.ID){
            this.$refs.settingTable.toggleRowExpansion(row, false)
            this.clickTableName.remove(row.ID)
          }else {
            this.$refs.settingTable.toggleRowExpansion(row, true)
            this.clickTableName.push(row.ID)
          }
        })
        console.log(this.clickTableName);
      },

      /**
       * @Description: 获取配置信息
       * @author Wish
       * @date 2020/3/17
      */
      getDataList(){
        let data = {
          project: '',
          // limit: this.limit,
          // offset: this.offset,
        }
        this.$axios.post('/config/get',data)
          .then(res =>{
            if(res.data.code === 0){
              // if(this.loadStatus){
              //   if(res.data.data.length> 0){
              //     this.dataList = this.dataList.concat(res.data.data)
              //   }else {
              //     this.loadStatus = false
              //     this.$message.warning('暂无更多数据')
              //   }
              // }else {
              //
              // }
              let settingData= res.data.data

              if(settingData.length> 0){
                const listArr = [];
                settingData.forEach((el,index) =>{
                  for(let i=0; i<listArr.length; i++){
                    if(listArr[i].project === el.project){
                      listArr[i].children.push(el);
                      return;
                    }
                  }
                  listArr.push({
                    project: el.project,
                    ID: el.project + index,
                    type: 'menu',
                    children: [el]
                  });
                });
                listArr.map(res =>{
                  res.project = res.project + ' ('+res.children.length + ')'
                })
                console.log(listArr);
                this.dataList = listArr
              }
            }else {
              console.log(res);
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

          this.$axios.post('/config/del',val)
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
    /*padding: 20px;*/
    overflow-y: auto;
    .header{
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      font-size: 16px;
      background: #0070E2;
      .back_btn{
        color: #fff;
        height: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
        i{
          margin-right: 10px;
        }
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
      .setting_table{
        .delete_btn{
          background: #fff;
          border: 2px solid #409EFF;
          transition: all .3s;
          &:hover{
            color: #fff;
            background: #409EFF;
          }
        }
      }

      .main_pagination{
        margin-top: 25px;
      }
    }
  }
</style>