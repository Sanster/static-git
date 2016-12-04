<template>
  <div class="container">
    <div class="header"> </div>
    <sidebar> </sidebar>
    <load-view v-if="isCollectingData"> </load-view>
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
import Sidebar from 'layout/Sidebar.vue'
import RepoStats from 'components/RepoStats.vue'
import LoadView from 'components/LoadView.vue'
import moment from 'moment'
import { mapState } from 'vuex'

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
    'sidebar': Sidebar,
    'author-list': AuthorList,
    'month-commits': MonthCommits,
    'code-lines': CodeLines,
    'repo-stats': RepoStats,
    'load-view': LoadView
  },
  computed: {
    ...mapState ([
      'currentView',
      'dataCollectDone',
      'isCollectingData',
      'git'
    ]),
    options () {
      if (this.currentView === 'author-list') {
        return {
          fields: this.authorListFields,
          data: this.authorListData,
          perPage: 12
        }
      } else if (this.currentView === 'month-commits') {
        return {
          authorsData: this.git.authorsData
        }
      } else if (this.currentView === 'code-lines') {
        return {
          repoData: this.git.repoData
        }
      }
    },
    authorListData () {
      return _.map(this.git.authorsData, (item) => {
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