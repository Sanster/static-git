<template>
  <div class='month-commits'>
    <div class='canvas-container card'>
      <div class='canvas-container-content'>
        <canvas id='month-commits-canvas'></canvas>
      </div>
    </div>
    <author-list :options="authorListOptions"></author-list>
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
      monthData: [],
      selectedYear: '2016',
      selectedMonth: 5,
      authorListFields: [
        {
          label: 'Name',
          key: 'name'
        },
        {
          label: 'Commits',
          key: 'commits'
        },
        {
          label: 'Line ++',
          key: 'additions'
        },
        {
          label: 'Line --',
          key: 'deletions'
        },
        {
          label: 'Active Days',
          key: 'activeDay'
        }
      ],
    }
  },
  components: {
    'author-list': AuthorList
  },
  computed: {
    authorsData () {
      return this.options.authorsData
    },
    authorListOptions () {
      const startDate = new Date(this.selectedYear, this.selectedMonth)
      const endDate = new Date(this.selectedYear, this.selectedMonth + 1)
      return {
        fields: this.authorListFields,
        data: this.authorListData(startDate, endDate),
        perPage: 10
      }
    }
  },
  methods: {
    authorListData (startDate, endDate) {
      return _.map(this.$git.authorsDataDuringDate(startDate, endDate), (item) => {
        return {
          name: item.name,
          commits: item.commitsCount.totalDuringDate(startDate, endDate),
          additions: item.additions.totalDuringDate(startDate, endDate),
          deletions: item.deletions.totalDuringDate(startDate, endDate),
          activeDay: item.commitsCount.validDayCount()
        }
      })
    },
    barClick (event, data) {
      if (data.length !== 0) {
        this.selectedMonth = data[0]._index
      }
    },
  },
  mounted () {
    var ctx = document.getElementById('month-commits-canvas')

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Commits',
          data: this.$git.repoData.commitsCount.countByMonth()[this.selectedYear],
          backgroundColor: 'rgba(255, 149, 40, 0.79)'
        }]
      },
      options: {
        maintainAspectRatio: false,
        onClick: this.barClick,
        title: {
          display: false
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
.month-commits {
  width: 100%;
}
</style>