<template>
  <div class="sidebar">
    <div id="head">
      <!--<i class="fa fa-folder"></i>
      Gitlab-->
      <VSelect></VSelect>
    </div>
    <ul>
      <li class="stats-item" :class="{ 'active': isActive(0) }" @click="itemClick(0)">
        <a class="stats-item-name"><i class="fa fa-fw fa-users"></i><span>Contributions</span> </a>
      </li>
      <li class="stats-item" :class="{ 'active': isActive(1) }" @click="itemClick(1)">
        <a class="stats-item-name"><i class="fa fa-fw fa-circle-o"></i><span>Month Commits</span></a>
      </li>
      <li class="stats-item" :class="{ 'active': isActive(2) }" @click="itemClick(2)">
        <a class="stats-item-name"><i class="fa fa-fw fa-align-justify"></i><span>Code Lines</span></a>
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
      activeIndex: 0
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