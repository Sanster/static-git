<template>
  <div class='code-lines card'>
    <div class="card-header">
      <h3 class='card-title'>Code Lines</h3>
    </div>
    <div class='canvas-container'>
      <div class='canvas-container-content'>
        <canvas id='code-lines-canvas'></canvas>
      </div>
    </div
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
    repoData () {
      return this.options.repoData
    },
    codeLines () {
      return this.repoData.codeLines
    }
  },
  methods: {
    lineChartData () {
      let lines = this.codeLines.totalBeforeDate(new Date(this.selectedYear, 0))
      let res =  this.codeLines.countByMonth()[this.selectedYear]

      res = _.transform(res, (result, n) => {
        lines += n
        return result.push(lines)
      }, [])

      return res
    }
  },
  mounted () {
    var ctx = document.getElementById('code-lines-canvas')
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Lines',
          data: this.lineChartData(),
          backgroundColor: 'rgba(255, 149, 40, 0.7)',
          borderColor: '#ff9528',
        }]
      },
      options: {
        maintainAspectRatio: false,
        title: {
          display: false
        },
        legend: {
          display: false
        },
        scales: {
          gridLines: {
            display: false
          },
          yAxes: [{
            ticks: {
              stepSize: 50000
            }
          }]
        }
      }
    })
  }
}

</script>

<style lang="sass">
.code-lines {
  width: 100%;
}
</style>