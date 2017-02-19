<template>
  <div class="author-list card">
    <div class="card-header">
      <div class="card-title">
        <div class="author-list-title">
          <span>{{totalAuthrs}}</span>
          <h3>Contributors</h3>
        </div>
      </div>
      <div
        class="search"
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
          <th class="author-rank">#</th>
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
        <tr v-for="(data, index) in pageData">
          <td>{{currentPage * perPage + index + 1}}</td>
          <td v-for="field in fields">
            <div :class="field.key + '__col'">
              <template v-if="field.key === 'name'">
                <img :src="getGravatarUrl(data['email'])"
                     :title="data['email']"
                     class="author-avatar"/>
              </template>
              {{data[field.key]}}
            </div>
          </td>
        <tr>
      </tbody>
    </table>
    <div class="card-footer">
      <pagination :total="totalPage"
                  v-on:currentChange="pageChange"></pagination>
    </div>

  </div>
</template>

<script>
import Pagination from './Pagination.vue'
import Fuse from 'fuse.js'
import gravatar from 'gravatar'

let fuse

export default {
  props: [
    'options'
  ],
  components: {
    'pagination': Pagination
  },
  data () {
    return {
      currentPage: 0,
      initSortKey: 'commits',
      sortKey: '',
      downSort: true,
      sortedData: {},
      searchWord: '',
      sortByFuzzySearch: false,
      searchFocused: false
    }
  },
  beforeMount () {
    this.sortByKey(this.initSortKey)
    fuse = new Fuse(this.data, { keys: ['name'] })
  },
  computed: {
    totalPage () {
      return Math.ceil(this.data.length / this.perPage)
    },
    totalAuthors () {
      return this.data.length
    },
    fields () {
      return this.options.fields
    },
    data () {
      return this.options.data
    },
    perPage () {
      return this.options.perPage
    },
    pageData () {
      let filteredData
      if (this.searchWord) {
        filteredData = fuse.search(this.searchWord)
        if (!this.sortByFuzzySearch) {
          filteredData = this.sortData(filteredData)
        }
      } else {
        filteredData = this.sortData(this.data)
      }
      const sliceData = filteredData.slice(this.currentPage * this.perPage,
                                        (this.currentPage + 1) * this.perPage)
      return sliceData
    }
  },
  methods: {
    handleSearchFocus () {
      this.searchFocused = true
    },
    handleSearchBlur () {
      this.searchFocused = false
    },
    pageChange (page) {
      this.currentPage = page
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
    }
  },
  watch: {
    data: function () {
      this.downSort = true
      this.sortKey = ''
      this.sortByKey(this.initSortKey)
    },
    searchWord: function () {
      this.sortByFuzzySearch = true
    }
  }
}
</script>

<style lang="sass">
@import '../stylesheet/vars.scss';

.author-list {
  padding-bottom: 20px;
  background: white;
}

.author-avatar {
  height: 30px;
  width: 30px;
  border-radius: 15px;
  margin-right: 10px;
}

.author-list-table {
  font-size: 15px;
  width: 90%;
  margin: auto;
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
      position: absolute;
      right: 0px;
    }
  }

  th, td {
    padding: 9px;
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
  }

  td {
    height: 22px;
    cursor: pointer;
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
    width: 160px;
  }
}

.author-list-title {
  & > h3 {
    display: inline;
  }
}

.author-search-input {
  float: right;
  height: 25px;
  width: 150px;
  margin-right: 50px;
  border: 0px;
  border-bottom: 1px solid #dcd9d9;
  padding-left: 22px;

  &:focus {
    outline: none;
  }
}

.search {
  position: absolute;
  right: 0px;

  .search-icon {
    position: absolute;
    top: 5px;
    color: #dcd9d9;
  }

  &.active {
    .search-icon {
      color: gray;
    }
  }
}
</style>