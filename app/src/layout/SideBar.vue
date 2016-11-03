<template>
  <div class="sidebar">
    <div id="head">
      Repositories
    </div>
    <ul>
      <li v-for="(repo, index) in repos"
          class="list-group-item"
          :class="{ 'active': isActive(index) }"
          @click="itemClick(index)">
          <a> {{repo.name}} </a>
      </li>
      <li id="add-repo">
        <i class="fa fa-plus"></i>
        Add repository
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: 0,
      repos: [
        {
          name: 'gitlab'
        },
        {
          name: 'static-git'
        },
        {
          name: 'starbucks'
        }
      ]
    }
  },
  methods: {
    isActive (index) {
      return index === this.activeIndex
    },
    itemClick (index) {
      this.activeIndex = index
    }
  }
}
</script>

<style lang="sass">
@import '../stylesheet/vars.scss';

.sidebar {
  position: fixed;
  width: $sidebar-width;
  top: 0;
  left: 0;
  bottom: 0;
  border-right: 1px solid #e7e7e7;
  background: $light-black;

  #head {
    color: $white;
    cursor: default;
    font-size: 25px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: rgba(25, 32, 45, 0.67);
  }

  a {
    padding-left: 25px;
    color: $white;
  }

  #add-repo {
    color: $white;
    cursor: pointer;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }

  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;

    .list-group-item {
      &:hover {
        background: $hover-white;
        cursor: pointer;
      }

      height: 40px;
      line-height: 40px;

      &.active {
        border-left: 4px solid $white;
        background: $highlight-white;
      }

      border-bottom: 1px solid $highlight-white;
    }
  }
}
</style>