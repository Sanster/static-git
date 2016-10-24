<template>
<canvas id='month-commits' width='500' height='350'></canvas>
</template>

<script>
import Chart from 'chart.js'

export default {
  props: [
    'barChartData',
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
      console.log('sadfasdfasdf')
    }
  },
  mounted () {
    var ctx = document.getElementById('month-commits')

    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Commits',
          data: [12, 19, 3, 5, 2, 3, 34, 25, 9, 14, 11, 19],
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          // borderColor: 'rgba(75, 192, 192, 0.2)',
        }]
      },
      options: {
        responsive: false,
        onClick: this.barClick,
        title: {
          display: true,
          text: 'Month commits',
        },
        legend: {
          display: false,
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