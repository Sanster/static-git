import Vue from 'vue'
import Vuex from 'vuex'
import git from 'modules/git'
import moment from 'moment'

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
    },
  },
  getters: {
    authorListData: state => {
      return _.map(git.authorsData, (item) => {
        return {
          name: item.name,
          email: item.email,
          commits: item.commitsCount.total,
          additions: item.additions.total,
          deletions: item.deletions.total,
          activeDay: item.commitsCount.validDayCount(),
          firstCommitTime: moment(item.firstCommitTime).format('L'),
          lastCommitTime: moment(item.lastCommitTime).format('L')
        }
      })
    }
  }
})

export default store
