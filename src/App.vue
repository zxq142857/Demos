<template>
  <div id="app">
    <transition
      mode="out-in"
      :duration="300"
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <keep-alive :include=includedComponents :exclude=excludedComponents>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'app',
  computed: {
    ...mapState({
      includedComponents: state => state.includedComponents.join(','),
      excludedComponents: state => state.excludedComponents.join(',')
    })
  }
}
</script>

<style lang="less">
@import './assets/css/common.css';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
