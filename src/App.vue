<template>
  <div id="app">
    <transition
      mode="out-in"
      :duration="600"
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <router-view/>
    </transition>
  </div>
</template>

<style lang="less">
@import './assets/css/common.css';
* {
  margin: 0;
  padding: 0;
  // touch-action: pan-y;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
