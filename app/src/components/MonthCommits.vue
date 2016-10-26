<template>
<canvas id='month-commits' width='500' height='350'></canvas>
</template>

<script>
import Chart from 'chart.js'

export default {
  props: [
    'barChartData'
  ],
  data () {
    return {
      downSort: true
    }
  },
  methods: {
    barClick (event, data) {
      console.log(event)
      console.log(data[0]._index)
    },
    monthData () {
      const data = {}
      const year = '2016'
      data[year] = new Array(12).fill(0)
      console.log(data)
      for (var i = 0, l = this.barChartData.length; i < l; ++i) {
        for (var j = 0; j < 12; ++j) {
          data[year][j] += this.barChartData[i].commitsCountByDay[year][j].count
        }
      }
      return data[year]
    }
  },
  mounted () {
    var ctx = document.getElementById('month-commits')

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Commits',
          data: this.monthData(),
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