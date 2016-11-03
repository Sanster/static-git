<template>
  <div class="sidebar">
    <ul>
      <li v-for="(repo, index) in repos"
          class="list-group-item"
          :class="{ 'active': isActive(index) }"
          @click="itemClick(index)">
          <a> {{repo.name}} </a>
      </li>
    </ul>
    <div id="add-repo">
      Add repo
    </div>
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
  width: 220px;
  top: 0;
  left: 0;
  bottom: 0;
  border-right: 1px solid #e7e7e7;
  background: $dark-blue;

  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;

    .list-group-item {
      &:hover {
        background: $light-blue;
      }

      height: 40px;
      line-height: 40px;

      &.active {
        // border-left: 4px solid #86bc63;
        background: $light-blue;
      }

      a {
        padding-left: 15px;
        color: white;
      }
    }
  }
}
</style>