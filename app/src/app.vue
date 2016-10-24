<template>
  <div class="container">
    <div class="sidebar">
      <ul>
        <li v-for="(repo, index) in repos" 
            class="list-group-item" 
            :class="{ 'active': isActive(index) }"
            @click="itemClick(index)"> 
          <a> {{repo.name}} </a>
        </li>
      </ul>
    </div>

    <div class="content">
      <h1>List of author</h1>
      <VTable v-if="dataCollectDone" 
              :fields="fields" 
              :tableData="authorData"
              :perPage="6">
        
      </VTable>

      <h1>Commits by Month</h1>
      <MonthCommits v-if="dataCollectDone">
        
      </MonthCommits>
    </div>   
  </div>

</template>

<script>
import VTable from './components/VTable.vue'
import MonthCommits from './components/MonthCommits.vue'

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
    MonthCommits
  },
  created () {
    this.$git.collectData(this.showData)
  },
  computed: {
    authorData () {
      return this.$git.authorDatas
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
      // console.log(commits);
      // this.commits = commits;
      this.dataCollectDone = true
    }
  }
}
</script>

<style lang="sass">
$sidebar-width: 220px;

body {
  margin: 0;
}

.sidebar {
  position: fixed;
  width: $sidebar-width;
  top: 0;
  left: 0;
  bottom: 0;
  border-right: 1px solid #e7e7e7;

  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;

    .list-group-item {
      &:hover {
        background: #e7e7e7;
      }

      height: 40px;
      line-height: 40px;
      background: #f8f8f8;
      border-bottom: 1px solid #e7e7e7;

      &.active {
        border-left: 4px solid #86bc63;
      }

      a {
        padding-left: 15px;
      }
    }
  }
}

.container {
}

.content {
  position: fixed;
  margin-left: $sidebar-width;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow-x: auto;
}
</style>