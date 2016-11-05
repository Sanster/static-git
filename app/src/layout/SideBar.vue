<template>
  <div class="sidebar">
    <div id="head">
      <!--<i class="fa fa-folder"></i>
      Gitlab-->
      <VSelect></VSelect>
    </div>
    <ul>
      <li v-for="(statsItem, index) in statsItems"
          class="stats-item"
          :class="{ 'active': isActive(index) }"
          @click="itemClick(index)">
          <a class="stats-item-name"> {{statsItem.name}} </a>
      </li>
      <li id="add-repo"
          @click="addRepoClicked">
        <i class="fa fa-plus"></i>
        Add repository
      </li>
    </ul>
  </div>
</template>

<script>
import VSelect from 'components/VSelect.vue'
import electron from 'electron'
const ipc = electron.ipcRenderer

export default {
  data () {
    return {
      activeIndex: 0,
      statsItems: [
        {
          name: 'Author List'
        },
        {
          name: 'Month Commits'
        },
        {
          name: 'Code Lines'
        }
      ]
    }
  },
  components: {
    VSelect
  },
  mounted () {
    ipc.on('selected-directory', this.addRepo)
  },
  methods: {
    isActive (index) {
      return index === this.activeIndex
    },
    itemClick (index) {
      this.activeIndex = index
      this.$emit('sideBarClick', index)
    },
    addRepo (event, path) {
      const name = _(path[0].split('/')).last()
      this.$git.isGitRepo(path[0])
        .then((repo) => {
          this.repos.push({
            name: name
          })
        })
        .catch((error) => {
          ipc.send('open-info-dialog', "This is not a Git Repository.")
        })
    },
    addRepoClicked () {
      ipc.send('open-file-dialog')
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

  #repo-selector {

  }

  .stats-item-name {
    padding-left: 25px;
    color: $gray;
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

    .stats-item {
      &:hover {
        background: $hover-white;
        cursor: pointer;
      }

      height: 40px;
      line-height: 40px;

      &.active {
        border-left: 4px solid $white;
        background: $highlight-white;

        a {
          color: $white;
        }
      }

      border-bottom: 1px solid $highlight-white;
    }
  }
}
</style>