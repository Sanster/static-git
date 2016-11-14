import NodeGit from 'nodegit'
import moment from 'moment'
import AuthorData from './AuthorData.js'
import RepoData from './RepoData.js'
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
    this._maxCommitsWalkCount = 36446
    this.storageKey = 'allc'
    this.repoData = new RepoData()
  }

  _getAuthorData (author) {
    const authorName = author.name()

    if (!this.authorsData.hasOwnProperty(authorName)) {
      this.authorsData[authorName] = new AuthorData()
      this.authorsData[authorName].setAuthor(author)
    }
    return this.authorsData[authorName]
  }

  isGitRepo (path) {
    return NodeGit.Repository.open(path)
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
          this.repoData.saveCommitDate(commitDate)

          let asyncCounted = false
          commit.getDiff()
            .then((arrayDiff) => {
              let size = arrayDiff.length
              arrayDiff.forEach((diff, index) => {
                diff.patches()
                  .then((arrayPatch) => {
                    arrayPatch.forEach((patch) => {
                      const stats = patch.lineStats()
                      let add = stats.total_additions
                      let del = stats.total_deletions
                      this.repoData.saveCodeLine(commitDate, add, del)
                      this.repoData.additions.increaseByDate(commitDate, add)
                      this.repoData.deletions.increaseByDate(commitDate, del)
                      authorData.additions.increaseByDate(commitDate, add)
                      authorData.deletions.increaseByDate(commitDate, del)
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

  _saveStorageData () {
    const storageData = {
      "authorsData": this.authorsData,
      "repoData": this.repoData
    }
    storage.set(this.storageKey, storageData, function(error) {
      if (error) throw error
    });
  }

  _restoreStorageData (showData) {
    storage.get(this.storageKey, (error, data) => {
      if (error) throw error
      console.log("Read data from cache.")

      this.authorsData = _.map(data.authorsData, (storageData) => {
        return new AuthorData(storageData)
      })
      this.repoData = new RepoData(data.repoData)

      showData()
      console.log("Finish read data from cache.")
    })
  }

  collectData (showData) {
    storage.has(this.storageKey, (error, hasKey) => {
      if (error) throw error
      if (hasKey) {
        this._restoreStorageData(showData)
      } else {
        console.log('Start walk through repo.')
        this._walkThroughRepo(showData)
      }
    })
  }

// remove 0 commits author during date
  authorsDataDuringDate (startDate, endDate) {
    const res = {}

    _.forEach(this.authorsData, (item, name) => {
      if (item.commitsCount.totalDuringDate(startDate, endDate) !== 0) {
        res[name] = item
      }
    })

    return res
  }
}
