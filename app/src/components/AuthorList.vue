<template>
  <div class="author-list card">
    <table class="author-list-table">
      <thead>
        <tr>
          <th v-for="field in fields"
              @click.prevent="sortByKey(field.key)"
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
        <tr v-for="data in pageData()">
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
                v-show="totalPage > 1"
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
      initSortKey: 'commits',
      sortKey: '',
      emptyRow: 0,
      downSort: true,
      sortedData: {}
    }
  },
  beforeMount () {
    this.sortByKey(this.initSortKey)
  },
  computed: {
    totalPage () {
      return Math.ceil(this.data.length / this.perPage)
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
    pageData () {
      const sliceData = this.sortedData.slice(this.currentPage * this.perPage,
                                        (this.currentPage + 1) * this.perPage)

      this.emptyRow = this.perPage - sliceData.length
      return sliceData
    },
    compareKey (key) {
      const downSort = this.downSort

      return function (authorData1, authorData2) {
        let compareVal1 = authorData1[key]
        let compareVal2 = authorData2[key]

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

      this.sortedData = this.data.slice().sort(this.compareKey(key))
    }
  }
}
</script>

<style lang="sass">
@import '../stylesheet/vars.scss';

.author-list {
  padding-top: 30px;
  padding-bottom: 20px;
  margin-top: 20px;
  background: white;
}

.author-list-table {
  font-size: 15px;
  width: 90%;
  margin: auto;
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
    cursor: pointer;

    a {
      color: #131212;
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
    padding: 9px;
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
  }

  td {
    height: 22px;
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