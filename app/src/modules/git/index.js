import NodeGit from 'nodegit'
import AuthorData from './AuthorData.js'
import RepoData from './RepoData.js'
import storage from 'electron-json-storage'

class Git {
  constructor () {
    this.authorsData = {}
    this._maxCommitsWalkCount = 25639
    this.storageKey = 'vue'
    this.repoData = new RepoData()
    this.branch = 'dev'
  }

  collectData (repoPath, storeCommit) {
    storage.has(this.storageKey, (error, hasKey) => {
      if (error) throw error
      if (hasKey) {
        console.info('从缓存中恢复仓库数据')
        this._restoreStorageData(storeCommit)
      } else {
        console.info('开始遍历仓库')
        this._walkThroughRepo(repoPath, storeCommit)
      }
    })
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
    const repo = await NodeGit.Repository.open(repoPath)
    const headCommit = await repo.getBranchCommit(this.branch)
    var history = headCommit.history()

    history.on('end', async (commits) => {
      for (let i = 0; i < commits.length; i++) {
        const commit = commits[i]

        if (commit.parentcount() !== 1) {
          continue
        }

        const commitDate = commit.date()
        const author = commit.author()
        const authorData = this._getAuthorData(author)

        authorData.saveCommitDate(commitDate)
        this.repoData.saveCommitDate(commitDate)

        const arrayDiff = await commit.getDiff()

        for (let j = 0; j < arrayDiff.length; j++) {
          const arrayPatch = await arrayDiff[j].patches()
          arrayPatch.forEach((patch) => {
            const stats = patch.lineStats()
            const add = stats.total_additions
            const del = stats.total_deletions
            this.repoData.saveCodeLine(commitDate, add, del)
            this.repoData.additions.increaseByDate(commitDate, add)
            this.repoData.deletions.increaseByDate(commitDate, del)
            authorData.additions.increaseByDate(commitDate, add)
            authorData.deletions.increaseByDate(commitDate, del)
          })
        }
      }
      storeCommit('dataCollectFinish')
      this._saveStorageData()
    })

    history.on('error', (error) => {
      console.error(`History error: ${error}`)
    })

    history.start()
  }

  _saveStorageData () {
    const storageData = {
      'authorsData': this.authorsData,
      'repoData': this.repoData
    }
    storage.set(this.storageKey, storageData, error => {
      if (error) throw error
    })
  }

  _restoreStorageData (storeCommit) {
    storage.get(this.storageKey, (error, data) => {
      if (error) throw error

      this.authorsData = _.map(data.authorsData, (storageData) => {
        return new AuthorData(storageData)
      })
      this.repoData = new RepoData(data.repoData)

      storeCommit('dataCollectFinish')
      console.log('仓库数据恢复完毕')
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
