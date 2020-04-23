<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style scoped lang="less">
  /deep/.el-table{
    .el-table__header{
      tr{
        color: #fff;
        th{
          background-color: #0070E2;
          border-right:1px solid #e6f0fa;
        }
      }
    }
    .el-table__body{
      .el-table__row{
        &.current-row{
          td{
            background: #D3EAFF !important;
          }
        }
        &.el-table__row--striped{
          td{
            background: #F0F5FA;
          }
        }
      }
    }
  }

</style>
