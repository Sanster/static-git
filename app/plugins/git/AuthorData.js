import moment from 'moment'

export default class AuthorData {
  constructor (author) {
    this.name = author.name()
    this.email = author.email()
    this.commits_count = 0
    this.total_additions = 0
    this.total_deletions = 0
    this.first_commit_time = new Date(2030, 1, 1)
    this.last_commit_time = new Date(2005, 1, 1)
    this.dates = []
    this.activeDays = []
    this.commitsCountByDay = {}
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
