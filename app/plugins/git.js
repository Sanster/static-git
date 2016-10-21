import NodeGit from 'nodegit'

export default class Git {
  static install (Vue) {
    Vue.mixin({
      beforeCreate () {
        if (this.$options.git) {
          console.log("installed")
          Vue.prototype.$git = this.$options.git;
          this.$git.init(this);
        }
      }
    });
  }

  constructor () {
  }

  init (app) {
    this.app = app;
    this.commits = {};
  }

  test () {
    console.log("hello");
    NodeGit.Repository.open('/Users/cwq/gitlab-development-kit/gitlab')
    // NodeGit.Repository.open('/Users/cwq/Github/static-git')
      .then( (repo) => {
        return repo.getMasterCommit();
      })
      .then( (firstCommitOnMaster) => {
        var history = firstCommitOnMaster.history();

        var count = 0;
        history.on("commit", (commit) => {
          if (++count >= 90) {
            history.emit('end', this.commits);
            history.end();
            return;
          }

          let author = commit.author();

          if (!this.commits.hasOwnProperty(author)){
            this.commits[author] = {
              commits_count: 0,
              total_additions: 0,
              total_deletions: 0,
              first_commit_time: new Date(2030,1,1),
              last_commit_time: new Date(2005,1,1),
            };
          }

          let commit_date = commit.date();

          if (this.commits[author].first_commit_time > commit_date) {
            this.commits[author].first_commit_time = commit_date;
          }

          if (this.commits[author].last_commit_time < commit_date) {
            this.commits[author].last_commit_time = commit_date;
          }

          commit.getDiff()
            .then( (arrayDiff) => {
              arrayDiff.forEach( (diff) => {
                diff.patches()
                  .then( (arrayPatch) => {
                    arrayPatch.forEach( (patch) => {
                      let stats = patch.lineStats();
                      this.commits[author].commits_count += 1;
                      this.commits[author].total_additions += stats.total_additions;
                      this.commits[author].total_deletions += stats.total_deletions;
                    })
                  })
              })
            })
        });

        history.on('end', (commits) => {
          console.log(commits)
          console.log("end in git");
        });

        history.on('error', (error) => {
          console.log('history error');
        });

        history.start();
      })
      .catch( (reason) => {
        console.log(reason)
      });
  } 
}
