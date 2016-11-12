<template>
<div class="pagination" :style="{ width: page * 30 + 'px' }">
  <button class="btn-prev"
          :class="{disabled: this.currentPage === 0}"
          @click="prev">
    <i class="fa fa-chevron-left"></i>
  </button>
  <ul>
    <!--<li>
      <span class="gap">...</span>
    </li>-->
    <li v-for="(n, index) in page"
        @click="loadPage(index)"
        :class="{ 'active': isActive(index) }">
        <a href="#">{{n + pageOffSet}}</a>
    </li>
    <!--<li>
      <span class="gap">...</span>
    </li>-->
  </ul>
  <button class="btn-next"
          :class="{disabled: this.currentPage === this.total - 1}"
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
      maxPage: 5,
      pageOffSet: 0
    }
  },
  computed: {
    page () {
       return this.total > this.maxPage ? this.maxPage : this.total
    }
  },
  methods: {
    loadPage (page) {
      if (page === this.currentPage) {
        return
      }
      this.currentPage = page + this.pageOffSet
      this.$emit('currentChange', this.currentPage)
    },
    isActive (page) {
      return this.currentPage ===  page + this.pageOffSet
    },
    prev () {
      if (this.currentPage > 0) {
        this.currentPage -= 1
        this.checkOverLeft()
        this.$emit('currentChange', this.currentPage)
      }
    },
    next () {
      if (this.currentPage < this.total - 1) {
        this.currentPage += 1
        this.checkOverRight()
        this.$emit('currentChange', this.currentPage)
      }
    },
    checkOverRight () {
      if (this.currentPage >= this.page) {
        this.pageOffSet += 1
      }
    },
    checkOverLeft () {
      if (this.currentPage < this.pageOffSet && this.pageOffSet > 0) {
        this.pageOffSet -= 1
      }
    }
  }
}
</script>

<style lang="sass">
@import '../stylesheet/vars.scss';

$pagination-height: 36px;
$page-li-padding: 3px;
$page-li-height: 20px;
$border-width: 1px;
$page-ul-top: ($pagination-height - $page-li-height - $page-li-padding * 2 - $border-width * 2) / 2;

.pagination {
  margin: auto;
  position: relative;
  padding-left: 25px;
  padding-right: 25px;
  margin-top: 10px;
  height: $pagination-height;

  ul {
    display: inline-block;
    list-style-type: none;
    padding-left: 0px;
    margin: 0px;
    position: relative;
    top: $page-ul-top;

    .gap {
      cursor: default;
    }

    li {
      float:left;
      padding: $page-li-padding;
      cursor: pointer;
      width: $page-li-height;
      text-align: center;
      font-size: 17px;

      &.active {
        cursor: default;
        border: solid $border-width $light-black;

        a {
          cursor: default;
        }
      }
    }

    li a {
      color: black;
    }
  }

  & > td {
    width: 100%;
  }

  a {
    text-decoration: none;
  }

  .btn-next, .btn-prev {
    position: absolute;
    height: 100%;
    top: 0;
    border: 0px;
    background: transparent;
    font-size: 15px;
    color: #64676f;
    cursor: pointer;

    &:focus {
      outline: 0px;
    }

    &:hover {
      color: black;
    }

    &.disabled {
      cursor: not-allowed;
      color: $gray;
    }
  }

  .btn-next {
    right: 0;
  }

  .btn-prev {
    left: 0;
  }
}
</style>