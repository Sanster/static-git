<template>
  <div class="container">
    <div class="header">
      <ul>
        <li>Author Data</li>
        <li>Month Commits</li>
      </ul>
    </div>

    <side-bar>

    </side-bar>

    <div class="content">
      <h1>List of author</h1>
      <VTable v-if="dataCollectDone"
              :fields="fields"
              :tableData="authorsData"
              :perPage="6">

      </VTable>

      <h1>Commits by Month</h1>
      <MonthCommits v-if="dataCollectDone"
                    :authorsData="authorsData">

      </MonthCommits>

      <h1>Repo Lines</h1>
      <CodeLines v-if="dataCollectDone"
                 :lineCount="$git.lineCount">

      </CodeLines>
    </div>
  </div>

</template>

<script>
import VTable from 'components/VTable.vue'
import MonthCommits from 'components/MonthCommits.vue'
import CodeLines from 'components/CodeLines.vue'
import SideBar from 'layout/SideBar.vue'

export default {
  data () {
    return {
      activeIndex: 0,
      dataCollectDone: false,
      fields: {
        'name': 'Name',
        'email': 'Email',
        'commits_count': 'Commits',
        'total_additions': 'Line ++',
        'total_deletions': 'Line --',
        'activeDays': 'Active Day',
        'first_commit_time': 'First time',
        'last_commit_time': 'Last time'
      },
      repos: [
        {
          name: 'gitlab'
        },
        {
          name: 'static-git'
        },
        {
          name: 'starbucks'
        }
      ]
    }
  },
  components: {
    VTable,
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
    isActive (index) {
      return index === this.activeIndex
    },
    itemClick (index) {
      this.activeIndex = index
    },
    showData () {
      this.dataCollectDone = true
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