import Vue from 'vue'
import Vuex from 'vuex'
import git from 'modules/git'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    dataCollectDone: false,
    isCollectingData: false,
    currentView: 'author-list',
    repositories: [],
    selectedRepo: {
      name: '',
      path: ''
    }
  },
  mutations: {
    addRepository (state, path) {
      const name = _(path.split('/')).last()
      const repo = { name, path }
      state.repositories.push(repo)
      state.selectedRepo = repo
    },
    setSelectedRepo (state, repo) {
      state.selectedRepo = repo
    },
    dataCollectStart (state) {
      state.dataCollectDone = false
      state.isCollectingData = true
    },
    dataCollectFinish (state) {
      state.dataCollectDone = true
      state.isCollectingData = false
    },
    setCurrentView (state, view) {
      state.currentView = view
    }
  },
  actions: {
    startDataCollect ({ commit, state }) {
      commit('dataCollectStart')
      git.collectData(state.selectedRepo.path, commit)
    }
  }
})

export default store
