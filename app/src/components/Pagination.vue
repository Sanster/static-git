<template>
<div class="pagination" :style="{ width: page * 30 + 'px' }">
  <button class="btn-prev"
          :class="{disabled: this.currentPage === 0}"
          @click="prev">
    <i class="fa fa-chevron-left"></i>
  </button>
  <ul>
    <li v-for="(n, index) in page"
        @click="loadPage(index)"
        :class="{ 'active': isActive(index) }">
        <a href="#">{{n}}</a>
    </li>
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
      maxPage: 6
    }
  },
  computed: {
    page () {
      return this.total > this.maxPage ? this.maxPage : this.total
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
      if (this.currentPage > 0) {
        this.currentPage -= 1
        this.$emit('currentChange', this.currentPage)
      }
    },
    next () {
      if (this.currentPage < this.total - 1) {
        this.currentPage += 1
        this.$emit('currentChange', this.currentPage)
      }
    }
  }
}
</script>

<style lang="sass">
@import '../stylesheet/vars.scss';

.pagination {
  margin: auto;
  position: relative;
  padding-left: 25px;
  padding-right: 25px;
  height: 50px;

  ul {
    display: inline-block;
    list-style-type: none;
    padding-left: 0px;
    margin: 0px;
    margin-top: 10px;
    margin-bottom: 10px;

    li {
      float:left;
      padding: 5px;
      cursor: pointer;
      width: 20px;
      text-align: center;
      font-size: 17px;

      &.active {
        background: $light-black;
        cursor: default;
        border-radius: 2px;

        a {
          color: white;
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
    top: 0;
    margin-top: 10px;
    margin-bottom: 10px;
    height: 30px;
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