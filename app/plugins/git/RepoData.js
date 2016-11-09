import DateData from 'utils/DateData.js'

export default class RepoData {
  constructor () {
    this.firstCommitTime = new Date(2030, 1, 1)
    this.lastCommitTime = new Date(2005, 1, 1)
    this.commitsCount = new DateData()
    this.additions = new DateData()
    this.deletions = new DateData()
    this.codeLines = new DateData()
  }

  toStorage () {
    return {
      'firstCommitTime': this.firstCommitTime,
      'lastCommitTime': this.lastCommitTime,
      'commitsCount': this.commitsCount,
      'additions': this.additions,
      'deletions': this.deletions
    }
  }

  fromStorage (storageData) {
    for (var key in storageData) {
      if (storageData.hasOwnProperty(key)) {
        this[key] = storageData[key]
      }
    }
  }

  saveCommitDate (commitDate) {
    if (this.firstCommitTime > commitDate) {
      this.firstCommitTime = commitDate
    }

    if (this.lastCommitTime < commitDate) {
      this.lastCommitTime = commitDate
    }

    this.commitsCount.increaseByDate(commitDate)
  }
}