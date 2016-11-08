import NodeGit from 'nodegit'
import moment from 'moment'
import AuthorData from './AuthorData.js'
import storage from 'electron-json-storage'

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
    this.authorsData = {}
    this.firstCommitDate = new Date(2005, 1, 1)
    this.lastCommitDate = new Date(2030, 1, 1)
    this.lineCount = {}
    this._maxCommitsWalkCount = 2
    this.storageKey = 'test7'
  }

  _getAuthorData (author) {
    const authorName = author.name()

    if (!this.authorsData.hasOwnProperty(authorName)) {
      this.authorsData[authorName] = new AuthorData()
      this.authorsData[authorName].setAuthor(author)
    }
    return this.authorsData[authorName]
  }

  _calLineCount (stats, commitDate) {
    const year = commitDate.getFullYear()
    const month = commitDate.getMonth()
    const day = commitDate.getDate()

    if (!this.lineCount.hasOwnProperty(year)) {
      this.lineCount[year] = this._getInitLineCount()
    }

    const changeLines = stats.total_additions - stats.total_deletions

    this.lineCount[year][month] += changeLines
  }

  _getInitLineCount() {
    const initLinesCount = []

    for (var month = 0; month < 12; ++month) {
      var dayCount = []
      // for (var day = 0; day < 31; ++day) {
      //   dayCount.push(0)
      // }
      initLinesCount.push(0)
    }

    return initLinesCount
  }

  isGitRepo (path) {
    return NodeGit.Repository.open(path)
  }

  _saveStorageData () {
    function toStorageData(authorData) {
      return authorData.toStorage()
    }

    const storageData = {
      "authorsData": _.map(this.authorsData, toStorageData),
      "firstCommitDate": this.firstCommitDate,
      "lastCommitDate": this.lastCommitDate,
      "lineCount": this.lineCount
    }
    storage.set(this.storageKey, storageData, function(error) {
      if (error) throw error
    });
  }

  _walkThroughRepo (showData) {
    NodeGit.Repository.open('/Users/cwq/gitlab-development-kit/gitlab')
      .then((repo) => {
        return repo.getMasterCommit()
      })
      .then((firstCommitOnMaster) => {
        var history = firstCommitOnMaster.history()

        let count = 0
        let asyncCount = 0
        history.on('commit', (commit) => {
          // exclude merge commit
          if (commit.parentcount() !== 1) {
            return
          }

          count += 1
          if (count > this._maxCommitsWalkCount) {
            history.removeAllListeners('commit')
            return
          }

          const commitDate = commit.date()
          const author = commit.author()
          const authorData = this._getAuthorData(author)

          authorData.saveCommitDate(commitDate)

          if (this.firstCommitDate > commitDate) {
            this.firstCommitDate = commitDate
          }

          if (this.lastCommitDate < commitDate) {
            this.lastCommitDate = commitDate
          }

          let asyncCounted = false
          commit.getDiff()
            .then((arrayDiff) => {
              let size = arrayDiff.length
              arrayDiff.forEach((diff, index) => {
                diff.patches()
                  .then((arrayPatch) => {
                    arrayPatch.forEach((patch) => {
                      const stats = patch.lineStats()
                      this._calLineCount(stats, commitDate)
                      authorData.additions.increase(commitDate, stats.total_additions)
                      authorData.deletions.increase(commitDate, stats.total_deletions)
                    })
                  })
                  .then(()=>{
                    if (asyncCounted === false) {
                      asyncCounted = true
                      asyncCount += 1
                    }
                    if (index === size - 1 && asyncCount > _maxCommitsWalkCount) {
                      history.emit('end')
                    }
                  })
              })
            })
        })

        history.on('end', () => {
          console.log('History walk end, write data to json.')

          showData()
          this._saveStorageData()
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

  collectData (showData) {
    storage.has(this.storageKey, (error, hasKey) => {
      if (error) throw error
      if (false) {
        storage.get(this.storageKey, (error, data) => {
          if (error) throw error

          console.log("Read data from cache.")

          function fromStorageData(data) {
            const authorData = new AuthorData()
            authorData.fromStorage(data)
            return authorData
          }

          this.authorsData = _.map(data.authorsData, fromStorageData)
          this.firstCommitDate = data.firstCommitDate
          this.lastCommitDate = data.lastCommitDate
          this.lineCount = data.lineCount

          for (var key in this.authorsData) {
            this.authorsData.push(this.authorsData[key])
          }

          showData()
          console.log("Finish read data from cache.")
        })
      } else {
        console.log('Start walk through repo.')
        this._walkThroughRepo(showData)
      }
    })

  }
}
