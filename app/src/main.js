import Vue from 'vue'
import app from './app.vue'
import store from './store'
// import Icon from 'vue-awesome/components/Icon.vue'
// import 'vue-awesome/icons'

// Vue.component('icon', Icon)

// my own plugin
import Git from '../plugins/git'
Vue.use(Git)
const git = new Git()

new Vue({
  store,
  git,
  el: '#app',
  render: h => h(app)
})
