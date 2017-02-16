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
      ipc.send('open-file-dialog')
    },
    addRepo (event, path) {
      const repoPath = path[0]
      git.isGitRepo(repoPath)
        .then((repo) => {
          this.$store.commit('addRepository', repoPath)
          this.$store.dispatch('startDataCollect')
        })
        .catch((error) => {
          console.error(error)
          ipc.send('open-info-dialog', `This is not a Git Repository. ${error}`)
        })
    }
  }
}
</script>

<style lang="sass">
@import '../stylesheet/vars.scss';

.empty-view {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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