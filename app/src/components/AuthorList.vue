<template>
<div>
  <table id="author-list">
    <thead>
      <tr>
        <th v-for="field in fields"
            @click="sortByKey(field.key)"
            :class="field.key + '__col'">
          <div class="field__header"
               :class="headClass">
            <a href="#">{{field.label}}</a>
            <i class="fa fa-caret-down sort-icon"
               v-show="field.key == sortKey"></i>
          </div>
        </th>
      </tr>
    </thead>
    <tbody v-cloak>
      <tr v-for="data in pageData">
        <td v-for="field in fields">
          <div :class="field.key + '__col'">
            {{data[field.key]}}
          </div>
        </td>
      <tr>
      <tr v-for="n in emptyRow"
          class="empty-row">
        <td v-for="j in fields.length"></td>
      </tr>
    </tbody>
  </table>
  <pagination :total="totalPage"
              v-on:currentChange="pageChange"></pagination>
</div>

</template>

<script>
import Pagination from './Pagination.vue'

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
      sortedDataCache: {},
      initSortKey: 'commits_count',
      sortKey: '',
      emptyRow: 0,
      downSort: true
    }
  },
  beforeMount () {
    this.sortByKey(this.initSortKey)
  },
  computed: {
    totalPage () {
      return Math.ceil(this.data.length / this.perPage)
    },
    pageData () {
      const cacheKey = this.cacheKey()

      if (!this.sortedDataCache.hasOwnProperty(cacheKey)) {
        this.sortedDataCache[cacheKey] = this.data
      }

      const sliceData = this.sortedDataCache[cacheKey].slice(this.currentPage * this.perPage,
                                                        (this.currentPage + 1) * this.perPage)
      this.emptyRow = this.perPage - sliceData.length
      return sliceData
    },
    headClass () {
      return this.downSort ? 'down' : 'up'
    },
    fields () {
      return this.options.fields
    },
    data () {
      return this.options.data
    },
    perPage () {
      return this.options.perPage
    }
  },
  methods: {
    pageChange (page) {
      this.currentPage = page
    },
    compareKey (key) {
      const downSort = this.downSort

      return function (authorData1, authorData2) {
        let compareVal1 = authorData1[key]
        let compareVal2 = authorData2[key]

        if (Array.isArray(authorData1[key])) {
          compareVal1 = authorData1[key].length
          compareVal2 = authorData2[key].length
        }

        if (compareVal1 > compareVal2) {
          return downSort ? -1 : 1
        } else if (compareVal1 < compareVal2) {
          return downSort ? 1 : -1
        }

        return 0
      }
    },
    sortByKey (key) {
      if (this.sortKey === key) {
        this.downSort = !this.downSort
      } else {
        this.downSort = true
        this.sortKey = key
      }

      const cacheKey = this.cacheKey()

      if (!this.sortedDataCache.hasOwnProperty(cacheKey)) {
        // Save the copy of authorsData
        this.sortedDataCache[cacheKey] = this.data.slice().sort(this.compareKey(key))
      }
    },
    cacheKey () {
      if (this.downSort) {
        return this.sortKey + '-down-sort'
      } else {
        return this.sortKey + '-up-sort'
      }
    }
  }
}
</script>

<style lang="sass">
#author-list {
  font-size: 15px;
  width: 90%;
  margin: auto;
  margin-top: 30px;
  table-layout: fixed;
  position: relative;
  z-index: 1;

  border-collapse: collapse;

  tbody {
    tr:hover {
      background-color: #f5f5f5;
    }
  }

  th {
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
    border-right: 1px solid #ddd;
    -webkit-user-select: none;

    a {
      color: #fff;
    }

    .field__header {
      position: relative;
    }

    .sort-icon {
      position: absolute;
      right: 0px;
    }
  }

  th, td {
    padding: 6px;
    text-align: center;
  }

  td {
    height: 16px;
    cursor: pointer;
  }

  .name__col {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 170px;
  }
}
</style>