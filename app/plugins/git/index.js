import NodeGit from 'nodegit'
import moment from 'moment'
import AuthorData from './AuthorData.js'

export default class Git {
  static install (Vue) {
    Vue.mixin({
      beforeCreate () {
        if (this.$options.git) {
          Vue.prototype.$git = this.$options.git
          this.$git.init(this)
        }
      }
    })
  }

  init (app) {
    this.app = app
    this._authorDatas = {}
    this.authorDatas = []
    this._monthDatas = {}
    this.firstCommitDate = new Date(2005, 1, 1)
    this.lastCommitDate = new Date(2030, 1, 1)
    moment.locale('zh-cn')
  }

  _getAuthorData (author) {
    const authorName = author.name()

    if (!this._authorDatas.hasOwnProperty(authorName)) {
      this._authorDatas[authorName] = new AuthorData(author)
    }
    return this._authorDatas[authorName]
  }

  collectData (showData) {
    NodeGit.Repository.open('/Users/cwq/gitlab-development-kit/gitlab')
    // NodeGit.Repository.open('/Users/cwq/Github/static-git')
      .then((repo) => {
        return repo.getMasterCommit()
      })
      .then((firstCommitOnMaster) => {
        var history = firstCommitOnMaster.history()

        var count = 0
        history.on('commit', (commit) => {
          // exclude merge commit
          if (commit.parentcount() !== 1) {
            return
          }

          if (++count >= 90) {
            history.emit('end')
            history.end()
            return
          }

          const commitDate = commit.date()
          const author = commit.author()
          const authorData = this._getAuthorData(author)

          authorData.dates.push(commitDate)
          authorData.saveCommitDate(commitDate)

          if (this.firstCommitDate > commitDate) {
            this.firstCommitDate = commitDate
          }

          if (this.lastCommitDate < commitDate) {
            this.lastCommitDate = commitDate
          }

          commit.getDiff()
            .then((arrayDiff) => {
              arrayDiff.forEach((diff) => {
                diff.patches()
                  .then((arrayPatch) => {
                    arrayPatch.forEach((patch) => {
                      const stats = patch.lineStats()
                      authorData.commits_count += 1
                      authorData.total_additions += stats.total_additions
                      authorData.total_deletions += stats.total_deletions
                    })
                  })
              })
            })
        })

        history.on('end', () => {
          console.log('History walk end!')

          for (var key in this._authorDatas) {
            const data = this._authorDatas[key]
            data.first_commit_time = moment(data.first_commit_time).format('L')
            data.last_commit_time = moment(data.first_commit_time).format('L')
            data.activeDays = data.getActiveDays()
            this.authorDatas.push(data)
          }
          console.log(this.authorDatas)
          showData()
        })

        history.on('error', (error) => {
          console.log(`History error: ${error}`)
        })

        history.start()
      })
      .catch((reason) => {
        console.log(reason)
      })
  }
}
