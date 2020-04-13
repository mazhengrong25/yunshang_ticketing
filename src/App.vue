<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style scoped lang="less">
  /deep/.el-table__body tr.current-row>td{
    background: rgba(230,160,0,.2) !important;
  }
</style>
