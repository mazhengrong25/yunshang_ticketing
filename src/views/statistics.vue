<template>
  <div class="statistics">
    <div class="header">
      <router-link class="back_btn" to="/"><i class="el-icon-arrow-left"></i>返回</router-link>
    </div>


  </div>
</template>

<script>
  export default {
    name: "statistics",
    data(){
      return {

      }
    },
  }
</script>

<style scoped lang="less">
  .statistics{
    .header{
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      font-size: 16px;
      background: rgba(0, 123, 255, 0.8);
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

  }
</style>