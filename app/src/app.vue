<template>
  <div class="container">
    <div class="header">
    </div>

    <sidebar v-on:sideBarClick="sideBarClicked"></sidebar>

    <load-view></load-view>
    <transition name="fade">
      <div class="content"
          v-if="dataCollectDone">
        <div class="content-detail">
          <transition name="fade" mode="out-in">
            <keep-alive>
              <component :is="currentView" :options="options"></component>
            </keep-alive>
          </transition>
        </div>
      </div>
    </transition>
  </div>

</template>

<script>
import AuthorList from 'components/AuthorList.vue'
import MonthCommits from 'components/MonthCommits.vue'
import CodeLines from 'components/CodeLines.vue'
import SideBar from 'layout/SideBar.vue'
import RepoStats from 'components/RepoStats.vue'
import LoadView from 'components/LoadView.vue'
import moment from 'moment'

export default {
  data () {
    return {
      dataCollectDone: false,
      statsIndex: 0,
      authorListFields:[
        {
          label: 'Name',
          key: 'name'
        },
        {
          label: 'Commits',
          key: 'commits'
        },
        {
          label: 'Line ++',
          key: 'additions'
        },
        {
          label: 'Line --',
          key: 'deletions'
        },
        {
          label: 'Active Days',
          key: 'activeDay'
        },
        {
          label: 'First time',
          key: 'firstCommitTime'
        },
        {
          label: 'Last time',
          key: 'lastCommitTime'
        }
      ],
    }
  },
  components: {
    'author-list': AuthorList,
    'month-commits': MonthCommits,
    'code-lines': CodeLines,
    'sidebar': SideBar,
    'repo-stats': RepoStats,
    'load-view': LoadView
  },
  created () {
    // this.$git.collectData(this.showData)
  },
  computed: {
    authorListData () {
      return _.map(this.$git.authorsData, (item) => {
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
    },
    currentView () {
      if (this.statsIndex === 0) {
        return 'author-list'
      } else if (this.statsIndex === 1) {
        return 'month-commits'
      } else if (this.statsIndex === 2) {
        return 'code-lines'
      } else if (this.statsIndex === 3) {
        return 'repo-stats'
      }
    },
    options () {
      if (this.statsIndex === 0) {
        return {
          fields: this.authorListFields,
          data: this.authorListData,
          perPage: 12
        }
      } else if (this.statsIndex === 1) {
        return {
          authorsData: this.$git.authorsData
        }
      } else if (this.statsIndex === 2) {
        return {
          repoData: this.$git.repoData
        }
      }
    }
  },
  methods: {
    showData () {
      this.dataCollectDone = true
    },
    sideBarClicked (index) {
      this.statsIndex = index
    },
    showStats (index) {
      return this.statsIndex === index
    }
  }
}
</script>

<style lang="sass">
body {
  margin: 0;
}

.header {
  margin-left: 220px;
}
</style>