<template>
<div>
  <canvas id='month-commits' width='500' height='350'></canvas>
  <div>
    {{monthData[selectedMonth]}} Commits this month.
    <h3>Top 5</h3>
    <ul>
      <li v-for="n in 5">
        {{barChartData[n].name}}
        {{authorMonthCommitsCount(n)}} commits this month.
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
        this.barChartData.sort(this.sortByMonthCommits('2016', this.selectedMonth))
      }
    },
    calMonthData () {
      const data = {}
      const year = '2016'
      data[year] = new Array(12).fill(0)

      for (var i = 0, l = this.barChartData.length; i < l; ++i) {
        for (var j = 0; j < 12; ++j) {
          data[year][j] += this.barChartData[i].commitsCountByDay[year][j].count
        }
      }
      this.monthData = data[year]
    },
    sortByMonthCommits () {
    },
    authorMonthCommitsCount (index) {
      return this.barChartData[index].commitsCountByDay[this.selectedYear][this.selectedMonth].count
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