<template>
  <div class="container">
    <title-bar></title-bar>
    <empty-view v-if="!isCollectingData"></empty-view>
    <load-view v-if="isCollectingData"> </load-view>
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
  </div>

</template>

<script>
import TitleBar from 'components/TitleBar.vue'
import EmptyView from 'layout/EmptyView.vue'
import AuthorList from 'components/AuthorList.vue'
import MonthCommits from 'components/MonthCommits.vue'
import CodeLines from 'components/CodeLines.vue'
import RepoStats from 'components/RepoStats.vue'
import LoadView from 'components/LoadView.vue'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  data () {
    return {

      dataCollectDone: false,
      statsIndex: 0,
      authorListFields: [
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
      ]
    }
  },
  components: {
    'empty-view': EmptyView,
    'title-bar': TitleBar,
    'author-list': AuthorList,
    'month-commits': MonthCommits,
    'code-lines': CodeLines,
    'repo-stats': RepoStats,
    'load-view': LoadView
  },
  computed: {
    ...mapState([
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
          perPage: 10
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
@import 'stylesheet/vars.scss';

body {
  margin: 0;
}

.container {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>