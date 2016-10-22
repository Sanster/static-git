<template>
  <table class="vtable">
    <thead>
      <tr>
        <th v-for="(field, key) in fields"
            @click="sortByField(key)">
          {{field}}
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
      <template v-if="pageData.length < perPage">
        <tr v-for="n in (perPage - pageData.length)">
          <td v-for="j in fields.length"></td>
        </tr>
      </template> 
    </tbody>
    <tfoot class="vtable-pagination">
      <tr>
          <ul>
            <li v-for="(n, index) in totalPage" @click="loadPage(index)"><a href="#">{{n}}</a></li>
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
      initSortField: 'Default',
      sortField: 'Default',
    }
  },
  computed: {
    totalPage () {
      return Math.ceil(this.tableData.length / this.perPage);
    },
    pageData () {
      if (!this.sortedDataCache.hasOwnProperty(this.initSortField)) {
        this.sortedDataCache[this.initSortField] = this.tableData;
      }
      
      return this.sortedDataCache[this.sortField].slice( this.currentPage * this.perPage, 
                                                        (this.currentPage + 1) * this.perPage);
    },
  },
  methods: {
    loadPage (page) {
      if ( page !== this.currentPage ){
        this.currentPage = page;
      }
    },
    compareField (field) {
      return function (authorData1, authorData2) {
        let compareVal1 = authorData1[field];
        let compareVal2 = authorData2[field];

        if (Array.isArray(authorData1[field])){
          compareVal1 = authorData1[field].length;
          compareVal2 = authorData2[field].length;
        } 

        if (compareVal1 > compareVal2)
          return -1;
        else (compareVal1 < compareVal2)
          return 1;

        return 0;
      }
    },
    sortByField (field) {
      if (!this.sortedDataCache.hasOwnProperty(field)) {
        // Save the copy of tableData
        this.sortedDataCache[field] = this.tableData.slice().sort(this.compareField(field))
      }
      console.log(this.sortedDataCache)
      this.sortField = field;
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
      background-color: #f5f5f5
    }
  }
  
  th {
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
    border-right: 1px solid #ddd;
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