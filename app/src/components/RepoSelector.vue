<template>
<div id="repo-selector"
     :class="optionsVisible ? 'open' : 'close'">
  <a href="#"
     class="vselect-dropdown__input"
     @click="toggleDropdown">
    <span>Add a repository</span>
    <i class="fa fa-caret-down"></i>
  </a>
  <ul class="vselect-dropdown__list"
      v-show="optionsVisible">
    <li class="vselect-dropdown__item"
        v-for="option in options">
      {{option}}
    </li>
  </ul>
</div>
</template>

<script>
export default {
  data () {
    return {
      optionsVisible: false,
      options: [1,2,3,4]
    }
  },
  methods: {
    toggleDropdown () {
      this.optionsVisible = !this.optionsVisible
    }
  }
}
</script>

<style lang="sass">
@import '../stylesheet/vars.scss';

#repo-selector {
  height: 48px;
  line-height: 48px;
  text-align: center;
  box-shadow: 1px 2px 2px rgb(35, 29, 29);

  .open {
    background: $black;
  }

  .close {
    background: $light-black;
  }

  .fa-caret-down {
    color: $white;
    margin-left: 4px;
  }

  .fa-folder {
    margin-right: 4px;
  }

  .fa-caret-down, fa-folder {
    position: relative;
    top: 2px;
  }

  a {
    color: $white;
  }
}

.vselect-dropdown__list {
  position: absolute;
}

.vselect-dropdown__input {
  line-height: 38px;
  font-size: 20px;
}
</style>