import Vue from 'vue'
import app from './app.vue'
import store from './store'
import 'font-awesome/css/font-awesome.css'

import Git from '../plugins/git'
Vue.use(Git)
const git = new Git()

new Vue({
  store,
  git,
  el: '#app',
  render: h => h(app)
})
