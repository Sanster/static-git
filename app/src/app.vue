<template>
  <div class="container">
    <div class="header">
    </div>

    <side-bar v-on:sideBarClick="sideBarClicked"></side-bar>

    <div class="content"
         v-if="dataCollectDone">
      <AuthorList v-show="showStats(0)"
                  :tableData="authorsData"
                  :perPage="12">

      </AuthorList>

      <MonthCommits v-show="showStats(1)"
                    :authorsData="authorsData">

      </MonthCommits>

      <CodeLines v-show="showStats(2)"
                 :lineCount="$git.lineCount">

      </CodeLines>
    </div>
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
    AuthorList,
    MonthCommits,
    CodeLines,
    SideBar
  },
  created () {
    this.$git.collectData(this.showData)
  },
  computed: {
    authorsData () {
      return this.$git.authorsData
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

.container {
}

.header {
  margin-left: 220px;
}

.content {
  position: fixed;
  margin-left: 220px;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow-x: auto;
}
</style>