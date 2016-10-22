<template>
  <table>
    <thead>
      <tr>
        <th v-for="field in fields">
          {{field}}
        </th>
      </tr>
    </thead>
    <tbody v-cloak>
      <tr v-for="(item, index) in tableData">
        <td v-for="val in item">
          {{val}}
        </td>
      <tr>
    <tbody>
  </table>

</template>

<script>
export default {
  props: [
    'tableData',
    'fields',
  ],
  data () {
    return {
      activeIndex: 0,
    }
  },
}
</script>

<style lang="sass">

</style>