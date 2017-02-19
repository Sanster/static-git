<template>
    <div class="title-bar">
        <span class="title-bar-msg">{{title}}</span>
    </div>
</template>

<script>
export default {
  data () {
    return {
      title: ''
    }
  },
  methods: {
  }
}
</script>

<style lang="sass">
@import '../stylesheet/vars.scss';

.title-bar {
  height: $titleBar-height;
  background: white;
  -webkit-app-region: drag;
  position: fixed;
  z-index: 999;
  width: 100%;
}

.title-bar-msg {
    position: relative;
    top: 7px;
}
</style>