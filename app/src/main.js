// import NodeGit from "nodegit";

// var pathToRepo = require("path").resolve("../../vue-todoist");

// NodeGit.Repository.open(pathToRepo).then(function (repo) {
  
// });

import Vue from 'vue'
import app from './app.vue'

import {ipcRenderer} from 'electron'

ipcRenderer.on('get-commit-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('get-commit-message', 'ping')


new Vue({
  el: '#app',
  render: h => h(app)
})