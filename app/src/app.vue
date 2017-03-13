<template>
  <div class="container">
    <title-bar></title-bar>
    <empty-view v-if="!isCollectingData"></empty-view>
    <load-view v-if="isCollectingData"> </load-view>
    <div class="content"
        v-if="dataCollectDone">
      <div class="content-detail">
          <keep-alive>
            <component :is="currentView" :options="options"></component>
          </keep-alive>
      </div>
    </div>
  </div>

</template>

<script>
import TitleBar from 'components/TitleBar.vue'
import EmptyView from 'layout/EmptyView.vue'
import AuthorList from 'components/AuthorList.vue'
import RepoStats from 'components/RepoStats.vue'
import LoadView from 'components/LoadView.vue'
import moment from 'moment'
import { mapState } from 'vuex'

import git from 'modules/git'

export default {
  data () {
    return {
      dataCollectDone: false,
      statsIndex: 0
    }
  },
  components: {
    'empty-view': EmptyView,
    'title-bar': TitleBar,
    'author-list': AuthorList,
    'repo-stats': RepoStats,
    'load-view': LoadView
  },
  computed: {
    ...mapState([
      'currentView',
      'dataCollectDone',
      'isCollectingData'
    ]),
    options () {
      switch (this.currentView) {
        case 'author-list':
          return {
            data: this.authorListData
          }
        case 'repo-stats':

          break
      }
    },
    authorListData () {
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