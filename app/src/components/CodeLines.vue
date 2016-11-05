<template>
  <div>
    <canvas id='code-lines' width='500' height='350'></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'

export default {
  props: [
    'options'
  ],
  data () {
    return {
      selectedYear: '2016',
    }
  },
  computed: {
    lineCount () {
      return this.options.lineCount
    }
  },
  methods: {
    lineChartData () {
      let sum = 0
      return _.transform(this.lineCount[this.selectedYear], (result, n) => {
        sum += n
        return result.push(sum)
      }, [])
    }
  },
  mounted () {
    var ctx = document.getElementById('code-lines')
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Lines',
          data: this.lineChartData(),
          backgroundColor: 'rgba(75, 192, 192, 0.8)'
          // borderColor: 'rgba(75, 192, 192, 0.2)',
        }]
      },
      options: {
        responsive: false,
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

<style lang="sass">
#code-lines {
    clear: both;
}
</style>