<template>
  <div>
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
      <STable fields="fields" tableData="commits" ></STable>
    </div>   
  </div>

</template>

<script>
import STable from './components/STable.vue';

export default {
  data () {
    return {
      activeIndex: 0,
      commits: {},
      fields: ["name",],
      repos: [
        { 
          name: 'gitlab',
        },
        { 
          name: 'static-git',
        },
        { 
          name: 'starbucks',
        }
      ]
    }
  },
  components: {
    STable,
  },
  created () {
    this.$git.collectData(this.showData);
  },
  methods: {
    isActive (index) {
      return index === this.activeIndex;
    },
    itemClick (index) {
      this.activeIndex = index;
    },
    showData (commits) {
      console.log(commits);
      this.commits = commits;
    }
  }
}
</script>

<style lang="sass">
body {
  margin: 0;
}

.sidebar {
  position: fixed;
  width: 220px;
  top: 0;
  left: 0;
  bottom: 0;
  border-right: 1px solid #e7e7e7;
}

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
</style>