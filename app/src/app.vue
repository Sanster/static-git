<template>
  <div class="container">
    <title-bar></title-bar>

    <empty-view v-if="!dataCollectDone && !isCollectingData"></empty-view>

    <load-view v-if="isCollectingData"> </load-view>

    <div class="content"
        v-if="dataCollectDone">
      <div class="content-detail">
          <author-list></author-list>
      </div>
    </div>
  </div>

</template>

<script>
import TitleBar from 'components/TitleBar.vue'
import EmptyView from 'layout/EmptyView.vue'
import AuthorList from 'components/AuthorList.vue'
import LoadView from 'components/LoadView.vue'
import { mapState } from 'vuex'

export default {
  data () {
    return {
    }
  },
  components: {
    'empty-view': EmptyView,
    'title-bar': TitleBar,
    'author-list': AuthorList,
    'load-view': LoadView
  },
  computed: {
    ...mapState([
      'dataCollectDone',
      'isCollectingData'
    ])
  }
}
</script>

<style lang="sass">
@import 'stylesheet/vars.scss';

body {
  margin: 0;
  background: black;
}

.container {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>