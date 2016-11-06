<template>
  <div class="container">
    <div class="header">
    </div>

    <sidebar v-on:sideBarClick="sideBarClicked"></sidebar>

    <transition name="fade">
      <div class="content"
          v-if="dataCollectDone">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <component :is="currentView" :options="options"></component>
          </keep-alive>
        </transition>
      </div>
    </transition>
  </div>

</template>

<script>
import AuthorList from 'components/AuthorList.vue'
import MonthCommits from 'components/MonthCommits.vue'
import CodeLines from 'components/CodeLines.vue'
import SideBar from 'layout/SideBar.vue'

export default {
  data () {
    return {
      dataCollectDone: false,
      statsIndex: 0
    }
  },
  components: {
    'author-list': AuthorList,
    'month-commits': MonthCommits,
    'code-lines': CodeLines,
    'sidebar': SideBar
  },
  created () {
    this.$git.collectData(this.showData)
  },
  computed: {
    authorsData () {
      return this.$git.authorsData
    },
    currentView () {
      if (this.statsIndex === 0) {
        return 'author-list'
      } else if (this.statsIndex === 1) {
        return 'month-commits'
      } else if (this.statsIndex === 2) {
        return 'code-lines'
      }
    },
    options () {
      if (this.statsIndex === 0) {
        return {
          authorsData: this.authorsData
        }
      } else if (this.statsIndex === 1) {
        return {
          authorsData: this.authorsData
        }
      } else if (this.statsIndex === 2) {
        return {
          lineCount: this.$git.lineCount
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

.content {
  margin-left: 220px;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow-x: auto;
}
</style>