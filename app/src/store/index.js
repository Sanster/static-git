import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    dataCollectDone: false,
    currentView: 'author-list',
    repositories: [
      {
        name: "Gitlab",
        path: "/Users/cwq/gitlab-development-kit/gitlab"
      }
    ],
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
    startDataCollect (state) {
      state.dataCollectDone = false
    },
    finishDataCollect (state) {
      state.dataCollectDone = true
    },
    setCurrentView (state, view) {
      state.currentView = view
    }
  }
})

export default store
