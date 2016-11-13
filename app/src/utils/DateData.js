export default class DateData {
  constructor (data = null) {
    if (data) {
      this._data = data._data
      this.total = data.total
    } else {
      this._data = {}
      this.total = 0
    }
  }

  increaseByDate (date, num = 1) {
    const [year, month, day] = this._getDate(date)

    this.increase(year, month, day, num)
  }

  increase (year, month, day, num = 1) {
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

  dayCount (year, month, day) {
    return this._data[year][month][day]
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

  totalDuringDate (startDate, endDate) {
    const [startYear, startMonth, startDay] = this._getDate(startDate)
    const [endYear, endMonth, endDay] = this._getDate(endDate)

    let count = 0

    _.forEach(this._data, (value, year) => {
      if (year < startYear) {
        return
      } else if (year == startYear) {
        for(let month=startMonth; month<=endMonth; ++month) {
          if (month === startMonth) {
            for (let day=startDay; day<31; ++day) {
              count += this.dayCount(year, month, day)
            }
          } else if (month === endMonth) {
            for (let day=0; day<endDay; ++day) {
              count += this.dayCount(year, month, day)
            }
          }
          else {
            count += this.monthCount(year, month)
          }
        }
      } else if (year > startYear) {
        count += this.yearCount(year)
      }
    })

    return count
  }

  totalAfterDate (startDate) {
    const [startYear, startMonth, startDay] = this._getDate(startDate)
  }

  totalBeforeDate (endDate) {
    const [endYear, endMonth, endDay] = this._getDate(endDate)

  }

// return Array(12): [1,2,3,4,....,12]
  countByMonth () {
    const res = {}

    _.forEach(this._data, (value, year) => {
      res[year] = []
      _.times(12, (month) => {
         res[year].push(this.monthCount(year, month))
      })
    })

    return res
  }

  _getInitData () {
    let monthCount = []
    _.times(12, () => {
      monthCount.push(new Array(31).fill(0))
    })
    return monthCount
  }

  _getDate (date) {
    return [date.getFullYear(), date.getMonth(), date.getDate()]
  }
}