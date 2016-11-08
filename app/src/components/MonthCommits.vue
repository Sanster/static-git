<template>
<div>
  <canvas id='month-commits' width='500' height='350'></canvas>
  <div id='month-commits-sum'>
    {{monthCommitsCount}} Commits this month.
    <h3>Top 5</h3>
    <ul>
      <li v-for="n in 5">
        {{sortedData[n].name}}
        {{authorMonthCommitsCount(n)}} commits.
      </li>
    </ul>
  </div>
  <author-list :options="options"></author-list>
</div>
</template>

<script>
import Chart from 'chart.js'
import AuthorList from 'components/AuthorList.vue'

export default {
  props: [
    'options'
  ],
  data () {
    return {
      yearData: {},
      monthData: [],
      sortedData: [],
      selectedYear: '2016',
      selectedMonth: 0
    }
  },
  created () {
    this.sortedData = this.authorsData
    this.calYearData()
  },
  components: {
    'author-list': AuthorList
  },
  computed: {
    monthCommitsCount () {
      return this.yearData[this.selectedYear][this.selectedMonth]
    },
    authorsData () {
      return this.options.authorsData
    }
  },
  methods: {
    barClick (event, data) {
      if (data.length !== 0) {
        this.selectedMonth = data[0]._index
        this.sortedData = _.sortBy(this.authorsData, (authorData) => {
          return -authorData.getMonthCommitsCount(this.selectedYear, this.selectedMonth)
        })
      }
    },
    calYearData () {
      const data = {}
      const year = '2016'
      data[year] = new Array(12).fill(0)

      for (var i = 0, l = this.authorsData.length; i < l; ++i) {
        for (var month = 0; month < 12; ++month) {
          data[year][month] += this.authorsData[i].getMonthCommitsCount(year, month)
        }
      }
      this.yearData[year] = data[year]
    },
    authorMonthCommitsCount (index) {
      return this.sortedData[index].getMonthCommitsCount(this.selectedYear, this.selectedMonth)
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
          data: this.yearData[this.selectedYear],
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

<style lang="sass">
#month-commits {
  float: left;
}

#month-commits-sum {
  float: left;
}
</style>