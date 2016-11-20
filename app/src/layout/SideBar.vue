<template>
  <div class="sidebar">
    <div id="head">
      <repo-selector></repo-selector>
    </div>
    <ul class="stats-item-list">
      <li class="stats-item" :class="{ 'active': isActive(0) }" @click="itemClick(0)">
        <a class="stats-item-name"><i class="fa fa-fw fa-users"></i><span>Contributions</span> </a>
      </li>
      <li class="stats-item" :class="{ 'active': isActive(1) }" @click="itemClick(1)">
        <a class="stats-item-name"><i class="fa fa-fw fa-circle-o"></i><span>Month Commits</span></a>
      </li>
      <li class="stats-item" :class="{ 'active': isActive(2) }" @click="itemClick(2)">
        <a class="stats-item-name"><i class="fa fa-fw fa-align-justify"></i><span>Code Lines</span></a>
      </li>
      <li class="stats-item" :class="{ 'active': isActive(3) }" @click="itemClick(3)">
        <a class="stats-item-name"><i class="fa fa-fw fa-align-justify"></i><span>repo-stats</span></a>
      </li>
    </ul>
  </div>
</template>

<script>
import RepoSelector from 'components/RepoSelector.vue'

export default {
  data () {
    return {
      activeIndex: 0
    }
  },
  components: {
    RepoSelector
  },
  methods: {
    isActive (index) {
      return index === this.activeIndex
    },
    itemClick (index) {
      this.activeIndex = index
      this.$emit('sideBarClick', index)
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