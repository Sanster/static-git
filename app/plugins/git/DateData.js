export default class DateData {
  constructor () {
    this._data = {}
    this.total = 0
  }

  increase (date, num = 1) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    if (!this._data.hasOwnProperty(year)) {
      this._data[year] = this._getInitData()
    }

    this._data[year][month][day] += num
    this.total += num
  }

  validDayCount () {
    let count = 0;

    _.forEach(this._data, (year) => {
     count += _.chain(year)
              .flatten()
              .compact()
              .value().length;
    });

    return count
  }

  monthCount (year, month) {
    return _.reduce(this._data[year][month], (sum, n) => {
      return sum + n
    }, 0)
  }

  yearCount (year) {
    let month = -1

    return _.reduce(this._data[year], (sum, n) => {
      month += 1
      return sum + this.monthCount(year, month)
    }, 0)
  }

  _getInitData () {
    let monthCount = []
    _.times(12, () => {
      monthCount.push(new Array(31).fill(0))
    })
    return monthCount
  }
}