<template>
  <div class="setting_details">
    <div class="details_header">


    </div>
    <div class="details_main">



    </div>
  </div>
</template>

<script>
export default {
  name: 'settingDetails',
  data(){
    return {
      detailsStatus: {},  // 初始值

      detailsData: {}, // 详情数据
    }
  },
  methods: {
    getDetailsData(){
      let data = {
        id: Number(this.detailsStatus.id),
        start_time: this.detailsStatus.time
      }
      this.$axios.post('/refund/query',data)
        .then(res =>{
          this.detailsData = res.data.data[0]
          console.log(this.detailsData);
        })
    },
  },
  created(){
    this.detailsStatus = this.$route.query
    this.getDetailsData()
  },
}
</script>

<style lang="less" scoped>
  .setting_details{
    
  }
</style>