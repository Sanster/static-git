import moment from 'moment'
import DateData from './DateData.js'

export default class AuthorData {
  constructor () {
    this.name = ''
    this.email = ''
    this.firstCommitTime = new Date(2030, 1, 1)
    this.lastCommitTime = new Date(2005, 1, 1)
    this.commitsCount = new DateData()
    this.additions = new DateData()
    this.deletions = new DateData()
  }

  setAuthor (author) {
    this.name = author.name()
    this.email = author.email()
  }

  toStorage () {
    return {
      'name': this.name,
      'email': this.email,
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

  getActiveDays () {
    var keys = {}
    var result = []
    for (var i = 0, l = this.dates.length; i < l; ++i) {
      const date = moment(this.dates[i]).format('L')
      if (keys.hasOwnProperty(date)) {
        continue
      }
      result.push(date)
      keys[date] = 1
    }
    return result
  }

  saveCommitDate (commitDate) {
    if (this.firstCommitTime > commitDate) {
      this.firstCommitTime = commitDate
    }

    if (this.lastCommitTime < commitDate) {
      this.lastCommitTime = commitDate
    }

    this.commitsCount.increase(commitDate)
  }
}
