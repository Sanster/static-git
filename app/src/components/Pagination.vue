<template>
<div class="pagination" v-show="total > 1">
  <button class="btn-prev"
        :class="{disabled: this.isFirstPage()}"
        @click="prev">
    <i class="fa fa-chevron-left"></i>
  </button>
  <input type="text"
         class="page-input"
         v-model="inputPage">
  <span class="slash">/</span>
  <span class="total-page"
        @click="toLastPage"
        v-on:dblclick="toFirstPage">{{this.total}}</span>
  <button class="btn-next"
        :class="{disabled: this.isLastPage()}"
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
      inputPage: 1
    }
  },
  watch: {
    inputPage: function (newInputPage) {
      if (newInputPage > this.total) {
        newInputPage = this.total
      } else if (newInputPage <= 0) {
        newInputPage = 1
      }
      this.currentPage = newInputPage - 1
      this.$emit('currentChange', this.currentPage)
    }
  },
  methods: {
    isFirstPage () {
      return this.currentPage === 0
    },
    isLastPage () {
      return this.currentPage === this.total - 1
    },
    prev () {
      if (!this.isFirstPage()) {
        this.currentPage -= 1
        this.inputPage = this.currentPage + 1
        this.$emit('currentChange', this.currentPage)
      }
    },
    next () {
      if (this.currentPage < this.total - 1) {
        this.currentPage += 1
        this.inputPage = this.currentPage + 1
        this.$emit('currentChange', this.currentPage)
      }
    },
    toLastPage () {
      this.inputPage = this.total
    },
    toFirstPage () {
      this.inputPage = 1
    }
  }
}
</script>

<style lang="sass">
@import '../stylesheet/vars.scss';

$pagination-height: 20px;

.pagination {
  display: flex;
  justify-content: center;

  .page-input {
    width: 20px;
    height: $pagination-height;
    padding: 0;
    text-align: center;
    border: none;
    font-size: 18px;
    font-family: inherit;

    &:focus {
      outline: 0px;
    }
  }

  .slash {
    margin-left: 7px;
    margin-right: 7px;
    font-size: 19px;
  }

  .total-page {
    font-size: 18px;
    cursor: pointer;
    display: inline-block;
    width: 20px;
    text-align: center;
  }

  .btn-next, .btn-prev {
    height: $pagination-height;
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
}
</style>