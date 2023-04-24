import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import API from '@/api'

import { Menu, Submenu, MenuItem, MenuItemGroup, Select, Option, 
  Button, Table, TableColumn, Form, FormItem, Input } from 'element-ui'

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.config.productionTip = false

Vue.prototype.$API = API


new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this // 全局事件总线
  }
}).$mount('#app')
