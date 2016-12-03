import moment from 'moment'
import DateData from './DateData.js'

export default class AuthorData {
  constructor (data) {
    if (data) {
      this.name = data.name
      this.email = data.email
      this.firstCommitTime = data.firstCommitTime
      this.lastCommitTime = data.lastCommitTime
      this.commitsCount = new DateData(data.commitsCount)
      this.additions = new DateData(data.additions)
      this.deletions = new DateData(data.deletions)
    } else {
      this.name = ''
      this.email = ''
      this.firstCommitTime = new Date(2030, 1, 1)
      this.lastCommitTime = new Date(2005, 1, 1)
      this.commitsCount = new DateData()
      this.additions = new DateData()
      this.deletions = new DateData()
    }
  }

  setAuthor (author) {
    this.name = author.name()
    this.email = author.email()
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
