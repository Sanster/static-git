<template>
<div class="pagination">
  <button class="btn-prev"
          @click="prev">
    <i class="fa fa-chevron-left"></i>
  </button>
  <ul>
    <li v-for="(n, index) in total"
        @click="loadPage(index)"
        :class="{ 'active': isActive(index) }">
        <a href="#">{{n}}</a>
    </li>
  </ul>
  <button class="btn-next"
          @click="next">
    <i class="fa fa-chevron-right"></i>
  </button>
</div>

</template>

<script>
export default {
  props: [
    'total'
  ],
  data () {
    return {
      currentPage: 0,
      maxPage: 6
    }
  },
  methods: {
    loadPage (page) {
      if (page !== this.currentPage) {
        this.currentPage = page
        this.$emit('currentChange', this.currentPage)
      }
    },
    isActive (page) {
      return this.currentPage === page
    },
    prev () {
      this.currentPage -= 1
      this.$emit('currentChange', this.currentPage)
    },
    next () {
      this.currentPage += 1
      this.$emit('currentChange', this.currentPage)
    }
  }
}
</script>

<style lang="sass">
.pagination {
  width: 400px;
  margin: auto;

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