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
  Form,
  FormItem,
  Drawer,
  OptionGroup,
  MessageBox,
  Tabs,
  TabPane,
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
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Drawer)
Vue.use(OptionGroup)
Vue.use(Tabs)
Vue.use(TabPane)

Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;

import ExTableColumn from 'ex-table-column';
Vue.component(ExTableColumn.name, ExTableColumn);

import axios from "axios";
Vue.prototype.$axios = axios;

// axios.defaults.baseURL = 'http://192.168.0.176:8006'

import('../src/utlis/tools')

import('../public/base.less')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
