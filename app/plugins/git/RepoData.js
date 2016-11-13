import DateData from 'utils/DateData.js'

export default class RepoData {
  constructor (data) {
    if (data) {
      this.firstCommitTime = data.firstCommitTime
      this.lastCommitTime = data.lastCommitTime
      this.commitsCount = new DateData(data.commitsCount)
      this.additions = new DateData(data.additions)
      this.deletions = new DateData(data.deletions)
      this.codeLines = new DateData(data.codeLines)
    }
    else {
      this.firstCommitTime = new Date(2030, 1, 1)
      this.lastCommitTime = new Date(2005, 1, 1)
      this.commitsCount = new DateData()
      this.additions = new DateData()
      this.deletions = new DateData()
      this.codeLines = new DateData()
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