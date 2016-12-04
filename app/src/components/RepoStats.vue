<template>
  <div class="repo-stats card">
    <div class="card-header">
      <div class="Repo name">
        Gitlab
      </div>
    </div>
    <div class='Total line of code'>
      <div class="Repo name">
        Total Lines: {{totalLines}}
      </div>
      <div class="Repo name">
        Total Commts: {{totalCommits}}
      </div>
      <div class="Repo name">
        Total Contributors: {{totalContributors}}
      </div>
    </div
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: [
    'options'
  ],
  computed: {
    ...mapState([
      'git'
    ]),
    totalLines () {
      return this.git.repoData.codeLines.total
    },
    totalCommits () {
      return this.git.repoData.commitsCount.total
    },
    totalContributors () {
      return this.git.authorsData.length
    }
  },
  methods: {

  }
}

</script>

<style lang="sass">
</style>