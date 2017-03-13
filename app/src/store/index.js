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
    setSelectedRepo (state, path) {
      const name = _(path.split('/')).last()
      state.selectedRepo = { name, path }
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
      git.collectData(state.selectedRepo)
    }
  }
})

export default store
