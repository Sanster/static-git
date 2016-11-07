import moment from 'moment'

export default class AuthorData {
  constructor () {
    this.name = ''
    this.email = ''
    this.commits_count = 0
    this.total_additions = 0
    this.total_deletions = 0
    this.first_commit_time = new Date(2030, 1, 1)
    this.last_commit_time = new Date(2005, 1, 1)
    this.dates = []
    this.activeDays = []
    this.commitsCountByDay = {}
  }

  setAuthor (author) {
    this.name = author.name()
    this.email = author.email()
  }

  toStorage () {
    return {
      'name': this.name,
      'email': this.email,
      'commits_count': this.commits_count,
      'total_additions': this.total_additions,
      'total_deletions': this.total_deletions,
      'first_commit_time': this.first_commit_time,
      'last_commit_time': this.last_commit_time,
      'dates': this.dates,
      'activeDays': this.activeDays,
      'commitsCountByDay': this.commitsCountByDay
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

  getMonthCommitsCount (year, month) {
    if (this.commitsCountByDay.hasOwnProperty(year)) {
      return this.commitsCountByDay[year][month].count
    } else {
      return 0
    }

  }

  getYearCommitsCount (year) {
    return this.commitsCountByDay[year].count
  }

  saveCommitDate (commitDate) {
    if (this.first_commit_time > commitDate) {
      this.first_commit_time = commitDate
    }

    if (this.last_commit_time < commitDate) {
      this.last_commit_time = commitDate
    }

    const year = commitDate.getFullYear()
    const month = commitDate.getMonth()
    const day = commitDate.getDate()

    if (!this.commitsCountByDay.hasOwnProperty(year)) {
      this.commitsCountByDay[year] = this._getInitCommitsCount()
    }

    this.commitsCountByDay[year]['count'] += 1
    this.commitsCountByDay[year][month]['count'] += 1
    this.commitsCountByDay[year][month][day] += 1
  }

  _getInitCommitsCount () {
    const commitsCountByDay = { 'count': 0 }

    for (var month = 0; month < 12; ++month) {
      var dayCount = { 'count': 0 }
      for (var day = 0; day < 31; ++day) {
        dayCount[day] = 0
      }
      commitsCountByDay[month] = dayCount
    }

    return commitsCountByDay
  }
}
