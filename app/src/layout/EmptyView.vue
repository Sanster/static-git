<template>
    <div class="empty-view">
        <button
            id="project-add-btn"
            @click="selectProject">
            Add Project
        </button>
    </div>
</template>

<script>
import electron from 'electron'
const ipc = electron.ipcRenderer
import git from 'modules/git'

export default {
  data () {
    return {
    }
  },
  mounted () {
    ipc.on('selected-directory', this.addRepo)
  },
  methods: {
    selectProject () {
      // ipc.send('open-file-dialog')
      this.addRepo()
    },
    async addRepo (event, path) {
      // const repoPath = path[0]
      const repoPath = '/Users/cwq/Github/vue'
      try {
        await git.isGitRepo(repoPath)
        this.$store.commit('setSelectedRepo', repoPath)
        this.$store.commit('dataCollectStart')
        this.$store.dispatch('startDataCollect')
      } catch (error) {
        console.error(error)
        ipc.send('open-info-dialog', `This is not a Git Repository. ${error}`)
      }
    }
  }
}
</script>

<style lang="sass">
@import '../stylesheet/vars.scss';

.empty-view {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: $titleBar-height;
}

#project-add-btn {
    width: 160px;
    height: 30px;
    background-color: white;
    border: 1px solid #999;
    border-radius: 3px;
    font-size: 15px;
    cursor: pointer;

    &:focus {
        outline: none;
    }
}
</style>