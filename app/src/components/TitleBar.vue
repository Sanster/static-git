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
  display: flex;
  justify-content: center;
  -webkit-app-region: drag;
}

.title-bar-msg {
    position: relative;
    top: 7px;
}
</style>