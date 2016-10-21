import Vue from 'vue'
import app from './app.vue'
import store from './store'
import * as d3 from "d3"

// my own plugin
import Git from '../plugins/git.js'

Vue.use(Git);
const git = new Git();

new Vue({
  store,
  git,
  el: '#app',
  render: h => h(app)
})