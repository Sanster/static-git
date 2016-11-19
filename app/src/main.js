import Vue from 'vue'
import app from './app.vue'
import store from './store'
import Element from 'element-ui'
import 'font-awesome/css/font-awesome.css'
import './stylesheet/app.scss'
import './stylesheet/vue-transition.scss'

import Git from '../plugins/git'
Vue.use(Git)
const git = new Git()

Vue.use(Element)
import 'element-ui/lib/theme-default/index.css'

new Vue({
  store,
  git,
  el: '#app',
  render: h => h(app)
})
