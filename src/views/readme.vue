<template>
  <div>
    <div class="header">
      <router-link class="back_btn" to="/"><i class="el-icon-arrow-left"></i>返回</router-link>
    </div>
    <markdown-preview class="markdown_preview" :initialValue="markDown"></markdown-preview>
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
        this.$axios.get('/README.md')
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
  .markdown_preview{
    max-width: 900px;
    margin: 0 auto;
  }
</style>