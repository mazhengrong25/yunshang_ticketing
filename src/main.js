import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
import {
  Button,
  Select,
  Option,
  Table,
  TableColumn,
  Input,
  DatePicker,
  Pagination,
  Dialog,
  Message } from 'element-ui';

Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Input)
Vue.use(DatePicker)
Vue.use(Pagination)
Vue.use(Dialog)

Vue.prototype.$message = Message;

import axios from "axios";
Vue.prototype.$axios = axios;

import('../src/utlis/tools')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
