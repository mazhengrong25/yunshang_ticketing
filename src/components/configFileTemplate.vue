<template>
  <div class="config_file"></div>
</template>

<script>
export default {
  name: 'config_file',
  data: () =>({
      configList: [], //  获取
  }),
  methods: {
    getDataList(){
      this.$axios.get('/config/configFile')
        .then(res =>{
          console.log(res);
          
        })
    },
  },
}
</script>

<style lang="less" scoped>
  .config_file{

  }
</style>