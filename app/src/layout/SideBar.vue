<template>
  <div class="sidebar">
    <div id="head">
      <repo-selector></repo-selector>
    </div>
    <ul class="stats-item-list">
      <li class="stats-item"
          @click="itemClick(view, index)"
          v-for="(view, index) in views"
          :class="{ 'active': isActive(index) }">
          <a class="stats-item-name">
            <span>{{view.name}}</span>
          </a>
      </li>
    </ul>
  </div>
</template>

<script>
import RepoSelector from 'components/RepoSelector.vue'

export default {
  data () {
    return {
      activeIndex: 0,
      views: [
        { name: 'Author List', componentName: 'author-list' },
        { name: 'Repo Stats', componentName: 'repo-stats' },
        { name: 'Month Commits', componentName: 'author-list' },
        { name: 'Code Lines', componentName: 'code-lines' }
      ]
    }
  },
  components: {
    RepoSelector
  },
  methods: {
    isActive (index) {
      return index === this.activeIndex
    },
    itemClick (view, index) {
      this.activeIndex = index
      this.$store.commit('setCurrentView', view.componentName)
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
  z-index: 9999;

  #add-repo {
    color: $white;
    cursor: pointer;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }

  .stats-item-list {
    padding: 0;
    margin: 0;
    margin-top: 15px;

    .stats-item {
      position: relative;
      cursor: pointer;

      &:hover {
        background: $hover-white;

        a {
          border-left: 4px solid $hover-white;
        }
      }

      height: 40px;
      line-height: 40px;

      a {
        padding-left: 35px;
        border-left: 4px solid $light-black;
      }

      &.active {
        a {
          border-left: 4px solid $white;
          color: $white;
        }
      }
    }

    .stats-item-name {
      color: $gray;

      .fa {
        margin-right: 10px;
      }
    }
  }
}
</style>