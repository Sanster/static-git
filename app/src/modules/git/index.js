import NodeGit from 'nodegit'
import moment from 'moment'
import AuthorData from './AuthorData.js'
import RepoData from './RepoData.js'
import storage from 'electron-json-storage'

class Git {
  constructor () {
    this.authorsData = {}
    this._maxCommitsWalkCount = 25639
    // cached 'allc'
    this.storageKey = 'allc'
    this.repoData = new RepoData()
  }

  collectData (repoPath, storeCommit) {
    // storage.has(this.storageKey, (error, hasKey) => {
      // if (error) throw error
      // if (hasKey) {
        // this._restoreStorageData()
      // } else {
        console.log('Start walk through repo.')
        this._walkThroughRepo(repoPath, storeCommit)
      // }
    // })
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

  async _walkThroughRepo (repoPath, storeCommit) {
    let repo = await NodeGit.Repository.open(repoPath)
    let firstCommitOnMaster = await repo.getMasterCommit()
    var history = firstCommitOnMaster.history()

    history.on('end', async (commits) => {
      for(let i=0; i<commits.length; i++) {
        let commit = commits[i]

        if (commit.parentcount() !== 1) {
          continue
        }

        const commitDate = commit.date()
        const author = commit.author()
        const authorData = this._getAuthorData(author)

        authorData.saveCommitDate(commitDate)
        this.repoData.saveCommitDate(commitDate)

        let arrayDiff = await commit.getDiff()
        let size = arrayDiff.length
        for(let j=0; j<arrayDiff.length; j++) {
          let arrayPatch = await arrayDiff[j].patches()
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
        }
      }
      storeCommit('dataCollectFinish')
    })

    history.on('error', (error) => {
      console.log(`History error: ${error}`)
    })

    history.start()
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

  _restoreStorageData () {
    storage.get(this.storageKey, (error, data) => {
      if (error) throw error
      console.log("Read data from cache.")

      this.authorsData = _.map(data.authorsData, (storageData) => {
        return new AuthorData(storageData)
      })
      this.repoData = new RepoData(data.repoData)

      console.log("Finish read data from cache.")
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

export default new Git()