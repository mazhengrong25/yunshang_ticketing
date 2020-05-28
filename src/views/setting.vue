<template>
  <div class="setting">
    <div class="header">
      <router-link class="back_btn" to="/">
        <i class="el-icon-arrow-left"></i>返回
      </router-link>
    </div>

    <div class="setting_main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="配置页面" name="setting">
          <settingTemplate ref="getSettingData"></settingTemplate>
        </el-tab-pane>
        <el-tab-pane label="航司配置文件" name="configFile">
          <configFileTemplate ref="getConfigData"></configFileTemplate>
        </el-tab-pane>
        <el-tab-pane label="渠道office号" name="officeNo">
          <officeTemplate></officeTemplate>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "setting",
  components: {
    settingTemplate: () => import("@/components/settingTemplate"),
    configFileTemplate: () => import("@/components/configFileTemplate"),
    officeTemplate: () => import('@/components/officeTemplate')
  },
  data() {
    return {
      activeName: "setting" // 标签页默认值
    };
  },
  methods: {
    /**
     * @Description: 返回上一页
     * @author Wish
     * @date 2020/3/17
     */
    backUrl() {
      this.$router.push("/");
    },

    // 标签页切换
    handleClick(tab, event) {
      if (tab.name === "setting") {
        this.$refs.getSettingData.getDataList();
      }else if(tab.name === 'configFile'){
        this.$refs.getConfigData.getDataList();
      }
    }
  }
};
</script>

<style scoped lang="less">
.setting {
  height: 100vh;
  background: #f2f2f2;
  /*padding: 20px;*/
  overflow-y: auto;
  .header {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    font-size: 16px;
    background: #0070e2;
    .back_btn {
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
  .setting_main {
    padding: 20px;
    background: #fff;
    .setting_title {
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      > p {
        font-size: 24px;
      }
    }
    /deep/.el-tabs__content {
      overflow: unset;
    }

    .main_pagination {
      margin-top: 25px;
    }
  }
}
</style>