<template>
  <div class="office_no">



  </div>
</template>

<script>
export default {
  name: 'officeTemplate',
  data: () => ({

  }),
  methods: {
    getDataList(){
      
      this.$axios.get('/config/officeNo',data)
        .then(res =>{
          console.log(res);
          
        })
    },
  },

  created(){
    // this.getDataList()
  },


}
</script>

<style lang="less" scoped>
  .office_no{

  }
</style>