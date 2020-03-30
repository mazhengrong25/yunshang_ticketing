<template>
  <div>
    <div class="header">
      <router-link class="back_btn" to="/"><i class="el-icon-arrow-left"></i>返回</router-link>
    </div>
    <markdown-preview :initialValue="markDown"></markdown-preview>
  </div>
</template>

<script>
  import { MarkdownPreview } from 'vue-meditor'
  export default {
    name: "readme",
    components:{
      MarkdownPreview
    },
    data(){
      return {
        markDown: ''
      }
    },
    methods:{
      getMdData(){
        this.$axios.get('http://192.168.0.212:8006/README.md')
          .then(res =>{
            this.markDown = res.data
          })
      },
    },
    created() {
      this.getMdData()
    }
  }
</script>

<style scoped lang="less">
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
</style>