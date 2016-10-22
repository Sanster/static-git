import NodeGit from 'nodegit';
import moment from 'moment';

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
    this.authorDatas = {};
  }

  getAuthorData(author) {
    if (!this.authorDatas.hasOwnProperty(author)){
      return this.authorDatas[author.name()] = {
        name: author.name(),
        email: author.email(),
        commits_count: 0,
        total_additions: 0,
        total_deletions: 0,
        first_commit_time: new Date(2030,1,1),
        last_commit_time: new Date(2005,1,1),
      };
    } else {
      return this.authorDatas[author];
    }
  }

  collectData (showData) {
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
            history.emit('end');
            history.end();
            return;
          }

          let commitDate = commit.date();
          let author = commit.author();
          let authorData = this.getAuthorData(author);

          if (authorData.first_commit_time > commitDate) {
            authorData.first_commit_time = commitDate;
          }

          if (authorData.last_commit_time < commitDate) {
            authorData.last_commit_time = commitDate;
          }

          commit.getDiff()
            .then( (arrayDiff) => {
              arrayDiff.forEach( (diff) => {
                diff.patches()
                  .then( (arrayPatch) => {
                    arrayPatch.forEach( (patch) => {
                      let stats = patch.lineStats();
                      authorData.commits_count += 1;
                      authorData.total_additions += stats.total_additions;
                      authorData.total_deletions += stats.total_deletions;
                    })
                  })
              })
            })
        });

        history.on('end', () => {
          console.log("History walk end!")
          moment.locale("zh-cn");

          for (var key in this.authorDatas) {
            let data = this.authorDatas[key];
            data.first_commit_time = moment(data.first_commit_time).format('L');
            data.last_commit_time = moment(data.first_commit_time).format('L');
          }
          showData();
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
