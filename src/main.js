import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import API from '@/api'

import { Menu, Submenu, MenuItem, MenuItemGroup, Select, Option, 
  Button, Table, TableColumn, Pagination, Form, FormItem, Tag,
  Input, MessageBox, Message } from 'element-ui'

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tag)
Vue.use(Input)
Vue.component(MessageBox.name, MessageBox)
Vue.component(Message.name, Message)

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message

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
