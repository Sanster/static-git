<template>
  <table class="vtable">
    <thead>
      <tr>
        <th v-for="(field, key) in fields"
            @click="sortByKey(key)">
          <a href="#">{{field}}</a>
          <div class="sort-icon" v-show="key == sortKey">
            <!--<icon name="caret-down" class="sort-icon-down" :class="{ 'active' : downSort }"></icon>-->
            <!--<icon name="caret-up" class="sort-icon-up" :class="{ 'active' : !downSort }"></icon>-->
            <i class="fa fa-fw fa-question"></i>
          </div>
        </th>
      </tr>
    </thead>
    <tbody v-cloak>
      <tr v-for="data in pageData">
        <td v-for="(field, key) in fields">
          <template v-if="Array.isArray(data[key])">
            {{data[key].length}}
          </template>
          <template v-else>
            {{data[key]}}
          </template>
        </td>
      <tr>
      <tr v-for="n in emptyRow"
          class="empty-row">
        <td v-for="j in Object.keys(fields).length"></td>
      </tr>
    </tbody>
    <tfoot class="vtable-pagination">
      <tr>
          <ul>
            <li v-for="(n, index) in totalPage"
                @click="loadPage(index)"
                :class="{ 'active': isActive(index) }">
                <a href="#">{{n}}</a>
            </li>
          </ul>
      </tr>
    </tfoot>
  </table>

</template>

<script>
export default {
  props: [
    'tableData',
    'fields',
    'perPage'
  ],
  data () {
    return {
      currentPage: 0,
      sortedDataCache: {},
      initSortKey: 'Default',
      sortKey: 'Default',
      emptyRow: 0,
      downSort: true
    }
  },
  computed: {
    totalPage () {
      return Math.ceil(this.tableData.length / this.perPage)
    },
    pageData () {
      const cacheKey = this.cacheKey()

      if (!this.sortedDataCache.hasOwnProperty(cacheKey)) {
        this.sortedDataCache[cacheKey] = this.tableData
      }
      const data = this.sortedDataCache[cacheKey].slice(this.currentPage * this.perPage,
                                                        (this.currentPage + 1) * this.perPage)
      this.emptyRow = this.perPage - data.length
      return data
    }

  },
  methods: {
    loadPage (page) {
      if (page !== this.currentPage) {
        this.currentPage = page
      }
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
        // Save the copy of tableData
        this.sortedDataCache[cacheKey] = this.tableData.slice().sort(this.compareKey(key))
      }
    },
    cacheKey () {
      if (this.downSort) {
        return this.sortKey + '-down-sort'
      } else {
        return this.sortKey + '-up-sort'
      }
    },
    isActive (page) {
      return this.currentPage === page
    }
  }
}
</script>

<style lang="sass">
.vtable {
  font-size: 14px;
  // width: 100%;

  border-collapse: collapse;

  tbody {
    border-right: 1px solid #ddd;

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

    > a {
      text-decoration: none;
      color: #fff;
    }

    .sort-icon {
      display: inline-block;

      & > svg {
        position: relative;
        top: 3px;
      }

      .sort-icon-up {
        position: relative;
        right: 3px;
      }

      .active {
        color: #000;
      }
    }
  }

  th, td {
    // border: 1px solid black;
    border-bottom: 1px solid #ddd;
    // padding-left: 7px;
    // padding-right: 7px;
    padding: 6px;
    text-align: center;
  }

  td {
    height: 16px;
  }

  // .empty-row td {
  //   border-bottom: 0px;
  // }
}

.vtable-pagination {
  ul {
    display: inline-block;
    list-style-type: none;
    padding-left: 0px;
    margin: 0px;
    margin-top: 10px;
    margin-bottom: 10px;
    height: 20px;

    li {
      float:left;
      padding: 5px;
      cursor: pointer;
      width: 20px;
      text-align: center;

      &:hover {
        background: #e7e7e7;
      }

      &.active {
        background: #f5f5f5;
      }
    }
  }

  & > td {
    width: 100%;
  }

  a {
    text-decoration: none;
  }
}
</style>