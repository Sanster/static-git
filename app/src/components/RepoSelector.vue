<template>
<div id="repo-selector"
     :class="[{open: optionsVisible}, {close: !optionsVisible}]"
     v-on-clickaway="hideOptions">
  <a href="#"
     class="selector-dropdown__input"
     @click="toggleDropdown"
     :onfocusout="hideOptions">
    <span>Add a repository</span>
    <i class="fa fa-caret-right"></i>
  </a>
  <ul class="selector-dropdown__list"
      v-show="optionsVisible">
    <li class="selector-dropdown__item"
        v-for="option in options">
      <a href="#">{{option}}</a>
    </li>
    <li id="add-repo"
        @click="addRepoClicked">
      <i class="fa fa-folder-open-o"></i>
      Add repository
    </li>
  </ul>
</div>
</template>

<script>
import electron from 'electron'
const ipc = electron.ipcRenderer
import VueClickaway from 'vue-clickaway'

export default {
  data () {
    return {
      optionsVisible: false,
      options: ['gitlab','vuejs','static-git']
    }
  },
  mixins: [VueClickaway.mixin],
  mounted () {
    ipc.on('selected-directory', this.addRepo)
  },
  methods: {
    toggleDropdown () {
      this.optionsVisible = !this.optionsVisible
    },
    addRepoClicked () {
      ipc.send('open-file-dialog')
    },
    addRepo (event, path) {
      const name = _(path[0].split('/')).last()
      this.$git.isGitRepo(path[0])
        .then((repo) => {
          console.log(name)
        })
        .catch((error) => {
          ipc.send('open-info-dialog', "This is not a Git Repository.")
        })
    },
    hideOptions () {
      this.optionsVisible = false
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
  box-shadow: 0px 3px 5px -3px #231d1d;

  &.open {
    background: $black;
    .fa-caret-right {
      @include transform(rotate(180deg));
      @include transition(transform .3s);
    }
  }

  &.close {
    background: $light-black;
    .fa-caret-right {
      @include transform(rotate(0deg));
      @include transition(transform .3s);
    }
  }

  .fa-caret-right {
    position: relative;
    top: 2px;
    color: $white;
    margin-left: 4px;
  }

  a {
    color: $white;
  }
}

.selector-dropdown__list {
  position: absolute;
  border-right: 1px solid white;
  border-left: 1px solid #231d1d;
  list-style-type: none;
  left: 220px;
  width: 170px;
  top: 0px;
  margin: 0;
  padding: 0;

  li {
    cursor: pointer;
    background: $light-black;
  }

  #add-repo {
    border-top: 1px solid;
    font-size: 13px;
    color: $gray;
    font-style: italic;
  }
}

.selector-dropdown__input {
  line-height: 38px;
  font-size: 20px;
}
</style>