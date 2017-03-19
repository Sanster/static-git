<template>
  <div class="author-list">
    <!--<div class="author-list-header">
      <div class="author-list-title">
        <span>{{totalAuthors}}</span>
        <h3>Contributors</h3>
      </div>
    </div>-->
    <div class="author-list-filter">
      <el-date-picker
        v-model="startDate"
        type="date"
        placeholder="Start Date">
      </el-date-picker>

      <el-date-picker
        v-model="endDate"
        type="date"
        placeholder="End Date">
      </el-date-picker>

      <el-button @click="getPeriodData">get</el-button>
      <div
        class="author-search"
        :class="{ active: searchFocused }">
        <i class="fa fa-search search-icon"></i>
        <input
          type="text"
          class="author-search-input"
          placeholder="name"
          v-model="searchWord"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur">
      </div>
    </div>
    <table class="author-list-table">
      <thead>
        <tr>
          <th class="author-rank">
          <el-tooltip effect="dark" :content="totalAuthors + ' Contributors'" placement="top">
            <span>#</span>
          </el-tooltip>
          </th>
          <th v-for="field in fields"
              @click.prevent="sortByKey(field.key)"
              :class="field.key + '__col'">
            <div class="field__header"
                :class="downSort ? 'down' : 'up'">
              <a href="#">{{field.label}}</a>
              <i class="fa fa-caret-down sort-icon"
                v-show="field.key == sortKey"></i>
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-cloak>
        <tr v-for="(val, index) in sortedData">
          <td>{{index + 1}}</td>
          <td v-for="field in fields">
            <div :class="field.key + '__col'">
              <template v-if="field.key === 'name'">
                <img v-lazy="getGravatarUrl(val['email'])"
                     :title="val['email']"
                     class="author-avatar"/>
              </template>
              <span> {{val[field.key]}} </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import git from 'modules/git'
import moment from 'moment'
import Fuse from 'fuse.js'
import gravatar from 'gravatar'

let fuse

export default {
  data () {
    return {
      startDate: '',
      endDate: '',
      initSortKey: 'commits',
      sortKey: '',
      downSort: true,
      searchWord: '',
      sortByFuzzySearch: false,
      searchFocused: false,
      fields: [
        { label: 'Name', key: 'name' },
        { label: 'Commits', key: 'commits' },
        { label: '+ +', key: 'additions' },
        { label: '- -', key: 'deletions' },
        { label: 'Active Days', key: 'activeDay' },
        { label: 'First Commit', key: 'firstCommitTime' },
        { label: 'Last Commit', key: 'lastCommitTime' }
      ]
    }
  },
  beforeMount () {
    this.sortByKey(this.initSortKey)
    fuse = new Fuse(this.authorListData, { keys: ['name'] })
  },
  computed: {
    authorListData () {
      return _.map(git.authorsData, item => {
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
    totalAuthors () {
      return this.authorListData.length
    },
    sortedData () {
      let filteredData

      if (this.searchWord) {
        filteredData = fuse.search(this.searchWord)
        if (!this.sortByFuzzySearch) {
          filteredData = this.sortData(filteredData)
        }
      } else {
        filteredData = this.sortData(this.authorListData)
      }

      return filteredData
    }
  },
  methods: {
    handleSearchFocus () {
      this.searchFocused = true
    },
    handleSearchBlur () {
      this.searchFocused = false
    },
    compareKey (key) {
      const downSort = this.downSort

      return function (authorData1, authorData2) {
        const compareVal1 = authorData1[key]
        const compareVal2 = authorData2[key]

        if (compareVal1 > compareVal2) {
          return downSort ? -1 : 1
        } else if (compareVal1 < compareVal2) {
          return downSort ? 1 : -1
        }

        return 0
      }
    },
    sortByKey (key) {
      this.sortByFuzzySearch = false

      if (this.sortKey !== key) {
        this.downSort = true
        this.sortKey = key
      } else {
        this.downSort = !this.downSort
      }
    },
    sortData (dataToSort) {
      return dataToSort.slice().sort(this.compareKey(this.sortKey))
    },
    getGravatarUrl (email) {
      return gravatar.url(email, { protocol: 'http', default: 'mm' })
    },
    getPeriodData () {
      console.log(this.startDate)
      console.log(this.endDate)
    }
  },
  watch: {
    authorListData () {
      this.downSort = true
      this.sortKey = ''
      this.sortByKey(this.initSortKey)
    },
    searchWord () {
      this.sortByFuzzySearch = true
    }
  }
}
</script>

<style lang="sass">
@import '../stylesheet/vars.scss';

$name-col-width: 140px;
$commits-col-width: 90px;
$add-del-col-width: 60px;
$active-day-width: 100px;
$commit-time-width: 100px;

$search-input-width: 110px;

.author-list {
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.author-avatar {
  height: 30px;
  width: 30px;
  min-width: 30px;
  border-radius: 15px;
  margin-right: 10px;
}

.author-list-header {
  position: relative;
  padding-top: 20px;
  margin: auto;
  margin-bottom: 20px;
}

.author-list-filter {
  display: flex;
  align-items: flex-end;
  margin-bottom: 15px;
}

.author-list-table {
  font-size: 15px;
  position: relative;
  z-index: 1;
  border-collapse: collapse;

  tbody {
    tr:hover {
      background-color: #f5f5f5;
    }
  }

  .author-rank {
    width: 20px;
  }

  th {
    cursor: pointer;

    a {
      color: #131212;
    }

    .field__header {
      position: relative;
      width: 100%;
    }

    .sort-icon {
      position: relative;
      right: 0px;
    }
  }

  th, td {
    padding: 9px;
    text-align: center;
  }

  tr {
    border-bottom: 1px solid #e6e6e6;
  }

  td {
    height: 22px;
    vertical-align: center;

    .name__col {
      display: flex;
      align-items: center;
    }
  }

  .name__col {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    align-items: center;
    text-align: left;
    width: $name-col-width;
  }

  .commits__col {
    width: $commits-col-width;
  }

  .additions__col,
  .deletions__col {
    width: $add-del-col-width;
  }

  .activeDay__col {
    width: $active-day-width;
  }

  .firstCommitTime__col,
  .lastCommitTime__col {
    width: $commit-time-width;
  }
}

.author-list-title {
  & > h3 {
    display: inline;
  }
}

.author-search-input {
  height: 25px;
  border: 0px;
  border-bottom: 1px solid #dcd9d9;
  padding-left: 22px;
  width: $search-input-width;

  &:focus {
    outline: none;
  }
}

.author-search {
  position: relative;

  .search-icon {
    position: absolute;
    top: 5px;
    color: #dcd9d9;
  }

  &.active {
    .search-icon {
      color: gray;
    }

    .author-search-input {
      border-bottom: 1px solid gray;
    }
  }
}
</style>