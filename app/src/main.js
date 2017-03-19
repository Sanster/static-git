import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import app from './app.vue'
import VueLazyload from 'vue-lazyload'
import store from './store'
import 'font-awesome/css/font-awesome.css'
import './stylesheet/app.scss'

Vue.use(ElementUI)

// or with options
Vue.use(VueLazyload, {
  preLoad: 1.5,
  attempt: 1
})

new Vue({
  store,
  el: '#app',
  render: h => h(app)
})
