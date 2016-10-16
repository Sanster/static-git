<template>
  <div>
    <ul>
      <li v-for="commit in commits">
        <p>{{commit.sha()}}</p>
        <p>{{commit.author().email()}}</p>
        <p>{{commit.date()}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import Git from 'nodegit'

export default {
  data () {
    return {
      message: 'Hello Vue 2.0!',
      commits: []
    }
  },
  created () {
    Git.Repository.open("/Users/cwq/Github/blog")
      // Open the master branch.
      .then( (repo) => {
        console.log("test")
        return repo.getMasterCommit();
      })
      .then( (firstCommitOnMaster) => {
        // Create a new history event emitter.
        var history = firstCommitOnMaster.history();

        // Create a counter to only show up to 9 entries.
        var count = 0;

        // Listen for commit events from the history.
        history.on("commit", (commit) => {
          // Disregard commits past 9.
          if (++count >= 9) {
            return;
          }
          this.commits.push(commit);
        });

        // Start emitting events.
        history.start();
      });
  }
}
</script>

<style>
</style>