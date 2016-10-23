import NodeGit from 'nodegit'
import moment from 'moment'

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
    moment.locale('zh-cn')
  }

  _getAuthorData (author) {
    const authorName = author.name()

    if (!this._authorDatas.hasOwnProperty(authorName)) {
      this._authorDatas[authorName] = {
        name: authorName,
        email: author.email(),
        commits_count: 0,
        total_additions: 0,
        total_deletions: 0,
        first_commit_time: new Date(2030, 1, 1),
        last_commit_time: new Date(2005, 1, 1),
        dates: [],
        activeDays: []
      }
    }
    return this._authorDatas[authorName]
  }

  _getUniqueDateByDay (dates) {
    var keys = {}
    var result = []
    for (var i = 0, l = dates.length; i < l; ++i) {
      const date = moment(dates[i]).format('L')
      if (keys.hasOwnProperty(date)) {
        continue
      }
      result.push(date)
      keys[date] = 1
    }
    return result
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

          if (authorData.first_commit_time > commitDate) {
            authorData.first_commit_time = commitDate
          }

          if (authorData.last_commit_time < commitDate) {
            authorData.last_commit_time = commitDate
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
            data.activeDays = this._getUniqueDateByDay(data.dates)
            this.authorDatas.push(data)
          }

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
