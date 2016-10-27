<template>
<div>
  <canvas id='month-commits' width='500' height='350'></canvas>
  <div>
    {{monthData[selectedMonth]}} Commits this month.
    <h3>Top 5</h3>
    <ul>
      <li v-for="n in 5">
        {{barChartData[n].name}}
        {{authorMonthCommitsCount(n)}} commits.
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import Chart from 'chart.js'

export default {
  props: [
    'barChartData'
  ],
  data () {
    return {
      monthData: [],
      selectedYear: '2016',
      selectedMonth: 0
    }
  },
  methods: {
    barClick (event, data) {
      if (data.length !== 0) {
        this.selectedMonth = data[0]._index
        this.barChartData.sort(this.sortByMonthCommits)
      }
    },
    calMonthData () {
      const data = {}
      const year = '2016'
      data[year] = new Array(12).fill(0)

      for (var i = 0, l = this.barChartData.length; i < l; ++i) {
        for (var month = 0; month < 12; ++month) {
          data[year][month] += this.barChartData[i].getMonthCommitsCount(year, month)
        }
      }
      this.monthData = data[year]
    },
    sortByMonthCommits (authorData1, authorData2) {
      const commitsCount1 = authorData1.getMonthCommitsCount(this.selectedYear, this.selectedMonth)
      const commitsCount2 = authorData2.getMonthCommitsCount(this.selectedYear, this.selectedMonth)

      if (commitsCount1 > commitsCount2) {
        return -1
      } else if (commitsCount1 < commitsCount2) {
        return 1
      }

      return 0
    },
    authorMonthCommitsCount (index) {
      return this.barChartData[index].getMonthCommitsCount(this.selectedYear, this.selectedMonth)
    }
  },
  mounted () {
    this.calMonthData()
    var ctx = document.getElementById('month-commits')

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Commits',
          data: this.monthData,
          backgroundColor: 'rgba(75, 192, 192, 0.8)'
          // borderColor: 'rgba(75, 192, 192, 0.2)',
        }]
      },
      options: {
        responsive: false,
        onClick: this.barClick,
        title: {
          display: true,
          text: 'Month commits'
        },
        legend: {
          display: false
        },
        scales: {
          gridLines: {
            display: false
          }
        }
      }
    })
  }
}

</script>

<style lang='sass'>

</style>