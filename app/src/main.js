import Vue from 'vue'
import app from './app.vue'
import store from './store'
import 'font-awesome/css/font-awesome.css'
import './stylesheet/app.scss'
import './stylesheet/vue-transition.scss'

new Vue({
  store,
  el: '#app',
  render: h => h(app)
})
