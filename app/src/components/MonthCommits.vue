<template>
<div>
  <canvas id='month-commits' width='500' height='350'></canvas>
  <author-list :options="authorListOptions"></author-list>
</div>
</template>

<script>
import Chart from 'chart.js'
import AuthorList from 'components/AuthorList.vue'
import DateData from 'utils/DateData.js'

export default {
  props: [
    'options'
  ],
  data () {
    return {
      monthData: [],
      sortedData: [],
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
      console.log(this.$git.authorsDataDuringDate(startDate, endDate))
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
        this.sortedData = _.sortBy(this.authorsData, (authorData) => {
          return -authorData.getMonthCommitsCount(this.selectedYear, this.selectedMonth)
        })
      }
    },
  },
  mounted () {
    var ctx = document.getElementById('month-commits')

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Commits',
          data: this.$git.repoData.commitsCount.countByMonth()[this.selectedYear],
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