<!--
 * @Author: your name
 * @Date: 2020-05-28 14:56:28
 * @LastEditTime: 2020-05-28 14:58:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \yunshang_ticketing\src\components\officeTemplate.vue
--> 

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